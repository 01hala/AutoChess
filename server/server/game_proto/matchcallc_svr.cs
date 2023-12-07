using System;
using System.Collections;
using System.Collections.Generic;
using System.Threading;
using MsgPack.Serialization;

namespace Abelkhan
{
/*this enum code is codegen by abelkhan codegen for c#*/

/*this struct code is codegen by abelkhan codegen for c#*/
    public class ShopSkillEffect
    {
        public Int32 spellcaster;
        public List<Int32> recipient;
        public Int32 skill_id;
        public ShopSkillEffectEM effect;
        public List<Int32> value;
        public static MsgPack.MessagePackObjectDictionary ShopSkillEffect_to_protcol(ShopSkillEffect _struct){
        if (_struct == null) {
            return null;
        }

            var _protocol = new MsgPack.MessagePackObjectDictionary();
            _protocol.Add("spellcaster", _struct.spellcaster);
            if (_struct.recipient != null) {
                var _array_recipient = new List<MsgPack.MessagePackObject>();
                foreach(var v_ in _struct.recipient){
                    _array_recipient.Add(v_);
                }
                _protocol.Add("recipient", new MsgPack.MessagePackObject(_array_recipient));
            }
            _protocol.Add("skill_id", _struct.skill_id);
            _protocol.Add("effect", (Int32)_struct.effect);
            if (_struct.value != null) {
                var _array_value = new List<MsgPack.MessagePackObject>();
                foreach(var v_ in _struct.value){
                    _array_value.Add(v_);
                }
                _protocol.Add("value", new MsgPack.MessagePackObject(_array_value));
            }
            return _protocol;
        }
        public static ShopSkillEffect protcol_to_ShopSkillEffect(MsgPack.MessagePackObjectDictionary _protocol){
        if (_protocol == null) {
            return null;
        }

            var _struct65920e74_e4bd_3add_b5ce_2729ba6c3234 = new ShopSkillEffect();
            foreach (var i in _protocol){
                if (((MsgPack.MessagePackObject)i.Key).AsString() == "spellcaster"){
                    _struct65920e74_e4bd_3add_b5ce_2729ba6c3234.spellcaster = ((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "recipient"){
                    _struct65920e74_e4bd_3add_b5ce_2729ba6c3234.recipient = new List<Int32>();
                    var _protocol_array = ((MsgPack.MessagePackObject)i.Value).AsList();
                    foreach (var v_ in _protocol_array){
                        _struct65920e74_e4bd_3add_b5ce_2729ba6c3234.recipient.Add(((MsgPack.MessagePackObject)v_).AsInt32());
                    }
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "skill_id"){
                    _struct65920e74_e4bd_3add_b5ce_2729ba6c3234.skill_id = ((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "effect"){
                    _struct65920e74_e4bd_3add_b5ce_2729ba6c3234.effect = (ShopSkillEffectEM)((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "value"){
                    _struct65920e74_e4bd_3add_b5ce_2729ba6c3234.value = new List<Int32>();
                    var _protocol_array = ((MsgPack.MessagePackObject)i.Value).AsList();
                    foreach (var v_ in _protocol_array){
                        _struct65920e74_e4bd_3add_b5ce_2729ba6c3234.value.Add(((MsgPack.MessagePackObject)v_).AsInt32());
                    }
                }
            }
            return _struct65920e74_e4bd_3add_b5ce_2729ba6c3234;
        }
    }

/*this caller code is codegen by abelkhan codegen for c#*/
/*this cb code is codegen by abelkhan for c#*/
    public class battle_client_rsp_cb : Common.IModule {
        public battle_client_rsp_cb() 
        {
        }

    }

    public class battle_client_clientproxy {
        public string client_uuid_268d2967_7c6f_34d2_80c7_77a6da2f6124;
        private Int32 uuid_268d2967_7c6f_34d2_80c7_77a6da2f6124 = (Int32)RandomUUID.random();

        public battle_client_rsp_cb rsp_cb_battle_client_handle;

        public battle_client_clientproxy(battle_client_rsp_cb rsp_cb_battle_client_handle_)
        {
            rsp_cb_battle_client_handle = rsp_cb_battle_client_handle_;
        }

        public void battle_victory(bool is_victory){
            var _argv_5388fb35_f021_358e_992c_9d18e0f4cfc5 = new ArrayList();
            _argv_5388fb35_f021_358e_992c_9d18e0f4cfc5.Add(is_victory);
            Hub.Hub._gates.call_client(client_uuid_268d2967_7c6f_34d2_80c7_77a6da2f6124, "battle_client_battle_victory", _argv_5388fb35_f021_358e_992c_9d18e0f4cfc5);
        }

        public void battle_plan_refresh(UserBattleData battle_info, ShopData shop_info){
            var _argv_8be9e545_6445_3749_abac_14b3a7d2e00f = new ArrayList();
            _argv_8be9e545_6445_3749_abac_14b3a7d2e00f.Add(UserBattleData.UserBattleData_to_protcol(battle_info));
            _argv_8be9e545_6445_3749_abac_14b3a7d2e00f.Add(ShopData.ShopData_to_protcol(shop_info));
            Hub.Hub._gates.call_client(client_uuid_268d2967_7c6f_34d2_80c7_77a6da2f6124, "battle_client_battle_plan_refresh", _argv_8be9e545_6445_3749_abac_14b3a7d2e00f);
        }

        public void shop_skill_effect(ShopSkillEffect effect){
            var _argv_c0363c29_389e_36d3_b41f_f37d9a21bfc8 = new ArrayList();
            _argv_c0363c29_389e_36d3_b41f_f37d9a21bfc8.Add(ShopSkillEffect.ShopSkillEffect_to_protcol(effect));
            Hub.Hub._gates.call_client(client_uuid_268d2967_7c6f_34d2_80c7_77a6da2f6124, "battle_client_shop_skill_effect", _argv_c0363c29_389e_36d3_b41f_f37d9a21bfc8);
        }

        public void refresh(UserBattleData battle_info, ShopData info){
            var _argv_97f4163d_22be_334a_ad37_ab1f786ceb46 = new ArrayList();
            _argv_97f4163d_22be_334a_ad37_ab1f786ceb46.Add(UserBattleData.UserBattleData_to_protcol(battle_info));
            _argv_97f4163d_22be_334a_ad37_ab1f786ceb46.Add(ShopData.ShopData_to_protcol(info));
            Hub.Hub._gates.call_client(client_uuid_268d2967_7c6f_34d2_80c7_77a6da2f6124, "battle_client_refresh", _argv_97f4163d_22be_334a_ad37_ab1f786ceb46);
        }

        public void role_buy_merge(Int32 target_role_index, Role target_role, bool is_update){
            var _argv_b88ee4af_0113_348f_b36f_e256526443e4 = new ArrayList();
            _argv_b88ee4af_0113_348f_b36f_e256526443e4.Add(target_role_index);
            _argv_b88ee4af_0113_348f_b36f_e256526443e4.Add(Role.Role_to_protcol(target_role));
            _argv_b88ee4af_0113_348f_b36f_e256526443e4.Add(is_update);
            Hub.Hub._gates.call_client(client_uuid_268d2967_7c6f_34d2_80c7_77a6da2f6124, "battle_client_role_buy_merge", _argv_b88ee4af_0113_348f_b36f_e256526443e4);
        }

        public void role_merge(Int32 source_role_index, Int32 target_role_index, Role target_role, bool is_update){
            var _argv_11ec50cd_6ba3_3e9e_917b_336716e3e9a4 = new ArrayList();
            _argv_11ec50cd_6ba3_3e9e_917b_336716e3e9a4.Add(source_role_index);
            _argv_11ec50cd_6ba3_3e9e_917b_336716e3e9a4.Add(target_role_index);
            _argv_11ec50cd_6ba3_3e9e_917b_336716e3e9a4.Add(Role.Role_to_protcol(target_role));
            _argv_11ec50cd_6ba3_3e9e_917b_336716e3e9a4.Add(is_update);
            Hub.Hub._gates.call_client(client_uuid_268d2967_7c6f_34d2_80c7_77a6da2f6124, "battle_client_role_merge", _argv_11ec50cd_6ba3_3e9e_917b_336716e3e9a4);
        }

        public void role_eat_food(Int32 food_id, Int32 target_role_index, Role target_role, bool is_update, bool is_syncope){
            var _argv_9752e987_da9a_3510_b580_1a5c8a9dd457 = new ArrayList();
            _argv_9752e987_da9a_3510_b580_1a5c8a9dd457.Add(food_id);
            _argv_9752e987_da9a_3510_b580_1a5c8a9dd457.Add(target_role_index);
            _argv_9752e987_da9a_3510_b580_1a5c8a9dd457.Add(Role.Role_to_protcol(target_role));
            _argv_9752e987_da9a_3510_b580_1a5c8a9dd457.Add(is_update);
            _argv_9752e987_da9a_3510_b580_1a5c8a9dd457.Add(is_syncope);
            Hub.Hub._gates.call_client(client_uuid_268d2967_7c6f_34d2_80c7_77a6da2f6124, "battle_client_role_eat_food", _argv_9752e987_da9a_3510_b580_1a5c8a9dd457);
        }

        public void role_update_refresh_shop(ShopData info){
            var _argv_97214742_cb28_340f_a4d0_e7e39743a356 = new ArrayList();
            _argv_97214742_cb28_340f_a4d0_e7e39743a356.Add(ShopData.ShopData_to_protcol(info));
            Hub.Hub._gates.call_client(client_uuid_268d2967_7c6f_34d2_80c7_77a6da2f6124, "battle_client_role_update_refresh_shop", _argv_97214742_cb28_340f_a4d0_e7e39743a356);
        }

    }

    public class battle_client_multicast {
        public List<string> client_uuids_268d2967_7c6f_34d2_80c7_77a6da2f6124;
        public battle_client_rsp_cb rsp_cb_battle_client_handle;

        public battle_client_multicast(battle_client_rsp_cb rsp_cb_battle_client_handle_)
        {
            rsp_cb_battle_client_handle = rsp_cb_battle_client_handle_;
        }

    }

    public class battle_client_broadcast {
        public battle_client_rsp_cb rsp_cb_battle_client_handle;

        public battle_client_broadcast(battle_client_rsp_cb rsp_cb_battle_client_handle_)
        {
            rsp_cb_battle_client_handle = rsp_cb_battle_client_handle_;
        }

    }

    public class battle_client_caller {
        public static battle_client_rsp_cb rsp_cb_battle_client_handle = null;
        private ThreadLocal<battle_client_clientproxy> _clientproxy;
        private ThreadLocal<battle_client_multicast> _multicast;
        private battle_client_broadcast _broadcast;

        public battle_client_caller() 
        {
            if (rsp_cb_battle_client_handle == null)
            {
                rsp_cb_battle_client_handle = new battle_client_rsp_cb();
            }

            _clientproxy = new ThreadLocal<battle_client_clientproxy>();
            _multicast = new ThreadLocal<battle_client_multicast>();
            _broadcast = new battle_client_broadcast(rsp_cb_battle_client_handle);
        }

        public battle_client_clientproxy get_client(string client_uuid) {
            if (_clientproxy.Value == null)
{
                _clientproxy.Value = new battle_client_clientproxy(rsp_cb_battle_client_handle);
            }
            _clientproxy.Value.client_uuid_268d2967_7c6f_34d2_80c7_77a6da2f6124 = client_uuid;
            return _clientproxy.Value;
        }

        public battle_client_multicast get_multicast(List<string> client_uuids) {
            if (_multicast.Value == null)
{
                _multicast.Value = new battle_client_multicast(rsp_cb_battle_client_handle);
            }
            _multicast.Value.client_uuids_268d2967_7c6f_34d2_80c7_77a6da2f6124 = client_uuids;
            return _multicast.Value;
        }

        public battle_client_broadcast get_broadcast() {
            return _broadcast;
        }
    }


}
