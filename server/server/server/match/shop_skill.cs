using Abelkhan;
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
    }

    public class shop_skill_role
    {
        public int index;
        public int roleID;
        public bool is_trigger = false;

        public shop_skill_role(int _index, int _roleID)
        {
            index = _index;
            roleID = _roleID;
        }

        public bool Trigger(List<shop_event> evs)
        {
            if (is_trigger)
            {
                return false;
            }

            var skill = config.Config.ShopSkillConfigs[roleID];
            if (skill == null)
            {
                return false;
            }

            foreach(var ev in evs)
            {
                switch (ev.ev)
                {
                    case EMRoleShopEvent.sales:
                    {
                        if (skill.EffectTime == EMShopEvent.sales)
                        {
                            return true;
                        }
                    }
                    break;
                    case EMRoleShopEvent.buy:
                    {
                        if (skill.EffectTime == EMShopEvent.buy)
                        {
                            return true;
                        }
                    }
                    break;
                    case EMRoleShopEvent.update:
                    {
                        if (skill.EffectTime ==EMShopEvent.self_update && index == ev.index)
                        {
                            return true;
                        }
                        else if (skill.EffectTime == EMShopEvent.camp_update && index != ev.index)
                        {
                            return true;
                        }
                    }
                    break;
                    case EMRoleShopEvent.food:
                    {
                        if (skill.EffectTime == EMShopEvent.self_food && index == ev.index)
                        {
                            return true;
                        }
                        else if (skill.EffectTime == EMShopEvent.camp_food && index != ev.index)
                        {
                            return true;
                        }
                    }
                    break;
                    case EMRoleShopEvent.start_round:
                    {
                        if (skill.EffectTime == EMShopEvent.start_round)
                        {
                            return true;
                        }
                    }
                    break;
                    case EMRoleShopEvent.end_round:
                    {
                        if (skill.EffectTime == EMShopEvent.end_round)
                        {
                            return true;
                        }
                    }
                    break;
                    case EMRoleShopEvent.syncope:
                    {
                        if (skill.EffectTime == EMShopEvent.syncope)
                        {
                            return true;
                        }
                    }
                    break;
                    case EMRoleShopEvent.refresh:
                    {
                        if (skill.EffectTime == EMShopEvent.refresh)
                        {
                            return true;
                        }
                    }
                    break;
                }
            }

            return false;
        }

        private void AddProperty(ShopSkillConfig skill, battle_player _player)
        {
            var skilleffect = new ShopSkillEffect();
            skilleffect.skill_id = skill.Id;
            skilleffect.spellcaster = index;
            skilleffect.recipient = new List<int>();
            skilleffect.effect = ShopSkillEffectEM.AddProperty;

            Role r = null;
            switch ((int)skill.ObjectDirection)
            {
                case 1:
                {
                    if (index == 4)
                    {
                        skilleffect.recipient.Add(2);
                        r = _player.BattleData.RoleList[2];
                    }
                    else if (index == 5)
                    {
                        skilleffect.recipient.Add(1);
                        r = _player.BattleData.RoleList[1];
                    }
                    else if (index == 6)
                    {
                        skilleffect.recipient.Add(3);
                        r = _player.BattleData.RoleList[3];
                    }
                }
                break;

                case 2:
                {
                    if (index == 1)
                    {
                        skilleffect.recipient.Add(5);
                        r = _player.BattleData.RoleList[5];
                    }
                    else if (index == 2)
                    {
                        skilleffect.recipient.Add(4);
                        r = _player.BattleData.RoleList[4];
                    }
                    else if (index == 3)
                    {
                        skilleffect.recipient.Add(6);
                        r = _player.BattleData.RoleList[6];
                    }
                }
                break;

                case 3:
                {
                    if (index == 2)
                    {
                        skilleffect.recipient.Add(1);
                        r = _player.BattleData.RoleList[1];
                    }
                    else if (index == 1)
                    {
                        skilleffect.recipient.Add(3);
                        r = _player.BattleData.RoleList[3];
                    }
                    else if (index == 4)
                    {
                        skilleffect.recipient.Add(5);
                        r = _player.BattleData.RoleList[5];
                    }
                    else if (index == 5)
                    {
                        skilleffect.recipient.Add(6);
                        r = _player.BattleData.RoleList[6];
                    }
                }
                break;

                case 4:
                {
                    if (index == 3)
                    {
                        skilleffect.recipient.Add(1);
                        r = _player.BattleData.RoleList[1];
                    }
                    else if (index == 1)
                    {
                        skilleffect.recipient.Add(2);
                        r = _player.BattleData.RoleList[2];
                    }
                    else if (index == 6)
                    {
                        skilleffect.recipient.Add(5);
                        r = _player.BattleData.RoleList[5];
                    }
                    else if (index == 5)
                    {
                        skilleffect.recipient.Add(4);
                        r = _player.BattleData.RoleList[4];
                    }
                }
                break;

                case 5:
                {
                    skilleffect.recipient.Add(index);
                    r = _player.BattleData.RoleList[index];
                }
                break;
            }

            if (r != null)
            {
                switch (r.Level)
                {
                    case 1:
                    {
                        if (skill.EffectScope == EffectScope.SingleBattle)
                        {
                            r.TempHP += skill.Level1Value_1;
                            r.TempAttack += skill.Level1Value_2;
                        }
                        else if (skill.EffectScope == EffectScope.WholeGame)
                        {
                            r.HP += skill.Level1Value_1;
                            r.Attack += skill.Level1Value_2;
                        }
                        skilleffect.value = new List<int>() { skill.Level1Value_1, skill.Level1Value_2 };
                    }
                    break;

                    case 2:
                    {
                        if (skill.EffectScope == EffectScope.SingleBattle)
                        {
                            r.TempHP += skill.Level2Value_1;
                            r.TempAttack += skill.Level2Value_2;
                        }
                        else if (skill.EffectScope == EffectScope.WholeGame)
                        {
                            r.HP += skill.Level2Value_1;
                            r.Attack += skill.Level2Value_2;
                        }
                        skilleffect.value = new List<int>() { skill.Level2Value_1, skill.Level2Value_2 };
                    }
                    break;

                    case 3:
                    {
                        if (skill.EffectScope == EffectScope.SingleBattle)
                        {
                            r.TempHP += skill.Level3Value_1;
                            r.TempAttack += skill.Level3Value_2;
                        }
                        else if (skill.EffectScope == EffectScope.WholeGame)
                        {
                            r.HP += skill.Level3Value_1;
                            r.Attack += skill.Level3Value_2;
                        }
                        skilleffect.value = new List<int>() { skill.Level3Value_1, skill.Level3Value_2 };
                    }
                    break;
                }

                _player.BattleClientCaller.get_client(_player.ClientUUID).shop_skill_effect(skilleffect);
                _player.BattleClientCaller.get_client(_player.ClientUUID).refresh(_player.BattleData, _player.ShopData);

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
                    _player.BattleData.coin += skill.Level1Value_1;
                }
                break;

                case 2:
                {
                    addCoin = skill.Level2Value_1;
                    _player.BattleData.coin += skill.Level2Value_1;
                }
                break;

                case 3:
                {
                    addCoin = skill.Level3Value_1;
                    _player.BattleData.coin += skill.Level3Value_1;
                }
                break;
            }

            var skilleffect = new ShopSkillEffect();
            skilleffect.skill_id = skill.Id;
            skilleffect.spellcaster = index;
            skilleffect.recipient = new List<int>();
            skilleffect.effect = ShopSkillEffectEM.AddCoin;
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
            skilleffect.effect = ShopSkillEffectEM.RefreshShop;
            skilleffect.value = new List<int>();
            _player.BattleClientCaller.get_client(_player.ClientUUID).shop_skill_effect(skilleffect);

            _player.BattleClientCaller.get_client(_player.ClientUUID).refresh(_player.BattleData, _player.ShopData);

            is_trigger = true;
        }

        public void UseSkill(battle_player _player)
        {
            if (is_trigger)
            {
                return;
            }

            var skill = config.Config.ShopSkillConfigs[roleID];
            if (skill == null)
            {
                return;
            }

            switch (skill.Effect)
            {
                case ShopSkillEffectEM.AddProperty:
                {
                    AddProperty(skill, _player);
                }
                break;

                case ShopSkillEffectEM.AddCoin:
                {
                    AddCoin(skill, _player);
                }
                break;

                case ShopSkillEffectEM.RefreshShop:
                {
                    RefreshShop(skill, _player);
                }
                break;

                case ShopSkillEffectEM.AddEquipment:
                {

                }
                break;
            }
        }
    }
}
