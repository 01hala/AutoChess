using Abelkhan;
using System;

namespace Player
{
    public class client_msg_handle
    {
        private readonly player_login_module player_login_Module;
        private readonly player_battle_module player_battle_Module;
        private readonly player_shop_module player_shop_Module;
        private readonly player_quest_module player_quest_Module;
        private plan_module plan_Module;

        public client_msg_handle()
        {
            plan_Module = new plan_module();
            plan_Module.on_buy += Plan_Module_on_buy; ;
            plan_Module.on_sale_role += Plan_Module_on_sale_role; ;
            plan_Module.on_move += Plan_Module_on_move; ;
            plan_Module.on_refresh += Plan_Module_on_refresh; ;

            player_login_Module = new();
            player_login_Module.on_player_login += Login_Player_Module_on_player_login;
            player_login_Module.on_create_role += Player_login_Module_on_create_role;
            player_login_Module.on_reconnect += Player_login_Module_on_reconnect;
            player_login_Module.on_guide_step += Player_login_Module_on_guide_step;

            player_battle_Module = new();
            player_battle_Module.on_start_battle += Player_battle_Module_on_start_battle;
            player_battle_Module.on_start_peak_strength += Player_battle_Module_on_start_peak_strength;
            player_battle_Module.on_achievement_gold25 += Player_battle_Module_on_achievement_gold25;
            player_battle_Module.on_kill_role += Player_battle_Module_on_kill_role;
            player_battle_Module.on_check_achievement += Player_battle_Module_on_check_achievement;

            player_quest_Module = new();
            player_quest_Module.on_start_quest_ready += Player_quest_Module_on_start_quest_ready;
            player_quest_Module.on_start_quest_shop += Player_quest_Module_on_start_quest_shop;
            player_quest_Module.on_start_quest_battle += Player_quest_Module_on_start_quest_battle;
            player_quest_Module.on_confirm_quest_victory += Player_quest_Module_on_confirm_quest_victory;
            player_quest_Module.on_get_quest_shop_data += Player_quest_Module_on_get_quest_shop_data;

            player_shop_Module = new();
            player_shop_Module.on_buy_card_packet += Player_shop_Module_on_buy_card_packet;
            player_shop_Module.on_buy_card_merge += Player_shop_Module_on_buy_card_merge;
            player_shop_Module.on_edit_role_group += Player_shop_Module_on_edit_role_group;
            player_shop_Module.on_get_user_data += Player_shop_Module_on_get_user_data;
        }

        private async void Player_quest_Module_on_get_quest_shop_data()
        {
            Log.Log.trace("on_get_quest_shop_data begin!");

            try
            {
                var rsp = player_quest_Module.rsp as player_quest_get_quest_shop_data_rsp;
                var uuid = Hub.Hub._gates.current_client_uuid;
                var _avatar = await Player.client_Mng.uuid_get_client_proxy(uuid);
                if (_avatar != null)
                {
                    var _data = _avatar.get_real_hosting_data<PlayerInfo>();
                    rsp.rsp(_data.Data.BattleShopPlayer.BattleData, _data.Data.BattleShopPlayer.ShopData);
                }
            }
            catch (System.Exception ex)
            {
                Log.Log.err($"Player_quest_Module_on_get_quest_shop_data err:{ex}");
            }

            Log.Log.trace("on_get_quest_shop_data end!");
        }

        private async void Player_quest_Module_on_confirm_quest_victory(BattleVictory is_victory)
        {
            Log.Log.trace("on_confirm_quest_victory begin!");

            try
            {
                var rsp = plan_Module.rsp as player_quest_confirm_quest_victory_rsp;
                var uuid = Hub.Hub._gates.current_client_uuid;

                var _avatar = await Player.client_Mng.uuid_get_client_proxy(uuid);
                if (_avatar != null)
                {
                    var _data = _avatar.get_real_hosting_data<PlayerInfo>();
                    if (is_victory == BattleVictory.victory)
                    {
                        _data.Data.PVELevelIndex++;
                        if (_data.Data.PVELevelIndex >= _data.Data.PVECfg.Level.Count)
                        {
                            _data.Data.Info().quest++;

                            rsp.rsp(em_quest_state.next_quest);
                            _data.Data.ClearPVEState();
                        }
                        else
                        {
                            rsp.rsp(em_quest_state.next_level);
                            _data.Data.StartPVERound();
                        }
                    }
                    else
                    {
                        rsp.rsp(em_quest_state.faild);
                        _data.Data.ClearPVEState();
                    }
                }
            }
            catch (System.Exception ex)
            {
                Log.Log.err("Player_quest_Module_on_confirm_quest_victory error:{0}", ex);
            }

            Log.Log.trace("on_confirm_quest_victory end!");
        }

