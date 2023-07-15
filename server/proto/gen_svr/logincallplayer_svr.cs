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
    public class login_player_player_login_no_token_cb
    {
        private UInt64 cb_uuid;
        private login_player_rsp_cb module_rsp_cb;

        public login_player_player_login_no_token_cb(UInt64 _cb_uuid, login_player_rsp_cb _module_rsp_cb)
        {
            cb_uuid = _cb_uuid;
            module_rsp_cb = _module_rsp_cb;
        }

        public event Action<string> on_player_login_no_token_cb;
        public event Action<Int32> on_player_login_no_token_err;
        public event Action on_player_login_no_token_timeout;

        public login_player_player_login_no_token_cb callBack(Action<string> cb, Action<Int32> err)
        {
            on_player_login_no_token_cb += cb;
            on_player_login_no_token_err += err;
            return this;
        }

        public void timeout(UInt64 tick, Action timeout_cb)
        {
            TinyTimer.add_timer(tick, ()=>{
                module_rsp_cb.player_login_no_token_timeout(cb_uuid);
            });
            on_player_login_no_token_timeout += timeout_cb;
        }

        public void call_cb(string token)
        {
            if (on_player_login_no_token_cb != null)
            {
                on_player_login_no_token_cb(token);
            }
        }

        public void call_err(Int32 err)
        {
            if (on_player_login_no_token_err != null)
            {
                on_player_login_no_token_err(err);
            }
        }

        public void call_timeout()
        {
            if (on_player_login_no_token_timeout != null)
            {
                on_player_login_no_token_timeout();
            }
        }

    }

    public class login_player_player_login_cb
    {
        private UInt64 cb_uuid;
        private login_player_rsp_cb module_rsp_cb;

        public login_player_player_login_cb(UInt64 _cb_uuid, login_player_rsp_cb _module_rsp_cb)
        {
            cb_uuid = _cb_uuid;
            module_rsp_cb = _module_rsp_cb;
        }

        public event Action<string> on_player_login_cb;
        public event Action<Int32> on_player_login_err;
        public event Action on_player_login_timeout;

        public login_player_player_login_cb callBack(Action<string> cb, Action<Int32> err)
        {
            on_player_login_cb += cb;
            on_player_login_err += err;
            return this;
        }

        public void timeout(UInt64 tick, Action timeout_cb)
        {
            TinyTimer.add_timer(tick, ()=>{
                module_rsp_cb.player_login_timeout(cb_uuid);
            });
            on_player_login_timeout += timeout_cb;
        }

        public void call_cb(string token)
        {
            if (on_player_login_cb != null)
            {
                on_player_login_cb(token);
            }
        }

        public void call_err(Int32 err)
        {
            if (on_player_login_err != null)
            {
                on_player_login_err(err);
            }
        }

        public void call_timeout()
        {
            if (on_player_login_timeout != null)
            {
                on_player_login_timeout();
            }
        }

    }

