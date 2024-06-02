using Abelkhan;

namespace Login
{
    class Login
    {
        public static string DyAppID;
        public static string DyAppSecret;
        public static string WxAppID;
        public static string WxAppSecret;
        public static RedisHandle _redis_handle;
        public static player_proxy_mng _player_proxy_mng = new ();

        static void Main(string[] args)
		{
            var _hub = new Hub.Hub(args[0], args[1], "login");

            if (!Hub.Hub._root_config.has_key("redis_for_mq_pwd"))
            {
                _redis_handle = new RedisHandle(Hub.Hub._root_config.get_value_string("redis_for_cache"), string.Empty);
            }
            else
            {
                _redis_handle = new RedisHandle(Hub.Hub._root_config.get_value_string("redis_for_cache"), Hub.Hub._root_config.get_value_string("redis_for_mq_pwd"));
            }

            HttpClientWrapper.Init();

            DyAppID = Hub.Hub._config.get_value_string("DyAppID");
            DyAppSecret = Hub.Hub._config.get_value_string("DyAppSecret");
            WxAppID = Hub.Hub._config.get_value_string("WxAppID");
            WxAppSecret = Hub.Hub._config.get_value_string("WxAppSecret");

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
