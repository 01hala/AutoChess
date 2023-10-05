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

        public event Action<UserBattleData, ShopData> on_buy_cb;
        public event Action<Int32> on_buy_err;
        public event Action on_buy_timeout;

        public plan_buy_cb callBack(Action<UserBattleData, ShopData> cb, Action<Int32> err)
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

        public void call_cb(UserBattleData battle_info, ShopData shop_info)
        {
            if (on_buy_cb != null)
            {
                on_buy_cb(battle_info, shop_info);
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

    public class plan_start_round_cb
    {
        private UInt64 cb_uuid;
        private plan_rsp_cb module_rsp_cb;

        public plan_start_round_cb(UInt64 _cb_uuid, plan_rsp_cb _module_rsp_cb)
        {
            cb_uuid = _cb_uuid;
            module_rsp_cb = _module_rsp_cb;
        }

        public event Action<UserBattleData, UserBattleData> on_start_round_cb;
        public event Action<Int32> on_start_round_err;
        public event Action on_start_round_timeout;

        public plan_start_round_cb callBack(Action<UserBattleData, UserBattleData> cb, Action<Int32> err)
        {
            on_start_round_cb += cb;
            on_start_round_err += err;
            return this;
        }

        public void timeout(UInt64 tick, Action timeout_cb)
        {
            TinyTimer.add_timer(tick, ()=>{
                module_rsp_cb.start_round_timeout(cb_uuid);
            });
            on_start_round_timeout += timeout_cb;
        }

        public void call_cb(UserBattleData self, UserBattleData target)
        {
            if (on_start_round_cb != null)
            {
                on_start_round_cb(self, target);
            }
        }

        public void call_err(Int32 err)
        {
            if (on_start_round_err != null)
            {
                on_start_round_err(err);
            }
        }

        public void call_timeout()
        {
            if (on_start_round_timeout != null)
            {
                on_start_round_timeout();
            }
        }

    }

    public class plan_confirm_round_victory_cb
    {
        private UInt64 cb_uuid;
        private plan_rsp_cb module_rsp_cb;

        public plan_confirm_round_victory_cb(UInt64 _cb_uuid, plan_rsp_cb _module_rsp_cb)
        {
            cb_uuid = _cb_uuid;
            module_rsp_cb = _module_rsp_cb;
        }

        public event Action on_confirm_round_victory_cb;
        public event Action on_confirm_round_victory_err;
        public event Action on_confirm_round_victory_timeout;

        public plan_confirm_round_victory_cb callBack(Action cb, Action err)
        {
            on_confirm_round_victory_cb += cb;
            on_confirm_round_victory_err += err;
            return this;
        }

        public void timeout(UInt64 tick, Action timeout_cb)
        {
            TinyTimer.add_timer(tick, ()=>{
                module_rsp_cb.confirm_round_victory_timeout(cb_uuid);
            });
            on_confirm_round_victory_timeout += timeout_cb;
        }

        public void call_cb()
        {
            if (on_confirm_round_victory_cb != null)
            {
                on_confirm_round_victory_cb();
            }
        }

        public void call_err()
        {
            if (on_confirm_round_victory_err != null)
            {
                on_confirm_round_victory_err();
            }
        }

        public void call_timeout()
        {
            if (on_confirm_round_victory_timeout != null)
            {
                on_confirm_round_victory_timeout();
            }
        }

    }

/*this cb code is codegen by abelkhan for c#*/
    public class plan_rsp_cb : Common.IModule {
        public Dictionary<UInt64, plan_buy_cb> map_buy;
        public Dictionary<UInt64, plan_sale_role_cb> map_sale_role;
        public Dictionary<UInt64, plan_refresh_cb> map_refresh;
        public Dictionary<UInt64, plan_start_round_cb> map_start_round;
        public Dictionary<UInt64, plan_confirm_round_victory_cb> map_confirm_round_victory;
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
            map_start_round = new Dictionary<UInt64, plan_start_round_cb>();
            modules.add_mothed("plan_rsp_cb_start_round_rsp", start_round_rsp);
            modules.add_mothed("plan_rsp_cb_start_round_err", start_round_err);
            map_confirm_round_victory = new Dictionary<UInt64, plan_confirm_round_victory_cb>();
            modules.add_mothed("plan_rsp_cb_confirm_round_victory_rsp", confirm_round_victory_rsp);
            modules.add_mothed("plan_rsp_cb_confirm_round_victory_err", confirm_round_victory_err);
        }

        public void buy_rsp(IList<MsgPack.MessagePackObject> inArray){
            var uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _battle_info = UserBattleData.protcol_to_UserBattleData(((MsgPack.MessagePackObject)inArray[1]).AsDictionary());
            var _shop_info = ShopData.protcol_to_ShopData(((MsgPack.MessagePackObject)inArray[2]).AsDictionary());
            var rsp = try_get_and_del_buy_cb(uuid);
            if (rsp != null)
            {
                rsp.call_cb(_battle_info, _shop_info);
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

        public void start_round_rsp(IList<MsgPack.MessagePackObject> inArray){
            var uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _self = UserBattleData.protcol_to_UserBattleData(((MsgPack.MessagePackObject)inArray[1]).AsDictionary());
            var _target = UserBattleData.protcol_to_UserBattleData(((MsgPack.MessagePackObject)inArray[2]).AsDictionary());
            var rsp = try_get_and_del_start_round_cb(uuid);
            if (rsp != null)
            {
                rsp.call_cb(_self, _target);
            }
        }

        public void start_round_err(IList<MsgPack.MessagePackObject> inArray){
            var uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _err = ((MsgPack.MessagePackObject)inArray[1]).AsInt32();
            var rsp = try_get_and_del_start_round_cb(uuid);
            if (rsp != null)
            {
                rsp.call_err(_err);
            }
        }

        public void start_round_timeout(UInt64 cb_uuid){
            var rsp = try_get_and_del_start_round_cb(cb_uuid);
            if (rsp != null){
                rsp.call_timeout();
            }
        }

        private plan_start_round_cb try_get_and_del_start_round_cb(UInt64 uuid){
            lock(map_start_round)
            {
                if (map_start_round.TryGetValue(uuid, out plan_start_round_cb rsp))
                {
                    map_start_round.Remove(uuid);
                }
                return rsp;
            }
        }

        public void confirm_round_victory_rsp(IList<MsgPack.MessagePackObject> inArray){
            var uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var rsp = try_get_and_del_confirm_round_victory_cb(uuid);
            if (rsp != null)
            {
                rsp.call_cb();
            }
        }

        public void confirm_round_victory_err(IList<MsgPack.MessagePackObject> inArray){
            var uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var rsp = try_get_and_del_confirm_round_victory_cb(uuid);
            if (rsp != null)
            {
                rsp.call_err();
            }
        }

        public void confirm_round_victory_timeout(UInt64 cb_uuid){
            var rsp = try_get_and_del_confirm_round_victory_cb(cb_uuid);
            if (rsp != null){
                rsp.call_timeout();
            }
        }

        private plan_confirm_round_victory_cb try_get_and_del_confirm_round_victory_cb(UInt64 uuid){
            lock(map_confirm_round_victory)
            {
                if (map_confirm_round_victory.TryGetValue(uuid, out plan_confirm_round_victory_cb rsp))
                {
                    map_confirm_round_victory.Remove(uuid);
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

        public plan_buy_cb buy(ShopIndex shop_index, Int32 index){
            var uuid_4d846fab_804e_563b_998f_6e40c5d2bd39 = (UInt64)Interlocked.Increment(ref uuid_d9e0c25f_1008_3739_9ff9_86e6a3421324);

            var _argv_8e620315_ff2a_3f9c_a655_464ce392ed2d = new ArrayList();
            _argv_8e620315_ff2a_3f9c_a655_464ce392ed2d.Add(uuid_4d846fab_804e_563b_998f_6e40c5d2bd39);
            _argv_8e620315_ff2a_3f9c_a655_464ce392ed2d.Add((int)shop_index);
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

        public plan_start_round_cb start_round(){
            var uuid_749771b4_9d43_5dd9_aa87_9201c8f06d41 = (UInt64)Interlocked.Increment(ref uuid_d9e0c25f_1008_3739_9ff9_86e6a3421324);

            var _argv_a79b5af5_d482_3045_beb1_226490350eb9 = new ArrayList();
            _argv_a79b5af5_d482_3045_beb1_226490350eb9.Add(uuid_749771b4_9d43_5dd9_aa87_9201c8f06d41);
            _client_handle.call_hub(hub_name_d9e0c25f_1008_3739_9ff9_86e6a3421324, "plan_start_round", _argv_a79b5af5_d482_3045_beb1_226490350eb9);

            var cb_start_round_obj = new plan_start_round_cb(uuid_749771b4_9d43_5dd9_aa87_9201c8f06d41, rsp_cb_plan_handle);
            lock(rsp_cb_plan_handle.map_start_round)
            {                rsp_cb_plan_handle.map_start_round.Add(uuid_749771b4_9d43_5dd9_aa87_9201c8f06d41, cb_start_round_obj);
            }            return cb_start_round_obj;
        }

        public plan_confirm_round_victory_cb confirm_round_victory(bool is_victory){
            var uuid_e5597e65_791a_5923_ac90_94a6aa039d4f = (UInt64)Interlocked.Increment(ref uuid_d9e0c25f_1008_3739_9ff9_86e6a3421324);

            var _argv_22132c31_7fe4_3f20_affe_f0c3ca2172f0 = new ArrayList();
            _argv_22132c31_7fe4_3f20_affe_f0c3ca2172f0.Add(uuid_e5597e65_791a_5923_ac90_94a6aa039d4f);
            _argv_22132c31_7fe4_3f20_affe_f0c3ca2172f0.Add(is_victory);
            _client_handle.call_hub(hub_name_d9e0c25f_1008_3739_9ff9_86e6a3421324, "plan_confirm_round_victory", _argv_22132c31_7fe4_3f20_affe_f0c3ca2172f0);

            var cb_confirm_round_victory_obj = new plan_confirm_round_victory_cb(uuid_e5597e65_791a_5923_ac90_94a6aa039d4f, rsp_cb_plan_handle);
            lock(rsp_cb_plan_handle.map_confirm_round_victory)
            {                rsp_cb_plan_handle.map_confirm_round_victory.Add(uuid_e5597e65_791a_5923_ac90_94a6aa039d4f, cb_confirm_round_victory_obj);
            }            return cb_confirm_round_victory_obj;
        }

    }

}
