using Abelkhan;
using System;
using System.IO;
using System.Security.Cryptography;

namespace Player
{
    class match_msg_handle
    {
        private readonly match_player_module match_Player_Module;

        public match_msg_handle()
        {
            match_Player_Module = new ();
            match_Player_Module.on_buy_role += Match_Player_Module_on_buy_role;
            match_Player_Module.on_buy_equip += Match_Player_Module_on_buy_equip;
            match_Player_Module.on_battle_victory += Match_Player_Module_on_battle_victory;
            match_Player_Module.on_peak_strength_victory += Match_Player_Module_on_peak_strength_victory;
        }

        private void Match_Player_Module_on_buy_equip(long guid, int equip)
        {
            Log.Log.trace("on_buy_equip begin!");

            try
            {
                var _avatar = Player.client_Mng.guid_get_client_proxy(guid);
                var _player_info = _avatar.get_clone_hosting_data<PlayerInfo>();
                if (_player_info.Data.CheckBuyEquip(equip))
                {
                    client_mng.PlayerClientCaller.get_client(_avatar.ClientUUID).achievement_complete(_player_info.Data.Info().Achiev, _player_info.Data.Info().wAchiev);
                }
                _player_info.write_back();
            }
            catch (System.Exception ex)
            {
                Log.Log.err($"on_buy_equip error:{ex}");
            }

            Log.Log.trace("on_buy_equip end!");
        }

        private void Match_Player_Module_on_buy_role(long guid, Role roleInfo)
        {
            Log.Log.trace("on_buy_role begin!");

            try
            {
                var _avatar = Player.client_Mng.guid_get_client_proxy(guid);
                var _player_info = _avatar.get_clone_hosting_data<PlayerInfo>();
                if (_player_info.Data.CheckBuyRole(roleInfo))
                {
                    client_mng.PlayerClientCaller.get_client(_avatar.ClientUUID).achievement_complete(_player_info.Data.Info().Achiev, _player_info.Data.Info().wAchiev);
                }
                _player_info.write_back();
            }
            catch (System.Exception ex)
            {
                Log.Log.err($"on_buy_role error:{ex}");
            }

            Log.Log.trace("on_buy_role end!");
        }

        private void Match_Player_Module_on_peak_strength_victory(BattleVictory is_victory, UserBattleData user)
        {
            Log.Log.trace("on_battle_victory begin!");

            var rsp = match_Player_Module.rsp as match_player_peak_strength_victory_rsp;

            try
            {
                var _avatar = Player.client_Mng.guid_get_client_proxy(user.User.UserGuid);
                var _player_info = _avatar.get_clone_hosting_data<PlayerInfo>();
                if (is_victory == BattleVictory.victory)
                {
                    _player_info.Data.Info().score += 5;
                }
                else if (is_victory == BattleVictory.tie)
                {
                    _player_info.Data.Info().score += 1;
                }
                else
                {
                    _player_info.Data.Info().score -= 3;
                }

                var battleInfo = new BattleInfo
                {
                    mod = BattleMod.PeakStrength,
                    isVictory = is_victory,
                    isStreakVictory = false,
                    RoleList = user.RoleList,
                };
                if (_player_info.Data.AddCheckAchievement(battleInfo) || _player_info.Data.AddCheckWeekAchievement(battleInfo))
                {
                    client_mng.PlayerClientCaller.get_client(_avatar.ClientUUID).achievement_complete(_player_info.Data.Info().Achiev, _player_info.Data.Info().wAchiev);
                }
                _player_info.write_back();

                var rank_Info = new UserRankInfo
                {
                    nick_name = _player_info.Data.Info().User.UserName,
                    avatar = _player_info.Data.Info().User.Avatar,
                    score = _player_info.Data.Info().score
                };
                rsp.rsp(rank_Info);
            }
            catch (System.Exception ex)
            {
                Log.Log.err($"{ex}");
                rsp.err((int)em_error.db_error);
            }
        }

        private void Match_Player_Module_on_battle_victory(bool is_victory, UserBattleData user)
        {
            Log.Log.trace("on_battle_victory begin!");

            try
            {
                var _avatar = Player.client_Mng.guid_get_client_proxy(user.User.UserGuid);
                var _player_info = _avatar.get_clone_hosting_data<PlayerInfo>();
                var battleInfo = new BattleInfo
                {
                    mod = BattleMod.PeakStrength,
                    isVictory = is_victory ? BattleVictory.victory : BattleVictory.faild,
                    isStreakVictory = is_victory && user.faild <= 0,
                    RoleList = user.RoleList,
                };
                if (_player_info.Data.AddCheckAchievement(battleInfo) || _player_info.Data.AddCheckWeekAchievement(battleInfo))
                {
                    client_mng.PlayerClientCaller.get_client(_avatar.ClientUUID).achievement_complete(_player_info.Data.Info().Achiev, _player_info.Data.Info().wAchiev);
                }
                _player_info.write_back();

                client_mng.PlayerClientCaller.get_client(_avatar.ClientUUID).battle_victory();
            }
            catch (System.Exception ex)
            {
                Log.Log.err($"{ex}");
            }
        }
    }
}
