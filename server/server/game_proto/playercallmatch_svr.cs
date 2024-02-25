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
    public class player_match_start_battle_cb
    {
        private UInt64 cb_uuid;
        private player_match_rsp_cb module_rsp_cb;

        public player_match_start_battle_cb(UInt64 _cb_uuid, player_match_rsp_cb _module_rsp_cb)
        {
            cb_uuid = _cb_uuid;
            module_rsp_cb = _module_rsp_cb;
        }

        public event Action<UserBattleData, ShopData> on_start_battle_cb;
        public event Action<Int32> on_start_battle_err;
        public event Action on_start_battle_timeout;

        public player_match_start_battle_cb callBack(Action<UserBattleData, ShopData> cb, Action<Int32> err)
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

        public void call_cb(UserBattleData battle_info, ShopData shop_info)
        {
            if (on_start_battle_cb != null)
            {
                on_start_battle_cb(battle_info, shop_info);
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

    public class player_match_reconnect_cb
    {
        private UInt64 cb_uuid;
        private player_match_rsp_cb module_rsp_cb;

        public player_match_reconnect_cb(UInt64 _cb_uuid, player_match_rsp_cb _module_rsp_cb)
        {
            cb_uuid = _cb_uuid;
            module_rsp_cb = _module_rsp_cb;
        }

        public event Action<bool> on_reconnect_cb;
        public event Action on_reconnect_err;
        public event Action on_reconnect_timeout;

        public player_match_reconnect_cb callBack(Action<bool> cb, Action err)
        {
            on_reconnect_cb += cb;
            on_reconnect_err += err;
            return this;
        }

        public void timeout(UInt64 tick, Action timeout_cb)
        {
            TinyTimer.add_timer(tick, ()=>{
                module_rsp_cb.reconnect_timeout(cb_uuid);
            });
            on_reconnect_timeout += timeout_cb;
        }

        public void call_cb(bool is_online)
        {
            if (on_reconnect_cb != null)
            {
                on_reconnect_cb(is_online);
            }
        }

        public void call_err()
        {
            if (on_reconnect_err != null)
            {
                on_reconnect_err();
            }
        }

        public void call_timeout()
        {
            if (on_reconnect_timeout != null)
            {
                on_reconnect_timeout();
            }
        }

    }

/*this cb code is codegen by abelkhan for c#*/
    public class player_match_rsp_cb : Common.IModule {
        public Dictionary<UInt64, player_match_start_battle_cb> map_start_battle;
        public Dictionary<UInt64, player_match_reconnect_cb> map_reconnect;
        public player_match_rsp_cb()
        {
            map_start_battle = new Dictionary<UInt64, player_match_start_battle_cb>();
            Hub.Hub._modules.add_mothed("player_match_rsp_cb_start_battle_rsp", start_battle_rsp);
            Hub.Hub._modules.add_mothed("player_match_rsp_cb_start_battle_err", start_battle_err);
            map_reconnect = new Dictionary<UInt64, player_match_reconnect_cb>();
            Hub.Hub._modules.add_mothed("player_match_rsp_cb_reconnect_rsp", reconnect_rsp);
            Hub.Hub._modules.add_mothed("player_match_rsp_cb_reconnect_err", reconnect_err);
        }

        public void start_battle_rsp(IList<MsgPack.MessagePackObject> inArray){
            var uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _battle_info = UserBattleData.protcol_to_UserBattleData(((MsgPack.MessagePackObject)inArray[1]).AsDictionary());
            var _shop_info = ShopData.protcol_to_ShopData(((MsgPack.MessagePackObject)inArray[2]).AsDictionary());
            var rsp = try_get_and_del_start_battle_cb(uuid);
            if (rsp != null)
            {
                rsp.call_cb(_battle_info, _shop_info);
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

        private player_match_start_battle_cb try_get_and_del_start_battle_cb(UInt64 uuid){
            lock(map_start_battle)
            {
                if (map_start_battle.TryGetValue(uuid, out player_match_start_battle_cb rsp))
                {
                    map_start_battle.Remove(uuid);
                }
                return rsp;
            }
        }

        public void reconnect_rsp(IList<MsgPack.MessagePackObject> inArray){
            var uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _is_online = ((MsgPack.MessagePackObject)inArray[1]).AsBoolean();
            var rsp = try_get_and_del_reconnect_cb(uuid);
            if (rsp != null)
            {
                rsp.call_cb(_is_online);
            }
        }

        public void reconnect_err(IList<MsgPack.MessagePackObject> inArray){
            var uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var rsp = try_get_and_del_reconnect_cb(uuid);
            if (rsp != null)
            {
                rsp.call_err();
            }
        }

        public void reconnect_timeout(UInt64 cb_uuid){
            var rsp = try_get_and_del_reconnect_cb(cb_uuid);
            if (rsp != null){
                rsp.call_timeout();
            }
        }

        private player_match_reconnect_cb try_get_and_del_reconnect_cb(UInt64 uuid){
            lock(map_reconnect)
            {
                if (map_reconnect.TryGetValue(uuid, out player_match_reconnect_cb rsp))
                {
                    map_reconnect.Remove(uuid);
                }
                return rsp;
            }
        }

    }

    public class player_match_caller {
        public static player_match_rsp_cb rsp_cb_player_match_handle = null;
        private ThreadLocal<player_match_hubproxy> _hubproxy;
        public player_match_caller()
        {
            if (rsp_cb_player_match_handle == null)
            {
                rsp_cb_player_match_handle = new player_match_rsp_cb();
            }
            _hubproxy = new ThreadLocal<player_match_hubproxy>();
        }

        public player_match_hubproxy get_hub(string hub_name) {
            if (_hubproxy.Value == null)
{
                _hubproxy.Value = new player_match_hubproxy(rsp_cb_player_match_handle);
            }
            _hubproxy.Value.hub_name_f08f93cd_bfea_3bf2_ae83_42be38c1f420 = hub_name;
            return _hubproxy.Value;
        }

    }

    public class player_match_hubproxy {
        public string hub_name_f08f93cd_bfea_3bf2_ae83_42be38c1f420;
        private Int32 uuid_f08f93cd_bfea_3bf2_ae83_42be38c1f420 = (Int32)RandomUUID.random();

        private player_match_rsp_cb rsp_cb_player_match_handle;

        public player_match_hubproxy(player_match_rsp_cb rsp_cb_player_match_handle_)
        {
            rsp_cb_player_match_handle = rsp_cb_player_match_handle_;
        }

        public player_match_start_battle_cb start_battle(string client_uuid, List<Int32> role_list){
            var uuid_21a74a63_a13c_539e_b2bc_ef5069375dba = (UInt64)Interlocked.Increment(ref uuid_f08f93cd_bfea_3bf2_ae83_42be38c1f420);

            var _argv_01e120b2_ff3e_35bc_b812_e0d6fa294873 = new ArrayList();
            _argv_01e120b2_ff3e_35bc_b812_e0d6fa294873.Add(uuid_21a74a63_a13c_539e_b2bc_ef5069375dba);
            _argv_01e120b2_ff3e_35bc_b812_e0d6fa294873.Add(client_uuid);
            var _array_03c6cb48_755d_38f0_a566_1b564ef0e78d = new ArrayList();
            foreach(var v_9c7e0c91_5849_58a5_953e_3924ee9819a9 in role_list){
                _array_03c6cb48_755d_38f0_a566_1b564ef0e78d.Add(v_9c7e0c91_5849_58a5_953e_3924ee9819a9);
            }
            _argv_01e120b2_ff3e_35bc_b812_e0d6fa294873.Add(_array_03c6cb48_755d_38f0_a566_1b564ef0e78d);
            Hub.Hub._hubs.call_hub(hub_name_f08f93cd_bfea_3bf2_ae83_42be38c1f420, "player_match_start_battle", _argv_01e120b2_ff3e_35bc_b812_e0d6fa294873);

            var cb_start_battle_obj = new player_match_start_battle_cb(uuid_21a74a63_a13c_539e_b2bc_ef5069375dba, rsp_cb_player_match_handle);
            lock(rsp_cb_player_match_handle.map_start_battle)
            {
                rsp_cb_player_match_handle.map_start_battle.Add(uuid_21a74a63_a13c_539e_b2bc_ef5069375dba, cb_start_battle_obj);
            }
            return cb_start_battle_obj;
        }

        public player_match_reconnect_cb reconnect(string old_client_uuid, string new_client_uuid){
            var uuid_7dd9d95e_c232_57eb_ae66_b5c28dd467bc = (UInt64)Interlocked.Increment(ref uuid_f08f93cd_bfea_3bf2_ae83_42be38c1f420);

            var _argv_4d537d38_2de1_3d0c_9909_5db2dcf1671f = new ArrayList();
            _argv_4d537d38_2de1_3d0c_9909_5db2dcf1671f.Add(uuid_7dd9d95e_c232_57eb_ae66_b5c28dd467bc);
            _argv_4d537d38_2de1_3d0c_9909_5db2dcf1671f.Add(old_client_uuid);
            _argv_4d537d38_2de1_3d0c_9909_5db2dcf1671f.Add(new_client_uuid);
            Hub.Hub._hubs.call_hub(hub_name_f08f93cd_bfea_3bf2_ae83_42be38c1f420, "player_match_reconnect", _argv_4d537d38_2de1_3d0c_9909_5db2dcf1671f);

            var cb_reconnect_obj = new player_match_reconnect_cb(uuid_7dd9d95e_c232_57eb_ae66_b5c28dd467bc, rsp_cb_player_match_handle);
            lock(rsp_cb_player_match_handle.map_reconnect)
            {
                rsp_cb_player_match_handle.map_reconnect.Add(uuid_7dd9d95e_c232_57eb_ae66_b5c28dd467bc, cb_reconnect_obj);
            }
            return cb_reconnect_obj;
        }

    }
/*this cb code is codegen by abelkhan for c#*/
    public class match_player_rsp_cb : Common.IModule {
        public match_player_rsp_cb()
        {
        }

    }

    public class match_player_caller {
        public static match_player_rsp_cb rsp_cb_match_player_handle = null;
        private ThreadLocal<match_player_hubproxy> _hubproxy;
        public match_player_caller()
        {
            if (rsp_cb_match_player_handle == null)
            {
                rsp_cb_match_player_handle = new match_player_rsp_cb();
            }
            _hubproxy = new ThreadLocal<match_player_hubproxy>();
        }

        public match_player_hubproxy get_hub(string hub_name) {
            if (_hubproxy.Value == null)
{
                _hubproxy.Value = new match_player_hubproxy(rsp_cb_match_player_handle);
            }
            _hubproxy.Value.hub_name_da7b2c07_3c4d_366b_8def_7fa976df7502 = hub_name;
            return _hubproxy.Value;
        }

    }

    public class match_player_hubproxy {
        public string hub_name_da7b2c07_3c4d_366b_8def_7fa976df7502;
        private Int32 uuid_da7b2c07_3c4d_366b_8def_7fa976df7502 = (Int32)RandomUUID.random();

        private match_player_rsp_cb rsp_cb_match_player_handle;

        public match_player_hubproxy(match_player_rsp_cb rsp_cb_match_player_handle_)
        {
            rsp_cb_match_player_handle = rsp_cb_match_player_handle_;
        }

        public void battle_victory(Int64 guid){
            var _argv_5388fb35_f021_358e_992c_9d18e0f4cfc5 = new ArrayList();
            _argv_5388fb35_f021_358e_992c_9d18e0f4cfc5.Add(guid);
            Hub.Hub._hubs.call_hub(hub_name_da7b2c07_3c4d_366b_8def_7fa976df7502, "match_player_battle_victory", _argv_5388fb35_f021_358e_992c_9d18e0f4cfc5);
        }

    }
/*this module code is codegen by abelkhan codegen for c#*/
    public class player_match_start_battle_rsp : Common.Response {
        private string _hub_name_01e120b2_ff3e_35bc_b812_e0d6fa294873;
        private UInt64 uuid_ee4a9042_3083_3d2e_90e2_aa58942d4f15;
        public player_match_start_battle_rsp(string hub_name, UInt64 _uuid) 
        {
            _hub_name_01e120b2_ff3e_35bc_b812_e0d6fa294873 = hub_name;
            uuid_ee4a9042_3083_3d2e_90e2_aa58942d4f15 = _uuid;
        }

        public void rsp(UserBattleData battle_info_504125a2_a75d_3fa2_9a35_a9fdc5331928, ShopData shop_info_6355a923_2126_3fd5_b568_e5edf6bd36d0){
            var _argv_01e120b2_ff3e_35bc_b812_e0d6fa294873 = new ArrayList();
            _argv_01e120b2_ff3e_35bc_b812_e0d6fa294873.Add(uuid_ee4a9042_3083_3d2e_90e2_aa58942d4f15);
            _argv_01e120b2_ff3e_35bc_b812_e0d6fa294873.Add(UserBattleData.UserBattleData_to_protcol(battle_info_504125a2_a75d_3fa2_9a35_a9fdc5331928));
            _argv_01e120b2_ff3e_35bc_b812_e0d6fa294873.Add(ShopData.ShopData_to_protcol(shop_info_6355a923_2126_3fd5_b568_e5edf6bd36d0));
            Hub.Hub._hubs.call_hub(_hub_name_01e120b2_ff3e_35bc_b812_e0d6fa294873, "player_match_rsp_cb_start_battle_rsp", _argv_01e120b2_ff3e_35bc_b812_e0d6fa294873);
        }

        public void err(Int32 err_ad2710a2_3dd2_3a8f_a4c8_a7ebbe1df696){
            var _argv_01e120b2_ff3e_35bc_b812_e0d6fa294873 = new ArrayList();
            _argv_01e120b2_ff3e_35bc_b812_e0d6fa294873.Add(uuid_ee4a9042_3083_3d2e_90e2_aa58942d4f15);
            _argv_01e120b2_ff3e_35bc_b812_e0d6fa294873.Add(err_ad2710a2_3dd2_3a8f_a4c8_a7ebbe1df696);
            Hub.Hub._hubs.call_hub(_hub_name_01e120b2_ff3e_35bc_b812_e0d6fa294873, "player_match_rsp_cb_start_battle_err", _argv_01e120b2_ff3e_35bc_b812_e0d6fa294873);
        }

    }

    public class player_match_reconnect_rsp : Common.Response {
        private string _hub_name_4d537d38_2de1_3d0c_9909_5db2dcf1671f;
        private UInt64 uuid_a79a6246_6113_35d3_9f8b_f4f2d51db9cc;
        public player_match_reconnect_rsp(string hub_name, UInt64 _uuid) 
        {
            _hub_name_4d537d38_2de1_3d0c_9909_5db2dcf1671f = hub_name;
            uuid_a79a6246_6113_35d3_9f8b_f4f2d51db9cc = _uuid;
        }

        public void rsp(bool is_online_5acf7858_144c_3574_88c6_55932a9e2c73){
            var _argv_4d537d38_2de1_3d0c_9909_5db2dcf1671f = new ArrayList();
            _argv_4d537d38_2de1_3d0c_9909_5db2dcf1671f.Add(uuid_a79a6246_6113_35d3_9f8b_f4f2d51db9cc);
            _argv_4d537d38_2de1_3d0c_9909_5db2dcf1671f.Add(is_online_5acf7858_144c_3574_88c6_55932a9e2c73);
            Hub.Hub._hubs.call_hub(_hub_name_4d537d38_2de1_3d0c_9909_5db2dcf1671f, "player_match_rsp_cb_reconnect_rsp", _argv_4d537d38_2de1_3d0c_9909_5db2dcf1671f);
        }

        public void err(){
            var _argv_4d537d38_2de1_3d0c_9909_5db2dcf1671f = new ArrayList();
            _argv_4d537d38_2de1_3d0c_9909_5db2dcf1671f.Add(uuid_a79a6246_6113_35d3_9f8b_f4f2d51db9cc);
            Hub.Hub._hubs.call_hub(_hub_name_4d537d38_2de1_3d0c_9909_5db2dcf1671f, "player_match_rsp_cb_reconnect_err", _argv_4d537d38_2de1_3d0c_9909_5db2dcf1671f);
        }

    }

    public class player_match_module : Common.IModule {
        public player_match_module() 
        {
            Hub.Hub._modules.add_mothed("player_match_start_battle", start_battle);
            Hub.Hub._modules.add_mothed("player_match_reconnect", reconnect);
        }

        public event Action<string, List<Int32>> on_start_battle;
        public void start_battle(IList<MsgPack.MessagePackObject> inArray){
            var _cb_uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _client_uuid = ((MsgPack.MessagePackObject)inArray[1]).AsString();
            var _role_list = new List<Int32>();
            var _protocol_arrayrole_list = ((MsgPack.MessagePackObject)inArray[2]).AsList();
            foreach (var v_9797f049_d836_5d18_abd6_91a05cfcd191 in _protocol_arrayrole_list){
                _role_list.Add(((MsgPack.MessagePackObject)v_9797f049_d836_5d18_abd6_91a05cfcd191).AsInt32());
            }
            rsp = new player_match_start_battle_rsp(Hub.Hub._hubs.current_hubproxy.name, _cb_uuid);
            if (on_start_battle != null){
                on_start_battle(_client_uuid, _role_list);
            }
            rsp = null;
        }

        public event Action<string, string> on_reconnect;
        public void reconnect(IList<MsgPack.MessagePackObject> inArray){
            var _cb_uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _old_client_uuid = ((MsgPack.MessagePackObject)inArray[1]).AsString();
            var _new_client_uuid = ((MsgPack.MessagePackObject)inArray[2]).AsString();
            rsp = new player_match_reconnect_rsp(Hub.Hub._hubs.current_hubproxy.name, _cb_uuid);
            if (on_reconnect != null){
                on_reconnect(_old_client_uuid, _new_client_uuid);
            }
            rsp = null;
        }

    }
    public class match_player_module : Common.IModule {
        public match_player_module() 
        {
            Hub.Hub._modules.add_mothed("match_player_battle_victory", battle_victory);
        }

        public event Action<Int64> on_battle_victory;
        public void battle_victory(IList<MsgPack.MessagePackObject> inArray){
            var _guid = ((MsgPack.MessagePackObject)inArray[0]).AsInt64();
            if (on_battle_victory != null){
                on_battle_victory(_guid);
            }
        }

    }

}
