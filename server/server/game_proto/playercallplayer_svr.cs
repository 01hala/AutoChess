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
    public class player_player_offline_msg_rsp_cb : Common.IModule {
        public player_player_offline_msg_rsp_cb()
        {
        }

    }

    public class player_player_offline_msg_caller {
        public static player_player_offline_msg_rsp_cb rsp_cb_player_player_offline_msg_handle = null;
        private ThreadLocal<player_player_offline_msg_hubproxy> _hubproxy;
        public player_player_offline_msg_caller()
        {
            if (rsp_cb_player_player_offline_msg_handle == null)
            {
                rsp_cb_player_player_offline_msg_handle = new player_player_offline_msg_rsp_cb();
            }
            _hubproxy = new ThreadLocal<player_player_offline_msg_hubproxy>();
        }

        public player_player_offline_msg_hubproxy get_hub(string hub_name) {
            if (_hubproxy.Value == null)
{
                _hubproxy.Value = new player_player_offline_msg_hubproxy(rsp_cb_player_player_offline_msg_handle);
            }
            _hubproxy.Value.hub_name_d5d0e1c9_52d5_396b_96e3_551f12e9aeb0 = hub_name;
            return _hubproxy.Value;
        }

    }

    public class player_player_offline_msg_hubproxy {
        public string hub_name_d5d0e1c9_52d5_396b_96e3_551f12e9aeb0;
        private Int32 uuid_d5d0e1c9_52d5_396b_96e3_551f12e9aeb0 = (Int32)RandomUUID.random();

        private player_player_offline_msg_rsp_cb rsp_cb_player_player_offline_msg_handle;

        public player_player_offline_msg_hubproxy(player_player_offline_msg_rsp_cb rsp_cb_player_player_offline_msg_handle_)
        {
            rsp_cb_player_player_offline_msg_handle = rsp_cb_player_player_offline_msg_handle_;
        }

        public void player_have_offline_msg(Int64 guid){
            var _argv_0031381b_1b05_3a71_a318_b52adaa27ce5 = new List<MsgPack.MessagePackObject>();
            _argv_0031381b_1b05_3a71_a318_b52adaa27ce5.Add(guid);
            Hub.Hub._hubs.call_hub(hub_name_d5d0e1c9_52d5_396b_96e3_551f12e9aeb0, "player_player_offline_msg_player_have_offline_msg", _argv_0031381b_1b05_3a71_a318_b52adaa27ce5);
        }

    }
/*this module code is codegen by abelkhan codegen for c#*/
    public class player_player_offline_msg_module : Common.IModule {
        public player_player_offline_msg_module() 
        {
            Hub.Hub._modules.add_mothed("player_player_offline_msg_player_have_offline_msg", player_have_offline_msg);
        }

        public event Action<Int64> on_player_have_offline_msg;
        public void player_have_offline_msg(IList<MsgPack.MessagePackObject> inArray){
            var _guid = ((MsgPack.MessagePackObject)inArray[0]).AsInt64();
            if (on_player_have_offline_msg != null){
                on_player_have_offline_msg(_guid);
            }
        }

    }

}
