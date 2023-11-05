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

/*this caller code is codegen by abelkhan codegen for c#*/
/*this cb code is codegen by abelkhan for c#*/
    public class shop_skill_effect_rsp_cb : Common.IModule {
        public shop_skill_effect_rsp_cb() 
        {
        }

    }

    public class shop_skill_effect_clientproxy {
        public string client_uuid_c0363c29_389e_36d3_b41f_f37d9a21bfc8;
        private Int32 uuid_c0363c29_389e_36d3_b41f_f37d9a21bfc8 = (Int32)RandomUUID.random();

        public shop_skill_effect_rsp_cb rsp_cb_shop_skill_effect_handle;

        public shop_skill_effect_clientproxy(shop_skill_effect_rsp_cb rsp_cb_shop_skill_effect_handle_)
        {
            rsp_cb_shop_skill_effect_handle = rsp_cb_shop_skill_effect_handle_;
        }

        public void shop_skill_effect(ShopSkillEffect effect){
            var _argv_c0363c29_389e_36d3_b41f_f37d9a21bfc8 = new ArrayList();
            _argv_c0363c29_389e_36d3_b41f_f37d9a21bfc8.Add(ShopSkillEffect.ShopSkillEffect_to_protcol(effect));
            Hub.Hub._gates.call_client(client_uuid_c0363c29_389e_36d3_b41f_f37d9a21bfc8, "shop_skill_effect_shop_skill_effect", _argv_c0363c29_389e_36d3_b41f_f37d9a21bfc8);
        }

    }

    public class shop_skill_effect_multicast {
        public List<string> client_uuids_c0363c29_389e_36d3_b41f_f37d9a21bfc8;
        public shop_skill_effect_rsp_cb rsp_cb_shop_skill_effect_handle;

        public shop_skill_effect_multicast(shop_skill_effect_rsp_cb rsp_cb_shop_skill_effect_handle_)
        {
            rsp_cb_shop_skill_effect_handle = rsp_cb_shop_skill_effect_handle_;
        }

    }

    public class shop_skill_effect_broadcast {
        public shop_skill_effect_rsp_cb rsp_cb_shop_skill_effect_handle;

        public shop_skill_effect_broadcast(shop_skill_effect_rsp_cb rsp_cb_shop_skill_effect_handle_)
        {
            rsp_cb_shop_skill_effect_handle = rsp_cb_shop_skill_effect_handle_;
        }

    }

    public class shop_skill_effect_caller {
        public static shop_skill_effect_rsp_cb rsp_cb_shop_skill_effect_handle = null;
        private ThreadLocal<shop_skill_effect_clientproxy> _clientproxy;
        private ThreadLocal<shop_skill_effect_multicast> _multicast;
        private shop_skill_effect_broadcast _broadcast;

        public shop_skill_effect_caller() 
        {
            if (rsp_cb_shop_skill_effect_handle == null)
            {
                rsp_cb_shop_skill_effect_handle = new shop_skill_effect_rsp_cb();
            }

            _clientproxy = new ThreadLocal<shop_skill_effect_clientproxy>();
            _multicast = new ThreadLocal<shop_skill_effect_multicast>();
            _broadcast = new shop_skill_effect_broadcast(rsp_cb_shop_skill_effect_handle);
        }

        public shop_skill_effect_clientproxy get_client(string client_uuid) {
            if (_clientproxy.Value == null)
{
                _clientproxy.Value = new shop_skill_effect_clientproxy(rsp_cb_shop_skill_effect_handle);
            }
            _clientproxy.Value.client_uuid_c0363c29_389e_36d3_b41f_f37d9a21bfc8 = client_uuid;
            return _clientproxy.Value;
        }

        public shop_skill_effect_multicast get_multicast(List<string> client_uuids) {
            if (_multicast.Value == null)
{
                _multicast.Value = new shop_skill_effect_multicast(rsp_cb_shop_skill_effect_handle);
            }
            _multicast.Value.client_uuids_c0363c29_389e_36d3_b41f_f37d9a21bfc8 = client_uuids;
            return _multicast.Value;
        }

        public shop_skill_effect_broadcast get_broadcast() {
            return _broadcast;
        }
    }


}
