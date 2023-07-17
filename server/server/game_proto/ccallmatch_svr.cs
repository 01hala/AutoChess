using System;
using System.Collections;
using System.Collections.Generic;
using System.Threading;
using MsgPack.Serialization;

namespace Abelkhan
{
/*this enum code is codegen by abelkhan codegen for c#*/

/*this struct code is codegen by abelkhan codegen for c#*/
/*this module code is codegen by abelkhan codegen for c#*/
    public class plan_buy_rsp : Common.Response {
        private string _client_uuid_8e620315_ff2a_3f9c_a655_464ce392ed2d;
        private UInt64 uuid_7835a394_6da2_3551_9856_fdfa059cab62;
        public plan_buy_rsp(string client_uuid, UInt64 _uuid)
        {
            _client_uuid_8e620315_ff2a_3f9c_a655_464ce392ed2d = client_uuid;
            uuid_7835a394_6da2_3551_9856_fdfa059cab62 = _uuid;
        }

        public void rsp(UserBattleData info_391fd3d4_2d55_3f5e_9223_7f450a814a15){
            var _argv_8e620315_ff2a_3f9c_a655_464ce392ed2d = new ArrayList();
            _argv_8e620315_ff2a_3f9c_a655_464ce392ed2d.Add(uuid_7835a394_6da2_3551_9856_fdfa059cab62);
            _argv_8e620315_ff2a_3f9c_a655_464ce392ed2d.Add(UserBattleData.UserBattleData_to_protcol(info_391fd3d4_2d55_3f5e_9223_7f450a814a15));
            Hub.Hub._gates.call_client(_client_uuid_8e620315_ff2a_3f9c_a655_464ce392ed2d, "plan_rsp_cb_buy_rsp", _argv_8e620315_ff2a_3f9c_a655_464ce392ed2d);
        }

        public void err(Int32 err_ad2710a2_3dd2_3a8f_a4c8_a7ebbe1df696){
            var _argv_8e620315_ff2a_3f9c_a655_464ce392ed2d = new ArrayList();
            _argv_8e620315_ff2a_3f9c_a655_464ce392ed2d.Add(uuid_7835a394_6da2_3551_9856_fdfa059cab62);
            _argv_8e620315_ff2a_3f9c_a655_464ce392ed2d.Add(err_ad2710a2_3dd2_3a8f_a4c8_a7ebbe1df696);
            Hub.Hub._gates.call_client(_client_uuid_8e620315_ff2a_3f9c_a655_464ce392ed2d, "plan_rsp_cb_buy_err", _argv_8e620315_ff2a_3f9c_a655_464ce392ed2d);
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
            var _argv_10f3503a_6ca9_31ee_9d35_130ca397965f = new ArrayList();
            _argv_10f3503a_6ca9_31ee_9d35_130ca397965f.Add(uuid_eed4a46f_fc06_35f9_98ac_a5d500b93484);
            _argv_10f3503a_6ca9_31ee_9d35_130ca397965f.Add(UserBattleData.UserBattleData_to_protcol(info_391fd3d4_2d55_3f5e_9223_7f450a814a15));
            Hub.Hub._gates.call_client(_client_uuid_10f3503a_6ca9_31ee_9d35_130ca397965f, "plan_rsp_cb_sale_role_rsp", _argv_10f3503a_6ca9_31ee_9d35_130ca397965f);
        }

        public void err(Int32 err_ad2710a2_3dd2_3a8f_a4c8_a7ebbe1df696){
            var _argv_10f3503a_6ca9_31ee_9d35_130ca397965f = new ArrayList();
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
            var _argv_97f4163d_22be_334a_ad37_ab1f786ceb46 = new ArrayList();
            _argv_97f4163d_22be_334a_ad37_ab1f786ceb46.Add(uuid_eda10fa8_319d_3f29_8927_072b71272ea7);
            _argv_97f4163d_22be_334a_ad37_ab1f786ceb46.Add(ShopData.ShopData_to_protcol(info_391fd3d4_2d55_3f5e_9223_7f450a814a15));
            Hub.Hub._gates.call_client(_client_uuid_97f4163d_22be_334a_ad37_ab1f786ceb46, "plan_rsp_cb_refresh_rsp", _argv_97f4163d_22be_334a_ad37_ab1f786ceb46);
        }

