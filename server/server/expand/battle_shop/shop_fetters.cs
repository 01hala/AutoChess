using Abelkhan;
using config;
using System.Collections.Generic;
using System.Linq;

namespace battle_shop
{
    public partial class shop_skill_role
    {
        private void AddProperty(FettersConfig fetters, battle_shop_player _player)
        {
            var skilleffect = new ShopSkillEffect();
            skilleffect.skill_id = fetters.Id;
            skilleffect.spellcaster = index;
            skilleffect.recipient = new List<int>();
            skilleffect.effect = SkillEffectEM.AddProperty;

            var count_index = fetters.ObjCount.Count < fettersLevel ? fetters.ObjCount.Count - 1 : fettersLevel - 1;
            var count = fetters.ObjCount[count_index];
            var target_list = GetTargetIndex(_player, 0, count);
            foreach (var target_index in target_list)
            { 
                if (target_index > 0)
                {
                    switch (fettersLevel)
                    {
                        case 1:
                        {
                            AddProperty(_player, target_index, fetters.EffectScope, fetters.Stage1value_1, fetters.Stage1value_2);
                            skilleffect.value = new List<int>() { fetters.Stage1value_1, fetters.Stage1value_2 };
                        }
                        break;

                        case 2:
                        {
                            AddProperty(_player, target_index, fetters.EffectScope, fetters.Stage2value_1, fetters.Stage2value_2);
                            skilleffect.value = new List<int>() { fetters.Stage2value_1, fetters.Stage2value_2 };
                        }
                        break;

                        case 3:
                        {
                            AddProperty(_player, target_index, fetters.EffectScope, fetters.Stage3value_1, fetters.Stage3value_2);
                            skilleffect.value = new List<int>() { fetters.Stage3value_1, fetters.Stage3value_2 };
                        }
                        break;

                        case 4:
                        {
                            AddProperty(_player, target_index, fetters.EffectScope, fetters.Stage4value_1, fetters.Stage4value_2);
                            skilleffect.value = new List<int>() { fetters.Stage4value_1, fetters.Stage4value_2 };
                        }
                        break;
                    }

                    is_trigger = true;
                }
            }

            _player.BattleClientCaller.get_client(_player.ClientUUID).shop_fetters_effect(skilleffect);
            _player.BattleClientCaller.get_client(_player.ClientUUID).refresh(_player.BattleData, _player.ShopData);
            _player.BattleClientCaller.get_client(_player.ClientUUID).role_add_property(_player.BattleData);
        }

        private void AddCoin(FettersConfig fetters, battle_shop_player _player)
        {
            var addCoin = 0;
            switch (fettersLevel)
            {
                case 1:
                {
                    addCoin = fetters.Stage1value_1;
                }
                break;

                case 2:
                {
                    addCoin = fetters.Stage2value_1;
                }
                break;

                case 3:
                {
                    addCoin = fetters.Stage3value_1;
                }
                break;

                case 4:
                {
                    addCoin = fetters.Stage4value_1;
                }
                break;
            }
            AddCoin(_player, addCoin);
            
            var skilleffect = new ShopSkillEffect();
            skilleffect.skill_id = fetters.Id;
            skilleffect.spellcaster = index;
            skilleffect.recipient = new List<int>();
            skilleffect.effect = SkillEffectEM.AddCoin;
            skilleffect.value = new List<int>() { addCoin };
            _player.BattleClientCaller.get_client(_player.ClientUUID).shop_fetters_effect(skilleffect);
            _player.BattleClientCaller.get_client(_player.ClientUUID).refresh(_player.BattleData, _player.ShopData);

            is_trigger = true;
        }

        private void RefreshShop(FettersConfig fetters, battle_shop_player _player, int stage)
        {
            if (fetters.RefreshItemID[0] != 0 && fetters.RefreshItemNum != 0)
            {
                _player.add_shop_item(fetters.RefreshItemID[0], fetters.RefreshItemNum);
            }
            else
            {
                _player.refresh(stage);
            }
            var skilleffect = new ShopSkillEffect();
            skilleffect.skill_id = fetters.Id;
            skilleffect.spellcaster = index;
            skilleffect.recipient = new List<int>();
            skilleffect.effect = SkillEffectEM.RefreshShop;
            skilleffect.value = new List<int>();
            _player.BattleClientCaller.get_client(_player.ClientUUID).shop_fetters_effect(skilleffect);
            _player.BattleClientCaller.get_client(_player.ClientUUID).refresh(_player.BattleData, _player.ShopData);

            is_trigger = true;
        }

        private void FettersSummonShop(battle_shop_player _player, shop_event trigger_ev)
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

