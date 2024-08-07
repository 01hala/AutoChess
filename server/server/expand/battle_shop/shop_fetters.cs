﻿using Abelkhan;
using config;
using System.Linq;

namespace battle_shop
{
    public partial class shop_skill_role
    {
        private void AddProperty(FettersConfig fetters, battle_shop_player _player)
        {
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
                        }
                        break;

                        case 2:
                        {
                            AddProperty(_player, target_index, fetters.EffectScope, fetters.Stage2value_1, fetters.Stage2value_2);
                        }
                        break;

                        case 3:
                        {
                            AddProperty(_player, target_index, fetters.EffectScope, fetters.Stage3value_1, fetters.Stage3value_2);
                        }
                        break;

                        case 4:
                        {
                            AddProperty(_player, target_index, fetters.EffectScope, fetters.Stage4value_1, fetters.Stage4value_2);
                        }
                        break;
                    }

                    is_trigger = true;
                }
            }

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
            _player.BattleClientCaller.get_client(_player.ClientUUID).refresh(_player.BattleData, _player.ShopData);

            is_trigger = true;
        }

        private void RefreshShop(FettersConfig fetters, battle_shop_player _player, int stage)
        {
            if (fetters.RefreshItemID != 0 && fetters.RefreshItemNum != 0)
            {
                _player.add_shop_item(fetters.RefreshItemID, fetters.RefreshItemNum);
            }
            else
            {
                _player.refresh(stage);
            }
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
            _player.BattleClientCaller.get_client(_player.ClientUUID).refresh(_player.BattleData, _player.ShopData);
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

                }
                break;
            }
        }
    }
}
