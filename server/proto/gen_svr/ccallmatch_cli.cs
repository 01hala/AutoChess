using System;
using System.Collections;
using System.Collections.Generic;
using System.Threading;
using MsgPack.Serialization;

namespace Abelkhan
{
/*this enum code is codegen by abelkhan codegen for c#*/

/*this struct code is codegen by abelkhan codegen for c#*/
/*this caller code is codegen by abelkhan codegen for c#*/
    public class plan_buy_cb
    {
        private UInt64 cb_uuid;
        private plan_rsp_cb module_rsp_cb;

        public plan_buy_cb(UInt64 _cb_uuid, plan_rsp_cb _module_rsp_cb)
        {
            cb_uuid = _cb_uuid;
            module_rsp_cb = _module_rsp_cb;
        }

        public event Action<UserBattleData> on_buy_cb;
        public event Action<Int32> on_buy_err;
        public event Action on_buy_timeout;

        public plan_buy_cb callBack(Action<UserBattleData> cb, Action<Int32> err)
        {
            on_buy_cb += cb;
            on_buy_err += err;
            return this;
        }

        public void timeout(UInt64 tick, Action timeout_cb)
        {
            TinyTimer.add_timer(tick, ()=>{
                module_rsp_cb.buy_timeout(cb_uuid);
            });
            on_buy_timeout += timeout_cb;
        }

        public void call_cb(UserBattleData info)
        {
            if (on_buy_cb != null)
            {
                on_buy_cb(info);
            }
        }

        public void call_err(Int32 err)
        {
            if (on_buy_err != null)
            {
                on_buy_err(err);
            }
        }

        public void call_timeout()
        {
            if (on_buy_timeout != null)
            {
                on_buy_timeout();
            }
        }

    }

    public class plan_sale_role_cb
    {
        private UInt64 cb_uuid;
        private plan_rsp_cb module_rsp_cb;

        public plan_sale_role_cb(UInt64 _cb_uuid, plan_rsp_cb _module_rsp_cb)
        {
            cb_uuid = _cb_uuid;
            module_rsp_cb = _module_rsp_cb;
        }

        public event Action<UserBattleData> on_sale_role_cb;
        public event Action<Int32> on_sale_role_err;
        public event Action on_sale_role_timeout;

        public plan_sale_role_cb callBack(Action<UserBattleData> cb, Action<Int32> err)
        {
            on_sale_role_cb += cb;
            on_sale_role_err += err;
            return this;
        }

        public void timeout(UInt64 tick, Action timeout_cb)
        {
            TinyTimer.add_timer(tick, ()=>{
                module_rsp_cb.sale_role_timeout(cb_uuid);
            });
            on_sale_role_timeout += timeout_cb;
        }

        public void call_cb(UserBattleData info)
        {
            if (on_sale_role_cb != null)
            {
                on_sale_role_cb(info);
            }
        }

        public void call_err(Int32 err)
        {
            if (on_sale_role_err != null)
            {
                on_sale_role_err(err);
            }
        }

        public void call_timeout()
        {
            if (on_sale_role_timeout != null)
            {
                on_sale_role_timeout();
            }
        }

    }

    public class plan_refresh_cb
    {
        private UInt64 cb_uuid;
        private plan_rsp_cb module_rsp_cb;

        public plan_refresh_cb(UInt64 _cb_uuid, plan_rsp_cb _module_rsp_cb)
        {
            cb_uuid = _cb_uuid;
            module_rsp_cb = _module_rsp_cb;
        }

        public event Action<ShopData> on_refresh_cb;
        public event Action<Int32> on_refresh_err;
        public event Action on_refresh_timeout;

        public plan_refresh_cb callBack(Action<ShopData> cb, Action<Int32> err)
        {
            on_refresh_cb += cb;
            on_refresh_err += err;
            return this;
        }

        public void timeout(UInt64 tick, Action timeout_cb)
        {
            TinyTimer.add_timer(tick, ()=>{
                module_rsp_cb.refresh_timeout(cb_uuid);
            });
            on_refresh_timeout += timeout_cb;
        }

        public void call_cb(ShopData info)
        {
            if (on_refresh_cb != null)
            {
                on_refresh_cb(info);
            }
        }

        public void call_err(Int32 err)
        {
            if (on_refresh_err != null)
            {
                on_refresh_err(err);
            }
        }

        public void call_timeout()
        {
            if (on_refresh_timeout != null)
            {
                on_refresh_timeout();
            }
        }

    }

    public class plan_start_battle_cb
    {
        private UInt64 cb_uuid;
        private plan_rsp_cb module_rsp_cb;

        public plan_start_battle_cb(UInt64 _cb_uuid, plan_rsp_cb _module_rsp_cb)
        {
            cb_uuid = _cb_uuid;
            module_rsp_cb = _module_rsp_cb;
        }

