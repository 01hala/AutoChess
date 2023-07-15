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
                        UserUid = 0,
                    },
                    Coin = 0,
                    Strength = 100,
                    NormalChest = 0,
                    RareChest = 0,
                    EpicChest = 0,
                    LegendChest = 0,
                    RoleList = new(),
                    PropList = new(),
                    SkList = new(),
                    MsList = new()
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
                        UserUid = 0,
                    },
                    Coin = 0,
                    Strength = 0,
                    NormalChest = 0,
                    RareChest = 0,
                    EpicChest = 0,
                    LegendChest = 0,
                    RoleList = new(),
                    PropList = new(),
                    SkList = new(),
                    MsList = new()
                }
            };

            var user = data.GetValue("User").AsBsonDocument;
            info.info.User.UserName = user.GetValue("UserName").AsString;
            info.info.User.UserUid = user.GetValue("UserUid").AsInt32;

            info.info.Coin = data.GetValue("Coin").AsInt32;
            info.info.Strength = data.GetValue("Strength").AsInt32;
            info.info.NormalChest = data.GetValue("NormalChest").AsInt32;
            info.info.RareChest = data.GetValue("RareChest").AsInt32;
            info.info.EpicChest = data.GetValue("EpicChest").AsInt32;
            info.info.LegendChest = data.GetValue("LegendChest").AsInt32;

            foreach (var role in data.GetValue("RoleList").AsBsonArray)
            {
                var doc = role.AsBsonDocument;
                var _role = new Role();
                _role.RoleID = doc.GetValue("RoleID").AsInt32;
                _role.RoleName = doc.GetValue("RoleName").AsString;
                _role.IsLook = doc.GetValue("IsLook").AsBoolean;
                _role.Heath = (float)doc.GetValue("Heath").ToDouble();
                _role.AttNum = (float)doc.GetValue("AttNum").ToDouble();
                info.info.RoleList.Add(_role);
            }

            foreach (var prop in data.GetValue("PropList").AsBsonArray)
            {
                var doc = prop.AsBsonDocument;
                var _prop = new Prop();
                _prop.PropID = doc.GetValue("PropID").AsInt32;
                _prop.PropName = doc.GetValue("PropName").AsString;
                _prop.Count = doc.GetValue("Count").AsInt32;
                info.info.PropList.Add(_prop);
            }

            foreach (var skill in data.GetValue("SkList").AsBsonArray)
            {
                var doc = skill.AsBsonDocument;
                var _skill = new Skill();
                _skill.SkID = doc.GetValue("SkID").AsInt32;
                _skill.SkillName = doc.GetValue("SkillName").AsString;
                _skill.IsLook = doc.GetValue("IsLook").AsBoolean;
                info.info.SkList.Add(_skill);
            }

            foreach (var ms in data.GetValue("MsList").AsBsonArray)
            {
                var doc = ms.AsBsonDocument;
                var _ms = new Monster();
                _ms.MsId = doc.GetValue("MsId").AsInt32;
                _ms.MonsterName = doc.GetValue("MonsterName").AsString;
                _ms.IsLook = doc.GetValue("IsLook").AsBoolean;
                info.info.MsList.Add(_ms);
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
                roleList.Add(new BsonDocument
                {
                    { "RoleID", _role.RoleID },
                    { "RoleName", _role.RoleName },
                    { "IsLook", _role.IsLook },
                    { "Heath", _role.Heath },
                    { "AttNum", _role.AttNum }
                });
            }

            var propList = new BsonArray();
            foreach (var _prop in info.PropList)
            {
                propList.Add(new BsonDocument
                {
                    { "PropID", _prop.PropID },
                    { "PropName", _prop.PropName },
                    { "Count", _prop.Count }
                });
            }

            var skList = new BsonArray();
            foreach (var _sk in info.SkList)
            {
                skList.Add(new BsonDocument
                {
                    { "SkID", _sk.SkID },
                    { "SkillName", _sk.SkillName },
                    { "IsLook", _sk.IsLook }
                });
            }

            var msList = new BsonArray();
            foreach (var _ms in info.MsList)
            {
                msList.Add(new BsonDocument
                {
                    { "MsId", _ms.MsId },
                    { "MonsterName", _ms.MonsterName },
                    { "IsLook", _ms.IsLook }
                });
            }

            var doc = new BsonDocument
            {
                { "User", new BsonDocument { {"UserName", info.User.UserName}, { "UserUid", info.User.UserUid} } },
                { "Coin", info.Coin },
                { "Strength", info.Strength },
                { "NormalChest", info.NormalChest },
                { "RareChest", info.RareChest },
                { "EpicChest", info.EpicChest },
                { "LegendChest", info.LegendChest },
                { "RoleList",  roleList },
                { "PropList", propList },
                { "SkList", skList },
                { "MsList", msList },
                { "lastTickStrengthTime", lastTickStrengthTime }
            };
            return doc;
        }

        public void AddCoin(int _coin)
        {
            info.Coin += _coin;
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
        
        public int CostCoin(int cost_amount, EMCostCoinPath cost_path, int role_id)
        {
            if ((info.Coin - cost_amount) < 0)
            {
                return (int)em_error.no_enough_coin;
            }

            if (cost_path == EMCostCoinPath.BuyRole)
            {
                foreach (var role in info.RoleList)
                {
                    if (role.RoleID == role_id)
                    {
                        return (int)em_error.already_have_role;
                    }
                }
            }
            else if (cost_path == EMCostCoinPath.UpdateRole)
            {
                bool has_role = false;
                foreach (var role in info.RoleList)
                {
                    if (role.RoleID == role_id)
                    {
                        role.Heath += 100;
                        role.AttNum += 100;
                        has_role = true;
                        break;
                    }
                }
                if (!has_role)
                {
                    return (int)em_error.unlock_role;
                }
            }
            info.Coin -= cost_amount;

            return (int)em_error.success;
        }

        public int CostProp(int prop_id)
        {
            bool has_prop = false;
            foreach (var prop in info.PropList)
            {
                if (prop.PropID == prop_id)
                {
                    if (prop.Count > 0)
                    {
                        --prop.Count;
                        has_prop = true;
                    }
                    if (prop.Count <= 0)
                    {
                        info.PropList.Remove(prop);
                    }
                    break;
                }
            }
            if (!has_prop)
            {
                return (int)em_error.no_enough_prop;
            }
            return (int)em_error.success;
        }

        public int OpenChest(EMChestType chest_type)
        {
            switch (chest_type)
            {
                case EMChestType.Normal:
                {
                    if (info.NormalChest <= 0)
                    {
                        return (int)em_error.no_enough_chest;
                    }
                    --info.NormalChest;
                }
                break;

                case EMChestType.Rare:
                {
                    if (info.RareChest <= 0)
                    {
                        return (int)em_error.no_enough_chest;
                    }
                    --info.RareChest;
                }
                break;

                case EMChestType.Epic:
                {
                    if (info.EpicChest <= 0)
                    {
                        return (int)em_error.no_enough_chest;
                    }
                    --info.EpicChest;
                }
                break;

                case EMChestType.Legend:
                {
                    if (info.LegendChest <= 0)
                    {
                        return (int)em_error.no_enough_chest;
                    }
                    --info.LegendChest;
                }
                break;
            }

            return (int)em_error.success;
        }

        public void AddSkill(Skill skill)
        {
            foreach (var sk in info.SkList) 
            {
                if (sk.SkID == skill.SkID && sk.IsLook)
                {
                    return;
                }
            }
            info.SkList.Add(skill);
        }

        public void AddMonster(Monster monster)
        {
            foreach (var ms in info.MsList)
            {
                if (ms.MsId == monster.MsId && ms.IsLook)
                {
                    return;
                }
            }
            info.MsList.Add(monster);
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
            info.Data.info.User.UserUid = (int)_avatar.Guid;

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
