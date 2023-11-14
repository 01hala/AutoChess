using Abelkhan;
using Amazon.SecurityToken.Model;
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
            plan_Module.on_move += Plan_Module_on_move;
            plan_Module.on_refresh += Plan_Module_on_refresh;
            plan_Module.on_start_round1 += Plan_Module_on_start_round1;
            plan_Module.on_confirm_round_victory += Plan_Module_on_confirm_round_victory;

            plan_Module.on_start_round += Plan_Module_on_start_round;

            gm_Module.on_set_formation += Gm_Module_on_set_formation;
        }

        private void Plan_Module_on_move(int role_index1, int role_index2)
        {
            var rsp = plan_Module.rsp as plan_move_rsp;
            var uuid = Hub.Hub._gates.current_client_uuid;

            try
            {
                var _player = Match.battle_Mng.get_battle_player(uuid);
                _player.move(role_index1, role_index2);

                rsp.rsp(_player.BattleData);
            }
            catch (System.Exception ex)
            {
                Log.Log.err("Plan_Module_on_confirm_round_victory error:{0}", ex);
                rsp.err((int)em_error.db_error);
            }
        }

        private void Plan_Module_on_confirm_round_victory(bool is_victory)
        {
            var rsp = plan_Module.rsp as plan_confirm_round_victory_rsp;
            var uuid = Hub.Hub._gates.current_client_uuid;

            try
            {
                var _player = Match.battle_Mng.get_battle_player(uuid);

                _player.round++;
                Match._redis_handle.PushList($"AutoChess:battle:{_player.round}", _player.BattleData);

                if (is_victory)
                {
                    _player.victory++;
                }
                else
                {
                    _player.count--;
                }

                if (_player.victory >= 10)
                {
                    _player.BattleClientCaller.get_client(_player.ClientUUID).battle_victory(true);
                }
                else
                {
                    if (_player.count <= 0)
                    {
                        _player.BattleClientCaller.get_client(_player.ClientUUID).battle_victory(false);
                    }
                    else
                    {
                        _player.BattleClientCaller.get_client(_player.ClientUUID).battle_plan_refresh(_player.BattleData, _player.ShopData);
                    }
                }

                _player.start_round();
                _player.do_skill();

                rsp.rsp();
            }
            catch (System.Exception ex)
            {
                Log.Log.err("Plan_Module_on_confirm_round_victory error:{0}", ex);
                rsp.err();
            }
        }

        private async void Plan_Module_on_start_round1()
        {
            var rsp = plan_Module.rsp as plan_start_round1_rsp;
            var uuid = Hub.Hub._gates.current_client_uuid;

            try
            {
                var _player = Match.battle_Mng.get_battle_player(uuid);

                _player.end_round();
                _player.do_skill();

                var target = await Match._redis_handle.RandomList<UserBattleData>($"AutoChess:battle:{_player.round}");
                if (target == null)
                {
                    target = getRandomBattleData(targetSetUp);
                }

                rsp.rsp(_player.BattleData, target);
            }
            catch (System.Exception ex)
            {
                Log.Log.err("Plan_Module_on_start_round1 error:{0}", ex);
                rsp.err((int)em_error.db_error);
            }
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

            try
            {
                var self = Match.battle_Mng.get_battle_player(uuid);
                self.refresh();
                self.do_skill();

                rsp.rsp(self.ShopData);
            }
            catch(System.Exception ex)
            {
                Log.Log.err("Plan_Module_on_refresh error:{0}", ex);
                rsp.err((int)em_error.db_error);
            }
        }

        private void Plan_Module_on_sale_role(int index)
        {
            var rsp = plan_Module.rsp as plan_sale_role_rsp;
            var uuid = Hub.Hub._gates.current_client_uuid;

            try
            {
                var self = Match.battle_Mng.get_battle_player(uuid);
                if (self.sale_role(index))
                {
                    rsp.rsp(self.BattleData);
                    self.do_skill();
                }
                else
                {
                    rsp.err((int)em_error.no_role_in_index_to_sale);
                }
            }
            catch (System.Exception ex)
            {
                Log.Log.err("Plan_Module_on_sale_role error:{0}", ex);
                rsp.err((int)em_error.db_error);
            }
        }

        private void Plan_Module_on_buy(ShopIndex shop_index, int index, int role_index)
        {
            var rsp = plan_Module.rsp as plan_buy_rsp;
            var uuid = Hub.Hub._gates.current_client_uuid;

            try
            {
                var self = Match.battle_Mng.get_battle_player(uuid);
                var err = self.buy(shop_index, index, role_index);
                if (err == em_error.success)
                {
                    rsp.rsp(self.BattleData, self.ShopData);
                    self.do_skill();
                }
                else
                {
                    rsp.err((int)err);
                }
            }
            catch (System.Exception ex)
            {
                Log.Log.err("Plan_Module_on_buy error:{0}", ex);
                rsp.err((int)em_error.db_error);
            }
        }

        
    }
}