/*this cb code is codegen by abelkhan for c#*/
    public class login_player_rsp_cb : Common.IModule {
        public Dictionary<UInt64, login_player_player_login_no_token_cb> map_player_login_no_token;
        public Dictionary<UInt64, login_player_player_login_cb> map_player_login;
        public login_player_rsp_cb()
        {
            map_player_login_no_token = new Dictionary<UInt64, login_player_player_login_no_token_cb>();
            Hub.Hub._modules.add_mothed("login_player_rsp_cb_player_login_no_token_rsp", player_login_no_token_rsp);
            Hub.Hub._modules.add_mothed("login_player_rsp_cb_player_login_no_token_err", player_login_no_token_err);
            map_player_login = new Dictionary<UInt64, login_player_player_login_cb>();
            Hub.Hub._modules.add_mothed("login_player_rsp_cb_player_login_rsp", player_login_rsp);
            Hub.Hub._modules.add_mothed("login_player_rsp_cb_player_login_err", player_login_err);
        }

        public void player_login_no_token_rsp(IList<MsgPack.MessagePackObject> inArray){
            var uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _token = ((MsgPack.MessagePackObject)inArray[1]).AsString();
            var rsp = try_get_and_del_player_login_no_token_cb(uuid);
            if (rsp != null)
            {
                rsp.call_cb(_token);
            }
        }

        public void player_login_no_token_err(IList<MsgPack.MessagePackObject> inArray){
            var uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _err = ((MsgPack.MessagePackObject)inArray[1]).AsInt32();
            var rsp = try_get_and_del_player_login_no_token_cb(uuid);
            if (rsp != null)
            {
                rsp.call_err(_err);
            }
        }

        public void player_login_no_token_timeout(UInt64 cb_uuid){
            var rsp = try_get_and_del_player_login_no_token_cb(cb_uuid);
            if (rsp != null){
                rsp.call_timeout();
            }
        }

        private login_player_player_login_no_token_cb try_get_and_del_player_login_no_token_cb(UInt64 uuid){
            lock(map_player_login_no_token)
            {
                if (map_player_login_no_token.TryGetValue(uuid, out login_player_player_login_no_token_cb rsp))
                {
                    map_player_login_no_token.Remove(uuid);
                }
                return rsp;
            }
        }

        public void player_login_rsp(IList<MsgPack.MessagePackObject> inArray){
            var uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _token = ((MsgPack.MessagePackObject)inArray[1]).AsString();
            var rsp = try_get_and_del_player_login_cb(uuid);
            if (rsp != null)
            {
                rsp.call_cb(_token);
            }
        }

        public void player_login_err(IList<MsgPack.MessagePackObject> inArray){
            var uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _err = ((MsgPack.MessagePackObject)inArray[1]).AsInt32();
            var rsp = try_get_and_del_player_login_cb(uuid);
            if (rsp != null)
            {
                rsp.call_err(_err);
            }
        }

        public void player_login_timeout(UInt64 cb_uuid){
            var rsp = try_get_and_del_player_login_cb(cb_uuid);
            if (rsp != null){
                rsp.call_timeout();
            }
        }

        private login_player_player_login_cb try_get_and_del_player_login_cb(UInt64 uuid){
            lock(map_player_login)
            {
                if (map_player_login.TryGetValue(uuid, out login_player_player_login_cb rsp))
                {
                    map_player_login.Remove(uuid);
                }
                return rsp;
            }
        }

    }

    public class login_player_caller {
        public static login_player_rsp_cb rsp_cb_login_player_handle = null;
        private ThreadLocal<login_player_hubproxy> _hubproxy;
        public login_player_caller()
        {
            if (rsp_cb_login_player_handle == null)
            {
                rsp_cb_login_player_handle = new login_player_rsp_cb();
            }
            _hubproxy = new ThreadLocal<login_player_hubproxy>();
        }

        public login_player_hubproxy get_hub(string hub_name) {
            if (_hubproxy.Value == null)
{
                _hubproxy.Value = new login_player_hubproxy(rsp_cb_login_player_handle);
            }
            _hubproxy.Value.hub_name_79224a74_5cd5_3ad0_9351_c5e8d06e5c92 = hub_name;
            return _hubproxy.Value;
        }

    }

    public class login_player_hubproxy {
        public string hub_name_79224a74_5cd5_3ad0_9351_c5e8d06e5c92;
        private Int32 uuid_79224a74_5cd5_3ad0_9351_c5e8d06e5c92 = (Int32)RandomUUID.random();

        private login_player_rsp_cb rsp_cb_login_player_handle;

        public login_player_hubproxy(login_player_rsp_cb rsp_cb_login_player_handle_)
        {
            rsp_cb_login_player_handle = rsp_cb_login_player_handle_;
        }

        public login_player_player_login_no_token_cb player_login_no_token(string account){
            var uuid_00017cbe_94c5_56b5_87e2_c5401bf747b7 = (UInt64)Interlocked.Increment(ref uuid_79224a74_5cd5_3ad0_9351_c5e8d06e5c92);

            var _argv_3e2e7610_1bd3_3053_a6cb_55c17d6b8ebf = new ArrayList();
            _argv_3e2e7610_1bd3_3053_a6cb_55c17d6b8ebf.Add(uuid_00017cbe_94c5_56b5_87e2_c5401bf747b7);
            _argv_3e2e7610_1bd3_3053_a6cb_55c17d6b8ebf.Add(account);
            Hub.Hub._hubs.call_hub(hub_name_79224a74_5cd5_3ad0_9351_c5e8d06e5c92, "login_player_player_login_no_token", _argv_3e2e7610_1bd3_3053_a6cb_55c17d6b8ebf);

            var cb_player_login_no_token_obj = new login_player_player_login_no_token_cb(uuid_00017cbe_94c5_56b5_87e2_c5401bf747b7, rsp_cb_login_player_handle);
            lock(rsp_cb_login_player_handle.map_player_login_no_token)
            {
                rsp_cb_login_player_handle.map_player_login_no_token.Add(uuid_00017cbe_94c5_56b5_87e2_c5401bf747b7, cb_player_login_no_token_obj);
            }
            return cb_player_login_no_token_obj;
        }

        public login_player_player_login_cb player_login(string code, string anonymous_code = ""){
            var uuid_ab86d08e_f3b3_5b3e_a2b9_8a2b5c189a51 = (UInt64)Interlocked.Increment(ref uuid_79224a74_5cd5_3ad0_9351_c5e8d06e5c92);

            var _argv_803b03c3_eef6_3b5c_a790_4cd13c6c4e4b = new ArrayList();
            _argv_803b03c3_eef6_3b5c_a790_4cd13c6c4e4b.Add(uuid_ab86d08e_f3b3_5b3e_a2b9_8a2b5c189a51);
            _argv_803b03c3_eef6_3b5c_a790_4cd13c6c4e4b.Add(code);
            _argv_803b03c3_eef6_3b5c_a790_4cd13c6c4e4b.Add(anonymous_code);
            Hub.Hub._hubs.call_hub(hub_name_79224a74_5cd5_3ad0_9351_c5e8d06e5c92, "login_player_player_login", _argv_803b03c3_eef6_3b5c_a790_4cd13c6c4e4b);

            var cb_player_login_obj = new login_player_player_login_cb(uuid_ab86d08e_f3b3_5b3e_a2b9_8a2b5c189a51, rsp_cb_login_player_handle);
            lock(rsp_cb_login_player_handle.map_player_login)
            {
                rsp_cb_login_player_handle.map_player_login.Add(uuid_ab86d08e_f3b3_5b3e_a2b9_8a2b5c189a51, cb_player_login_obj);
            }
            return cb_player_login_obj;
        }

    }
