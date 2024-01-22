using System;
using System.Collections;
using System.Collections.Generic;
using System.Threading;
using MsgPack.Serialization;

namespace Abelkhan
{
/*this enum code is codegen by abelkhan codegen for c#*/

/*this struct code is codegen by abelkhan codegen for c#*/
    public class CardPacket
    {
        public List<RoleCardInfo> ItemList;
        public static MsgPack.MessagePackObjectDictionary CardPacket_to_protcol(CardPacket _struct){
        if (_struct == null) {
            return null;
        }

            var _protocol = new MsgPack.MessagePackObjectDictionary();
            if (_struct.ItemList != null) {
                var _array_ItemList = new List<MsgPack.MessagePackObject>();
                foreach(var v_ in _struct.ItemList){
                    _array_ItemList.Add( new MsgPack.MessagePackObject(RoleCardInfo.RoleCardInfo_to_protcol(v_)));
                }
                _protocol.Add("ItemList", new MsgPack.MessagePackObject(_array_ItemList));
            }
            return _protocol;
        }
        public static CardPacket protcol_to_CardPacket(MsgPack.MessagePackObjectDictionary _protocol){
        if (_protocol == null) {
            return null;
        }

            var _struct9640929f_4b83_3911_9478_43f795de0dff = new CardPacket();
            foreach (var i in _protocol){
                if (((MsgPack.MessagePackObject)i.Key).AsString() == "ItemList"){
                    _struct9640929f_4b83_3911_9478_43f795de0dff.ItemList = new List<RoleCardInfo>();
                    var _protocol_array = ((MsgPack.MessagePackObject)i.Value).AsList();
                    foreach (var v_ in _protocol_array){
                        _struct9640929f_4b83_3911_9478_43f795de0dff.ItemList.Add(RoleCardInfo.protcol_to_RoleCardInfo(((MsgPack.MessagePackObject)v_).AsDictionary()));
                    }
                }
            }
            return _struct9640929f_4b83_3911_9478_43f795de0dff;
        }
    }

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
    public class player_shop_buy_card_packet_cb
    {
        private UInt64 cb_uuid;
        private player_shop_rsp_cb module_rsp_cb;

        public player_shop_buy_card_packet_cb(UInt64 _cb_uuid, player_shop_rsp_cb _module_rsp_cb)
        {
            cb_uuid = _cb_uuid;
            module_rsp_cb = _module_rsp_cb;
        }

        public event Action<CardPacket, Bag> on_buy_card_packet_cb;
        public event Action<Int32> on_buy_card_packet_err;
        public event Action on_buy_card_packet_timeout;

        public player_shop_buy_card_packet_cb callBack(Action<CardPacket, Bag> cb, Action<Int32> err)
        {
            on_buy_card_packet_cb += cb;
            on_buy_card_packet_err += err;
            return this;
        }

        public void timeout(UInt64 tick, Action timeout_cb)
        {
            TinyTimer.add_timer(tick, ()=>{
                module_rsp_cb.buy_card_packet_timeout(cb_uuid);
            });
            on_buy_card_packet_timeout += timeout_cb;
        }

        public void call_cb(CardPacket infoCardPacket, Bag infoBag)
        {
            if (on_buy_card_packet_cb != null)
            {
                on_buy_card_packet_cb(infoCardPacket, infoBag);
            }
        }

        public void call_err(Int32 err)
        {
            if (on_buy_card_packet_err != null)
            {
                on_buy_card_packet_err(err);
            }
        }

        public void call_timeout()
        {
            if (on_buy_card_packet_timeout != null)
            {
                on_buy_card_packet_timeout();
            }
        }

    }

    public class player_shop_buy_card_merge_cb
    {
        private UInt64 cb_uuid;
        private player_shop_rsp_cb module_rsp_cb;

        public player_shop_buy_card_merge_cb(UInt64 _cb_uuid, player_shop_rsp_cb _module_rsp_cb)
        {
            cb_uuid = _cb_uuid;
            module_rsp_cb = _module_rsp_cb;
        }

        public event Action<Int32, UserData> on_buy_card_merge_cb;
        public event Action<Int32> on_buy_card_merge_err;
        public event Action on_buy_card_merge_timeout;

        public player_shop_buy_card_merge_cb callBack(Action<Int32, UserData> cb, Action<Int32> err)
        {
            on_buy_card_merge_cb += cb;
            on_buy_card_merge_err += err;
            return this;
        }

        public void timeout(UInt64 tick, Action timeout_cb)
        {
            TinyTimer.add_timer(tick, ()=>{
                module_rsp_cb.buy_card_merge_timeout(cb_uuid);
            });
            on_buy_card_merge_timeout += timeout_cb;
        }

