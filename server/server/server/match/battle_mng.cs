using Abelkhan;
using System;
using System.Collections.Generic;
using System.Linq;
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

        private string clientUUID;
        public string ClientUUID
        {
            get
            {
                return clientUUID;
            }
        }

        private List<int> rolePool;

        private int round = 1;

        public battle_player(string _clientUUID, List<int> roleList) 
        {
            clientUUID = _clientUUID;

            battleData = new UserBattleData();
            battleData.User = new UserInformation();
            battleData.RoleList = new List<Role>();

            rolePool = roleList;

            shopData = new ShopData();
            refresh();
        }

        public ShopRole randomShopRole(int stage)
        {
            if (config.Config.RoleStageConfigs.TryGetValue(stage, out var basePool))
            {
                var roleConfig = basePool[RandomHelper.RandomInt(basePool.Count)];
                if (roleConfig != null && rolePool.Contains(roleConfig.Id))
                {
                    var r = new ShopRole();
                    r.RoleID = roleConfig.Id;
                    r.HP = roleConfig.Hp;
                    r.Attack = roleConfig.Attack;
                    r.IsFreeze = false;

                    return r;
                }
            }
            return null;
        }

        public ShopProp randomShopProp(int stage)
        {
            if (config.Config.FoodStageConfigs.TryGetValue(stage, out var basePool))
            {
                var foodConfig = basePool[RandomHelper.RandomInt(basePool.Count)];
                if (foodConfig != null)
                {
                    var p = new ShopProp();
                    p.PropID = foodConfig.Id;
                    p.IsFreeze= false;

                    return p;
                }
            }
            return null;
        }

        public void refresh()
        {
            var rmRoleList = new List<ShopRole>();
            foreach(var r in shopData.SaleRoleList)
            {
                if (!r.IsFreeze)
                {
                    rmRoleList.Add(r);
                }
            }
            foreach (var r in rmRoleList)
            {
                shopData.SaleRoleList.Remove(r);
            }

            var rmPropList = new List<ShopProp>();
            foreach (var p in shopData.SalePropList)
            {
                if (!p.IsFreeze)
                {
                    rmPropList.Add(p);
                }
            }
            foreach (var p in rmPropList)
            {
                shopData.SalePropList.Remove(p);
            }

            while (shopData.SaleRoleList.Count < 3)
            {
                var stage = config.ShopProbabilityConfig.RandomStage((round + 1) / 2, config.Config.ShopProbabilityConfigs);
                shopData.SaleRoleList.Add(randomShopRole(stage));
            }

            while (shopData.SalePropList.Count < 3)
            {
                var stage = config.ShopProbabilityConfig.RandomStage((round + 1) / 2, config.Config.ShopProbabilityConfigs);
                shopData.SalePropList.Add(randomShopProp(stage));
            }
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

        public battle_player get_battle_player(string clientUUID)
        {
            battles.TryGetValue(clientUUID, out var _player);
            return _player;
        }
    }
}