        private async void Plan_Module_on_refresh()
        {
            Log.Log.trace("on_refresh begin!");

            try
            {
                var rsp = plan_Module.rsp as plan_refresh_rsp;
                var uuid = Hub.Hub._gates.current_client_uuid;

                var _avatar = await Player.client_Mng.uuid_get_client_proxy(uuid);
                if (_avatar != null)
                {
                    var _data = _avatar.get_real_hosting_data<PlayerInfo>();
                    _data.Data.refresh(_data.Data.GetStage());
                    _data.Data.BattleShopPlayer.do_skill(_data.Data.GetStage());

                    rsp.rsp(_data.Data.BattleShopPlayer.ShopData);
                }
            }
            catch (System.Exception ex)
            {
                Log.Log.err("Plan_Module_on_move error:{0}", ex);
            }

            Log.Log.trace("Plan_Module_on_refresh end!");
        }

        private async void Plan_Module_on_move(int role_index1, int role_index2)
        {
            Log.Log.trace("on_move begin!");

            try
            {
                var rsp = plan_Module.rsp as plan_move_rsp;
                var uuid = Hub.Hub._gates.current_client_uuid;

                var _avatar = await Player.client_Mng.uuid_get_client_proxy(uuid);
                if (_avatar != null)
                {
                    var _data = _avatar.get_real_hosting_data<PlayerInfo>();
                    _data.Data.BattleShopPlayer.move(role_index1, role_index2);

                    rsp.rsp(_data.Data.BattleShopPlayer.BattleData);
                }
            }
            catch (System.Exception ex)
            {
                Log.Log.err("Plan_Module_on_move error:{0}", ex);
            }

            Log.Log.trace("on_move end!");
        }

        private async void Plan_Module_on_sale_role(int index)
        {
            Log.Log.trace("on_sale_role begin!");

            try
            {
                var rsp = plan_Module.rsp as plan_sale_role_rsp;
                var uuid = Hub.Hub._gates.current_client_uuid;

                var _avatar = await Player.client_Mng.uuid_get_client_proxy(uuid);
                if (_avatar != null)
                {
                    var _data = _avatar.get_real_hosting_data<PlayerInfo>();
                    if (_data.Data.BattleShopPlayer.sale_role(index))
                    {
                        rsp.rsp(_data.Data.BattleShopPlayer.BattleData);
                        _data.Data.BattleShopPlayer.do_skill(_data.Data.GetStage());
                    }
                    else
                    {
                        rsp.err((int)em_error.no_role_in_index_to_sale);
                    }
                }

            }
            catch (System.Exception ex)
            {
                Log.Log.err($"Plan_Module_on_sale_role err:{ex}");
            }

            Log.Log.trace("on_sale_role end!");
        }

        private async void Plan_Module_on_buy(ShopIndex shop_index, int index, int role_index)
        {
            Log.Log.trace("on_buy begin!");

            try
            {
                var rsp = plan_Module.rsp as plan_buy_rsp;
                var uuid = Hub.Hub._gates.current_client_uuid;

                var _avatar = await Player.client_Mng.uuid_get_client_proxy(uuid);
                if (_avatar != null)
                {
                    var _data = _avatar.get_real_hosting_data<PlayerInfo>();
                    var err = _data.Data.buy(_avatar.ClientUUID, shop_index, index, role_index);
                    rsp.rsp(_data.Data.BattleShopPlayer.BattleData, _data.Data.BattleShopPlayer.ShopData);
                }

            }
            catch (System.Exception ex)
            {
                Log.Log.err($"Plan_Module_on_buy err:{ex}");
            }

            Log.Log.trace("on_buy end!");
        }

