using Abelkhan;
using avatar;
using Hub;
using MongoDB.Bson;
using OfflineMsg;
using Service;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Player
{
    public class LoginException : System.Exception
    {
        public string ErrorInfo;
        public LoginException(string err) : base(err)
        {
            ErrorInfo = err;
        }
    }

    public class GetPlayerException : System.Exception
    {
        public string ErrorInfo;
        public GetPlayerException(string err) : base(err)
        {
            ErrorInfo = err;
        }
    }

    public class GetGuidFromDBError : System.Exception
    {
        public string error;

        public GetGuidFromDBError(string err) : base(err)
        {
            error = err;
        }
    }

    public class PlayerInfo : IHostingData
    {
        public UserData info;
        public long lastTickStrengthTime;

        public static string Type()
        {
            return "player_info";
        }

        public static IHostingData Create()
        {
            return new PlayerInfo()
            {
                info = new UserData()
                {
                    User = new UserInformation()
                    {
                        UserName = string.Empty,
                        UserGuid = 0,
                    },
                    Strength = 100,
                    RoleList = new(),
                },
                lastTickStrengthTime = Timerservice.Tick
            };
        }

        public static IHostingData Load(BsonDocument data)
        {
            var info = new PlayerInfo()
            {
                info = new UserData()
                {
                    User = new UserInformation()
                    {
                        UserName = string.Empty,
                        UserGuid = 0,
                    },
                    Strength = 0,
                    RoleList = new(),
                }
            };

            var user = data.GetValue("User").AsBsonDocument;
            info.info.User.UserName = user.GetValue("UserName").AsString;
            info.info.User.UserGuid = user.GetValue("UserUid").AsInt64;

            info.info.Strength = data.GetValue("Strength").AsInt32;

            foreach (var role in data.GetValue("RoleList").AsBsonArray)
            {
                info.info.RoleList.Add(role.AsInt32);
            }

            if (data.Contains("lastTickStrengthTime"))
            {
                info.lastTickStrengthTime = data.GetValue("lastTickStrengthTime").AsInt64;
            }
            else
            {
                info.lastTickStrengthTime = Timerservice.Tick;
            }

            return info;
        }

        public BsonDocument Store()
        {
            var roleList = new BsonArray();
            foreach (var _role in info.RoleList)
            {
                roleList.Add(_role);
            }

            var doc = new BsonDocument
            {
                { "User", new BsonDocument { {"UserName", info.User.UserName}, { "UserUid", info.User.UserGuid} } },
                { "Strength", info.Strength },
                { "RoleList",  roleList },
                { "lastTickStrengthTime", lastTickStrengthTime }
            };
            return doc;
        }

        public void AddStrength(int _strength)
        {
            info.Strength += _strength;
        }

        public int CostStrength(int strength) 
        {
            if ((info.Strength - strength) < 0)
            {
                return (int)em_error.no_enough_strength;
            }
            info.Strength -= strength;
            return (int)em_error.success;
        }
        
        public bool CheckStrength()
        {
            if (info.Strength >= 100)
            {
                return false;
            }

            bool s_change = false;
            while (true)
            {
                if ((lastTickStrengthTime + 2 * 60 * 1000) > Timerservice.Tick)
                {
                    break;
                }

                lastTickStrengthTime += 2 * 60 * 1000;
                ++info.Strength;
                s_change = true;

                if (info.Strength >= 100)
                { 
                    lastTickStrengthTime = Timerservice.Tick;
                    break;
                }
            }

            return s_change;
        }
    }

    public static class AvatarExtensions
    {
        public static UserData PlayerInfo(this Avatar avatar)
        {
            var _data = avatar.get_real_hosting_data<PlayerInfo>();
            return _data.Data.info;
        }
    }

    public class client_mng
    {
        private readonly Dictionary<string, avatar.Avatar> client_token_dict = new ();

        private static readonly player_client_caller player_Client_Caller = new();
        public static player_client_caller PlayerClientCaller
        {
            get
            {
                return player_Client_Caller;
            }
        }

        private readonly AvatarMgr avatarMgr;

        public int Count
        {
            get
            {
                return avatarMgr.Count;
            }
        }

        public static async void forward_offline_msg(OfflineMsgMgr.offline_msg _offline_msg)
        {
            if (await Player.offline_Msg_Mng.send_offline_msg(_offline_msg))
            {
                var player_guid = long.Parse(_offline_msg.player_guid);
                var player_svr_key = RedisHelp.BuildPlayerGuidCacheKey(player_guid);
                string player_hub_name = await Player._redis_handle.GetStrData(player_svr_key);
                if (string.IsNullOrEmpty(player_hub_name))
                {
                    return;
                }
                if (player_hub_name != Hub.Hub.name)
                {
                    var player_proxy = Player.player_Proxy_Mng.get_player_proxy(player_hub_name);
                    player_proxy.player_have_offline_msg(player_guid);
                }
                else
                {
                    var target_role = Player.client_Mng.guid_get_client_proxy(player_guid);
                    if (target_role != null)
                    {
                        await Player.offline_Msg_Mng.process_offline_msg(_offline_msg.player_guid);
                    }
                }
            }
        }

        public client_mng()
        {
            avatarMgr = new();
            avatarMgr.init();
            avatarMgr.init_data_db_opt((opt) =>
            {
                opt.DBName = Constant.Constant.player_db_name;
                opt.DBCollection = Constant.Constant.player_db_collection;
                opt.GuidCollection = Constant.Constant.player_db_guid_collection;
                opt.StoreDelayTime = 10 * 60 * 1000;
            });
            avatarMgr.add_hosting<PlayerInfo>();

            bag.BagModdule.init(30, avatarMgr);
        }

        public async Task<string> token_player_login(string sdk_uuid, string anonymous_sdk_uuid = "")
        {
            var token = Guid.NewGuid().ToString();

            avatar.Avatar _avatar = null;
            if (!string.IsNullOrEmpty(anonymous_sdk_uuid))
            {
                _avatar = await avatarMgr.load_or_create(anonymous_sdk_uuid, "");
                if (!string.IsNullOrEmpty(sdk_uuid))
                {
                    if (!await _avatar.transfer(sdk_uuid))
                    {
                        Log.Log.err("_avatar.transfer faild anonymous_sdk_uuid:{0, }sdk_uuid:{1}", anonymous_sdk_uuid, sdk_uuid);
                    }
                }
            }
            else
            {
                _avatar = await avatarMgr.load_or_create(sdk_uuid, "");
            }
            _avatar.onDestory += () =>
            {
                var uuid_key = RedisHelp.BuildPlayerSDKUUIDCacheKey(_avatar.ClientUUID);
                Player._redis_handle.DelData(uuid_key);

                var player_key = RedisHelp.BuildPlayerSvrCacheKey(_avatar.SDKUUID);
                Player._redis_handle.DelData(player_key);

                var player_guid_key = RedisHelp.BuildPlayerGuidCacheKey(_avatar.Guid);
                Player._redis_handle.DelData(player_guid_key);

                var gate_key = RedisHelp.BuildPlayerGateCacheKey(_avatar.SDKUUID);
                Player._redis_handle.DelData(gate_key);
            };

            client_token_dict[token] = _avatar;

            return token;
        }

        public avatar.Avatar token_get_client_proxy(string uuid, string token)
        {
            if (!client_token_dict.Remove(token, out avatar.Avatar _avatar))
            {
                throw new LoginException($"invaild token:{token}");
            }
            _avatar.ClientUUID = uuid;

            var uuid_key = RedisHelp.BuildPlayerSDKUUIDCacheKey(uuid);
            Player._redis_handle.SetStrData(uuid_key, _avatar.SDKUUID);

            return _avatar;
        }

        public avatar.Avatar create_player(string uuid, string name, string nick_name)
        {
            var _avatar = avatarMgr.get_avatar(uuid);
            var info = _avatar.get_real_hosting_data<PlayerInfo>();
            info.Data.info.User.UserName = nick_name;
            info.Data.info.User.UserGuid = _avatar.Guid;

            return _avatar;
        }

        public async Task<Avatar> uuid_get_client_proxy(string uuid)
        {
            var _avatar = avatarMgr.get_avatar(uuid);
            if (_avatar == null)
            {
                var uuid_key = RedisHelp.BuildPlayerSDKUUIDCacheKey(uuid);
                var sdk_uuid = await Player._redis_handle.GetStrData(uuid_key);

                var gate_key = RedisHelp.BuildPlayerGateCacheKey(sdk_uuid);
                var gate_name = await Player._redis_handle.GetStrData(gate_key);


                _avatar = await avatarMgr.load_or_create(sdk_uuid, uuid);
                Hub.Hub._gates.client_seep(uuid, gate_name);
            }
            return _avatar;
        }

        public Avatar sdk_uuid_get_client_proxy(string sdk_uuid)
        {
            var _avatar = avatarMgr.get_target_avatar(sdk_uuid);
            return _avatar;
        }

        public Avatar guid_get_client_proxy(long guid)
        {
            var _avatar = avatarMgr.get_target_avatar(guid);
            return _avatar;
        }
    }
}