        public void call_cb(Int32 roleID, UserData info)
        {
            if (on_buy_card_merge_cb != null)
            {
                on_buy_card_merge_cb(roleID, info);
            }
        }

        public void call_err(Int32 err)
        {
            if (on_buy_card_merge_err != null)
            {
                on_buy_card_merge_err(err);
            }
        }

        public void call_timeout()
        {
            if (on_buy_card_merge_timeout != null)
            {
                on_buy_card_merge_timeout();
            }
        }

    }

/*this cb code is codegen by abelkhan for c#*/
    public class player_shop_rsp_cb : Common.IModule {
        public Dictionary<UInt64, player_shop_buy_card_packet_cb> map_buy_card_packet;
        public Dictionary<UInt64, player_shop_buy_card_merge_cb> map_buy_card_merge;
        public player_shop_rsp_cb(Common.ModuleManager modules)
        {
            map_buy_card_packet = new Dictionary<UInt64, player_shop_buy_card_packet_cb>();
            modules.add_mothed("player_shop_rsp_cb_buy_card_packet_rsp", buy_card_packet_rsp);
            modules.add_mothed("player_shop_rsp_cb_buy_card_packet_err", buy_card_packet_err);
            map_buy_card_merge = new Dictionary<UInt64, player_shop_buy_card_merge_cb>();
            modules.add_mothed("player_shop_rsp_cb_buy_card_merge_rsp", buy_card_merge_rsp);
            modules.add_mothed("player_shop_rsp_cb_buy_card_merge_err", buy_card_merge_err);
        }

        public void buy_card_packet_rsp(IList<MsgPack.MessagePackObject> inArray){
            var uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _infoCardPacket = CardPacket.protcol_to_CardPacket(((MsgPack.MessagePackObject)inArray[1]).AsDictionary());
            var _infoBag = Bag.protcol_to_Bag(((MsgPack.MessagePackObject)inArray[2]).AsDictionary());
            var rsp = try_get_and_del_buy_card_packet_cb(uuid);
            if (rsp != null)
            {
                rsp.call_cb(_infoCardPacket, _infoBag);
            }
        }

        public void buy_card_packet_err(IList<MsgPack.MessagePackObject> inArray){
            var uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _err = ((MsgPack.MessagePackObject)inArray[1]).AsInt32();
            var rsp = try_get_and_del_buy_card_packet_cb(uuid);
            if (rsp != null)
            {
                rsp.call_err(_err);
            }
        }

        public void buy_card_packet_timeout(UInt64 cb_uuid){
            var rsp = try_get_and_del_buy_card_packet_cb(cb_uuid);
            if (rsp != null){
                rsp.call_timeout();
            }
        }

        private player_shop_buy_card_packet_cb try_get_and_del_buy_card_packet_cb(UInt64 uuid){
            lock(map_buy_card_packet)
            {
                if (map_buy_card_packet.TryGetValue(uuid, out player_shop_buy_card_packet_cb rsp))
                {
                    map_buy_card_packet.Remove(uuid);
                }
                return rsp;
            }
        }

        public void buy_card_merge_rsp(IList<MsgPack.MessagePackObject> inArray){
            var uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _roleID = ((MsgPack.MessagePackObject)inArray[1]).AsInt32();
            var _info = UserData.protcol_to_UserData(((MsgPack.MessagePackObject)inArray[2]).AsDictionary());
            var rsp = try_get_and_del_buy_card_merge_cb(uuid);
            if (rsp != null)
            {
                rsp.call_cb(_roleID, _info);
            }
        }

        public void buy_card_merge_err(IList<MsgPack.MessagePackObject> inArray){
            var uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _err = ((MsgPack.MessagePackObject)inArray[1]).AsInt32();
            var rsp = try_get_and_del_buy_card_merge_cb(uuid);
            if (rsp != null)
            {
                rsp.call_err(_err);
            }
        }

        public void buy_card_merge_timeout(UInt64 cb_uuid){
            var rsp = try_get_and_del_buy_card_merge_cb(cb_uuid);
            if (rsp != null){
                rsp.call_timeout();
            }
        }

        private player_shop_buy_card_merge_cb try_get_and_del_buy_card_merge_cb(UInt64 uuid){
            lock(map_buy_card_merge)
            {
                if (map_buy_card_merge.TryGetValue(uuid, out player_shop_buy_card_merge_cb rsp))
                {
                    map_buy_card_merge.Remove(uuid);
                }
                return rsp;
            }
        }

    }