        private async void Player_quest_Module_on_start_quest_battle()
        {
            Log.Log.trace("on_start_quest_battle begin!");

            try
            {
                var rsp = player_quest_Module.rsp as player_quest_start_quest_battle_rsp;
                var uuid = Hub.Hub._gates.current_client_uuid;
                var _avatar = await Player.client_Mng.uuid_get_client_proxy(uuid);
                if (_avatar != null)
                {
                    var _data = _avatar.get_real_hosting_data<PlayerInfo>();
                    _data.Data.EndPVERound();
                    rsp.rsp(_data.Data.BattleShopPlayer.BattleData, _data.Data.StartQuestBattle());
                }
            }
            catch (System.Exception ex)
            {
                Log.Log.err($"Player_quest_Module_on_start_quest_battle err:{ex}");
            }

            Log.Log.trace("on_start_quest_battle end!");
        }

        private async void Player_quest_Module_on_start_quest_shop(int event_id)
        {
            Log.Log.trace("on_start_quest_shop begin!");
            
            try
            {
                var rsp = player_quest_Module.rsp as player_quest_start_quest_shop_rsp;
                var uuid = Hub.Hub._gates.current_client_uuid;
                var _avatar = await Player.client_Mng.uuid_get_client_proxy(uuid);
                if (_avatar != null)
                {
                    var _data = _avatar.get_real_hosting_data<PlayerInfo>();
                    _data.Data.StartQuestShop(event_id);
                    rsp.rsp(_data.Data.BattleShopPlayer.BattleData, _data.Data.BattleShopPlayer.ShopData);
                }
            }
            catch (System.Exception ex)
            {
                Log.Log.err($"Player_quest_Module_on_start_quest_shop err:{ex}");
            }

            Log.Log.trace("on_start_quest_shop end!");
        }

        private async void Player_quest_Module_on_start_quest_ready()
        {
            Log.Log.trace("on_start_quest_ready begin!");

            try
            {
                var rsp = player_quest_Module.rsp as player_quest_start_quest_ready_rsp;
                var uuid = Hub.Hub._gates.current_client_uuid;
                var _avatar = await Player.client_Mng.uuid_get_client_proxy(uuid);
                if (_avatar != null)
                {
                    var _data = _avatar.get_real_hosting_data<PlayerInfo>();
                    var (err, roleList) = _data.Data.StartQuestReady(uuid, client_mng.BattleClientCaller);
                    if (err)
                    {
                        rsp.rsp(roleList);
                    }
                    else
                    {
                        rsp.err((int)em_error.not_exist_quest);
                    }
                }
            }
            catch (System.Exception ex)
            {
                Log.Log.err($"Player_quest_Module_on_start_quest_ready err:{ex}");
            }

            Log.Log.trace("on_start_quest_ready end!");
        }

        private async void Player_login_Module_on_guide_step(GuideStep step)
        {
            Log.Log.trace("on_guide_step begin!");

            try
            {
                var uuid = Hub.Hub._gates.current_client_uuid;
                var _avatar = await Player.client_Mng.uuid_get_client_proxy(uuid);
                if (_avatar != null)
                {
                    var _data = _avatar.get_real_hosting_data<PlayerInfo>();
                    _data.Data.UpdateGuideStep(step);
                }
            }
            catch (System.Exception ex)
            {
                Log.Log.err($"Player_login_Module_on_guide_step err:{ex}");
            }

            Log.Log.trace("on_guide_step end!");
        }

        private async void Player_battle_Module_on_kill_role(Role roleInfo)
        {
            Log.Log.trace("on_kill_role begin!");

            try
            {
                var uuid = Hub.Hub._gates.current_client_uuid;
                var _avatar = await Player.client_Mng.uuid_get_client_proxy(uuid);
                if (_avatar != null)
                {
                    var _data = _avatar.get_real_hosting_data<PlayerInfo>();
                    if (_data.Data.CheckKillRole(roleInfo))
                    {
                        client_mng.PlayerClientCaller.get_client(_avatar.ClientUUID).achievement_complete(_data.Data.Info().Achiev, _data.Data.Info().wAchiev);
                    }
                }
            }
            catch (System.Exception ex)
            {
                Log.Log.err($"Player_shop_Module_on_get_user_data err:{ex}");
            }

            Log.Log.trace("on_kill_role end!");
        }

