using Abelkhan;
using System;

namespace Player
{
    class match_msg_handle
    {
        private readonly match_player_module match_Player_Module;

        public match_msg_handle()
        {
            match_Player_Module = new ();
            match_Player_Module.on_battle_victory += Match_Player_Module_on_battle_victory; ;
        }

        private void Match_Player_Module_on_battle_victory(long guid)
        {
            Log.Log.trace("on_battle_victory begin!");

            try
            {
                var _avatar = Player.client_Mng.guid_get_client_proxy(guid);
                client_mng.PlayerClientCaller.get_client(_avatar.ClientUUID).battle_victory();
            }
            catch (System.Exception ex)
            {
                Log.Log.err($"{ex}");
            }
        }
    }
}
