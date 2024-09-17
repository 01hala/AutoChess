using Abelkhan;
using config;
using System.Collections.Generic;

namespace battle_shop
{
    public partial class shop_skill_role
    {
        private void AddProperty(ShopSkillConfig skill, battle_shop_player _player)
        {
            Log.Log.trace("AddProperty begin");

            var skilleffect = new ShopSkillEffect();
            skilleffect.skill_id = skill.Id;
            skilleffect.spellcaster = index;
            skilleffect.recipient = new List<int>();
            skilleffect.effect = SkillEffectEM.AddProperty;

            var target_list = GetTargetIndex(_player, skill.ObjectDirection, skill.ObjCount);
            Log.Log.trace("slill  target_list:{0}", Newtonsoft.Json.JsonConvert.SerializeObject(target_list));
            foreach (var target_index in target_list)
            {
                if (target_index > 0)
                {
                    Log.Log.trace("slill  _player:{0}", Newtonsoft.Json.JsonConvert.SerializeObject(_player));
                    var r = _player.BattleData.RoleList[target_index];
                    Log.Log.trace("slill r:{0}", r);
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

                }
            }

            _player.BattleClientCaller.get_client(_player.ClientUUID).shop_skill_effect(skilleffect);
            _player.BattleClientCaller.get_client(_player.ClientUUID).refresh(_player.BattleData, _player.ShopData);
            _player.BattleClientCaller.get_client(_player.ClientUUID).role_add_property(_player.BattleData);

            is_trigger = true;

            Log.Log.trace("AddProperty end");
        }

        private void AddCoin(ShopSkillConfig skill, battle_shop_player _player)
        {
            Log.Log.trace("AddCoin begin");

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

            Log.Log.trace("AddCoin end");
        }

        private void UpdateLevel(ShopSkillConfig skill, battle_shop_player _player)
        {
            Log.Log.trace("UpdateLevel begin");

            UpdateLevel(_player);

            var r = _player.BattleData.RoleList[index];
            
            var skilleffect = new ShopSkillEffect();
            skilleffect.skill_id = skill.Id;
            skilleffect.spellcaster = index;
            skilleffect.recipient = new List<int>();
            skilleffect.effect = SkillEffectEM.UpdateLevel;
            skilleffect.value = new List<int>() { r.Level };
            _player.BattleClientCaller.get_client(_player.ClientUUID).shop_skill_effect(skilleffect);

            Log.Log.trace("UpdateLevel end");
        }

        private void AddBuffer(ShopSkillConfig skill, battle_shop_player _player)
        {
            Log.Log.trace("AddBuffer begin");

            var target_list = GetTargetIndex(_player, skill.ObjectDirection, skill.ObjCount);
            foreach (var target_index in target_list)
            {
                AddBuffer(_player, target_index, skill.EffectScope, skill.AddBufferID);
            }
            var skilleffect = new ShopSkillEffect();
            skilleffect.skill_id = skill.Id;
            skilleffect.spellcaster = index;
            skilleffect.recipient = target_list;
            skilleffect.effect = SkillEffectEM.AddBuffer;
            skilleffect.value = new List<int>() { skill.AddBufferID };
            _player.BattleClientCaller.get_client(_player.ClientUUID).shop_skill_effect(skilleffect);

            Log.Log.trace("AddBuffer end");
        }

        private void AddEquipment(ShopSkillConfig skill, battle_shop_player _player)
        {
            var PropID = 3007;
            _player.BattleData.RoleList[index].equipID = PropID;

            var skilleffect = new ShopSkillEffect();
            skilleffect.skill_id = skill.Id;
            skilleffect.spellcaster = index;
            skilleffect.effect = SkillEffectEM.AddEquipment;
            skilleffect.value = new List<int>() { PropID };
            _player.BattleClientCaller.get_client(_player.ClientUUID).shop_skill_effect(skilleffect);
            _player.BattleClientCaller.get_client(_player.ClientUUID).refresh(_player.BattleData, _player.ShopData);

            is_trigger = true;
        }

        private void ItemReduced(ShopSkillConfig skill, battle_shop_player _player)
        {
            foreach (var prop in _player.ShopData.SalePropList)
            {
                if (prop.PropID > 1001 && prop.PropID < 1999)
                {
                    prop.Price -= 1;
                }
            }

            var skilleffect = new ShopSkillEffect();
            skilleffect.skill_id = skill.Id;
            skilleffect.spellcaster = index;
            skilleffect.effect = SkillEffectEM.ItemReduced;
            _player.BattleClientCaller.get_client(_player.ClientUUID).shop_skill_effect(skilleffect);
            _player.BattleClientCaller.get_client(_player.ClientUUID).refresh(_player.BattleData, _player.ShopData);
        }

        private void UseSkill(battle_shop_player _player, shop_event trigger_ev, int stage)
        {
            Log.Log.trace("UseSkill skillID:{0} begin!", skillID);

            ShopSkillConfig skill;
            if (!config.Config.ShopSkillConfigs.TryGetValue(skillID, out skill))
            {
                return;
            }
            Log.Log.trace("UseSkill skillID:{0} start!", skillID);

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
                    RefreshShop(skill, _player, stage);
                }
                break;

                case SkillEffectEM.UpdateLevel:
                {
                    UpdateLevel(skill, _player);
                }
                break;

                case SkillEffectEM.SummonShop:
                {
                    SummonShop(skill, _player, trigger_ev);
                }
                break;

                case SkillEffectEM.ItemReduced:
                {
                    ItemReduced(skill, _player);
                }
                break;

                case SkillEffectEM.AddBuffer:
                {
                    AddBuffer(skill, _player);
                }
                break;

                case SkillEffectEM.AddEquipment:
                {
                    AddEquipment(skill, _player);
                }
                break;
            }

            Log.Log.trace("UseSkill skillID:{0} end!", skillID);
        }
    }
}
