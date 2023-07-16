using System;
using System.Collections;
using System.Collections.Generic;
using System.Threading;
using MsgPack.Serialization;

namespace Abelkhan
{
/*this enum code is codegen by abelkhan codegen for c#*/

/*this struct code is codegen by abelkhan codegen for c#*/
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

    public class player_login_module : Common.IModule {
        public player_login_module()
        {
            Hub.Hub._modules.add_mothed("player_login_player_login", player_login);
            Hub.Hub._modules.add_mothed("player_login_create_role", create_role);
        }

        public event Action<string, string> on_player_login;
        public void player_login(IList<MsgPack.MessagePackObject> inArray){
            var _cb_uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _token = ((MsgPack.MessagePackObject)inArray[1]).AsString();
            var _nick_name = ((MsgPack.MessagePackObject)inArray[2]).AsString();
            rsp = new player_login_player_login_rsp(Hub.Hub._gates.current_client_uuid, _cb_uuid);
            if (on_player_login != null){
                on_player_login(_token, _nick_name);
            }
            rsp = null;
        }

        public event Action<string, string> on_create_role;
        public void create_role(IList<MsgPack.MessagePackObject> inArray){
            var _cb_uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _name = ((MsgPack.MessagePackObject)inArray[1]).AsString();
            var _nick_name = ((MsgPack.MessagePackObject)inArray[2]).AsString();
            rsp = new player_login_create_role_rsp(Hub.Hub._gates.current_client_uuid, _cb_uuid);
            if (on_create_role != null){
                on_create_role(_name, _nick_name);
            }
            rsp = null;
        }

    }
    public class player_battle_set_battle_role_list_rsp : Common.Response {
        private string _client_uuid_b0cff194_b07c_38db_ae41_5f816e6cbfa2;
        private UInt64 uuid_3bfcce5d_7fd6_3191_9f4c_326295164308;
        public player_battle_set_battle_role_list_rsp(string client_uuid, UInt64 _uuid)
        {
            _client_uuid_b0cff194_b07c_38db_ae41_5f816e6cbfa2 = client_uuid;
            uuid_3bfcce5d_7fd6_3191_9f4c_326295164308 = _uuid;
        }

        public void rsp(UserBattleData info_391fd3d4_2d55_3f5e_9223_7f450a814a15){
            var _argv_b0cff194_b07c_38db_ae41_5f816e6cbfa2 = new ArrayList();
            _argv_b0cff194_b07c_38db_ae41_5f816e6cbfa2.Add(uuid_3bfcce5d_7fd6_3191_9f4c_326295164308);
            _argv_b0cff194_b07c_38db_ae41_5f816e6cbfa2.Add(UserBattleData.UserBattleData_to_protcol(info_391fd3d4_2d55_3f5e_9223_7f450a814a15));
            Hub.Hub._gates.call_client(_client_uuid_b0cff194_b07c_38db_ae41_5f816e6cbfa2, "player_battle_rsp_cb_set_battle_role_list_rsp", _argv_b0cff194_b07c_38db_ae41_5f816e6cbfa2);
        }

        public void err(Int32 err_ad2710a2_3dd2_3a8f_a4c8_a7ebbe1df696){
            var _argv_b0cff194_b07c_38db_ae41_5f816e6cbfa2 = new ArrayList();
            _argv_b0cff194_b07c_38db_ae41_5f816e6cbfa2.Add(uuid_3bfcce5d_7fd6_3191_9f4c_326295164308);
            _argv_b0cff194_b07c_38db_ae41_5f816e6cbfa2.Add(err_ad2710a2_3dd2_3a8f_a4c8_a7ebbe1df696);
            Hub.Hub._gates.call_client(_client_uuid_b0cff194_b07c_38db_ae41_5f816e6cbfa2, "player_battle_rsp_cb_set_battle_role_list_err", _argv_b0cff194_b07c_38db_ae41_5f816e6cbfa2);
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

        public void rsp(string match_name_d50a466e_055b_3a8a_ac90_a255638bcd50){
            var _argv_01e120b2_ff3e_35bc_b812_e0d6fa294873 = new ArrayList();
            _argv_01e120b2_ff3e_35bc_b812_e0d6fa294873.Add(uuid_ee4a9042_3083_3d2e_90e2_aa58942d4f15);
            _argv_01e120b2_ff3e_35bc_b812_e0d6fa294873.Add(match_name_d50a466e_055b_3a8a_ac90_a255638bcd50);
            Hub.Hub._gates.call_client(_client_uuid_01e120b2_ff3e_35bc_b812_e0d6fa294873, "player_battle_rsp_cb_start_battle_rsp", _argv_01e120b2_ff3e_35bc_b812_e0d6fa294873);
        }

        public void err(Int32 err_ad2710a2_3dd2_3a8f_a4c8_a7ebbe1df696){
            var _argv_01e120b2_ff3e_35bc_b812_e0d6fa294873 = new ArrayList();
            _argv_01e120b2_ff3e_35bc_b812_e0d6fa294873.Add(uuid_ee4a9042_3083_3d2e_90e2_aa58942d4f15);
            _argv_01e120b2_ff3e_35bc_b812_e0d6fa294873.Add(err_ad2710a2_3dd2_3a8f_a4c8_a7ebbe1df696);
            Hub.Hub._gates.call_client(_client_uuid_01e120b2_ff3e_35bc_b812_e0d6fa294873, "player_battle_rsp_cb_start_battle_err", _argv_01e120b2_ff3e_35bc_b812_e0d6fa294873);
        }

    }

    public class player_battle_module : Common.IModule {
        public player_battle_module()
        {
            Hub.Hub._modules.add_mothed("player_battle_set_battle_role_list", set_battle_role_list);
            Hub.Hub._modules.add_mothed("player_battle_start_battle", start_battle);
        }

        public event Action<List<Int32>> on_set_battle_role_list;
        public void set_battle_role_list(IList<MsgPack.MessagePackObject> inArray){
            var _cb_uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _role_list = new List<Int32>();
            var _protocol_arrayrole_list = ((MsgPack.MessagePackObject)inArray[1]).AsList();
            foreach (var v_9797f049_d836_5d18_abd6_91a05cfcd191 in _protocol_arrayrole_list){
                _role_list.Add(((MsgPack.MessagePackObject)v_9797f049_d836_5d18_abd6_91a05cfcd191).AsInt32());
            }
            rsp = new player_battle_set_battle_role_list_rsp(Hub.Hub._gates.current_client_uuid, _cb_uuid);
            if (on_set_battle_role_list != null){
                on_set_battle_role_list(_role_list);
            }
            rsp = null;
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

    }

}
