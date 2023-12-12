using System;
using System.Collections;
using System.Collections.Generic;
using System.Threading;
using MsgPack.Serialization;

namespace Abelkhan
{
/*this enum code is codegen by abelkhan codegen for c#*/

    public enum SkillEffectEM{
        AddProperty = 1,
        RecoverHP = 2,
        RemoteAttack = 3,
        Summon = 4,
        AddCoin = 5,
        ExchangeProperty = 6,
        GainShield = 7,
        RefreshShop = 8,
        ChangePosition = 9,
        AddEquipment = 10,
        ReductionHurt = 11
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
        public static MsgPack.MessagePackObjectDictionary UserInformation_to_protcol(UserInformation _struct){
        if (_struct == null) {
            return null;
        }

            var _protocol = new MsgPack.MessagePackObjectDictionary();
            _protocol.Add("UserName", _struct.UserName);
            _protocol.Add("UserGuid", _struct.UserGuid);
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
            }
            return _struct07924b8f_25bc_32a4_b436_da6af6116572;
        }
    }

    public class UserData
    {
        public UserInformation User;
        public Int32 Strength;
        public List<Int32> RoleList;
        public static MsgPack.MessagePackObjectDictionary UserData_to_protcol(UserData _struct){
        if (_struct == null) {
            return null;
        }

            var _protocol = new MsgPack.MessagePackObjectDictionary();
            _protocol.Add("User", new MsgPack.MessagePackObject(UserInformation.UserInformation_to_protcol(_struct.User)));
            _protocol.Add("Strength", _struct.Strength);
            if (_struct.RoleList != null) {
                var _array_RoleList = new List<MsgPack.MessagePackObject>();
                foreach(var v_ in _struct.RoleList){
                    _array_RoleList.Add(v_);
                }
                _protocol.Add("RoleList", new MsgPack.MessagePackObject(_array_RoleList));
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
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "Strength"){
                    _structc2d657c3_3c93_3c3c_b65f_adc45e6eed7b.Strength = ((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "RoleList"){
                    _structc2d657c3_3c93_3c3c_b65f_adc45e6eed7b.RoleList = new List<Int32>();
                    var _protocol_array = ((MsgPack.MessagePackObject)i.Value).AsList();
                    foreach (var v_ in _protocol_array){
                        _structc2d657c3_3c93_3c3c_b65f_adc45e6eed7b.RoleList.Add(((MsgPack.MessagePackObject)v_).AsInt32());
                    }
                }
            }
            return _structc2d657c3_3c93_3c3c_b65f_adc45e6eed7b;
        }
    }

    public class Fetters
    {
        public Int32 fetters_id;
        public Int32 number;
        public static MsgPack.MessagePackObjectDictionary Fetters_to_protcol(Fetters _struct){
        if (_struct == null) {
            return null;
        }

            var _protocol = new MsgPack.MessagePackObjectDictionary();
            _protocol.Add("fetters_id", _struct.fetters_id);
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
        public Int32 Level;
        public Int32 SkillID;
        public Fetters FettersSkillID;
        public Int32 Number;
        public Int32 HP;
        public Int32 Attack;
        public Int32 TempHP;
        public Int32 TempAttack;
        public Int32 additionBuffer;
        public Int32 TempAdditionBuffer;
        public static MsgPack.MessagePackObjectDictionary Role_to_protcol(Role _struct){
        if (_struct == null) {
            return null;
        }

            var _protocol = new MsgPack.MessagePackObjectDictionary();
            _protocol.Add("RoleID", _struct.RoleID);
            _protocol.Add("Level", _struct.Level);
            _protocol.Add("SkillID", _struct.SkillID);
            _protocol.Add("FettersSkillID", new MsgPack.MessagePackObject(Fetters.Fetters_to_protcol(_struct.FettersSkillID)));
            _protocol.Add("Number", _struct.Number);
            _protocol.Add("HP", _struct.HP);
            _protocol.Add("Attack", _struct.Attack);
            _protocol.Add("TempHP", _struct.TempHP);
            _protocol.Add("TempAttack", _struct.TempAttack);
            _protocol.Add("additionBuffer", _struct.additionBuffer);
            _protocol.Add("TempAdditionBuffer", _struct.TempAdditionBuffer);
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
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "Level"){
                    _structe15dab07_4671_3806_9f26_9880fe20019d.Level = ((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "SkillID"){
                    _structe15dab07_4671_3806_9f26_9880fe20019d.SkillID = ((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "FettersSkillID"){
                    _structe15dab07_4671_3806_9f26_9880fe20019d.FettersSkillID = Fetters.protcol_to_Fetters(((MsgPack.MessagePackObject)i.Value).AsDictionary());
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
                    _structe15dab07_4671_3806_9f26_9880fe20019d.additionBuffer = ((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "TempAdditionBuffer"){
                    _structe15dab07_4671_3806_9f26_9880fe20019d.TempAdditionBuffer = ((MsgPack.MessagePackObject)i.Value).AsInt32();
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
        public Int32 victory;
        public Int32 faild;
        public List<Role> RoleList;
        public static MsgPack.MessagePackObjectDictionary UserBattleData_to_protcol(UserBattleData _struct){
        if (_struct == null) {
            return null;
        }

            var _protocol = new MsgPack.MessagePackObjectDictionary();
            _protocol.Add("User", new MsgPack.MessagePackObject(UserInformation.UserInformation_to_protcol(_struct.User)));
            _protocol.Add("coin", _struct.coin);
            _protocol.Add("round", _struct.round);
            _protocol.Add("victory", _struct.victory);
            _protocol.Add("faild", _struct.faild);
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
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "victory"){
                    _struct9f9f5aff_ccb2_34db_90eb_25dd29e28c9f.victory = ((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "faild"){
                    _struct9f9f5aff_ccb2_34db_90eb_25dd29e28c9f.faild = ((MsgPack.MessagePackObject)i.Value).AsInt32();
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
/*this module code is codegen by abelkhan codegen for c#*/

}
