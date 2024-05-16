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
        public SkillEffectEM effect;
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
                _protocol.Add("recipient", MsgPack.MessagePackObject.FromObject(_array_recipient));
            }
            _protocol.Add("skill_id", _struct.skill_id);
            _protocol.Add("effect", (Int32)_struct.effect);
            if (_struct.value != null) {
                var _array_value = new List<MsgPack.MessagePackObject>();
                foreach(var v_ in _struct.value){
                    _array_value.Add(v_);
                }
                _protocol.Add("value", MsgPack.MessagePackObject.FromObject(_array_value));
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
                    _struct65920e74_e4bd_3add_b5ce_2729ba6c3234.effect = (SkillEffectEM)((MsgPack.MessagePackObject)i.Value).AsInt32();
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
    public class battle_client_replace_peak_strength_cb
    {
        private UInt64 cb_uuid;
        private battle_client_rsp_cb module_rsp_cb;

        public battle_client_replace_peak_strength_cb(UInt64 _cb_uuid, battle_client_rsp_cb _module_rsp_cb)
        {
            cb_uuid = _cb_uuid;
            module_rsp_cb = _module_rsp_cb;
        }

        public event Action<bool> on_replace_peak_strength_cb;
        public event Action on_replace_peak_strength_err;
        public event Action on_replace_peak_strength_timeout;

        public battle_client_replace_peak_strength_cb callBack(Action<bool> cb, Action err)
        {
            on_replace_peak_strength_cb += cb;
            on_replace_peak_strength_err += err;
            return this;
        }

        public void timeout(UInt64 tick, Action timeout_cb)
        {
            TinyTimer.add_timer(tick, ()=>{
                module_rsp_cb.replace_peak_strength_timeout(cb_uuid);
            });
            on_replace_peak_strength_timeout += timeout_cb;
        }

        public void call_cb(bool confirm)
        {
            if (on_replace_peak_strength_cb != null)
            {
                on_replace_peak_strength_cb(confirm);
            }
        }

        public void call_err()
        {
            if (on_replace_peak_strength_err != null)
            {
                on_replace_peak_strength_err();
            }
        }

        public void call_timeout()
        {
            if (on_replace_peak_strength_timeout != null)
            {
                on_replace_peak_strength_timeout();
            }
        }

    }

/*this cb code is codegen by abelkhan for c#*/
    public class battle_client_rsp_cb : Common.IModule {
        public Dictionary<UInt64, battle_client_replace_peak_strength_cb> map_replace_peak_strength;
        public battle_client_rsp_cb() 
        {
            map_replace_peak_strength = new Dictionary<UInt64, battle_client_replace_peak_strength_cb>();
            Hub.Hub._modules.add_mothed("battle_client_rsp_cb_replace_peak_strength_rsp", replace_peak_strength_rsp);
            Hub.Hub._modules.add_mothed("battle_client_rsp_cb_replace_peak_strength_err", replace_peak_strength_err);
        }

        public void replace_peak_strength_rsp(IList<MsgPack.MessagePackObject> inArray){
            var uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _confirm = ((MsgPack.MessagePackObject)inArray[1]).AsBoolean();
            var rsp = try_get_and_del_replace_peak_strength_cb(uuid);
            if (rsp != null)
            {
                rsp.call_cb(_confirm);
            }
        }

        public void replace_peak_strength_err(IList<MsgPack.MessagePackObject> inArray){
            var uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var rsp = try_get_and_del_replace_peak_strength_cb(uuid);
            if (rsp != null)
            {
                rsp.call_err();
            }
        }

        public void replace_peak_strength_timeout(UInt64 cb_uuid){
            var rsp = try_get_and_del_replace_peak_strength_cb(cb_uuid);
            if (rsp != null){
                rsp.call_timeout();
            }
        }

        private battle_client_replace_peak_strength_cb try_get_and_del_replace_peak_strength_cb(UInt64 uuid){
            lock(map_replace_peak_strength)
            {
                if (map_replace_peak_strength.TryGetValue(uuid, out battle_client_replace_peak_strength_cb rsp))
                {
                    map_replace_peak_strength.Remove(uuid);
                }
                return rsp;
            }
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
            var _argv_5388fb35_f021_358e_992c_9d18e0f4cfc5 = new List<MsgPack.MessagePackObject>();
            _argv_5388fb35_f021_358e_992c_9d18e0f4cfc5.Add(is_victory);
            Hub.Hub._gates.call_client(client_uuid_268d2967_7c6f_34d2_80c7_77a6da2f6124, "battle_client_battle_victory", _argv_5388fb35_f021_358e_992c_9d18e0f4cfc5);
        }

        public void battle_plan_refresh(UserBattleData battle_info, ShopData shop_info, List<Fetters> fetters_info){
            var _argv_8be9e545_6445_3749_abac_14b3a7d2e00f = new List<MsgPack.MessagePackObject>();
            _argv_8be9e545_6445_3749_abac_14b3a7d2e00f.Add(MsgPack.MessagePackObject.FromObject(UserBattleData.UserBattleData_to_protcol(battle_info)));
            _argv_8be9e545_6445_3749_abac_14b3a7d2e00f.Add(MsgPack.MessagePackObject.FromObject(ShopData.ShopData_to_protcol(shop_info)));
            var _array_2465681a_a205_3e91_8b5b_a53cd2e8b9dc = new List<MsgPack.MessagePackObject>();
            foreach(var v_9035a021_03cb_5bd0_bc76_03261181b452 in fetters_info){
                _array_2465681a_a205_3e91_8b5b_a53cd2e8b9dc.Add(MsgPack.MessagePackObject.FromObject(Fetters.Fetters_to_protcol(v_9035a021_03cb_5bd0_bc76_03261181b452)));
            }
            _argv_8be9e545_6445_3749_abac_14b3a7d2e00f.Add(MsgPack.MessagePackObject.FromObject(_array_2465681a_a205_3e91_8b5b_a53cd2e8b9dc));
            Hub.Hub._gates.call_client(client_uuid_268d2967_7c6f_34d2_80c7_77a6da2f6124, "battle_client_battle_plan_refresh", _argv_8be9e545_6445_3749_abac_14b3a7d2e00f);
        }

        public void shop_skill_effect(ShopSkillEffect effect){
            var _argv_c0363c29_389e_36d3_b41f_f37d9a21bfc8 = new List<MsgPack.MessagePackObject>();
            _argv_c0363c29_389e_36d3_b41f_f37d9a21bfc8.Add(MsgPack.MessagePackObject.FromObject(ShopSkillEffect.ShopSkillEffect_to_protcol(effect)));
            Hub.Hub._gates.call_client(client_uuid_268d2967_7c6f_34d2_80c7_77a6da2f6124, "battle_client_shop_skill_effect", _argv_c0363c29_389e_36d3_b41f_f37d9a21bfc8);
        }

        public void refresh(UserBattleData battle_info, ShopData info){
            var _argv_97f4163d_22be_334a_ad37_ab1f786ceb46 = new List<MsgPack.MessagePackObject>();
            _argv_97f4163d_22be_334a_ad37_ab1f786ceb46.Add(MsgPack.MessagePackObject.FromObject(UserBattleData.UserBattleData_to_protcol(battle_info)));
            _argv_97f4163d_22be_334a_ad37_ab1f786ceb46.Add(MsgPack.MessagePackObject.FromObject(ShopData.ShopData_to_protcol(info)));
            Hub.Hub._gates.call_client(client_uuid_268d2967_7c6f_34d2_80c7_77a6da2f6124, "battle_client_refresh", _argv_97f4163d_22be_334a_ad37_ab1f786ceb46);
        }

        public void role_buy_merge(Int32 target_role_index, Role target_role, bool is_update){
            var _argv_b88ee4af_0113_348f_b36f_e256526443e4 = new List<MsgPack.MessagePackObject>();
            _argv_b88ee4af_0113_348f_b36f_e256526443e4.Add(target_role_index);
            _argv_b88ee4af_0113_348f_b36f_e256526443e4.Add(MsgPack.MessagePackObject.FromObject(Role.Role_to_protcol(target_role)));
            _argv_b88ee4af_0113_348f_b36f_e256526443e4.Add(is_update);
            Hub.Hub._gates.call_client(client_uuid_268d2967_7c6f_34d2_80c7_77a6da2f6124, "battle_client_role_buy_merge", _argv_b88ee4af_0113_348f_b36f_e256526443e4);
        }

        public void role_merge(Int32 source_role_index, Int32 target_role_index, Role target_role, bool is_update){
            var _argv_11ec50cd_6ba3_3e9e_917b_336716e3e9a4 = new List<MsgPack.MessagePackObject>();
            _argv_11ec50cd_6ba3_3e9e_917b_336716e3e9a4.Add(source_role_index);
            _argv_11ec50cd_6ba3_3e9e_917b_336716e3e9a4.Add(target_role_index);
            _argv_11ec50cd_6ba3_3e9e_917b_336716e3e9a4.Add(MsgPack.MessagePackObject.FromObject(Role.Role_to_protcol(target_role)));
            _argv_11ec50cd_6ba3_3e9e_917b_336716e3e9a4.Add(is_update);
            Hub.Hub._gates.call_client(client_uuid_268d2967_7c6f_34d2_80c7_77a6da2f6124, "battle_client_role_merge", _argv_11ec50cd_6ba3_3e9e_917b_336716e3e9a4);
        }

        public void role_eat_food(Int32 food_id, Int32 target_role_index, Role target_role, bool is_update, bool is_syncope){
            var _argv_9752e987_da9a_3510_b580_1a5c8a9dd457 = new List<MsgPack.MessagePackObject>();
            _argv_9752e987_da9a_3510_b580_1a5c8a9dd457.Add(food_id);
            _argv_9752e987_da9a_3510_b580_1a5c8a9dd457.Add(target_role_index);
            _argv_9752e987_da9a_3510_b580_1a5c8a9dd457.Add(MsgPack.MessagePackObject.FromObject(Role.Role_to_protcol(target_role)));
            _argv_9752e987_da9a_3510_b580_1a5c8a9dd457.Add(is_update);
            _argv_9752e987_da9a_3510_b580_1a5c8a9dd457.Add(is_syncope);
            Hub.Hub._gates.call_client(client_uuid_268d2967_7c6f_34d2_80c7_77a6da2f6124, "battle_client_role_eat_food", _argv_9752e987_da9a_3510_b580_1a5c8a9dd457);
        }

        public void role_equip(Int32 quip_id, Int32 target_role_index, Role target_role){
            var _argv_4b650459_29d5_3513_85a8_fa715a8e14a7 = new List<MsgPack.MessagePackObject>();
            _argv_4b650459_29d5_3513_85a8_fa715a8e14a7.Add(quip_id);
            _argv_4b650459_29d5_3513_85a8_fa715a8e14a7.Add(target_role_index);
            _argv_4b650459_29d5_3513_85a8_fa715a8e14a7.Add(MsgPack.MessagePackObject.FromObject(Role.Role_to_protcol(target_role)));
            Hub.Hub._gates.call_client(client_uuid_268d2967_7c6f_34d2_80c7_77a6da2f6124, "battle_client_role_equip", _argv_4b650459_29d5_3513_85a8_fa715a8e14a7);
        }

        public void role_update_refresh_shop(ShopData info){
            var _argv_97214742_cb28_340f_a4d0_e7e39743a356 = new List<MsgPack.MessagePackObject>();
            _argv_97214742_cb28_340f_a4d0_e7e39743a356.Add(MsgPack.MessagePackObject.FromObject(ShopData.ShopData_to_protcol(info)));
            Hub.Hub._gates.call_client(client_uuid_268d2967_7c6f_34d2_80c7_77a6da2f6124, "battle_client_role_update_refresh_shop", _argv_97214742_cb28_340f_a4d0_e7e39743a356);
        }

        public void fetters_info(List<Fetters> info){
            var _argv_2465681a_a205_3e91_8b5b_a53cd2e8b9dc = new List<MsgPack.MessagePackObject>();
            var _array_391fd3d4_2d55_3f5e_9223_7f450a814a15 = new List<MsgPack.MessagePackObject>();
            foreach(var v_0c15545d_d42a_5fe0_bed7_a9496851e88b in info){
                _array_391fd3d4_2d55_3f5e_9223_7f450a814a15.Add(MsgPack.MessagePackObject.FromObject(Fetters.Fetters_to_protcol(v_0c15545d_d42a_5fe0_bed7_a9496851e88b)));
            }
            _argv_2465681a_a205_3e91_8b5b_a53cd2e8b9dc.Add(MsgPack.MessagePackObject.FromObject(_array_391fd3d4_2d55_3f5e_9223_7f450a814a15));
            Hub.Hub._gates.call_client(client_uuid_268d2967_7c6f_34d2_80c7_77a6da2f6124, "battle_client_fetters_info", _argv_2465681a_a205_3e91_8b5b_a53cd2e8b9dc);
        }

        public void role_skill_update(Int32 role_index, Role _role){
            var _argv_eafae214_aba1_3e76_a68b_a5ab9edd110a = new List<MsgPack.MessagePackObject>();
            _argv_eafae214_aba1_3e76_a68b_a5ab9edd110a.Add(role_index);
            _argv_eafae214_aba1_3e76_a68b_a5ab9edd110a.Add(MsgPack.MessagePackObject.FromObject(Role.Role_to_protcol(_role)));
            Hub.Hub._gates.call_client(client_uuid_268d2967_7c6f_34d2_80c7_77a6da2f6124, "battle_client_role_skill_update", _argv_eafae214_aba1_3e76_a68b_a5ab9edd110a);
        }

        public void role_add_property(UserBattleData battle_info){
            var _argv_5442ab1d_8c6f_3bf5_a4a2_d1662f209f08 = new List<MsgPack.MessagePackObject>();
            _argv_5442ab1d_8c6f_3bf5_a4a2_d1662f209f08.Add(MsgPack.MessagePackObject.FromObject(UserBattleData.UserBattleData_to_protcol(battle_info)));
            Hub.Hub._gates.call_client(client_uuid_268d2967_7c6f_34d2_80c7_77a6da2f6124, "battle_client_role_add_property", _argv_5442ab1d_8c6f_3bf5_a4a2_d1662f209f08);
        }

        public void add_coin(Int32 coin){
            var _argv_68d61429_8f03_329b_a588_1069fa6d4cff = new List<MsgPack.MessagePackObject>();
            _argv_68d61429_8f03_329b_a588_1069fa6d4cff.Add(coin);
            Hub.Hub._gates.call_client(client_uuid_268d2967_7c6f_34d2_80c7_77a6da2f6124, "battle_client_add_coin", _argv_68d61429_8f03_329b_a588_1069fa6d4cff);
        }

        public void shop_summon(Int32 role_index, Role _role){
            var _argv_b209e11c_3408_34f8_94b3_a0d02a808f7a = new List<MsgPack.MessagePackObject>();
            _argv_b209e11c_3408_34f8_94b3_a0d02a808f7a.Add(role_index);
            _argv_b209e11c_3408_34f8_94b3_a0d02a808f7a.Add(MsgPack.MessagePackObject.FromObject(Role.Role_to_protcol(_role)));
            Hub.Hub._gates.call_client(client_uuid_268d2967_7c6f_34d2_80c7_77a6da2f6124, "battle_client_shop_summon", _argv_b209e11c_3408_34f8_94b3_a0d02a808f7a);
        }

        public battle_client_replace_peak_strength_cb replace_peak_strength(){
            var uuid_1f0834d5_a4fc_5d7e_a21f_2c9c1447243d = (UInt64)Interlocked.Increment(ref uuid_268d2967_7c6f_34d2_80c7_77a6da2f6124);

            var _argv_b6124ca7_ba56_39b8_9566_45bca78f3a8d = new List<MsgPack.MessagePackObject>();
            _argv_b6124ca7_ba56_39b8_9566_45bca78f3a8d.Add(uuid_1f0834d5_a4fc_5d7e_a21f_2c9c1447243d);
            Hub.Hub._gates.call_client(client_uuid_268d2967_7c6f_34d2_80c7_77a6da2f6124, "battle_client_replace_peak_strength", _argv_b6124ca7_ba56_39b8_9566_45bca78f3a8d);

            var cb_replace_peak_strength_obj = new battle_client_replace_peak_strength_cb(uuid_1f0834d5_a4fc_5d7e_a21f_2c9c1447243d, rsp_cb_battle_client_handle);
            lock(rsp_cb_battle_client_handle.map_replace_peak_strength)
            {                rsp_cb_battle_client_handle.map_replace_peak_strength.Add(uuid_1f0834d5_a4fc_5d7e_a21f_2c9c1447243d, cb_replace_peak_strength_obj);
            }            return cb_replace_peak_strength_obj;
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
