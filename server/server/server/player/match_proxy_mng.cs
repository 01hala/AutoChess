using Abelkhan;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Player
{
    class match_proxy
    {
        private readonly player_match_caller player_Match_Caller;
        private readonly Hub.HubProxy _proxy;

        public string name
        {
            get { return _proxy.name; }
        }

        public match_proxy(player_match_caller caller, Hub.HubProxy proxy)
        {
            player_Match_Caller = caller;
            _proxy = proxy;
        }

        public player_match_start_battle_cb start_battle(List<int> role_list)
        {
            return player_Match_Caller.get_hub(name).start_battle(role_list);
        }
    }

    class match_proxy_mng
    {
        private readonly player_match_caller _player_Match_Caller = new();

        private readonly Dictionary<string, match_proxy> match_proxys = new();

        public void reg_match_proxy(Hub.HubProxy _proxy)
        {
            if (_proxy.name != Hub.Hub.name)
            {
                match_proxys[_proxy.name] = new match_proxy(_player_Match_Caller, _proxy);
            }
        }

        public match_proxy get_match_proxy()
        {
            var proxy = match_proxys.ToList()[RandomHelper.RandomInt(match_proxys.Count)];
            return proxy.Value;
        }
    }
}
