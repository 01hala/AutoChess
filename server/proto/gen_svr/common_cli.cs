using System;
using System.Collections;
using System.Collections.Generic;
using System.Threading;
using MsgPack.Serialization;

namespace Abelkhan
{
/*this enum code is codegen by abelkhan codegen for c#*/

    public enum EMChestType{
        Normal = 1,
        Rare = 2,
        Epic = 3,
        Legend = 4
    }
    public enum EMCostCoinPath{
        BuyRole = 1,
        UpdateRole = 2
    }
/*this struct code is codegen by abelkhan codegen for c#*/
    public class UserInformation
    {
        public string UserName;
        public Int32 UserUid;
        public static MsgPack.MessagePackObjectDictionary UserInformation_to_protcol(UserInformation _struct){
            var _protocol = new MsgPack.MessagePackObjectDictionary();
            _protocol.Add("UserName", _struct.UserName);
            _protocol.Add("UserUid", _struct.UserUid);
            return _protocol;
        }
        public static UserInformation protcol_to_UserInformation(MsgPack.MessagePackObjectDictionary _protocol){
            var _struct07924b8f_25bc_32a4_b436_da6af6116572 = new UserInformation();
            foreach (var i in _protocol){
                if (((MsgPack.MessagePackObject)i.Key).AsString() == "UserName"){
                    _struct07924b8f_25bc_32a4_b436_da6af6116572.UserName = ((MsgPack.MessagePackObject)i.Value).AsString();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "UserUid"){
                    _struct07924b8f_25bc_32a4_b436_da6af6116572.UserUid = ((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
            }
            return _struct07924b8f_25bc_32a4_b436_da6af6116572;
        }
    }

    public class Role
    {
        public Int32 RoleID;
        public string RoleName;
        public bool IsLook;
        public float Heath;
        public float AttNum;
        public static MsgPack.MessagePackObjectDictionary Role_to_protcol(Role _struct){
            var _protocol = new MsgPack.MessagePackObjectDictionary();
            _protocol.Add("RoleID", _struct.RoleID);
            _protocol.Add("RoleName", _struct.RoleName);
            _protocol.Add("IsLook", _struct.IsLook);
            _protocol.Add("Heath", _struct.Heath);
            _protocol.Add("AttNum", _struct.AttNum);
            return _protocol;
        }
        public static Role protcol_to_Role(MsgPack.MessagePackObjectDictionary _protocol){
            var _structe15dab07_4671_3806_9f26_9880fe20019d = new Role();
            foreach (var i in _protocol){
                if (((MsgPack.MessagePackObject)i.Key).AsString() == "RoleID"){
                    _structe15dab07_4671_3806_9f26_9880fe20019d.RoleID = ((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "RoleName"){
                    _structe15dab07_4671_3806_9f26_9880fe20019d.RoleName = ((MsgPack.MessagePackObject)i.Value).AsString();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "IsLook"){
                    _structe15dab07_4671_3806_9f26_9880fe20019d.IsLook = ((MsgPack.MessagePackObject)i.Value).AsBoolean();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "Heath"){
                    _structe15dab07_4671_3806_9f26_9880fe20019d.Heath = ((MsgPack.MessagePackObject)i.Value).AsSingle();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "AttNum"){
                    _structe15dab07_4671_3806_9f26_9880fe20019d.AttNum = ((MsgPack.MessagePackObject)i.Value).AsSingle();
                }
            }
            return _structe15dab07_4671_3806_9f26_9880fe20019d;
        }
    }

    public class Monster
    {
        public Int32 MsId;
        public string MonsterName;
        public bool IsLook;
        public static MsgPack.MessagePackObjectDictionary Monster_to_protcol(Monster _struct){
            var _protocol = new MsgPack.MessagePackObjectDictionary();
            _protocol.Add("MsId", _struct.MsId);
            _protocol.Add("MonsterName", _struct.MonsterName);
            _protocol.Add("IsLook", _struct.IsLook);
            return _protocol;
        }
        public static Monster protcol_to_Monster(MsgPack.MessagePackObjectDictionary _protocol){
            var _struct76875566_832c_332d_9ed9_9a7e11724c81 = new Monster();
            foreach (var i in _protocol){
                if (((MsgPack.MessagePackObject)i.Key).AsString() == "MsId"){
                    _struct76875566_832c_332d_9ed9_9a7e11724c81.MsId = ((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "MonsterName"){
                    _struct76875566_832c_332d_9ed9_9a7e11724c81.MonsterName = ((MsgPack.MessagePackObject)i.Value).AsString();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "IsLook"){
                    _struct76875566_832c_332d_9ed9_9a7e11724c81.IsLook = ((MsgPack.MessagePackObject)i.Value).AsBoolean();
                }
            }
            return _struct76875566_832c_332d_9ed9_9a7e11724c81;
        }
    }

    public class Skill
    {
        public Int32 SkID;
        public string SkillName;
        public bool IsLook;
        public static MsgPack.MessagePackObjectDictionary Skill_to_protcol(Skill _struct){
            var _protocol = new MsgPack.MessagePackObjectDictionary();
            _protocol.Add("SkID", _struct.SkID);
            _protocol.Add("SkillName", _struct.SkillName);
            _protocol.Add("IsLook", _struct.IsLook);
            return _protocol;
        }
        public static Skill protcol_to_Skill(MsgPack.MessagePackObjectDictionary _protocol){
            var _struct6296b77e_5319_35bd_ba32_48548b0a19f8 = new Skill();
            foreach (var i in _protocol){
                if (((MsgPack.MessagePackObject)i.Key).AsString() == "SkID"){
                    _struct6296b77e_5319_35bd_ba32_48548b0a19f8.SkID = ((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "SkillName"){
                    _struct6296b77e_5319_35bd_ba32_48548b0a19f8.SkillName = ((MsgPack.MessagePackObject)i.Value).AsString();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "IsLook"){
                    _struct6296b77e_5319_35bd_ba32_48548b0a19f8.IsLook = ((MsgPack.MessagePackObject)i.Value).AsBoolean();
                }
            }
            return _struct6296b77e_5319_35bd_ba32_48548b0a19f8;
        }
    }

    public class Prop
    {
        public Int32 PropID;
        public string PropName;
        public Int32 Count;
        public static MsgPack.MessagePackObjectDictionary Prop_to_protcol(Prop _struct){
            var _protocol = new MsgPack.MessagePackObjectDictionary();
            _protocol.Add("PropID", _struct.PropID);
            _protocol.Add("PropName", _struct.PropName);
            _protocol.Add("Count", _struct.Count);
            return _protocol;
        }
        public static Prop protcol_to_Prop(MsgPack.MessagePackObjectDictionary _protocol){
            var _structaefeaa85_18d7_3b34_816c_1d95b23f7cbb = new Prop();
            foreach (var i in _protocol){
                if (((MsgPack.MessagePackObject)i.Key).AsString() == "PropID"){
                    _structaefeaa85_18d7_3b34_816c_1d95b23f7cbb.PropID = ((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "PropName"){
                    _structaefeaa85_18d7_3b34_816c_1d95b23f7cbb.PropName = ((MsgPack.MessagePackObject)i.Value).AsString();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "Count"){
                    _structaefeaa85_18d7_3b34_816c_1d95b23f7cbb.Count = ((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
            }
            return _structaefeaa85_18d7_3b34_816c_1d95b23f7cbb;
        }
    }

    public class UserData
    {
        public UserInformation User;
        public Int32 Coin;
        public Int32 Strength;
        public Int32 NormalChest;
        public Int32 RareChest;
        public Int32 EpicChest;
        public Int32 LegendChest;
        public List<Role> RoleList;
        public List<Prop> PropList;
        public List<Skill> SkList;
        public List<Monster> MsList;
        public static MsgPack.MessagePackObjectDictionary UserData_to_protcol(UserData _struct){
            var _protocol = new MsgPack.MessagePackObjectDictionary();
            _protocol.Add("User", new MsgPack.MessagePackObject(UserInformation.UserInformation_to_protcol(_struct.User)));
            _protocol.Add("Coin", _struct.Coin);
            _protocol.Add("Strength", _struct.Strength);
            _protocol.Add("NormalChest", _struct.NormalChest);
            _protocol.Add("RareChest", _struct.RareChest);
            _protocol.Add("EpicChest", _struct.EpicChest);
            _protocol.Add("LegendChest", _struct.LegendChest);
            if (_struct.RoleList != null) {
                var _array_RoleList = new List<MsgPack.MessagePackObject>();
                foreach(var v_ in _struct.RoleList){
                    _array_RoleList.Add( new MsgPack.MessagePackObject(Role.Role_to_protcol(v_)));
                }
                _protocol.Add("RoleList", new MsgPack.MessagePackObject(_array_RoleList));
            }
            if (_struct.PropList != null) {
                var _array_PropList = new List<MsgPack.MessagePackObject>();
                foreach(var v_ in _struct.PropList){
                    _array_PropList.Add( new MsgPack.MessagePackObject(Prop.Prop_to_protcol(v_)));
                }
                _protocol.Add("PropList", new MsgPack.MessagePackObject(_array_PropList));
            }
            if (_struct.SkList != null) {
                var _array_SkList = new List<MsgPack.MessagePackObject>();
                foreach(var v_ in _struct.SkList){
                    _array_SkList.Add( new MsgPack.MessagePackObject(Skill.Skill_to_protcol(v_)));
                }
                _protocol.Add("SkList", new MsgPack.MessagePackObject(_array_SkList));
            }
            if (_struct.MsList != null) {
                var _array_MsList = new List<MsgPack.MessagePackObject>();
                foreach(var v_ in _struct.MsList){
                    _array_MsList.Add( new MsgPack.MessagePackObject(Monster.Monster_to_protcol(v_)));
                }
                _protocol.Add("MsList", new MsgPack.MessagePackObject(_array_MsList));
            }
            return _protocol;
        }
        public static UserData protcol_to_UserData(MsgPack.MessagePackObjectDictionary _protocol){
            var _structc2d657c3_3c93_3c3c_b65f_adc45e6eed7b = new UserData();
            foreach (var i in _protocol){
                if (((MsgPack.MessagePackObject)i.Key).AsString() == "User"){
                    _structc2d657c3_3c93_3c3c_b65f_adc45e6eed7b.User = UserInformation.protcol_to_UserInformation(((MsgPack.MessagePackObject)i.Value).AsDictionary());
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "Coin"){
                    _structc2d657c3_3c93_3c3c_b65f_adc45e6eed7b.Coin = ((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "Strength"){
                    _structc2d657c3_3c93_3c3c_b65f_adc45e6eed7b.Strength = ((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "NormalChest"){
                    _structc2d657c3_3c93_3c3c_b65f_adc45e6eed7b.NormalChest = ((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "RareChest"){
                    _structc2d657c3_3c93_3c3c_b65f_adc45e6eed7b.RareChest = ((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "EpicChest"){
                    _structc2d657c3_3c93_3c3c_b65f_adc45e6eed7b.EpicChest = ((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "LegendChest"){
                    _structc2d657c3_3c93_3c3c_b65f_adc45e6eed7b.LegendChest = ((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "RoleList"){
                    _structc2d657c3_3c93_3c3c_b65f_adc45e6eed7b.RoleList = new List<Role>();
                    var _protocol_array = ((MsgPack.MessagePackObject)i.Value).AsList();
                    foreach (var v_ in _protocol_array){
                        _structc2d657c3_3c93_3c3c_b65f_adc45e6eed7b.RoleList.Add(Role.protcol_to_Role(((MsgPack.MessagePackObject)v_).AsDictionary()));
                    }
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "PropList"){
                    _structc2d657c3_3c93_3c3c_b65f_adc45e6eed7b.PropList = new List<Prop>();
                    var _protocol_array = ((MsgPack.MessagePackObject)i.Value).AsList();
                    foreach (var v_ in _protocol_array){
                        _structc2d657c3_3c93_3c3c_b65f_adc45e6eed7b.PropList.Add(Prop.protcol_to_Prop(((MsgPack.MessagePackObject)v_).AsDictionary()));
                    }
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "SkList"){
                    _structc2d657c3_3c93_3c3c_b65f_adc45e6eed7b.SkList = new List<Skill>();
                    var _protocol_array = ((MsgPack.MessagePackObject)i.Value).AsList();
                    foreach (var v_ in _protocol_array){
                        _structc2d657c3_3c93_3c3c_b65f_adc45e6eed7b.SkList.Add(Skill.protcol_to_Skill(((MsgPack.MessagePackObject)v_).AsDictionary()));
                    }
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "MsList"){
                    _structc2d657c3_3c93_3c3c_b65f_adc45e6eed7b.MsList = new List<Monster>();
                    var _protocol_array = ((MsgPack.MessagePackObject)i.Value).AsList();
                    foreach (var v_ in _protocol_array){
                        _structc2d657c3_3c93_3c3c_b65f_adc45e6eed7b.MsList.Add(Monster.protcol_to_Monster(((MsgPack.MessagePackObject)v_).AsDictionary()));
                    }
                }
            }
            return _structc2d657c3_3c93_3c3c_b65f_adc45e6eed7b;
        }
    }

    public class svr_info
    {
        public Int32 tick_time;
        public Int32 player_num;
        public static MsgPack.MessagePackObjectDictionary svr_info_to_protcol(svr_info _struct){
            var _protocol = new MsgPack.MessagePackObjectDictionary();
            _protocol.Add("tick_time", _struct.tick_time);
            _protocol.Add("player_num", _struct.player_num);
            return _protocol;
        }
        public static svr_info protcol_to_svr_info(MsgPack.MessagePackObjectDictionary _protocol){
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

/*this module code is codegen by abelkhan codegen for c#*/

}
