using Abelkhan;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Match
{
    public class player_proxy
    {
        private readonly match_player_caller _match_player_caller;
        private readonly Hub.HubProxy _proxy;

        public string name
        {
            get
            {
                return _proxy.name;
            }
        }

        public player_proxy(match_player_caller caller, Hub.HubProxy proxy)
        {
            _match_player_caller = caller;
            _proxy = proxy;
        }

        public void battle_victory(BattleMod mod, bool is_victory, UserBattleData user)
        {
            _match_player_caller.get_hub(_proxy.name).battle_victory(mod, is_victory, user);
        }

        public match_player_peak_strength_victory_cb peak_strength_victory(BattleVictory is_victory, UserBattleData user)
        {
            return _match_player_caller.get_hub(_proxy.name).peak_strength_victory(is_victory, user);
        }

        public void buy_role(long guid, Role roleInfo)
        {
            _match_player_caller.get_hub(_proxy.name).buy_role(guid, roleInfo);
        }

        public void buy_equip(long guid, int equipId) 
        {
            _match_player_caller.get_hub(_proxy.name).buy_equip(guid, equipId);
        }
    }

    public class player_proxy_mng
    {
        private readonly match_player_caller _match_player_caller = new ();
        private readonly Dictionary<string, player_proxy> player_proxys = new ();

        public player_proxy_mng()
        {
        }

        public void reg_player_proxy(Hub.HubProxy _proxy)
        {
            player_proxys[_proxy.name] = new player_proxy(_match_player_caller, _proxy);
        }

        public player_proxy get_player(string player_hub_name)
        {
            player_proxys.TryGetValue(player_hub_name, out player_proxy proxy);
            return proxy;
        }
    }
}