        public event Action<UserBattleData, UserBattleData> on_start_battle_cb;
        public event Action<Int32> on_start_battle_err;
        public event Action on_start_battle_timeout;

        public plan_start_battle_cb callBack(Action<UserBattleData, UserBattleData> cb, Action<Int32> err)
        {
            on_start_battle_cb += cb;
            on_start_battle_err += err;
            return this;
        }

        public void timeout(UInt64 tick, Action timeout_cb)
        {
            TinyTimer.add_timer(tick, ()=>{
                module_rsp_cb.start_battle_timeout(cb_uuid);
            });
            on_start_battle_timeout += timeout_cb;
        }

        public void call_cb(UserBattleData self, UserBattleData target)
        {
            if (on_start_battle_cb != null)
            {
                on_start_battle_cb(self, target);
            }
        }

        public void call_err(Int32 err)
        {
            if (on_start_battle_err != null)
            {
                on_start_battle_err(err);
            }
        }

        public void call_timeout()
        {
            if (on_start_battle_timeout != null)
            {
                on_start_battle_timeout();
            }
        }

    }

/*this cb code is codegen by abelkhan for c#*/
    public class plan_rsp_cb : Common.IModule {
        public Dictionary<UInt64, plan_buy_cb> map_buy;
        public Dictionary<UInt64, plan_sale_role_cb> map_sale_role;
        public Dictionary<UInt64, plan_refresh_cb> map_refresh;
        public Dictionary<UInt64, plan_start_battle_cb> map_start_battle;
        public plan_rsp_cb(Common.ModuleManager modules)
        {
            map_buy = new Dictionary<UInt64, plan_buy_cb>();
            modules.add_mothed("plan_rsp_cb_buy_rsp", buy_rsp);
            modules.add_mothed("plan_rsp_cb_buy_err", buy_err);
            map_sale_role = new Dictionary<UInt64, plan_sale_role_cb>();
            modules.add_mothed("plan_rsp_cb_sale_role_rsp", sale_role_rsp);
            modules.add_mothed("plan_rsp_cb_sale_role_err", sale_role_err);
            map_refresh = new Dictionary<UInt64, plan_refresh_cb>();
            modules.add_mothed("plan_rsp_cb_refresh_rsp", refresh_rsp);
            modules.add_mothed("plan_rsp_cb_refresh_err", refresh_err);
            map_start_battle = new Dictionary<UInt64, plan_start_battle_cb>();
            modules.add_mothed("plan_rsp_cb_start_battle_rsp", start_battle_rsp);
            modules.add_mothed("plan_rsp_cb_start_battle_err", start_battle_err);
        }

        public void buy_rsp(IList<MsgPack.MessagePackObject> inArray){
            var uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _info = UserBattleData.protcol_to_UserBattleData(((MsgPack.MessagePackObject)inArray[1]).AsDictionary());
            var rsp = try_get_and_del_buy_cb(uuid);
            if (rsp != null)
            {
                rsp.call_cb(_info);
            }
        }

        public void buy_err(IList<MsgPack.MessagePackObject> inArray){
            var uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _err = ((MsgPack.MessagePackObject)inArray[1]).AsInt32();
            var rsp = try_get_and_del_buy_cb(uuid);
            if (rsp != null)
            {
                rsp.call_err(_err);
            }
        }

        public void buy_timeout(UInt64 cb_uuid){
            var rsp = try_get_and_del_buy_cb(cb_uuid);
            if (rsp != null){
                rsp.call_timeout();
            }
        }

        private plan_buy_cb try_get_and_del_buy_cb(UInt64 uuid){
            lock(map_buy)
            {
                if (map_buy.TryGetValue(uuid, out plan_buy_cb rsp))
                {
                    map_buy.Remove(uuid);
                }
                return rsp;
            }
        }

        public void sale_role_rsp(IList<MsgPack.MessagePackObject> inArray){
            var uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _info = UserBattleData.protcol_to_UserBattleData(((MsgPack.MessagePackObject)inArray[1]).AsDictionary());
            var rsp = try_get_and_del_sale_role_cb(uuid);
            if (rsp != null)
            {
                rsp.call_cb(_info);
            }
        }

        public void sale_role_err(IList<MsgPack.MessagePackObject> inArray){
            var uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _err = ((MsgPack.MessagePackObject)inArray[1]).AsInt32();
            var rsp = try_get_and_del_sale_role_cb(uuid);
            if (rsp != null)
            {
                rsp.call_err(_err);
            }
        }

        public void sale_role_timeout(UInt64 cb_uuid){
            var rsp = try_get_and_del_sale_role_cb(cb_uuid);
            if (rsp != null){
                rsp.call_timeout();
            }
        }

