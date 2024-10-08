﻿using Abelkhan;
using Amazon.Runtime.Internal.Util;
using Amazon.SecurityToken.Model;
using MsgPack.Serialization;
using MsgPack;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Match
{
    class client_msg_handle
    {
        private plan_module plan_Module = new plan_module();
        private peak_strength_module peak_Strength_Module = new peak_strength_module();
        private gm_module gm_Module = new gm_module();

        public client_msg_handle()
        {
            plan_Module.on_buy += Plan_Module_on_buy;
            plan_Module.on_sale_role += Plan_Module_on_sale_role;
            plan_Module.on_move += Plan_Module_on_move;
            plan_Module.on_refresh += Plan_Module_on_refresh;
            plan_Module.on_start_round1 += Plan_Module_on_start_round1;
            plan_Module.on_confirm_round_victory += Plan_Module_on_confirm_round_victory;
            plan_Module.on_freeze += Plan_Module_on_freeze;
            plan_Module.on_start_round += Plan_Module_on_start_round;
            plan_Module.on_get_battle_data += Plan_Module_on_get_battle_data;
            plan_Module.on_end_round += Plan_Module_on_end_round;

            peak_Strength_Module.on_start_peak_strength += Peak_Strength_Module_on_start_peak_strength;
            peak_Strength_Module.on_confirm_peak_strength_victory += Peak_Strength_Module_on_confirm_peak_strength_victory;

            gm_Module.on_set_formation += Gm_Module_on_set_formation;
        }

        private void Plan_Module_on_end_round()
        {
            var rsp = plan_Module.rsp as plan_end_round_rsp;
            var uuid = Hub.Hub._gates.current_client_uuid;

            try
            {
                var _player = Match.battle_Mng.get_battle_player(uuid);
                _player.end_round();
                _player.BattleShopPlayer.do_skill(_player.baseStage());
                rsp.rsp();
            }
            catch (System.Exception ex)
            {
                Log.Log.err("Plan_Module_on_end_round error:{0}", ex);
                rsp.err((int)em_error.db_error);
            }
        }

        private async void Peak_Strength_Module_on_confirm_peak_strength_victory(BattleVictory is_victory)
        {
            var rsp = peak_Strength_Module.rsp as peak_strength_confirm_peak_strength_victory_rsp;
            var uuid = Hub.Hub._gates.current_client_uuid;
            // to do

            try
            {
                var _player = Match.peak_strength_mng.get_battle_player(uuid);
                var formation = await Match._redis_handle.GetData<UserBattleData>(RedisHelp.BuildPlayerPeakStrengthFormationCache(_player.GUID));
                var player_proxy = Match._player_proxy_mng.get_player(_player.PlayerHubName);
                player_proxy.peak_strength_victory(is_victory, formation).callBack(async (userRankInfo) =>
                {
                    userRankInfo.battle_data = await Match._redis_handle.GetData<UserBattleData>(RedisHelp.BuildPlayerPeakStrengthFormationCache(_player.GUID));
                    using var st = MemoryStreamPool.mstMgr.GetStream();
                    var _serializer = MessagePackSerializer.Get<MessagePackObjectDictionary>();
                    _serializer.Pack(st, UserRankInfo.UserRankInfo_to_protcol(userRankInfo));

                    var r = new rank_item
                    {
                        guid = _player.GUID,
                        score = userRankInfo.score,
                        item = st.ToArray()
                    };
                    Match._rank_proxy.update_rank_item(r);
                }, (err) =>
                {
                    Log.Log.err("peak_strength_victory err:{0}", err);
                    rsp.err();
                }).timeout(1500, () =>
                {
                    Log.Log.err("peak_strength_victory timeout!");
                    rsp.err();
                });

                rsp.rsp();
            }
            catch (System.Exception ex)
            {
                Log.Log.err("Peak_Strength_Module_on_del_peak_strength_formation error:{0}", ex);
                rsp.err();
            }
        }

        private async void Peak_Strength_Module_on_start_peak_strength()
        {
            var rsp = peak_Strength_Module.rsp as peak_strength_start_peak_strength_rsp;
            var uuid = Hub.Hub._gates.current_client_uuid;
            // to do

            try
            {
                var _player = Match.peak_strength_mng.get_battle_player(uuid);
                var formation = await Match._redis_handle.GetData<UserBattleData>(RedisHelp.BuildPlayerPeakStrengthFormationCache(_player.GUID));
                var target = await Match._redis_handle.RandomList<UserBattleData>(RedisHelp.BuildPeakStrengthCache());
                rsp.rsp(formation, target);
            }
            catch (System.Exception ex)
            {
                Log.Log.err("Peak_Strength_Module_on_del_peak_strength_formation error:{0}", ex);
                rsp.err((int)em_error.db_error);
            }
        }

        private void Plan_Module_on_get_battle_data()
        {
            var rsp = plan_Module.rsp as plan_get_battle_data_rsp;
            var uuid = Hub.Hub._gates.current_client_uuid;

            try
            {
                var _player = Match.battle_Mng.get_battle_player(uuid);

                rsp.rsp(_player.BattleShopPlayer.BattleData, _player.BattleShopPlayer.ShopData, _player.BattleShopPlayer.check_fetters());
            }
            catch (System.Exception ex)
            {
                Log.Log.err("Plan_Module_on_get_battle_data error:{0}", ex);
                rsp.err();
            }
        }

        private void Plan_Module_on_freeze(ShopIndex shop_index, int index, bool is_freeze)
        {
            var rsp = plan_Module.rsp as plan_freeze_rsp;
            var uuid = Hub.Hub._gates.current_client_uuid;

            try
            {
                var _player = Match.battle_Mng.get_battle_player(uuid);
                _player.BattleShopPlayer.freeze(shop_index, index, is_freeze);

                rsp.rsp(_player.BattleShopPlayer.ShopData);
            }
            catch (System.Exception ex)
            {
                Log.Log.err("Plan_Module_on_freeze error:{0}", ex);
                rsp.err((int)em_error.db_error);
            }
        }

        private void Plan_Module_on_move(int role_index1, int role_index2)
        {
            var rsp = plan_Module.rsp as plan_move_rsp;
            var uuid = Hub.Hub._gates.current_client_uuid;

            try
            {
                var _player = Match.battle_Mng.get_battle_player(uuid);
                _player.BattleShopPlayer.move(role_index1, role_index2);

                rsp.rsp(_player.BattleShopPlayer.BattleData);
            }
            catch (System.Exception ex)
            {
                Log.Log.err("Plan_Module_on_move error:{0}", ex);
                rsp.err((int)em_error.db_error);
            }
        }

        private async void Plan_Module_on_confirm_round_victory(BattleVictory is_victory)
        {
            var rsp = plan_Module.rsp as plan_confirm_round_victory_rsp;
            var uuid = Hub.Hub._gates.current_client_uuid;

            try
            {
                var _player = Match.battle_Mng.get_battle_player(uuid);

                if (baseCount(_player.BattleShopPlayer.BattleData.round) <= countRoleList(_player.BattleShopPlayer.BattleData.RoleList))
                {
                    var len = await Match._redis_handle.PushList(RedisHelp.BuildAutoChessBattleCache(_player.BattleShopPlayer.BattleData.round), _player.BattleShopPlayer.BattleData);
                    if (len > 1100)
                    {
                        Match._redis_handle.PopList(RedisHelp.BuildAutoChessBattleCache(_player.BattleShopPlayer.BattleData.round), 100);
                    }
                }

                _player.BattleShopPlayer.BattleData.round++;
                _player.BattleShopPlayer.BattleData.stage = (_player.BattleShopPlayer.BattleData.round + 1) / 2;

                if (is_victory == BattleVictory.victory)
                {
                    _player.BattleShopPlayer.BattleData.victory++;
                }
                else if (is_victory == BattleVictory.faild)
                {
                    _player.BattleShopPlayer.BattleData.faild--;
                }

                var player_proxy = Match._player_proxy_mng.get_player(_player.PlayerHubName);
                if (_player.BattleShopPlayer.BattleData.victory >= 10)
                {
                    _player.BattleClientCaller.get_client(_player.ClientUUID).battle_victory(_player.mod, true);
                    player_proxy.battle_victory(_player.mod, true, _player.BattleShopPlayer.BattleData);

                    if (_player.BattleShopPlayer.BattleData.round <= 15)
                    {
                        _player.BattleClientCaller.get_client(_player.ClientUUID).replace_peak_strength().callBack(async (isConfirm) =>
                        {
                            if (isConfirm)
                            {
                                await Match._redis_handle.PushList(RedisHelp.BuildPeakStrengthCache(), _player.BattleShopPlayer.BattleData);
                                await Match._redis_handle.SetData(RedisHelp.BuildPlayerPeakStrengthFormationCache(_player.BattleShopPlayer.BattleData.User.UserGuid), _player.BattleShopPlayer.BattleData);
                            }
                        }, () =>
                        {
                            Log.Log.err("replace_peak_strength error!");
                        }).timeout(1000, () =>
                        {
                            Log.Log.err("replace_peak_strength timeout!");
                        });
                    }
                }
                else
                {
                    if (_player.BattleShopPlayer.BattleData.faild <= 0)
                    {
                        _player.BattleClientCaller.get_client(_player.ClientUUID).battle_victory(_player.mod, false);
                        player_proxy.battle_victory(_player.mod, false, _player.BattleShopPlayer.BattleData);
                    }
                    else
                    {
                        _player.start_round(_player.baseStage());
                        _player.BattleShopPlayer.do_skill(_player.baseStage());

                        _player.BattleClientCaller.get_client(_player.ClientUUID).battle_plan_refresh(_player.BattleShopPlayer.BattleData, _player.BattleShopPlayer.ShopData, _player.BattleShopPlayer.check_fetters());
                    }
                }

                rsp.rsp();
            }
            catch (System.Exception ex)
            {
                Log.Log.err("Plan_Module_on_confirm_round_victory error:{0}", ex);
                rsp.err();
            }
        }

        private int countRoleList(List<Role> roleList)
        {
            var count = 0;
            foreach(var r in roleList)
            {
                if (r != null)
                {
                    count++;
                }
            }
            return count;
        }

        private int baseCount(int round)
        {
            int count;
            if (round <= 1)
            {
                count = 3;
            }
            else if (round <= 2)
            {
                count = 4;
            }
            else if (round <= 3)
            {
                count = 5;
            }
            else
            {
                count = 6;
            }

            return count;
        }

        private async Task<UserBattleData> getCacheBattleData(int round)
        {
            var count = baseCount(round);

            var cache = RedisHelp.BuildAutoChessBattleCache(round);
            var target = await Match._redis_handle.RandomList<UserBattleData>(cache);
            if (target == null)
            {
                return null;
            }

            while (countRoleList(target.RoleList) < count)
            {
                target = await Match._redis_handle.RandomList<UserBattleData>(cache);
            }

            return target;
        }

        private async void Plan_Module_on_start_round1()
        {
            var rsp = plan_Module.rsp as plan_start_round1_rsp;
            var uuid = Hub.Hub._gates.current_client_uuid;

            try
            {
                var _player = Match.battle_Mng.get_battle_player(uuid);

                var target = await getCacheBattleData(_player.BattleShopPlayer.BattleData.round);
                if (target == null)
                {
                    target = getRandomBattleData(_player.BattleShopPlayer.BattleData.round, targetSetUp);
                }

                rsp.rsp(_player.BattleShopPlayer.BattleData, target);
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

        private UserBattleData getRandomBattleData(int round, List<RoleSetUp> setUp)
        {
            var data = new UserBattleData();
            data.User = new UserInformation();
            data.RoleList = new List<Role>();

            var count = (round + 2) > 6 ? 6 : (round + 2);

            while (data.RoleList.Count < count)
            {
                config.RoleConfig rolec;
                int level;
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
                    if (count < 6)
                    {
                        level = 1;
                    }
                }

                var role = new Role();
                role.RoleID = rolec.Id;
                role.Level = level;
                role.HP = rolec.Hp * role.Level;
                role.Attack = rolec.Attack * role.Level;
                role.TempAdditionBuffer = new List<int>();
                role.additionBuffer = new List<int>();

                var indexBuffer = RandomHelper.RandomInt(config.Config.BufferConfigs.Values.Count);
                var bufferc = config.Config.BufferConfigs.Values.ElementAt(indexBuffer);
                role.additionBuffer.Add(bufferc.Id);

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
                var self = getRandomBattleData(3, selfSetUp);
                var target = getRandomBattleData(3, targetSetUp);
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
                self.BattleShopPlayer.refresh(self.baseStage());
                self.BattleShopPlayer.do_skill(self.baseStage());

                rsp.rsp(self.BattleShopPlayer.ShopData);
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
                if (self.BattleShopPlayer.sale_role(index))
                {
                    rsp.rsp(self.BattleShopPlayer.BattleData);
                    self.BattleShopPlayer.do_skill(self.baseStage());
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
                    rsp.rsp(self.BattleShopPlayer.BattleData, self.BattleShopPlayer.ShopData);
                    self.BattleShopPlayer.do_skill(self.baseStage());
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
