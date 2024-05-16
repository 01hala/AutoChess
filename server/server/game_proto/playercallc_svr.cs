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
            var _argv_0bdf385d_2dce_375e_8995_1f8c5c23e0a6 = new List<MsgPack.MessagePackObject>();
            _argv_0bdf385d_2dce_375e_8995_1f8c5c23e0a6.Add(MsgPack.MessagePackObject.FromObject(UserData.UserData_to_protcol(info)));
            Hub.Hub._gates.call_client(client_uuid_1aaece60_7bb0_3cf7_bd66_aeb26a76183d, "player_client_archive_sync", _argv_0bdf385d_2dce_375e_8995_1f8c5c23e0a6);
        }

        public void battle_victory(){
            var _argv_5388fb35_f021_358e_992c_9d18e0f4cfc5 = new List<MsgPack.MessagePackObject>();
            Hub.Hub._gates.call_client(client_uuid_1aaece60_7bb0_3cf7_bd66_aeb26a76183d, "player_client_battle_victory", _argv_5388fb35_f021_358e_992c_9d18e0f4cfc5);
        }

        public void achievement_complete(UserAchievement achieve, UserWeekAchievement wAchieve){
            var _argv_9b26826c_861c_3222_982d_eea9222c423a = new List<MsgPack.MessagePackObject>();
            _argv_9b26826c_861c_3222_982d_eea9222c423a.Add(MsgPack.MessagePackObject.FromObject(UserAchievement.UserAchievement_to_protcol(achieve)));
            _argv_9b26826c_861c_3222_982d_eea9222c423a.Add(MsgPack.MessagePackObject.FromObject(UserWeekAchievement.UserWeekAchievement_to_protcol(wAchieve)));
            Hub.Hub._gates.call_client(client_uuid_1aaece60_7bb0_3cf7_bd66_aeb26a76183d, "player_client_achievement_complete", _argv_9b26826c_861c_3222_982d_eea9222c423a);
        }

        public void rank_reward(RankReward reward){
            var _argv_5992f63c_f8fd_3884_8a61_540c35c40178 = new List<MsgPack.MessagePackObject>();
            _argv_5992f63c_f8fd_3884_8a61_540c35c40178.Add(MsgPack.MessagePackObject.FromObject(RankReward.RankReward_to_protcol(reward)));
            Hub.Hub._gates.call_client(client_uuid_1aaece60_7bb0_3cf7_bd66_aeb26a76183d, "player_client_rank_reward", _argv_5992f63c_f8fd_3884_8a61_540c35c40178);
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
