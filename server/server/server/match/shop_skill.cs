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

    public class skill_execute
    {
        public Priority Priority;
        public Action execute;
    }

    public class shop_skill_role
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
                if (TriggerSkill(evs, skill.EffectTime))
                {
                    ret.Add(new skill_execute()
                    {
                        Priority = skill.Priority,
                        execute = () =>
                        {
                            UseSkill(_player);
                        }
                    });
                }
            }

            FettersConfig fettersc;
            if (config.Config.FettersConfigs.TryGetValue(fettersSkillID, out fettersc))
            {
                if (TriggerSkill(evs, fettersc.EffectTime))
                {
                    ret.Add(new skill_execute()
                    {
                        Priority = fettersc.Priority,
                        execute = () =>
                        {
                            UseFettersSkill(_player);
                        }
                    });
                }
            }

            return ret;
        }

        private bool TriggerSkill(List<shop_event> evs, EMSkillEvent EffectTime)
        {
            foreach(var ev in evs)
            {
                switch (ev.ev)
                {
                    case EMRoleShopEvent.sales:
                    {
                        if (EffectTime == EMSkillEvent.sales && index == ev.index)
                        {
                            return true;
                        }
                        else if (EffectTime == EMSkillEvent.camp_sales && index != ev.index)
                        {
                            return true;
                        }
                    }
                    break;
                    case EMRoleShopEvent.buy:
                    {
                        if (EffectTime == EMSkillEvent.buy)
                        {
                            return true;
                        }
                    }
                    break;
                    case EMRoleShopEvent.update:
                    {
                        if (EffectTime ==EMSkillEvent.update)
                        {
                            return true;
                        }
                    }
                    break;
                    case EMRoleShopEvent.food:
                    {
                        if (EffectTime == EMSkillEvent.eat_food && index == ev.index)
                        {
                            return true;
                        }
                        else if (EffectTime == EMSkillEvent.camp_eat_food && index != ev.index)
                        {
                            return true;
                        }
                    }
                    break;
                    case EMRoleShopEvent.start_round:
                    {
                        if (EffectTime == EMSkillEvent.start_round)
                        {
                            return true;
                        }
                    }
                    break;
                    case EMRoleShopEvent.end_round:
                    {
                        if (EffectTime == EMSkillEvent.end_round)
                        {
                            return true;
                        }
                    }
                    break;
                    case EMRoleShopEvent.syncope:
                    {
                        if (EffectTime == EMSkillEvent.syncope)
                        {
                            return true;
                        }
                    }
                    break;
                }
            }

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

                is_trigger = true;
            }
        }

        private void AddCoin(battle_player _player, int num)
        {
            _player.BattleData.coin += num;
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

        private void UseSkill(battle_player _player)
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

                case SkillEffectEM.AddEquipment:
                {

                }
                break;
            }
        }

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

                target_index = RandomHelper.RandomInt(_player.BattleData.RoleList.Count);
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
