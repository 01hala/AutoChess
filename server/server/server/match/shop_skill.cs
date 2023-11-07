using Abelkhan;
using config;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static System.Formats.Asn1.AsnWriter;

namespace Match
{
    public class shop_event
    {
        public EMShopEvent ev;
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
            var skill = config.Config.ShopSkillConfigs[roleID];
            if (skill == null)
            {
                return false;
            }

            foreach(var ev in evs)
            {
                switch (ev.ev)
                {
                    case EMShopEvent.sales:
                    {
                        if (skill.EffectTime == EMShopEvent.sales)
                        {
                            return true;
                        }
                    }
                    break;
                    case EMShopEvent.buy:
                    {
                        if (skill.EffectTime == EMShopEvent.buy)
                        {
                            return true;
                        }
                    }
                    break;
                    case EMShopEvent.self_update:
                    {
                        if (skill.EffectTime ==EMShopEvent.self_update && index == ev.index)
                        {
                            return true;
                        }
                    }
                    break;
                    case EMShopEvent.self_food:
                    {
                        if (skill.EffectTime == EMShopEvent.self_food && index == ev.index)
                        {
                            return true;
                        }
                    }
                    break;
                    case EMShopEvent.camp_update:
                    {
                        if (skill.EffectTime == EMShopEvent.camp_update && index != ev.index)
                        {
                            return true;
                        }
                    }
                    break;
                    case EMShopEvent.camp_food:
                    {
                        if (skill.EffectTime ==EMShopEvent.camp_food && index != ev.index)
                        {
                            return true;
                        }
                    }
                    break;
                    case EMShopEvent.start_round:
                    {
                        if (skill.EffectTime == EMShopEvent.start_round)
                        {
                            return true;
                        }
                    }
                    break;
                    case EMShopEvent.end_round:
                    {
                        if (skill.EffectTime == EMShopEvent.end_round)
                        {
                            return true;
                        }
                    }
                    break;
                    case EMShopEvent.syncope:
                    {
                        if (skill.EffectTime == EMShopEvent.syncope)
                        {
                            return true;
                        }
                    }
                    break;
                    case EMShopEvent.refresh:
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

        public void UseSkill(battle_player _player)
        {
            var skill = config.Config.ShopSkillConfigs[roleID];
            if (skill != null)
            {
                switch (skill.Effect)
                {
                    case ShopSkillEffectEM.AddProperty:
                    {

                    }
                    break;

                    case ShopSkillEffectEM.AddCoin:
                    {
                        var addCoin = 0;
                        var r = _player.BattleData.RoleList[index];
                        switch(r.Level)
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
                    }
                    break;

                    case ShopSkillEffectEM.RefreshShop:
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
}
