using Abelkhan;
using config;
using System;
using System.Collections.Generic;

namespace battle_shop
{
    public class shop_event
    {
        public EMRoleShopEvent ev;
        public int index;
        public int role_level;
        public int skill_id;
        public int fetters_level;
        public int fetters_id;
        public Action do_skill_callback;
    }

    public class skill_execute
    {
        public Priority Priority;
        public shop_event trigger_ev;
        public Action execute;
    }

    public partial class shop_skill_role
    {
        public int index;
        public int roleID;
        public int skillID;
        public int fettersSkillID;
        public int fettersLevel;
        public bool is_trigger = false;

        public shop_skill_role(int _index, int _roleID, int _skillID, int _fettersSkillID, int _fettersLevel)
        {
            index = _index;
            roleID = _roleID;
            skillID = _skillID;
            fettersSkillID = _fettersSkillID;
            fettersLevel = _fettersLevel;
        }

        public List<skill_execute> Trigger(int stage, List<shop_event> evs, battle_shop_player _player)
        {
            var ret = new List<skill_execute>();

            ShopSkillConfig skill;
            if (config.Config.ShopSkillConfigs.TryGetValue(skillID, out skill))
            {
                if (TriggerSkill(evs, skill.EffectTime, _player, out var ev))
                {
                    ret.Add(new skill_execute()
                    {
                        Priority = skill.Priority,
                        execute = () =>
                        {
                            UseSkill(_player, ev, stage);
                        }
                    });
                }
            }

            FettersConfig fettersc;
            if (config.Config.FettersConfigs.TryGetValue(fettersSkillID, out fettersc))
            {
                if (TriggerSkill(evs, fettersc.EffectTime, _player, out var ev))
                {
                    ret.Add(new skill_execute()
                    {
                        Priority = fettersc.Priority,
                        execute = () =>
                        {
                            UseFettersSkill(_player, ev, stage);
                        }
                    });
                }
            }

            return ret;
        }

        private bool TriggerSkill(List<shop_event> evs, EMSkillEvent EffectTime, battle_shop_player _player, out shop_event trigger_ev)
        {
            foreach(var ev in evs)
            {
                switch (ev.ev)
                {
                    case EMRoleShopEvent.sales:
                    {
                        if (EffectTime == EMSkillEvent.sales && index == ev.index)
                        {
                            Log.Log.trace("TriggerSkill EMRoleShopEvent.sales EMSkillEvent.sales");
                            trigger_ev = ev;
                            return true;
                        }
                        else if (EffectTime == EMSkillEvent.camp_sales && index != ev.index)
                        {
                            Log.Log.trace("TriggerSkill EMRoleShopEvent.sales EMSkillEvent.camp_sales");
                            trigger_ev = ev;
                            return true;
                        }
                    }
                    break;
                    case EMRoleShopEvent.buy:
                    {
                        if (EffectTime == EMSkillEvent.buy)
                        {
                            Log.Log.trace("TriggerSkill EMRoleShopEvent.buy EMSkillEvent.buy");
                            trigger_ev = ev;
                            return true;
                        }
                    }
                    break;
                    case EMRoleShopEvent.update:
                    {
                        if (EffectTime == EMSkillEvent.upgrade)
                        {
                            Log.Log.trace("TriggerSkill EMRoleShopEvent.update EMSkillEvent.update");
                            trigger_ev = ev;
                            return true;
                        }
                    }
                    break;
                    case EMRoleShopEvent.food:
                    {
                        if (EffectTime == EMSkillEvent.eat_food && index == ev.index)
                        {
                            Log.Log.trace("TriggerSkill EMRoleShopEvent.food EMSkillEvent.eat_food");
                            trigger_ev = ev;
                            return true;
                        }
                        else if (EffectTime == EMSkillEvent.camp_eat_food && index != ev.index)
                        {
                            Log.Log.trace("TriggerSkill EMRoleShopEvent.food EMSkillEvent.camp_eat_food");
                            trigger_ev = ev;
                            return true;
                        }
                    }
                    break;
                    case EMRoleShopEvent.start_round:
                    {
                        if (EffectTime == EMSkillEvent.start_round)
                        {
                            Log.Log.trace("TriggerSkill EMRoleShopEvent.start_round EMSkillEvent.start_round");
                            trigger_ev = ev;
                            return true;
                        }
                        else if (EffectTime == EMSkillEvent.start_round_vacancy && _player.BattleData.RoleList.Count < 6)
                        {
                            Log.Log.trace("TriggerSkill EMRoleShopEvent.start_round EMSkillEvent.start_round_vacancy");
                            trigger_ev = ev;
                            return true;
                        }
                    }
                    break;
                    case EMRoleShopEvent.end_round:
                    {
                        if (EffectTime == EMSkillEvent.end_round)
                        {
                            Log.Log.trace("TriggerSkill EMRoleShopEvent.end_round EMSkillEvent.end_round");
                            trigger_ev = ev;
                            return true;
                        }
                    }
                    break;
                    case EMRoleShopEvent.syncope:
                    {
                        if (EffectTime == EMSkillEvent.syncope && index == ev.index)
                        {
                            Log.Log.trace("TriggerSkill EMRoleShopEvent.syncope EMSkillEvent.syncope");
                            trigger_ev = ev;
                            return true;
                        }
                    }
                    break;
                }
            }

            trigger_ev = null;
            return false;
        }

