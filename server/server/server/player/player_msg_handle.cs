using Abelkhan;

namespace Player
{
    class player_msg_handle
    {
        private readonly player_player_offline_msg_module player_offline_msg_Module;

        public player_msg_handle()
        {
            player_offline_msg_Module = new ();
            player_offline_msg_Module.on_player_have_offline_msg += Player_offline_msg_Module_on_player_have_offline_msg;
        }

        private async void Player_offline_msg_Module_on_player_have_offline_msg(long guid)
        {
            Log.Log.trace("on_player_have_offline_msg begin!");

            try
            {
                await Player.offline_Msg_Mng.process_offline_msg(guid.ToString());
            }
            catch (System.Exception ex)
            {
                Log.Log.err($"{ex}");
            }
        }
    }
}
