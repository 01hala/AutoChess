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
    public class player_login_player_login_cb
    {
        private UInt64 cb_uuid;
        private player_login_rsp_cb module_rsp_cb;

        public player_login_player_login_cb(UInt64 _cb_uuid, player_login_rsp_cb _module_rsp_cb)
        {
            cb_uuid = _cb_uuid;
            module_rsp_cb = _module_rsp_cb;
        }

        public event Action<UserData> on_player_login_cb;
        public event Action<Int32> on_player_login_err;
        public event Action on_player_login_timeout;

        public player_login_player_login_cb callBack(Action<UserData> cb, Action<Int32> err)
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

        public void call_cb(UserData info)
        {
            if (on_player_login_cb != null)
            {
                on_player_login_cb(info);
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

    public class player_login_create_role_cb
    {
        private UInt64 cb_uuid;
        private player_login_rsp_cb module_rsp_cb;

        public player_login_create_role_cb(UInt64 _cb_uuid, player_login_rsp_cb _module_rsp_cb)
        {
            cb_uuid = _cb_uuid;
            module_rsp_cb = _module_rsp_cb;
        }

        public event Action<UserData> on_create_role_cb;
        public event Action<Int32> on_create_role_err;
        public event Action on_create_role_timeout;

        public player_login_create_role_cb callBack(Action<UserData> cb, Action<Int32> err)
        {
            on_create_role_cb += cb;
            on_create_role_err += err;
            return this;
        }

        public void timeout(UInt64 tick, Action timeout_cb)
        {
            TinyTimer.add_timer(tick, ()=>{
                module_rsp_cb.create_role_timeout(cb_uuid);
            });
            on_create_role_timeout += timeout_cb;
        }

        public void call_cb(UserData info)
        {
            if (on_create_role_cb != null)
            {
                on_create_role_cb(info);
            }
        }

        public void call_err(Int32 err)
        {
            if (on_create_role_err != null)
            {
                on_create_role_err(err);
            }
        }

        public void call_timeout()
        {
            if (on_create_role_timeout != null)
            {
                on_create_role_timeout();
            }
        }

    }

/*this cb code is codegen by abelkhan for c#*/
    public class player_login_rsp_cb : Common.IModule {
        public Dictionary<UInt64, player_login_player_login_cb> map_player_login;
        public Dictionary<UInt64, player_login_create_role_cb> map_create_role;
        public player_login_rsp_cb(Common.ModuleManager modules)
        {
            map_player_login = new Dictionary<UInt64, player_login_player_login_cb>();
            modules.add_mothed("player_login_rsp_cb_player_login_rsp", player_login_rsp);
            modules.add_mothed("player_login_rsp_cb_player_login_err", player_login_err);
            map_create_role = new Dictionary<UInt64, player_login_create_role_cb>();
            modules.add_mothed("player_login_rsp_cb_create_role_rsp", create_role_rsp);
            modules.add_mothed("player_login_rsp_cb_create_role_err", create_role_err);
        }

        public void player_login_rsp(IList<MsgPack.MessagePackObject> inArray){
            var uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _info = UserData.protcol_to_UserData(((MsgPack.MessagePackObject)inArray[1]).AsDictionary());
            var rsp = try_get_and_del_player_login_cb(uuid);
            if (rsp != null)
            {
                rsp.call_cb(_info);
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

        private player_login_player_login_cb try_get_and_del_player_login_cb(UInt64 uuid){
            lock(map_player_login)
            {
                if (map_player_login.TryGetValue(uuid, out player_login_player_login_cb rsp))
                {
                    map_player_login.Remove(uuid);
                }
                return rsp;
            }
        }

        public void create_role_rsp(IList<MsgPack.MessagePackObject> inArray){
            var uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _info = UserData.protcol_to_UserData(((MsgPack.MessagePackObject)inArray[1]).AsDictionary());
            var rsp = try_get_and_del_create_role_cb(uuid);
            if (rsp != null)
            {
                rsp.call_cb(_info);
            }
        }

        public void create_role_err(IList<MsgPack.MessagePackObject> inArray){
            var uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _err = ((MsgPack.MessagePackObject)inArray[1]).AsInt32();
            var rsp = try_get_and_del_create_role_cb(uuid);
            if (rsp != null)
            {
                rsp.call_err(_err);
            }
        }

        public void create_role_timeout(UInt64 cb_uuid){
            var rsp = try_get_and_del_create_role_cb(cb_uuid);
            if (rsp != null){
                rsp.call_timeout();
            }
        }

        private player_login_create_role_cb try_get_and_del_create_role_cb(UInt64 uuid){
            lock(map_create_role)
            {
                if (map_create_role.TryGetValue(uuid, out player_login_create_role_cb rsp))
                {
                    map_create_role.Remove(uuid);
                }
                return rsp;
            }
        }

    }

    public class player_login_caller {
        public static player_login_rsp_cb rsp_cb_player_login_handle = null;
        private ThreadLocal<player_login_hubproxy> _hubproxy;
        public Client.Client _client_handle;
        public player_login_caller(Client.Client client_handle_) 
        {
            _client_handle = client_handle_;
            if (rsp_cb_player_login_handle == null)
            {
                rsp_cb_player_login_handle = new player_login_rsp_cb(_client_handle.modulemanager);
            }

            _hubproxy = new ThreadLocal<player_login_hubproxy>();
        }

        public player_login_hubproxy get_hub(string hub_name)
        {
            if (_hubproxy.Value == null)
{
                _hubproxy.Value = new player_login_hubproxy(_client_handle, rsp_cb_player_login_handle);
            }
            _hubproxy.Value.hub_name_803b03c3_eef6_3b5c_a790_4cd13c6c4e4b = hub_name;
            return _hubproxy.Value;
        }

    }

    public class player_login_hubproxy {
        public string hub_name_803b03c3_eef6_3b5c_a790_4cd13c6c4e4b;
        private Int32 uuid_803b03c3_eef6_3b5c_a790_4cd13c6c4e4b = (Int32)RandomUUID.random();

        public Client.Client _client_handle;
        public player_login_rsp_cb rsp_cb_player_login_handle;

        public player_login_hubproxy(Client.Client client_handle_, player_login_rsp_cb rsp_cb_player_login_handle_)
        {
            _client_handle = client_handle_;
            rsp_cb_player_login_handle = rsp_cb_player_login_handle_;
        }

        public player_login_player_login_cb player_login(string token, string nick_name){
            var uuid_ab86d08e_f3b3_5b3e_a2b9_8a2b5c189a51 = (UInt64)Interlocked.Increment(ref uuid_803b03c3_eef6_3b5c_a790_4cd13c6c4e4b);

            var _argv_803b03c3_eef6_3b5c_a790_4cd13c6c4e4b = new ArrayList();
            _argv_803b03c3_eef6_3b5c_a790_4cd13c6c4e4b.Add(uuid_ab86d08e_f3b3_5b3e_a2b9_8a2b5c189a51);
            _argv_803b03c3_eef6_3b5c_a790_4cd13c6c4e4b.Add(token);
            _argv_803b03c3_eef6_3b5c_a790_4cd13c6c4e4b.Add(nick_name);
            _client_handle.call_hub(hub_name_803b03c3_eef6_3b5c_a790_4cd13c6c4e4b, "player_login_player_login", _argv_803b03c3_eef6_3b5c_a790_4cd13c6c4e4b);

            var cb_player_login_obj = new player_login_player_login_cb(uuid_ab86d08e_f3b3_5b3e_a2b9_8a2b5c189a51, rsp_cb_player_login_handle);
            lock(rsp_cb_player_login_handle.map_player_login)
            {                rsp_cb_player_login_handle.map_player_login.Add(uuid_ab86d08e_f3b3_5b3e_a2b9_8a2b5c189a51, cb_player_login_obj);
            }            return cb_player_login_obj;
        }

        public player_login_create_role_cb create_role(string name, string nick_name){
            var uuid_ef86ed88_4838_5896_8241_9edf3c4b6d21 = (UInt64)Interlocked.Increment(ref uuid_803b03c3_eef6_3b5c_a790_4cd13c6c4e4b);

            var _argv_30293c4a_8f5b_307e_a08a_ff76e003f95d = new ArrayList();
            _argv_30293c4a_8f5b_307e_a08a_ff76e003f95d.Add(uuid_ef86ed88_4838_5896_8241_9edf3c4b6d21);
            _argv_30293c4a_8f5b_307e_a08a_ff76e003f95d.Add(name);
            _argv_30293c4a_8f5b_307e_a08a_ff76e003f95d.Add(nick_name);
            _client_handle.call_hub(hub_name_803b03c3_eef6_3b5c_a790_4cd13c6c4e4b, "player_login_create_role", _argv_30293c4a_8f5b_307e_a08a_ff76e003f95d);

            var cb_create_role_obj = new player_login_create_role_cb(uuid_ef86ed88_4838_5896_8241_9edf3c4b6d21, rsp_cb_player_login_handle);
            lock(rsp_cb_player_login_handle.map_create_role)
            {                rsp_cb_player_login_handle.map_create_role.Add(uuid_ef86ed88_4838_5896_8241_9edf3c4b6d21, cb_create_role_obj);
            }            return cb_create_role_obj;
        }

    }
    public class player_archive_cost_strength_cb
    {
        private UInt64 cb_uuid;
        private player_archive_rsp_cb module_rsp_cb;

        public player_archive_cost_strength_cb(UInt64 _cb_uuid, player_archive_rsp_cb _module_rsp_cb)
        {
            cb_uuid = _cb_uuid;
            module_rsp_cb = _module_rsp_cb;
        }

        public event Action<UserData> on_cost_strength_cb;
        public event Action<Int32> on_cost_strength_err;
        public event Action on_cost_strength_timeout;

        public player_archive_cost_strength_cb callBack(Action<UserData> cb, Action<Int32> err)
        {
            on_cost_strength_cb += cb;
            on_cost_strength_err += err;
            return this;
        }

        public void timeout(UInt64 tick, Action timeout_cb)
        {
            TinyTimer.add_timer(tick, ()=>{
                module_rsp_cb.cost_strength_timeout(cb_uuid);
            });
            on_cost_strength_timeout += timeout_cb;
        }

        public void call_cb(UserData info)
        {
            if (on_cost_strength_cb != null)
            {
                on_cost_strength_cb(info);
            }
        }

        public void call_err(Int32 err)
        {
            if (on_cost_strength_err != null)
            {
                on_cost_strength_err(err);
            }
        }

        public void call_timeout()
        {
            if (on_cost_strength_timeout != null)
            {
                on_cost_strength_timeout();
            }
        }

    }

    public class player_archive_cost_coin_cb
    {
        private UInt64 cb_uuid;
        private player_archive_rsp_cb module_rsp_cb;

        public player_archive_cost_coin_cb(UInt64 _cb_uuid, player_archive_rsp_cb _module_rsp_cb)
        {
            cb_uuid = _cb_uuid;
            module_rsp_cb = _module_rsp_cb;
        }

        public event Action<UserData> on_cost_coin_cb;
        public event Action<Int32> on_cost_coin_err;
        public event Action on_cost_coin_timeout;

        public player_archive_cost_coin_cb callBack(Action<UserData> cb, Action<Int32> err)
        {
            on_cost_coin_cb += cb;
            on_cost_coin_err += err;
            return this;
        }

        public void timeout(UInt64 tick, Action timeout_cb)
        {
            TinyTimer.add_timer(tick, ()=>{
                module_rsp_cb.cost_coin_timeout(cb_uuid);
            });
            on_cost_coin_timeout += timeout_cb;
        }

        public void call_cb(UserData info)
        {
            if (on_cost_coin_cb != null)
            {
                on_cost_coin_cb(info);
            }
        }

        public void call_err(Int32 err)
        {
            if (on_cost_coin_err != null)
            {
                on_cost_coin_err(err);
            }
        }

        public void call_timeout()
        {
            if (on_cost_coin_timeout != null)
            {
                on_cost_coin_timeout();
            }
        }

    }

    public class player_archive_cost_prop_cb
    {
        private UInt64 cb_uuid;
        private player_archive_rsp_cb module_rsp_cb;

        public player_archive_cost_prop_cb(UInt64 _cb_uuid, player_archive_rsp_cb _module_rsp_cb)
        {
            cb_uuid = _cb_uuid;
            module_rsp_cb = _module_rsp_cb;
        }

        public event Action<UserData> on_cost_prop_cb;
        public event Action<Int32> on_cost_prop_err;
        public event Action on_cost_prop_timeout;

        public player_archive_cost_prop_cb callBack(Action<UserData> cb, Action<Int32> err)
        {
            on_cost_prop_cb += cb;
            on_cost_prop_err += err;
            return this;
        }

        public void timeout(UInt64 tick, Action timeout_cb)
        {
            TinyTimer.add_timer(tick, ()=>{
                module_rsp_cb.cost_prop_timeout(cb_uuid);
            });
            on_cost_prop_timeout += timeout_cb;
        }

        public void call_cb(UserData info)
        {
            if (on_cost_prop_cb != null)
            {
                on_cost_prop_cb(info);
            }
        }

        public void call_err(Int32 err)
        {
            if (on_cost_prop_err != null)
            {
                on_cost_prop_err(err);
            }
        }

        public void call_timeout()
        {
            if (on_cost_prop_timeout != null)
            {
                on_cost_prop_timeout();
            }
        }

    }

    public class player_archive_open_chest_cb
    {
        private UInt64 cb_uuid;
        private player_archive_rsp_cb module_rsp_cb;

        public player_archive_open_chest_cb(UInt64 _cb_uuid, player_archive_rsp_cb _module_rsp_cb)
        {
            cb_uuid = _cb_uuid;
            module_rsp_cb = _module_rsp_cb;
        }

        public event Action<UserData> on_open_chest_cb;
        public event Action<Int32> on_open_chest_err;
        public event Action on_open_chest_timeout;

        public player_archive_open_chest_cb callBack(Action<UserData> cb, Action<Int32> err)
        {
            on_open_chest_cb += cb;
            on_open_chest_err += err;
            return this;
        }

        public void timeout(UInt64 tick, Action timeout_cb)
        {
            TinyTimer.add_timer(tick, ()=>{
                module_rsp_cb.open_chest_timeout(cb_uuid);
            });
            on_open_chest_timeout += timeout_cb;
        }

        public void call_cb(UserData info)
        {
            if (on_open_chest_cb != null)
            {
                on_open_chest_cb(info);
            }
        }

        public void call_err(Int32 err)
        {
            if (on_open_chest_err != null)
            {
                on_open_chest_err(err);
            }
        }

        public void call_timeout()
        {
            if (on_open_chest_timeout != null)
            {
                on_open_chest_timeout();
            }
        }

    }

    public class player_archive_add_coin_cb
    {
        private UInt64 cb_uuid;
        private player_archive_rsp_cb module_rsp_cb;

        public player_archive_add_coin_cb(UInt64 _cb_uuid, player_archive_rsp_cb _module_rsp_cb)
        {
            cb_uuid = _cb_uuid;
            module_rsp_cb = _module_rsp_cb;
        }

        public event Action<UserData> on_add_coin_cb;
        public event Action<Int32> on_add_coin_err;
        public event Action on_add_coin_timeout;

        public player_archive_add_coin_cb callBack(Action<UserData> cb, Action<Int32> err)
        {
            on_add_coin_cb += cb;
            on_add_coin_err += err;
            return this;
        }

        public void timeout(UInt64 tick, Action timeout_cb)
        {
            TinyTimer.add_timer(tick, ()=>{
                module_rsp_cb.add_coin_timeout(cb_uuid);
            });
            on_add_coin_timeout += timeout_cb;
        }

        public void call_cb(UserData info)
        {
            if (on_add_coin_cb != null)
            {
                on_add_coin_cb(info);
            }
        }

        public void call_err(Int32 err)
        {
            if (on_add_coin_err != null)
            {
                on_add_coin_err(err);
            }
        }

        public void call_timeout()
        {
            if (on_add_coin_timeout != null)
            {
                on_add_coin_timeout();
            }
        }

    }

    public class player_archive_add_strength_cb
    {
        private UInt64 cb_uuid;
        private player_archive_rsp_cb module_rsp_cb;

        public player_archive_add_strength_cb(UInt64 _cb_uuid, player_archive_rsp_cb _module_rsp_cb)
        {
            cb_uuid = _cb_uuid;
            module_rsp_cb = _module_rsp_cb;
        }

        public event Action<UserData> on_add_strength_cb;
        public event Action<Int32> on_add_strength_err;
        public event Action on_add_strength_timeout;

        public player_archive_add_strength_cb callBack(Action<UserData> cb, Action<Int32> err)
        {
            on_add_strength_cb += cb;
            on_add_strength_err += err;
            return this;
        }

        public void timeout(UInt64 tick, Action timeout_cb)
        {
            TinyTimer.add_timer(tick, ()=>{
                module_rsp_cb.add_strength_timeout(cb_uuid);
            });
            on_add_strength_timeout += timeout_cb;
        }

        public void call_cb(UserData info)
        {
            if (on_add_strength_cb != null)
            {
                on_add_strength_cb(info);
            }
        }

        public void call_err(Int32 err)
        {
            if (on_add_strength_err != null)
            {
                on_add_strength_err(err);
            }
        }

        public void call_timeout()
        {
            if (on_add_strength_timeout != null)
            {
                on_add_strength_timeout();
            }
        }

    }

    public class player_archive_add_skill_cb
    {
        private UInt64 cb_uuid;
        private player_archive_rsp_cb module_rsp_cb;

        public player_archive_add_skill_cb(UInt64 _cb_uuid, player_archive_rsp_cb _module_rsp_cb)
        {
            cb_uuid = _cb_uuid;
            module_rsp_cb = _module_rsp_cb;
        }

        public event Action<UserData> on_add_skill_cb;
        public event Action<Int32> on_add_skill_err;
        public event Action on_add_skill_timeout;

        public player_archive_add_skill_cb callBack(Action<UserData> cb, Action<Int32> err)
        {
            on_add_skill_cb += cb;
            on_add_skill_err += err;
            return this;
        }

        public void timeout(UInt64 tick, Action timeout_cb)
        {
            TinyTimer.add_timer(tick, ()=>{
                module_rsp_cb.add_skill_timeout(cb_uuid);
            });
            on_add_skill_timeout += timeout_cb;
        }

        public void call_cb(UserData info)
        {
            if (on_add_skill_cb != null)
            {
                on_add_skill_cb(info);
            }
        }

        public void call_err(Int32 err)
        {
            if (on_add_skill_err != null)
            {
                on_add_skill_err(err);
            }
        }

        public void call_timeout()
        {
            if (on_add_skill_timeout != null)
            {
                on_add_skill_timeout();
            }
        }

    }

    public class player_archive_add_monster_cb
    {
        private UInt64 cb_uuid;
        private player_archive_rsp_cb module_rsp_cb;

        public player_archive_add_monster_cb(UInt64 _cb_uuid, player_archive_rsp_cb _module_rsp_cb)
        {
            cb_uuid = _cb_uuid;
            module_rsp_cb = _module_rsp_cb;
        }

        public event Action<UserData> on_add_monster_cb;
        public event Action<Int32> on_add_monster_err;
        public event Action on_add_monster_timeout;

        public player_archive_add_monster_cb callBack(Action<UserData> cb, Action<Int32> err)
        {
            on_add_monster_cb += cb;
            on_add_monster_err += err;
            return this;
        }

        public void timeout(UInt64 tick, Action timeout_cb)
        {
            TinyTimer.add_timer(tick, ()=>{
                module_rsp_cb.add_monster_timeout(cb_uuid);
            });
            on_add_monster_timeout += timeout_cb;
        }

        public void call_cb(UserData info)
        {
            if (on_add_monster_cb != null)
            {
                on_add_monster_cb(info);
            }
        }

        public void call_err(Int32 err)
        {
            if (on_add_monster_err != null)
            {
                on_add_monster_err(err);
            }
        }

        public void call_timeout()
        {
            if (on_add_monster_timeout != null)
            {
                on_add_monster_timeout();
            }
        }

    }

/*this cb code is codegen by abelkhan for c#*/
    public class player_archive_rsp_cb : Common.IModule {
        public Dictionary<UInt64, player_archive_cost_strength_cb> map_cost_strength;
        public Dictionary<UInt64, player_archive_cost_coin_cb> map_cost_coin;
        public Dictionary<UInt64, player_archive_cost_prop_cb> map_cost_prop;
        public Dictionary<UInt64, player_archive_open_chest_cb> map_open_chest;
        public Dictionary<UInt64, player_archive_add_coin_cb> map_add_coin;
        public Dictionary<UInt64, player_archive_add_strength_cb> map_add_strength;
        public Dictionary<UInt64, player_archive_add_skill_cb> map_add_skill;
        public Dictionary<UInt64, player_archive_add_monster_cb> map_add_monster;
        public player_archive_rsp_cb(Common.ModuleManager modules)
        {
            map_cost_strength = new Dictionary<UInt64, player_archive_cost_strength_cb>();
            modules.add_mothed("player_archive_rsp_cb_cost_strength_rsp", cost_strength_rsp);
            modules.add_mothed("player_archive_rsp_cb_cost_strength_err", cost_strength_err);
            map_cost_coin = new Dictionary<UInt64, player_archive_cost_coin_cb>();
            modules.add_mothed("player_archive_rsp_cb_cost_coin_rsp", cost_coin_rsp);
            modules.add_mothed("player_archive_rsp_cb_cost_coin_err", cost_coin_err);
            map_cost_prop = new Dictionary<UInt64, player_archive_cost_prop_cb>();
            modules.add_mothed("player_archive_rsp_cb_cost_prop_rsp", cost_prop_rsp);
            modules.add_mothed("player_archive_rsp_cb_cost_prop_err", cost_prop_err);
            map_open_chest = new Dictionary<UInt64, player_archive_open_chest_cb>();
            modules.add_mothed("player_archive_rsp_cb_open_chest_rsp", open_chest_rsp);
            modules.add_mothed("player_archive_rsp_cb_open_chest_err", open_chest_err);
            map_add_coin = new Dictionary<UInt64, player_archive_add_coin_cb>();
            modules.add_mothed("player_archive_rsp_cb_add_coin_rsp", add_coin_rsp);
            modules.add_mothed("player_archive_rsp_cb_add_coin_err", add_coin_err);
            map_add_strength = new Dictionary<UInt64, player_archive_add_strength_cb>();
            modules.add_mothed("player_archive_rsp_cb_add_strength_rsp", add_strength_rsp);
            modules.add_mothed("player_archive_rsp_cb_add_strength_err", add_strength_err);
            map_add_skill = new Dictionary<UInt64, player_archive_add_skill_cb>();
            modules.add_mothed("player_archive_rsp_cb_add_skill_rsp", add_skill_rsp);
            modules.add_mothed("player_archive_rsp_cb_add_skill_err", add_skill_err);
            map_add_monster = new Dictionary<UInt64, player_archive_add_monster_cb>();
            modules.add_mothed("player_archive_rsp_cb_add_monster_rsp", add_monster_rsp);
            modules.add_mothed("player_archive_rsp_cb_add_monster_err", add_monster_err);
        }

        public void cost_strength_rsp(IList<MsgPack.MessagePackObject> inArray){
            var uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _info = UserData.protcol_to_UserData(((MsgPack.MessagePackObject)inArray[1]).AsDictionary());
            var rsp = try_get_and_del_cost_strength_cb(uuid);
            if (rsp != null)
            {
                rsp.call_cb(_info);
            }
        }

        public void cost_strength_err(IList<MsgPack.MessagePackObject> inArray){
            var uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _err = ((MsgPack.MessagePackObject)inArray[1]).AsInt32();
            var rsp = try_get_and_del_cost_strength_cb(uuid);
            if (rsp != null)
            {
                rsp.call_err(_err);
            }
        }

        public void cost_strength_timeout(UInt64 cb_uuid){
            var rsp = try_get_and_del_cost_strength_cb(cb_uuid);
            if (rsp != null){
                rsp.call_timeout();
            }
        }

        private player_archive_cost_strength_cb try_get_and_del_cost_strength_cb(UInt64 uuid){
            lock(map_cost_strength)
            {
                if (map_cost_strength.TryGetValue(uuid, out player_archive_cost_strength_cb rsp))
                {
                    map_cost_strength.Remove(uuid);
                }
                return rsp;
            }
        }

        public void cost_coin_rsp(IList<MsgPack.MessagePackObject> inArray){
            var uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _info = UserData.protcol_to_UserData(((MsgPack.MessagePackObject)inArray[1]).AsDictionary());
            var rsp = try_get_and_del_cost_coin_cb(uuid);
            if (rsp != null)
            {
                rsp.call_cb(_info);
            }
        }

        public void cost_coin_err(IList<MsgPack.MessagePackObject> inArray){
            var uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _err = ((MsgPack.MessagePackObject)inArray[1]).AsInt32();
            var rsp = try_get_and_del_cost_coin_cb(uuid);
            if (rsp != null)
            {
                rsp.call_err(_err);
            }
        }

        public void cost_coin_timeout(UInt64 cb_uuid){
            var rsp = try_get_and_del_cost_coin_cb(cb_uuid);
            if (rsp != null){
                rsp.call_timeout();
            }
        }

        private player_archive_cost_coin_cb try_get_and_del_cost_coin_cb(UInt64 uuid){
            lock(map_cost_coin)
            {
                if (map_cost_coin.TryGetValue(uuid, out player_archive_cost_coin_cb rsp))
                {
                    map_cost_coin.Remove(uuid);
                }
                return rsp;
            }
        }

        public void cost_prop_rsp(IList<MsgPack.MessagePackObject> inArray){
            var uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _info = UserData.protcol_to_UserData(((MsgPack.MessagePackObject)inArray[1]).AsDictionary());
            var rsp = try_get_and_del_cost_prop_cb(uuid);
            if (rsp != null)
            {
                rsp.call_cb(_info);
            }
        }

        public void cost_prop_err(IList<MsgPack.MessagePackObject> inArray){
            var uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _err = ((MsgPack.MessagePackObject)inArray[1]).AsInt32();
            var rsp = try_get_and_del_cost_prop_cb(uuid);
            if (rsp != null)
            {
                rsp.call_err(_err);
            }
        }

        public void cost_prop_timeout(UInt64 cb_uuid){
            var rsp = try_get_and_del_cost_prop_cb(cb_uuid);
            if (rsp != null){
                rsp.call_timeout();
            }
        }

        private player_archive_cost_prop_cb try_get_and_del_cost_prop_cb(UInt64 uuid){
            lock(map_cost_prop)
            {
                if (map_cost_prop.TryGetValue(uuid, out player_archive_cost_prop_cb rsp))
                {
                    map_cost_prop.Remove(uuid);
                }
                return rsp;
            }
        }

        public void open_chest_rsp(IList<MsgPack.MessagePackObject> inArray){
            var uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _info = UserData.protcol_to_UserData(((MsgPack.MessagePackObject)inArray[1]).AsDictionary());
            var rsp = try_get_and_del_open_chest_cb(uuid);
            if (rsp != null)
            {
                rsp.call_cb(_info);
            }
        }

        public void open_chest_err(IList<MsgPack.MessagePackObject> inArray){
            var uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _err = ((MsgPack.MessagePackObject)inArray[1]).AsInt32();
            var rsp = try_get_and_del_open_chest_cb(uuid);
            if (rsp != null)
            {
                rsp.call_err(_err);
            }
        }

        public void open_chest_timeout(UInt64 cb_uuid){
            var rsp = try_get_and_del_open_chest_cb(cb_uuid);
            if (rsp != null){
                rsp.call_timeout();
            }
        }

        private player_archive_open_chest_cb try_get_and_del_open_chest_cb(UInt64 uuid){
            lock(map_open_chest)
            {
                if (map_open_chest.TryGetValue(uuid, out player_archive_open_chest_cb rsp))
                {
                    map_open_chest.Remove(uuid);
                }
                return rsp;
            }
        }

        public void add_coin_rsp(IList<MsgPack.MessagePackObject> inArray){
            var uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _info = UserData.protcol_to_UserData(((MsgPack.MessagePackObject)inArray[1]).AsDictionary());
            var rsp = try_get_and_del_add_coin_cb(uuid);
            if (rsp != null)
            {
                rsp.call_cb(_info);
            }
        }

        public void add_coin_err(IList<MsgPack.MessagePackObject> inArray){
            var uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _err = ((MsgPack.MessagePackObject)inArray[1]).AsInt32();
            var rsp = try_get_and_del_add_coin_cb(uuid);
            if (rsp != null)
            {
                rsp.call_err(_err);
            }
        }

        public void add_coin_timeout(UInt64 cb_uuid){
            var rsp = try_get_and_del_add_coin_cb(cb_uuid);
            if (rsp != null){
                rsp.call_timeout();
            }
        }

        private player_archive_add_coin_cb try_get_and_del_add_coin_cb(UInt64 uuid){
            lock(map_add_coin)
            {
                if (map_add_coin.TryGetValue(uuid, out player_archive_add_coin_cb rsp))
                {
                    map_add_coin.Remove(uuid);
                }
                return rsp;
            }
        }

        public void add_strength_rsp(IList<MsgPack.MessagePackObject> inArray){
            var uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _info = UserData.protcol_to_UserData(((MsgPack.MessagePackObject)inArray[1]).AsDictionary());
            var rsp = try_get_and_del_add_strength_cb(uuid);
            if (rsp != null)
            {
                rsp.call_cb(_info);
            }
        }

        public void add_strength_err(IList<MsgPack.MessagePackObject> inArray){
            var uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _err = ((MsgPack.MessagePackObject)inArray[1]).AsInt32();
            var rsp = try_get_and_del_add_strength_cb(uuid);
            if (rsp != null)
            {
                rsp.call_err(_err);
            }
        }

        public void add_strength_timeout(UInt64 cb_uuid){
            var rsp = try_get_and_del_add_strength_cb(cb_uuid);
            if (rsp != null){
                rsp.call_timeout();
            }
        }

        private player_archive_add_strength_cb try_get_and_del_add_strength_cb(UInt64 uuid){
            lock(map_add_strength)
            {
                if (map_add_strength.TryGetValue(uuid, out player_archive_add_strength_cb rsp))
                {
                    map_add_strength.Remove(uuid);
                }
                return rsp;
            }
        }

        public void add_skill_rsp(IList<MsgPack.MessagePackObject> inArray){
            var uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _info = UserData.protcol_to_UserData(((MsgPack.MessagePackObject)inArray[1]).AsDictionary());
            var rsp = try_get_and_del_add_skill_cb(uuid);
            if (rsp != null)
            {
                rsp.call_cb(_info);
            }
        }

        public void add_skill_err(IList<MsgPack.MessagePackObject> inArray){
            var uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _err = ((MsgPack.MessagePackObject)inArray[1]).AsInt32();
            var rsp = try_get_and_del_add_skill_cb(uuid);
            if (rsp != null)
            {
                rsp.call_err(_err);
            }
        }

        public void add_skill_timeout(UInt64 cb_uuid){
            var rsp = try_get_and_del_add_skill_cb(cb_uuid);
            if (rsp != null){
                rsp.call_timeout();
            }
        }

        private player_archive_add_skill_cb try_get_and_del_add_skill_cb(UInt64 uuid){
            lock(map_add_skill)
            {
                if (map_add_skill.TryGetValue(uuid, out player_archive_add_skill_cb rsp))
                {
                    map_add_skill.Remove(uuid);
                }
                return rsp;
            }
        }

        public void add_monster_rsp(IList<MsgPack.MessagePackObject> inArray){
            var uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _info = UserData.protcol_to_UserData(((MsgPack.MessagePackObject)inArray[1]).AsDictionary());
            var rsp = try_get_and_del_add_monster_cb(uuid);
            if (rsp != null)
            {
                rsp.call_cb(_info);
            }
        }

        public void add_monster_err(IList<MsgPack.MessagePackObject> inArray){
            var uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _err = ((MsgPack.MessagePackObject)inArray[1]).AsInt32();
            var rsp = try_get_and_del_add_monster_cb(uuid);
            if (rsp != null)
            {
                rsp.call_err(_err);
            }
        }

        public void add_monster_timeout(UInt64 cb_uuid){
            var rsp = try_get_and_del_add_monster_cb(cb_uuid);
            if (rsp != null){
                rsp.call_timeout();
            }
        }

        private player_archive_add_monster_cb try_get_and_del_add_monster_cb(UInt64 uuid){
            lock(map_add_monster)
            {
                if (map_add_monster.TryGetValue(uuid, out player_archive_add_monster_cb rsp))
                {
                    map_add_monster.Remove(uuid);
                }
                return rsp;
            }
        }

    }

    public class player_archive_caller {
        public static player_archive_rsp_cb rsp_cb_player_archive_handle = null;
        private ThreadLocal<player_archive_hubproxy> _hubproxy;
        public Client.Client _client_handle;
        public player_archive_caller(Client.Client client_handle_) 
        {
            _client_handle = client_handle_;
            if (rsp_cb_player_archive_handle == null)
            {
                rsp_cb_player_archive_handle = new player_archive_rsp_cb(_client_handle.modulemanager);
            }

            _hubproxy = new ThreadLocal<player_archive_hubproxy>();
        }

        public player_archive_hubproxy get_hub(string hub_name)
        {
            if (_hubproxy.Value == null)
{
                _hubproxy.Value = new player_archive_hubproxy(_client_handle, rsp_cb_player_archive_handle);
            }
            _hubproxy.Value.hub_name_229b670b_b203_3780_89af_1bc6486bd86f = hub_name;
            return _hubproxy.Value;
        }

    }

    public class player_archive_hubproxy {
        public string hub_name_229b670b_b203_3780_89af_1bc6486bd86f;
        private Int32 uuid_229b670b_b203_3780_89af_1bc6486bd86f = (Int32)RandomUUID.random();

        public Client.Client _client_handle;
        public player_archive_rsp_cb rsp_cb_player_archive_handle;

        public player_archive_hubproxy(Client.Client client_handle_, player_archive_rsp_cb rsp_cb_player_archive_handle_)
        {
            _client_handle = client_handle_;
            rsp_cb_player_archive_handle = rsp_cb_player_archive_handle_;
        }

        public player_archive_cost_strength_cb cost_strength(Int32 strength){
            var uuid_20fc04b0_1384_5a5e_a1ce_d79c07d25765 = (UInt64)Interlocked.Increment(ref uuid_229b670b_b203_3780_89af_1bc6486bd86f);

            var _argv_c1f5a2a8_b494_3f28_8814_9be35e02be6a = new ArrayList();
            _argv_c1f5a2a8_b494_3f28_8814_9be35e02be6a.Add(uuid_20fc04b0_1384_5a5e_a1ce_d79c07d25765);
            _argv_c1f5a2a8_b494_3f28_8814_9be35e02be6a.Add(strength);
            _client_handle.call_hub(hub_name_229b670b_b203_3780_89af_1bc6486bd86f, "player_archive_cost_strength", _argv_c1f5a2a8_b494_3f28_8814_9be35e02be6a);

            var cb_cost_strength_obj = new player_archive_cost_strength_cb(uuid_20fc04b0_1384_5a5e_a1ce_d79c07d25765, rsp_cb_player_archive_handle);
            lock(rsp_cb_player_archive_handle.map_cost_strength)
            {                rsp_cb_player_archive_handle.map_cost_strength.Add(uuid_20fc04b0_1384_5a5e_a1ce_d79c07d25765, cb_cost_strength_obj);
            }            return cb_cost_strength_obj;
        }

        public player_archive_cost_coin_cb cost_coin(Int32 cost_amount, EMCostCoinPath cost_path, Int32 role_id){
            var uuid_dd194c99_4357_5e15_ada5_e1b081535e5b = (UInt64)Interlocked.Increment(ref uuid_229b670b_b203_3780_89af_1bc6486bd86f);

            var _argv_ad552213_ca1e_3b02_b853_b56e3a935d76 = new ArrayList();
            _argv_ad552213_ca1e_3b02_b853_b56e3a935d76.Add(uuid_dd194c99_4357_5e15_ada5_e1b081535e5b);
            _argv_ad552213_ca1e_3b02_b853_b56e3a935d76.Add(cost_amount);
            _argv_ad552213_ca1e_3b02_b853_b56e3a935d76.Add((int)cost_path);
            _argv_ad552213_ca1e_3b02_b853_b56e3a935d76.Add(role_id);
            _client_handle.call_hub(hub_name_229b670b_b203_3780_89af_1bc6486bd86f, "player_archive_cost_coin", _argv_ad552213_ca1e_3b02_b853_b56e3a935d76);

            var cb_cost_coin_obj = new player_archive_cost_coin_cb(uuid_dd194c99_4357_5e15_ada5_e1b081535e5b, rsp_cb_player_archive_handle);
            lock(rsp_cb_player_archive_handle.map_cost_coin)
            {                rsp_cb_player_archive_handle.map_cost_coin.Add(uuid_dd194c99_4357_5e15_ada5_e1b081535e5b, cb_cost_coin_obj);
            }            return cb_cost_coin_obj;
        }

        public player_archive_cost_prop_cb cost_prop(Int32 prop_id){
            var uuid_14d1bbdf_0ef3_5a64_b0a6_cf2b3566c509 = (UInt64)Interlocked.Increment(ref uuid_229b670b_b203_3780_89af_1bc6486bd86f);

            var _argv_04acb15b_4368_3e92_b7d5_054cc5c47f8c = new ArrayList();
            _argv_04acb15b_4368_3e92_b7d5_054cc5c47f8c.Add(uuid_14d1bbdf_0ef3_5a64_b0a6_cf2b3566c509);
            _argv_04acb15b_4368_3e92_b7d5_054cc5c47f8c.Add(prop_id);
            _client_handle.call_hub(hub_name_229b670b_b203_3780_89af_1bc6486bd86f, "player_archive_cost_prop", _argv_04acb15b_4368_3e92_b7d5_054cc5c47f8c);

            var cb_cost_prop_obj = new player_archive_cost_prop_cb(uuid_14d1bbdf_0ef3_5a64_b0a6_cf2b3566c509, rsp_cb_player_archive_handle);
            lock(rsp_cb_player_archive_handle.map_cost_prop)
            {                rsp_cb_player_archive_handle.map_cost_prop.Add(uuid_14d1bbdf_0ef3_5a64_b0a6_cf2b3566c509, cb_cost_prop_obj);
            }            return cb_cost_prop_obj;
        }

        public player_archive_open_chest_cb open_chest(EMChestType chest_type){
            var uuid_614c6a3c_6143_5270_b88b_6692c403f7c2 = (UInt64)Interlocked.Increment(ref uuid_229b670b_b203_3780_89af_1bc6486bd86f);

            var _argv_d0593737_5916_31e8_815b_8e30421f4a32 = new ArrayList();
            _argv_d0593737_5916_31e8_815b_8e30421f4a32.Add(uuid_614c6a3c_6143_5270_b88b_6692c403f7c2);
            _argv_d0593737_5916_31e8_815b_8e30421f4a32.Add((int)chest_type);
            _client_handle.call_hub(hub_name_229b670b_b203_3780_89af_1bc6486bd86f, "player_archive_open_chest", _argv_d0593737_5916_31e8_815b_8e30421f4a32);

            var cb_open_chest_obj = new player_archive_open_chest_cb(uuid_614c6a3c_6143_5270_b88b_6692c403f7c2, rsp_cb_player_archive_handle);
            lock(rsp_cb_player_archive_handle.map_open_chest)
            {                rsp_cb_player_archive_handle.map_open_chest.Add(uuid_614c6a3c_6143_5270_b88b_6692c403f7c2, cb_open_chest_obj);
            }            return cb_open_chest_obj;
        }

        public player_archive_add_coin_cb add_coin(Int32 coin){
            var uuid_7e673e35_4856_5782_bc09_f374dc03f12f = (UInt64)Interlocked.Increment(ref uuid_229b670b_b203_3780_89af_1bc6486bd86f);

            var _argv_68d61429_8f03_329b_a588_1069fa6d4cff = new ArrayList();
            _argv_68d61429_8f03_329b_a588_1069fa6d4cff.Add(uuid_7e673e35_4856_5782_bc09_f374dc03f12f);
            _argv_68d61429_8f03_329b_a588_1069fa6d4cff.Add(coin);
            _client_handle.call_hub(hub_name_229b670b_b203_3780_89af_1bc6486bd86f, "player_archive_add_coin", _argv_68d61429_8f03_329b_a588_1069fa6d4cff);

            var cb_add_coin_obj = new player_archive_add_coin_cb(uuid_7e673e35_4856_5782_bc09_f374dc03f12f, rsp_cb_player_archive_handle);
            lock(rsp_cb_player_archive_handle.map_add_coin)
            {                rsp_cb_player_archive_handle.map_add_coin.Add(uuid_7e673e35_4856_5782_bc09_f374dc03f12f, cb_add_coin_obj);
            }            return cb_add_coin_obj;
        }

        public player_archive_add_strength_cb add_strength(Int32 strength){
            var uuid_4c903a19_b7bb_53ab_85de_0271356f2cf8 = (UInt64)Interlocked.Increment(ref uuid_229b670b_b203_3780_89af_1bc6486bd86f);

            var _argv_424d3381_ff2c_37eb_a44a_fd95f504b1e4 = new ArrayList();
            _argv_424d3381_ff2c_37eb_a44a_fd95f504b1e4.Add(uuid_4c903a19_b7bb_53ab_85de_0271356f2cf8);
            _argv_424d3381_ff2c_37eb_a44a_fd95f504b1e4.Add(strength);
            _client_handle.call_hub(hub_name_229b670b_b203_3780_89af_1bc6486bd86f, "player_archive_add_strength", _argv_424d3381_ff2c_37eb_a44a_fd95f504b1e4);

            var cb_add_strength_obj = new player_archive_add_strength_cb(uuid_4c903a19_b7bb_53ab_85de_0271356f2cf8, rsp_cb_player_archive_handle);
            lock(rsp_cb_player_archive_handle.map_add_strength)
            {                rsp_cb_player_archive_handle.map_add_strength.Add(uuid_4c903a19_b7bb_53ab_85de_0271356f2cf8, cb_add_strength_obj);
            }            return cb_add_strength_obj;
        }

        public player_archive_add_skill_cb add_skill(Skill skill){
            var uuid_b925041d_3191_59c3_8f48_cfd7449f18bf = (UInt64)Interlocked.Increment(ref uuid_229b670b_b203_3780_89af_1bc6486bd86f);

            var _argv_5a9f41f9_9c1b_31ee_abed_09712facbd18 = new ArrayList();
            _argv_5a9f41f9_9c1b_31ee_abed_09712facbd18.Add(uuid_b925041d_3191_59c3_8f48_cfd7449f18bf);
            _argv_5a9f41f9_9c1b_31ee_abed_09712facbd18.Add(Skill.Skill_to_protcol(skill));
            _client_handle.call_hub(hub_name_229b670b_b203_3780_89af_1bc6486bd86f, "player_archive_add_skill", _argv_5a9f41f9_9c1b_31ee_abed_09712facbd18);

            var cb_add_skill_obj = new player_archive_add_skill_cb(uuid_b925041d_3191_59c3_8f48_cfd7449f18bf, rsp_cb_player_archive_handle);
            lock(rsp_cb_player_archive_handle.map_add_skill)
            {                rsp_cb_player_archive_handle.map_add_skill.Add(uuid_b925041d_3191_59c3_8f48_cfd7449f18bf, cb_add_skill_obj);
            }            return cb_add_skill_obj;
        }

        public player_archive_add_monster_cb add_monster(Monster monster){
            var uuid_9804a865_66e7_5add_a0c5_87003e361e6f = (UInt64)Interlocked.Increment(ref uuid_229b670b_b203_3780_89af_1bc6486bd86f);

            var _argv_3557bc3e_9709_3cfd_ae3e_a29771974a96 = new ArrayList();
            _argv_3557bc3e_9709_3cfd_ae3e_a29771974a96.Add(uuid_9804a865_66e7_5add_a0c5_87003e361e6f);
            _argv_3557bc3e_9709_3cfd_ae3e_a29771974a96.Add(Monster.Monster_to_protcol(monster));
            _client_handle.call_hub(hub_name_229b670b_b203_3780_89af_1bc6486bd86f, "player_archive_add_monster", _argv_3557bc3e_9709_3cfd_ae3e_a29771974a96);

            var cb_add_monster_obj = new player_archive_add_monster_cb(uuid_9804a865_66e7_5add_a0c5_87003e361e6f, rsp_cb_player_archive_handle);
            lock(rsp_cb_player_archive_handle.map_add_monster)
            {                rsp_cb_player_archive_handle.map_add_monster.Add(uuid_9804a865_66e7_5add_a0c5_87003e361e6f, cb_add_monster_obj);
            }            return cb_add_monster_obj;
        }

    }

}
