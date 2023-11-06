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
    public class shop_client_rsp_cb : Common.IModule {
        public shop_client_rsp_cb() 
        {
        }

    }

    public class shop_client_clientproxy {
        public string client_uuid_e5452469_9f69_3091_b3a7_a731f3b03301;
        private Int32 uuid_e5452469_9f69_3091_b3a7_a731f3b03301 = (Int32)RandomUUID.random();

        public shop_client_rsp_cb rsp_cb_shop_client_handle;

        public shop_client_clientproxy(shop_client_rsp_cb rsp_cb_shop_client_handle_)
        {
            rsp_cb_shop_client_handle = rsp_cb_shop_client_handle_;
        }

        public void shop_skill_effect(ShopSkillEffect effect){
            var _argv_c0363c29_389e_36d3_b41f_f37d9a21bfc8 = new ArrayList();
            _argv_c0363c29_389e_36d3_b41f_f37d9a21bfc8.Add(ShopSkillEffect.ShopSkillEffect_to_protcol(effect));
            Hub.Hub._gates.call_client(client_uuid_e5452469_9f69_3091_b3a7_a731f3b03301, "shop_client_shop_skill_effect", _argv_c0363c29_389e_36d3_b41f_f37d9a21bfc8);
        }

        public void refresh(ShopData info){
            var _argv_97f4163d_22be_334a_ad37_ab1f786ceb46 = new ArrayList();
            _argv_97f4163d_22be_334a_ad37_ab1f786ceb46.Add(ShopData.ShopData_to_protcol(info));
            Hub.Hub._gates.call_client(client_uuid_e5452469_9f69_3091_b3a7_a731f3b03301, "shop_client_refresh", _argv_97f4163d_22be_334a_ad37_ab1f786ceb46);
        }

    }

    public class shop_client_multicast {
        public List<string> client_uuids_e5452469_9f69_3091_b3a7_a731f3b03301;
        public shop_client_rsp_cb rsp_cb_shop_client_handle;

        public shop_client_multicast(shop_client_rsp_cb rsp_cb_shop_client_handle_)
        {
            rsp_cb_shop_client_handle = rsp_cb_shop_client_handle_;
        }

    }

    public class shop_client_broadcast {
        public shop_client_rsp_cb rsp_cb_shop_client_handle;

        public shop_client_broadcast(shop_client_rsp_cb rsp_cb_shop_client_handle_)
        {
            rsp_cb_shop_client_handle = rsp_cb_shop_client_handle_;
        }

    }

    public class shop_client_caller {
        public static shop_client_rsp_cb rsp_cb_shop_client_handle = null;
        private ThreadLocal<shop_client_clientproxy> _clientproxy;
        private ThreadLocal<shop_client_multicast> _multicast;
        private shop_client_broadcast _broadcast;

        public shop_client_caller() 
        {
            if (rsp_cb_shop_client_handle == null)
            {
                rsp_cb_shop_client_handle = new shop_client_rsp_cb();
            }

            _clientproxy = new ThreadLocal<shop_client_clientproxy>();
            _multicast = new ThreadLocal<shop_client_multicast>();
            _broadcast = new shop_client_broadcast(rsp_cb_shop_client_handle);
        }

        public shop_client_clientproxy get_client(string client_uuid) {
            if (_clientproxy.Value == null)
{
                _clientproxy.Value = new shop_client_clientproxy(rsp_cb_shop_client_handle);
            }
            _clientproxy.Value.client_uuid_e5452469_9f69_3091_b3a7_a731f3b03301 = client_uuid;
            return _clientproxy.Value;
        }

        public shop_client_multicast get_multicast(List<string> client_uuids) {
            if (_multicast.Value == null)
{
                _multicast.Value = new shop_client_multicast(rsp_cb_shop_client_handle);
            }
            _multicast.Value.client_uuids_e5452469_9f69_3091_b3a7_a731f3b03301 = client_uuids;
            return _multicast.Value;
        }

        public shop_client_broadcast get_broadcast() {
            return _broadcast;
        }
    }


}
