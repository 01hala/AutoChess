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
        public Int32 skill_id;
        public ShopSkillEffectEM effect;
        public List<Int32> value;
        public static MsgPack.MessagePackObjectDictionary ShopSkillEffect_to_protcol(ShopSkillEffect _struct){
            var _protocol = new MsgPack.MessagePackObjectDictionary();
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
            var _struct65920e74_e4bd_3add_b5ce_2729ba6c3234 = new ShopSkillEffect();
            foreach (var i in _protocol){
                if (((MsgPack.MessagePackObject)i.Key).AsString() == "skill_id"){
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
    public class shop_client_module : Common.IModule {
        public Client.Client _client_handle;
        public shop_client_module(Client.Client client_handle_) 
        {
            _client_handle = client_handle_;
            _client_handle.modulemanager.add_mothed("shop_client_shop_skill_effect", shop_skill_effect);
            _client_handle.modulemanager.add_mothed("shop_client_refresh", refresh);
        }

        public event Action<ShopSkillEffect> on_shop_skill_effect;
        public void shop_skill_effect(IList<MsgPack.MessagePackObject> inArray){
            var _effect = ShopSkillEffect.protcol_to_ShopSkillEffect(((MsgPack.MessagePackObject)inArray[0]).AsDictionary());
            if (on_shop_skill_effect != null){
                on_shop_skill_effect(_effect);
            }
        }

        public event Action<ShopData> on_refresh;
        public void refresh(IList<MsgPack.MessagePackObject> inArray){
            var _info = ShopData.protcol_to_ShopData(((MsgPack.MessagePackObject)inArray[0]).AsDictionary());
            if (on_refresh != null){
                on_refresh(_info);
            }
        }

    }

}
