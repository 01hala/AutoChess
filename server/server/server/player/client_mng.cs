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
                wAchievData = new List<AchievementData>(),
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
                        achievData = new List<AchievementData>(),
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
                        achievData = new List<AchievementData>(),
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

        public AchievementData GetAchievementData(Achievement enumAchieve)
        {
            foreach(var a in info.Achiev.achievData)
            {
                if (a.emAchievement == enumAchieve)
                {
                    return a;
                }
            }

            var data = new AchievementData()
            {
                emAchievement = enumAchieve,
                status = AchievementAwardStatus.EMNotComplete,
                count = 0,
            };
            info.Achiev.achievData.Add(data);

            return data;
        }

        private bool CheckSuccessiveFiveVictory()
        {
            var data = GetAchievementData(Achievement.EMSuccessiveFiveVictory);
            if (data.status == AchievementAwardStatus.EMRecv)
            {
                return false;
            }

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
                data.status = AchievementAwardStatus.EMComplete;
            }

            return check;
        }

        private bool CheckFullLevelVictory(BattleInfo battleInfo)
        {
            var data = GetAchievementData(Achievement.EMFullLevelVictory);
            if (data.status == AchievementAwardStatus.EMRecv)
            {
                return false;
            }

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
                data.status = AchievementAwardStatus.EMComplete;
            }

            return check;
        }

        private bool CheckMachinistlVictory(BattleInfo battleInfo)
        {
            var data = GetAchievementData(Achievement.EMMachinistlVictory);
            if (data.status == AchievementAwardStatus.EMRecv)
            {
                return false;
            }

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
                data.status = AchievementAwardStatus.EMComplete;
            }

            return check;
        }

        private bool CheckFullAttributesVictory(BattleInfo battleInfo)
        {
            var data = GetAchievementData(Achievement.EMFullAttributesVictory);
            if (data.status == AchievementAwardStatus.EMRecv)
            {
                return false;
            }

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
                data.status = AchievementAwardStatus.EMComplete;
            }

            return check;
        }

        private bool CheckNoneEquipmentVictory(BattleInfo battleInfo)
        {
            var data = GetAchievementData(Achievement.EMNoneEquipmentVictory);
            if (data.status == AchievementAwardStatus.EMRecv)
            {
                return false;
            }

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
                data.status = AchievementAwardStatus.EMComplete;
            }

            return check;
        }

        public bool AddCheckAchievement(BattleInfo battleInfo)
        {
            info.Achiev.battleInfo.Add(battleInfo);

            bool check = false;
            if (CheckSuccessiveFiveVictory())
            {
                check = true;
            }
            if (CheckFullLevelVictory(battleInfo))
            {
                check = true;
            }
            if (battleInfo.isStreakVictory)
            {
                var data = GetAchievementData(Achievement.EMStreakVictory);
                if (data.status != AchievementAwardStatus.EMRecv)
                {
                    data.status = AchievementAwardStatus.EMComplete;
                    check = true;
                }
            }
            if (config.Config.TaskConfigs.TryGetValue(Enum.GetName(typeof(Achievement), Achievement.EMFiveHundredGame), out var task))
            {
                if (info.Achiev.battleInfo.Count >= task.Value)
                {
                    var data = GetAchievementData(Achievement.EMFiveHundredGame);
                    if (data.status != AchievementAwardStatus.EMRecv)
                    {
                        data.status = AchievementAwardStatus.EMComplete;
                        check = true;
                    }
                }
            }
            if (CheckMachinistlVictory(battleInfo))
            {
                check = true;
            }
            if (CheckFullAttributesVictory(battleInfo))
            {
                check = true;
            }
            if (CheckNoneEquipmentVictory(battleInfo))
            {
                check = true;
            }
            if (config.Config.TaskConfigs.TryGetValue(Enum.GetName(typeof(Achievement), Achievement.EMNotGivenAllYet), out var task1))
            {
                if (battleInfo.RoleList.Count < task1.Value)
                {
                    var data = GetAchievementData(Achievement.EMNotGivenAllYet);
                    if (data.status != AchievementAwardStatus.EMRecv)
                    {
                        data.status = AchievementAwardStatus.EMComplete;
                        check = true;
                    }
                }
            }

            return check;
        }

        public AchievementData GetWeekAchievementData(Achievement enumAchieve)
        {
            foreach (var a in info.wAchiev.wAchievData)
            {
                if (a.emAchievement == enumAchieve)
                {
                    return a;
                }
            }

            var data = new AchievementData()
            {
                emAchievement = enumAchieve,
                status = AchievementAwardStatus.EMNotComplete,
                count = 0,
            };
            info.wAchiev.wAchievData.Add(data);

            return data;
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

        public bool CheckKillRole(Role roleInfo)
        {
            RefreshWeekAchiev();

            var check = false;
            var a = GetWeekAchievementData(Achievement.EMWeekTotalAnnihilation);
            if (a.status != AchievementAwardStatus.EMRecv)
            {
                a.count++;
                if (config.Config.TaskConfigs.TryGetValue(Enum.GetName(typeof(Achievement), Achievement.EMWeekTotalAnnihilation), out var task))
                {
                    if (a.count >= task.Value)
                    {
                        check = true;
                    }
                }
            }

            switch (roleInfo.FettersSkillID.fetters_id)
            {
                case 9:
                    {
                        a = GetWeekAchievementData(Achievement.EMWeekWizardAnnihilation);
                        if (a.status != AchievementAwardStatus.EMRecv)
                        {
                            a.count++;
                            if (config.Config.TaskConfigs.TryGetValue(Enum.GetName(typeof(Achievement), Achievement.EMWeekWizardAnnihilation), out var task))
                            {
                                if (a.count >= task.Value)
                                {
                                    check = true;
                                }
                            }
                        }
                    }
                    break;

                case 2:
                    {
                        a = GetWeekAchievementData(Achievement.EMWeekBerserkerAnnihilation);
                        if (a.status != AchievementAwardStatus.EMRecv)
                        {
                            a.count++;
                            if (config.Config.TaskConfigs.TryGetValue(Enum.GetName(typeof(Achievement), Achievement.EMWeekBerserkerAnnihilation), out var task))
                            {
                                if (a.count >= task.Value)
                                {
                                    check = true;
                                }
                            }
                        }
                    }
                    break;

                case 3:
                    {
                        a = GetWeekAchievementData(Achievement.EMWeekCorsairAnnihilation);
                        if (a.status != AchievementAwardStatus.EMRecv)
                        {
                            if (config.Config.TaskConfigs.TryGetValue(Enum.GetName(typeof(Achievement), Achievement.EMWeekCorsairAnnihilation), out var task))
                            {
                                a.count++;
                                if (a.count >= task.Value)
                                {
                                    check = true;
                                }
                            }
                        }
                    }
                    break;
            }

            return check;
        }

        public bool CheckBuyRole(Role roleInfo)
        {
            RefreshWeekAchiev();

            var check = false;
            if (config.Config.SkillConfigs.TryGetValue(roleInfo.SkillID, out var skill))
            {
                if (skill.EffectTime == 3)
                {
                    var a = GetWeekAchievementData(Achievement.EMWeekBuyTenBeforeRound);
                    if (a.status != AchievementAwardStatus.EMRecv)
                    {
                        a.count++;
                        if (config.Config.TaskConfigs.TryGetValue(Enum.GetName(typeof(Achievement), Achievement.EMWeekBuyTenBeforeRound), out var task))
                        {
                            if (a.count >= task.Value)
                            {
                                check = true;
                            }
                        }
                    }
                }
                else if (skill.EffectTime == 18)
                {
                    var a = GetWeekAchievementData(Achievement.EMWeekBuyBeHurted);
                    if (a.status != AchievementAwardStatus.EMRecv)
                    {
                        a.count++;
                        if (config.Config.TaskConfigs.TryGetValue(Enum.GetName(typeof(Achievement), Achievement.EMWeekBuyBeHurted), out var task))
                        {
                            if (a.count >= task.Value)
                            {
                                check = true;
                            }
                        }
                    }
                }
                else if (skill.EffectTime == 8)
                {
                    var a = GetWeekAchievementData(Achievement.EMWeekBuyBeDead);
                    if (a.status != AchievementAwardStatus.EMRecv)
                    {
                        a.count++;
                        if (config.Config.TaskConfigs.TryGetValue(Enum.GetName(typeof(Achievement), Achievement.EMWeekBuyBeDead), out var task))
                        {
                            if (a.count >= task.Value)
                            {
                                check = true;
                            }
                        }
                    }
                }
            }

            return check;
        }

        public bool CheckBuyEquip(int equipID)
        {
            RefreshWeekAchiev();

            var a = GetWeekAchievementData(Achievement.EMWeekBuyTenEquip);
            if (a.status != AchievementAwardStatus.EMRecv)
            {
                a.count++;
                if (config.Config.TaskConfigs.TryGetValue(Enum.GetName(typeof(Achievement), Achievement.EMWeekBuyTenEquip), out var task))
                {
                    if (a.count >= task.Value)
                    {
                        return true;
                    }
                }
            }

            return false;
        }

        public bool AddCheckWeekAchievement(BattleInfo battleInfo)
        {
            RefreshWeekAchiev();
            info.wAchiev.battleInfo.Add(battleInfo);

            var check = false;
            if (battleInfo.isVictory == BattleVictory.victory)
            {
                var a = GetWeekAchievementData(Achievement.EMWeekOneGameVictory);
                if (a.status != AchievementAwardStatus.EMRecv)
                {
                    a.status = AchievementAwardStatus.EMComplete;
                    check = true;
                }
            }
            if (CheckFullLevelRole(battleInfo))
            {
                var a = GetWeekAchievementData(Achievement.EMWeekOneFullLevelRole);
                if (a.status != AchievementAwardStatus.EMRecv)
                {
                    a.status = AchievementAwardStatus.EMComplete;
                    check = true;
                }
            }

            return check;
        }

        private void RefreshWeekAchiev()
        {
            if (info.wAchiev.timeout < Timerservice.Tick)
            {
                info.wAchiev = NewUserWeekAchievement();
            }
        }

        public bool CheckGetAchievementReward(Achievement achievement)
        {
            RefreshWeekAchiev();

            switch (achievement)
            {
                case Achievement.EMSuccessiveFiveVictory:
                case Achievement.EMFullLevelVictory:
                case Achievement.EMStreakVictory:
                case Achievement.EMFiveHundredGame:
                case Achievement.EMMachinistlVictory:
                case Achievement.EMPeakStrengthVictory:
                case Achievement.EMGold25:
                case Achievement.EMFullAttributesVictory:
                case Achievement.EMNoneEquipmentVictory:
                    {
                        var a = GetAchievementData(achievement);
                        if (a.status == AchievementAwardStatus.EMComplete)
                        {
                            a.status = AchievementAwardStatus.EMRecv;
                            return true;
                        }
                    }
                    break;

                case Achievement.EMWeekOneGameVictory:
                case Achievement.EMWeekOpenCardPack:
                case Achievement.EMWeekTotalAnnihilation:
                case Achievement.EMWeekWizardAnnihilation:
                case Achievement.EMWeekBerserkerAnnihilation:
                case Achievement.EMWeekCorsairAnnihilation:
                case Achievement.EMWeekBuyTenBeforeRound:
                case Achievement.EMWeekBuyBeHurted:
                case Achievement.EMWeekBuyBeDead:
                case Achievement.EMWeekBuyTenEquip:
                case Achievement.EMWeekOneFullLevelRole:
                    {
                        var a = GetWeekAchievementData(achievement);
                        if (a.status == AchievementAwardStatus.EMComplete)
                        {
                            a.status = AchievementAwardStatus.EMRecv;
                            return true;
                        }
                    }
                    break;
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
            if (_avatar != null)
            {
                return _avatar;
            }

            var uuid_key = RedisHelp.BuildPlayerSDKUUIDCacheKey(uuid);
            var sdk_uuid = await Player._redis_handle.GetStrData(uuid_key);
            if (string.IsNullOrEmpty(sdk_uuid))
            {
                return null;
            }

            await Player._redis_handle.Expire(uuid_key, RedisHelp.PlayerSvrInfoCacheTimeout);

            var gate_key = RedisHelp.BuildPlayerGateCacheKey(sdk_uuid);
            var gate_name = await Player._redis_handle.GetStrData(gate_key);
            await Player._redis_handle.Expire(gate_key, RedisHelp.PlayerSvrInfoCacheTimeout);

            _avatar = await avatarMgr.load_or_create(sdk_uuid, uuid);
            Hub.Hub._gates.client_seep(uuid, gate_name);

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
