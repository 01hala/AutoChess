using System;
using System.Collections;
using System.Collections.Generic;
using System.Threading;
using MsgPack.Serialization;

namespace Abelkhan
{
/*this enum code is codegen by abelkhan codegen for c#*/

    public enum BattleVictory{
        faild = -1,
        tie = 0,
        victory = 1
    }
    public enum BattleMod{
        Battle = 1,
        PeakStrength = 2
    }
    public enum Achievement{
        EMSuccessiveFiveVictory = 1,
        EMFullLevelVictory = 2,
        EMStreakVictory = 3,
        EMFiveHundredGame = 4,
        EMMachinistlVictory = 5,
        EMPeakStrengthVictory = 6,
        EMGold25 = 7,
        EMFullAttributesVictory = 8,
        EMNoneEquipmentVictory = 9,
        EMWeekFiveVictory = 101,
        EMWeekOneGame = 102,
        EMWeekWizardVictory = 103,
        EMWeekBerserkerVictory = 104,
        EMWeekCorsairVictory = 105
    }
    public enum Priority{
        Low = 1,
        Normal = 2,
        Hight = 3
    }
    public enum Direction{
        None = 0,
        Forward = 1,
        Back = 2,
        Rigiht = 3,
        Left = 4,
        Self = 5,
        Cross = 6
    }
    public enum BufferAndEquipEffect{
        AddHP = 1,
        AddAttack = 2,
        AddBuffer = 3,
        Syncope = 4
    }
    public enum EffectScope{
        SingleBattle = 1,
        WholeGame = 2
    }
    public enum EMSkillEvent{
        start_round = 1,
        end_round = 2,
        start_battle = 3,
        buy = 4,
        sales = 5,
        camp_sales = 6,
        update = 7,
        syncope = 8,
        camp_syncope = 9,
        strengthen = 10,
        use_skill = 11,
        eat_food = 12,
        camp_eat_food = 13,
        kill = 14,
        front_attack = 15,
        camp_attack3 = 16,
        front_attack3 = 17,
        be_hurt = 18,
        camp_be_hurt = 19,
        enemy_summon = 20,
        camp_summon = 21,
        front_be_hurt = 22,
        before_attack = 23,
        all_mechanic_syncope = 24
    }
    public enum SkillEffectEM{
        AddProperty = 1,
        RecoverHP = 2,
        RemoteAttack = 3,
        SummonBattle = 4,
        AddCoin = 5,
        ExchangeProperty = 6,
        GainShield = 7,
        RefreshShop = 8,
        ChangePosition = 9,
        AddEquipment = 10,
        ReductionHurt = 11,
        UpdateLevel = 12,
        SummonShop = 13,
        AddBuffer = 14,
        AddBuildValue = 15,
        AttackAll = 16
    }
    public enum ShopIndex{
        Role = 0,
        Prop = 1
    }
/*this struct code is codegen by abelkhan codegen for c#*/
    public class UserInformation
    {
        public string UserName;
        public Int64 UserGuid;
        public string Avatar;
        public static MsgPack.MessagePackObjectDictionary UserInformation_to_protcol(UserInformation _struct){
        if (_struct == null) {
            return null;
        }

            var _protocol = new MsgPack.MessagePackObjectDictionary();
            _protocol.Add("UserName", _struct.UserName);
            _protocol.Add("UserGuid", _struct.UserGuid);
            _protocol.Add("Avatar", _struct.Avatar);
            return _protocol;
        }
        public static UserInformation protcol_to_UserInformation(MsgPack.MessagePackObjectDictionary _protocol){
        if (_protocol == null) {
            return null;
        }

            var _struct07924b8f_25bc_32a4_b436_da6af6116572 = new UserInformation();
            foreach (var i in _protocol){
                if (((MsgPack.MessagePackObject)i.Key).AsString() == "UserName"){
                    _struct07924b8f_25bc_32a4_b436_da6af6116572.UserName = ((MsgPack.MessagePackObject)i.Value).AsString();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "UserGuid"){
                    _struct07924b8f_25bc_32a4_b436_da6af6116572.UserGuid = ((MsgPack.MessagePackObject)i.Value).AsInt64();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "Avatar"){
                    _struct07924b8f_25bc_32a4_b436_da6af6116572.Avatar = ((MsgPack.MessagePackObject)i.Value).AsString();
                }
            }
            return _struct07924b8f_25bc_32a4_b436_da6af6116572;
        }
    }

