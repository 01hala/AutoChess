using Abelkhan;
using Amazon.Util.Internal;
using battle_shop;
using config;
using Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Match
{
    public class battle_player
    {
        public long LastActiveTime = Timerservice.Tick;

        public string PlayerHubName {
            set; get;
        }

        private battle_client_caller caller;
        public battle_client_caller BattleClientCaller
        {
            get
            {
                return caller;
            }
        }

        private string clientUUID;
        public string ClientUUID
        {
            set
            {
                clientUUID = value;
            }
            get
            {
                return clientUUID;
            }
        }

        private battle_shop_player battle_Shop_Player;
        public battle_shop_player BattleShopPlayer
        {
            set
            {
                battle_Shop_Player = value;
            }
            get
            {
                return battle_Shop_Player;
            }
        }

        public BattleMod mod;

        public battle_player(BattleMod _mod, string _clientUUID, battle_client_caller _caller, List<int> roleList, UserInformation info)
        {
            mod = _mod;
            clientUUID = _clientUUID;
            caller = _caller;

            battle_Shop_Player = new battle_shop_player(_clientUUID, _caller, roleList, info);
            refresh(baseStage());
        }

        public int baseStage()
        {
            var _base = (BattleShopPlayer.BattleData.round + 1) / 2;
            return _base < 6 ? _base : 6;
        }

        private void _reset()
        {
            foreach (var r in BattleShopPlayer.BattleData.RoleList)
            {
                if (r != null)
                {
                    r.TempHP = 0;
                    r.TempAttack = 0;
                    r.TempAdditionBuffer.Clear();
                }
            }
        }

        public void start_round(int stage)
        {
            BattleShopPlayer.BattleData.coin = 10 + BattleShopPlayer.bankCpin;
            BattleShopPlayer.bankCpin = 0;

            _reset();
            BattleShopPlayer.ShopData = BattleShopPlayer.refresh(stage);

            BattleShopPlayer.evs.Add(new shop_event()
            {
                ev = EMRoleShopEvent.start_round
            });

            BattleShopPlayer.clear_skill_tag();
        }

        public void end_round()
        {
            BattleShopPlayer.evs.Add(new shop_event()
            {
                ev = EMRoleShopEvent.end_round
            });

            BattleShopPlayer.clear_skill_tag();
        }

        public void refresh(int stage)
        {
            BattleShopPlayer.ShopData = BattleShopPlayer.refresh(stage);
        }

        public bool add_role(int role_index, int shop_index, int role_Level)
        {
            var r = BattleShopPlayer.add_role(role_index, shop_index, role_Level);
            if (r != null)
            {
                var player_proxy = Match._player_proxy_mng.get_player(PlayerHubName);
                player_proxy.buy_role(BattleShopPlayer.BattleData.User.UserGuid, r);

                return true;
            }

            return false;
        }

        public em_error buy_role(int index, int role_index)
        {
            var r = BattleShopPlayer.BattleData.RoleList[role_index];
            var s = BattleShopPlayer.ShopData.SaleRoleList[index];


            if (s == null)
            {
                return em_error.db_error;
            }

            if (r == null)
            {
                if (!add_role(role_index, index, 1))
                {
                    return em_error.db_error;
                }
            }
            else
            {
                var err = BattleShopPlayer.merge_role(index, role_index);
                if (err != em_error.success)
                {
                    return err;
                }

                var player_proxy = Match._player_proxy_mng.get_player(PlayerHubName);
                player_proxy.buy_role(BattleShopPlayer.BattleData.User.UserGuid, r);
            }

            return em_error.success;
        }

        public em_error buy_equip(ShopProp p, int index, int role_index)
        {
            var err = BattleShopPlayer.buy_equip(p, index, role_index);
            if (err != em_error.success)
            {
                return err;
            }

            var player_proxy = Match._player_proxy_mng.get_player(PlayerHubName);
            player_proxy.buy_equip(BattleShopPlayer.BattleData.User.UserGuid, p.PropID);

            return em_error.success;
        }

        public em_error buy(ShopIndex shop_index, int index, int role_index)
        {
            if (BattleShopPlayer.BattleData.coin < 3)
            {
                return em_error.no_enough_coin;
            }
            BattleShopPlayer.BattleData.coin -= 3;

            if (shop_index == ShopIndex.Role)
            {
                var result = buy_role(index, role_index);
                if (result != em_error.success)
                {
                    return result;
                }
            }
            else if (shop_index == ShopIndex.Prop)
            {
                var p = BattleShopPlayer.ShopData.SalePropList[index];
                if (p == null)
                {
                    return em_error.db_error;
                }

                if (p.PropID >= config.Config.FoodIDMin && p.PropID <= config.Config.FoodIDMax)
                {
                    var result = BattleShopPlayer.buy_food(p, index, role_index);
                    if (result != em_error.success)
                    {
                        return result;
                    }
                }
                else if (p.PropID >= config.Config.EquipIDMin && p.PropID <= config.Config.EquipIDMax)
                {
                    var result = buy_equip(p, index, role_index);
                    if (result != em_error.success)
                    {
                        return result;
                    }
                }
                else
                {
                    return em_error.db_error;
                }

                BattleShopPlayer.ShopData.SalePropList[index] = null;
            }
            else
            {
                return em_error.db_error;
            }

            BattleShopPlayer.clear_skill_tag();

            return em_error.success;
        }

    }

    public class battle_mng
    {
        private Dictionary<string, battle_player> battles = new();

        private battle_client_caller _caller;

        public battle_mng()
        {
            _caller = new battle_client_caller();

            Hub.Hub._timer.addticktime(5 * 60 * 1000, tick_clear_timeout_player);
        }

        private void tick_clear_timeout_player(long tick_time)
        {
            List<battle_player> timeout_battle_player = new();
            foreach (var it in battles)
            {
                if ((it.Value.LastActiveTime + 30 * 60 * 1000) < Timerservice.Tick)
                {
                    timeout_battle_player.Add(it.Value);
                }
            }
            foreach (var _player in timeout_battle_player)
            {
                battles.Remove(_player.ClientUUID);
            }

            Hub.Hub._timer.addticktime(5 * 60 * 1000, tick_clear_timeout_player);
        }

        public battle_player add_player_to_battle(BattleMod mod, string clientUUID, List<int> roleList, UserInformation user_info)
        {
            var _player = new battle_player(mod, clientUUID, _caller, roleList, user_info);
            battles[clientUUID] = _player;
            return _player;
        }

        public bool change_player_uuid(string old_client_uuid, string new_client_uuid)
        {
            if (battles.Remove(old_client_uuid, out var _player))
            {
                _player.ClientUUID = new_client_uuid;
                battles[new_client_uuid] = _player;
            }

            return true;
        }

        public battle_player get_battle_player(string clientUUID)
        {
            battles.TryGetValue(clientUUID, out var _player);
            _player.LastActiveTime = Timerservice.Tick;
            return _player;
        }
    }
}