        private List<int> GetTargetIndex(battle_shop_player _player, Direction ObjectDirection, int ObjCount)
        {
            var target_list = new List<int>();

            if (ObjCount > 1)
            {
                var exclude_list = new List<int>();
                while (target_list.Count < ObjCount)
                {
                    if (exclude_list.Count >= _player.BattleData.RoleList.Count)
                    {
                        break;
                    }

                    int target_index = RandomHelper.RandomInt(_player.BattleData.RoleList.Count);
                    if (exclude_list.Contains(target_index))
                    {
                        continue;
                    }
                    exclude_list.Add(target_index);

                    if ((_player.BattleData.RoleList[target_index] != null))
                    {
                        target_list.Add(target_index);
                    }
                }
            }
            else
            {

                int target_index = -1;
                switch ((int)ObjectDirection)
                {
                    case 0:
                    {
                        var exclude_list = new List<int>();
                        while (target_list.Count < 1)
                        {
                            if (exclude_list.Count >= _player.BattleData.RoleList.Count)
                            {
                                break;
                            }

                            var _target_index = RandomHelper.RandomInt(_player.BattleData.RoleList.Count);
                            if (exclude_list.Contains(_target_index))
                            {
                                continue;
                            }

                            exclude_list.Add(_target_index);
                            if ((_player.BattleData.RoleList[_target_index] != null))
                            {
                                target_index = _target_index;
                                break;
                            }
                        }
                    }
                    break;

                    case 1:
                    {
                        if (index == 4)
                        {
                            target_index = 2;
                        }
                        else if (index == 5)
                        {
                            target_index = 1;
                        }
                        else if (index == 6)
                        {
                            target_index = 3;
                        }
                    }
                    break;

                    case 2:
                    {
                        if (index == 1)
                        {
                            target_index = 5;
                        }
                        else if (index == 2)
                        {
                            target_index = 4;
                        }
                        else if (index == 3)
                        {
                            target_index = 6;
                        }
                    }
                    break;

                    case 3:
                    {
                        if (index == 2)
                        {
                            target_index = 1;
                        }
                        else if (index == 1)
                        {
                            target_index = 3;
                        }
                        else if (index == 4)
                        {
                            target_index = 5;
                        }
                        else if (index == 5)
                        {
                            target_index = 6;
                        }
                    }
                    break;

                    case 4:
                    {
                        if (index == 3)
                        {
                            target_index = 1;
                        }
                        else if (index == 1)
                        {
                            target_index = 2;
                        }
                        else if (index == 6)
                        {
                            target_index = 5;
                        }
                        else if (index == 5)
                        {
                            target_index = 4;
                        }
                    }
                    break;

                    case 5:
                    {
                        target_index = index;
                    }
                    break;
                }
                target_list.Add(target_index);
            }

            return target_list;
        }

