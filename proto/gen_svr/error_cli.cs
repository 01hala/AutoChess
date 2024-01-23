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
        no_enough_card = 10
    }
/*this struct code is codegen by abelkhan codegen for c#*/
/*this module code is codegen by abelkhan codegen for c#*/
    public class error_code_ntf_module : Common.IModule {
        public Client.Client _client_handle;
        public error_code_ntf_module(Client.Client client_handle_) 
        {
            _client_handle = client_handle_;
            _client_handle.modulemanager.add_mothed("error_code_ntf_error_code", error_code);
        }

        public event Action<em_error> on_error_code;
        public void error_code(IList<MsgPack.MessagePackObject> inArray){
            var _err_code = (em_error)((MsgPack.MessagePackObject)inArray[0]).AsInt32();
            if (on_error_code != null){
                on_error_code(_err_code);
            }
        }

    }

}
