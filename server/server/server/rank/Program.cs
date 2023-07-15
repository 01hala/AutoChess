using Abelkhan;

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
                Rank.RankModule.Init(Constant.Constant.player_db_name, Constant.Constant.player_db_guid_rank);
            };

            Log.Log.trace("rank svr start ok");

            _hub.run();
        }

        private static void on_hubproxy(Hub.HubProxy _proxy)
        {
            Log.Log.trace("on_hubproxy type:{0}, name:{1}!", _proxy.type, _proxy.name);
        }
    }
}
