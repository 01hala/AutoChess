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
/*this cb code is codegen by abelkhan for c#*/
    public class player_client_rsp_cb : Common.IModule {
        public player_client_rsp_cb() 
        {
        }

    }

    public class player_client_clientproxy {
        public string client_uuid_1aaece60_7bb0_3cf7_bd66_aeb26a76183d;
        private Int32 uuid_1aaece60_7bb0_3cf7_bd66_aeb26a76183d = (Int32)RandomUUID.random();

        public player_client_rsp_cb rsp_cb_player_client_handle;

        public player_client_clientproxy(player_client_rsp_cb rsp_cb_player_client_handle_)
        {
            rsp_cb_player_client_handle = rsp_cb_player_client_handle_;
        }

        public void archive_sync(UserData info){
            var _argv_0bdf385d_2dce_375e_8995_1f8c5c23e0a6 = new ArrayList();
            _argv_0bdf385d_2dce_375e_8995_1f8c5c23e0a6.Add(UserData.UserData_to_protcol(info));
            Hub.Hub._gates.call_client(client_uuid_1aaece60_7bb0_3cf7_bd66_aeb26a76183d, "player_client_archive_sync", _argv_0bdf385d_2dce_375e_8995_1f8c5c23e0a6);
        }

    }

    public class player_client_multicast {
        public List<string> client_uuids_1aaece60_7bb0_3cf7_bd66_aeb26a76183d;
        public player_client_rsp_cb rsp_cb_player_client_handle;

        public player_client_multicast(player_client_rsp_cb rsp_cb_player_client_handle_)
        {
            rsp_cb_player_client_handle = rsp_cb_player_client_handle_;
        }

    }

    public class player_client_broadcast {
        public player_client_rsp_cb rsp_cb_player_client_handle;

        public player_client_broadcast(player_client_rsp_cb rsp_cb_player_client_handle_)
        {
            rsp_cb_player_client_handle = rsp_cb_player_client_handle_;
        }

    }

    public class player_client_caller {
        public static player_client_rsp_cb rsp_cb_player_client_handle = null;
        private ThreadLocal<player_client_clientproxy> _clientproxy;
        private ThreadLocal<player_client_multicast> _multicast;
        private player_client_broadcast _broadcast;

        public player_client_caller() 
        {
            if (rsp_cb_player_client_handle == null)
            {
                rsp_cb_player_client_handle = new player_client_rsp_cb();
            }

            _clientproxy = new ThreadLocal<player_client_clientproxy>();
            _multicast = new ThreadLocal<player_client_multicast>();
            _broadcast = new player_client_broadcast(rsp_cb_player_client_handle);
        }

        public player_client_clientproxy get_client(string client_uuid) {
            if (_clientproxy.Value == null)
{
                _clientproxy.Value = new player_client_clientproxy(rsp_cb_player_client_handle);
            }
            _clientproxy.Value.client_uuid_1aaece60_7bb0_3cf7_bd66_aeb26a76183d = client_uuid;
            return _clientproxy.Value;
        }

        public player_client_multicast get_multicast(List<string> client_uuids) {
            if (_multicast.Value == null)
{
                _multicast.Value = new player_client_multicast(rsp_cb_player_client_handle);
            }
            _multicast.Value.client_uuids_1aaece60_7bb0_3cf7_bd66_aeb26a76183d = client_uuids;
            return _multicast.Value;
        }

        public player_client_broadcast get_broadcast() {
            return _broadcast;
        }
    }


}
