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
            match_Player_Module.on_battle_victory += Match_Player_Module_on_battle_victory;
            match_Player_Module.on_peak_strength_victory += Match_Player_Module_on_peak_strength_victory;
        }

        private void Match_Player_Module_on_peak_strength_victory(bool is_victory, UserBattleData user, UserBattleData enemy)
        {
            Log.Log.trace("on_battle_victory begin!");

            var rsp = match_Player_Module.rsp as match_player_peak_strength_victory_rsp;

            try
            {
                var _avatar = Player.client_Mng.guid_get_client_proxy(user.User.UserGuid);
                var _player_info = _avatar.get_clone_hosting_data<PlayerInfo>();
                if (is_victory)
                {
                    _player_info.Data.Info().score += 5;
                }
                else
                {
                    _player_info.Data.Info().score -= 3;
                }
                _player_info.Data.AddCheckAchievement(new BattleInfo
                {
                    mod = BattleMod.PeakStrength,
                    isVictory = is_victory,

                });
                _player_info.write_back();

                var rank_Info = new UserRankInfo();
                rank_Info.nick_name = _player_info.Data.Info().User.UserName;
                rank_Info.avatar = _player_info.Data.Info().User.Avatar;
                rank_Info.score = _player_info.Data.Info().score;
                rsp.rsp(rank_Info);
            }
            catch (System.Exception ex)
            {
                Log.Log.err($"{ex}");
                rsp.err((int)em_error.db_error);
            }
        }

        private void Match_Player_Module_on_battle_victory(bool is_victory, UserBattleData user, UserBattleData enemy)
        {
            Log.Log.trace("on_battle_victory begin!");

            try
            {
                var _avatar = Player.client_Mng.guid_get_client_proxy(user.User.UserGuid);
                client_mng.PlayerClientCaller.get_client(_avatar.ClientUUID).battle_victory();
            }
            catch (System.Exception ex)
            {
                Log.Log.err($"{ex}");
            }
        }
    }
}
