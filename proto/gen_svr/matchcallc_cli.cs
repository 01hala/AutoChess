using System;
using System.Collections;
using System.Collections.Generic;
using System.Threading;
using MsgPack.Serialization;

namespace Abelkhan
{
/*this enum code is codegen by abelkhan codegen for c#*/

/*this struct code is codegen by abelkhan codegen for c#*/
    public class ShopSkillEffect
    {
        public Int32 spellcaster;
        public List<Int32> recipient;
        public Int32 skill_id;
        public ShopSkillEffectEM effect;
        public List<Int32> value;
        public static MsgPack.MessagePackObjectDictionary ShopSkillEffect_to_protcol(ShopSkillEffect _struct){
        if (_struct == null) {
            return null;
        }

            var _protocol = new MsgPack.MessagePackObjectDictionary();
            _protocol.Add("spellcaster", _struct.spellcaster);
            if (_struct.recipient != null) {
                var _array_recipient = new List<MsgPack.MessagePackObject>();
                foreach(var v_ in _struct.recipient){
                    _array_recipient.Add(v_);
                }
                _protocol.Add("recipient", new MsgPack.MessagePackObject(_array_recipient));
            }
            _protocol.Add("skill_id", _struct.skill_id);
            _protocol.Add("effect", (Int32)_struct.effect);
            if (_struct.value != null) {
                var _array_value = new List<MsgPack.MessagePackObject>();
                foreach(var v_ in _struct.value){
                    _array_value.Add(v_);
                }
                _protocol.Add("value", new MsgPack.MessagePackObject(_array_value));
            }
            return _protocol;
        }
        public static ShopSkillEffect protcol_to_ShopSkillEffect(MsgPack.MessagePackObjectDictionary _protocol){
        if (_protocol == null) {
            return null;
        }

            var _struct65920e74_e4bd_3add_b5ce_2729ba6c3234 = new ShopSkillEffect();
            foreach (var i in _protocol){
                if (((MsgPack.MessagePackObject)i.Key).AsString() == "spellcaster"){
                    _struct65920e74_e4bd_3add_b5ce_2729ba6c3234.spellcaster = ((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "recipient"){
                    _struct65920e74_e4bd_3add_b5ce_2729ba6c3234.recipient = new List<Int32>();
                    var _protocol_array = ((MsgPack.MessagePackObject)i.Value).AsList();
                    foreach (var v_ in _protocol_array){
                        _struct65920e74_e4bd_3add_b5ce_2729ba6c3234.recipient.Add(((MsgPack.MessagePackObject)v_).AsInt32());
                    }
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "skill_id"){
                    _struct65920e74_e4bd_3add_b5ce_2729ba6c3234.skill_id = ((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "effect"){
                    _struct65920e74_e4bd_3add_b5ce_2729ba6c3234.effect = (ShopSkillEffectEM)((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "value"){
                    _struct65920e74_e4bd_3add_b5ce_2729ba6c3234.value = new List<Int32>();
                    var _protocol_array = ((MsgPack.MessagePackObject)i.Value).AsList();
                    foreach (var v_ in _protocol_array){
                        _struct65920e74_e4bd_3add_b5ce_2729ba6c3234.value.Add(((MsgPack.MessagePackObject)v_).AsInt32());
                    }
                }
            }
            return _struct65920e74_e4bd_3add_b5ce_2729ba6c3234;
        }
    }

/*this module code is codegen by abelkhan codegen for c#*/
    public class battle_client_module : Common.IModule {
        public Client.Client _client_handle;
        public battle_client_module(Client.Client client_handle_) 
        {
            _client_handle = client_handle_;
            _client_handle.modulemanager.add_mothed("battle_client_battle_victory", battle_victory);
            _client_handle.modulemanager.add_mothed("battle_client_battle_plan_refresh", battle_plan_refresh);
            _client_handle.modulemanager.add_mothed("battle_client_shop_skill_effect", shop_skill_effect);
            _client_handle.modulemanager.add_mothed("battle_client_refresh", refresh);
            _client_handle.modulemanager.add_mothed("battle_client_role_buy_merge", role_buy_merge);
            _client_handle.modulemanager.add_mothed("battle_client_role_merge", role_merge);
            _client_handle.modulemanager.add_mothed("battle_client_role_eat_food", role_eat_food);
        }

        public event Action<bool> on_battle_victory;
        public void battle_victory(IList<MsgPack.MessagePackObject> inArray){
            var _is_victory = ((MsgPack.MessagePackObject)inArray[0]).AsBoolean();
            if (on_battle_victory != null){
                on_battle_victory(_is_victory);
            }
        }

        public event Action<UserBattleData, ShopData> on_battle_plan_refresh;
        public void battle_plan_refresh(IList<MsgPack.MessagePackObject> inArray){
            var _battle_info = UserBattleData.protcol_to_UserBattleData(((MsgPack.MessagePackObject)inArray[0]).AsDictionary());
            var _shop_info = ShopData.protcol_to_ShopData(((MsgPack.MessagePackObject)inArray[1]).AsDictionary());
            if (on_battle_plan_refresh != null){
                on_battle_plan_refresh(_battle_info, _shop_info);
            }
        }

        public event Action<ShopSkillEffect> on_shop_skill_effect;
        public void shop_skill_effect(IList<MsgPack.MessagePackObject> inArray){
            var _effect = ShopSkillEffect.protcol_to_ShopSkillEffect(((MsgPack.MessagePackObject)inArray[0]).AsDictionary());
            if (on_shop_skill_effect != null){
                on_shop_skill_effect(_effect);
            }
        }

        public event Action<UserBattleData, ShopData> on_refresh;
        public void refresh(IList<MsgPack.MessagePackObject> inArray){
            var _battle_info = UserBattleData.protcol_to_UserBattleData(((MsgPack.MessagePackObject)inArray[0]).AsDictionary());
            var _info = ShopData.protcol_to_ShopData(((MsgPack.MessagePackObject)inArray[1]).AsDictionary());
            if (on_refresh != null){
                on_refresh(_battle_info, _info);
            }
        }

        public event Action<Int32, Role, bool> on_role_buy_merge;
        public void role_buy_merge(IList<MsgPack.MessagePackObject> inArray){
            var _target_role_index = ((MsgPack.MessagePackObject)inArray[0]).AsInt32();
            var _target_role = Role.protcol_to_Role(((MsgPack.MessagePackObject)inArray[1]).AsDictionary());
            var _is_update = ((MsgPack.MessagePackObject)inArray[2]).AsBoolean();
            if (on_role_buy_merge != null){
                on_role_buy_merge(_target_role_index, _target_role, _is_update);
            }
        }

        public event Action<Int32, Int32, Role, bool> on_role_merge;
        public void role_merge(IList<MsgPack.MessagePackObject> inArray){
            var _source_role_index = ((MsgPack.MessagePackObject)inArray[0]).AsInt32();
            var _target_role_index = ((MsgPack.MessagePackObject)inArray[1]).AsInt32();
            var _target_role = Role.protcol_to_Role(((MsgPack.MessagePackObject)inArray[2]).AsDictionary());
            var _is_update = ((MsgPack.MessagePackObject)inArray[3]).AsBoolean();
            if (on_role_merge != null){
                on_role_merge(_source_role_index, _target_role_index, _target_role, _is_update);
            }
        }

        public event Action<Int32, Int32, Role, bool> on_role_eat_food;
        public void role_eat_food(IList<MsgPack.MessagePackObject> inArray){
            var __id = ((MsgPack.MessagePackObject)inArray[0]).AsInt32();
            var _target_role_index = ((MsgPack.MessagePackObject)inArray[1]).AsInt32();
            var _target_role = Role.protcol_to_Role(((MsgPack.MessagePackObject)inArray[2]).AsDictionary());
            var _is_update = ((MsgPack.MessagePackObject)inArray[3]).AsBoolean();
            if (on_role_eat_food != null){
                on_role_eat_food(__id, _target_role_index, _target_role, _is_update);
            }
        }

    }

}
