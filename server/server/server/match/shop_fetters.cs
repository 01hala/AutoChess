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
    public partial class shop_skill_role
    {
        private void AddProperty(FettersConfig fetters, battle_player _player)
        {
            var count_index = fetters.ObjCount.Count < fettersLevel ? fetters.ObjCount.Count - 1 : fettersLevel - 1;
            var count = fetters.ObjCount[count_index];

            var exclude_list = new List<int>();
            var target_list = new List<int>();
            while (target_list.Count < count)
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
        }

        private void AddCoin(FettersConfig fetters, battle_player _player)
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

        private void RefreshShop(FettersConfig fetters, battle_player _player)
        {
            _player.refresh();
            _player.BattleClientCaller.get_client(_player.ClientUUID).refresh(_player.BattleData, _player.ShopData);

            is_trigger = true;
        }

        private void UseFettersSkill(battle_player _player)
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
                    RefreshShop(fetters, _player);
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
