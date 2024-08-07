﻿using Abelkhan;

namespace Match
{
    class Match
    {
        public static RedisHandle _redis_handle;
        public static player_proxy_mng _player_proxy_mng = new ();
        public static rank_proxy _rank_proxy;
        public static battle_mng battle_Mng = new ();
        public static peak_strength_mng peak_strength_mng = new ();

        static void Main(string[] args)
		{
            var _hub = new Hub.Hub(args[0], args[1], "match", "fixed");

            if (!Hub.Hub._root_config.has_key("redis_for_mq_pwd"))
            {
                _redis_handle = new RedisHandle(Hub.Hub._root_config.get_value_string("redis_for_cache"), string.Empty);
            }
            else
            {
                _redis_handle = new RedisHandle(Hub.Hub._root_config.get_value_string("redis_for_cache"), Hub.Hub._root_config.get_value_string("redis_for_mq_pwd"));
            }

            config.Config.Load(Hub.Hub._config.get_value_string("excel_json_config"));

            var _player_msg_handle = new player_msg_handle();
            var _client_msg_handle = new client_msg_handle();

            _hub.on_hubproxy += on_hubproxy;
            _hub.on_hubproxy_reconn += on_hubproxy;

            _hub.onCloseServer += () => {
                _hub.closeSvr();
            };

            Log.Log.trace("login start ok");

            _hub.run().Wait();
        }

        private static void on_hubproxy(Hub.HubProxy _proxy)
        {
            if (_proxy.type == "player")
            {
                _player_proxy_mng.reg_player_proxy(_proxy);
            }
            else if (_proxy.type == "rank")
            {
                _rank_proxy = new rank_proxy(_proxy);
            }
        }
    }
}
