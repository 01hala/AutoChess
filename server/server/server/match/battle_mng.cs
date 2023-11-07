using Abelkhan;
using config;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Match
{
    public class battle_player
    {
        private battle_client_caller caller;
        public battle_client_caller BattleClientCaller
        {
            get
            {
                return caller;
            }
        }

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

        public battle_player(string _clientUUID, battle_client_caller _caller, List<int> roleList) 
        {
            clientUUID = _clientUUID;
            caller = _caller;

            battleData = new UserBattleData();
            battleData.User = new UserInformation();
            battleData.RoleList = new List<Role>() { null, null, null, null, null, null };

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

        public bool sale_role(int index)
        {
            var r = battleData.RoleList[index];
            if (r == null)
            {
                battleData.RoleList[index] = null;

                var rcfg = config.Config.RoleConfigs[r.RoleID];
                if (rcfg == null)
                {
                    battleData.coin += rcfg.Price + r.Level - 1;
                }

                return true;
            }

            return false;
        }

        public em_error buy(ShopIndex shop_index, int index, int role_index)
        {
            var r = battleData.RoleList[index];

            if (shop_index == ShopIndex.Role)
            {
                var s = shopData.SaleRoleList[index];

                if (s == null)
                {
                    return em_error.db_error;
                }

                if (r == null)
                {
                    r = new Role();

                    r.RoleID = s.RoleID;
                    r.Level = 1;
                    r.Number = 1;
                    r.HP = s.HP;
                    r.Attack = s.Attack;
                    r.TempHP = 0;
                    r.TempAttack = 0;
                    r.additionBuffer = 0;
                    r.TempAdditionBuffer = 0;

                    battleData.RoleList[index] = r;
                }
                else
                {
                    if (r.RoleID != s.RoleID)
                    {
                        return em_error.not_same_role_to_update;
                    }

                    r.Number += 1;
                    r.Level = r.Number / 3 + 1;
                    r.HP += 1;
                    r.Attack += 1;
                }

                shopData.SaleRoleList.RemoveAt(index);
            }
            else if (shop_index == ShopIndex.Prop)
            {
                if (r == null)
                {
                    return em_error.db_error;
                }

                var p = shopData.SalePropList[index];
                if (p == null)
                {
                    return em_error.db_error;
                }

                if (p.PropID >= config.Config.FoodIDMin && p.PropID <= config.Config.FoodIDMax)
                {
                    if (config.Config.FoodConfigs.TryGetValue(p.PropID, out var foodcfg))
                    {
                        switch((BufferAndEquipEffect)foodcfg.Effect)
                        {
                            case BufferAndEquipEffect.AddHP:
                            {
                                if ((EffectScope)foodcfg.EffectScope == EffectScope.SingleBattle)
                                {
                                    r.TempHP += foodcfg.HpBonus;
                                }
                                else if ((EffectScope)foodcfg.EffectScope == EffectScope.WholeGame)
                                {
                                    r.HP-= foodcfg.HpBonus;
                                }
                            }
                            break;

                            case BufferAndEquipEffect.AddAttack:
                            {
                                if ((EffectScope)foodcfg.EffectScope == EffectScope.SingleBattle)
                                {
                                    r.TempAttack += foodcfg.AttackBonus;
                                }
                                else if ((EffectScope)foodcfg.EffectScope == EffectScope.WholeGame)
                                {
                                    r.Attack -= foodcfg.AttackBonus;
                                }
                            }
                            break;

                            case BufferAndEquipEffect.AddBuffer:
                            {
                                if ((EffectScope)foodcfg.EffectScope == EffectScope.SingleBattle)
                                {
                                    r.TempAdditionBuffer += foodcfg.Vaule;
                                }
                                else if ((EffectScope)foodcfg.EffectScope == EffectScope.WholeGame)
                                {
                                    r.additionBuffer -= foodcfg.Vaule;
                                }
                            }
                            break;
                        }
                    }
                    else
                    {
                        return em_error.db_error;
                    }
                }

                shopData.SalePropList.RemoveAt(index);
            }
            else
            {
                return em_error.db_error;
            }

            return em_error.success;
        }
    }

    public class battle_mng
    {
        private Dictionary<string, battle_player> battles = new();

        private battle_client_caller _caller;

        public battle_mng()
        {
            _caller = new battle_client_caller();
        }

        public battle_player add_player_to_battle(string clientUUID, List<int> roleList)
        {
            var _player = new battle_player(clientUUID, _caller, roleList);
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
