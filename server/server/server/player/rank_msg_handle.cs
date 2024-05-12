using Abelkhan;
using MsgPack.Serialization;
using OfflineMsg;
using Service;
using System;
using System.Numerics;
using System.Threading.Tasks;
using static OfflineMsg.OfflineMsgMgr;

namespace Player
{
    public class RankRewardMsg
    {
        public long guid;
        public int rank;
        public int gold;
    }

    public class rank_msg_handle
    {
        private readonly rank_player_module rank_Player_Module;

        public rank_msg_handle()
        {
            rank_Player_Module = new ();
            rank_Player_Module.on_rank_reward += Rank_Player_Module_on_rank_reward;

            Player.offline_Msg_Mng.register_offline_msg_callback("RankRewardMsg", do_rank_reward);
        }

        private void do_rank_reward(offline_msg msg)
        {
            using var _tmp = MemoryStreamPool.mstMgr.GetStream();
            _tmp.Write(msg.msg, 0, msg.msg.Length);
            _tmp.Position = 0;
            var _serializer = MessagePackSerializer.Get<RankRewardMsg>();
            var _rank_reward_msg = _serializer.Unpack(_tmp);

            var _avatar = Player.client_Mng.guid_get_client_proxy(long.Parse(msg.player_guid));
            var _data = _avatar.get_real_hosting_data<PlayerInfo>();
            _data.Data.Info().gold += _rank_reward_msg.gold;

            client_mng.PlayerClientCaller.get_client(_avatar.ClientUUID).rank_reward(new RankReward()
            {
                rank = _rank_reward_msg.rank,
                gold = _rank_reward_msg.gold,
                timetmp = msg.send_timetmp,
            });
            Player.offline_Msg_Mng.del_offline_msg(msg.msg_guid);
        }

        private void Rank_Player_Module_on_rank_reward(System.Collections.Generic.List<RankPlayer> ranks)
        {
            Log.Log.trace("on_rank_reward begin!");

            foreach (var r in ranks)
            {
                if (config.Config.RankRewardConfigs.TryGetValue(r.rank, out var reward))
                {
                    var gold = 0;
                    foreach (var (t, v) in reward.Reward)
                    {
                        if (t == "Gold")
                        {
                            gold = v;
                        }
                    }

                    var _msg = new RankRewardMsg
                    {
                        guid = r.guid,
                        rank = r.rank,
                        gold = gold,
                    };

                    using var st = MemoryStreamPool.mstMgr.GetStream();
                    var _serializer = MessagePackSerializer.Get<RankRewardMsg>();
                    _serializer.Pack(st, _msg);

                    var _offline_msg = new OfflineMsgMgr.offline_msg()
                    {
                        msg_guid = Guid.NewGuid().ToString("N"),
                        player_guid = r.guid.ToString(),
                        send_timetmp = Timerservice.Tick,
                        msg_type = "RankRewardMsg",
                        msg = st.ToArray(),
                    };
                    client_mng.forward_offline_msg(_offline_msg);
                }
            }
        }
    }
}
