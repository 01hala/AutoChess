﻿using Abelkhan;
using System.Collections.Generic;

namespace Match
{
    class player_msg_handle
    {
        private player_match_module player_match_Module = new player_match_module();

        public player_msg_handle()
        {
            player_match_Module.on_start_battle += Player_match_Module_on_start_battle;
            player_match_Module.on_reconnect += Player_match_Module_on_reconnect;
        }

        private void Player_match_Module_on_reconnect(string old_client_uuid, string new_client_uuid)
        {
            var rsp = player_match_Module.rsp as player_match_reconnect_rsp;

            try
            {
                rsp.rsp(Match.battle_Mng.change_player_uuid(old_client_uuid, new_client_uuid));
            }
            catch (Exception e)
            {
                Log.Log.err("Player_match_Module_on_start_battle error:{0}", e);
                rsp.err();
            }
        }

        private void Player_match_Module_on_start_battle(string clientUUID, List<int> roleList)
        {
            var rsp = player_match_Module.rsp as player_match_start_battle_rsp;

            try
            {
                var _player = Match.battle_Mng.add_player_to_battle(clientUUID, roleList);
                rsp.rsp(_player.BattleData, _player.ShopData);
            }
            catch (Exception e)
            {
                Log.Log.err("Player_match_Module_on_start_battle error:{0}", e);
                rsp.err((int)em_error.db_error);
            }
        }
    }
}