        public void err(Int32 err_ad2710a2_3dd2_3a8f_a4c8_a7ebbe1df696){
            var _argv_97f4163d_22be_334a_ad37_ab1f786ceb46 = new ArrayList();
            _argv_97f4163d_22be_334a_ad37_ab1f786ceb46.Add(uuid_eda10fa8_319d_3f29_8927_072b71272ea7);
            _argv_97f4163d_22be_334a_ad37_ab1f786ceb46.Add(err_ad2710a2_3dd2_3a8f_a4c8_a7ebbe1df696);
            Hub.Hub._gates.call_client(_client_uuid_97f4163d_22be_334a_ad37_ab1f786ceb46, "plan_rsp_cb_refresh_err", _argv_97f4163d_22be_334a_ad37_ab1f786ceb46);
        }

    }

    public class plan_start_battle_rsp : Common.Response {
        private string _client_uuid_01e120b2_ff3e_35bc_b812_e0d6fa294873;
        private UInt64 uuid_ee4a9042_3083_3d2e_90e2_aa58942d4f15;
        public plan_start_battle_rsp(string client_uuid, UInt64 _uuid)
        {
            _client_uuid_01e120b2_ff3e_35bc_b812_e0d6fa294873 = client_uuid;
            uuid_ee4a9042_3083_3d2e_90e2_aa58942d4f15 = _uuid;
        }

        public void rsp(UserBattleData self_809515b8_3e31_3feb_a08c_462fee09f6ef, UserBattleData target_2cf141ee_a36d_3d58_a9b6_a4febe931c68){
            var _argv_01e120b2_ff3e_35bc_b812_e0d6fa294873 = new ArrayList();
            _argv_01e120b2_ff3e_35bc_b812_e0d6fa294873.Add(uuid_ee4a9042_3083_3d2e_90e2_aa58942d4f15);
            _argv_01e120b2_ff3e_35bc_b812_e0d6fa294873.Add(UserBattleData.UserBattleData_to_protcol(self_809515b8_3e31_3feb_a08c_462fee09f6ef));
            _argv_01e120b2_ff3e_35bc_b812_e0d6fa294873.Add(UserBattleData.UserBattleData_to_protcol(target_2cf141ee_a36d_3d58_a9b6_a4febe931c68));
            Hub.Hub._gates.call_client(_client_uuid_01e120b2_ff3e_35bc_b812_e0d6fa294873, "plan_rsp_cb_start_battle_rsp", _argv_01e120b2_ff3e_35bc_b812_e0d6fa294873);
        }

        public void err(Int32 err_ad2710a2_3dd2_3a8f_a4c8_a7ebbe1df696){
            var _argv_01e120b2_ff3e_35bc_b812_e0d6fa294873 = new ArrayList();
            _argv_01e120b2_ff3e_35bc_b812_e0d6fa294873.Add(uuid_ee4a9042_3083_3d2e_90e2_aa58942d4f15);
            _argv_01e120b2_ff3e_35bc_b812_e0d6fa294873.Add(err_ad2710a2_3dd2_3a8f_a4c8_a7ebbe1df696);
            Hub.Hub._gates.call_client(_client_uuid_01e120b2_ff3e_35bc_b812_e0d6fa294873, "plan_rsp_cb_start_battle_err", _argv_01e120b2_ff3e_35bc_b812_e0d6fa294873);
        }

    }

    public class plan_module : Common.IModule {
        public plan_module()
        {
            Hub.Hub._modules.add_mothed("plan_buy", buy);
            Hub.Hub._modules.add_mothed("plan_sale_role", sale_role);
            Hub.Hub._modules.add_mothed("plan_refresh", refresh);
            Hub.Hub._modules.add_mothed("plan_start_battle", start_battle);
        }

        public event Action<Int32, Int32> on_buy;
        public void buy(IList<MsgPack.MessagePackObject> inArray){
            var _cb_uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            var _shop_index = ((MsgPack.MessagePackObject)inArray[1]).AsInt32();
            var _index = ((MsgPack.MessagePackObject)inArray[2]).AsInt32();
            rsp = new plan_buy_rsp(Hub.Hub._gates.current_client_uuid, _cb_uuid);
            if (on_buy != null){
                on_buy(_shop_index, _index);
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

        public event Action on_start_battle;
        public void start_battle(IList<MsgPack.MessagePackObject> inArray){
            var _cb_uuid = ((MsgPack.MessagePackObject)inArray[0]).AsUInt64();
            rsp = new plan_start_battle_rsp(Hub.Hub._gates.current_client_uuid, _cb_uuid);
            if (on_start_battle != null){
                on_start_battle();
            }
            rsp = null;
        }

    }

}