        private plan_sale_role_cb try_get_and_del_sale_role_cb(UInt64 uuid){
            lock(map_sale_role)
            {
                if (map_sale_role.TryGetValue(uuid, out plan_sale_role_cb rsp))
                {
                    map_sale_role.Remove(uuid);
                }
                return rsp;
            }
        }

        public void refresh_rsp(IList<MsgPack.MessagePackObject> inArray){
            var uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _info = ShopData.protcol_to_ShopData(((MsgPack.MessagePackObject)inArray[1]).AsDictionary());
            var rsp = try_get_and_del_refresh_cb(uuid);
            if (rsp != null)
            {
                rsp.call_cb(_info);
            }
        }

        public void refresh_err(IList<MsgPack.MessagePackObject> inArray){
            var uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _err = ((MsgPack.MessagePackObject)inArray[1]).AsInt32();
            var rsp = try_get_and_del_refresh_cb(uuid);
            if (rsp != null)
            {
                rsp.call_err(_err);
            }
        }

        public void refresh_timeout(UInt64 cb_uuid){
            var rsp = try_get_and_del_refresh_cb(cb_uuid);
            if (rsp != null){
                rsp.call_timeout();
            }
        }

        private plan_refresh_cb try_get_and_del_refresh_cb(UInt64 uuid){
            lock(map_refresh)
            {
                if (map_refresh.TryGetValue(uuid, out plan_refresh_cb rsp))
                {
                    map_refresh.Remove(uuid);
                }
                return rsp;
            }
        }

        public void start_battle_rsp(IList<MsgPack.MessagePackObject> inArray){
            var uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _self = UserBattleData.protcol_to_UserBattleData(((MsgPack.MessagePackObject)inArray[1]).AsDictionary());
            var _target = UserBattleData.protcol_to_UserBattleData(((MsgPack.MessagePackObject)inArray[2]).AsDictionary());
            var rsp = try_get_and_del_start_battle_cb(uuid);
            if (rsp != null)
            {
                rsp.call_cb(_self, _target);
            }
        }

        public void start_battle_err(IList<MsgPack.MessagePackObject> inArray){
            var uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _err = ((MsgPack.MessagePackObject)inArray[1]).AsInt32();
            var rsp = try_get_and_del_start_battle_cb(uuid);
            if (rsp != null)
            {
                rsp.call_err(_err);
            }
        }

        public void start_battle_timeout(UInt64 cb_uuid){
            var rsp = try_get_and_del_start_battle_cb(cb_uuid);
            if (rsp != null){
                rsp.call_timeout();
            }
        }

        private plan_start_battle_cb try_get_and_del_start_battle_cb(UInt64 uuid){
            lock(map_start_battle)
            {
                if (map_start_battle.TryGetValue(uuid, out plan_start_battle_cb rsp))
                {
                    map_start_battle.Remove(uuid);
                }
                return rsp;
            }
        }

    }

    public class plan_caller {
        public static plan_rsp_cb rsp_cb_plan_handle = null;
        private ThreadLocal<plan_hubproxy> _hubproxy;
        public Client.Client _client_handle;
        public plan_caller(Client.Client client_handle_) 
        {
            _client_handle = client_handle_;
            if (rsp_cb_plan_handle == null)
            {
                rsp_cb_plan_handle = new plan_rsp_cb(_client_handle.modulemanager);
            }

            _hubproxy = new ThreadLocal<plan_hubproxy>();
        }

        public plan_hubproxy get_hub(string hub_name)
        {
            if (_hubproxy.Value == null)
{
                _hubproxy.Value = new plan_hubproxy(_client_handle, rsp_cb_plan_handle);
            }
            _hubproxy.Value.hub_name_d9e0c25f_1008_3739_9ff9_86e6a3421324 = hub_name;
            return _hubproxy.Value;
        }

    }

    public class plan_hubproxy {
        public string hub_name_d9e0c25f_1008_3739_9ff9_86e6a3421324;
        private Int32 uuid_d9e0c25f_1008_3739_9ff9_86e6a3421324 = (Int32)RandomUUID.random();

        public Client.Client _client_handle;
        public plan_rsp_cb rsp_cb_plan_handle;

        public plan_hubproxy(Client.Client client_handle_, plan_rsp_cb rsp_cb_plan_handle_)
        {
            _client_handle = client_handle_;
            rsp_cb_plan_handle = rsp_cb_plan_handle_;
        }

