using Abelkhan;
using Log;
using OfflineMsg;
using Service;
using System;
using System.Threading;

namespace Player
{
    class Player
    {
        public static RedisHandle _redis_handle;

        public static readonly client_mng client_Mng = new ();
        public static readonly player_proxy_mng player_Proxy_Mng = new ();
        public static readonly match_proxy_mng match_Proxy_Mng = new ();

        public static OfflineMsgMgr offline_Msg_Mng = new (Constant.Constant.player_db_name, Constant.Constant.player_db_offline_msg_collection);

		static void Main(string[] args)
		{
            var _hub = new Hub.Hub(args[0], args[1], "player");
            _redis_handle = new RedisHandle(Hub.Hub._root_config.get_value_string("redis_for_cache"));
            config.Config.Load(Hub.Hub._config.get_value_string("excel_json_config"));

            _hub.set_support_take_over_svr(true);

            var _client_msg_handle = new client_msg_handle();
            var _login_msg_handle = new login_msg_handle();
            var _player_msg_handle = new player_msg_handle();
            var _match_msg_handle = new match_msg_handle();

            _hub.on_hubproxy += on_hubproxy;
            _hub.on_hubproxy_reconn += on_hubproxy;

            _hub.on_client_msg += async (uuid) =>
            {
                try
                {
                    var _client = await client_Mng.uuid_get_client_proxy(uuid);
                    _client.LastActiveTime = Timerservice.Tick;
                }
                catch (System.Exception ex)
                {
                    Log.Log.err($"{ex}");
                }
            };

            _hub.onCloseServer += () => {
                _hub.closeSvr();
            };

            tick_set_player_svr_info(Timerservice.Tick);

            Log.Log.trace("player start ok");

            _hub.run();
        }

        private static void tick_set_player_svr_info(long tick_time)
        {
            Player._redis_handle.SetData(RedisHelp.BuildPlayerSvrInfoCacheKey(Hub.Hub.name), new svr_info { tick_time = (int)Hub.Hub.tick, player_num = client_Mng.Count });

            Hub.Hub._timer.addticktime(300000, tick_set_player_svr_info);
        }

        private static void on_hubproxy(Hub.HubProxy _proxy)
        {
            if (_proxy.type == "player")
            {
                player_Proxy_Mng.reg_player_proxy(_proxy);
            }
            else if (_proxy.type == "match")
            {
                match_Proxy_Mng.reg_match_proxy(_proxy);
            }
        }
    }
}
