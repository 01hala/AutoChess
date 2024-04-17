using Abelkhan;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Login
{
    public class player_proxy
    {
        private readonly login_player_caller _login_player_caller;
        private readonly Hub.HubProxy _proxy;

        public string name
        {
            get
            {
                return _proxy.name;
            }
        }

        public player_proxy(login_player_caller caller, Hub.HubProxy proxy)
        {
            _login_player_caller = caller;
            _proxy = proxy;
        }

        public login_player_player_login_cb player_login(string code, string anonymous_code)
        {
            return _login_player_caller.get_hub(_proxy.name).player_login(code, anonymous_code);
        }

        public login_player_player_login_no_token_cb player_login_no_token(string account)
        {
            return _login_player_caller.get_hub(_proxy.name).player_login_no_token(account);
        }
    }

    public class player_proxy_mng
    {
        private readonly login_player_caller _login_player_caller = new ();
        private readonly Dictionary<string, player_proxy> player_proxys = new ();

        public player_proxy_mng()
        {
        }

        public void reg_player_proxy(Hub.HubProxy _proxy)
        {
            player_proxys[_proxy.name] = new player_proxy(_login_player_caller, _proxy);
        }

        public player_proxy get_player(string player_hub_name)
        {
            player_proxys.TryGetValue(player_hub_name, out player_proxy proxy);
            return proxy;
        }

        public async Task<player_proxy> random_idle_player()
        {
            var idle_player_proxys = new List<player_proxy>();
            foreach (var p in player_proxys)
            {
                var info = await Login._redis_handle.GetData<svr_info>(RedisHelp.BuildPlayerSvrInfoCacheKey(p.Key));
                if (info?.tick_time < 100)
                {
                    idle_player_proxys.Add(p.Value);
                }
            }

            if (idle_player_proxys.Count > 0)
            {
                uint count = (uint)idle_player_proxys.Count;
                return idle_player_proxys[(int)Hub.Hub.randmon_uint(count)];
            }

            return null; 
        }
    }
}