/*this module code is codegen by abelkhan codegen for c#*/
    public class login_player_player_login_no_token_rsp : Common.Response {
        private string _hub_name_3e2e7610_1bd3_3053_a6cb_55c17d6b8ebf;
        private UInt64 uuid_b295d7ce_3d9c_398f_8f6a_ee7a40f01d25;
        public login_player_player_login_no_token_rsp(string hub_name, UInt64 _uuid) 
        {
            _hub_name_3e2e7610_1bd3_3053_a6cb_55c17d6b8ebf = hub_name;
            uuid_b295d7ce_3d9c_398f_8f6a_ee7a40f01d25 = _uuid;
        }

        public void rsp(string token_6333efe6_4f25_3c9a_a58e_52c6c889a79e){
            var _argv_3e2e7610_1bd3_3053_a6cb_55c17d6b8ebf = new ArrayList();
            _argv_3e2e7610_1bd3_3053_a6cb_55c17d6b8ebf.Add(uuid_b295d7ce_3d9c_398f_8f6a_ee7a40f01d25);
            _argv_3e2e7610_1bd3_3053_a6cb_55c17d6b8ebf.Add(token_6333efe6_4f25_3c9a_a58e_52c6c889a79e);
            Hub.Hub._hubs.call_hub(_hub_name_3e2e7610_1bd3_3053_a6cb_55c17d6b8ebf, "login_player_rsp_cb_player_login_no_token_rsp", _argv_3e2e7610_1bd3_3053_a6cb_55c17d6b8ebf);
        }

        public void err(Int32 err_ad2710a2_3dd2_3a8f_a4c8_a7ebbe1df696){
            var _argv_3e2e7610_1bd3_3053_a6cb_55c17d6b8ebf = new ArrayList();
            _argv_3e2e7610_1bd3_3053_a6cb_55c17d6b8ebf.Add(uuid_b295d7ce_3d9c_398f_8f6a_ee7a40f01d25);
            _argv_3e2e7610_1bd3_3053_a6cb_55c17d6b8ebf.Add(err_ad2710a2_3dd2_3a8f_a4c8_a7ebbe1df696);
            Hub.Hub._hubs.call_hub(_hub_name_3e2e7610_1bd3_3053_a6cb_55c17d6b8ebf, "login_player_rsp_cb_player_login_no_token_err", _argv_3e2e7610_1bd3_3053_a6cb_55c17d6b8ebf);
        }

    }

    public class login_player_player_login_rsp : Common.Response {
        private string _hub_name_803b03c3_eef6_3b5c_a790_4cd13c6c4e4b;
        private UInt64 uuid_ade41c97_e005_3aac_9b68_925d09412afe;
        public login_player_player_login_rsp(string hub_name, UInt64 _uuid) 
        {
            _hub_name_803b03c3_eef6_3b5c_a790_4cd13c6c4e4b = hub_name;
            uuid_ade41c97_e005_3aac_9b68_925d09412afe = _uuid;
        }

        public void rsp(string token_6333efe6_4f25_3c9a_a58e_52c6c889a79e){
            var _argv_803b03c3_eef6_3b5c_a790_4cd13c6c4e4b = new ArrayList();
            _argv_803b03c3_eef6_3b5c_a790_4cd13c6c4e4b.Add(uuid_ade41c97_e005_3aac_9b68_925d09412afe);
            _argv_803b03c3_eef6_3b5c_a790_4cd13c6c4e4b.Add(token_6333efe6_4f25_3c9a_a58e_52c6c889a79e);
            Hub.Hub._hubs.call_hub(_hub_name_803b03c3_eef6_3b5c_a790_4cd13c6c4e4b, "login_player_rsp_cb_player_login_rsp", _argv_803b03c3_eef6_3b5c_a790_4cd13c6c4e4b);
        }

        public void err(Int32 err_ad2710a2_3dd2_3a8f_a4c8_a7ebbe1df696){
            var _argv_803b03c3_eef6_3b5c_a790_4cd13c6c4e4b = new ArrayList();
            _argv_803b03c3_eef6_3b5c_a790_4cd13c6c4e4b.Add(uuid_ade41c97_e005_3aac_9b68_925d09412afe);
            _argv_803b03c3_eef6_3b5c_a790_4cd13c6c4e4b.Add(err_ad2710a2_3dd2_3a8f_a4c8_a7ebbe1df696);
            Hub.Hub._hubs.call_hub(_hub_name_803b03c3_eef6_3b5c_a790_4cd13c6c4e4b, "login_player_rsp_cb_player_login_err", _argv_803b03c3_eef6_3b5c_a790_4cd13c6c4e4b);
        }

    }

    public class login_player_module : Common.IModule {
        public login_player_module() 
        {
            Hub.Hub._modules.add_mothed("login_player_player_login_no_token", player_login_no_token);
            Hub.Hub._modules.add_mothed("login_player_player_login", player_login);
        }

        public event Action<string> on_player_login_no_token;
        public void player_login_no_token(IList<MsgPack.MessagePackObject> inArray){
            var _cb_uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _account = ((MsgPack.MessagePackObject)inArray[1]).AsString();
            rsp = new login_player_player_login_no_token_rsp(Hub.Hub._hubs.current_hubproxy.name, _cb_uuid);
            if (on_player_login_no_token != null){
                on_player_login_no_token(_account);
            }
            rsp = null;
        }

        public event Action<string, string> on_player_login;
        public void player_login(IList<MsgPack.MessagePackObject> inArray){
            var _cb_uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _code = ((MsgPack.MessagePackObject)inArray[1]).AsString();
            var _anonymous_code = ((MsgPack.MessagePackObject)inArray[2]).AsString();
            rsp = new login_player_player_login_rsp(Hub.Hub._hubs.current_hubproxy.name, _cb_uuid);
            if (on_player_login != null){
                on_player_login(_code, _anonymous_code);
            }
            rsp = null;
        }

    }

}
