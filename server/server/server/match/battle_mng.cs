using Abelkhan;
using Amazon.Util.Internal;
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
                var realPool = new List<RoleConfig>();
                foreach (var cfg in basePool)
                {
                    if (cfg != null && rolePool.Contains(cfg.Id))
                    {
                        realPool.Add(cfg);
                    }
                }
                if (realPool.Count <= 0)
                {
                    return null;
                }

                var roleConfig = realPool[RandomHelper.RandomInt(realPool.Count)];
                if (roleConfig != null)
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
            var r = RandomHelper.RandomInt(2);
            if (r < 1)
            {
                if (config.Config.FoodStageConfigs.TryGetValue(stage, out var basePool))
                {
                    var foodConfig = basePool[RandomHelper.RandomInt(basePool.Count)];
                    if (foodConfig != null)
                    {
                        var p = new ShopProp();
                        p.PropID = foodConfig.Id;
                        p.IsFreeze = false;

                        return p;
                    }
                }
            }
            else
            {
                if (config.Config.EquipStageConfigs.TryGetValue(stage, out var basePool))
                {
                    var equipConfig = basePool[RandomHelper.RandomInt(basePool.Count)];
                    if (equipConfig != null)
                    {
                        var p = new ShopProp();
                        p.PropID = equipConfig.Id;
                        p.IsFreeze = false;

                        return p;
                    }
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

                var _trigger_skill = new Dictionary<Priority, List<Action>>();
                foreach (var _skill_role in shop_skill_roles)
                {
                    if (_skill_role != null)
                    {
                        var execute = _skill_role.Trigger(tmp_evs, this);
                        if (execute != null)
                        {
                            foreach(var e in execute)
                            {
                                if (!_trigger_skill.TryGetValue(e.Priority, out var action_list))
                                {
                                    action_list = new List<Action>();
                                    _trigger_skill[e.Priority] = action_list;
                                }
                                action_list.Add(e.execute);
                            }
                        }
                    }
                }

                if (_trigger_skill.TryGetValue(Priority.Hight, out var hight_execute_list))
                {
                    foreach (var e in hight_execute_list)
                    {
                        e.Invoke();
                    }
                }
                if (_trigger_skill.TryGetValue(Priority.Normal, out var normal_execute_list))
                {
                    foreach (var e in normal_execute_list)
                    {
                        e.Invoke();
                    }
                }
                if (_trigger_skill.TryGetValue(Priority.Low, out var low_execute_list))
                {
                    foreach (var e in low_execute_list)
                    {
                        e.Invoke();
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

        private void _reset()
        {
            foreach (var r in battleData.RoleList)
            {
                if (r != null)
                {
                    r.TempHP = 0;
                    r.TempAttack = 0;
                    r.TempAdditionBuffer.Clear();
                }
            }
        }

        private void _refresh()
        {
            Log.Log.trace("_refresh begin!");

            for (var i = 0; i < 3/*shopData.SaleRoleList.Count*/; i++)
            {
                if (i < shopData.SaleRoleList.Count)
                {
                    var r = shopData.SaleRoleList[i];
                    if (r == null || !r.IsFreeze)
                    {
                        var stage = config.ShopProbabilityConfig.RandomStage((battleData.round + 1) / 2, config.Config.ShopProbabilityConfigs);
                        r = randomShopRole(stage);
                        shopData.SaleRoleList[i] = r;
                    }
                }
                else
                {
                    var stage = config.ShopProbabilityConfig.RandomStage((battleData.round + 1) / 2, config.Config.ShopProbabilityConfigs);
                    var r = randomShopRole(stage);
                    shopData.SaleRoleList.Add(r);
                }
            }

            for (var i = 0; i < 3/*shopData.SalePropList.Count*/; i++)
            {
                if (i < shopData.SalePropList.Count)
                {
                    var p = shopData.SalePropList[i];
                    if (p == null || !p.IsFreeze)
                    {
                        var stage = config.ShopProbabilityConfig.RandomStage((battleData.round + 1) / 2, config.Config.ShopProbabilityConfigs);
                        p = randomShopProp(stage);
                        shopData.SalePropList[i] = p;
                    }
                }
                else
                {
                    var stage = config.ShopProbabilityConfig.RandomStage((battleData.round + 1) / 2, config.Config.ShopProbabilityConfigs);
                    var p = randomShopProp(stage);
                    shopData.SalePropList.Add(p);
                }
            }

            Log.Log.trace("_refresh end!");
        }

        public void start_round()
        {
            battleData.coin = 10;

            _reset();
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
        }

        public void add_shop_item(int refresh_item_id, int refresh_item_num)
        {
            for (var i = 0; i < shopData.SalePropList.Count; i++)
            {
                var p1 = shopData.SalePropList[i];
                if (p1 == null && refresh_item_num > 0)
                {
                    var p = new ShopProp();
                    p.PropID = refresh_item_id;
                    p.IsFreeze = false;

                    shopData.SalePropList[i] = p;
                    --refresh_item_num;
                }
            }

            for (var i = 0; i < shopData.SalePropList.Count; i++)
            {
                var p1 = shopData.SalePropList[i];
                if (!p1.IsFreeze && p1.PropID != refresh_item_id && refresh_item_num > 0)
                {
                    var p = new ShopProp();
                    p.PropID = refresh_item_id;
                    p.IsFreeze = false;

                    shopData.SalePropList[i] = p;
                    --refresh_item_num;
                }
            }
        }

        private int check_fetters_level(Fetters fetters)
        {
            if (config.Config.FettersConfigs.TryGetValue(fetters.fetters_id, out var fettersConfig))
            {
                for(int i = fettersConfig.RoleNum.Count - 1; i >= 0; i--)
                {
                    if (fetters.number >= fettersConfig.RoleNum[i])
                    {
                        return i + 1;
                    }
                }
            }

            return 0;
        }

        public List<Fetters> check_fetters()
        {
            var mapFetters = new Dictionary<int, Fetters>();

            foreach(var r in battleData.RoleList)
            {
                if (r != null)
                {
                    if (mapFetters.TryGetValue(r.FettersSkillID.fetters_id, out var fetters))
                    {
                        fetters.number++;
                    }
                    else
                    {
                        mapFetters.Add(r.FettersSkillID.fetters_id, new Fetters()
                        {
                            fetters_id = r.FettersSkillID.fetters_id,
                            fetters_level = 0,
                            number = 1
                        });
                    }
                }
            }

            var fetters_info = new List<Fetters>();
            foreach(var fetters in mapFetters.Values)
            {
                foreach (var r in battleData.RoleList)
                {
                    if (r != null && r.FettersSkillID.fetters_id == fetters.fetters_id)
                    {
                        r.FettersSkillID.number = fetters.number;
                    }
                }

                if (fetters.number > 1)
                {
                    fetters.fetters_level = check_fetters_level(fetters);
                    if (fetters.fetters_level > 0)
                    {
                        fetters_info.Add(fetters);
                    }

                    for(var i = 0; i < battleData.RoleList.Count; i++)
                    {
                        var r = battleData.RoleList[i];
                        if (r != null && r.FettersSkillID.fetters_id == fetters.fetters_id)
                        {
                            r.FettersSkillID.fetters_level = fetters.fetters_level;

                            var shop_r = shop_skill_roles[i];
                            if (shop_r != null)
                            {
                                shop_r.fettersSkillID = fetters.fetters_id;
                                shop_r.fettersLevel = fetters.fetters_level;
                            }
                        }
                    }
                }
            }

            BattleClientCaller.get_client(ClientUUID).fetters_info(fetters_info);
            battleData.FettersList = fetters_info;

            return fetters_info;
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
                    ev = EMRoleShopEvent.sales,
                    index = index,
                    skill_id = r.SkillID,
                    role_level = r.Level,
                    fetters_id = r.FettersSkillID.fetters_id,
                    fetters_level = r.FettersSkillID.fetters_level
                });

                clear_skill_tag();
                check_fetters();

                return true;
            }

            return false;
        }

        public bool add_role(int role_index, int role_id, int role_Level)
        {
            if (config.Config.RoleConfigs.TryGetValue(role_id, out RoleConfig rcfg))
            {
                var r = new Role();

                r.RoleID = role_id;
                r.Level = role_Level;
                r.SkillID = rcfg.SkillID;
                r.Number = (r.Level - 1) * 3 + 1;
                r.HP = rcfg.Hp + r.Number - 1;
                r.Attack = rcfg.Attack + r.Number - 1;
                r.TempHP = 0;
                r.TempAttack = 0;
                r.additionBuffer = new ();
                r.TempAdditionBuffer = new();
                r.FettersSkillID = new Fetters()
                {
                    fetters_id = rcfg.Fetters,
                    fetters_level = 0,
                    number = 1
                };

                battleData.RoleList[role_index] = r;
                check_fetters();
                shop_skill_roles[role_index] = new shop_skill_role(role_index, r.RoleID, r.SkillID, r.FettersSkillID.fetters_id, r.FettersSkillID.fetters_level);

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
                if (!add_role(role_index, s.RoleID, 1))
                {
                    return em_error.db_error;
                }
            }
            else
            {
                if (r.RoleID != s.RoleID)
                {
                    return em_error.not_same_role_to_update;
                }

                r.Number += 1;
                var oldLevel = r.Level;
                r.Level = 1 + (r.Number - 1) / 3 ;
                r.HP += 1;
                r.Attack += 1;

                if (r.Level > oldLevel)
                {
                    BattleClientCaller.get_client(ClientUUID).role_buy_merge(role_index, r, true);

                    check_update_skip_level(role_index);
                }
                else
                {
                    BattleClientCaller.get_client(ClientUUID).role_buy_merge(role_index, r, false);
                }
            }

            shopData.SaleRoleList[index] = null;

            return em_error.success;
        }

        public void check_update_skip_level(int index)
        {
            var r = battleData.RoleList[index];

            evs.Add(new shop_event()
            {
                ev = EMRoleShopEvent.update,
                index = index,
                skill_id = r.SkillID,
                role_level = r.Level,
                fetters_id = r.FettersSkillID.fetters_id,
                fetters_level = r.FettersSkillID.fetters_level
            });

            if (!skip_level.Contains(r.Level))
            {
                skip_level.Add(r.Level);

                var stage = r.Level;
                if (stage > 6)
                {
                    stage = 6;
                }
                shopData.SaleRoleList.Add(randomShopRole(stage));

                BattleClientCaller.get_client(ClientUUID).role_update_refresh_shop(shopData);
            }
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
                                    _r.TempAdditionBuffer.Add(foodcfg.Vaule);
                                }
                                else if ((EffectScope)foodcfg.EffectScope == EffectScope.WholeGame)
                                {
                                    _r.additionBuffer.Add(foodcfg.Vaule);
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
                                    index = role_index,
                                    skill_id = r.SkillID,
                                    role_level = r.Level,
                                    fetters_id = r.FettersSkillID.fetters_id,
                                    fetters_level = r.FettersSkillID.fetters_level
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
                    index = role_index,
                    skill_id = r.SkillID,
                    role_level = r.Level,
                    fetters_id = r.FettersSkillID.fetters_id,
                    fetters_level = r.FettersSkillID.fetters_level
                });
            }
            else
            {
                return em_error.db_error;
            }

            return em_error.success;
        }

        public em_error buy_equip(ShopProp p, int index, int role_index)
        {
            var r = battleData.RoleList[role_index];
            if (r == null)
            {
                return em_error.db_error;
            }


            if (config.Config.EquipConfigs.TryGetValue(p.PropID, out var equipcfg))
            {
                r.equipID = equipcfg.Id;
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
                else if (p.PropID >= config.Config.EquipIDMin && p.PropID <= config.Config.EquipIDMax)
                {
                    var result = buy_equip(p, index, role_index);
                    if (result != em_error.success)
                    {
                        return result;
                    }
                }
                else
                {
                    return em_error.db_error;
                }

                shopData.SalePropList[index] = null;
            }
            else
            {
                return em_error.db_error;
            }

            evs.Add(new shop_event()
            {
                ev = EMRoleShopEvent.buy,
            });

            clear_skill_tag();

            return em_error.success;
        }

        public void freeze(ShopIndex shop_index, int index, bool is_freeze)
        {
            if (shop_index == ShopIndex.Role)
            {
                var s = shopData.SaleRoleList[index];
                if (s != null)
                {
                    s.IsFreeze= is_freeze;
                }
            }
            else if (shop_index == ShopIndex.Prop)
            {
                var s = shopData.SalePropList[index];
                if (s != null)
                {
                    s.IsFreeze = is_freeze;
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
                        check_update_skip_level(role_index2);

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
