using Abelkhan;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Match
{
    public class battle_player
    {
        private UserBattleData battleData;
        public UserBattleData BattleData
        {
            get
            {
                return battleData;
            }
        }

        private ShopData shopData;
        public ShopData ShopData
        {
            get
            {
                return shopData;
            }
        }

        public battle_player(string clientUUID, List<int> roleList) 
        {
            battleData = new UserBattleData();
            battleData.User = new UserInformation();
            battleData.RoleList = new List<Role>();
            shopData = new ShopData();
            shopData.SalePropList = roleList;
            shopData.SaleRoleList = roleList;
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
            battles[clientUUID] = _player;
            return _player;
        }
    }
}
