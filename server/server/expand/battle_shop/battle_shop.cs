using Abelkhan;
using config;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Text.RegularExpressions;

namespace battle_shop
{
    public class battle_shop_player
    {
        public List<int> rolePool;

        private UserBattleData battleData;
        public UserBattleData BattleData
        {
            get
            {
                return battleData;
            }
        }

        private List<shop_skill_role> shop_skill_roles;
        public List<shop_skill_role> ShopSkillRoles
        {
            get
            {
                return shop_skill_roles;
            }
        }

        private ShopData shopData;
        public ShopData ShopData
        {
            set
            {
                shopData = value;
            }
            get
            {
                return shopData;
            }
        }

        public List<shop_event> evs = new ();
        public List<int> skip_level = new ();

        private string clientUUID;
        public string ClientUUID
        {
            set
            {
                clientUUID = value;
            }
            get
            {
                return clientUUID;
            }
        }

        private battle_client_caller caller;
        public battle_client_caller BattleClientCaller
        {
            get
            {
                return caller;
            }
        }

        public battle_shop_player(string _clientUUID, battle_client_caller _caller, List<int> roleList, UserInformation info)
        {
            battleData = new UserBattleData();
            battleData.User = info;
            battleData.RoleList = new List<Role>() { null, null, null, null, null, null };
            battleData.coin = 10;
            battleData.round = 1;
            battleData.stage = 1;
            battleData.victory = 0;
            battleData.faild = 5;

            shop_skill_roles = new List<shop_skill_role> { null, null, null, null, null, null };

            rolePool = roleList;
            clientUUID = _clientUUID;
            caller = _caller;

            shopData = new ShopData();
            shopData.SaleRoleList = new List<ShopRole>();
            shopData.SalePropList = new List<ShopProp>();
        }

        public int maxSaleRoleCount(int stage)
        {
            //if (stage < 3)
            //{
            //    return 4;
            //}
            //else if (stage < 5)
            //{
            //    return 5;
            //}

            //return 6;

            return 4;
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

        public ShopProp randomFood(int stage)
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

            return null;
        }

        public ShopProp randomEquip(int stage)
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

            return null;
        }

