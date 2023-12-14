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
    public partial class shop_skill_role
    {
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
