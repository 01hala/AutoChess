using Abelkhan;
using System.Collections;

namespace Player
{
    class login_msg_handle
    {
        private readonly login_player_module login_player_Module;

        public login_msg_handle()
        {
            login_player_Module = new login_player_module();

            login_player_Module.on_player_login_no_token += Login_player_Module_on_player_login_no_token;
            login_player_Module.on_player_login += Login_player_Module_on_player_login;
        }

        private async void Login_player_Module_on_player_login_no_token(string account)
        {
            Log.Log.trace("on_player_login_no_token begin!");

            var rsp = login_player_Module.rsp as login_player_player_login_no_token_rsp;

            try
            { 
                var token = await Player.client_Mng.token_player_login(account);
                rsp.rsp(token);
            }
            catch (System.Exception ex)
            {
                Log.Log.err($"{ex}");
                rsp.err((int)em_error.db_error);
            }
        }

        private async void Login_player_Module_on_player_login(string openid, string anonymous_openid)
        {
            Log.Log.trace("on_player_login begin!");

            var rsp = login_player_Module.rsp as login_player_player_login_rsp;

            try
            {
                var token = await Player.client_Mng.token_player_login(openid, anonymous_openid);
                rsp.rsp(token);
            }
            catch (System.Exception ex)
            {
                Log.Log.err($"{ex}");
                rsp.err((int)em_error.db_error);
            }
        }
    }
}
