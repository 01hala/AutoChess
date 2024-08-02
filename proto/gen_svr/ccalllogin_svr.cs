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
    public class login_player_login_no_token_rsp : Common.Response {
        private string _client_uuid_3e2e7610_1bd3_3053_a6cb_55c17d6b8ebf;
        private UInt64 uuid_b295d7ce_3d9c_398f_8f6a_ee7a40f01d25;
        public login_player_login_no_token_rsp(string client_uuid, UInt64 _uuid)
        {
            _client_uuid_3e2e7610_1bd3_3053_a6cb_55c17d6b8ebf = client_uuid;
            uuid_b295d7ce_3d9c_398f_8f6a_ee7a40f01d25 = _uuid;
        }

        public void rsp(string player_hub_name_e16830b9_52e1_36d5_aff7_3ebaf4d86eb0, string token_6333efe6_4f25_3c9a_a58e_52c6c889a79e, bool is_new_5d1e1efe_be90_3292_8472_afb7a7640de8){
            var _argv_3e2e7610_1bd3_3053_a6cb_55c17d6b8ebf = new ArrayList();
            _argv_3e2e7610_1bd3_3053_a6cb_55c17d6b8ebf.Add(uuid_b295d7ce_3d9c_398f_8f6a_ee7a40f01d25);
            _argv_3e2e7610_1bd3_3053_a6cb_55c17d6b8ebf.Add(player_hub_name_e16830b9_52e1_36d5_aff7_3ebaf4d86eb0);
            _argv_3e2e7610_1bd3_3053_a6cb_55c17d6b8ebf.Add(token_6333efe6_4f25_3c9a_a58e_52c6c889a79e);
            _argv_3e2e7610_1bd3_3053_a6cb_55c17d6b8ebf.Add(is_new_5d1e1efe_be90_3292_8472_afb7a7640de8);
            Hub.Hub._gates.call_client(_client_uuid_3e2e7610_1bd3_3053_a6cb_55c17d6b8ebf, "login_rsp_cb_player_login_no_token_rsp", _argv_3e2e7610_1bd3_3053_a6cb_55c17d6b8ebf);
        }

        public void err(Int32 err_ad2710a2_3dd2_3a8f_a4c8_a7ebbe1df696){
            var _argv_3e2e7610_1bd3_3053_a6cb_55c17d6b8ebf = new ArrayList();
            _argv_3e2e7610_1bd3_3053_a6cb_55c17d6b8ebf.Add(uuid_b295d7ce_3d9c_398f_8f6a_ee7a40f01d25);
            _argv_3e2e7610_1bd3_3053_a6cb_55c17d6b8ebf.Add(err_ad2710a2_3dd2_3a8f_a4c8_a7ebbe1df696);
            Hub.Hub._gates.call_client(_client_uuid_3e2e7610_1bd3_3053_a6cb_55c17d6b8ebf, "login_rsp_cb_player_login_no_token_err", _argv_3e2e7610_1bd3_3053_a6cb_55c17d6b8ebf);
        }

    }

    public class login_player_login_wx_rsp : Common.Response {
        private string _client_uuid_f260ea6c_9f00_31da_bd24_7e885d5e027d;
        private UInt64 uuid_16fc813a_bcd2_3f4d_a93e_f851f857089a;
        public login_player_login_wx_rsp(string client_uuid, UInt64 _uuid)
        {
            _client_uuid_f260ea6c_9f00_31da_bd24_7e885d5e027d = client_uuid;
            uuid_16fc813a_bcd2_3f4d_a93e_f851f857089a = _uuid;
        }

        public void rsp(string player_hub_name_e16830b9_52e1_36d5_aff7_3ebaf4d86eb0, string token_6333efe6_4f25_3c9a_a58e_52c6c889a79e, bool is_new_5d1e1efe_be90_3292_8472_afb7a7640de8){
            var _argv_f260ea6c_9f00_31da_bd24_7e885d5e027d = new ArrayList();
            _argv_f260ea6c_9f00_31da_bd24_7e885d5e027d.Add(uuid_16fc813a_bcd2_3f4d_a93e_f851f857089a);
            _argv_f260ea6c_9f00_31da_bd24_7e885d5e027d.Add(player_hub_name_e16830b9_52e1_36d5_aff7_3ebaf4d86eb0);
            _argv_f260ea6c_9f00_31da_bd24_7e885d5e027d.Add(token_6333efe6_4f25_3c9a_a58e_52c6c889a79e);
            _argv_f260ea6c_9f00_31da_bd24_7e885d5e027d.Add(is_new_5d1e1efe_be90_3292_8472_afb7a7640de8);
            Hub.Hub._gates.call_client(_client_uuid_f260ea6c_9f00_31da_bd24_7e885d5e027d, "login_rsp_cb_player_login_wx_rsp", _argv_f260ea6c_9f00_31da_bd24_7e885d5e027d);
        }

        public void err(Int32 err_ad2710a2_3dd2_3a8f_a4c8_a7ebbe1df696){
            var _argv_f260ea6c_9f00_31da_bd24_7e885d5e027d = new ArrayList();
            _argv_f260ea6c_9f00_31da_bd24_7e885d5e027d.Add(uuid_16fc813a_bcd2_3f4d_a93e_f851f857089a);
            _argv_f260ea6c_9f00_31da_bd24_7e885d5e027d.Add(err_ad2710a2_3dd2_3a8f_a4c8_a7ebbe1df696);
            Hub.Hub._gates.call_client(_client_uuid_f260ea6c_9f00_31da_bd24_7e885d5e027d, "login_rsp_cb_player_login_wx_err", _argv_f260ea6c_9f00_31da_bd24_7e885d5e027d);
        }

    }

    public class login_player_login_dy_rsp : Common.Response {
        private string _client_uuid_71c7fc76_b480_3603_a181_4245a2f78904;
        private UInt64 uuid_e7891139_3b5f_3714_83b6_4be0a51f4bfc;
        public login_player_login_dy_rsp(string client_uuid, UInt64 _uuid)
        {
            _client_uuid_71c7fc76_b480_3603_a181_4245a2f78904 = client_uuid;
            uuid_e7891139_3b5f_3714_83b6_4be0a51f4bfc = _uuid;
        }

        public void rsp(string player_hub_name_e16830b9_52e1_36d5_aff7_3ebaf4d86eb0, string token_6333efe6_4f25_3c9a_a58e_52c6c889a79e, bool is_new_5d1e1efe_be90_3292_8472_afb7a7640de8){
            var _argv_71c7fc76_b480_3603_a181_4245a2f78904 = new ArrayList();
            _argv_71c7fc76_b480_3603_a181_4245a2f78904.Add(uuid_e7891139_3b5f_3714_83b6_4be0a51f4bfc);
            _argv_71c7fc76_b480_3603_a181_4245a2f78904.Add(player_hub_name_e16830b9_52e1_36d5_aff7_3ebaf4d86eb0);
            _argv_71c7fc76_b480_3603_a181_4245a2f78904.Add(token_6333efe6_4f25_3c9a_a58e_52c6c889a79e);
            _argv_71c7fc76_b480_3603_a181_4245a2f78904.Add(is_new_5d1e1efe_be90_3292_8472_afb7a7640de8);
            Hub.Hub._gates.call_client(_client_uuid_71c7fc76_b480_3603_a181_4245a2f78904, "login_rsp_cb_player_login_dy_rsp", _argv_71c7fc76_b480_3603_a181_4245a2f78904);
        }

        public void err(Int32 err_ad2710a2_3dd2_3a8f_a4c8_a7ebbe1df696){
            var _argv_71c7fc76_b480_3603_a181_4245a2f78904 = new ArrayList();
            _argv_71c7fc76_b480_3603_a181_4245a2f78904.Add(uuid_e7891139_3b5f_3714_83b6_4be0a51f4bfc);
            _argv_71c7fc76_b480_3603_a181_4245a2f78904.Add(err_ad2710a2_3dd2_3a8f_a4c8_a7ebbe1df696);
            Hub.Hub._gates.call_client(_client_uuid_71c7fc76_b480_3603_a181_4245a2f78904, "login_rsp_cb_player_login_dy_err", _argv_71c7fc76_b480_3603_a181_4245a2f78904);
        }

    }

    public class login_module : Common.IModule {
        public login_module()
        {
            Hub.Hub._modules.add_mothed("login_player_login_no_token", player_login_no_token);
            Hub.Hub._modules.add_mothed("login_player_login_wx", player_login_wx);
            Hub.Hub._modules.add_mothed("login_player_login_dy", player_login_dy);
        }

        public event Action<string> on_player_login_no_token;
        public void player_login_no_token(IList<MsgPack.MessagePackObject> inArray){
            var _cb_uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _account = ((MsgPack.MessagePackObject)inArray[1]).AsString();
            rsp = new login_player_login_no_token_rsp(Hub.Hub._gates.current_client_uuid, _cb_uuid);
            if (on_player_login_no_token != null){
                on_player_login_no_token(_account);
            }
            rsp = null;
        }

        public event Action<string> on_player_login_wx;
        public void player_login_wx(IList<MsgPack.MessagePackObject> inArray){
            var _cb_uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _code = ((MsgPack.MessagePackObject)inArray[1]).AsString();
            rsp = new login_player_login_wx_rsp(Hub.Hub._gates.current_client_uuid, _cb_uuid);
            if (on_player_login_wx != null){
                on_player_login_wx(_code);
            }
            rsp = null;
        }

        public event Action<string, string> on_player_login_dy;
        public void player_login_dy(IList<MsgPack.MessagePackObject> inArray){
            var _cb_uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _code = ((MsgPack.MessagePackObject)inArray[1]).AsString();
            var _anonymous_code = ((MsgPack.MessagePackObject)inArray[2]).AsString();
            rsp = new login_player_login_dy_rsp(Hub.Hub._gates.current_client_uuid, _cb_uuid);
            if (on_player_login_dy != null){
                on_player_login_dy(_code, _anonymous_code);
            }
            rsp = null;
        }

    }

}
