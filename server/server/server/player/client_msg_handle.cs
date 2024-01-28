using Abelkhan;
using Log;
using MongoDB.Bson.Serialization;
using MongoDB.Bson;
using System;
using MsgPack.Serialization;
using System.Collections.Generic;
using System.Xml.Linq;
using Newtonsoft.Json.Linq;
using System.Text.RegularExpressions;

namespace Player
{
    public class client_msg_handle
    {
        private readonly player_login_module player_login_Module;
        private readonly player_battle_module player_battle_Module;
        private readonly player_shop_module player_shop_Module;

        public client_msg_handle()
        {
            player_login_Module = new();
            player_login_Module.on_player_login += Login_Player_Module_on_player_login;
            player_login_Module.on_create_role += Player_login_Module_on_create_role;

            player_battle_Module = new();
            player_battle_Module.on_start_battle += Player_battle_Module_on_start_battle;

            player_shop_Module = new();
            player_shop_Module.on_buy_card_packet += Player_shop_Module_on_buy_card_packet;
            player_shop_Module.on_buy_card_merge += Player_shop_Module_on_buy_card_merge;
            player_shop_Module.on_edit_role_group += Player_shop_Module_on_edit_role_group;
            player_shop_Module.on_get_user_data += Player_shop_Module_on_get_user_data;
        }

        private async void Player_shop_Module_on_get_user_data()
        {
            Log.Log.trace("on_get_user_data begin!");

            var rsp = player_shop_Module.rsp as player_shop_edit_role_group_rsp;
            var uuid = Hub.Hub._gates.current_client_uuid;

            try
            {
                var _avatar = await Player.client_Mng.uuid_get_client_proxy(uuid);
                var _data = _avatar.get_real_hosting_data<PlayerInfo>();
                rsp.rsp(_data.Data.Info());
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
                var _data = _avatar.get_clone_hosting_data<PlayerInfo>();
                var err = _data.Data.EditRoleGroup(_group);
                if (err != 0)
                {
                    rsp.err((int)err);
                }
                else
                {
                    _data.write_back();
                    rsp.rsp(_data.Data.Info());
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
                var _data = _avatar.get_clone_hosting_data<PlayerInfo>();
                var (err, packet) = _data.Data.BuyCardPacket();
                if (err != 0)
                {
                    rsp.err((int)err);
                }
                else
                {
                    _data.write_back();
                    rsp.rsp(packet, _data.Data.Info().bag);
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
                var _data = _avatar.get_clone_hosting_data<PlayerInfo>();
                var err = _data.Data.BuyCardMerge(_roleID);
                if (err != 0)
                {
                    rsp.err((int)err);
                }
                else
                {
                    _data.write_back();
                    rsp.rsp(_roleID, _data.Data.Info());
                }
            }
            catch (System.Exception ex)
            {
                Log.Log.err($"Player_shop_Module_on_buy_card_merge err:{ex}");
                rsp.err((int)em_error.db_error);
            }
        }

        private async void Player_battle_Module_on_start_battle()
        {
            Log.Log.trace("on_start_battle begin!");

            var rsp = player_battle_Module.rsp as player_battle_start_battle_rsp;
            var uuid = Hub.Hub._gates.current_client_uuid;

            try
            {
                var _avatar = await Player.client_Mng.uuid_get_client_proxy(uuid);
                var _match = Player.match_Proxy_Mng.get_match_proxy();
                _match.start_battle(uuid, _avatar.PlayerInfo().BattleRoleGroup()).callBack((battle, shop) =>
                {
                    rsp.rsp(_match.name, battle, shop);
                }, rsp.err);
            }
            catch (System.Exception ex)
            {
                Log.Log.err($"Player_battle_Module_on_start_battle: err{ex}");
                rsp.err((int)em_error.db_error);
            }
        }

        private void Player_login_Module_on_create_role(string name, string nick_name)
        {
            Log.Log.trace("on_player_login begin!");

            var rsp = player_login_Module.rsp as player_login_create_role_rsp;
            var uuid = Hub.Hub._gates.current_client_uuid;

            try
            {
                var _avatar = Player.client_Mng.create_player(uuid, name, nick_name);
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

        private async void Login_Player_Module_on_player_login(string token, string name)
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
                    if (string.IsNullOrEmpty(_data.Data.Info().User.UserName) && _data.Data.Info().User.UserGuid == 0)
                    {
                        rsp.err((int)em_error.unregistered_palyer);
                    }
                    else
                    {
                        _data.Data.Info().User.UserName = name;
                        _data.write_back();

                        rsp.rsp(_avatar.PlayerInfo().Info());

                        await Player.offline_Msg_Mng.process_offline_msg(_avatar.Guid.ToString());
                    }
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
