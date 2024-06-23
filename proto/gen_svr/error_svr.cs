using System;
using System.Collections;
using System.Collections.Generic;
using System.Threading;
using MsgPack.Serialization;

namespace Abelkhan
{
/*this enum code is codegen by abelkhan codegen for c#*/

    public enum em_error{
        timeout = -2,
        db_error = -1,
        success = 0,
        server_busy = 1,
        unregistered_palyer = 2,
        login_dy_faild = 3,
        no_enough_strength = 4,
        no_role_in_index_to_sale = 5,
        not_same_role_to_update = 6,
        no_enough_coin = 7,
        already_have_role = 8,
        no_exist_role_group = 9,
        no_enough_card = 10,
        no_exist_role_card = 11,
        player_offline = 12,
        exceeds_maximum_limit_role = 13,
        peak_strength_no_data = 14,
        peak_strength_end = 15,
        not_complete_achievement = 16,
        not_exist_quest = 17
    }
/*this struct code is codegen by abelkhan codegen for c#*/
/*this caller code is codegen by abelkhan codegen for c#*/
/*this cb code is codegen by abelkhan for c#*/
    public class error_code_ntf_rsp_cb : Common.IModule {
        public error_code_ntf_rsp_cb() 
        {
        }

    }

    public class error_code_ntf_clientproxy {
        public string client_uuid_f657c200_2a33_308f_b478_82cef68fbca2;
        private Int32 uuid_f657c200_2a33_308f_b478_82cef68fbca2 = (Int32)RandomUUID.random();

        public error_code_ntf_rsp_cb rsp_cb_error_code_ntf_handle;

        public error_code_ntf_clientproxy(error_code_ntf_rsp_cb rsp_cb_error_code_ntf_handle_)
        {
            rsp_cb_error_code_ntf_handle = rsp_cb_error_code_ntf_handle_;
        }

        public void error_code(em_error err_code){
            var _argv_b2890040_4e10_3967_a5ca_fac1ca306870 = new ArrayList();
            _argv_b2890040_4e10_3967_a5ca_fac1ca306870.Add((int)err_code);
            Hub.Hub._gates.call_client(client_uuid_f657c200_2a33_308f_b478_82cef68fbca2, "error_code_ntf_error_code", _argv_b2890040_4e10_3967_a5ca_fac1ca306870);
        }

    }

    public class error_code_ntf_multicast {
        public List<string> client_uuids_f657c200_2a33_308f_b478_82cef68fbca2;
        public error_code_ntf_rsp_cb rsp_cb_error_code_ntf_handle;

        public error_code_ntf_multicast(error_code_ntf_rsp_cb rsp_cb_error_code_ntf_handle_)
        {
            rsp_cb_error_code_ntf_handle = rsp_cb_error_code_ntf_handle_;
        }

    }

    public class error_code_ntf_broadcast {
        public error_code_ntf_rsp_cb rsp_cb_error_code_ntf_handle;

        public error_code_ntf_broadcast(error_code_ntf_rsp_cb rsp_cb_error_code_ntf_handle_)
        {
            rsp_cb_error_code_ntf_handle = rsp_cb_error_code_ntf_handle_;
        }

    }

    public class error_code_ntf_caller {
        public static error_code_ntf_rsp_cb rsp_cb_error_code_ntf_handle = null;
        private ThreadLocal<error_code_ntf_clientproxy> _clientproxy;
        private ThreadLocal<error_code_ntf_multicast> _multicast;
        private error_code_ntf_broadcast _broadcast;

        public error_code_ntf_caller() 
        {
            if (rsp_cb_error_code_ntf_handle == null)
            {
                rsp_cb_error_code_ntf_handle = new error_code_ntf_rsp_cb();
            }

            _clientproxy = new ThreadLocal<error_code_ntf_clientproxy>();
            _multicast = new ThreadLocal<error_code_ntf_multicast>();
            _broadcast = new error_code_ntf_broadcast(rsp_cb_error_code_ntf_handle);
        }

        public error_code_ntf_clientproxy get_client(string client_uuid) {
            if (_clientproxy.Value == null)
{
                _clientproxy.Value = new error_code_ntf_clientproxy(rsp_cb_error_code_ntf_handle);
            }
            _clientproxy.Value.client_uuid_f657c200_2a33_308f_b478_82cef68fbca2 = client_uuid;
            return _clientproxy.Value;
        }

        public error_code_ntf_multicast get_multicast(List<string> client_uuids) {
            if (_multicast.Value == null)
{
                _multicast.Value = new error_code_ntf_multicast(rsp_cb_error_code_ntf_handle);
            }
            _multicast.Value.client_uuids_f657c200_2a33_308f_b478_82cef68fbca2 = client_uuids;
            return _multicast.Value;
        }

        public error_code_ntf_broadcast get_broadcast() {
            return _broadcast;
        }
    }


}
