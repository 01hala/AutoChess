using Abelkhan;

namespace Login
{
    class Login
    {
        public static RedisHandle _redis_handle;
        public static player_proxy_mng _player_proxy_mng = new ();

        static void Main(string[] args)
		{
            var _hub = new Hub.Hub(args[0], args[1], "login");
            _redis_handle = new RedisHandle(Hub.Hub._root_config.get_value_string("redis_for_cache"));

            var _client_msg_handle = new client_msg_handle();

            _hub.on_hubproxy += on_hubproxy;
            _hub.on_hubproxy_reconn += on_hubproxy;

            _hub.onCloseServer += () => {
                _hub.closeSvr();
            };

            Log.Log.trace("login start ok");

            _hub.run();
        }

        private static void on_hubproxy(Hub.HubProxy _proxy)
        {
            if (_proxy.type == "player")
            {
                _player_proxy_mng.reg_player_proxy(_proxy);
            }
        }
    }
}
