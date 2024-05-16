using System;
using System.Collections;
using System.Collections.Generic;
using System.Threading;
using MsgPack.Serialization;

namespace Abelkhan
{
/*this enum code is codegen by abelkhan codegen for c#*/

/*this struct code is codegen by abelkhan codegen for c#*/
    public class RoleSetUp
    {
        public Int32 RoleID;
        public Int32 Level;
        public static MsgPack.MessagePackObjectDictionary RoleSetUp_to_protcol(RoleSetUp _struct){
        if (_struct == null) {
            return null;
        }

            var _protocol = new MsgPack.MessagePackObjectDictionary();
            _protocol.Add("RoleID", _struct.RoleID);
            _protocol.Add("Level", _struct.Level);
            return _protocol;
        }
        public static RoleSetUp protcol_to_RoleSetUp(MsgPack.MessagePackObjectDictionary _protocol){
        if (_protocol == null) {
            return null;
        }

            var _structb74dba06_f215_379e_9ab1_cbf7fac5461e = new RoleSetUp();
            foreach (var i in _protocol){
                if (((MsgPack.MessagePackObject)i.Key).AsString() == "RoleID"){
                    _structb74dba06_f215_379e_9ab1_cbf7fac5461e.RoleID = ((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
                else if (((MsgPack.MessagePackObject)i.Key).AsString() == "Level"){
                    _structb74dba06_f215_379e_9ab1_cbf7fac5461e.Level = ((MsgPack.MessagePackObject)i.Value).AsInt32();
                }
            }
            return _structb74dba06_f215_379e_9ab1_cbf7fac5461e;
        }
    }

/*this module code is codegen by abelkhan codegen for c#*/
    public class gm_set_formation_rsp : Common.Response {
        private string _client_uuid_7fae5a4d_9f93_3cc2_9421_f25db2a4e0b4;
        private UInt64 uuid_7234b97e_ac14_32bc_b5ce_00f2a1185510;
        public gm_set_formation_rsp(string client_uuid, UInt64 _uuid)
        {
            _client_uuid_7fae5a4d_9f93_3cc2_9421_f25db2a4e0b4 = client_uuid;
            uuid_7234b97e_ac14_32bc_b5ce_00f2a1185510 = _uuid;
        }

        public void rsp(){
            var _argv_7fae5a4d_9f93_3cc2_9421_f25db2a4e0b4 = new List<MsgPack.MessagePackObject>();
            _argv_7fae5a4d_9f93_3cc2_9421_f25db2a4e0b4.Add(uuid_7234b97e_ac14_32bc_b5ce_00f2a1185510);
            Hub.Hub._gates.call_client(_client_uuid_7fae5a4d_9f93_3cc2_9421_f25db2a4e0b4, "gm_rsp_cb_set_formation_rsp", _argv_7fae5a4d_9f93_3cc2_9421_f25db2a4e0b4);
        }

        public void err(Int32 err_ad2710a2_3dd2_3a8f_a4c8_a7ebbe1df696){
            var _argv_7fae5a4d_9f93_3cc2_9421_f25db2a4e0b4 = new List<MsgPack.MessagePackObject>();
            _argv_7fae5a4d_9f93_3cc2_9421_f25db2a4e0b4.Add(uuid_7234b97e_ac14_32bc_b5ce_00f2a1185510);
            _argv_7fae5a4d_9f93_3cc2_9421_f25db2a4e0b4.Add(err_ad2710a2_3dd2_3a8f_a4c8_a7ebbe1df696);
            Hub.Hub._gates.call_client(_client_uuid_7fae5a4d_9f93_3cc2_9421_f25db2a4e0b4, "gm_rsp_cb_set_formation_err", _argv_7fae5a4d_9f93_3cc2_9421_f25db2a4e0b4);
        }

    }

    public class gm_module : Common.IModule {
        public gm_module()
        {
            Hub.Hub._modules.add_mothed("gm_set_formation", set_formation);
        }

        public event Action<List<RoleSetUp>, List<RoleSetUp>> on_set_formation;
        public void set_formation(IList<MsgPack.MessagePackObject> inArray){
            var _cb_uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _self = new List<RoleSetUp>();
            var _protocol_arrayself = ((MsgPack.MessagePackObject)inArray[1]).AsList();
            foreach (var v_9d043920_d936_5a24_bb36_334fe3c35b20 in _protocol_arrayself){
                _self.Add(RoleSetUp.protcol_to_RoleSetUp(((MsgPack.MessagePackObject)v_9d043920_d936_5a24_bb36_334fe3c35b20).AsDictionary()));
            }
            var _target = new List<RoleSetUp>();
            var _protocol_arraytarget = ((MsgPack.MessagePackObject)inArray[2]).AsList();
            foreach (var v_61cce653_b4c5_5664_80a0_a7090acc4e68 in _protocol_arraytarget){
                _target.Add(RoleSetUp.protcol_to_RoleSetUp(((MsgPack.MessagePackObject)v_61cce653_b4c5_5664_80a0_a7090acc4e68).AsDictionary()));
            }
            rsp = new gm_set_formation_rsp(Hub.Hub._gates.current_client_uuid, _cb_uuid);
            if (on_set_formation != null){
                on_set_formation(_self, _target);
            }
            rsp = null;
        }

    }
    public class plan_buy_rsp : Common.Response {
        private string _client_uuid_8e620315_ff2a_3f9c_a655_464ce392ed2d;
        private UInt64 uuid_7835a394_6da2_3551_9856_fdfa059cab62;
        public plan_buy_rsp(string client_uuid, UInt64 _uuid)
        {
            _client_uuid_8e620315_ff2a_3f9c_a655_464ce392ed2d = client_uuid;
            uuid_7835a394_6da2_3551_9856_fdfa059cab62 = _uuid;
        }

        public void rsp(UserBattleData battle_info_504125a2_a75d_3fa2_9a35_a9fdc5331928, ShopData shop_info_6355a923_2126_3fd5_b568_e5edf6bd36d0){
            var _argv_8e620315_ff2a_3f9c_a655_464ce392ed2d = new List<MsgPack.MessagePackObject>();
            _argv_8e620315_ff2a_3f9c_a655_464ce392ed2d.Add(uuid_7835a394_6da2_3551_9856_fdfa059cab62);
            _argv_8e620315_ff2a_3f9c_a655_464ce392ed2d.Add(MsgPack.MessagePackObject.FromObject(UserBattleData.UserBattleData_to_protcol(battle_info_504125a2_a75d_3fa2_9a35_a9fdc5331928)));
            _argv_8e620315_ff2a_3f9c_a655_464ce392ed2d.Add(MsgPack.MessagePackObject.FromObject(ShopData.ShopData_to_protcol(shop_info_6355a923_2126_3fd5_b568_e5edf6bd36d0)));
            Hub.Hub._gates.call_client(_client_uuid_8e620315_ff2a_3f9c_a655_464ce392ed2d, "plan_rsp_cb_buy_rsp", _argv_8e620315_ff2a_3f9c_a655_464ce392ed2d);
        }

        public void err(Int32 err_ad2710a2_3dd2_3a8f_a4c8_a7ebbe1df696){
            var _argv_8e620315_ff2a_3f9c_a655_464ce392ed2d = new List<MsgPack.MessagePackObject>();
            _argv_8e620315_ff2a_3f9c_a655_464ce392ed2d.Add(uuid_7835a394_6da2_3551_9856_fdfa059cab62);
            _argv_8e620315_ff2a_3f9c_a655_464ce392ed2d.Add(err_ad2710a2_3dd2_3a8f_a4c8_a7ebbe1df696);
            Hub.Hub._gates.call_client(_client_uuid_8e620315_ff2a_3f9c_a655_464ce392ed2d, "plan_rsp_cb_buy_err", _argv_8e620315_ff2a_3f9c_a655_464ce392ed2d);
        }

    }

    public class plan_move_rsp : Common.Response {
        private string _client_uuid_33efb72e_9227_32af_a058_169be114a277;
        private UInt64 uuid_13629778_9d36_3931_b6d6_acb812bc03ee;
        public plan_move_rsp(string client_uuid, UInt64 _uuid)
        {
            _client_uuid_33efb72e_9227_32af_a058_169be114a277 = client_uuid;
            uuid_13629778_9d36_3931_b6d6_acb812bc03ee = _uuid;
        }

        public void rsp(UserBattleData info_391fd3d4_2d55_3f5e_9223_7f450a814a15){
            var _argv_33efb72e_9227_32af_a058_169be114a277 = new List<MsgPack.MessagePackObject>();
            _argv_33efb72e_9227_32af_a058_169be114a277.Add(uuid_13629778_9d36_3931_b6d6_acb812bc03ee);
            _argv_33efb72e_9227_32af_a058_169be114a277.Add(MsgPack.MessagePackObject.FromObject(UserBattleData.UserBattleData_to_protcol(info_391fd3d4_2d55_3f5e_9223_7f450a814a15)));
            Hub.Hub._gates.call_client(_client_uuid_33efb72e_9227_32af_a058_169be114a277, "plan_rsp_cb_move_rsp", _argv_33efb72e_9227_32af_a058_169be114a277);
        }

        public void err(Int32 err_ad2710a2_3dd2_3a8f_a4c8_a7ebbe1df696){
            var _argv_33efb72e_9227_32af_a058_169be114a277 = new List<MsgPack.MessagePackObject>();
            _argv_33efb72e_9227_32af_a058_169be114a277.Add(uuid_13629778_9d36_3931_b6d6_acb812bc03ee);
            _argv_33efb72e_9227_32af_a058_169be114a277.Add(err_ad2710a2_3dd2_3a8f_a4c8_a7ebbe1df696);
            Hub.Hub._gates.call_client(_client_uuid_33efb72e_9227_32af_a058_169be114a277, "plan_rsp_cb_move_err", _argv_33efb72e_9227_32af_a058_169be114a277);
        }

    }

    public class plan_sale_role_rsp : Common.Response {
        private string _client_uuid_10f3503a_6ca9_31ee_9d35_130ca397965f;
        private UInt64 uuid_eed4a46f_fc06_35f9_98ac_a5d500b93484;
        public plan_sale_role_rsp(string client_uuid, UInt64 _uuid)
        {
            _client_uuid_10f3503a_6ca9_31ee_9d35_130ca397965f = client_uuid;
            uuid_eed4a46f_fc06_35f9_98ac_a5d500b93484 = _uuid;
        }

        public void rsp(UserBattleData info_391fd3d4_2d55_3f5e_9223_7f450a814a15){
            var _argv_10f3503a_6ca9_31ee_9d35_130ca397965f = new List<MsgPack.MessagePackObject>();
            _argv_10f3503a_6ca9_31ee_9d35_130ca397965f.Add(uuid_eed4a46f_fc06_35f9_98ac_a5d500b93484);
            _argv_10f3503a_6ca9_31ee_9d35_130ca397965f.Add(MsgPack.MessagePackObject.FromObject(UserBattleData.UserBattleData_to_protcol(info_391fd3d4_2d55_3f5e_9223_7f450a814a15)));
            Hub.Hub._gates.call_client(_client_uuid_10f3503a_6ca9_31ee_9d35_130ca397965f, "plan_rsp_cb_sale_role_rsp", _argv_10f3503a_6ca9_31ee_9d35_130ca397965f);
        }

        public void err(Int32 err_ad2710a2_3dd2_3a8f_a4c8_a7ebbe1df696){
            var _argv_10f3503a_6ca9_31ee_9d35_130ca397965f = new List<MsgPack.MessagePackObject>();
            _argv_10f3503a_6ca9_31ee_9d35_130ca397965f.Add(uuid_eed4a46f_fc06_35f9_98ac_a5d500b93484);
            _argv_10f3503a_6ca9_31ee_9d35_130ca397965f.Add(err_ad2710a2_3dd2_3a8f_a4c8_a7ebbe1df696);
            Hub.Hub._gates.call_client(_client_uuid_10f3503a_6ca9_31ee_9d35_130ca397965f, "plan_rsp_cb_sale_role_err", _argv_10f3503a_6ca9_31ee_9d35_130ca397965f);
        }

    }

    public class plan_refresh_rsp : Common.Response {
        private string _client_uuid_97f4163d_22be_334a_ad37_ab1f786ceb46;
        private UInt64 uuid_eda10fa8_319d_3f29_8927_072b71272ea7;
        public plan_refresh_rsp(string client_uuid, UInt64 _uuid)
        {
            _client_uuid_97f4163d_22be_334a_ad37_ab1f786ceb46 = client_uuid;
            uuid_eda10fa8_319d_3f29_8927_072b71272ea7 = _uuid;
        }

        public void rsp(ShopData info_391fd3d4_2d55_3f5e_9223_7f450a814a15){
            var _argv_97f4163d_22be_334a_ad37_ab1f786ceb46 = new List<MsgPack.MessagePackObject>();
            _argv_97f4163d_22be_334a_ad37_ab1f786ceb46.Add(uuid_eda10fa8_319d_3f29_8927_072b71272ea7);
            _argv_97f4163d_22be_334a_ad37_ab1f786ceb46.Add(MsgPack.MessagePackObject.FromObject(ShopData.ShopData_to_protcol(info_391fd3d4_2d55_3f5e_9223_7f450a814a15)));
            Hub.Hub._gates.call_client(_client_uuid_97f4163d_22be_334a_ad37_ab1f786ceb46, "plan_rsp_cb_refresh_rsp", _argv_97f4163d_22be_334a_ad37_ab1f786ceb46);
        }

        public void err(Int32 err_ad2710a2_3dd2_3a8f_a4c8_a7ebbe1df696){
            var _argv_97f4163d_22be_334a_ad37_ab1f786ceb46 = new List<MsgPack.MessagePackObject>();
            _argv_97f4163d_22be_334a_ad37_ab1f786ceb46.Add(uuid_eda10fa8_319d_3f29_8927_072b71272ea7);
            _argv_97f4163d_22be_334a_ad37_ab1f786ceb46.Add(err_ad2710a2_3dd2_3a8f_a4c8_a7ebbe1df696);
            Hub.Hub._gates.call_client(_client_uuid_97f4163d_22be_334a_ad37_ab1f786ceb46, "plan_rsp_cb_refresh_err", _argv_97f4163d_22be_334a_ad37_ab1f786ceb46);
        }

    }

    public class plan_freeze_rsp : Common.Response {
        private string _client_uuid_7a949231_d386_34d8_8952_29d48e8ff5ca;
        private UInt64 uuid_df10db92_ca86_3e8a_998c_7c3379106d78;
        public plan_freeze_rsp(string client_uuid, UInt64 _uuid)
        {
            _client_uuid_7a949231_d386_34d8_8952_29d48e8ff5ca = client_uuid;
            uuid_df10db92_ca86_3e8a_998c_7c3379106d78 = _uuid;
        }

        public void rsp(ShopData info_391fd3d4_2d55_3f5e_9223_7f450a814a15){
            var _argv_7a949231_d386_34d8_8952_29d48e8ff5ca = new List<MsgPack.MessagePackObject>();
            _argv_7a949231_d386_34d8_8952_29d48e8ff5ca.Add(uuid_df10db92_ca86_3e8a_998c_7c3379106d78);
            _argv_7a949231_d386_34d8_8952_29d48e8ff5ca.Add(MsgPack.MessagePackObject.FromObject(ShopData.ShopData_to_protcol(info_391fd3d4_2d55_3f5e_9223_7f450a814a15)));
            Hub.Hub._gates.call_client(_client_uuid_7a949231_d386_34d8_8952_29d48e8ff5ca, "plan_rsp_cb_freeze_rsp", _argv_7a949231_d386_34d8_8952_29d48e8ff5ca);
        }

        public void err(Int32 err_ad2710a2_3dd2_3a8f_a4c8_a7ebbe1df696){
            var _argv_7a949231_d386_34d8_8952_29d48e8ff5ca = new List<MsgPack.MessagePackObject>();
            _argv_7a949231_d386_34d8_8952_29d48e8ff5ca.Add(uuid_df10db92_ca86_3e8a_998c_7c3379106d78);
            _argv_7a949231_d386_34d8_8952_29d48e8ff5ca.Add(err_ad2710a2_3dd2_3a8f_a4c8_a7ebbe1df696);
            Hub.Hub._gates.call_client(_client_uuid_7a949231_d386_34d8_8952_29d48e8ff5ca, "plan_rsp_cb_freeze_err", _argv_7a949231_d386_34d8_8952_29d48e8ff5ca);
        }

    }

    public class plan_start_round_rsp : Common.Response {
        private string _client_uuid_a79b5af5_d482_3045_beb1_226490350eb9;
        private UInt64 uuid_97ffaf54_0704_3c31_a7a9_8d8c6a6d2f49;
        public plan_start_round_rsp(string client_uuid, UInt64 _uuid)
        {
            _client_uuid_a79b5af5_d482_3045_beb1_226490350eb9 = client_uuid;
            uuid_97ffaf54_0704_3c31_a7a9_8d8c6a6d2f49 = _uuid;
        }

        public void rsp(UserBattleData self_809515b8_3e31_3feb_a08c_462fee09f6ef, UserBattleData target_2cf141ee_a36d_3d58_a9b6_a4febe931c68){
            var _argv_a79b5af5_d482_3045_beb1_226490350eb9 = new List<MsgPack.MessagePackObject>();
            _argv_a79b5af5_d482_3045_beb1_226490350eb9.Add(uuid_97ffaf54_0704_3c31_a7a9_8d8c6a6d2f49);
            _argv_a79b5af5_d482_3045_beb1_226490350eb9.Add(MsgPack.MessagePackObject.FromObject(UserBattleData.UserBattleData_to_protcol(self_809515b8_3e31_3feb_a08c_462fee09f6ef)));
            _argv_a79b5af5_d482_3045_beb1_226490350eb9.Add(MsgPack.MessagePackObject.FromObject(UserBattleData.UserBattleData_to_protcol(target_2cf141ee_a36d_3d58_a9b6_a4febe931c68)));
            Hub.Hub._gates.call_client(_client_uuid_a79b5af5_d482_3045_beb1_226490350eb9, "plan_rsp_cb_start_round_rsp", _argv_a79b5af5_d482_3045_beb1_226490350eb9);
        }

        public void err(Int32 err_ad2710a2_3dd2_3a8f_a4c8_a7ebbe1df696){
            var _argv_a79b5af5_d482_3045_beb1_226490350eb9 = new List<MsgPack.MessagePackObject>();
            _argv_a79b5af5_d482_3045_beb1_226490350eb9.Add(uuid_97ffaf54_0704_3c31_a7a9_8d8c6a6d2f49);
            _argv_a79b5af5_d482_3045_beb1_226490350eb9.Add(err_ad2710a2_3dd2_3a8f_a4c8_a7ebbe1df696);
            Hub.Hub._gates.call_client(_client_uuid_a79b5af5_d482_3045_beb1_226490350eb9, "plan_rsp_cb_start_round_err", _argv_a79b5af5_d482_3045_beb1_226490350eb9);
        }

    }

    public class plan_start_round1_rsp : Common.Response {
        private string _client_uuid_f14f1f61_44e1_3119_8561_5f13515b6af0;
        private UInt64 uuid_00ecd647_4e78_3166_a425_8232dffaf8f7;
        public plan_start_round1_rsp(string client_uuid, UInt64 _uuid)
        {
            _client_uuid_f14f1f61_44e1_3119_8561_5f13515b6af0 = client_uuid;
            uuid_00ecd647_4e78_3166_a425_8232dffaf8f7 = _uuid;
        }

        public void rsp(UserBattleData self_809515b8_3e31_3feb_a08c_462fee09f6ef, UserBattleData target_2cf141ee_a36d_3d58_a9b6_a4febe931c68){
            var _argv_f14f1f61_44e1_3119_8561_5f13515b6af0 = new List<MsgPack.MessagePackObject>();
            _argv_f14f1f61_44e1_3119_8561_5f13515b6af0.Add(uuid_00ecd647_4e78_3166_a425_8232dffaf8f7);
            _argv_f14f1f61_44e1_3119_8561_5f13515b6af0.Add(MsgPack.MessagePackObject.FromObject(UserBattleData.UserBattleData_to_protcol(self_809515b8_3e31_3feb_a08c_462fee09f6ef)));
            _argv_f14f1f61_44e1_3119_8561_5f13515b6af0.Add(MsgPack.MessagePackObject.FromObject(UserBattleData.UserBattleData_to_protcol(target_2cf141ee_a36d_3d58_a9b6_a4febe931c68)));
            Hub.Hub._gates.call_client(_client_uuid_f14f1f61_44e1_3119_8561_5f13515b6af0, "plan_rsp_cb_start_round1_rsp", _argv_f14f1f61_44e1_3119_8561_5f13515b6af0);
        }

        public void err(Int32 err_ad2710a2_3dd2_3a8f_a4c8_a7ebbe1df696){
            var _argv_f14f1f61_44e1_3119_8561_5f13515b6af0 = new List<MsgPack.MessagePackObject>();
            _argv_f14f1f61_44e1_3119_8561_5f13515b6af0.Add(uuid_00ecd647_4e78_3166_a425_8232dffaf8f7);
            _argv_f14f1f61_44e1_3119_8561_5f13515b6af0.Add(err_ad2710a2_3dd2_3a8f_a4c8_a7ebbe1df696);
            Hub.Hub._gates.call_client(_client_uuid_f14f1f61_44e1_3119_8561_5f13515b6af0, "plan_rsp_cb_start_round1_err", _argv_f14f1f61_44e1_3119_8561_5f13515b6af0);
        }

    }

    public class plan_confirm_round_victory_rsp : Common.Response {
        private string _client_uuid_22132c31_7fe4_3f20_affe_f0c3ca2172f0;
        private UInt64 uuid_b097a393_cca0_3faf_84e2_071bbf305285;
        public plan_confirm_round_victory_rsp(string client_uuid, UInt64 _uuid)
        {
            _client_uuid_22132c31_7fe4_3f20_affe_f0c3ca2172f0 = client_uuid;
            uuid_b097a393_cca0_3faf_84e2_071bbf305285 = _uuid;
        }

        public void rsp(){
            var _argv_22132c31_7fe4_3f20_affe_f0c3ca2172f0 = new List<MsgPack.MessagePackObject>();
            _argv_22132c31_7fe4_3f20_affe_f0c3ca2172f0.Add(uuid_b097a393_cca0_3faf_84e2_071bbf305285);
            Hub.Hub._gates.call_client(_client_uuid_22132c31_7fe4_3f20_affe_f0c3ca2172f0, "plan_rsp_cb_confirm_round_victory_rsp", _argv_22132c31_7fe4_3f20_affe_f0c3ca2172f0);
        }

        public void err(){
            var _argv_22132c31_7fe4_3f20_affe_f0c3ca2172f0 = new List<MsgPack.MessagePackObject>();
            _argv_22132c31_7fe4_3f20_affe_f0c3ca2172f0.Add(uuid_b097a393_cca0_3faf_84e2_071bbf305285);
            Hub.Hub._gates.call_client(_client_uuid_22132c31_7fe4_3f20_affe_f0c3ca2172f0, "plan_rsp_cb_confirm_round_victory_err", _argv_22132c31_7fe4_3f20_affe_f0c3ca2172f0);
        }

    }

    public class plan_get_battle_data_rsp : Common.Response {
        private string _client_uuid_3d073eb1_819d_3da0_99ac_ac4f24f7d6a2;
        private UInt64 uuid_56d4d0ed_9f6b_3849_9251_bc4c53704cbd;
        public plan_get_battle_data_rsp(string client_uuid, UInt64 _uuid)
        {
            _client_uuid_3d073eb1_819d_3da0_99ac_ac4f24f7d6a2 = client_uuid;
            uuid_56d4d0ed_9f6b_3849_9251_bc4c53704cbd = _uuid;
        }

        public void rsp(UserBattleData battle_info_504125a2_a75d_3fa2_9a35_a9fdc5331928, ShopData shop_info_6355a923_2126_3fd5_b568_e5edf6bd36d0, List<Fetters> fetters_info_2465681a_a205_3e91_8b5b_a53cd2e8b9dc){
            var _argv_3d073eb1_819d_3da0_99ac_ac4f24f7d6a2 = new List<MsgPack.MessagePackObject>();
            _argv_3d073eb1_819d_3da0_99ac_ac4f24f7d6a2.Add(uuid_56d4d0ed_9f6b_3849_9251_bc4c53704cbd);
            _argv_3d073eb1_819d_3da0_99ac_ac4f24f7d6a2.Add(MsgPack.MessagePackObject.FromObject(UserBattleData.UserBattleData_to_protcol(battle_info_504125a2_a75d_3fa2_9a35_a9fdc5331928)));
            _argv_3d073eb1_819d_3da0_99ac_ac4f24f7d6a2.Add(MsgPack.MessagePackObject.FromObject(ShopData.ShopData_to_protcol(shop_info_6355a923_2126_3fd5_b568_e5edf6bd36d0)));
            var _array_2465681a_a205_3e91_8b5b_a53cd2e8b9dc = new List<MsgPack.MessagePackObject>();
            foreach(var v_096776fa_67e9_5066_90ca_647b76dcad2e in fetters_info_2465681a_a205_3e91_8b5b_a53cd2e8b9dc){
                _array_2465681a_a205_3e91_8b5b_a53cd2e8b9dc.Add(MsgPack.MessagePackObject.FromObject(Fetters.Fetters_to_protcol(v_096776fa_67e9_5066_90ca_647b76dcad2e)));
            }
            _argv_3d073eb1_819d_3da0_99ac_ac4f24f7d6a2.Add(MsgPack.MessagePackObject.FromObject(_array_2465681a_a205_3e91_8b5b_a53cd2e8b9dc));
            Hub.Hub._gates.call_client(_client_uuid_3d073eb1_819d_3da0_99ac_ac4f24f7d6a2, "plan_rsp_cb_get_battle_data_rsp", _argv_3d073eb1_819d_3da0_99ac_ac4f24f7d6a2);
        }

        public void err(){
            var _argv_3d073eb1_819d_3da0_99ac_ac4f24f7d6a2 = new List<MsgPack.MessagePackObject>();
            _argv_3d073eb1_819d_3da0_99ac_ac4f24f7d6a2.Add(uuid_56d4d0ed_9f6b_3849_9251_bc4c53704cbd);
            Hub.Hub._gates.call_client(_client_uuid_3d073eb1_819d_3da0_99ac_ac4f24f7d6a2, "plan_rsp_cb_get_battle_data_err", _argv_3d073eb1_819d_3da0_99ac_ac4f24f7d6a2);
        }

    }

    public class plan_module : Common.IModule {
        public plan_module()
        {
            Hub.Hub._modules.add_mothed("plan_buy", buy);
            Hub.Hub._modules.add_mothed("plan_move", move);
            Hub.Hub._modules.add_mothed("plan_sale_role", sale_role);
            Hub.Hub._modules.add_mothed("plan_refresh", refresh);
            Hub.Hub._modules.add_mothed("plan_freeze", freeze);
            Hub.Hub._modules.add_mothed("plan_start_round", start_round);
            Hub.Hub._modules.add_mothed("plan_start_round1", start_round1);
            Hub.Hub._modules.add_mothed("plan_confirm_round_victory", confirm_round_victory);
            Hub.Hub._modules.add_mothed("plan_get_battle_data", get_battle_data);
        }

        public event Action<ShopIndex, Int32, Int32> on_buy;
        public void buy(IList<MsgPack.MessagePackObject> inArray){
            var _cb_uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _shop_index = (ShopIndex)((MsgPack.MessagePackObject)inArray[1]).AsInt32();
            var _index = ((MsgPack.MessagePackObject)inArray[2]).AsInt32();
            var _role_index = ((MsgPack.MessagePackObject)inArray[3]).AsInt32();
            rsp = new plan_buy_rsp(Hub.Hub._gates.current_client_uuid, _cb_uuid);
            if (on_buy != null){
                on_buy(_shop_index, _index, _role_index);
            }
            rsp = null;
        }

        public event Action<Int32, Int32> on_move;
        public void move(IList<MsgPack.MessagePackObject> inArray){
            var _cb_uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _role1_index = ((MsgPack.MessagePackObject)inArray[1]).AsInt32();
            var _role2_index = ((MsgPack.MessagePackObject)inArray[2]).AsInt32();
            rsp = new plan_move_rsp(Hub.Hub._gates.current_client_uuid, _cb_uuid);
            if (on_move != null){
                on_move(_role1_index, _role2_index);
            }
            rsp = null;
        }

        public event Action<Int32> on_sale_role;
        public void sale_role(IList<MsgPack.MessagePackObject> inArray){
            var _cb_uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _index = ((MsgPack.MessagePackObject)inArray[1]).AsInt32();
            rsp = new plan_sale_role_rsp(Hub.Hub._gates.current_client_uuid, _cb_uuid);
            if (on_sale_role != null){
                on_sale_role(_index);
            }
            rsp = null;
        }

        public event Action on_refresh;
        public void refresh(IList<MsgPack.MessagePackObject> inArray){
            var _cb_uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            rsp = new plan_refresh_rsp(Hub.Hub._gates.current_client_uuid, _cb_uuid);
            if (on_refresh != null){
                on_refresh();
            }
            rsp = null;
        }

        public event Action<ShopIndex, Int32, bool> on_freeze;
        public void freeze(IList<MsgPack.MessagePackObject> inArray){
            var _cb_uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _shop_index = (ShopIndex)((MsgPack.MessagePackObject)inArray[1]).AsInt32();
            var _index = ((MsgPack.MessagePackObject)inArray[2]).AsInt32();
            var _is_freeze = ((MsgPack.MessagePackObject)inArray[3]).AsBoolean();
            rsp = new plan_freeze_rsp(Hub.Hub._gates.current_client_uuid, _cb_uuid);
            if (on_freeze != null){
                on_freeze(_shop_index, _index, _is_freeze);
            }
            rsp = null;
        }

        public event Action on_start_round;
        public void start_round(IList<MsgPack.MessagePackObject> inArray){
            var _cb_uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            rsp = new plan_start_round_rsp(Hub.Hub._gates.current_client_uuid, _cb_uuid);
            if (on_start_round != null){
                on_start_round();
            }
            rsp = null;
        }

        public event Action on_start_round1;
        public void start_round1(IList<MsgPack.MessagePackObject> inArray){
            var _cb_uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            rsp = new plan_start_round1_rsp(Hub.Hub._gates.current_client_uuid, _cb_uuid);
            if (on_start_round1 != null){
                on_start_round1();
            }
            rsp = null;
        }

        public event Action<BattleVictory> on_confirm_round_victory;
        public void confirm_round_victory(IList<MsgPack.MessagePackObject> inArray){
            var _cb_uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _is_victory = (BattleVictory)((MsgPack.MessagePackObject)inArray[1]).AsInt32();
            rsp = new plan_confirm_round_victory_rsp(Hub.Hub._gates.current_client_uuid, _cb_uuid);
            if (on_confirm_round_victory != null){
                on_confirm_round_victory(_is_victory);
            }
            rsp = null;
        }

        public event Action on_get_battle_data;
        public void get_battle_data(IList<MsgPack.MessagePackObject> inArray){
            var _cb_uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            rsp = new plan_get_battle_data_rsp(Hub.Hub._gates.current_client_uuid, _cb_uuid);
            if (on_get_battle_data != null){
                on_get_battle_data();
            }
            rsp = null;
        }

    }
    public class peak_strength_start_peak_strength_rsp : Common.Response {
        private string _client_uuid_604bcc66_d0b2_3376_8454_39a206b26543;
        private UInt64 uuid_469c67c5_686b_3b18_b93f_b1ae9f231dac;
        public peak_strength_start_peak_strength_rsp(string client_uuid, UInt64 _uuid)
        {
            _client_uuid_604bcc66_d0b2_3376_8454_39a206b26543 = client_uuid;
            uuid_469c67c5_686b_3b18_b93f_b1ae9f231dac = _uuid;
        }

        public void rsp(UserBattleData self_809515b8_3e31_3feb_a08c_462fee09f6ef, UserBattleData target_2cf141ee_a36d_3d58_a9b6_a4febe931c68){
            var _argv_604bcc66_d0b2_3376_8454_39a206b26543 = new List<MsgPack.MessagePackObject>();
            _argv_604bcc66_d0b2_3376_8454_39a206b26543.Add(uuid_469c67c5_686b_3b18_b93f_b1ae9f231dac);
            _argv_604bcc66_d0b2_3376_8454_39a206b26543.Add(MsgPack.MessagePackObject.FromObject(UserBattleData.UserBattleData_to_protcol(self_809515b8_3e31_3feb_a08c_462fee09f6ef)));
            _argv_604bcc66_d0b2_3376_8454_39a206b26543.Add(MsgPack.MessagePackObject.FromObject(UserBattleData.UserBattleData_to_protcol(target_2cf141ee_a36d_3d58_a9b6_a4febe931c68)));
            Hub.Hub._gates.call_client(_client_uuid_604bcc66_d0b2_3376_8454_39a206b26543, "peak_strength_rsp_cb_start_peak_strength_rsp", _argv_604bcc66_d0b2_3376_8454_39a206b26543);
        }

        public void err(Int32 err_ad2710a2_3dd2_3a8f_a4c8_a7ebbe1df696){
            var _argv_604bcc66_d0b2_3376_8454_39a206b26543 = new List<MsgPack.MessagePackObject>();
            _argv_604bcc66_d0b2_3376_8454_39a206b26543.Add(uuid_469c67c5_686b_3b18_b93f_b1ae9f231dac);
            _argv_604bcc66_d0b2_3376_8454_39a206b26543.Add(err_ad2710a2_3dd2_3a8f_a4c8_a7ebbe1df696);
            Hub.Hub._gates.call_client(_client_uuid_604bcc66_d0b2_3376_8454_39a206b26543, "peak_strength_rsp_cb_start_peak_strength_err", _argv_604bcc66_d0b2_3376_8454_39a206b26543);
        }

    }

    public class peak_strength_confirm_peak_strength_victory_rsp : Common.Response {
        private string _client_uuid_cd0e12ec_961a_34c5_9b39_4941f3e29bc9;
        private UInt64 uuid_f2057b5c_43cc_334e_80e3_ff7330dbbe77;
        public peak_strength_confirm_peak_strength_victory_rsp(string client_uuid, UInt64 _uuid)
        {
            _client_uuid_cd0e12ec_961a_34c5_9b39_4941f3e29bc9 = client_uuid;
            uuid_f2057b5c_43cc_334e_80e3_ff7330dbbe77 = _uuid;
        }

        public void rsp(){
            var _argv_cd0e12ec_961a_34c5_9b39_4941f3e29bc9 = new List<MsgPack.MessagePackObject>();
            _argv_cd0e12ec_961a_34c5_9b39_4941f3e29bc9.Add(uuid_f2057b5c_43cc_334e_80e3_ff7330dbbe77);
            Hub.Hub._gates.call_client(_client_uuid_cd0e12ec_961a_34c5_9b39_4941f3e29bc9, "peak_strength_rsp_cb_confirm_peak_strength_victory_rsp", _argv_cd0e12ec_961a_34c5_9b39_4941f3e29bc9);
        }

        public void err(){
            var _argv_cd0e12ec_961a_34c5_9b39_4941f3e29bc9 = new List<MsgPack.MessagePackObject>();
            _argv_cd0e12ec_961a_34c5_9b39_4941f3e29bc9.Add(uuid_f2057b5c_43cc_334e_80e3_ff7330dbbe77);
            Hub.Hub._gates.call_client(_client_uuid_cd0e12ec_961a_34c5_9b39_4941f3e29bc9, "peak_strength_rsp_cb_confirm_peak_strength_victory_err", _argv_cd0e12ec_961a_34c5_9b39_4941f3e29bc9);
        }

    }

    public class peak_strength_module : Common.IModule {
        public peak_strength_module()
        {
            Hub.Hub._modules.add_mothed("peak_strength_start_peak_strength", start_peak_strength);
            Hub.Hub._modules.add_mothed("peak_strength_confirm_peak_strength_victory", confirm_peak_strength_victory);
        }

        public event Action on_start_peak_strength;
        public void start_peak_strength(IList<MsgPack.MessagePackObject> inArray){
            var _cb_uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            rsp = new peak_strength_start_peak_strength_rsp(Hub.Hub._gates.current_client_uuid, _cb_uuid);
            if (on_start_peak_strength != null){
                on_start_peak_strength();
            }
            rsp = null;
        }

        public event Action<BattleVictory> on_confirm_peak_strength_victory;
        public void confirm_peak_strength_victory(IList<MsgPack.MessagePackObject> inArray){
            var _cb_uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _is_victory = (BattleVictory)((MsgPack.MessagePackObject)inArray[1]).AsInt32();
            rsp = new peak_strength_confirm_peak_strength_victory_rsp(Hub.Hub._gates.current_client_uuid, _cb_uuid);
            if (on_confirm_peak_strength_victory != null){
                on_confirm_peak_strength_victory(_is_victory);
            }
            rsp = null;
        }

    }

}
