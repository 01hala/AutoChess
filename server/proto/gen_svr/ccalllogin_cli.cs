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
    public class login_player_login_no_token_cb
    {
        private UInt64 cb_uuid;
        private login_rsp_cb module_rsp_cb;

        public login_player_login_no_token_cb(UInt64 _cb_uuid, login_rsp_cb _module_rsp_cb)
        {
            cb_uuid = _cb_uuid;
            module_rsp_cb = _module_rsp_cb;
        }

        public event Action<string, string> on_player_login_no_token_cb;
        public event Action<Int32> on_player_login_no_token_err;
        public event Action on_player_login_no_token_timeout;

        public login_player_login_no_token_cb callBack(Action<string, string> cb, Action<Int32> err)
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

        public void call_cb(string player_hub_name, string token)
        {
            if (on_player_login_no_token_cb != null)
            {
                on_player_login_no_token_cb(player_hub_name, token);
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

    public class login_player_login_dy_cb
    {
        private UInt64 cb_uuid;
        private login_rsp_cb module_rsp_cb;

        public login_player_login_dy_cb(UInt64 _cb_uuid, login_rsp_cb _module_rsp_cb)
        {
            cb_uuid = _cb_uuid;
            module_rsp_cb = _module_rsp_cb;
        }

        public event Action<string, string> on_player_login_dy_cb;
        public event Action<Int32> on_player_login_dy_err;
        public event Action on_player_login_dy_timeout;

        public login_player_login_dy_cb callBack(Action<string, string> cb, Action<Int32> err)
        {
            on_player_login_dy_cb += cb;
            on_player_login_dy_err += err;
            return this;
        }

        public void timeout(UInt64 tick, Action timeout_cb)
        {
            TinyTimer.add_timer(tick, ()=>{
                module_rsp_cb.player_login_dy_timeout(cb_uuid);
            });
            on_player_login_dy_timeout += timeout_cb;
        }

        public void call_cb(string player_hub_name, string token)
        {
            if (on_player_login_dy_cb != null)
            {
                on_player_login_dy_cb(player_hub_name, token);
            }
        }

        public void call_err(Int32 err)
        {
            if (on_player_login_dy_err != null)
            {
                on_player_login_dy_err(err);
            }
        }

        public void call_timeout()
        {
            if (on_player_login_dy_timeout != null)
            {
                on_player_login_dy_timeout();
            }
        }

    }

/*this cb code is codegen by abelkhan for c#*/
    public class login_rsp_cb : Common.IModule {
        public Dictionary<UInt64, login_player_login_no_token_cb> map_player_login_no_token;
        public Dictionary<UInt64, login_player_login_dy_cb> map_player_login_dy;
        public login_rsp_cb(Common.ModuleManager modules)
        {
            map_player_login_no_token = new Dictionary<UInt64, login_player_login_no_token_cb>();
            modules.add_mothed("login_rsp_cb_player_login_no_token_rsp", player_login_no_token_rsp);
            modules.add_mothed("login_rsp_cb_player_login_no_token_err", player_login_no_token_err);
            map_player_login_dy = new Dictionary<UInt64, login_player_login_dy_cb>();
            modules.add_mothed("login_rsp_cb_player_login_dy_rsp", player_login_dy_rsp);
            modules.add_mothed("login_rsp_cb_player_login_dy_err", player_login_dy_err);
        }

        public void player_login_no_token_rsp(IList<MsgPack.MessagePackObject> inArray){
            var uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _player_hub_name = ((MsgPack.MessagePackObject)inArray[1]).AsString();
            var _token = ((MsgPack.MessagePackObject)inArray[2]).AsString();
            var rsp = try_get_and_del_player_login_no_token_cb(uuid);
            if (rsp != null)
            {
                rsp.call_cb(_player_hub_name, _token);
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

        private login_player_login_no_token_cb try_get_and_del_player_login_no_token_cb(UInt64 uuid){
            lock(map_player_login_no_token)
            {
                if (map_player_login_no_token.TryGetValue(uuid, out login_player_login_no_token_cb rsp))
                {
                    map_player_login_no_token.Remove(uuid);
                }
                return rsp;
            }
        }

        public void player_login_dy_rsp(IList<MsgPack.MessagePackObject> inArray){
            var uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _player_hub_name = ((MsgPack.MessagePackObject)inArray[1]).AsString();
            var _token = ((MsgPack.MessagePackObject)inArray[2]).AsString();
            var rsp = try_get_and_del_player_login_dy_cb(uuid);
            if (rsp != null)
            {
                rsp.call_cb(_player_hub_name, _token);
            }
        }

        public void player_login_dy_err(IList<MsgPack.MessagePackObject> inArray){
            var uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _err = ((MsgPack.MessagePackObject)inArray[1]).AsInt32();
            var rsp = try_get_and_del_player_login_dy_cb(uuid);
            if (rsp != null)
            {
                rsp.call_err(_err);
            }
        }

        public void player_login_dy_timeout(UInt64 cb_uuid){
            var rsp = try_get_and_del_player_login_dy_cb(cb_uuid);
            if (rsp != null){
                rsp.call_timeout();
            }
        }

        private login_player_login_dy_cb try_get_and_del_player_login_dy_cb(UInt64 uuid){
            lock(map_player_login_dy)
            {
                if (map_player_login_dy.TryGetValue(uuid, out login_player_login_dy_cb rsp))
                {
                    map_player_login_dy.Remove(uuid);
                }
                return rsp;
            }
        }

    }

    public class login_caller {
        public static login_rsp_cb rsp_cb_login_handle = null;
        private ThreadLocal<login_hubproxy> _hubproxy;
        public Client.Client _client_handle;
        public login_caller(Client.Client client_handle_) 
        {
            _client_handle = client_handle_;
            if (rsp_cb_login_handle == null)
            {
                rsp_cb_login_handle = new login_rsp_cb(_client_handle.modulemanager);
            }

            _hubproxy = new ThreadLocal<login_hubproxy>();
        }

        public login_hubproxy get_hub(string hub_name)
        {
            if (_hubproxy.Value == null)
{
                _hubproxy.Value = new login_hubproxy(_client_handle, rsp_cb_login_handle);
            }
            _hubproxy.Value.hub_name_d3bb20a7_d0fc_3440_bb9e_b3cc0630e2d1 = hub_name;
            return _hubproxy.Value;
        }

    }

    public class login_hubproxy {
        public string hub_name_d3bb20a7_d0fc_3440_bb9e_b3cc0630e2d1;
        private Int32 uuid_d3bb20a7_d0fc_3440_bb9e_b3cc0630e2d1 = (Int32)RandomUUID.random();

        public Client.Client _client_handle;
        public login_rsp_cb rsp_cb_login_handle;

        public login_hubproxy(Client.Client client_handle_, login_rsp_cb rsp_cb_login_handle_)
        {
            _client_handle = client_handle_;
            rsp_cb_login_handle = rsp_cb_login_handle_;
        }

        public login_player_login_no_token_cb player_login_no_token(string account){
            var uuid_00017cbe_94c5_56b5_87e2_c5401bf747b7 = (UInt64)Interlocked.Increment(ref uuid_d3bb20a7_d0fc_3440_bb9e_b3cc0630e2d1);

            var _argv_3e2e7610_1bd3_3053_a6cb_55c17d6b8ebf = new ArrayList();
            _argv_3e2e7610_1bd3_3053_a6cb_55c17d6b8ebf.Add(uuid_00017cbe_94c5_56b5_87e2_c5401bf747b7);
            _argv_3e2e7610_1bd3_3053_a6cb_55c17d6b8ebf.Add(account);
            _client_handle.call_hub(hub_name_d3bb20a7_d0fc_3440_bb9e_b3cc0630e2d1, "login_player_login_no_token", _argv_3e2e7610_1bd3_3053_a6cb_55c17d6b8ebf);

            var cb_player_login_no_token_obj = new login_player_login_no_token_cb(uuid_00017cbe_94c5_56b5_87e2_c5401bf747b7, rsp_cb_login_handle);
            lock(rsp_cb_login_handle.map_player_login_no_token)
            {                rsp_cb_login_handle.map_player_login_no_token.Add(uuid_00017cbe_94c5_56b5_87e2_c5401bf747b7, cb_player_login_no_token_obj);
            }            return cb_player_login_no_token_obj;
        }

        public login_player_login_dy_cb player_login_dy(string code, string anonymous_code = ""){
            var uuid_41189d5f_2aa0_5203_9349_5d5b0b70e055 = (UInt64)Interlocked.Increment(ref uuid_d3bb20a7_d0fc_3440_bb9e_b3cc0630e2d1);

            var _argv_71c7fc76_b480_3603_a181_4245a2f78904 = new ArrayList();
            _argv_71c7fc76_b480_3603_a181_4245a2f78904.Add(uuid_41189d5f_2aa0_5203_9349_5d5b0b70e055);
            _argv_71c7fc76_b480_3603_a181_4245a2f78904.Add(code);
            _argv_71c7fc76_b480_3603_a181_4245a2f78904.Add(anonymous_code);
            _client_handle.call_hub(hub_name_d3bb20a7_d0fc_3440_bb9e_b3cc0630e2d1, "login_player_login_dy", _argv_71c7fc76_b480_3603_a181_4245a2f78904);

            var cb_player_login_dy_obj = new login_player_login_dy_cb(uuid_41189d5f_2aa0_5203_9349_5d5b0b70e055, rsp_cb_login_handle);
            lock(rsp_cb_login_handle.map_player_login_dy)
            {                rsp_cb_login_handle.map_player_login_dy.Add(uuid_41189d5f_2aa0_5203_9349_5d5b0b70e055, cb_player_login_dy_obj);
            }            return cb_player_login_dy_obj;
        }

    }

}