        private async void Player_battle_Module_on_check_achievement(Achievement achievement)
        {
            Log.Log.trace("on_check_achievement begin!");

            var rsp = player_battle_Module.rsp as player_battle_check_achievement_rsp;
            var uuid = Hub.Hub._gates.current_client_uuid;

            try
            {
                var _avatar = await Player.client_Mng.uuid_get_client_proxy(uuid);
                if (_avatar != null)
                {
                    var _data = _avatar.get_real_hosting_data<PlayerInfo>();
                    if (_data.Data.CheckGetAchievementReward(achievement))
                    {
                        var reward = new AchievementReward();
                        if (config.Config.TaskConfigs.TryGetValue(Enum.GetName(typeof(Achievement), achievement), out var task))
                        {
                            reward.gold = task.RewardGold;
                        }
                        _data.Data.Info().gold += task.RewardGold;
                        rsp.rsp(reward);
                    }
                    else
                    {
                        rsp.err((int)em_error.not_complete_achievement);
                    }
                }
            }
            catch (System.Exception ex)
            {
                Log.Log.err($"Player_shop_Module_on_get_user_data err:{ex}");
                rsp.err((int)em_error.db_error);
            }

            Log.Log.trace("on_check_achievement end!");
        }

        private async void Player_battle_Module_on_achievement_gold25()
        {
            Log.Log.trace("on_achievement_gold25 begin!");

            var uuid = Hub.Hub._gates.current_client_uuid;

            try
            {
                var _avatar = await Player.client_Mng.uuid_get_client_proxy(uuid);
                if (_avatar != null)
                {
                    var _data = _avatar.get_clone_hosting_data<PlayerInfo>();
                    var a = _data.Data.GetAchievementData(Achievement.EMGold25);
                    if (a.status != AchievementAwardStatus.EMRecv)
                    {
                        a.status = AchievementAwardStatus.EMComplete;
                        _data.write_back();
                        client_mng.PlayerClientCaller.get_client(_avatar.ClientUUID).achievement_complete(_data.Data.Info().Achiev, _data.Data.Info().wAchiev);
                    }
                }
            }
            catch (System.Exception ex)
            {
                Log.Log.err($"Player_battle_Module_on_achievement_gold25 err:{ex}");
            }

            Log.Log.trace("on_achievement_gold25 end!");
        }

        private async void Player_shop_Module_on_get_user_data()
        {
            Log.Log.trace("on_get_user_data begin!");

            var rsp = player_shop_Module.rsp as player_shop_get_user_data_rsp;
            var uuid = Hub.Hub._gates.current_client_uuid;

            try
            {
                var _avatar = await Player.client_Mng.uuid_get_client_proxy(uuid);
                if (_avatar != null)
                {
                    var _data = _avatar.get_real_hosting_data<PlayerInfo>();
                    rsp.rsp(_data.Data.Info());
                }
            }
            catch (System.Exception ex)
            {
                Log.Log.err($"Player_shop_Module_on_get_user_data err:{ex}");
                rsp.err((int)em_error.db_error);
            }
        }

        private async void Player_shop_Module_on_edit_role_group(RoleGroup _group)
        {
            Log.Log.trace("on_edit_role_group begin!");

            var rsp = player_shop_Module.rsp as player_shop_edit_role_group_rsp;
            var uuid = Hub.Hub._gates.current_client_uuid;

            try
            {
                var _avatar = await Player.client_Mng.uuid_get_client_proxy(uuid);
                if (_avatar != null)
                {
                    var _data = _avatar.get_clone_hosting_data<PlayerInfo>();
                    var err = _data.Data.EditRoleGroup(_group);
                    if (err == 0)
                    {
                        _data.write_back();
                        rsp.rsp(_data.Data.Info());
                    }
                    else
                    {
                        rsp.err((int)err);
                    }
                }
            }
            catch (System.Exception ex)
            {
                Log.Log.err($"Player_shop_Module_on_edit_role_group err:{ex}");
                rsp.err((int)em_error.db_error);
            }
        }

