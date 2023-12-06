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

        private List<shop_skill_role> shop_skill_roles;

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

        private List<shop_event> evs = new List<shop_event>();

        private List<int> skip_level = new List<int>();

        public battle_player(string _clientUUID, battle_client_caller _caller, List<int> roleList) 
        {
            clientUUID = _clientUUID;
            caller = _caller;

            battleData = new UserBattleData();
            battleData.User = new UserInformation();
            battleData.RoleList = new List<Role>() { null, null, null, null, null, null };
            battleData.coin = 10;
            battleData.round = 1;
            battleData.victory = 0;
            battleData.faild = 5;

            shop_skill_roles = new List<shop_skill_role> { null, null, null, null, null, null };

            rolePool = roleList;

            shopData = new ShopData();
            shopData.SaleRoleList = new List<ShopRole>();
            shopData.SalePropList = new List<ShopProp>();
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
                    r.SkillID = roleConfig.SkillID;
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
            Log.Log.trace("randomShopProp stage:{0}", stage);
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

        public void do_skill()
        {
            do
            {
                var tmp_evs = new List<shop_event>(evs);
                evs.Clear();

                foreach (var _skill_role in shop_skill_roles)
                {
                    if (_skill_role != null && _skill_role.Trigger(tmp_evs))
                    {
                        _skill_role.UseSkill(this);
                    }
                }

            } while (evs.Count > 0);
        }

        private void clear_skill_tag()
        {
            foreach (var _skill_role in shop_skill_roles)
            {
                if (_skill_role != null)
                {
                    _skill_role.is_trigger = false;
                }
            }
        }

        private void _refresh()
        {
            Log.Log.trace("_refresh begin!");

            var rmRoleList = new List<ShopRole>();
            foreach (var r in shopData.SaleRoleList)
            {
                if (r == null || !r.IsFreeze)
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
                if (p == null || !p.IsFreeze)
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
                var stage = config.ShopProbabilityConfig.RandomStage((battleData.round + 1) / 2, config.Config.ShopProbabilityConfigs);
                var r = randomShopRole(stage);
                if (r != null)
                {
                    shopData.SaleRoleList.Add(r);
                }
            }

            while (shopData.SalePropList.Count < 3)
            {
                var stage = config.ShopProbabilityConfig.RandomStage((battleData.round + 1) / 2, config.Config.ShopProbabilityConfigs);
                var p = randomShopProp(stage);
                if (p != null)
                {
                    shopData.SalePropList.Add(p);
                }
                else
                {
                    Log.Log.trace("_refresh shopData.SalePropList null");
                }
            }

            Log.Log.trace("_refresh end!");
        }

        public void start_round()
        {
            battleData.coin = 10;

            _refresh();

            evs.Add(new shop_event()
            {
                ev = EMRoleShopEvent.start_round
            });

            clear_skill_tag();
        }

        public void end_round()
        {
            evs.Add(new shop_event()
            {
                ev = EMRoleShopEvent.end_round
            });

            clear_skill_tag();
        }

        public void refresh()
        {
            _refresh();

            evs.Add(new shop_event()
            {
                ev = EMRoleShopEvent.refresh
            });

            clear_skill_tag();
        }

        public bool sale_role(int index)
        {
            var r = battleData.RoleList[index];
            if (r != null)
            {
                battleData.RoleList[index] = null;
                shop_skill_roles[index] = null;

                RoleConfig rcfg;
                if (config.Config.RoleConfigs.TryGetValue(r.RoleID, out rcfg))
                {
                    battleData.coin += rcfg.Price + r.Level - 1;
                }

                evs.Add(new shop_event()
                {
                    ev = EMRoleShopEvent.sales
                });

                clear_skill_tag();

                return true;
            }

            return false;
        }

        public em_error buy_role(int index, int role_index)
        {
            var r = battleData.RoleList[role_index];
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
                r.SkillID = s.SkillID;
                r.Number = 1;
                r.HP = s.HP;
                r.Attack = s.Attack;
                r.TempHP = 0;
                r.TempAttack = 0;
                r.additionBuffer = 0;
                r.TempAdditionBuffer = 0;

                battleData.RoleList[role_index] = r;
                shop_skill_roles[role_index] = new shop_skill_role(index, s.RoleID, r.SkillID);
            }
            else
            {
                if (r.RoleID != s.RoleID)
                {
                    return em_error.not_same_role_to_update;
                }

                r.Number += 1;
                var oldLevel = r.Level;
                r.Level = r.Number / 3 + 1;
                r.HP += 1;
                r.Attack += 1;

                if (r.Level > oldLevel)
                {
                    evs.Add(new shop_event()
                    {
                        ev = EMRoleShopEvent.update,
                        index = role_index
                    });

                    if (!skip_level.Contains(r.Level))
                    {
                        var stage = r.Level + 1;
                        if (stage > 6)
                        {
                            stage = 6;
                        }
                        shopData.SaleRoleList.Add(randomShopRole(stage));
                    }

                    BattleClientCaller.get_client(ClientUUID).role_buy_merge(role_index, r, true);
                }
                else
                {
                    BattleClientCaller.get_client(ClientUUID).role_buy_merge(role_index, r, false);
                }
            }

            shopData.SaleRoleList[index] = null;

            return em_error.success;
        }

        public em_error buy_food(ShopProp p, int index, int role_index)
        {
            var r = battleData.RoleList[role_index];
            if (r == null)
            {
                return em_error.db_error;
            }


            if (config.Config.FoodConfigs.TryGetValue(p.PropID, out var foodcfg))
            {
                var rs = new List<Role>();
                if (foodcfg.Count > 1)
                {
                    var exclude = new List<int>();
                    for (int i = 0; i < foodcfg.Count && rs.Count < battleData.RoleList.Count;)
                    {
                        var tmp_index = RandomHelper.RandomInt(battleData.RoleList.Count);
                        if (exclude.Contains(tmp_index))
                        {
                            continue;
                        }
                        rs.Add(battleData.RoleList[tmp_index]);
                        exclude.Add(tmp_index);
                        i++;
                    }
                }
                else
                {
                    rs.Add(r);
                }

                bool is_update = false;
                bool is_syncope = false;
                foreach (var _r in rs)
                {
                    foreach (var e in foodcfg.Effect)
                    {
                        switch ((BufferAndEquipEffect)e)
                        {
                            case BufferAndEquipEffect.AddHP:
                                {
                                    if ((EffectScope)foodcfg.EffectScope == EffectScope.SingleBattle)
                                    {
                                        _r.TempHP += foodcfg.HpBonus;
                                    }
                                    else if ((EffectScope)foodcfg.EffectScope == EffectScope.WholeGame)
                                    {
                                        _r.HP += foodcfg.HpBonus;
                                    }
                                }
                                break;

                            case BufferAndEquipEffect.AddAttack:
                                {
                                    if ((EffectScope)foodcfg.EffectScope == EffectScope.SingleBattle)
                                    {
                                        _r.TempAttack += foodcfg.AttackBonus;
                                    }
                                    else if ((EffectScope)foodcfg.EffectScope == EffectScope.WholeGame)
                                    {
                                        _r.Attack += foodcfg.AttackBonus;
                                    }
                                }
                                break;

                            case BufferAndEquipEffect.AddBuffer:
                                {
                                    if ((EffectScope)foodcfg.EffectScope == EffectScope.SingleBattle)
                                    {
                                        _r.TempAdditionBuffer = foodcfg.Vaule;
                                    }
                                    else if ((EffectScope)foodcfg.EffectScope == EffectScope.WholeGame)
                                    {
                                        _r.additionBuffer = foodcfg.Vaule;
                                    }
                                }
                                break;

                            case BufferAndEquipEffect.Syncope:
                                {
                                    battleData.RoleList[role_index] = null;
                                    shop_skill_roles[role_index] = null;

                                    evs.Add(new shop_event()
                                    {
                                        ev = EMRoleShopEvent.syncope,
                                        index = role_index
                                    });
                                }
                                break;
                        }
                    }

                    BattleClientCaller.get_client(ClientUUID).role_eat_food(p.PropID, role_index, _r, is_update, is_syncope);
                }

                evs.Add(new shop_event()
                {
                    ev = EMRoleShopEvent.food,
                    index = role_index
                });
            }
            else
            {
                return em_error.db_error;
            }

            return em_error.success;
        }

        public em_error buy(ShopIndex shop_index, int index, int role_index)
        {
            if (battleData.coin < 3)
            {
                return em_error.no_enough_coin;
            }
            battleData.coin -= 3;

            if (shop_index == ShopIndex.Role)
            {
                var result = buy_role(index, role_index);
                if (result != em_error.success)
                {
                    return result;
                }
            }
            else if (shop_index == ShopIndex.Prop)
            {
                var p = shopData.SalePropList[index];
                if (p == null)
                {
                    return em_error.db_error;
                }

                if (p.PropID >= config.Config.FoodIDMin && p.PropID <= config.Config.FoodIDMax)
                {
                    var result = buy_food(p, index, role_index);
                    if (result != em_error.success)
                    {
                        return result;
                    }
                }

                shopData.SalePropList[index] = null;
            }
            else
            {
                return em_error.db_error;
            }

            evs.Add(new shop_event()
            {
                ev = EMRoleShopEvent.buy
            });

            clear_skill_tag();

            return em_error.success;
        }

        public void freeze(ShopIndex shop_index, int index)
        {
            if (shop_index == ShopIndex.Role)
            {
                var s = shopData.SaleRoleList[index];
                if (s != null)
                {
                    s.IsFreeze= true;
                }
            }
            else if (shop_index == ShopIndex.Prop)
            {
                var s = shopData.SalePropList[index];
                if (s != null)
                {
                    s.IsFreeze = true;
                }
            }
        }

        public void move(int role_index1, int role_index2)
        {
            if (role_index1 == role_index2)
            {
                return;
            }

            var r1 = battleData.RoleList[role_index1];
            var r2 = battleData.RoleList[role_index2];

            if ((r1 == null && r2 != null) ||
                (r1 != null && r2 == null))
            {
                battleData.RoleList[role_index1] = r2;
                battleData.RoleList[role_index2] = r1;
            }
            else if (r1 != null && r2 != null)
            {
                if (r1.RoleID != r2.RoleID)
                {
                    battleData.RoleList[role_index1] = r2;
                    battleData.RoleList[role_index2] = r1;
                }
                else
                {
                    battleData.RoleList[role_index1] = null;

                    r2.Number += r1.Number;
                    var oldLevel = r2.Level;
                    r2.Level = r2.Number / 3 + 1;
                    r2.HP += r1.Number;
                    r2.Attack += r1.Number;

                    if (r2.Level > oldLevel)
                    {
                        evs.Add(new shop_event()
                        {
                            ev = EMRoleShopEvent.update,
                            index = role_index2
                        });

                        if (!skip_level.Contains(r2.Level))
                        {
                            var stage = r2.Level + 1;
                            if (stage > 6)
                            {
                                stage = 6;
                            }
                            shopData.SaleRoleList.Add(randomShopRole(stage));
                        }

                        BattleClientCaller.get_client(ClientUUID).role_merge(role_index1, role_index2, r2, true);
                    }
                    else
                    {
                        BattleClientCaller.get_client(ClientUUID).role_merge(role_index1, role_index2, r2, false);
                    }
                }
            }
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
