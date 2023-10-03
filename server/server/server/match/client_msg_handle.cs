using Abelkhan;
using System.Collections.Generic;

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

        private void Plan_Module_on_start_round()
        {
            var rsp = plan_Module.rsp as plan_start_round_rsp;
            var uuid = Hub.Hub._gates.current_client_uuid;
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
