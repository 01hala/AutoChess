using Abelkhan;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Match
{
    public class battle_player
    {
        public UserBattleData BattleData
        {
            get
            {
                return null;
            }
        }

        public ShopData ShopData
        {
            get
            {
                return null;
            }
        }

        public battle_player(string clientUUID, List<int> roleList) 
        { 
        }
    }

    public class battle_mng
    {
        private Dictionary<string, battle_player> battles = new();

        public battle_mng()
        {
        }

        public battle_player add_player_to_battle(string clientUUID, List<int> roleList)
        {
            var _player = new battle_player(clientUUID, roleList);
            battles.Add(clientUUID, _player);
            return _player;
        }
    }
}
