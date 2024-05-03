using Abelkhan;
using avatar;
using bag;
using Hub;
using MongoDB.Bson;
using OfflineMsg;
using Service;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
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
        private UserData info;
        private int currentRolrGroup = 101;
        private long lastTickStrengthTime;

        public long PeakStrengthID = 0;

        public static string Type()
        {
            return "player_info";
        }

        private static UserWeekAchievement NewUserWeekAchievement()
        {
            return new UserWeekAchievement()
            {
                oneGameVictory = false,                   // 周成就 参与一次游戏并获得胜利
                totalAnnihilation = 0,                    // 周成就 消灭80个角色
                wizardAnnihilation = 0,                   // 周成就 使用巫师消灭100个角色
                berserkerAnnihilation = 0,                // 周成就 使用狂战士消灭100个角色
                corsairAnnihilation = 0,                  // 周成就 使用海盗消灭100个角色
                buyBeforeRoundSkill = 0,                  // 周成就 购买十位效果在“回合开始前”触发的角色
                buyBeHurtedSkill = 0,                     // 周成就 购买十位效果在“受伤时”触发的角色
                buyBeDeadSkill = 0,                       // 周成就 购买十位效果在“晕厥时”触发的角色
                buyTenEquip = 0,                          // 周成就 购买十件装备
                battleInfo = new List<BattleInfo>(),      // 周成就 战绩记录
                timeout = Timerservice.WeekEndTimetmp(),  // 周成就超时时间
            };
        }

        public static IHostingData Create()
        {
            var RoleGroup = new List<RoleGroup>();
            var roleList = new List<int>();
            foreach (var cfg in config.Config.RoleConfigs.Values)
            {
                if (cfg.ActiveState == 1)
                {
                    roleList.Add(cfg.Id);
                }
            }

            RoleGroup.Add(new RoleGroup()
            {
                CardDeck = 101,
                RoleList = new List<int>(roleList),
            });

            return new PlayerInfo()
            {
                info = new UserData()
                {
                    User = new UserInformation()
                    {
                        UserName = string.Empty,
                        UserGuid = 0,
                    },
                    Achiev = new UserAchievement()
                    {
                        successiveFiveVictory = false,      // 连续5次胜利     
                        fullLevelVictory = false,           // 全员满级获得胜利
                        streakVictory = false,              // 10局连胜获得战斗胜利
                        fiveHundredGame = false,            // 500次游戏
                        machinistlVictory = false,          // 全员机械师获得胜利
                        PeakStrengthVictory = false,        // 巅峰挑战冠军
                        Gold25 = false,                     // 成就 开局25枚金币
                        fullAttributesVictory = false,      // 全员满属性获得胜利
                        noneEquipmentVictory = false,       // 全员无装备获得胜利
                        battleInfo = new List<BattleInfo>(),// 战绩记录
                    },
                    wAchiev = NewUserWeekAchievement(),
                    Strength = 100,
                    gold = 100,
                    diamond = 10,
                    score = 0,
                    bag = new Abelkhan.Bag() { ItemList = new() },
                    RoleList = new List<int>(roleList),
                    roleGroup = RoleGroup,
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
                    Achiev = new UserAchievement()
                    {
                        successiveFiveVictory = false,      // 连续5次胜利     
                        fullLevelVictory = false,           // 全员满级获得胜利
                        streakVictory = false,              // 10局连胜获得战斗胜利
                        fiveHundredGame = false,            // 500次游戏
                        machinistlVictory = false,          // 全员机械师获得胜利
                        PeakStrengthVictory = false,        // 巅峰挑战冠军
                        Gold25 = false,                     // 成就 开局25枚金币
                        fullAttributesVictory = false,      // 全员满属性获得胜利
                        noneEquipmentVictory = false,       // 全员无装备获得胜利
                        battleInfo = new List<BattleInfo>(),// 战绩记录
                    },
                    wAchiev = NewUserWeekAchievement(),
                    bag = new Abelkhan.Bag(),
                    Strength = 0,
                    gold = 0,
                    diamond = 0,
                    RoleList = new (),
                    roleGroup = new(),
                }
            };

            var user = data.GetValue("User").AsBsonDocument;
            info.info.User = MongoDB.Bson.Serialization.BsonSerializer.Deserialize<UserInformation>(user);

            if (data.Contains("Achiev"))
            {
                var achiev = data.GetValue("Achiev").AsBsonDocument;
                info.info.Achiev = MongoDB.Bson.Serialization.BsonSerializer.Deserialize<UserAchievement>(achiev);
            }

            if (data.Contains("wAchiev"))
            {
                var wAchiev = data.GetValue("wAchiev").AsBsonDocument;
                info.info.wAchiev = MongoDB.Bson.Serialization.BsonSerializer.Deserialize<UserWeekAchievement>(wAchiev);
            }

            info.info.Strength = data.GetValue("Strength").AsInt32;

            foreach (var role in data.GetValue("RoleList").AsBsonArray)
            {
                info.info.RoleList.Add(role.AsInt32);
            }

            foreach (var group in data.GetValue("RoleGroup").AsBsonArray)
            {
                var CardDeck = group.AsBsonDocument.GetValue("CardDeck").AsInt32;
                var RoleList = group.AsBsonDocument.GetValue("RoleList").AsBsonArray;

                var roleGroup = new RoleGroup()
                {
                    CardDeck = CardDeck,
                    RoleList = new List<int>(),
                };

                foreach (var role in RoleList)
                {
                    roleGroup.RoleList.Add(role.AsInt32);
                }

                info.info.roleGroup.Add(roleGroup);
            }

            var itemList = new List<RoleCardInfo>();
            foreach (var item in data.GetValue("bag").AsBsonArray)
            {
                var roleID = item.AsBsonDocument.GetValue("roleID").AsInt32;
                var Number = item.AsBsonDocument.GetValue("Number").AsInt32;
                var isTatter = item.AsBsonDocument.GetValue("isTatter").AsBoolean;

                itemList.Add(new RoleCardInfo() { 
                    roleID= roleID,
                    Number = Number,
                    isTatter = isTatter
                });
            }
            info.info.bag.ItemList = itemList;

            if (data.Contains("gold"))
            {
                info.info.gold = data.GetValue("gold").AsInt32;
            }
            else
            {
                info.info.gold = 100;
            }

            if (data.Contains("diamond"))
            {
                info.info.diamond = data.GetValue("diamond").AsInt32;
            }
            else
            {
                info.info.diamond = 10;
            }

            if (data.Contains("lastTickStrengthTime"))
            {
                info.lastTickStrengthTime = data.GetValue("lastTickStrengthTime").AsInt64;
            }
            else
            {
                info.lastTickStrengthTime = Timerservice.Tick;
            }

            if (data.Contains("currentRolrGroup"))
            {
                info.currentRolrGroup = data.GetValue("currentRolrGroup").AsInt32;
            }
            else
            {
                info.currentRolrGroup = info.info.roleGroup[0].CardDeck;
            }

            if (data.Contains("peakStrengthID"))
            {
                info.PeakStrengthID = data.GetValue("peakStrengthID").AsInt64;
            }

            return info;
        }

        public BsonDocument Store()
        {
            var roleList = new BsonArray();
            foreach(var id in info.RoleList)
            {
                roleList.Add(id);
            }

            var roleGroup = new BsonArray();
            foreach (var _group in info.roleGroup)
            {
                var _roleList = new BsonArray();
                foreach (var _role in _group.RoleList)
                {
                    _roleList.Add(_role);
                }

                var _RoleGroup = new BsonDocument()
                {
                    { "CardDeck", _group.CardDeck },
                    { "RoleList", _roleList },
                };

                roleGroup.Add(_RoleGroup);
            }

            var itemList = new BsonArray();
            foreach (var item in info.bag.ItemList)
            {
                var i = new BsonDocument { { "roleID", item.roleID }, { "Number", item.Number }, { "isTatter", item.isTatter } };
                itemList.Add(i);
            }

            var doc = new BsonDocument
            {
                { "User", info.User.ToBsonDocument() },
                { "Achiev", info.Achiev.ToBsonDocument() },
                { "wAchiev", info.wAchiev.ToBsonDocument() },
                { "Strength", info.Strength },
                { "gold", info.gold },
                { "diamond", info.diamond },
                { "RoleList", roleList },
                { "RoleGroup",  roleGroup },
                { "bag", itemList },
                { "lastTickStrengthTime", lastTickStrengthTime },
                { "currentRolrGroup", currentRolrGroup },
                { "peakStrengthID", PeakStrengthID }
            };
            return doc;
        }

        public UserData Info()
        {
            return info;
        }

        public List<int> BattleRoleGroup()
        {
            foreach(var roleGroup in info.roleGroup)
            {
                if (roleGroup.CardDeck == currentRolrGroup)
                {
                    return roleGroup.RoleList;
                }
            }

            return null;
        }

        private void AddCardItem(RoleCardInfo infoCard)
        {
            if (infoCard.isTatter)
            {
                foreach (var i in info.bag.ItemList)
                {
                    if (i.roleID == infoCard.roleID)
                    {
                        i.Number += infoCard.Number;
                        return;
                    }
                }
            }

            if (!info.RoleList.Contains(infoCard.roleID))
            {
                info.RoleList.Add(infoCard.roleID);
            }
            else
            {
                info.bag.ItemList.Add(infoCard);
            }
        }

        public Tuple<em_error, CardPacket> BuyCardPacket()
        {
            if (info.gold <= 1)
            {
                return Tuple.Create(em_error.no_enough_coin, (CardPacket)null);
            }
            info.gold -= 1;

            var packet = new CardPacket();
            for(int i = 0; i < 5; i++)
            {
                var grade = RandomHelper.RandomInt(3) + 1;
                var isTatter = RandomHelper.RandomInt(100) < 1;

                var gradeGroup = config.Config.RoleGradeConfigs[grade];
                var cfg = gradeGroup[RandomHelper.RandomInt(gradeGroup.Count)];

                var infoCard = new RoleCardInfo()
                {
                    roleID = cfg.Id,
                    isTatter = isTatter,
                    Number = 1
                };

                packet.ItemList.Add(infoCard);
                AddCardItem(infoCard);
            }

            return Tuple.Create(em_error.success, packet);
        }

        public em_error BuyCardMerge(int _roleID)
        {
            foreach (var i in info.bag.ItemList)
            {
                if (i.roleID == _roleID)
                {
                    if (i.Number >= 8)
                    {
                        i.Number -= 8;

                        if (i.Number <= 0)
                        {
                            info.bag.ItemList.Remove(i);
                        }

                        var infoCard = new RoleCardInfo()
                        {
                            roleID = _roleID,
                            isTatter = false,
                            Number = 1
                        };
                        AddCardItem(infoCard);

                        return em_error.success;
                    }
                }
            }

            return em_error.no_enough_card;
        }

        public em_error EditRoleGroup(RoleGroup _group)
        {
            foreach(var id in _group.RoleList)
            {
                if (!info.RoleList.Contains(id))
                {
                    return em_error.no_exist_role_card;
                }
            }

            foreach(var _g in info.roleGroup)
            {
                if (_g.CardDeck == _group.CardDeck)
                {
                    _g.RoleList = _group.RoleList;
                    return em_error.success;
                }
            }

            info.roleGroup.Add(_group);
            return em_error.success;
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

        private bool CheckSuccessiveFiveVictory()
        {
            var check = true;
            for(int i = info.Achiev.battleInfo.Count - 1; i < 0 && i < (info.Achiev.battleInfo.Count - 5); --i)
            {
                var battleInfo = info.Achiev.battleInfo[i];
                if (battleInfo.mod == BattleMod.Battle)
                {
                    if (battleInfo.isVictory != BattleVictory.victory)
                    {
                        check = false; 
                        break;
                    }
                }
            }

            if (check)
            {
                info.Achiev.successiveFiveVictory = true;
            }

            return check;
        }

        private bool CheckFullLevelVictory(BattleInfo battleInfo)
        {
            var check = true;

            foreach(var r in battleInfo.RoleList)
            {
                if (r.Level < 3)
                {
                    check = false;
                    break;
                }
            }

            if (check)
            {
                info.Achiev.fullLevelVictory = true;
            }

            return check;
        }

        private bool CheckMachinistlVictory(BattleInfo battleInfo)
        {
            var check = true;

            foreach (var r in battleInfo.RoleList)
            {
                if (r.FettersSkillID.fetters_id != 6)
                {
                    check = false;
                    break;
                }
            }

            if (check)
            {
                info.Achiev.machinistlVictory = true;
            }

            return check;
        }

        private bool CheckFullAttributesVictory(BattleInfo battleInfo)
        {
            var check = true;

            foreach (var r in battleInfo.RoleList)
            {
                if (r.Attack >= 50 && r.HP >= 50)
                {
                    check = false;
                    break;
                }
            }

            if (check)
            {
                info.Achiev.fullAttributesVictory = true;
            }

            return check;
        }

        private bool CheckNoneEquipmentVictory(BattleInfo battleInfo)
        {
            var check = true;

            foreach (var r in battleInfo.RoleList)
            {
                if (r.equipID != 0)
                {
                    check = false;
                    break;
                }
            }

            if (check)
            {
                info.Achiev.noneEquipmentVictory = true;
            }

            return check;
        }

        public void AddCheckAchievement(string uuid, BattleInfo battleInfo)
        {
            info.Achiev.battleInfo.Add(battleInfo);

            if (!info.Achiev.successiveFiveVictory)
            {
                if (CheckSuccessiveFiveVictory())
                {
                    client_mng.PlayerClientCaller.get_client(uuid).achievement_complete(Achievement.EMSuccessiveFiveVictory);
                }
            }
            if (!info.Achiev.fullLevelVictory)
            {
                if (CheckFullLevelVictory(battleInfo))
                {
                    client_mng.PlayerClientCaller.get_client(uuid).achievement_complete(Achievement.EMFullLevelVictory);
                }
            }
            if (!info.Achiev.streakVictory)
            {
                if (battleInfo.isStreakVictory)
                {
                    info.Achiev.streakVictory = true;
                    client_mng.PlayerClientCaller.get_client(uuid).achievement_complete(Achievement.EMStreakVictory);
                }
            }
            if (!info.Achiev.fiveHundredGame)
            {
                if (info.Achiev.battleInfo.Count >= 500)
                {
                    info.Achiev.fiveHundredGame = true;
                    client_mng.PlayerClientCaller.get_client(uuid).achievement_complete(Achievement.EMFiveHundredGame);
                }
            }
            if (!info.Achiev.machinistlVictory)
            {
                if (CheckMachinistlVictory(battleInfo))
                {
                    client_mng.PlayerClientCaller.get_client(uuid).achievement_complete(Achievement.EMMachinistlVictory);
                }
            }
            if (!info.Achiev.fullAttributesVictory)
            {
                if (CheckFullAttributesVictory(battleInfo))
                {
                    client_mng.PlayerClientCaller.get_client(uuid).achievement_complete(Achievement.EMFullAttributesVictory);
                }
            }
            if (!info.Achiev.noneEquipmentVictory)
            {
                if (CheckNoneEquipmentVictory(battleInfo))
                {
                    client_mng.PlayerClientCaller.get_client(uuid).achievement_complete(Achievement.EMNoneEquipmentVictory);
                }
            }
            if (!info.Achiev.notGivenAllYet)
            {
                if (battleInfo.RoleList.Count < 6)
                {
                    info.Achiev.notGivenAllYet = true;
                    client_mng.PlayerClientCaller.get_client(uuid).achievement_complete(Achievement.EMNotGivenAllYet);
                }
            } 
        }

        private bool CheckFullLevelRole(BattleInfo battleInfo)
        {
            foreach (var role in battleInfo.RoleList)
            {
                if (role.Level >= 3)
                {
                    return true;
                }
            }

            return false;
        }

        public void CheckKillRole(string uuid, Role roleInfo)
        {
            info.wAchiev.totalAnnihilation++;
            if (info.wAchiev.totalAnnihilation >= 80)
            {
                client_mng.PlayerClientCaller.get_client(uuid).achievement_complete(Achievement.EMWeekTotalAnnihilation);
            }

            switch (roleInfo.FettersSkillID.fetters_id)
            {
                case 9:
                    {
                        info.wAchiev.wizardAnnihilation++;
                        if (info.wAchiev.wizardAnnihilation >= 100)
                        {
                            client_mng.PlayerClientCaller.get_client(uuid).achievement_complete(Achievement.EMWeekWizardAnnihilation);
                        }
                    }
                    break;

                case 2:
                    {
                        info.wAchiev.berserkerAnnihilation++;
                        if (info.wAchiev.berserkerAnnihilation >= 100)
                        {
                            client_mng.PlayerClientCaller.get_client(uuid).achievement_complete(Achievement.EMWeekBerserkerAnnihilation);
                        }
                    }
                    break;

                case 3:
                    {
                        info.wAchiev.corsairAnnihilation++;
                        if (info.wAchiev.corsairAnnihilation >= 100)
                        {
                            client_mng.PlayerClientCaller.get_client(uuid).achievement_complete(Achievement.EMWeekCorsairAnnihilation);
                        }
                    }
                    break;
            }
        }

        public void CheckBuyRole(string uuid, Role roleInfo)
        {

        }

        public void CheckBuyEquip(string uuid, int equipID)
        {
            info.wAchiev.buyTenEquip++;
            if (info.wAchiev.buyTenEquip >= 10)
            {
                client_mng.PlayerClientCaller.get_client(uuid).achievement_complete(Achievement.EMWeekBuyTenEquip);
            }
        }

        public void AddCheckWeekAchievement(string uuid, BattleInfo battleInfo)
        {
            RefreshWeekAchiev();
            info.wAchiev.battleInfo.Add(battleInfo);

            if (!info.wAchiev.oneGameVictory)
            {
                if (battleInfo.isVictory == BattleVictory.victory)
                {
                    info.wAchiev.oneGameVictory = true;
                    client_mng.PlayerClientCaller.get_client(uuid).achievement_complete(Achievement.EMWeekOneGameVictory);
                }
            }
            if (!info.wAchiev.oneFullLevelRole)
            {
                if (CheckFullLevelRole(battleInfo))
                {
                    info.wAchiev.oneFullLevelRole = true;
                    client_mng.PlayerClientCaller.get_client(uuid).achievement_complete(Achievement.EMWeekOneFullLevelRole);
                }
            }
        }

        private void RefreshWeekAchiev()
        {
            if (info.wAchiev.timeout < Timerservice.Tick)
            {
                info.wAchiev = NewUserWeekAchievement();
            }
        }

        public bool CheckAchievement(Achievement achievement)
        {
            RefreshWeekAchiev();

            switch (achievement)
            {
                case Achievement.EMSuccessiveFiveVictory:
                    return info.Achiev.successiveFiveVictory;
                case Achievement.EMFullLevelVictory:
                    return info.Achiev.fullLevelVictory;
                case Achievement.EMStreakVictory:
                    return info.Achiev.streakVictory;
                case Achievement.EMFiveHundredGame:
                    return info.Achiev.fiveHundredGame;
                case Achievement.EMMachinistlVictory:
                    return info.Achiev.machinistlVictory;
                case Achievement.EMPeakStrengthVictory:
                    return info.Achiev.PeakStrengthVictory;
                case Achievement.EMGold25:
                    return info.Achiev.Gold25;
                case Achievement.EMFullAttributesVictory:
                    return info.Achiev.fullAttributesVictory;
                case Achievement.EMNoneEquipmentVictory:
                    return info.Achiev.noneEquipmentVictory;

                case Achievement.EMWeekOneGameVictory:
                    return info.wAchiev.oneGameVictory;
                case Achievement.EMWeekOpenCardPack:
                    return info.wAchiev.openCardPack;
                case Achievement.EMWeekTotalAnnihilation:
                    return info.wAchiev.totalAnnihilation >= 80;
                case Achievement.EMWeekWizardAnnihilation:
                    return info.wAchiev.wizardAnnihilation >= 100;
                case Achievement.EMWeekBerserkerAnnihilation:
                    return info.wAchiev.berserkerAnnihilation >= 100;
                case Achievement.EMWeekCorsairAnnihilation:
                    return info.wAchiev.corsairAnnihilation >= 100;
                case Achievement.EMWeekBuyTenBeforeRound:
                    return info.wAchiev.buyBeforeRoundSkill >= 10;
                case Achievement.EMWeekBuyBeHurted:
                    return info.wAchiev.buyBeHurtedSkill >= 10;
                case Achievement.EMWeekBuyBeDead:
                    return info.wAchiev.buyBeDeadSkill >= 10;
                case Achievement.EMWeekBuyTenEquip:
                    return info.wAchiev.buyTenEquip >= 10;
                case Achievement.EMWeekOneFullLevelRole:
                    return info.wAchiev.oneFullLevelRole;
            }

            return false;
        }
    }

    public static class AvatarExtensions
    {
        public static PlayerInfo PlayerInfo(this Avatar avatar)
        {
            var _data = avatar.get_real_hosting_data<PlayerInfo>();
            return _data.Data;
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

            var player_svr_key = RedisHelp.BuildPlayerGuidCacheKey(_avatar.Guid);
            await Player._redis_handle.SetStrData(player_svr_key, Hub.Hub.name, RedisHelp.PlayerSvrInfoCacheTimeout);

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
            Player._redis_handle.SetStrData(uuid_key, _avatar.SDKUUID, RedisHelp.PlayerSvrInfoCacheTimeout);

            return _avatar;
        }

        public avatar.Avatar create_player(string uuid, string name, string nick_name, string avatar)
        {
            var _avatar = avatarMgr.get_avatar(uuid);
            var info = _avatar.get_real_hosting_data<PlayerInfo>();
            info.Data.Info().User.UserName = nick_name;
            info.Data.Info().User.UserGuid = _avatar.Guid;
            info.Data.Info().User.Avatar = avatar;

            return _avatar;
        }

        public async Task<Avatar> uuid_get_client_proxy(string uuid)
        {
            var _avatar = avatarMgr.get_avatar(uuid);
            if (_avatar == null)
            {
                var uuid_key = RedisHelp.BuildPlayerSDKUUIDCacheKey(uuid);
                var sdk_uuid = await Player._redis_handle.GetStrData(uuid_key);
                await Player._redis_handle.Expire(uuid_key, RedisHelp.PlayerSvrInfoCacheTimeout);

                var gate_key = RedisHelp.BuildPlayerGateCacheKey(sdk_uuid);
                var gate_name = await Player._redis_handle.GetStrData(gate_key);
                await Player._redis_handle.Expire(gate_key, RedisHelp.PlayerSvrInfoCacheTimeout);

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
