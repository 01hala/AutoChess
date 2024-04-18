using Abelkhan;
using System;
using System.Collections.Generic;

namespace Match
{
    class player_msg_handle
    {
        private player_match_module player_match_Module = new player_match_module();

        public player_msg_handle()
        {
            player_match_Module.on_start_battle += Player_match_Module_on_start_battle;
            player_match_Module.on_start_peak_strength += Player_match_Module_on_start_peak_strength;
            player_match_Module.on_reconnect += Player_match_Module_on_reconnect;
        }

        private async void Player_match_Module_on_start_peak_strength(string clientUUID, long guid)
        {
            var rsp = player_match_Module.rsp as player_match_start_peak_strength_rsp;

            // to do
            try
            {
                var date = System.DateTime.Now;
                int daysUntilSaturday = ((int)DayOfWeek.Saturday - (int)(date.DayOfWeek == DayOfWeek.Sunday ? 7 : (int)date.DayOfWeek));
                DateTime nextSaturday = date.AddDays(daysUntilSaturday);
                DateTime nextSaturday1730 = new DateTime(nextSaturday.Year, nextSaturday.Month, nextSaturday.Day, 17, 30, 0);
                if (System.DateTime.Now > nextSaturday1730)
                {
                    rsp.err((int)em_error.peak_strength_end);
                }

                var _player = Match.peak_strength_mng.add_player_to_battle(Hub.Hub._hubs.current_hubproxy.name, clientUUID, guid);
                var _battleData = await Match._redis_handle.GetData<UserBattleData>(RedisHelp.BuildPlayerPeakStrengthFormationCache(_player.GUID));
                if (_battleData != null)
                {
                    rsp.rsp(_battleData);
                }
                else
                {
                    rsp.err((int)em_error.peak_strength_no_data);
                }
            }
            catch (System.Exception e)
            {
                Log.Log.err("Player_match_Module_on_start_battle error:{0}", e);
                rsp.err((int)em_error.db_error);
            }
        }

        private void Player_match_Module_on_reconnect(string old_client_uuid, string new_client_uuid)
        {
            var rsp = player_match_Module.rsp as player_match_reconnect_rsp;

            try
            {
                rsp.rsp(Match.battle_Mng.change_player_uuid(old_client_uuid, new_client_uuid) &&
                        Match.peak_strength_mng.change_player_uuid(old_client_uuid, new_client_uuid));
            }
            catch (System.Exception e)
            {
                Log.Log.err("Player_match_Module_on_start_battle error:{0}", e);
                rsp.err();
            }
        }

        private void Player_match_Module_on_start_battle(string clientUUID, List<int> roleList, UserInformation user_info)
        {
            var rsp = player_match_Module.rsp as player_match_start_battle_rsp;

            try
            {
                var _player = Match.battle_Mng.add_player_to_battle(clientUUID, roleList, user_info);
                _player.PlayerHubName = Hub.Hub._hubs.current_hubproxy.name;
                rsp.rsp(_player.BattleData, _player.ShopData);
            }
            catch (System.Exception e)
            {
                Log.Log.err("Player_match_Module_on_start_battle error:{0}", e);
                rsp.err((int)em_error.db_error);
            }
        }
    }
}
