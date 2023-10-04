using Abelkhan;
using System.Collections.Generic;
using System.Linq;

namespace Match
{
    class client_msg_handle
    {
        private plan_module plan_Module = new plan_module();

        public client_msg_handle()
        {
            plan_Module.on_buy += Plan_Module_on_buy;
            plan_Module.on_sale_role += Plan_Module_on_sale_role;
            plan_Module.on_refresh += Plan_Module_on_refresh;
            plan_Module.on_start_round += Plan_Module_on_start_round;
        }

        private UserBattleData getRandomBattleData()
        {
            var data = new UserBattleData();

            while(data.RoleList.Count < 5)
            {
                var index = RandomHelper.RandomInt(config.Config.RoleConfigs.Values.Count);
                var rolec = config.Config.RoleConfigs.Values.ElementAt(index);

                var role = new Role();
                role.RoleID = rolec.Id;
                role.Level = RandomHelper.RandomInt(3);
                role.HP = rolec.Hp * role.Level;
                role.Attack = rolec.Attack * role.Level;
                role.additionSkill = 
            }

            return data;
        }

        private void Plan_Module_on_start_round()
        {
            var rsp = plan_Module.rsp as plan_start_round_rsp;
            var uuid = Hub.Hub._gates.current_client_uuid;

            try
            {
                rsp.rsp(getRandomBattleData(), getRandomBattleData());
            }
            catch(System.Exception ex)
            {
                Log.Log.err("Plan_Module_on_start_round error:{0}", ex);
                rsp.err((int)em_error.db_error);
            }
        }

        private void Plan_Module_on_refresh()
        {
            var rsp = plan_Module.rsp as plan_refresh_rsp;
            var uuid = Hub.Hub._gates.current_client_uuid;
        }

        private void Plan_Module_on_sale_role(int obj)
        {
            var rsp = plan_Module.rsp as plan_sale_role_rsp;
            var uuid = Hub.Hub._gates.current_client_uuid;
        }

        private void Plan_Module_on_buy(ShopIndex shop_index, int index)
        {
            var rsp = plan_Module.rsp as plan_buy_rsp;
            var uuid = Hub.Hub._gates.current_client_uuid;
        }

        
    }
}
