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

/*this module code is codegen by abelkhan codegen for c#*/
    public class player_login_player_login_rsp : Common.Response {
        private string _client_uuid_803b03c3_eef6_3b5c_a790_4cd13c6c4e4b;
        private UInt64 uuid_ade41c97_e005_3aac_9b68_925d09412afe;
        public player_login_player_login_rsp(string client_uuid, UInt64 _uuid)
        {
            _client_uuid_803b03c3_eef6_3b5c_a790_4cd13c6c4e4b = client_uuid;
            uuid_ade41c97_e005_3aac_9b68_925d09412afe = _uuid;
        }

        public void rsp(UserData info_391fd3d4_2d55_3f5e_9223_7f450a814a15){
            var _argv_803b03c3_eef6_3b5c_a790_4cd13c6c4e4b = new ArrayList();
            _argv_803b03c3_eef6_3b5c_a790_4cd13c6c4e4b.Add(uuid_ade41c97_e005_3aac_9b68_925d09412afe);
            _argv_803b03c3_eef6_3b5c_a790_4cd13c6c4e4b.Add(UserData.UserData_to_protcol(info_391fd3d4_2d55_3f5e_9223_7f450a814a15));
            Hub.Hub._gates.call_client(_client_uuid_803b03c3_eef6_3b5c_a790_4cd13c6c4e4b, "player_login_rsp_cb_player_login_rsp", _argv_803b03c3_eef6_3b5c_a790_4cd13c6c4e4b);
        }

        public void err(Int32 err_ad2710a2_3dd2_3a8f_a4c8_a7ebbe1df696){
            var _argv_803b03c3_eef6_3b5c_a790_4cd13c6c4e4b = new ArrayList();
            _argv_803b03c3_eef6_3b5c_a790_4cd13c6c4e4b.Add(uuid_ade41c97_e005_3aac_9b68_925d09412afe);
            _argv_803b03c3_eef6_3b5c_a790_4cd13c6c4e4b.Add(err_ad2710a2_3dd2_3a8f_a4c8_a7ebbe1df696);
            Hub.Hub._gates.call_client(_client_uuid_803b03c3_eef6_3b5c_a790_4cd13c6c4e4b, "player_login_rsp_cb_player_login_err", _argv_803b03c3_eef6_3b5c_a790_4cd13c6c4e4b);
        }

    }

    public class player_login_create_role_rsp : Common.Response {
        private string _client_uuid_30293c4a_8f5b_307e_a08a_ff76e003f95d;
        private UInt64 uuid_9b570d40_93db_3172_b2b2_238a3ebca94b;
        public player_login_create_role_rsp(string client_uuid, UInt64 _uuid)
        {
            _client_uuid_30293c4a_8f5b_307e_a08a_ff76e003f95d = client_uuid;
            uuid_9b570d40_93db_3172_b2b2_238a3ebca94b = _uuid;
        }

        public void rsp(UserData info_391fd3d4_2d55_3f5e_9223_7f450a814a15){
            var _argv_30293c4a_8f5b_307e_a08a_ff76e003f95d = new ArrayList();
            _argv_30293c4a_8f5b_307e_a08a_ff76e003f95d.Add(uuid_9b570d40_93db_3172_b2b2_238a3ebca94b);
            _argv_30293c4a_8f5b_307e_a08a_ff76e003f95d.Add(UserData.UserData_to_protcol(info_391fd3d4_2d55_3f5e_9223_7f450a814a15));
            Hub.Hub._gates.call_client(_client_uuid_30293c4a_8f5b_307e_a08a_ff76e003f95d, "player_login_rsp_cb_create_role_rsp", _argv_30293c4a_8f5b_307e_a08a_ff76e003f95d);
        }

        public void err(Int32 err_ad2710a2_3dd2_3a8f_a4c8_a7ebbe1df696){
            var _argv_30293c4a_8f5b_307e_a08a_ff76e003f95d = new ArrayList();
            _argv_30293c4a_8f5b_307e_a08a_ff76e003f95d.Add(uuid_9b570d40_93db_3172_b2b2_238a3ebca94b);
            _argv_30293c4a_8f5b_307e_a08a_ff76e003f95d.Add(err_ad2710a2_3dd2_3a8f_a4c8_a7ebbe1df696);
            Hub.Hub._gates.call_client(_client_uuid_30293c4a_8f5b_307e_a08a_ff76e003f95d, "player_login_rsp_cb_create_role_err", _argv_30293c4a_8f5b_307e_a08a_ff76e003f95d);
        }

    }

    public class player_login_reconnect_rsp : Common.Response {
        private string _client_uuid_4d537d38_2de1_3d0c_9909_5db2dcf1671f;
        private UInt64 uuid_a79a6246_6113_35d3_9f8b_f4f2d51db9cc;
        public player_login_reconnect_rsp(string client_uuid, UInt64 _uuid)
        {
            _client_uuid_4d537d38_2de1_3d0c_9909_5db2dcf1671f = client_uuid;
            uuid_a79a6246_6113_35d3_9f8b_f4f2d51db9cc = _uuid;
        }

        public void rsp(UserData info_391fd3d4_2d55_3f5e_9223_7f450a814a15, string match_name_d50a466e_055b_3a8a_ac90_a255638bcd50){
            var _argv_4d537d38_2de1_3d0c_9909_5db2dcf1671f = new ArrayList();
            _argv_4d537d38_2de1_3d0c_9909_5db2dcf1671f.Add(uuid_a79a6246_6113_35d3_9f8b_f4f2d51db9cc);
            _argv_4d537d38_2de1_3d0c_9909_5db2dcf1671f.Add(UserData.UserData_to_protcol(info_391fd3d4_2d55_3f5e_9223_7f450a814a15));
            _argv_4d537d38_2de1_3d0c_9909_5db2dcf1671f.Add(match_name_d50a466e_055b_3a8a_ac90_a255638bcd50);
            Hub.Hub._gates.call_client(_client_uuid_4d537d38_2de1_3d0c_9909_5db2dcf1671f, "player_login_rsp_cb_reconnect_rsp", _argv_4d537d38_2de1_3d0c_9909_5db2dcf1671f);
        }

        public void err(Int32 err_ad2710a2_3dd2_3a8f_a4c8_a7ebbe1df696){
            var _argv_4d537d38_2de1_3d0c_9909_5db2dcf1671f = new ArrayList();
            _argv_4d537d38_2de1_3d0c_9909_5db2dcf1671f.Add(uuid_a79a6246_6113_35d3_9f8b_f4f2d51db9cc);
            _argv_4d537d38_2de1_3d0c_9909_5db2dcf1671f.Add(err_ad2710a2_3dd2_3a8f_a4c8_a7ebbe1df696);
            Hub.Hub._gates.call_client(_client_uuid_4d537d38_2de1_3d0c_9909_5db2dcf1671f, "player_login_rsp_cb_reconnect_err", _argv_4d537d38_2de1_3d0c_9909_5db2dcf1671f);
        }

    }

    public class player_login_module : Common.IModule {
        public player_login_module()
        {
            Hub.Hub._modules.add_mothed("player_login_player_login", player_login);
            Hub.Hub._modules.add_mothed("player_login_create_role", create_role);
            Hub.Hub._modules.add_mothed("player_login_reconnect", reconnect);
        }

        public event Action<string, string, string> on_player_login;
        public void player_login(IList<MsgPack.MessagePackObject> inArray){
            var _cb_uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _token = ((MsgPack.MessagePackObject)inArray[1]).AsString();
            var _nick_name = ((MsgPack.MessagePackObject)inArray[2]).AsString();
            var _avatar = ((MsgPack.MessagePackObject)inArray[3]).AsString();
            rsp = new player_login_player_login_rsp(Hub.Hub._gates.current_client_uuid, _cb_uuid);
            if (on_player_login != null){
                on_player_login(_token, _nick_name, _avatar);
            }
            rsp = null;
        }

        public event Action<string, string, string> on_create_role;
        public void create_role(IList<MsgPack.MessagePackObject> inArray){
            var _cb_uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _name = ((MsgPack.MessagePackObject)inArray[1]).AsString();
            var _nick_name = ((MsgPack.MessagePackObject)inArray[2]).AsString();
            var _avatar = ((MsgPack.MessagePackObject)inArray[3]).AsString();
            rsp = new player_login_create_role_rsp(Hub.Hub._gates.current_client_uuid, _cb_uuid);
            if (on_create_role != null){
                on_create_role(_name, _nick_name, _avatar);
            }
            rsp = null;
        }

        public event Action<Int64> on_reconnect;
        public void reconnect(IList<MsgPack.MessagePackObject> inArray){
            var _cb_uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _guid = ((MsgPack.MessagePackObject)inArray[1]).AsInt64();
            rsp = new player_login_reconnect_rsp(Hub.Hub._gates.current_client_uuid, _cb_uuid);
            if (on_reconnect != null){
                on_reconnect(_guid);
            }
            rsp = null;
        }

    }
    public class player_shop_buy_card_packet_rsp : Common.Response {
        private string _client_uuid_d6e5c9ba_cae6_3d78_9c94_378cfb18564f;
        private UInt64 uuid_6cc6ca26_b510_30a9_b2f0_f793ad4e59e7;
        public player_shop_buy_card_packet_rsp(string client_uuid, UInt64 _uuid)
        {
            _client_uuid_d6e5c9ba_cae6_3d78_9c94_378cfb18564f = client_uuid;
            uuid_6cc6ca26_b510_30a9_b2f0_f793ad4e59e7 = _uuid;
        }

        public void rsp(CardPacket infoCardPacket_87571aec_d5bf_3fad_a494_b4071b3ecf42, Bag infoBag_084949a2_36eb_35a5_ae7f_87587a1a619e){
            var _argv_d6e5c9ba_cae6_3d78_9c94_378cfb18564f = new ArrayList();
            _argv_d6e5c9ba_cae6_3d78_9c94_378cfb18564f.Add(uuid_6cc6ca26_b510_30a9_b2f0_f793ad4e59e7);
            _argv_d6e5c9ba_cae6_3d78_9c94_378cfb18564f.Add(CardPacket.CardPacket_to_protcol(infoCardPacket_87571aec_d5bf_3fad_a494_b4071b3ecf42));
            _argv_d6e5c9ba_cae6_3d78_9c94_378cfb18564f.Add(Bag.Bag_to_protcol(infoBag_084949a2_36eb_35a5_ae7f_87587a1a619e));
            Hub.Hub._gates.call_client(_client_uuid_d6e5c9ba_cae6_3d78_9c94_378cfb18564f, "player_shop_rsp_cb_buy_card_packet_rsp", _argv_d6e5c9ba_cae6_3d78_9c94_378cfb18564f);
        }

        public void err(Int32 err_ad2710a2_3dd2_3a8f_a4c8_a7ebbe1df696){
            var _argv_d6e5c9ba_cae6_3d78_9c94_378cfb18564f = new ArrayList();
            _argv_d6e5c9ba_cae6_3d78_9c94_378cfb18564f.Add(uuid_6cc6ca26_b510_30a9_b2f0_f793ad4e59e7);
            _argv_d6e5c9ba_cae6_3d78_9c94_378cfb18564f.Add(err_ad2710a2_3dd2_3a8f_a4c8_a7ebbe1df696);
            Hub.Hub._gates.call_client(_client_uuid_d6e5c9ba_cae6_3d78_9c94_378cfb18564f, "player_shop_rsp_cb_buy_card_packet_err", _argv_d6e5c9ba_cae6_3d78_9c94_378cfb18564f);
        }

    }

    public class player_shop_buy_card_merge_rsp : Common.Response {
        private string _client_uuid_dee721ae_80aa_378d_8cc9_48d93bcb0586;
        private UInt64 uuid_7e0e8665_898a_3741_b32e_c8d1052d040b;
        public player_shop_buy_card_merge_rsp(string client_uuid, UInt64 _uuid)
        {
            _client_uuid_dee721ae_80aa_378d_8cc9_48d93bcb0586 = client_uuid;
            uuid_7e0e8665_898a_3741_b32e_c8d1052d040b = _uuid;
        }

        public void rsp(Int32 roleID_e6394c85_b087_3274_a3ef_e9e95d2e9412, UserData info_391fd3d4_2d55_3f5e_9223_7f450a814a15){
            var _argv_dee721ae_80aa_378d_8cc9_48d93bcb0586 = new ArrayList();
            _argv_dee721ae_80aa_378d_8cc9_48d93bcb0586.Add(uuid_7e0e8665_898a_3741_b32e_c8d1052d040b);
            _argv_dee721ae_80aa_378d_8cc9_48d93bcb0586.Add(roleID_e6394c85_b087_3274_a3ef_e9e95d2e9412);
            _argv_dee721ae_80aa_378d_8cc9_48d93bcb0586.Add(UserData.UserData_to_protcol(info_391fd3d4_2d55_3f5e_9223_7f450a814a15));
            Hub.Hub._gates.call_client(_client_uuid_dee721ae_80aa_378d_8cc9_48d93bcb0586, "player_shop_rsp_cb_buy_card_merge_rsp", _argv_dee721ae_80aa_378d_8cc9_48d93bcb0586);
        }

        public void err(Int32 err_ad2710a2_3dd2_3a8f_a4c8_a7ebbe1df696){
            var _argv_dee721ae_80aa_378d_8cc9_48d93bcb0586 = new ArrayList();
            _argv_dee721ae_80aa_378d_8cc9_48d93bcb0586.Add(uuid_7e0e8665_898a_3741_b32e_c8d1052d040b);
            _argv_dee721ae_80aa_378d_8cc9_48d93bcb0586.Add(err_ad2710a2_3dd2_3a8f_a4c8_a7ebbe1df696);
            Hub.Hub._gates.call_client(_client_uuid_dee721ae_80aa_378d_8cc9_48d93bcb0586, "player_shop_rsp_cb_buy_card_merge_err", _argv_dee721ae_80aa_378d_8cc9_48d93bcb0586);
        }

    }

    public class player_shop_edit_role_group_rsp : Common.Response {
        private string _client_uuid_f4590bd7_2111_3754_bf86_154d25227f01;
        private UInt64 uuid_3c34b0db_b131_3d40_9a91_219d271016cb;
        public player_shop_edit_role_group_rsp(string client_uuid, UInt64 _uuid)
        {
            _client_uuid_f4590bd7_2111_3754_bf86_154d25227f01 = client_uuid;
            uuid_3c34b0db_b131_3d40_9a91_219d271016cb = _uuid;
        }

        public void rsp(UserData info_391fd3d4_2d55_3f5e_9223_7f450a814a15){
            var _argv_f4590bd7_2111_3754_bf86_154d25227f01 = new ArrayList();
            _argv_f4590bd7_2111_3754_bf86_154d25227f01.Add(uuid_3c34b0db_b131_3d40_9a91_219d271016cb);
            _argv_f4590bd7_2111_3754_bf86_154d25227f01.Add(UserData.UserData_to_protcol(info_391fd3d4_2d55_3f5e_9223_7f450a814a15));
            Hub.Hub._gates.call_client(_client_uuid_f4590bd7_2111_3754_bf86_154d25227f01, "player_shop_rsp_cb_edit_role_group_rsp", _argv_f4590bd7_2111_3754_bf86_154d25227f01);
        }

        public void err(Int32 err_ad2710a2_3dd2_3a8f_a4c8_a7ebbe1df696){
            var _argv_f4590bd7_2111_3754_bf86_154d25227f01 = new ArrayList();
            _argv_f4590bd7_2111_3754_bf86_154d25227f01.Add(uuid_3c34b0db_b131_3d40_9a91_219d271016cb);
            _argv_f4590bd7_2111_3754_bf86_154d25227f01.Add(err_ad2710a2_3dd2_3a8f_a4c8_a7ebbe1df696);
            Hub.Hub._gates.call_client(_client_uuid_f4590bd7_2111_3754_bf86_154d25227f01, "player_shop_rsp_cb_edit_role_group_err", _argv_f4590bd7_2111_3754_bf86_154d25227f01);
        }

    }

    public class player_shop_get_user_data_rsp : Common.Response {
        private string _client_uuid_f56b8d13_7bcd_3a7e_b0c6_0413a872738b;
        private UInt64 uuid_0963daaa_6e31_39c9_8fe9_c84b6e499348;
        public player_shop_get_user_data_rsp(string client_uuid, UInt64 _uuid)
        {
            _client_uuid_f56b8d13_7bcd_3a7e_b0c6_0413a872738b = client_uuid;
            uuid_0963daaa_6e31_39c9_8fe9_c84b6e499348 = _uuid;
        }

        public void rsp(UserData info_391fd3d4_2d55_3f5e_9223_7f450a814a15){
            var _argv_f56b8d13_7bcd_3a7e_b0c6_0413a872738b = new ArrayList();
            _argv_f56b8d13_7bcd_3a7e_b0c6_0413a872738b.Add(uuid_0963daaa_6e31_39c9_8fe9_c84b6e499348);
            _argv_f56b8d13_7bcd_3a7e_b0c6_0413a872738b.Add(UserData.UserData_to_protcol(info_391fd3d4_2d55_3f5e_9223_7f450a814a15));
            Hub.Hub._gates.call_client(_client_uuid_f56b8d13_7bcd_3a7e_b0c6_0413a872738b, "player_shop_rsp_cb_get_user_data_rsp", _argv_f56b8d13_7bcd_3a7e_b0c6_0413a872738b);
        }

        public void err(Int32 err_ad2710a2_3dd2_3a8f_a4c8_a7ebbe1df696){
            var _argv_f56b8d13_7bcd_3a7e_b0c6_0413a872738b = new ArrayList();
            _argv_f56b8d13_7bcd_3a7e_b0c6_0413a872738b.Add(uuid_0963daaa_6e31_39c9_8fe9_c84b6e499348);
            _argv_f56b8d13_7bcd_3a7e_b0c6_0413a872738b.Add(err_ad2710a2_3dd2_3a8f_a4c8_a7ebbe1df696);
            Hub.Hub._gates.call_client(_client_uuid_f56b8d13_7bcd_3a7e_b0c6_0413a872738b, "player_shop_rsp_cb_get_user_data_err", _argv_f56b8d13_7bcd_3a7e_b0c6_0413a872738b);
        }

    }

    public class player_shop_module : Common.IModule {
        public player_shop_module()
        {
            Hub.Hub._modules.add_mothed("player_shop_buy_card_packet", buy_card_packet);
            Hub.Hub._modules.add_mothed("player_shop_buy_card_merge", buy_card_merge);
            Hub.Hub._modules.add_mothed("player_shop_edit_role_group", edit_role_group);
            Hub.Hub._modules.add_mothed("player_shop_get_user_data", get_user_data);
        }

        public event Action on_buy_card_packet;
        public void buy_card_packet(IList<MsgPack.MessagePackObject> inArray){
            var _cb_uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            rsp = new player_shop_buy_card_packet_rsp(Hub.Hub._gates.current_client_uuid, _cb_uuid);
            if (on_buy_card_packet != null){
                on_buy_card_packet();
            }
            rsp = null;
        }

        public event Action<Int32> on_buy_card_merge;
        public void buy_card_merge(IList<MsgPack.MessagePackObject> inArray){
            var _cb_uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _roleID = ((MsgPack.MessagePackObject)inArray[1]).AsInt32();
            rsp = new player_shop_buy_card_merge_rsp(Hub.Hub._gates.current_client_uuid, _cb_uuid);
            if (on_buy_card_merge != null){
                on_buy_card_merge(_roleID);
            }
            rsp = null;
        }

        public event Action<RoleGroup> on_edit_role_group;
        public void edit_role_group(IList<MsgPack.MessagePackObject> inArray){
            var _cb_uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _roleGroup = RoleGroup.protcol_to_RoleGroup(((MsgPack.MessagePackObject)inArray[1]).AsDictionary());
            rsp = new player_shop_edit_role_group_rsp(Hub.Hub._gates.current_client_uuid, _cb_uuid);
            if (on_edit_role_group != null){
                on_edit_role_group(_roleGroup);
            }
            rsp = null;
        }

        public event Action on_get_user_data;
        public void get_user_data(IList<MsgPack.MessagePackObject> inArray){
            var _cb_uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            rsp = new player_shop_get_user_data_rsp(Hub.Hub._gates.current_client_uuid, _cb_uuid);
            if (on_get_user_data != null){
                on_get_user_data();
            }
            rsp = null;
        }

    }
    public class player_battle_start_battle_rsp : Common.Response {
        private string _client_uuid_01e120b2_ff3e_35bc_b812_e0d6fa294873;
        private UInt64 uuid_ee4a9042_3083_3d2e_90e2_aa58942d4f15;
        public player_battle_start_battle_rsp(string client_uuid, UInt64 _uuid)
        {
            _client_uuid_01e120b2_ff3e_35bc_b812_e0d6fa294873 = client_uuid;
            uuid_ee4a9042_3083_3d2e_90e2_aa58942d4f15 = _uuid;
        }

        public void rsp(string match_name_d50a466e_055b_3a8a_ac90_a255638bcd50, UserBattleData battle_info_504125a2_a75d_3fa2_9a35_a9fdc5331928, ShopData shop_info_6355a923_2126_3fd5_b568_e5edf6bd36d0){
            var _argv_01e120b2_ff3e_35bc_b812_e0d6fa294873 = new ArrayList();
            _argv_01e120b2_ff3e_35bc_b812_e0d6fa294873.Add(uuid_ee4a9042_3083_3d2e_90e2_aa58942d4f15);
            _argv_01e120b2_ff3e_35bc_b812_e0d6fa294873.Add(match_name_d50a466e_055b_3a8a_ac90_a255638bcd50);
            _argv_01e120b2_ff3e_35bc_b812_e0d6fa294873.Add(UserBattleData.UserBattleData_to_protcol(battle_info_504125a2_a75d_3fa2_9a35_a9fdc5331928));
            _argv_01e120b2_ff3e_35bc_b812_e0d6fa294873.Add(ShopData.ShopData_to_protcol(shop_info_6355a923_2126_3fd5_b568_e5edf6bd36d0));
            Hub.Hub._gates.call_client(_client_uuid_01e120b2_ff3e_35bc_b812_e0d6fa294873, "player_battle_rsp_cb_start_battle_rsp", _argv_01e120b2_ff3e_35bc_b812_e0d6fa294873);
        }

        public void err(Int32 err_ad2710a2_3dd2_3a8f_a4c8_a7ebbe1df696){
            var _argv_01e120b2_ff3e_35bc_b812_e0d6fa294873 = new ArrayList();
            _argv_01e120b2_ff3e_35bc_b812_e0d6fa294873.Add(uuid_ee4a9042_3083_3d2e_90e2_aa58942d4f15);
            _argv_01e120b2_ff3e_35bc_b812_e0d6fa294873.Add(err_ad2710a2_3dd2_3a8f_a4c8_a7ebbe1df696);
            Hub.Hub._gates.call_client(_client_uuid_01e120b2_ff3e_35bc_b812_e0d6fa294873, "player_battle_rsp_cb_start_battle_err", _argv_01e120b2_ff3e_35bc_b812_e0d6fa294873);
        }

    }

    public class player_battle_start_peak_strength_rsp : Common.Response {
        private string _client_uuid_604bcc66_d0b2_3376_8454_39a206b26543;
        private UInt64 uuid_469c67c5_686b_3b18_b93f_b1ae9f231dac;
        public player_battle_start_peak_strength_rsp(string client_uuid, UInt64 _uuid)
        {
            _client_uuid_604bcc66_d0b2_3376_8454_39a206b26543 = client_uuid;
            uuid_469c67c5_686b_3b18_b93f_b1ae9f231dac = _uuid;
        }

        public void rsp(string match_name_d50a466e_055b_3a8a_ac90_a255638bcd50, List<UserBattleData> self_809515b8_3e31_3feb_a08c_462fee09f6ef){
            var _argv_604bcc66_d0b2_3376_8454_39a206b26543 = new ArrayList();
            _argv_604bcc66_d0b2_3376_8454_39a206b26543.Add(uuid_469c67c5_686b_3b18_b93f_b1ae9f231dac);
            _argv_604bcc66_d0b2_3376_8454_39a206b26543.Add(match_name_d50a466e_055b_3a8a_ac90_a255638bcd50);
            var _array_809515b8_3e31_3feb_a08c_462fee09f6ef = new ArrayList();
            foreach(var v_9d043920_d936_5a24_bb36_334fe3c35b20 in self_809515b8_3e31_3feb_a08c_462fee09f6ef){
                _array_809515b8_3e31_3feb_a08c_462fee09f6ef.Add(UserBattleData.UserBattleData_to_protcol(v_9d043920_d936_5a24_bb36_334fe3c35b20));
            }
            _argv_604bcc66_d0b2_3376_8454_39a206b26543.Add(_array_809515b8_3e31_3feb_a08c_462fee09f6ef);
            Hub.Hub._gates.call_client(_client_uuid_604bcc66_d0b2_3376_8454_39a206b26543, "player_battle_rsp_cb_start_peak_strength_rsp", _argv_604bcc66_d0b2_3376_8454_39a206b26543);
        }

        public void err(Int32 err_ad2710a2_3dd2_3a8f_a4c8_a7ebbe1df696){
            var _argv_604bcc66_d0b2_3376_8454_39a206b26543 = new ArrayList();
            _argv_604bcc66_d0b2_3376_8454_39a206b26543.Add(uuid_469c67c5_686b_3b18_b93f_b1ae9f231dac);
            _argv_604bcc66_d0b2_3376_8454_39a206b26543.Add(err_ad2710a2_3dd2_3a8f_a4c8_a7ebbe1df696);
            Hub.Hub._gates.call_client(_client_uuid_604bcc66_d0b2_3376_8454_39a206b26543, "player_battle_rsp_cb_start_peak_strength_err", _argv_604bcc66_d0b2_3376_8454_39a206b26543);
        }

    }

    public class player_battle_module : Common.IModule {
        public player_battle_module()
        {
            Hub.Hub._modules.add_mothed("player_battle_start_battle", start_battle);
            Hub.Hub._modules.add_mothed("player_battle_start_peak_strength", start_peak_strength);
        }

        public event Action on_start_battle;
        public void start_battle(IList<MsgPack.MessagePackObject> inArray){
            var _cb_uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            rsp = new player_battle_start_battle_rsp(Hub.Hub._gates.current_client_uuid, _cb_uuid);
            if (on_start_battle != null){
                on_start_battle();
            }
            rsp = null;
        }

        public event Action on_start_peak_strength;
        public void start_peak_strength(IList<MsgPack.MessagePackObject> inArray){
            var _cb_uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            rsp = new player_battle_start_peak_strength_rsp(Hub.Hub._gates.current_client_uuid, _cb_uuid);
            if (on_start_peak_strength != null){
                on_start_peak_strength();
            }
            rsp = null;
        }

    }

}
