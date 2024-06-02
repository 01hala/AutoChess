using Abelkhan;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Runtime.InteropServices;

namespace RankSvr
{
    class PlayerProxy
    {
        private Hub.HubProxy proxy;
        private rank_player_caller caller;

        public PlayerProxy(Hub.HubProxy _proxy, rank_player_caller _caller)
        {
            proxy = _proxy;
            caller = _caller;
        }

        public void rank_reward(List<RankPlayer> rewards)
        {
            caller.get_hub(proxy.name).rank_reward(rewards);
        }
    }

    class RankSvr
    {
        private static readonly rank_player_caller caller = new();
        private static Dictionary<string, PlayerProxy> playerProxys = new();

        static void Main(string[] args)
		{
            var _hub = new Hub.Hub(args[0], args[1], "rank");

            _hub.on_hubproxy += on_hubproxy;
            _hub.on_hubproxy_reconn += on_hubproxy;

            _hub.onCloseServer += () => {
                _hub.closeSvr();
            };

            _hub.onDBProxyInit += async () =>
            {
                await Rank.RankModule.Init(Constant.Constant.player_db_name, Constant.Constant.player_db_guid_rank, new List<string>() { Constant.Constant.player_rank_name_combat_power });
            };

            Hub.Hub._timer.addloopweekdaytime(System.DayOfWeek.Monday, 0, 0, 0, reset_peak_strength_rank);
            Hub.Hub._timer.addloopweekdaytime(System.DayOfWeek.Friday, 17, 0, 0, peak_strength_rank_reward);

            Log.Log.trace("rank svr start ok");

            _hub.run();

            Rank.RankModule.save_rank();
        }

        private static void reset_peak_strength_rank(System.DateTime _)
        {
            Rank.RankModule.reset_rank(Constant.Constant.player_rank_name_combat_power);
        }

        private static PlayerProxy RandomPlayerProxy()
        {
            if (playerProxys.Count > 0)
            {
                return playerProxys.Values.ToArray()[RandomHelper.RandomInt(playerProxys.Count)];
            }
            return null;
        }

        private static void peak_strength_rank_reward(System.DateTime _)
        {
            var rank = Rank.RankModule.get_rank(Constant.Constant.player_rank_name_combat_power);

            var list = rank.GetRankRange(1, 10);
            var rewards = list.Select(p => new RankPlayer()
            {
                guid = p.guid,
                rank = p.rank,
            }).ToList();

            RandomPlayerProxy().rank_reward(rewards);
        }

        private static void on_hubproxy(Hub.HubProxy _proxy)
        {
            Log.Log.trace("on_hubproxy type:{0}, name:{1}!", _proxy.type, _proxy.name);

            if (_proxy.type == "player")
            {
                playerProxys[_proxy.name] = new PlayerProxy(_proxy, caller);
            }
        }
    }
}