    public class player_shop_caller {
        public static player_shop_rsp_cb rsp_cb_player_shop_handle = null;
        private ThreadLocal<player_shop_hubproxy> _hubproxy;
        public Client.Client _client_handle;
        public player_shop_caller(Client.Client client_handle_) 
        {
            _client_handle = client_handle_;
            if (rsp_cb_player_shop_handle == null)
            {
                rsp_cb_player_shop_handle = new player_shop_rsp_cb(_client_handle.modulemanager);
            }

            _hubproxy = new ThreadLocal<player_shop_hubproxy>();
        }

        public player_shop_hubproxy get_hub(string hub_name)
        {
            if (_hubproxy.Value == null)
{
                _hubproxy.Value = new player_shop_hubproxy(_client_handle, rsp_cb_player_shop_handle);
            }
            _hubproxy.Value.hub_name_77f83686_46a0_3ea6_923e_63294a905f09 = hub_name;
            return _hubproxy.Value;
        }

    }

    public class player_shop_hubproxy {
        public string hub_name_77f83686_46a0_3ea6_923e_63294a905f09;
        private Int32 uuid_77f83686_46a0_3ea6_923e_63294a905f09 = (Int32)RandomUUID.random();

        public Client.Client _client_handle;
        public player_shop_rsp_cb rsp_cb_player_shop_handle;

        public player_shop_hubproxy(Client.Client client_handle_, player_shop_rsp_cb rsp_cb_player_shop_handle_)
        {
            _client_handle = client_handle_;
            rsp_cb_player_shop_handle = rsp_cb_player_shop_handle_;
        }

        public player_shop_buy_card_packet_cb buy_card_packet(){
            var uuid_d332a5dd_6b0d_5825_a53a_071dbd10b6a4 = (UInt64)Interlocked.Increment(ref uuid_77f83686_46a0_3ea6_923e_63294a905f09);

            var _argv_d6e5c9ba_cae6_3d78_9c94_378cfb18564f = new ArrayList();
            _argv_d6e5c9ba_cae6_3d78_9c94_378cfb18564f.Add(uuid_d332a5dd_6b0d_5825_a53a_071dbd10b6a4);
            _client_handle.call_hub(hub_name_77f83686_46a0_3ea6_923e_63294a905f09, "player_shop_buy_card_packet", _argv_d6e5c9ba_cae6_3d78_9c94_378cfb18564f);

            var cb_buy_card_packet_obj = new player_shop_buy_card_packet_cb(uuid_d332a5dd_6b0d_5825_a53a_071dbd10b6a4, rsp_cb_player_shop_handle);
            lock(rsp_cb_player_shop_handle.map_buy_card_packet)
            {                rsp_cb_player_shop_handle.map_buy_card_packet.Add(uuid_d332a5dd_6b0d_5825_a53a_071dbd10b6a4, cb_buy_card_packet_obj);
            }            return cb_buy_card_packet_obj;
        }

        public player_shop_buy_card_merge_cb buy_card_merge(Int32 roleID){
            var uuid_18eed6ca_7674_52e6_b275_3f39b727fbfa = (UInt64)Interlocked.Increment(ref uuid_77f83686_46a0_3ea6_923e_63294a905f09);

            var _argv_dee721ae_80aa_378d_8cc9_48d93bcb0586 = new ArrayList();
            _argv_dee721ae_80aa_378d_8cc9_48d93bcb0586.Add(uuid_18eed6ca_7674_52e6_b275_3f39b727fbfa);
            _argv_dee721ae_80aa_378d_8cc9_48d93bcb0586.Add(roleID);
            _client_handle.call_hub(hub_name_77f83686_46a0_3ea6_923e_63294a905f09, "player_shop_buy_card_merge", _argv_dee721ae_80aa_378d_8cc9_48d93bcb0586);

            var cb_buy_card_merge_obj = new player_shop_buy_card_merge_cb(uuid_18eed6ca_7674_52e6_b275_3f39b727fbfa, rsp_cb_player_shop_handle);
            lock(rsp_cb_player_shop_handle.map_buy_card_merge)
            {                rsp_cb_player_shop_handle.map_buy_card_merge.Add(uuid_18eed6ca_7674_52e6_b275_3f39b727fbfa, cb_buy_card_merge_obj);
            }            return cb_buy_card_merge_obj;
        }

    }
    public class player_battle_start_battle_cb
    {
        private UInt64 cb_uuid;
        private player_battle_rsp_cb module_rsp_cb;

        public player_battle_start_battle_cb(UInt64 _cb_uuid, player_battle_rsp_cb _module_rsp_cb)
        {
            cb_uuid = _cb_uuid;
            module_rsp_cb = _module_rsp_cb;
        }

        public event Action<string, UserBattleData, ShopData> on_start_battle_cb;
        public event Action<Int32> on_start_battle_err;
        public event Action on_start_battle_timeout;