        private void AddProperty(battle_shop_player _player, int target_index, EffectScope scope, int hp, int attack)
        {
            Role target_r = _player.BattleData.RoleList[target_index];
            if (target_r != null)
            {
                if (scope == EffectScope.SingleBattle)
                {
                    target_r.TempHP += hp;
                    target_r.TempAttack += attack;
                }
                else if (scope == EffectScope.WholeGame)
                {
                    target_r.HP += hp;
                    target_r.Attack += attack;
                }
            }
        }

        private void AddCoin(battle_shop_player _player, int num)
        {
            _player.BattleData.coin += num;
            _player.BattleClientCaller.get_client(_player.ClientUUID).add_coin(_player.BattleData.coin);
        }

        private void RefreshShop(ShopSkillConfig skill, battle_shop_player _player, int stage)
        {
            _player.refresh(stage);

            var skilleffect = new ShopSkillEffect();
            skilleffect.skill_id = skill.Id;
            skilleffect.spellcaster = index;
            skilleffect.recipient = new List<int>();
            skilleffect.effect = SkillEffectEM.RefreshShop;
            skilleffect.value = new List<int>();
            _player.BattleClientCaller.get_client(_player.ClientUUID).shop_skill_effect(skilleffect);

            _player.BattleClientCaller.get_client(_player.ClientUUID).refresh(_player.BattleData, _player.ShopData);

            is_trigger = true;
        }

        private void UpdateLevel(battle_shop_player _player)
        {
            var r = _player.BattleData.RoleList[index];
            r.Level += 1;
            var addNum = (r.Level - 1) * 3 + 1 - r.Number;
            r.Number += addNum;
            r.HP += addNum;
            r.Attack += addNum;

            _player.check_update_skip_level(index);
            _player.BattleClientCaller.get_client(_player.ClientUUID).role_skill_update(index, r);
        }

        private void SummonShop(ShopSkillConfig skill, battle_shop_player _player, shop_event trigger_ev)
        {
            foreach (var SummonId in skill.SummonId)
            {
                int summon_index = -1;
                if (_player.BattleData.RoleList[trigger_ev.index] == null)
                {
                    summon_index = trigger_ev.index;
                }
                else
                {
                    for (int i = 0; i < _player.BattleData.RoleList.Count; i++)
                    {
                        if (_player.BattleData.RoleList[i] == null)
                        {
                            summon_index = i;
                            break;
                        }
                    }
                }

                if (summon_index < 0)
                {
                    return;
                }

                if (_player.add_role(summon_index, SummonId, skill.SummonLevel) != null)
                {
                    var skilleffect = new ShopSkillEffect();
                    skilleffect.skill_id = skill.Id;
                    skilleffect.spellcaster = summon_index;
                    skilleffect.recipient = new List<int>();
                    skilleffect.effect = SkillEffectEM.SummonShop;
                    skilleffect.value = new List<int>() { _player.BattleData.RoleList[summon_index].RoleID};

                    _player.BattleClientCaller.get_client(_player.ClientUUID).shop_skill_effect(skilleffect);
                    _player.BattleClientCaller.get_client(_player.ClientUUID).shop_summon(summon_index, _player.BattleData.RoleList[summon_index]);
                }
            }
        }

        private void AddBuffer(battle_shop_player _player, int target_index, EffectScope scope, int buffer_id)
        {
            Role target_r = _player.BattleData.RoleList[target_index];
            if (target_r != null)
            {
                if (scope == EffectScope.SingleBattle)
                {
                    target_r.TempAdditionBuffer.Add(buffer_id);
                }
                else if (scope == EffectScope.WholeGame)
                {
                    target_r.additionBuffer.Add(buffer_id);
                }
            }
        }
    }
}
