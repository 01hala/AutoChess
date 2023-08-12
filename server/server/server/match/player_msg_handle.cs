using Abelkhan;
using System.Collections.Generic;

namespace Match
{
    class player_msg_handle
    {
        private player_match_module player_match_Module = new player_match_module();

        public player_msg_handle()
        {
            player_match_Module.on_start_battle += Player_match_Module_on_start_battle;
        }

        private void Player_match_Module_on_start_battle(List<int> roleList)
        {

        }
    }
}
