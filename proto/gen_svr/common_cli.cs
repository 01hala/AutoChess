using System;
using System.Collections;
using System.Collections.Generic;
using System.Threading;
using MsgPack.Serialization;

namespace Abelkhan
{
/*this enum code is codegen by abelkhan codegen for c#*/

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
            var _protocol = new MsgPack.MessagePackObjectDictionary();
            _protocol.Add("UserName", _struct.UserName);
            _protocol.Add("UserGuid", _struct.UserGuid);
            return _protocol;
        }
        public static UserInformation protcol_to_UserInformation(MsgPack.MessagePackObjectDictionary _protocol){
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

    public class Role
    {
        public Int32 RoleID;
        public Int32 Level;
        public Int32 BaseAttack;
        public Int32 BaseDefense;
        public Int32 TotalAttack;
        public Int32 TotalDefense;
        public static MsgPack.MessagePackObjectDictionary Role_to_protcol(Role _struct){
            var _protocol = new MsgPack.MessagePackObjectDictionary();
            _protocol.Add("RoleID", _struct.RoleID);
            _protocol.Add("Level", _struct.Level);
            _protocol.Add("BaseAttack", _struct.BaseAttack);
            _protocol.Add("BaseDefense", _struct.BaseDefense);
            _protocol.Add("TotalAttack", _struct.TotalAttack);
            _protocol.Add("TotalDefense", _struct.TotalDefense);
            return _protocol;
        }
        public static Role protcol_to_Role(MsgPack.MessagePackObjectDictionary _protocol){
            var _structe15dab07_4671_3806_9f26_9880fe20019d = new Role();
            foreach (var i in _protocol){
                if (((MsgPack.MessagePackObject)i.Key).AsString() == "RoleID"){
                    _structe15dab07_4671_3806_9f26_9880fe20019d.RoleID = ((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "Level"){
                    _structe15dab07_4671_3806_9f26_9880fe20019d.Level = ((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "BaseAttack"){
                    _structe15dab07_4671_3806_9f26_9880fe20019d.BaseAttack = ((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "BaseDefense"){
                    _structe15dab07_4671_3806_9f26_9880fe20019d.BaseDefense = ((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "TotalAttack"){
                    _structe15dab07_4671_3806_9f26_9880fe20019d.TotalAttack = ((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "TotalDefense"){
                    _structe15dab07_4671_3806_9f26_9880fe20019d.TotalDefense = ((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
            }
            return _structe15dab07_4671_3806_9f26_9880fe20019d;
        }
    }

    public class UserBattleData
    {
        public UserInformation User;
        public Int32 coin;
        public List<Role> RoleList;
        public static MsgPack.MessagePackObjectDictionary UserBattleData_to_protcol(UserBattleData _struct){
            var _protocol = new MsgPack.MessagePackObjectDictionary();
            _protocol.Add("User", new MsgPack.MessagePackObject(UserInformation.UserInformation_to_protcol(_struct.User)));
            _protocol.Add("coin", _struct.coin);
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
            var _struct9f9f5aff_ccb2_34db_90eb_25dd29e28c9f = new UserBattleData();
            foreach (var i in _protocol){
                if (((MsgPack.MessagePackObject)i.Key).AsString() == "User"){
                    _struct9f9f5aff_ccb2_34db_90eb_25dd29e28c9f.User = UserInformation.protcol_to_UserInformation(((MsgPack.MessagePackObject)i.Value).AsDictionary());
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "coin"){
                    _struct9f9f5aff_ccb2_34db_90eb_25dd29e28c9f.coin = ((MsgPack.MessagePackObject)i.Value).AsInt32();
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

    public class ShopData
    {
        public List<Int32> SaleRoleList;
        public List<Int32> SalePropList;
        public static MsgPack.MessagePackObjectDictionary ShopData_to_protcol(ShopData _struct){
            var _protocol = new MsgPack.MessagePackObjectDictionary();
            if (_struct.SaleRoleList != null) {
                var _array_SaleRoleList = new List<MsgPack.MessagePackObject>();
                foreach(var v_ in _struct.SaleRoleList){
                    _array_SaleRoleList.Add(v_);
                }
                _protocol.Add("SaleRoleList", new MsgPack.MessagePackObject(_array_SaleRoleList));
            }
            if (_struct.SalePropList != null) {
                var _array_SalePropList = new List<MsgPack.MessagePackObject>();
                foreach(var v_ in _struct.SalePropList){
                    _array_SalePropList.Add(v_);
                }
                _protocol.Add("SalePropList", new MsgPack.MessagePackObject(_array_SalePropList));
            }
            return _protocol;
        }
        public static ShopData protcol_to_ShopData(MsgPack.MessagePackObjectDictionary _protocol){
            var _struct4c993b13_c35e_3baf_abbc_c749b6027fbc = new ShopData();
            foreach (var i in _protocol){
                if (((MsgPack.MessagePackObject)i.Key).AsString() == "SaleRoleList"){
                    _struct4c993b13_c35e_3baf_abbc_c749b6027fbc.SaleRoleList = new List<Int32>();
                    var _protocol_array = ((MsgPack.MessagePackObject)i.Value).AsList();
                    foreach (var v_ in _protocol_array){
                        _struct4c993b13_c35e_3baf_abbc_c749b6027fbc.SaleRoleList.Add(((MsgPack.MessagePackObject)v_).AsInt32());
                    }
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "SalePropList"){
                    _struct4c993b13_c35e_3baf_abbc_c749b6027fbc.SalePropList = new List<Int32>();
                    var _protocol_array = ((MsgPack.MessagePackObject)i.Value).AsList();
                    foreach (var v_ in _protocol_array){
                        _struct4c993b13_c35e_3baf_abbc_c749b6027fbc.SalePropList.Add(((MsgPack.MessagePackObject)v_).AsInt32());
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