        public ShopData refresh(int _stage)
        {
            Log.Log.trace("_refresh begin!");

            while (shopData.SaleRoleList.Count > 5)
            {
                var r = shopData.SaleRoleList[shopData.SaleRoleList.Count - 1];
                if (r == null || !r.IsFreeze)
                {
                    shopData.SaleRoleList.Remove(r);
                }
            }
            
            var count = maxSaleRoleCount(_stage);
            if (count < shopData.SaleRoleList.Count)
            {
                count = shopData.SaleRoleList.Count;
            }

            var i = 0;
            for (; i < count; i++)
            {
                if (i < shopData.SaleRoleList.Count)
                {
                    var r = shopData.SaleRoleList[i];
                    if (r == null || !r.IsFreeze)
                    {
                        var stage = config.ShopProbabilityConfig.RandomStage(_stage, config.Config.ShopProbabilityConfigs);
                        r = randomShopRole(stage);
                        while (r == null)
                        {
                            stage = config.ShopProbabilityConfig.RandomStage(_stage, config.Config.ShopProbabilityConfigs);
                            r = randomShopRole(stage);
                        }
                        shopData.SaleRoleList[i] = r;
                    }
                }
                else
                {
                    var stage = config.ShopProbabilityConfig.RandomStage(_stage, config.Config.ShopProbabilityConfigs);
                    var r = randomShopRole(stage);
                    while (r == null)
                    {
                        stage = config.ShopProbabilityConfig.RandomStage(_stage, config.Config.ShopProbabilityConfigs);
                        r = randomShopRole(stage);
                    }
                    shopData.SaleRoleList.Add(r);
                }
            }

            i = 0;
            if (i < shopData.SalePropList.Count)
            {
                var p = shopData.SalePropList[i];
                if (p == null || !p.IsFreeze)
                {
                    var stage = config.ShopProbabilityConfig.RandomStage(_stage, config.Config.ShopProbabilityConfigs);
                    p = randomFood(stage);
                    while (p == null)
                    {
                        stage = config.ShopProbabilityConfig.RandomStage(_stage, config.Config.ShopProbabilityConfigs);
                        p = randomFood(stage);
                    }
                    shopData.SalePropList[i] = p;
                }
            }
            else
            {
                var stage = config.ShopProbabilityConfig.RandomStage(_stage, config.Config.ShopProbabilityConfigs);
                var p = randomFood(stage);
                while (p == null)
                {
                    stage = config.ShopProbabilityConfig.RandomStage(_stage, config.Config.ShopProbabilityConfigs);
                    p = randomFood(stage);
                }
                shopData.SalePropList.Add(p);
            }

            i++;
            if (i < shopData.SalePropList.Count)
            {
                var p = shopData.SalePropList[i];
                if (p == null || !p.IsFreeze)
                {
                    var stage = config.ShopProbabilityConfig.RandomStage(_stage, config.Config.ShopProbabilityConfigs);
                    p = randomEquip(stage);
                    while (p == null)
                    {
                        stage = config.ShopProbabilityConfig.RandomStage(_stage, config.Config.ShopProbabilityConfigs);
                        p = randomEquip(stage);
                    }
                    shopData.SalePropList[i] = p;
                }
            }
            else
            {
                var stage = config.ShopProbabilityConfig.RandomStage(_stage, config.Config.ShopProbabilityConfigs);
                var p = randomEquip(stage);
                while (p == null)
                {
                    stage = config.ShopProbabilityConfig.RandomStage(_stage, config.Config.ShopProbabilityConfigs);
                    p = randomEquip(stage);
                }
                shopData.SalePropList.Add(p);
            }

            if (_stage >= 5)
            {
                i++;
                if (i < shopData.SalePropList.Count)
                {
                    var p = shopData.SalePropList[i];
                    if (p == null || !p.IsFreeze)
                    {
                        var stage = config.ShopProbabilityConfig.RandomStage(_stage, config.Config.ShopProbabilityConfigs);
                        p = randomFood(stage);
                        while (p == null)
                        {
                            stage = config.ShopProbabilityConfig.RandomStage(_stage, config.Config.ShopProbabilityConfigs);
                            p = randomFood(stage);
                        }
                        shopData.SalePropList[i] = p;
                    }
                }
                else
                {
                    var stage = config.ShopProbabilityConfig.RandomStage(_stage, config.Config.ShopProbabilityConfigs);
                    var p = randomFood(stage);
                    while (p == null)
                    {
                        stage = config.ShopProbabilityConfig.RandomStage(_stage, config.Config.ShopProbabilityConfigs);
                        p = randomFood(stage);
                    }
                    shopData.SalePropList.Add(p);
                }
            }

            Log.Log.trace("_refresh end!");

            return shopData;
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
                if (shopData.SaleRoleList.Count < 6)
                {
                    shopData.SaleRoleList.Add(randomShopRole(stage));
                }

                BattleClientCaller.get_client(ClientUUID).role_update_refresh_shop(shopData);
            }
        }

        public void do_skill(int stage)
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
                        var execute = _skill_role.Trigger(stage, tmp_evs, this);
                        if (execute != null)
                        {
                            foreach (var e in execute)
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

        public void clear_skill_tag()
        {
            foreach (var _skill_role in shop_skill_roles)
            {
                if (_skill_role != null)
                {
                    _skill_role.is_trigger = false;
                }
            }
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

        private static int check_fetters_level(Fetters fetters)
        {
            if (config.Config.FettersConfigs.TryGetValue(fetters.fetters_id, out var fettersConfig))
            {
                for (int i = fettersConfig.RoleNum.Count - 1; i >= 0; i--)
                {
                    if (fetters.number >= fettersConfig.RoleNum[i])
                    {
                        return i + 1;
                    }
                }
            }

            return 0;
        }

        public static List<Fetters> check_fetters(List<Role> RoleList)
        {
            var mapFetters = new Dictionary<int, Fetters>();
            var mapFetterRole = new Dictionary<int, List<int>>();

            foreach (var r in RoleList)
            {
                if (r != null)
                {
                    if (mapFetters.TryGetValue(r.FettersSkillID.fetters_id, out var fetters))
                    {
                        var rolelist = mapFetterRole[r.FettersSkillID.fetters_id];
                        if (!rolelist.Contains(r.RoleID))
                        {
                            fetters.number++;
                            rolelist.Add(r.RoleID);
                        }
                    }
                    else
                    {
                        mapFetters.Add(r.FettersSkillID.fetters_id, new Fetters()
                        {
                            fetters_id = r.FettersSkillID.fetters_id,
                            fetters_level = 0,
                            number = 1
                        });

                        mapFetterRole.Add(r.FettersSkillID.fetters_id, new List<int>() { r.RoleID });
                    }
                }
            }

            var fetters_info = new List<Fetters>();
            foreach (var fetters in mapFetters.Values)
            {
                foreach (var r in RoleList)
                {
                    if (r != null && r.FettersSkillID.fetters_id == fetters.fetters_id)
                    {
                        r.FettersSkillID.number = fetters.number;
                    }
                }

                fetters.fetters_level = check_fetters_level(fetters);
                fetters_info.Add(fetters);
            }

            return fetters_info;
        }

        public List<Fetters> check_fetters()
        {
            var fetters_info = check_fetters(battleData.RoleList);

            foreach (var fetters in fetters_info)
            {
                if (fetters.fetters_level > 0)
                {
                    for (var i = 0; i < battleData.RoleList.Count; i++)
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

        public Role add_role(int role_index, int role_id, int role_Level)
        {
            if (config.Config.RoleConfigs.TryGetValue(role_id, out RoleConfig rcfg))
            {
                var r = new Role();

                r.RoleID = role_id;
                r.BuyRound = battleData.round;
                r.Level = role_Level;
                r.SkillID = rcfg.SkillID;
                r.Number = (r.Level - 1) * 3 + 1;
                r.HP = rcfg.Hp + r.Number - 1;
                r.Attack = rcfg.Attack + r.Number - 1;
                r.TempHP = 0;
                r.TempAttack = 0;
                r.additionBuffer = new();
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

                return r;
            }

            return null;
        }

        public em_error merge_role(int index, int role_index)
        {
            var r = battleData.RoleList[role_index];
            var s = shopData.SaleRoleList[index];

            if (r.RoleID != s.RoleID)
            {
                return em_error.not_same_role_to_update;
            }

            r.Number += 1;
            var oldLevel = r.Level;
            r.Level = 1 + (r.Number - 1) / 2;
            r.HP += 1;
            r.Attack += 1;

            bool is_update_skip_level = false;
            if (r.Level > oldLevel)
            {
                BattleClientCaller.get_client(ClientUUID).role_buy_merge(role_index, r, true);

                is_update_skip_level = true;
            }
            else
            {
                BattleClientCaller.get_client(ClientUUID).role_buy_merge(role_index, r, false);
            }

            shopData.SaleRoleList[index] = null;
            if (is_update_skip_level)
            {
                check_update_skip_level(role_index);
            }

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
                        if (exclude.Count >= battleData.RoleList.Count)
                        {
                            break;
                        }

                        var tmp_index = RandomHelper.RandomInt(battleData.RoleList.Count);
                        if (exclude.Contains(tmp_index))
                        {
                            continue;
                        }

                        var tmpRole = battleData.RoleList[tmp_index];
                        if (tmpRole != null)
                        {
                            rs.Add(tmpRole);
                        }
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
                BattleClientCaller.get_client(ClientUUID).role_equip(p.PropID, role_index, r);
            }

            return em_error.success;
        }

        public void freeze(ShopIndex shop_index, int index, bool is_freeze)
        {
            if (shop_index == ShopIndex.Role)
            {
                var s = shopData.SaleRoleList[index];
                if (s != null)
                {
                    s.IsFreeze = is_freeze;
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
}
