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
    public class player_archive_cost_strength_rsp : Common.Response {
        private string _client_uuid_c1f5a2a8_b494_3f28_8814_9be35e02be6a;
        private UInt64 uuid_e433d7f5_2143_3946_b780_bccdbe3f2043;
        public player_archive_cost_strength_rsp(string client_uuid, UInt64 _uuid)
        {
            _client_uuid_c1f5a2a8_b494_3f28_8814_9be35e02be6a = client_uuid;
            uuid_e433d7f5_2143_3946_b780_bccdbe3f2043 = _uuid;
        }

        public void rsp(UserData info_391fd3d4_2d55_3f5e_9223_7f450a814a15){
            var _argv_c1f5a2a8_b494_3f28_8814_9be35e02be6a = new ArrayList();
            _argv_c1f5a2a8_b494_3f28_8814_9be35e02be6a.Add(uuid_e433d7f5_2143_3946_b780_bccdbe3f2043);
            _argv_c1f5a2a8_b494_3f28_8814_9be35e02be6a.Add(UserData.UserData_to_protcol(info_391fd3d4_2d55_3f5e_9223_7f450a814a15));
            Hub.Hub._gates.call_client(_client_uuid_c1f5a2a8_b494_3f28_8814_9be35e02be6a, "player_archive_rsp_cb_cost_strength_rsp", _argv_c1f5a2a8_b494_3f28_8814_9be35e02be6a);
        }

        public void err(Int32 err_ad2710a2_3dd2_3a8f_a4c8_a7ebbe1df696){
            var _argv_c1f5a2a8_b494_3f28_8814_9be35e02be6a = new ArrayList();
            _argv_c1f5a2a8_b494_3f28_8814_9be35e02be6a.Add(uuid_e433d7f5_2143_3946_b780_bccdbe3f2043);
            _argv_c1f5a2a8_b494_3f28_8814_9be35e02be6a.Add(err_ad2710a2_3dd2_3a8f_a4c8_a7ebbe1df696);
            Hub.Hub._gates.call_client(_client_uuid_c1f5a2a8_b494_3f28_8814_9be35e02be6a, "player_archive_rsp_cb_cost_strength_err", _argv_c1f5a2a8_b494_3f28_8814_9be35e02be6a);
        }

    }

    public class player_archive_cost_coin_rsp : Common.Response {
        private string _client_uuid_ad552213_ca1e_3b02_b853_b56e3a935d76;
        private UInt64 uuid_d3ca2e61_6676_3a8b_921b_80012f65321a;
        public player_archive_cost_coin_rsp(string client_uuid, UInt64 _uuid)
        {
            _client_uuid_ad552213_ca1e_3b02_b853_b56e3a935d76 = client_uuid;
            uuid_d3ca2e61_6676_3a8b_921b_80012f65321a = _uuid;
        }

        public void rsp(UserData info_391fd3d4_2d55_3f5e_9223_7f450a814a15){
            var _argv_ad552213_ca1e_3b02_b853_b56e3a935d76 = new ArrayList();
            _argv_ad552213_ca1e_3b02_b853_b56e3a935d76.Add(uuid_d3ca2e61_6676_3a8b_921b_80012f65321a);
            _argv_ad552213_ca1e_3b02_b853_b56e3a935d76.Add(UserData.UserData_to_protcol(info_391fd3d4_2d55_3f5e_9223_7f450a814a15));
            Hub.Hub._gates.call_client(_client_uuid_ad552213_ca1e_3b02_b853_b56e3a935d76, "player_archive_rsp_cb_cost_coin_rsp", _argv_ad552213_ca1e_3b02_b853_b56e3a935d76);
        }

        public void err(Int32 err_ad2710a2_3dd2_3a8f_a4c8_a7ebbe1df696){
            var _argv_ad552213_ca1e_3b02_b853_b56e3a935d76 = new ArrayList();
            _argv_ad552213_ca1e_3b02_b853_b56e3a935d76.Add(uuid_d3ca2e61_6676_3a8b_921b_80012f65321a);
            _argv_ad552213_ca1e_3b02_b853_b56e3a935d76.Add(err_ad2710a2_3dd2_3a8f_a4c8_a7ebbe1df696);
            Hub.Hub._gates.call_client(_client_uuid_ad552213_ca1e_3b02_b853_b56e3a935d76, "player_archive_rsp_cb_cost_coin_err", _argv_ad552213_ca1e_3b02_b853_b56e3a935d76);
        }

    }

    public class player_archive_cost_prop_rsp : Common.Response {
        private string _client_uuid_04acb15b_4368_3e92_b7d5_054cc5c47f8c;
        private UInt64 uuid_88fa36db_ddde_3cc6_a3c5_503670b743be;
        public player_archive_cost_prop_rsp(string client_uuid, UInt64 _uuid)
        {
            _client_uuid_04acb15b_4368_3e92_b7d5_054cc5c47f8c = client_uuid;
            uuid_88fa36db_ddde_3cc6_a3c5_503670b743be = _uuid;
        }

        public void rsp(UserData info_391fd3d4_2d55_3f5e_9223_7f450a814a15){
            var _argv_04acb15b_4368_3e92_b7d5_054cc5c47f8c = new ArrayList();
            _argv_04acb15b_4368_3e92_b7d5_054cc5c47f8c.Add(uuid_88fa36db_ddde_3cc6_a3c5_503670b743be);
            _argv_04acb15b_4368_3e92_b7d5_054cc5c47f8c.Add(UserData.UserData_to_protcol(info_391fd3d4_2d55_3f5e_9223_7f450a814a15));
            Hub.Hub._gates.call_client(_client_uuid_04acb15b_4368_3e92_b7d5_054cc5c47f8c, "player_archive_rsp_cb_cost_prop_rsp", _argv_04acb15b_4368_3e92_b7d5_054cc5c47f8c);
        }

        public void err(Int32 err_ad2710a2_3dd2_3a8f_a4c8_a7ebbe1df696){
            var _argv_04acb15b_4368_3e92_b7d5_054cc5c47f8c = new ArrayList();
            _argv_04acb15b_4368_3e92_b7d5_054cc5c47f8c.Add(uuid_88fa36db_ddde_3cc6_a3c5_503670b743be);
            _argv_04acb15b_4368_3e92_b7d5_054cc5c47f8c.Add(err_ad2710a2_3dd2_3a8f_a4c8_a7ebbe1df696);
            Hub.Hub._gates.call_client(_client_uuid_04acb15b_4368_3e92_b7d5_054cc5c47f8c, "player_archive_rsp_cb_cost_prop_err", _argv_04acb15b_4368_3e92_b7d5_054cc5c47f8c);
        }

    }

    public class player_archive_open_chest_rsp : Common.Response {
        private string _client_uuid_d0593737_5916_31e8_815b_8e30421f4a32;
        private UInt64 uuid_df842803_97df_3e57_9db7_70bde071f3b8;
        public player_archive_open_chest_rsp(string client_uuid, UInt64 _uuid)
        {
            _client_uuid_d0593737_5916_31e8_815b_8e30421f4a32 = client_uuid;
            uuid_df842803_97df_3e57_9db7_70bde071f3b8 = _uuid;
        }

        public void rsp(UserData info_391fd3d4_2d55_3f5e_9223_7f450a814a15){
            var _argv_d0593737_5916_31e8_815b_8e30421f4a32 = new ArrayList();
            _argv_d0593737_5916_31e8_815b_8e30421f4a32.Add(uuid_df842803_97df_3e57_9db7_70bde071f3b8);
            _argv_d0593737_5916_31e8_815b_8e30421f4a32.Add(UserData.UserData_to_protcol(info_391fd3d4_2d55_3f5e_9223_7f450a814a15));
            Hub.Hub._gates.call_client(_client_uuid_d0593737_5916_31e8_815b_8e30421f4a32, "player_archive_rsp_cb_open_chest_rsp", _argv_d0593737_5916_31e8_815b_8e30421f4a32);
        }

        public void err(Int32 err_ad2710a2_3dd2_3a8f_a4c8_a7ebbe1df696){
            var _argv_d0593737_5916_31e8_815b_8e30421f4a32 = new ArrayList();
            _argv_d0593737_5916_31e8_815b_8e30421f4a32.Add(uuid_df842803_97df_3e57_9db7_70bde071f3b8);
            _argv_d0593737_5916_31e8_815b_8e30421f4a32.Add(err_ad2710a2_3dd2_3a8f_a4c8_a7ebbe1df696);
            Hub.Hub._gates.call_client(_client_uuid_d0593737_5916_31e8_815b_8e30421f4a32, "player_archive_rsp_cb_open_chest_err", _argv_d0593737_5916_31e8_815b_8e30421f4a32);
        }

    }

    public class player_archive_add_coin_rsp : Common.Response {
        private string _client_uuid_68d61429_8f03_329b_a588_1069fa6d4cff;
        private UInt64 uuid_011b2313_efa6_31d5_baf0_8ac2a02ba057;
        public player_archive_add_coin_rsp(string client_uuid, UInt64 _uuid)
        {
            _client_uuid_68d61429_8f03_329b_a588_1069fa6d4cff = client_uuid;
            uuid_011b2313_efa6_31d5_baf0_8ac2a02ba057 = _uuid;
        }

        public void rsp(UserData info_391fd3d4_2d55_3f5e_9223_7f450a814a15){
            var _argv_68d61429_8f03_329b_a588_1069fa6d4cff = new ArrayList();
            _argv_68d61429_8f03_329b_a588_1069fa6d4cff.Add(uuid_011b2313_efa6_31d5_baf0_8ac2a02ba057);
            _argv_68d61429_8f03_329b_a588_1069fa6d4cff.Add(UserData.UserData_to_protcol(info_391fd3d4_2d55_3f5e_9223_7f450a814a15));
            Hub.Hub._gates.call_client(_client_uuid_68d61429_8f03_329b_a588_1069fa6d4cff, "player_archive_rsp_cb_add_coin_rsp", _argv_68d61429_8f03_329b_a588_1069fa6d4cff);
        }

        public void err(Int32 err_ad2710a2_3dd2_3a8f_a4c8_a7ebbe1df696){
            var _argv_68d61429_8f03_329b_a588_1069fa6d4cff = new ArrayList();
            _argv_68d61429_8f03_329b_a588_1069fa6d4cff.Add(uuid_011b2313_efa6_31d5_baf0_8ac2a02ba057);
            _argv_68d61429_8f03_329b_a588_1069fa6d4cff.Add(err_ad2710a2_3dd2_3a8f_a4c8_a7ebbe1df696);
            Hub.Hub._gates.call_client(_client_uuid_68d61429_8f03_329b_a588_1069fa6d4cff, "player_archive_rsp_cb_add_coin_err", _argv_68d61429_8f03_329b_a588_1069fa6d4cff);
        }

    }

    public class player_archive_add_strength_rsp : Common.Response {
        private string _client_uuid_424d3381_ff2c_37eb_a44a_fd95f504b1e4;
        private UInt64 uuid_0e7d9a79_fa16_3988_a995_951b923ec954;
        public player_archive_add_strength_rsp(string client_uuid, UInt64 _uuid)
        {
            _client_uuid_424d3381_ff2c_37eb_a44a_fd95f504b1e4 = client_uuid;
            uuid_0e7d9a79_fa16_3988_a995_951b923ec954 = _uuid;
        }

        public void rsp(UserData info_391fd3d4_2d55_3f5e_9223_7f450a814a15){
            var _argv_424d3381_ff2c_37eb_a44a_fd95f504b1e4 = new ArrayList();
            _argv_424d3381_ff2c_37eb_a44a_fd95f504b1e4.Add(uuid_0e7d9a79_fa16_3988_a995_951b923ec954);
            _argv_424d3381_ff2c_37eb_a44a_fd95f504b1e4.Add(UserData.UserData_to_protcol(info_391fd3d4_2d55_3f5e_9223_7f450a814a15));
            Hub.Hub._gates.call_client(_client_uuid_424d3381_ff2c_37eb_a44a_fd95f504b1e4, "player_archive_rsp_cb_add_strength_rsp", _argv_424d3381_ff2c_37eb_a44a_fd95f504b1e4);
        }

        public void err(Int32 err_ad2710a2_3dd2_3a8f_a4c8_a7ebbe1df696){
            var _argv_424d3381_ff2c_37eb_a44a_fd95f504b1e4 = new ArrayList();
            _argv_424d3381_ff2c_37eb_a44a_fd95f504b1e4.Add(uuid_0e7d9a79_fa16_3988_a995_951b923ec954);
            _argv_424d3381_ff2c_37eb_a44a_fd95f504b1e4.Add(err_ad2710a2_3dd2_3a8f_a4c8_a7ebbe1df696);
            Hub.Hub._gates.call_client(_client_uuid_424d3381_ff2c_37eb_a44a_fd95f504b1e4, "player_archive_rsp_cb_add_strength_err", _argv_424d3381_ff2c_37eb_a44a_fd95f504b1e4);
        }

    }

    public class player_archive_add_skill_rsp : Common.Response {
        private string _client_uuid_5a9f41f9_9c1b_31ee_abed_09712facbd18;
        private UInt64 uuid_ce269d08_45f9_30df_91a5_6726ca942edc;
        public player_archive_add_skill_rsp(string client_uuid, UInt64 _uuid)
        {
            _client_uuid_5a9f41f9_9c1b_31ee_abed_09712facbd18 = client_uuid;
            uuid_ce269d08_45f9_30df_91a5_6726ca942edc = _uuid;
        }

        public void rsp(UserData info_391fd3d4_2d55_3f5e_9223_7f450a814a15){
            var _argv_5a9f41f9_9c1b_31ee_abed_09712facbd18 = new ArrayList();
            _argv_5a9f41f9_9c1b_31ee_abed_09712facbd18.Add(uuid_ce269d08_45f9_30df_91a5_6726ca942edc);
            _argv_5a9f41f9_9c1b_31ee_abed_09712facbd18.Add(UserData.UserData_to_protcol(info_391fd3d4_2d55_3f5e_9223_7f450a814a15));
            Hub.Hub._gates.call_client(_client_uuid_5a9f41f9_9c1b_31ee_abed_09712facbd18, "player_archive_rsp_cb_add_skill_rsp", _argv_5a9f41f9_9c1b_31ee_abed_09712facbd18);
        }

        public void err(Int32 err_ad2710a2_3dd2_3a8f_a4c8_a7ebbe1df696){
            var _argv_5a9f41f9_9c1b_31ee_abed_09712facbd18 = new ArrayList();
            _argv_5a9f41f9_9c1b_31ee_abed_09712facbd18.Add(uuid_ce269d08_45f9_30df_91a5_6726ca942edc);
            _argv_5a9f41f9_9c1b_31ee_abed_09712facbd18.Add(err_ad2710a2_3dd2_3a8f_a4c8_a7ebbe1df696);
            Hub.Hub._gates.call_client(_client_uuid_5a9f41f9_9c1b_31ee_abed_09712facbd18, "player_archive_rsp_cb_add_skill_err", _argv_5a9f41f9_9c1b_31ee_abed_09712facbd18);
        }

    }

    public class player_archive_add_monster_rsp : Common.Response {
        private string _client_uuid_3557bc3e_9709_3cfd_ae3e_a29771974a96;
        private UInt64 uuid_51f73ea3_a2e0_32dc_8cca_d3b91e4e155c;
        public player_archive_add_monster_rsp(string client_uuid, UInt64 _uuid)
        {
            _client_uuid_3557bc3e_9709_3cfd_ae3e_a29771974a96 = client_uuid;
            uuid_51f73ea3_a2e0_32dc_8cca_d3b91e4e155c = _uuid;
        }

        public void rsp(UserData info_391fd3d4_2d55_3f5e_9223_7f450a814a15){
            var _argv_3557bc3e_9709_3cfd_ae3e_a29771974a96 = new ArrayList();
            _argv_3557bc3e_9709_3cfd_ae3e_a29771974a96.Add(uuid_51f73ea3_a2e0_32dc_8cca_d3b91e4e155c);
            _argv_3557bc3e_9709_3cfd_ae3e_a29771974a96.Add(UserData.UserData_to_protcol(info_391fd3d4_2d55_3f5e_9223_7f450a814a15));
            Hub.Hub._gates.call_client(_client_uuid_3557bc3e_9709_3cfd_ae3e_a29771974a96, "player_archive_rsp_cb_add_monster_rsp", _argv_3557bc3e_9709_3cfd_ae3e_a29771974a96);
        }

        public void err(Int32 err_ad2710a2_3dd2_3a8f_a4c8_a7ebbe1df696){
            var _argv_3557bc3e_9709_3cfd_ae3e_a29771974a96 = new ArrayList();
            _argv_3557bc3e_9709_3cfd_ae3e_a29771974a96.Add(uuid_51f73ea3_a2e0_32dc_8cca_d3b91e4e155c);
            _argv_3557bc3e_9709_3cfd_ae3e_a29771974a96.Add(err_ad2710a2_3dd2_3a8f_a4c8_a7ebbe1df696);
            Hub.Hub._gates.call_client(_client_uuid_3557bc3e_9709_3cfd_ae3e_a29771974a96, "player_archive_rsp_cb_add_monster_err", _argv_3557bc3e_9709_3cfd_ae3e_a29771974a96);
        }

    }

    public class player_archive_module : Common.IModule {
        public player_archive_module()
        {
            Hub.Hub._modules.add_mothed("player_archive_cost_strength", cost_strength);
            Hub.Hub._modules.add_mothed("player_archive_cost_coin", cost_coin);
            Hub.Hub._modules.add_mothed("player_archive_cost_prop", cost_prop);
            Hub.Hub._modules.add_mothed("player_archive_open_chest", open_chest);
            Hub.Hub._modules.add_mothed("player_archive_add_coin", add_coin);
            Hub.Hub._modules.add_mothed("player_archive_add_strength", add_strength);
            Hub.Hub._modules.add_mothed("player_archive_add_skill", add_skill);
            Hub.Hub._modules.add_mothed("player_archive_add_monster", add_monster);
        }

        public event Action<Int32> on_cost_strength;
        public void cost_strength(IList<MsgPack.MessagePackObject> inArray){
            var _cb_uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _strength = ((MsgPack.MessagePackObject)inArray[1]).AsInt32();
            rsp = new player_archive_cost_strength_rsp(Hub.Hub._gates.current_client_uuid, _cb_uuid);
            if (on_cost_strength != null){
                on_cost_strength(_strength);
            }
            rsp = null;
        }

        public event Action<Int32, EMCostCoinPath, Int32> on_cost_coin;
        public void cost_coin(IList<MsgPack.MessagePackObject> inArray){
            var _cb_uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _cost_amount = ((MsgPack.MessagePackObject)inArray[1]).AsInt32();
            var _cost_path = (EMCostCoinPath)((MsgPack.MessagePackObject)inArray[2]).AsInt32();
            var _role_id = ((MsgPack.MessagePackObject)inArray[3]).AsInt32();
            rsp = new player_archive_cost_coin_rsp(Hub.Hub._gates.current_client_uuid, _cb_uuid);
            if (on_cost_coin != null){
                on_cost_coin(_cost_amount, _cost_path, _role_id);
            }
            rsp = null;
        }

        public event Action<Int32> on_cost_prop;
        public void cost_prop(IList<MsgPack.MessagePackObject> inArray){
            var _cb_uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _prop_id = ((MsgPack.MessagePackObject)inArray[1]).AsInt32();
            rsp = new player_archive_cost_prop_rsp(Hub.Hub._gates.current_client_uuid, _cb_uuid);
            if (on_cost_prop != null){
                on_cost_prop(_prop_id);
            }
            rsp = null;
        }

        public event Action<EMChestType> on_open_chest;
        public void open_chest(IList<MsgPack.MessagePackObject> inArray){
            var _cb_uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _chest_type = (EMChestType)((MsgPack.MessagePackObject)inArray[1]).AsInt32();
            rsp = new player_archive_open_chest_rsp(Hub.Hub._gates.current_client_uuid, _cb_uuid);
            if (on_open_chest != null){
                on_open_chest(_chest_type);
            }
            rsp = null;
        }

        public event Action<Int32> on_add_coin;
        public void add_coin(IList<MsgPack.MessagePackObject> inArray){
            var _cb_uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _coin = ((MsgPack.MessagePackObject)inArray[1]).AsInt32();
            rsp = new player_archive_add_coin_rsp(Hub.Hub._gates.current_client_uuid, _cb_uuid);
            if (on_add_coin != null){
                on_add_coin(_coin);
            }
            rsp = null;
        }

        public event Action<Int32> on_add_strength;
        public void add_strength(IList<MsgPack.MessagePackObject> inArray){
            var _cb_uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _strength = ((MsgPack.MessagePackObject)inArray[1]).AsInt32();
            rsp = new player_archive_add_strength_rsp(Hub.Hub._gates.current_client_uuid, _cb_uuid);
            if (on_add_strength != null){
                on_add_strength(_strength);
            }
            rsp = null;
        }

        public event Action<Skill> on_add_skill;
        public void add_skill(IList<MsgPack.MessagePackObject> inArray){
            var _cb_uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _skill = Skill.protcol_to_Skill(((MsgPack.MessagePackObject)inArray[1]).AsDictionary());
            rsp = new player_archive_add_skill_rsp(Hub.Hub._gates.current_client_uuid, _cb_uuid);
            if (on_add_skill != null){
                on_add_skill(_skill);
            }
            rsp = null;
        }

        public event Action<Monster> on_add_monster;
        public void add_monster(IList<MsgPack.MessagePackObject> inArray){
            var _cb_uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _monster = Monster.protcol_to_Monster(((MsgPack.MessagePackObject)inArray[1]).AsDictionary());
            rsp = new player_archive_add_monster_rsp(Hub.Hub._gates.current_client_uuid, _cb_uuid);
            if (on_add_monster != null){
                on_add_monster(_monster);
            }
            rsp = null;
        }

    }

}
