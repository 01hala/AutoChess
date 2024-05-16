using System;
using System.Collections;
using System.Collections.Generic;
using System.Threading;
using MsgPack.Serialization;

namespace Abelkhan
{
/*this enum code is codegen by abelkhan codegen for c#*/

/*this struct code is codegen by abelkhan codegen for c#*/
    public class RankPlayer
    {
        public Int64 guid;
        public Int32 rank;
        public static MsgPack.MessagePackObjectDictionary RankPlayer_to_protcol(RankPlayer _struct){
        if (_struct == null) {
            return null;
        }

            var _protocol = new MsgPack.MessagePackObjectDictionary();
            _protocol.Add("guid", _struct.guid);
            _protocol.Add("rank", _struct.rank);
            return _protocol;
        }
        public static RankPlayer protcol_to_RankPlayer(MsgPack.MessagePackObjectDictionary _protocol){
        if (_protocol == null) {
            return null;
        }

            var _struct8ce51bc9_c092_3743_9794_3c9a157950d0 = new RankPlayer();
            foreach (var i in _protocol){
                if (((MsgPack.MessagePackObject)i.Key).AsString() == "guid"){
                    _struct8ce51bc9_c092_3743_9794_3c9a157950d0.guid = ((MsgPack.MessagePackObject)i.Value).AsInt64();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "rank"){
                    _struct8ce51bc9_c092_3743_9794_3c9a157950d0.rank = ((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
            }
            return _struct8ce51bc9_c092_3743_9794_3c9a157950d0;
        }
    }

/*this caller code is codegen by abelkhan codegen for c#*/
/*this cb code is codegen by abelkhan for c#*/
    public class rank_player_rsp_cb : Common.IModule {
        public rank_player_rsp_cb()
        {
        }

    }

    public class rank_player_caller {
        public static rank_player_rsp_cb rsp_cb_rank_player_handle = null;
        private ThreadLocal<rank_player_hubproxy> _hubproxy;
        public rank_player_caller()
        {
            if (rsp_cb_rank_player_handle == null)
            {
                rsp_cb_rank_player_handle = new rank_player_rsp_cb();
            }
            _hubproxy = new ThreadLocal<rank_player_hubproxy>();
        }

        public rank_player_hubproxy get_hub(string hub_name) {
            if (_hubproxy.Value == null)
{
                _hubproxy.Value = new rank_player_hubproxy(rsp_cb_rank_player_handle);
            }
            _hubproxy.Value.hub_name_3a069ca7_3e1a_3794_808f_5cb5261ebb92 = hub_name;
            return _hubproxy.Value;
        }

    }

    public class rank_player_hubproxy {
        public string hub_name_3a069ca7_3e1a_3794_808f_5cb5261ebb92;
        private Int32 uuid_3a069ca7_3e1a_3794_808f_5cb5261ebb92 = (Int32)RandomUUID.random();

        private rank_player_rsp_cb rsp_cb_rank_player_handle;

        public rank_player_hubproxy(rank_player_rsp_cb rsp_cb_rank_player_handle_)
        {
            rsp_cb_rank_player_handle = rsp_cb_rank_player_handle_;
        }

        public void rank_reward(List<RankPlayer> rewards){
            var _argv_5992f63c_f8fd_3884_8a61_540c35c40178 = new List<MsgPack.MessagePackObject>();
            var _array_0ec2fc23_234f_345d_9084_1d6d019cf4ae = new List<MsgPack.MessagePackObject>();
            foreach(var v_74e8c787_aa11_5942_96cd_c06dc60b8ce9 in rewards){
                _array_0ec2fc23_234f_345d_9084_1d6d019cf4ae.Add(MsgPack.MessagePackObject.FromObject(RankPlayer.RankPlayer_to_protcol(v_74e8c787_aa11_5942_96cd_c06dc60b8ce9)));
            }
            _argv_5992f63c_f8fd_3884_8a61_540c35c40178.Add(MsgPack.MessagePackObject.FromObject(_array_0ec2fc23_234f_345d_9084_1d6d019cf4ae));
            Hub.Hub._hubs.call_hub(hub_name_3a069ca7_3e1a_3794_808f_5cb5261ebb92, "rank_player_rank_reward", _argv_5992f63c_f8fd_3884_8a61_540c35c40178);
        }

    }
/*this module code is codegen by abelkhan codegen for c#*/
    public class rank_player_module : Common.IModule {
        public rank_player_module() 
        {
            Hub.Hub._modules.add_mothed("rank_player_rank_reward", rank_reward);
        }

        public event Action<List<RankPlayer>> on_rank_reward;
        public void rank_reward(IList<MsgPack.MessagePackObject> inArray){
            var _rewards = new List<RankPlayer>();
            var _protocol_arrayrewards = ((MsgPack.MessagePackObject)inArray[0]).AsList();
            foreach (var v_e4d7ed37_fda5_5bbe_988a_46cf15304815 in _protocol_arrayrewards){
                _rewards.Add(RankPlayer.protcol_to_RankPlayer(((MsgPack.MessagePackObject)v_e4d7ed37_fda5_5bbe_988a_46cf15304815).AsDictionary()));
            }
            if (on_rank_reward != null){
                on_rank_reward(_rewards);
            }
        }

    }

}