        public plan_buy_cb buy(Int32 shop_index, Int32 index){
            var uuid_4d846fab_804e_563b_998f_6e40c5d2bd39 = (UInt64)Interlocked.Increment(ref uuid_d9e0c25f_1008_3739_9ff9_86e6a3421324);

            var _argv_8e620315_ff2a_3f9c_a655_464ce392ed2d = new ArrayList();
            _argv_8e620315_ff2a_3f9c_a655_464ce392ed2d.Add(uuid_4d846fab_804e_563b_998f_6e40c5d2bd39);
            _argv_8e620315_ff2a_3f9c_a655_464ce392ed2d.Add(shop_index);
            _argv_8e620315_ff2a_3f9c_a655_464ce392ed2d.Add(index);
            _client_handle.call_hub(hub_name_d9e0c25f_1008_3739_9ff9_86e6a3421324, "plan_buy", _argv_8e620315_ff2a_3f9c_a655_464ce392ed2d);

            var cb_buy_obj = new plan_buy_cb(uuid_4d846fab_804e_563b_998f_6e40c5d2bd39, rsp_cb_plan_handle);
            lock(rsp_cb_plan_handle.map_buy)
            {                rsp_cb_plan_handle.map_buy.Add(uuid_4d846fab_804e_563b_998f_6e40c5d2bd39, cb_buy_obj);
            }            return cb_buy_obj;
        }

        public plan_sale_role_cb sale_role(Int32 index){
            var uuid_3252fdfb_17bb_50be_adc3_cab5bc7d02a8 = (UInt64)Interlocked.Increment(ref uuid_d9e0c25f_1008_3739_9ff9_86e6a3421324);

            var _argv_10f3503a_6ca9_31ee_9d35_130ca397965f = new ArrayList();
            _argv_10f3503a_6ca9_31ee_9d35_130ca397965f.Add(uuid_3252fdfb_17bb_50be_adc3_cab5bc7d02a8);
            _argv_10f3503a_6ca9_31ee_9d35_130ca397965f.Add(index);
            _client_handle.call_hub(hub_name_d9e0c25f_1008_3739_9ff9_86e6a3421324, "plan_sale_role", _argv_10f3503a_6ca9_31ee_9d35_130ca397965f);

            var cb_sale_role_obj = new plan_sale_role_cb(uuid_3252fdfb_17bb_50be_adc3_cab5bc7d02a8, rsp_cb_plan_handle);
            lock(rsp_cb_plan_handle.map_sale_role)
            {                rsp_cb_plan_handle.map_sale_role.Add(uuid_3252fdfb_17bb_50be_adc3_cab5bc7d02a8, cb_sale_role_obj);
            }            return cb_sale_role_obj;
        }

        public plan_refresh_cb refresh(){
            var uuid_65e3918e_9981_5d51_ab87_6e201954647d = (UInt64)Interlocked.Increment(ref uuid_d9e0c25f_1008_3739_9ff9_86e6a3421324);

            var _argv_97f4163d_22be_334a_ad37_ab1f786ceb46 = new ArrayList();
            _argv_97f4163d_22be_334a_ad37_ab1f786ceb46.Add(uuid_65e3918e_9981_5d51_ab87_6e201954647d);
            _client_handle.call_hub(hub_name_d9e0c25f_1008_3739_9ff9_86e6a3421324, "plan_refresh", _argv_97f4163d_22be_334a_ad37_ab1f786ceb46);

            var cb_refresh_obj = new plan_refresh_cb(uuid_65e3918e_9981_5d51_ab87_6e201954647d, rsp_cb_plan_handle);
            lock(rsp_cb_plan_handle.map_refresh)
            {                rsp_cb_plan_handle.map_refresh.Add(uuid_65e3918e_9981_5d51_ab87_6e201954647d, cb_refresh_obj);
            }            return cb_refresh_obj;
        }

        public plan_start_battle_cb start_battle(){
            var uuid_21a74a63_a13c_539e_b2bc_ef5069375dba = (UInt64)Interlocked.Increment(ref uuid_d9e0c25f_1008_3739_9ff9_86e6a3421324);

            var _argv_01e120b2_ff3e_35bc_b812_e0d6fa294873 = new ArrayList();
            _argv_01e120b2_ff3e_35bc_b812_e0d6fa294873.Add(uuid_21a74a63_a13c_539e_b2bc_ef5069375dba);
            _client_handle.call_hub(hub_name_d9e0c25f_1008_3739_9ff9_86e6a3421324, "plan_start_battle", _argv_01e120b2_ff3e_35bc_b812_e0d6fa294873);

            var cb_start_battle_obj = new plan_start_battle_cb(uuid_21a74a63_a13c_539e_b2bc_ef5069375dba, rsp_cb_plan_handle);
            lock(rsp_cb_plan_handle.map_start_battle)
            {                rsp_cb_plan_handle.map_start_battle.Add(uuid_21a74a63_a13c_539e_b2bc_ef5069375dba, cb_start_battle_obj);
            }            return cb_start_battle_obj;
        }

    }

}
