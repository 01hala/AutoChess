using Abelkhan;
using System.Collections.Generic;
using System.Linq;

namespace Match
{
    class client_msg_handle
    {
        private plan_module plan_Module = new plan_module();
        private gm_module gm_Module = new gm_module();

        public client_msg_handle()
        {
            plan_Module.on_buy += Plan_Module_on_buy;
            plan_Module.on_sale_role += Plan_Module_on_sale_role;
            plan_Module.on_refresh += Plan_Module_on_refresh;
            plan_Module.on_start_round += Plan_Module_on_start_round;

            gm_Module.on_set_formation += Gm_Module_on_set_formation;
        }


        private List<RoleSetUp> selfSetUp;
        private List<RoleSetUp> targetSetUp;
        private void Gm_Module_on_set_formation(List<RoleSetUp> self, List<RoleSetUp> target)
        {
            var rsp = gm_Module.rsp as gm_set_formation_rsp;

            selfSetUp = self;
            targetSetUp = target;

            rsp.rsp();
        }

        private UserBattleData getRandomBattleData(List<RoleSetUp> setUp)
        {
            var data = new UserBattleData();
            data.User = new UserInformation();
            data.RoleList = new List<Role>();

            while (data.RoleList.Count < 6)
            {
                config.RoleConfig rolec = null;
                var level = 1;
                if (setUp != null && setUp.Count > 0)
                {
                    var r = setUp[data.RoleList.Count];
                    rolec = config.Config.RoleConfigs[r.RoleID];
                    level = r.Level;
                }
                else
                {
                    var index = RandomHelper.RandomInt(config.Config.RoleConfigs.Values.Count);
                    rolec = config.Config.RoleConfigs.Values.ElementAt(index);

                    level = RandomHelper.RandomInt(3) + 1;
                }

                var role = new Role();
                role.RoleID = rolec.Id;
                role.Level = level;
                role.HP = rolec.Hp * role.Level;
                role.Attack = rolec.Attack * role.Level;
                role.additionSkill = 0;

                var indexBuffer = RandomHelper.RandomInt(config.Config.BufferConfigs.Values.Count);
                var bufferc = config.Config.BufferConfigs.Values.ElementAt(indexBuffer);
                role.additionBuffer = bufferc.Id;

                data.RoleList.Add(role);
            }

            return data;
        }

        private void Plan_Module_on_start_round()
        {
            var rsp = plan_Module.rsp as plan_start_round_rsp;
            var uuid = Hub.Hub._gates.current_client_uuid;

            try
            {
                var self = getRandomBattleData(selfSetUp);
                var target = getRandomBattleData(targetSetUp);
                rsp.rsp(self, target);
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

        private void Plan_Module_on_buy(ShopIndex shop_index, int index, int role_index)
        {
            var rsp = plan_Module.rsp as plan_buy_rsp;
            var uuid = Hub.Hub._gates.current_client_uuid;
        }

        
    }
}
