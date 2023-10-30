using Abelkhan;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Player
{
    class player_proxy
    {
        private readonly player_player_offline_msg_caller player_Player_Offline_Msg_Caller;
        private readonly Hub.HubProxy _proxy;

        public string name
        {
            get { return _proxy.name; }
        }

        public player_proxy(player_player_offline_msg_caller offline_caller, Hub.HubProxy proxy)
        {
            player_Player_Offline_Msg_Caller = offline_caller;
            _proxy = proxy;
        }

        public void player_have_offline_msg(long guid)
        {
            player_Player_Offline_Msg_Caller.get_hub(name).player_have_offline_msg(guid);
        }
    }

    class player_proxy_mng
    {
        private readonly player_player_offline_msg_caller _player_offline_msg_caller = new();

        private readonly Dictionary<string, player_proxy> player_proxys = new();

        public void reg_player_proxy(Hub.HubProxy _proxy)
        {
            if (_proxy.name != Hub.Hub.name)
            {
                player_proxys[_proxy.name] = new player_proxy(_player_offline_msg_caller, _proxy);
            }
        }

        public player_proxy get_player_proxy(string player_hub_name)
        {
            player_proxys.TryGetValue(player_hub_name, out player_proxy proxy);
            return proxy;
        }
    }
}
