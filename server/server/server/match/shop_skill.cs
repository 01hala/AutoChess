﻿using Abelkhan;
using config;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static System.Formats.Asn1.AsnWriter;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Match
{
    public class shop_event
    {
        public EMRoleShopEvent ev;
        public int index;
        public int role_level;
        public int skill_id;
        public int fetters_level;
        public int fetters_id;
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

        public List<skill_execute> Trigger(List<shop_event> evs, battle_player _player)
        {
            if (is_trigger)
            {
                return null;
            }

            var ret = new List<skill_execute>();

            ShopSkillConfig skill;
            if (config.Config.ShopSkillConfigs.TryGetValue(skillID, out skill))
            {
                if (TriggerSkill(evs, skill.EffectTime, out var ev))
                {
                    ret.Add(new skill_execute()
                    {
                        Priority = skill.Priority,
                        execute = () =>
                        {
                            UseSkill(_player, ev);
                        }
                    });
                }
            }

            FettersConfig fettersc;
            if (config.Config.FettersConfigs.TryGetValue(fettersSkillID, out fettersc))
            {
                if (TriggerSkill(evs, fettersc.EffectTime, out var ev))
                {
                    ret.Add(new skill_execute()
                    {
                        Priority = fettersc.Priority,
                        execute = () =>
                        {
                            UseFettersSkill(_player, ev);
                        }
                    });
                }
            }

            return ret;
        }

        private bool TriggerSkill(List<shop_event> evs, EMSkillEvent EffectTime, out shop_event trigger_ev)
        {
            foreach(var ev in evs)
            {
                switch (ev.ev)
                {
                    case EMRoleShopEvent.sales:
                    {
                        if (EffectTime == EMSkillEvent.sales && index == ev.index)
                        {
                            trigger_ev = ev;
                            return true;
                        }
                        else if (EffectTime == EMSkillEvent.camp_sales && index != ev.index)
                        {
                            trigger_ev = ev;
                            return true;
                        }
                    }
                    break;
                    case EMRoleShopEvent.buy:
                    {
                        if (EffectTime == EMSkillEvent.buy)
                        {
                            trigger_ev = ev;
                            return true;
                        }
                    }
                    break;
                    case EMRoleShopEvent.update:
                    {
                        if (EffectTime ==EMSkillEvent.update)
                        {
                            trigger_ev = ev;
                            return true;
                        }
                    }
                    break;
                    case EMRoleShopEvent.food:
                    {
                        if (EffectTime == EMSkillEvent.eat_food && index == ev.index)
                        {
                            trigger_ev = ev;
                            return true;
                        }
                        else if (EffectTime == EMSkillEvent.camp_eat_food && index != ev.index)
                        {
                            trigger_ev = ev;
                            return true;
                        }
                    }
                    break;
                    case EMRoleShopEvent.start_round:
                    {
                        if (EffectTime == EMSkillEvent.start_round)
                        {
                            trigger_ev = ev;
                            return true;
                        }
                    }
                    break;
                    case EMRoleShopEvent.end_round:
                    {
                        if (EffectTime == EMSkillEvent.end_round)
                        {
                            trigger_ev = ev;
                            return true;
                        }
                    }
                    break;
                    case EMRoleShopEvent.syncope:
                    {
                        if (EffectTime == EMSkillEvent.syncope && index == ev.index)
                        {
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

        private void AddProperty(battle_player _player, int target_index, EffectScope scope, int hp, int attack)
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

        private void AddProperty(ShopSkillConfig skill, battle_player _player)
        {
            var skilleffect = new ShopSkillEffect();
            skilleffect.skill_id = skill.Id;
            skilleffect.spellcaster = index;
            skilleffect.recipient = new List<int>();
            skilleffect.effect = SkillEffectEM.AddProperty;

            int target_index = -1;
            switch ((int)skill.ObjectDirection)
            {
                case 1:
                {
                    if (index == 4)
                    {
                        skilleffect.recipient.Add(2);
                        target_index = 2;
                    }
                    else if (index == 5)
                    {
                        skilleffect.recipient.Add(1);
                        target_index = 1;
                    }
                    else if (index == 6)
                    {
                        skilleffect.recipient.Add(3);
                        target_index = 3;
                    }
                }
                break;

                case 2:
                {
                    if (index == 1)
                    {
                        skilleffect.recipient.Add(5);
                        target_index = 5;
                    }
                    else if (index == 2)
                    {
                        skilleffect.recipient.Add(4);
                        target_index = 4;
                    }
                    else if (index == 3)
                    {
                        skilleffect.recipient.Add(6);
                        target_index = 6;
                    }
                }
                break;

                case 3:
                {
                    if (index == 2)
                    {
                        skilleffect.recipient.Add(1);
                        target_index = 1;
                    }
                    else if (index == 1)
                    {
                        skilleffect.recipient.Add(3);
                        target_index = 3;
                    }
                    else if (index == 4)
                    {
                        skilleffect.recipient.Add(5);
                        target_index = 5;
                    }
                    else if (index == 5)
                    {
                        skilleffect.recipient.Add(6);
                        target_index = 6;
                    }
                }
                break;

                case 4:
                {
                    if (index == 3)
                    {
                        skilleffect.recipient.Add(1);
                        target_index = 1;
                    }
                    else if (index == 1)
                    {
                        skilleffect.recipient.Add(2);
                        target_index = 2;
                    }
                    else if (index == 6)
                    {
                        skilleffect.recipient.Add(5);
                        target_index = 5;
                    }
                    else if (index == 5)
                    {
                        skilleffect.recipient.Add(4);
                        target_index = 4;
                    }
                }
                break;

                case 5:
                {
                    skilleffect.recipient.Add(index);
                    target_index = index;
                }
                break;
            }

            if (target_index > 0)
            {
                var r = _player.BattleData.RoleList[index];
                switch (r.Level)
                {
                    case 1:
                    {
                        AddProperty(_player, target_index, skill.EffectScope, skill.Level1Value_1, skill.Level1Value_2);
                        skilleffect.value = new List<int>() { skill.Level1Value_1, skill.Level1Value_2 };
                    }
                    break;

                    case 2:
                    {
                        AddProperty(_player, target_index, skill.EffectScope, skill.Level2Value_1, skill.Level2Value_2);
                        skilleffect.value = new List<int>() { skill.Level2Value_1, skill.Level2Value_2 };
                    }
                    break;

                    case 3:
                    {
                        AddProperty(_player, target_index, skill.EffectScope, skill.Level3Value_1, skill.Level3Value_2);
                        skilleffect.value = new List<int>() { skill.Level3Value_1, skill.Level3Value_2 };
                    }
                    break;
                }

                _player.BattleClientCaller.get_client(_player.ClientUUID).shop_skill_effect(skilleffect);
                _player.BattleClientCaller.get_client(_player.ClientUUID).refresh(_player.BattleData, _player.ShopData);
                _player.BattleClientCaller.get_client(_player.ClientUUID).role_add_property(_player.BattleData);

                is_trigger = true;
            }
        }

        private void AddCoin(battle_player _player, int num)
        {
            _player.BattleData.coin += num;
            _player.BattleClientCaller.get_client(_player.ClientUUID).add_coin(_player.BattleData.coin);
        }

        private void AddCoin(ShopSkillConfig skill, battle_player _player)
        {
            var addCoin = 0;
            var r = _player.BattleData.RoleList[index];
            switch (r.Level)
            {
                case 1:
                {
                    addCoin = skill.Level1Value_1;
                }
                break;

                case 2:
                {
                    addCoin = skill.Level2Value_1;
                }
                break;

                case 3:
                {
                    addCoin = skill.Level3Value_1;
                }
                break;
            }
            AddCoin(_player, addCoin);

            var skilleffect = new ShopSkillEffect();
            skilleffect.skill_id = skill.Id;
            skilleffect.spellcaster = index;
            skilleffect.recipient = new List<int>();
            skilleffect.effect = SkillEffectEM.AddCoin;
            skilleffect.value = new List<int>() { addCoin };
            _player.BattleClientCaller.get_client(_player.ClientUUID).shop_skill_effect(skilleffect);
            _player.BattleClientCaller.get_client(_player.ClientUUID).refresh(_player.BattleData, _player.ShopData);

            is_trigger = true;
        }

        private void RefreshShop(ShopSkillConfig skill, battle_player _player)
        {
            _player.refresh();

            var skilleffect = new ShopSkillEffect();
            skilleffect.skill_id = skill.Id;
            skilleffect.spellcaster = index;
            skilleffect.recipient = new List<int>();
            skilleffect.effect =SkillEffectEM.RefreshShop;
            skilleffect.value = new List<int>();
            _player.BattleClientCaller.get_client(_player.ClientUUID).shop_skill_effect(skilleffect);

            _player.BattleClientCaller.get_client(_player.ClientUUID).refresh(_player.BattleData, _player.ShopData);

            is_trigger = true;
        }

        private void UpdateLevel(battle_player _player)
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

        private void SummonShop(battle_player _player, shop_event trigger_ev)
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

            ShopSkillConfig skill;
            if (!config.Config.ShopSkillConfigs.TryGetValue(trigger_ev.skill_id, out skill))
            {
                return;
            }
            if (_player.add_role(summon_index, skill.SummonId, skill.SummonLevel))
            {
                _player.BattleClientCaller.get_client(_player.ClientUUID).shop_summon(_player.BattleData);
            }
        }

        private void UseSkill(battle_player _player, shop_event trigger_ev)
        {
            ShopSkillConfig skill;
            if (!config.Config.ShopSkillConfigs.TryGetValue(skillID, out skill))
            {
                return;
            }

            switch (skill.Effect)
            {
                case SkillEffectEM.AddProperty:
                {
                    AddProperty(skill, _player);
                }
                break;

                case SkillEffectEM.AddCoin:
                {
                    AddCoin(skill, _player);
                }
                break;

                case SkillEffectEM.RefreshShop:
                {
                    RefreshShop(skill, _player);
                }
                break;

                case SkillEffectEM.UpdateLevel:
                {
                    UpdateLevel(_player);
                }
                break;

                case SkillEffectEM.SummonShop:
                {
                    SummonShop(_player, trigger_ev);
                }
                break;

                case SkillEffectEM.AddBuffer:
                {

                }
                break;

                case SkillEffectEM.AddEquipment:
                {

                }
                break;
            }
        }
    }
}