    public class RoleCardInfo
    {
        public Int32 roleID;
        public bool isTatter;
        public Int32 Number;
        public static MsgPack.MessagePackObjectDictionary RoleCardInfo_to_protcol(RoleCardInfo _struct){
        if (_struct == null) {
            return null;
        }

            var _protocol = new MsgPack.MessagePackObjectDictionary();
            _protocol.Add("roleID", _struct.roleID);
            _protocol.Add("isTatter", _struct.isTatter);
            _protocol.Add("Number", _struct.Number);
            return _protocol;
        }
        public static RoleCardInfo protcol_to_RoleCardInfo(MsgPack.MessagePackObjectDictionary _protocol){
        if (_protocol == null) {
            return null;
        }

            var _struct9b5d9e88_7bbe_3017_8694_d1d46da4038b = new RoleCardInfo();
            foreach (var i in _protocol){
                if (((MsgPack.MessagePackObject)i.Key).AsString() == "roleID"){
                    _struct9b5d9e88_7bbe_3017_8694_d1d46da4038b.roleID = ((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "isTatter"){
                    _struct9b5d9e88_7bbe_3017_8694_d1d46da4038b.isTatter = ((MsgPack.MessagePackObject)i.Value).AsBoolean();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "Number"){
                    _struct9b5d9e88_7bbe_3017_8694_d1d46da4038b.Number = ((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
            }
            return _struct9b5d9e88_7bbe_3017_8694_d1d46da4038b;
        }
    }

    public class Bag
    {
        public List<RoleCardInfo> ItemList;
        public static MsgPack.MessagePackObjectDictionary Bag_to_protcol(Bag _struct){
        if (_struct == null) {
            return null;
        }

            var _protocol = new MsgPack.MessagePackObjectDictionary();
            if (_struct.ItemList != null) {
                var _array_ItemList = new List<MsgPack.MessagePackObject>();
                foreach(var v_ in _struct.ItemList){
                    _array_ItemList.Add( new MsgPack.MessagePackObject(RoleCardInfo.RoleCardInfo_to_protcol(v_)));
                }
                _protocol.Add("ItemList", new MsgPack.MessagePackObject(_array_ItemList));
            }
            return _protocol;
        }
        public static Bag protcol_to_Bag(MsgPack.MessagePackObjectDictionary _protocol){
        if (_protocol == null) {
            return null;
        }

            var _struct23cf1144_5c0a_3d4a_aa2d_962de72b2fc1 = new Bag();
            foreach (var i in _protocol){
                if (((MsgPack.MessagePackObject)i.Key).AsString() == "ItemList"){
                    _struct23cf1144_5c0a_3d4a_aa2d_962de72b2fc1.ItemList = new List<RoleCardInfo>();
                    var _protocol_array = ((MsgPack.MessagePackObject)i.Value).AsList();
                    foreach (var v_ in _protocol_array){
                        _struct23cf1144_5c0a_3d4a_aa2d_962de72b2fc1.ItemList.Add(RoleCardInfo.protcol_to_RoleCardInfo(((MsgPack.MessagePackObject)v_).AsDictionary()));
                    }
                }
            }
            return _struct23cf1144_5c0a_3d4a_aa2d_962de72b2fc1;
        }
    }

    public class RoleGroup
    {
        public Int32 CardDeck;
        public List<Int32> RoleList;
        public static MsgPack.MessagePackObjectDictionary RoleGroup_to_protcol(RoleGroup _struct){
        if (_struct == null) {
            return null;
        }

            var _protocol = new MsgPack.MessagePackObjectDictionary();
            _protocol.Add("CardDeck", _struct.CardDeck);
            if (_struct.RoleList != null) {
                var _array_RoleList = new List<MsgPack.MessagePackObject>();
                foreach(var v_ in _struct.RoleList){
                    _array_RoleList.Add(v_);
                }
                _protocol.Add("RoleList", new MsgPack.MessagePackObject(_array_RoleList));
            }
            return _protocol;
        }
        public static RoleGroup protcol_to_RoleGroup(MsgPack.MessagePackObjectDictionary _protocol){
        if (_protocol == null) {
            return null;
        }

            var _struct04eefd6b_dfea_3615_a69b_58efca74ef74 = new RoleGroup();
            foreach (var i in _protocol){
                if (((MsgPack.MessagePackObject)i.Key).AsString() == "CardDeck"){
                    _struct04eefd6b_dfea_3615_a69b_58efca74ef74.CardDeck = ((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "RoleList"){
                    _struct04eefd6b_dfea_3615_a69b_58efca74ef74.RoleList = new List<Int32>();
                    var _protocol_array = ((MsgPack.MessagePackObject)i.Value).AsList();
                    foreach (var v_ in _protocol_array){
                        _struct04eefd6b_dfea_3615_a69b_58efca74ef74.RoleList.Add(((MsgPack.MessagePackObject)v_).AsInt32());
                    }
                }
            }
            return _struct04eefd6b_dfea_3615_a69b_58efca74ef74;
        }
    }

    public class BattleInfo
    {
        public BattleMod mod;
        public bool isVictory;
        public bool isStreakVictory;
        public List<Role> RoleList;
        public static MsgPack.MessagePackObjectDictionary BattleInfo_to_protcol(BattleInfo _struct){
        if (_struct == null) {
            return null;
        }

            var _protocol = new MsgPack.MessagePackObjectDictionary();
            _protocol.Add("mod", (Int32)_struct.mod);
            _protocol.Add("isVictory", _struct.isVictory);
            _protocol.Add("isStreakVictory", _struct.isStreakVictory);
            if (_struct.RoleList != null) {
                var _array_RoleList = new List<MsgPack.MessagePackObject>();
                foreach(var v_ in _struct.RoleList){
                    _array_RoleList.Add( new MsgPack.MessagePackObject(Role.Role_to_protcol(v_)));
                }
                _protocol.Add("RoleList", new MsgPack.MessagePackObject(_array_RoleList));
            }
            return _protocol;
        }
        public static BattleInfo protcol_to_BattleInfo(MsgPack.MessagePackObjectDictionary _protocol){
        if (_protocol == null) {
            return null;
        }

            var _structb4ac1209_8551_3ba2_8c73_61bf7f7cb72f = new BattleInfo();
            foreach (var i in _protocol){
                if (((MsgPack.MessagePackObject)i.Key).AsString() == "mod"){
                    _structb4ac1209_8551_3ba2_8c73_61bf7f7cb72f.mod = (BattleMod)((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "isVictory"){
                    _structb4ac1209_8551_3ba2_8c73_61bf7f7cb72f.isVictory = ((MsgPack.MessagePackObject)i.Value).AsBoolean();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "isStreakVictory"){
                    _structb4ac1209_8551_3ba2_8c73_61bf7f7cb72f.isStreakVictory = ((MsgPack.MessagePackObject)i.Value).AsBoolean();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "RoleList"){
                    _structb4ac1209_8551_3ba2_8c73_61bf7f7cb72f.RoleList = new List<Role>();
                    var _protocol_array = ((MsgPack.MessagePackObject)i.Value).AsList();
                    foreach (var v_ in _protocol_array){
                        _structb4ac1209_8551_3ba2_8c73_61bf7f7cb72f.RoleList.Add(Role.protcol_to_Role(((MsgPack.MessagePackObject)v_).AsDictionary()));
                    }
                }
            }
            return _structb4ac1209_8551_3ba2_8c73_61bf7f7cb72f;
        }
    }

    public class AchievementReward
    {
        public static MsgPack.MessagePackObjectDictionary AchievementReward_to_protcol(AchievementReward _struct){
        if (_struct == null) {
            return null;
        }

            var _protocol = new MsgPack.MessagePackObjectDictionary();
            return _protocol;
        }
        public static AchievementReward protcol_to_AchievementReward(MsgPack.MessagePackObjectDictionary _protocol){
        if (_protocol == null) {
            return null;
        }

            var _structd775bff9_9118_3a98_a8ac_67991eeb0a97 = new AchievementReward();
            foreach (var i in _protocol){
            }
            return _structd775bff9_9118_3a98_a8ac_67991eeb0a97;
        }
    }

    public class UserAchievement
    {
        public bool successiveFiveVictory;
        public bool fullLevelVictory;
        public bool streakVictory;
        public bool fiveHundredGame;
        public bool machinistlVictory;
        public bool PeakStrengthVictory;
        public bool Gold25;
        public bool fullAttributesVictory;
        public bool noneEquipmentVictory;
        public static MsgPack.MessagePackObjectDictionary UserAchievement_to_protcol(UserAchievement _struct){
        if (_struct == null) {
            return null;
        }

            var _protocol = new MsgPack.MessagePackObjectDictionary();
            _protocol.Add("successiveFiveVictory", _struct.successiveFiveVictory);
            _protocol.Add("fullLevelVictory", _struct.fullLevelVictory);
            _protocol.Add("streakVictory", _struct.streakVictory);
            _protocol.Add("fiveHundredGame", _struct.fiveHundredGame);
            _protocol.Add("machinistlVictory", _struct.machinistlVictory);
            _protocol.Add("PeakStrengthVictory", _struct.PeakStrengthVictory);
            _protocol.Add("Gold25", _struct.Gold25);
            _protocol.Add("fullAttributesVictory", _struct.fullAttributesVictory);
            _protocol.Add("noneEquipmentVictory", _struct.noneEquipmentVictory);
            return _protocol;
        }
        public static UserAchievement protcol_to_UserAchievement(MsgPack.MessagePackObjectDictionary _protocol){
        if (_protocol == null) {
            return null;
        }

            var _struct320a61f6_1974_35df_b00f_ef6fd1348b63 = new UserAchievement();
            foreach (var i in _protocol){
                if (((MsgPack.MessagePackObject)i.Key).AsString() == "successiveFiveVictory"){
                    _struct320a61f6_1974_35df_b00f_ef6fd1348b63.successiveFiveVictory = ((MsgPack.MessagePackObject)i.Value).AsBoolean();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "fullLevelVictory"){
                    _struct320a61f6_1974_35df_b00f_ef6fd1348b63.fullLevelVictory = ((MsgPack.MessagePackObject)i.Value).AsBoolean();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "streakVictory"){
                    _struct320a61f6_1974_35df_b00f_ef6fd1348b63.streakVictory = ((MsgPack.MessagePackObject)i.Value).AsBoolean();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "fiveHundredGame"){
                    _struct320a61f6_1974_35df_b00f_ef6fd1348b63.fiveHundredGame = ((MsgPack.MessagePackObject)i.Value).AsBoolean();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "machinistlVictory"){
                    _struct320a61f6_1974_35df_b00f_ef6fd1348b63.machinistlVictory = ((MsgPack.MessagePackObject)i.Value).AsBoolean();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "PeakStrengthVictory"){
                    _struct320a61f6_1974_35df_b00f_ef6fd1348b63.PeakStrengthVictory = ((MsgPack.MessagePackObject)i.Value).AsBoolean();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "Gold25"){
                    _struct320a61f6_1974_35df_b00f_ef6fd1348b63.Gold25 = ((MsgPack.MessagePackObject)i.Value).AsBoolean();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "fullAttributesVictory"){
                    _struct320a61f6_1974_35df_b00f_ef6fd1348b63.fullAttributesVictory = ((MsgPack.MessagePackObject)i.Value).AsBoolean();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "noneEquipmentVictory"){
                    _struct320a61f6_1974_35df_b00f_ef6fd1348b63.noneEquipmentVictory = ((MsgPack.MessagePackObject)i.Value).AsBoolean();
                }
            }
            return _struct320a61f6_1974_35df_b00f_ef6fd1348b63;
        }
    }

    public class UserWeekAchievement
    {
        public bool fiveVictory;
        public bool oneGame;
        public bool wizardVictory;
        public bool berserkerVictory;
        public bool corsairVictory;
        public Int64 timeout;
        public static MsgPack.MessagePackObjectDictionary UserWeekAchievement_to_protcol(UserWeekAchievement _struct){
        if (_struct == null) {
            return null;
        }

            var _protocol = new MsgPack.MessagePackObjectDictionary();
            _protocol.Add("fiveVictory", _struct.fiveVictory);
            _protocol.Add("oneGame", _struct.oneGame);
            _protocol.Add("wizardVictory", _struct.wizardVictory);
            _protocol.Add("berserkerVictory", _struct.berserkerVictory);
            _protocol.Add("corsairVictory", _struct.corsairVictory);
            _protocol.Add("timeout", _struct.timeout);
            return _protocol;
        }
        public static UserWeekAchievement protcol_to_UserWeekAchievement(MsgPack.MessagePackObjectDictionary _protocol){
        if (_protocol == null) {
            return null;
        }

            var _struct4294a96a_052b_34f0_967a_099171a3451d = new UserWeekAchievement();
            foreach (var i in _protocol){
                if (((MsgPack.MessagePackObject)i.Key).AsString() == "fiveVictory"){
                    _struct4294a96a_052b_34f0_967a_099171a3451d.fiveVictory = ((MsgPack.MessagePackObject)i.Value).AsBoolean();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "oneGame"){
                    _struct4294a96a_052b_34f0_967a_099171a3451d.oneGame = ((MsgPack.MessagePackObject)i.Value).AsBoolean();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "wizardVictory"){
                    _struct4294a96a_052b_34f0_967a_099171a3451d.wizardVictory = ((MsgPack.MessagePackObject)i.Value).AsBoolean();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "berserkerVictory"){
                    _struct4294a96a_052b_34f0_967a_099171a3451d.berserkerVictory = ((MsgPack.MessagePackObject)i.Value).AsBoolean();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "corsairVictory"){
                    _struct4294a96a_052b_34f0_967a_099171a3451d.corsairVictory = ((MsgPack.MessagePackObject)i.Value).AsBoolean();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "timeout"){
                    _struct4294a96a_052b_34f0_967a_099171a3451d.timeout = ((MsgPack.MessagePackObject)i.Value).AsInt64();
                }
            }
            return _struct4294a96a_052b_34f0_967a_099171a3451d;
        }
    }

    public class UserData
    {
        public UserInformation User;
        public UserAchievement Achiev;
        public UserWeekAchievement wAchiev;
        public Int32 Strength;
        public Int32 gold;
        public Int32 diamond;
        public Int32 score;
        public List<BattleInfo> battleInfo;
        public Bag bag;
        public List<Int32> RoleList;
        public List<RoleGroup> roleGroup;
        public static MsgPack.MessagePackObjectDictionary UserData_to_protcol(UserData _struct){
        if (_struct == null) {
            return null;
        }

            var _protocol = new MsgPack.MessagePackObjectDictionary();
            _protocol.Add("User", new MsgPack.MessagePackObject(UserInformation.UserInformation_to_protcol(_struct.User)));
            _protocol.Add("Achiev", new MsgPack.MessagePackObject(UserAchievement.UserAchievement_to_protcol(_struct.Achiev)));
            _protocol.Add("wAchiev", new MsgPack.MessagePackObject(UserWeekAchievement.UserWeekAchievement_to_protcol(_struct.wAchiev)));
            _protocol.Add("Strength", _struct.Strength);
            _protocol.Add("gold", _struct.gold);
            _protocol.Add("diamond", _struct.diamond);
            _protocol.Add("score", _struct.score);
            if (_struct.battleInfo != null) {
                var _array_battleInfo = new List<MsgPack.MessagePackObject>();
                foreach(var v_ in _struct.battleInfo){
                    _array_battleInfo.Add( new MsgPack.MessagePackObject(BattleInfo.BattleInfo_to_protcol(v_)));
                }
                _protocol.Add("battleInfo", new MsgPack.MessagePackObject(_array_battleInfo));
            }
            _protocol.Add("bag", new MsgPack.MessagePackObject(Bag.Bag_to_protcol(_struct.bag)));
            if (_struct.RoleList != null) {
                var _array_RoleList = new List<MsgPack.MessagePackObject>();
                foreach(var v_ in _struct.RoleList){
                    _array_RoleList.Add(v_);
                }
                _protocol.Add("RoleList", new MsgPack.MessagePackObject(_array_RoleList));
            }
            if (_struct.roleGroup != null) {
                var _array_roleGroup = new List<MsgPack.MessagePackObject>();
                foreach(var v_ in _struct.roleGroup){
                    _array_roleGroup.Add( new MsgPack.MessagePackObject(RoleGroup.RoleGroup_to_protcol(v_)));
                }
                _protocol.Add("roleGroup", new MsgPack.MessagePackObject(_array_roleGroup));
            }
            return _protocol;
        }
        public static UserData protcol_to_UserData(MsgPack.MessagePackObjectDictionary _protocol){
        if (_protocol == null) {
            return null;
        }

            var _structc2d657c3_3c93_3c3c_b65f_adc45e6eed7b = new UserData();
            foreach (var i in _protocol){
                if (((MsgPack.MessagePackObject)i.Key).AsString() == "User"){
                    _structc2d657c3_3c93_3c3c_b65f_adc45e6eed7b.User = UserInformation.protcol_to_UserInformation(((MsgPack.MessagePackObject)i.Value).AsDictionary());
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "Achiev"){
                    _structc2d657c3_3c93_3c3c_b65f_adc45e6eed7b.Achiev = UserAchievement.protcol_to_UserAchievement(((MsgPack.MessagePackObject)i.Value).AsDictionary());
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "wAchiev"){
                    _structc2d657c3_3c93_3c3c_b65f_adc45e6eed7b.wAchiev = UserWeekAchievement.protcol_to_UserWeekAchievement(((MsgPack.MessagePackObject)i.Value).AsDictionary());
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "Strength"){
                    _structc2d657c3_3c93_3c3c_b65f_adc45e6eed7b.Strength = ((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "gold"){
                    _structc2d657c3_3c93_3c3c_b65f_adc45e6eed7b.gold = ((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "diamond"){
                    _structc2d657c3_3c93_3c3c_b65f_adc45e6eed7b.diamond = ((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "score"){
                    _structc2d657c3_3c93_3c3c_b65f_adc45e6eed7b.score = ((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "battleInfo"){
                    _structc2d657c3_3c93_3c3c_b65f_adc45e6eed7b.battleInfo = new List<BattleInfo>();
                    var _protocol_array = ((MsgPack.MessagePackObject)i.Value).AsList();
                    foreach (var v_ in _protocol_array){
                        _structc2d657c3_3c93_3c3c_b65f_adc45e6eed7b.battleInfo.Add(BattleInfo.protcol_to_BattleInfo(((MsgPack.MessagePackObject)v_).AsDictionary()));
                    }
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "bag"){
                    _structc2d657c3_3c93_3c3c_b65f_adc45e6eed7b.bag = Bag.protcol_to_Bag(((MsgPack.MessagePackObject)i.Value).AsDictionary());
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "RoleList"){
                    _structc2d657c3_3c93_3c3c_b65f_adc45e6eed7b.RoleList = new List<Int32>();
                    var _protocol_array = ((MsgPack.MessagePackObject)i.Value).AsList();
                    foreach (var v_ in _protocol_array){
                        _structc2d657c3_3c93_3c3c_b65f_adc45e6eed7b.RoleList.Add(((MsgPack.MessagePackObject)v_).AsInt32());
                    }
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "roleGroup"){
                    _structc2d657c3_3c93_3c3c_b65f_adc45e6eed7b.roleGroup = new List<RoleGroup>();
                    var _protocol_array = ((MsgPack.MessagePackObject)i.Value).AsList();
                    foreach (var v_ in _protocol_array){
                        _structc2d657c3_3c93_3c3c_b65f_adc45e6eed7b.roleGroup.Add(RoleGroup.protcol_to_RoleGroup(((MsgPack.MessagePackObject)v_).AsDictionary()));
                    }
                }
            }
            return _structc2d657c3_3c93_3c3c_b65f_adc45e6eed7b;
        }
    }

    public class Fetters
    {
        public Int32 fetters_id;
        public Int32 fetters_level;
        public Int32 number;
        public static MsgPack.MessagePackObjectDictionary Fetters_to_protcol(Fetters _struct){
        if (_struct == null) {
            return null;
        }

            var _protocol = new MsgPack.MessagePackObjectDictionary();
            _protocol.Add("fetters_id", _struct.fetters_id);
            _protocol.Add("fetters_level", _struct.fetters_level);
            _protocol.Add("number", _struct.number);
            return _protocol;
        }
        public static Fetters protcol_to_Fetters(MsgPack.MessagePackObjectDictionary _protocol){
        if (_protocol == null) {
            return null;
        }

            var _struct961e84f4_4c48_3c50_8e9a_4b4f3c786e74 = new Fetters();
            foreach (var i in _protocol){
                if (((MsgPack.MessagePackObject)i.Key).AsString() == "fetters_id"){
                    _struct961e84f4_4c48_3c50_8e9a_4b4f3c786e74.fetters_id = ((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "fetters_level"){
                    _struct961e84f4_4c48_3c50_8e9a_4b4f3c786e74.fetters_level = ((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "number"){
                    _struct961e84f4_4c48_3c50_8e9a_4b4f3c786e74.number = ((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
            }
            return _struct961e84f4_4c48_3c50_8e9a_4b4f3c786e74;
        }
    }

    public class Role
    {
        public Int32 RoleID;
        public Int32 BuyRound;
        public Int32 Level;
        public Int32 SkillID;
        public Fetters FettersSkillID;
        public Int32 equipID;
        public Int32 Number;
        public Int32 HP;
        public Int32 Attack;
        public Int32 TempHP;
        public Int32 TempAttack;
        public List<Int32> additionBuffer;
        public List<Int32> TempAdditionBuffer;
        public static MsgPack.MessagePackObjectDictionary Role_to_protcol(Role _struct){
        if (_struct == null) {
            return null;
        }

            var _protocol = new MsgPack.MessagePackObjectDictionary();
            _protocol.Add("RoleID", _struct.RoleID);
            _protocol.Add("BuyRound", _struct.BuyRound);
            _protocol.Add("Level", _struct.Level);
            _protocol.Add("SkillID", _struct.SkillID);
            _protocol.Add("FettersSkillID", new MsgPack.MessagePackObject(Fetters.Fetters_to_protcol(_struct.FettersSkillID)));
            _protocol.Add("equipID", _struct.equipID);
            _protocol.Add("Number", _struct.Number);
            _protocol.Add("HP", _struct.HP);
            _protocol.Add("Attack", _struct.Attack);
            _protocol.Add("TempHP", _struct.TempHP);
            _protocol.Add("TempAttack", _struct.TempAttack);
            if (_struct.additionBuffer != null) {
                var _array_additionBuffer = new List<MsgPack.MessagePackObject>();
                foreach(var v_ in _struct.additionBuffer){
                    _array_additionBuffer.Add(v_);
                }
                _protocol.Add("additionBuffer", new MsgPack.MessagePackObject(_array_additionBuffer));
            }
            if (_struct.TempAdditionBuffer != null) {
                var _array_TempAdditionBuffer = new List<MsgPack.MessagePackObject>();
                foreach(var v_ in _struct.TempAdditionBuffer){
                    _array_TempAdditionBuffer.Add(v_);
                }
                _protocol.Add("TempAdditionBuffer", new MsgPack.MessagePackObject(_array_TempAdditionBuffer));
            }
            return _protocol;
        }
        public static Role protcol_to_Role(MsgPack.MessagePackObjectDictionary _protocol){
        if (_protocol == null) {
            return null;
        }

            var _structe15dab07_4671_3806_9f26_9880fe20019d = new Role();
            foreach (var i in _protocol){
                if (((MsgPack.MessagePackObject)i.Key).AsString() == "RoleID"){
                    _structe15dab07_4671_3806_9f26_9880fe20019d.RoleID = ((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "BuyRound"){
                    _structe15dab07_4671_3806_9f26_9880fe20019d.BuyRound = ((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "Level"){
                    _structe15dab07_4671_3806_9f26_9880fe20019d.Level = ((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "SkillID"){
                    _structe15dab07_4671_3806_9f26_9880fe20019d.SkillID = ((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "FettersSkillID"){
                    _structe15dab07_4671_3806_9f26_9880fe20019d.FettersSkillID = Fetters.protcol_to_Fetters(((MsgPack.MessagePackObject)i.Value).AsDictionary());
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "equipID"){
                    _structe15dab07_4671_3806_9f26_9880fe20019d.equipID = ((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "Number"){
                    _structe15dab07_4671_3806_9f26_9880fe20019d.Number = ((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "HP"){
                    _structe15dab07_4671_3806_9f26_9880fe20019d.HP = ((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "Attack"){
                    _structe15dab07_4671_3806_9f26_9880fe20019d.Attack = ((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "TempHP"){
                    _structe15dab07_4671_3806_9f26_9880fe20019d.TempHP = ((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "TempAttack"){
                    _structe15dab07_4671_3806_9f26_9880fe20019d.TempAttack = ((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "additionBuffer"){
                    _structe15dab07_4671_3806_9f26_9880fe20019d.additionBuffer = new List<Int32>();
                    var _protocol_array = ((MsgPack.MessagePackObject)i.Value).AsList();
                    foreach (var v_ in _protocol_array){
                        _structe15dab07_4671_3806_9f26_9880fe20019d.additionBuffer.Add(((MsgPack.MessagePackObject)v_).AsInt32());
                    }
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "TempAdditionBuffer"){
                    _structe15dab07_4671_3806_9f26_9880fe20019d.TempAdditionBuffer = new List<Int32>();
                    var _protocol_array = ((MsgPack.MessagePackObject)i.Value).AsList();
                    foreach (var v_ in _protocol_array){
                        _structe15dab07_4671_3806_9f26_9880fe20019d.TempAdditionBuffer.Add(((MsgPack.MessagePackObject)v_).AsInt32());
                    }
                }
            }
            return _structe15dab07_4671_3806_9f26_9880fe20019d;
        }
    }

    public class UserBattleData
    {
        public UserInformation User;
        public Int32 coin;
        public Int32 round;
        public Int32 stage;
        public Int32 victory;
        public Int32 faild;
        public Int32 buildValue;
        public List<Fetters> FettersList;
        public List<Role> RoleList;
        public static MsgPack.MessagePackObjectDictionary UserBattleData_to_protcol(UserBattleData _struct){
        if (_struct == null) {
            return null;
        }

            var _protocol = new MsgPack.MessagePackObjectDictionary();
            _protocol.Add("User", new MsgPack.MessagePackObject(UserInformation.UserInformation_to_protcol(_struct.User)));
            _protocol.Add("coin", _struct.coin);
            _protocol.Add("round", _struct.round);
            _protocol.Add("stage", _struct.stage);
            _protocol.Add("victory", _struct.victory);
            _protocol.Add("faild", _struct.faild);
            _protocol.Add("buildValue", _struct.buildValue);
            if (_struct.FettersList != null) {
                var _array_FettersList = new List<MsgPack.MessagePackObject>();
                foreach(var v_ in _struct.FettersList){
                    _array_FettersList.Add( new MsgPack.MessagePackObject(Fetters.Fetters_to_protcol(v_)));
                }
                _protocol.Add("FettersList", new MsgPack.MessagePackObject(_array_FettersList));
            }
            if (_struct.RoleList != null) {
                var _array_RoleList = new List<MsgPack.MessagePackObject>();
                foreach(var v_ in _struct.RoleList){
                    _array_RoleList.Add( new MsgPack.MessagePackObject(Role.Role_to_protcol(v_)));
                }
                _protocol.Add("RoleList", new MsgPack.MessagePackObject(_array_RoleList));
            }
            return _protocol;
        }
        public static UserBattleData protcol_to_UserBattleData(MsgPack.MessagePackObjectDictionary _protocol){
        if (_protocol == null) {
            return null;
        }

            var _struct9f9f5aff_ccb2_34db_90eb_25dd29e28c9f = new UserBattleData();
            foreach (var i in _protocol){
                if (((MsgPack.MessagePackObject)i.Key).AsString() == "User"){
                    _struct9f9f5aff_ccb2_34db_90eb_25dd29e28c9f.User = UserInformation.protcol_to_UserInformation(((MsgPack.MessagePackObject)i.Value).AsDictionary());
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "coin"){
                    _struct9f9f5aff_ccb2_34db_90eb_25dd29e28c9f.coin = ((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "round"){
                    _struct9f9f5aff_ccb2_34db_90eb_25dd29e28c9f.round = ((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "stage"){
                    _struct9f9f5aff_ccb2_34db_90eb_25dd29e28c9f.stage = ((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "victory"){
                    _struct9f9f5aff_ccb2_34db_90eb_25dd29e28c9f.victory = ((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "faild"){
                    _struct9f9f5aff_ccb2_34db_90eb_25dd29e28c9f.faild = ((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "buildValue"){
                    _struct9f9f5aff_ccb2_34db_90eb_25dd29e28c9f.buildValue = ((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "FettersList"){
                    _struct9f9f5aff_ccb2_34db_90eb_25dd29e28c9f.FettersList = new List<Fetters>();
                    var _protocol_array = ((MsgPack.MessagePackObject)i.Value).AsList();
                    foreach (var v_ in _protocol_array){
                        _struct9f9f5aff_ccb2_34db_90eb_25dd29e28c9f.FettersList.Add(Fetters.protcol_to_Fetters(((MsgPack.MessagePackObject)v_).AsDictionary()));
                    }
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "RoleList"){
                    _struct9f9f5aff_ccb2_34db_90eb_25dd29e28c9f.RoleList = new List<Role>();
                    var _protocol_array = ((MsgPack.MessagePackObject)i.Value).AsList();
                    foreach (var v_ in _protocol_array){
                        _struct9f9f5aff_ccb2_34db_90eb_25dd29e28c9f.RoleList.Add(Role.protcol_to_Role(((MsgPack.MessagePackObject)v_).AsDictionary()));
                    }
                }
            }
            return _struct9f9f5aff_ccb2_34db_90eb_25dd29e28c9f;
        }
    }

    public class UserRankInfo
    {
        public Int32 score;
        public string nick_name;
        public string avatar;
        public UserBattleData battle_data;
        public static MsgPack.MessagePackObjectDictionary UserRankInfo_to_protcol(UserRankInfo _struct){
        if (_struct == null) {
            return null;
        }

            var _protocol = new MsgPack.MessagePackObjectDictionary();
            _protocol.Add("score", _struct.score);
            _protocol.Add("nick_name", _struct.nick_name);
            _protocol.Add("avatar", _struct.avatar);
            _protocol.Add("battle_data", new MsgPack.MessagePackObject(UserBattleData.UserBattleData_to_protcol(_struct.battle_data)));
            return _protocol;
        }
        public static UserRankInfo protcol_to_UserRankInfo(MsgPack.MessagePackObjectDictionary _protocol){
        if (_protocol == null) {
            return null;
        }

            var _struct5342f169_55fa_3f0d_ae72_aa40dab1348d = new UserRankInfo();
            foreach (var i in _protocol){
                if (((MsgPack.MessagePackObject)i.Key).AsString() == "score"){
                    _struct5342f169_55fa_3f0d_ae72_aa40dab1348d.score = ((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "nick_name"){
                    _struct5342f169_55fa_3f0d_ae72_aa40dab1348d.nick_name = ((MsgPack.MessagePackObject)i.Value).AsString();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "avatar"){
                    _struct5342f169_55fa_3f0d_ae72_aa40dab1348d.avatar = ((MsgPack.MessagePackObject)i.Value).AsString();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "battle_data"){
                    _struct5342f169_55fa_3f0d_ae72_aa40dab1348d.battle_data = UserBattleData.protcol_to_UserBattleData(((MsgPack.MessagePackObject)i.Value).AsDictionary());
                }
            }
            return _struct5342f169_55fa_3f0d_ae72_aa40dab1348d;
        }
    }

    public class ShopRole
    {
        public Int32 RoleID;
        public Int32 SkillID;
        public Int32 HP;
        public Int32 Attack;
        public bool IsFreeze;
        public static MsgPack.MessagePackObjectDictionary ShopRole_to_protcol(ShopRole _struct){
        if (_struct == null) {
            return null;
        }

            var _protocol = new MsgPack.MessagePackObjectDictionary();
            _protocol.Add("RoleID", _struct.RoleID);
            _protocol.Add("SkillID", _struct.SkillID);
            _protocol.Add("HP", _struct.HP);
            _protocol.Add("Attack", _struct.Attack);
            _protocol.Add("IsFreeze", _struct.IsFreeze);
            return _protocol;
        }
        public static ShopRole protcol_to_ShopRole(MsgPack.MessagePackObjectDictionary _protocol){
        if (_protocol == null) {
            return null;
        }

            var _structf3e63b72_4a28_3460_a200_49dfcc0ed2c2 = new ShopRole();
            foreach (var i in _protocol){
                if (((MsgPack.MessagePackObject)i.Key).AsString() == "RoleID"){
                    _structf3e63b72_4a28_3460_a200_49dfcc0ed2c2.RoleID = ((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "SkillID"){
                    _structf3e63b72_4a28_3460_a200_49dfcc0ed2c2.SkillID = ((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "HP"){
                    _structf3e63b72_4a28_3460_a200_49dfcc0ed2c2.HP = ((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "Attack"){
                    _structf3e63b72_4a28_3460_a200_49dfcc0ed2c2.Attack = ((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "IsFreeze"){
                    _structf3e63b72_4a28_3460_a200_49dfcc0ed2c2.IsFreeze = ((MsgPack.MessagePackObject)i.Value).AsBoolean();
                }
            }
            return _structf3e63b72_4a28_3460_a200_49dfcc0ed2c2;
        }
    }

    public class ShopProp
    {
        public Int32 PropID;
        public bool IsFreeze;
        public static MsgPack.MessagePackObjectDictionary ShopProp_to_protcol(ShopProp _struct){
        if (_struct == null) {
            return null;
        }

            var _protocol = new MsgPack.MessagePackObjectDictionary();
            _protocol.Add("PropID", _struct.PropID);
            _protocol.Add("IsFreeze", _struct.IsFreeze);
            return _protocol;
        }
        public static ShopProp protcol_to_ShopProp(MsgPack.MessagePackObjectDictionary _protocol){
        if (_protocol == null) {
            return null;
        }

            var _struct85ac80e5_1b8a_301b_9a55_6a2f3a93421c = new ShopProp();
            foreach (var i in _protocol){
                if (((MsgPack.MessagePackObject)i.Key).AsString() == "PropID"){
                    _struct85ac80e5_1b8a_301b_9a55_6a2f3a93421c.PropID = ((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "IsFreeze"){
                    _struct85ac80e5_1b8a_301b_9a55_6a2f3a93421c.IsFreeze = ((MsgPack.MessagePackObject)i.Value).AsBoolean();
                }
            }
            return _struct85ac80e5_1b8a_301b_9a55_6a2f3a93421c;
        }
    }

    public class ShopData
    {
        public List<ShopRole> SaleRoleList;
        public List<ShopProp> SalePropList;
        public static MsgPack.MessagePackObjectDictionary ShopData_to_protcol(ShopData _struct){
        if (_struct == null) {
            return null;
        }

            var _protocol = new MsgPack.MessagePackObjectDictionary();
            if (_struct.SaleRoleList != null) {
                var _array_SaleRoleList = new List<MsgPack.MessagePackObject>();
                foreach(var v_ in _struct.SaleRoleList){
                    _array_SaleRoleList.Add( new MsgPack.MessagePackObject(ShopRole.ShopRole_to_protcol(v_)));
                }
                _protocol.Add("SaleRoleList", new MsgPack.MessagePackObject(_array_SaleRoleList));
            }
            if (_struct.SalePropList != null) {
                var _array_SalePropList = new List<MsgPack.MessagePackObject>();
                foreach(var v_ in _struct.SalePropList){
                    _array_SalePropList.Add( new MsgPack.MessagePackObject(ShopProp.ShopProp_to_protcol(v_)));
                }
                _protocol.Add("SalePropList", new MsgPack.MessagePackObject(_array_SalePropList));
            }
            return _protocol;
        }
        public static ShopData protcol_to_ShopData(MsgPack.MessagePackObjectDictionary _protocol){
        if (_protocol == null) {
            return null;
        }

            var _struct4c993b13_c35e_3baf_abbc_c749b6027fbc = new ShopData();
            foreach (var i in _protocol){
                if (((MsgPack.MessagePackObject)i.Key).AsString() == "SaleRoleList"){
                    _struct4c993b13_c35e_3baf_abbc_c749b6027fbc.SaleRoleList = new List<ShopRole>();
                    var _protocol_array = ((MsgPack.MessagePackObject)i.Value).AsList();
                    foreach (var v_ in _protocol_array){
                        _struct4c993b13_c35e_3baf_abbc_c749b6027fbc.SaleRoleList.Add(ShopRole.protcol_to_ShopRole(((MsgPack.MessagePackObject)v_).AsDictionary()));
                    }
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "SalePropList"){
                    _struct4c993b13_c35e_3baf_abbc_c749b6027fbc.SalePropList = new List<ShopProp>();
                    var _protocol_array = ((MsgPack.MessagePackObject)i.Value).AsList();
                    foreach (var v_ in _protocol_array){
                        _struct4c993b13_c35e_3baf_abbc_c749b6027fbc.SalePropList.Add(ShopProp.protcol_to_ShopProp(((MsgPack.MessagePackObject)v_).AsDictionary()));
                    }
                }
            }
            return _struct4c993b13_c35e_3baf_abbc_c749b6027fbc;
        }
    }

    public class svr_info
    {
        public Int32 tick_time;
        public Int32 player_num;
        public static MsgPack.MessagePackObjectDictionary svr_info_to_protcol(svr_info _struct){
        if (_struct == null) {
            return null;
        }

            var _protocol = new MsgPack.MessagePackObjectDictionary();
            _protocol.Add("tick_time", _struct.tick_time);
            _protocol.Add("player_num", _struct.player_num);
            return _protocol;
        }
        public static svr_info protcol_to_svr_info(MsgPack.MessagePackObjectDictionary _protocol){
        if (_protocol == null) {
            return null;
        }

            var _struct13f334ce_724e_3749_be0d_3222168d7a26 = new svr_info();
            foreach (var i in _protocol){
                if (((MsgPack.MessagePackObject)i.Key).AsString() == "tick_time"){
                    _struct13f334ce_724e_3749_be0d_3222168d7a26.tick_time = ((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "player_num"){
                    _struct13f334ce_724e_3749_be0d_3222168d7a26.player_num = ((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
            }
            return _struct13f334ce_724e_3749_be0d_3222168d7a26;
        }
    }

/*this caller code is codegen by abelkhan codegen for c#*/

}