            FettersConfig fetters;
            if (!config.Config.FettersConfigs.TryGetValue(trigger_ev.fetters_id, out fetters))
            {
                return;
            }
            if (_player.add_role(summon_index, fetters.SummonId, fetters.SummonLevel) != null)
            {
                var skilleffect = new ShopSkillEffect();
                skilleffect.skill_id = fetters.Id;
                skilleffect.spellcaster = summon_index;
                skilleffect.recipient = new List<int>();
                skilleffect.effect = SkillEffectEM.SummonShop;
                skilleffect.value = new List<int>() { _player.BattleData.RoleList[summon_index].RoleID };

                _player.BattleClientCaller.get_client(_player.ClientUUID).shop_fetters_effect(skilleffect);
                _player.BattleClientCaller.get_client(_player.ClientUUID).shop_summon(summon_index, _player.BattleData.RoleList[summon_index]);
            }
        }

        private void AddBuffer(FettersConfig fetters, battle_shop_player _player)
        {
            var count_index = fetters.ObjCount.Count < fettersLevel ? fetters.ObjCount.Count - 1 : fettersLevel - 1;
            var count = fetters.ObjCount[count_index];
            var target_list = GetTargetIndex(_player, 0, count);
            foreach (var target_index in target_list)
            {
                AddBuffer(_player, target_index, fetters.EffectScope, fetters.AddBufferID);
            }
            var skilleffect = new ShopSkillEffect();
            skilleffect.skill_id = fetters.Id;
            skilleffect.spellcaster = index;
            skilleffect.recipient = target_list;
            skilleffect.effect = SkillEffectEM.AddBuffer;
            skilleffect.value = new List<int>() { fetters.AddBufferID };
            _player.BattleClientCaller.get_client(_player.ClientUUID).shop_fetters_effect(skilleffect);
        }

        private void AddBuildValue(FettersConfig fetters, battle_shop_player _player)
        {
            var buildValue = 0;
            switch (fettersLevel)
            {
                case 1:
                {
                    buildValue = fetters.Stage1value_1;
                }
                break;

                case 2:
                {
                    buildValue = fetters.Stage2value_1;
                }
                break;

                case 3:
                {
                    buildValue = fetters.Stage3value_1;
                }
                break;

                case 4:
                {
                    buildValue = fetters.Stage4value_1;
                }
                break;
            }
            _player.BattleData.buildValue += buildValue;

            var skilleffect = new ShopSkillEffect();
            skilleffect.skill_id = fetters.Id;
            skilleffect.spellcaster = index;
            skilleffect.effect = SkillEffectEM.AddBuildValue;
            skilleffect.value = new List<int>() { buildValue };
            _player.BattleClientCaller.get_client(_player.ClientUUID).shop_fetters_effect(skilleffect);
            _player.BattleClientCaller.get_client(_player.ClientUUID).refresh(_player.BattleData, _player.ShopData);
        }

        private void AddEquipment(FettersConfig fetters, battle_shop_player _player)
        {
            var PropID = 0;
            if (fetters.RefreshItemID.Count > 0)
            {
                var index = RandomHelper.RandomInt(fetters.RefreshItemID.Count);
                PropID = fetters.RefreshItemID[index];
                foreach (var prop in _player.ShopData.SalePropList)
                {
                    if (prop.PropID > 3001 && prop.PropID < 3999)
                    {
                        _player.ShopData.SalePropList.Remove(prop);
                        break;
                    }
                }
                _player.ShopData.SalePropList.Add(new ShopProp()
                {
                    PropID = PropID,
                    IsFreeze = false,
                });
            }
            var skilleffect = new ShopSkillEffect();
            skilleffect.skill_id = fetters.Id;
            skilleffect.spellcaster = index;
            skilleffect.effect = SkillEffectEM.AddEquipment;
            skilleffect.value = new List<int>() { PropID };
            _player.BattleClientCaller.get_client(_player.ClientUUID).shop_fetters_effect(skilleffect);
            _player.BattleClientCaller.get_client(_player.ClientUUID).refresh(_player.BattleData, _player.ShopData);

            is_trigger = true;
        }

        private void UseFettersSkill(battle_shop_player _player, shop_event trigger_ev, int stage)
        {
            if (fettersLevel <= 0)
            {
                return;
            }

            FettersConfig fetters;
            if (!config.Config.FettersConfigs.TryGetValue(fettersSkillID, out fetters))
            {
                return;
            }

            switch (fetters.Effect)
            {
                case SkillEffectEM.AddProperty:
                {
                    AddProperty(fetters, _player);
                }
                break;

                case SkillEffectEM.AddCoin:
                {
                    AddCoin(fetters, _player);
                }
                break;

                case SkillEffectEM.RefreshShop:
                {
                    RefreshShop(fetters, _player, stage);
                }
                break;

                case SkillEffectEM.UpdateLevel:
                {
                    UpdateLevel(_player);
                }
                break;

                case SkillEffectEM.SummonShop:
                {
                    FettersSummonShop(_player, trigger_ev);
                }
                break;

                case SkillEffectEM.AddBuffer:
                {
                    AddBuffer(fetters, _player);
                }
                break;

                case SkillEffectEM.AddBuildValue:
                {
                    AddBuildValue(fetters, _player);
                }
                break;

                case SkillEffectEM.AddEquipment:
                {
                    AddEquipment(fetters, _player);
                }
                break;
            }
        }
    }
}