        private async void Player_shop_Module_on_buy_card_packet()
        {
            Log.Log.trace("on_buy_card_packet begin!");

            var rsp = player_shop_Module.rsp as player_shop_buy_card_packet_rsp;
            var uuid = Hub.Hub._gates.current_client_uuid;

            try
            {
                var _avatar = await Player.client_Mng.uuid_get_client_proxy(uuid);
                if (_avatar != null)
                {
                    var _data = _avatar.get_clone_hosting_data<PlayerInfo>();
                    var (err, packet) = _data.Data.BuyCardPacket();
                    if (err == 0)
                    {
                        _data.write_back();
                        rsp.rsp(packet, _data.Data.Info().bag);
                    }
                    else
                    {
                        rsp.err((int)err);
                    }
                }
            }
            catch (System.Exception ex)
            {
                Log.Log.err($"Player_shop_Module_on_buy_card_packet err:{ex}");
                rsp.err((int)em_error.db_error);
            }
        }

        private async void Player_shop_Module_on_buy_card_merge(int _roleID)
        {
            Log.Log.trace("on_buy_card_merge begin!");

            var rsp = player_shop_Module.rsp as player_shop_buy_card_merge_rsp;
            var uuid = Hub.Hub._gates.current_client_uuid;

            try
            {
                var _avatar = await Player.client_Mng.uuid_get_client_proxy(uuid);
                if (_avatar != null)
                {
                    var _data = _avatar.get_clone_hosting_data<PlayerInfo>();
                    var err = _data.Data.BuyCardMerge(_roleID);
                    if (err == 0)
                    {
                        _data.write_back();
                        rsp.rsp(_roleID, _data.Data.Info());
                    }
                    else
                    {
                        rsp.err((int)err);
                    }
                }
            }
            catch (System.Exception ex)
            {
                Log.Log.err($"Player_shop_Module_on_buy_card_merge err:{ex}");
                rsp.err((int)em_error.db_error);
            }
        }

        private async void Player_battle_Module_on_start_peak_strength()
        {
            Log.Log.trace("on_start_battle begin!");

            var rsp = player_battle_Module.rsp as player_battle_start_peak_strength_rsp;
            var uuid = Hub.Hub._gates.current_client_uuid;

            try
            {
                var _avatar = await Player.client_Mng.uuid_get_client_proxy(uuid);
                if (_avatar != null)
                {
                    var peakStrengthID = await Player._redis_handle.GetData<long>(RedisHelp.BuildPeakStrengthID());
                    if (peakStrengthID != _avatar.PlayerInfo().PeakStrengthID)
                    {
                        _avatar.PlayerInfo().PeakStrengthID = peakStrengthID;
                        Player._redis_handle.DelData(RedisHelp.BuildPlayerPeakStrengthFormationCache(_avatar.Guid));
                    }

                    var _match = Player.match_Proxy_Mng.get_match_proxy();
                    _match.start_peak_strength(uuid, _avatar.Guid).callBack(async (battleData) =>
                    {
                        rsp.rsp(_match.name, battleData);

                        var match_key = RedisHelp.BuildPlayerMatchSvrCache(_avatar.Guid);
                        await Player._redis_handle.SetStrData(match_key, _match.name, RedisHelp.PlayerMatchSvrCacheTimeout);

                    }, rsp.err);
                }
            }
            catch (System.Exception ex)
            {
                Log.Log.err($"Player_battle_Module_on_start_battle: err{ex}");
                rsp.err((int)em_error.db_error);
            }
        }

        private async void Player_battle_Module_on_start_battle(BattleMod mod)
        {
            Log.Log.trace("on_start_battle begin!");

            var rsp = player_battle_Module.rsp as player_battle_start_battle_rsp;
            var uuid = Hub.Hub._gates.current_client_uuid;

            try
            {
                var _avatar = await Player.client_Mng.uuid_get_client_proxy(uuid);
                if (_avatar != null)
                {
                    var _match = Player.match_Proxy_Mng.get_match_proxy();
                    _match.start_battle(mod, uuid, _avatar.PlayerInfo().BattleRoleGroup(), _avatar.PlayerInfo().Info().User).callBack(async (battle, shop) =>
                    {
                        rsp.rsp(_match.name, battle, shop);

                        var match_key = RedisHelp.BuildPlayerMatchSvrCache(_avatar.Guid);
                        await Player._redis_handle.SetStrData(match_key, _match.name, RedisHelp.PlayerMatchSvrCacheTimeout);

                    }, rsp.err);
                }
            }
            catch (System.Exception ex)
            {
                Log.Log.err($"Player_battle_Module_on_start_battle: err{ex}");
                rsp.err((int)em_error.db_error);
            }
        }