        public player_battle_start_battle_cb callBack(Action<string, UserBattleData, ShopData> cb, Action<Int32> err)
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

        public void call_cb(string match_name, UserBattleData battle_info, ShopData shop_info)
        {
            if (on_start_battle_cb != null)
            {
                on_start_battle_cb(match_name, battle_info, shop_info);
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
    public class player_battle_rsp_cb : Common.IModule {
        public Dictionary<UInt64, player_battle_start_battle_cb> map_start_battle;
        public player_battle_rsp_cb(Common.ModuleManager modules)
        {
            map_start_battle = new Dictionary<UInt64, player_battle_start_battle_cb>();
            modules.add_mothed("player_battle_rsp_cb_start_battle_rsp", start_battle_rsp);
            modules.add_mothed("player_battle_rsp_cb_start_battle_err", start_battle_err);
        }

        public void start_battle_rsp(IList<MsgPack.MessagePackObject> inArray){
            var uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _match_name = ((MsgPack.MessagePackObject)inArray[1]).AsString();
            var _battle_info = UserBattleData.protcol_to_UserBattleData(((MsgPack.MessagePackObject)inArray[2]).AsDictionary());
            var _shop_info = ShopData.protcol_to_ShopData(((MsgPack.MessagePackObject)inArray[3]).AsDictionary());
            var rsp = try_get_and_del_start_battle_cb(uuid);
            if (rsp != null)
            {
                rsp.call_cb(_match_name, _battle_info, _shop_info);
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

        private player_battle_start_battle_cb try_get_and_del_start_battle_cb(UInt64 uuid){
            lock(map_start_battle)
            {
                if (map_start_battle.TryGetValue(uuid, out player_battle_start_battle_cb rsp))
                {
                    map_start_battle.Remove(uuid);
                }
                return rsp;
            }
        }

    }

    public class player_battle_caller {
        public static player_battle_rsp_cb rsp_cb_player_battle_handle = null;
        private ThreadLocal<player_battle_hubproxy> _hubproxy;
        public Client.Client _client_handle;
        public player_battle_caller(Client.Client client_handle_) 
        {
            _client_handle = client_handle_;
            if (rsp_cb_player_battle_handle == null)
            {
                rsp_cb_player_battle_handle = new player_battle_rsp_cb(_client_handle.modulemanager);
            }

            _hubproxy = new ThreadLocal<player_battle_hubproxy>();
        }

        public player_battle_hubproxy get_hub(string hub_name)
        {
            if (_hubproxy.Value == null)
{
                _hubproxy.Value = new player_battle_hubproxy(_client_handle, rsp_cb_player_battle_handle);
            }
            _hubproxy.Value.hub_name_4ffbb290_f238_38f6_b774_75ba1cccb192 = hub_name;
            return _hubproxy.Value;
        }

    }

    public class player_battle_hubproxy {
        public string hub_name_4ffbb290_f238_38f6_b774_75ba1cccb192;
        private Int32 uuid_4ffbb290_f238_38f6_b774_75ba1cccb192 = (Int32)RandomUUID.random();

        public Client.Client _client_handle;
        public player_battle_rsp_cb rsp_cb_player_battle_handle;

        public player_battle_hubproxy(Client.Client client_handle_, player_battle_rsp_cb rsp_cb_player_battle_handle_)
        {
            _client_handle = client_handle_;
            rsp_cb_player_battle_handle = rsp_cb_player_battle_handle_;
        }

        public player_battle_start_battle_cb start_battle(){
            var uuid_21a74a63_a13c_539e_b2bc_ef5069375dba = (UInt64)Interlocked.Increment(ref uuid_4ffbb290_f238_38f6_b774_75ba1cccb192);

            var _argv_01e120b2_ff3e_35bc_b812_e0d6fa294873 = new ArrayList();
            _argv_01e120b2_ff3e_35bc_b812_e0d6fa294873.Add(uuid_21a74a63_a13c_539e_b2bc_ef5069375dba);
            _client_handle.call_hub(hub_name_4ffbb290_f238_38f6_b774_75ba1cccb192, "player_battle_start_battle", _argv_01e120b2_ff3e_35bc_b812_e0d6fa294873);

            var cb_start_battle_obj = new player_battle_start_battle_cb(uuid_21a74a63_a13c_539e_b2bc_ef5069375dba, rsp_cb_player_battle_handle);
            lock(rsp_cb_player_battle_handle.map_start_battle)
            {                rsp_cb_player_battle_handle.map_start_battle.Add(uuid_21a74a63_a13c_539e_b2bc_ef5069375dba, cb_start_battle_obj);
            }            return cb_start_battle_obj;
        }

    }

}
