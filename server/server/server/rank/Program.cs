using Abelkhan;
using System.Collections.Generic;

namespace RankSvr
{
    class RankSvr
    {
        static void Main(string[] args)
		{
            var _hub = new Hub.Hub(args[0], args[1], "rank");

            _hub.on_hubproxy += on_hubproxy;
            _hub.on_hubproxy_reconn += on_hubproxy;

            _hub.onCloseServer += () => {
                _hub.closeSvr();
            };

            _hub.onDBProxyInit += () =>
            {
                Rank.RankModule.Init(Constant.Constant.player_db_name, Constant.Constant.player_db_guid_rank, new List<string>() { Constant.Constant.player_rank_name_combat_power });
            };

            Hub.Hub._timer.addloopweekdaytime(System.DayOfWeek.Monday, 0, 0, 0, reset_peak_strength_rank);

            Log.Log.trace("rank svr start ok");

            _hub.run().Wait();
        }

        private static void reset_peak_strength_rank(System.DateTime _)
        {
            Rank.RankModule.reset_rank(Constant.Constant.player_rank_name_combat_power);
        }

        private static void on_hubproxy(Hub.HubProxy _proxy)
        {
            Log.Log.trace("on_hubproxy type:{0}, name:{1}!", _proxy.type, _proxy.name);
        }
    }
}
