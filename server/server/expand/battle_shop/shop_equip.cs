using Abelkhan;
using config;
using Microsoft.AspNetCore.Routing.Tree;
using System.Collections;
using System.Collections.Generic;
using System.Reflection.Emit;
using static System.Formats.Asn1.AsnWriter;

namespace battle_shop
{
    public partial class shop_skill_role
    {
        private void AddHPProperty(EquipConfig config, battle_shop_player _player, shop_event trigger_ev)
        {
            Log.Log.trace("AddProperty begin");

            var skilleffect = new ShopSkillEffect();
            skilleffect.skill_id = config.Id;
            skilleffect.spellcaster = index;
            skilleffect.recipient = new List<int>();
            skilleffect.effect = SkillEffectEM.AddProperty;

            Log.Log.trace("slill  _player:{0}", Newtonsoft.Json.JsonConvert.SerializeObject(_player));
            var r = _player.BattleData.RoleList[index];
            var Level = r.Level;
            Log.Log.trace("slill r:{0}", r);
            AddProperty(_player, index, EffectScope.WholeGame, config.Value[0], 0);
            skilleffect.value = new List<int>() { config.Value[0], 0 };

            _player.BattleClientCaller.get_client(_player.ClientUUID).shop_skill_effect(skilleffect);
            _player.BattleClientCaller.get_client(_player.ClientUUID).refresh(_player.BattleData, _player.ShopData);
            _player.BattleClientCaller.get_client(_player.ClientUUID).role_add_property(_player.BattleData);

            Log.Log.trace("AddProperty end");
        }

        private void UseEquipSkill(battle_shop_player _player, shop_event trigger_ev, int stage)
        {
            Log.Log.trace("UseEquipSkill equipID:{0} begin!", equipID);

            EquipConfig cfg;
            if (!config.Config.EquipConfigs.TryGetValue(equipID, out cfg))
            {
                return;
            }
            Log.Log.trace("UseEquipSkill equipID:{0} start!", equipID);

            switch (cfg.Effect)
            {
                case 1:
                {
                        AddHPProperty(cfg, _player, trigger_ev);
                }
                break;
            }

            Log.Log.trace("UseSkill skillID:{0} end!", skillID);
        }
    }
}