        private async void Player_login_Module_on_create_role(string sdk_uuid, string name, string nick_name, string avatar)
        {
            Log.Log.trace("on_player_login begin!");

            var rsp = player_login_Module.rsp as player_login_create_role_rsp;
            var uuid = Hub.Hub._gates.current_client_uuid;

            try
            {
                var _avatar = await Player.client_Mng.create_player(uuid, sdk_uuid, name, nick_name, avatar);
                rsp.rsp(_avatar.PlayerInfo().Info());
            }
            catch (LoginException ex)
            {
                Log.Log.err(ex.ErrorInfo);
                Hub.Hub._gates.disconnect_client(uuid);
            }
            catch (System.Exception ex)
            {
                Log.Log.err($"Player_login_Module_on_create_role err:{ex}");
                rsp.err((int)em_error.db_error);
            }
        }

        private async void Player_login_Module_on_reconnect(long guid)
        {
            Log.Log.trace("on_reconnect begin!");

            var rsp = player_login_Module.rsp as player_login_reconnect_rsp;
            var uuid = Hub.Hub._gates.current_client_uuid;

            try
            {
                var _avatar = Player.client_Mng.guid_get_client_proxy(guid);
                if (_avatar != null)
                {
                    rsp.err((int)em_error.player_offline);
                }
                else
                {
                    var match_key = RedisHelp.BuildPlayerMatchSvrCache(_avatar.Guid);
                    string match_name = await Player._redis_handle.GetStrData(match_key);

                    match_proxy _match = null;
                    if (!string.IsNullOrEmpty(match_name))
                    {
                        _match = Player.match_Proxy_Mng.get_match_proxy(match_name);
                    }

                    if (_match != null)
                    {
                        _match.reconnect(_avatar.ClientUUID, uuid).callBack((is_online) =>
                        {
                            if (is_online)
                            {
                                rsp.rsp(_avatar.PlayerInfo().Info(), match_name);
                            }
                            else
                            {
                                rsp.rsp(_avatar.PlayerInfo().Info(), "");
                            }
                        }, () =>
                        {
                            Log.Log.err("match reconnect error!");
                        }).timeout(3000, () =>
                        {
                            Log.Log.err("match reconnect timeout!");
                        });
                    }
                    else
                    {
                        rsp.rsp(_avatar.PlayerInfo().Info(), "");
                    }
                    _avatar.ClientUUID = uuid;

                }
            }
            catch (System.Exception ex)
            {
                Log.Log.err($"{ex}");

                rsp.err((int)em_error.db_error);
            }
        }

        private async void Login_Player_Module_on_player_login(string token, string name, string avatar)
        {
            Log.Log.trace("on_player_login begin!");

            var rsp = player_login_Module.rsp as player_login_player_login_rsp;
            var uuid = Hub.Hub._gates.current_client_uuid;

            try
            {
                var _avatar = Player.client_Mng.token_get_client_proxy(uuid, token);
                if (_avatar != null)
                {
                    var _data = _avatar.get_clone_hosting_data<PlayerInfo>();
                    _data.Data.Info().User.UserName = name;
                    _data.Data.Info().User.Avatar = avatar;
                    _data.write_back();

                    rsp.rsp(_avatar.PlayerInfo().Info());

                    await Player.offline_Msg_Mng.process_offline_msg(_avatar.Guid.ToString());
                }
                else
                {
                    rsp.err((int)em_error.unregistered_palyer);
                }
            }
            catch (LoginException ex)
            {
                Log.Log.err(ex.ErrorInfo);
                Hub.Hub._gates.disconnect_client(uuid);

                rsp.err((int)em_error.db_error);
            }
            catch (System.Exception ex)
            {
                Log.Log.err($"{ex}");

                rsp.err((int)em_error.db_error);
            }
        }
    }
}
