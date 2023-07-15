using Abelkhan;
using Log;
using MongoDB.Bson.Serialization;
using MongoDB.Bson;
using System;
using MsgPack.Serialization;
using System.Collections.Generic;

namespace Player
{
    public class client_msg_handle
    {
        private readonly player_client_caller player_client_Caller;

        private readonly player_login_module player_login_Module;
        private readonly player_archive_module player_archive_Module;

        public client_msg_handle()
        {
            player_client_Caller = new ();

            player_login_Module = new ();
            player_login_Module.on_player_login += Login_Player_Module_on_player_login;
            player_login_Module.on_create_role += Player_login_Module_on_create_role;

            player_archive_Module = new ();
            player_archive_Module.on_cost_strength += Player_archive_Module_on_cost_strength;
            player_archive_Module.on_cost_coin += Player_archive_Module_on_cost_coin;
            player_archive_Module.on_cost_prop += Player_archive_Module_on_cost_prop;
            player_archive_Module.on_open_chest += Player_archive_Module_on_open_chest;
            player_archive_Module.on_add_coin += Player_archive_Module_on_add_coin;
            player_archive_Module.on_add_strength += Player_archive_Module_on_add_strength;
            player_archive_Module.on_add_skill += Player_archive_Module_on_add_skill;
            player_archive_Module.on_add_monster += Player_archive_Module_on_add_monster;
        }

        private async void Player_archive_Module_on_add_monster(Monster ms)
        {
            var rsp = player_archive_Module.rsp as player_archive_add_monster_rsp;
            var uuid = Hub.Hub._gates.current_client_uuid;

            try
            {
                var _avatar = await Player.client_Mng.uuid_get_client_proxy(uuid);
                if (_avatar != null)
                {
                    var _data = _avatar.get_clone_hosting_data<PlayerInfo>();
                    _data.Data.AddMonster(ms);
                    _data.Data.CheckStrength();
                    rsp.rsp(_data.Data.info);
                    _data.write_back();
                }
                else
                {
                    rsp.err((int)em_error.unregistered_palyer);
                }
            }
            catch (System.Exception ex)
            {
                Log.Log.err($"{ex}");
                rsp.err((int)em_error.db_error);
            }
        }

        private async void Player_archive_Module_on_add_skill(Skill skill)
        {
            var rsp = player_archive_Module.rsp as player_archive_add_skill_rsp;
            var uuid = Hub.Hub._gates.current_client_uuid;

            try
            {
                var _avatar = await Player.client_Mng.uuid_get_client_proxy(uuid);
                if (_avatar != null)
                {
                    var _data = _avatar.get_clone_hosting_data<PlayerInfo>();
                    _data.Data.AddSkill(skill);
                    _data.Data.CheckStrength();
                    rsp.rsp(_data.Data.info);
                    _data.write_back();
                }
                else
                {
                    rsp.err((int)em_error.unregistered_palyer);
                }
            }
            catch (System.Exception ex)
            {
                Log.Log.err($"{ex}");
                rsp.err((int)em_error.db_error);
            }
        }

        private async void Player_archive_Module_on_add_strength(int strength)
        {
            var rsp = player_archive_Module.rsp as player_archive_add_strength_rsp;
            var uuid = Hub.Hub._gates.current_client_uuid;

            try
            {
                var _avatar = await Player.client_Mng.uuid_get_client_proxy(uuid);
                if (_avatar != null)
                {
                    var _data = _avatar.get_clone_hosting_data<PlayerInfo>();
                    _data.Data.AddStrength(strength);
                    _data.Data.CheckStrength();
                    rsp.rsp(_data.Data.info);
                    _data.write_back();
                }
                else
                {
                    rsp.err((int)em_error.unregistered_palyer);
                }
            }
            catch (System.Exception ex)
            {
                Log.Log.err($"{ex}");
                rsp.err((int)em_error.db_error);
            }
        }

        private async void Player_archive_Module_on_add_coin(int coin)
        {
            var rsp = player_archive_Module.rsp as player_archive_add_coin_rsp;
            var uuid = Hub.Hub._gates.current_client_uuid;

            try
            {
                var _avatar = await Player.client_Mng.uuid_get_client_proxy(uuid);
                if (_avatar != null)
                {
                    var _data = _avatar.get_clone_hosting_data<PlayerInfo>();
                    _data.Data.AddCoin(coin);
                    _data.Data.CheckStrength();
                    rsp.rsp(_data.Data.info);
                    _data.write_back();
                }
                else
                {
                    rsp.err((int)em_error.unregistered_palyer);
                }
            }
            catch (System.Exception ex)
            {
                Log.Log.err($"{ex}");
                rsp.err((int)em_error.db_error);
            }
        }

        private async void Player_archive_Module_on_open_chest(EMChestType chest_type)
        {
            var rsp = player_archive_Module.rsp as player_archive_open_chest_rsp;
            var uuid = Hub.Hub._gates.current_client_uuid;

            try
            {
                var _avatar = await Player.client_Mng.uuid_get_client_proxy(uuid);
                if (_avatar != null)
                {
                    var _data = _avatar.get_clone_hosting_data<PlayerInfo>();
                    var strength_is_change = _data.Data.CheckStrength();
                    _data.write_back();
                    _data = _avatar.get_clone_hosting_data<PlayerInfo>();
                    int err = _data.Data.OpenChest(chest_type);
                    if (err == (int)em_error.success)
                    {
                        rsp.rsp(_data.Data.info);
                        _data.write_back();
                    }
                    else
                    {
                        if (strength_is_change)
                        {
                            player_client_Caller.get_client(uuid).archive_sync(_data.Data.info);
                        }
                        rsp.err(err);
                    }
                }
                else
                {
                    rsp.err((int)em_error.unregistered_palyer);
                }
            }
            catch (System.Exception ex)
            {
                Log.Log.err($"{ex}");
                rsp.err((int)em_error.db_error);
            }
        }

        private async void Player_archive_Module_on_cost_prop(int prop_id)
        {
            var rsp = player_archive_Module.rsp as player_archive_cost_prop_rsp;
            var uuid = Hub.Hub._gates.current_client_uuid;

            try
            {
                var _avatar = await Player.client_Mng.uuid_get_client_proxy(uuid);
                if (_avatar != null)
                {
                    var _data = _avatar.get_clone_hosting_data<PlayerInfo>();
                    var strength_is_change = _data.Data.CheckStrength();
                    _data.write_back();
                    _data = _avatar.get_clone_hosting_data<PlayerInfo>();
                    int err = _data.Data.CostProp(prop_id);
                    if (err == (int)em_error.success)
                    {
                        rsp.rsp(_data.Data.info);
                        _data.write_back();
                    }
                    else
                    {
                        if (strength_is_change)
                        {
                            player_client_Caller.get_client(uuid).archive_sync(_data.Data.info);
                        }
                        rsp.err(err);
                    }
                }
                else
                {
                    rsp.err((int)em_error.unregistered_palyer);
                }
            }
            catch (System.Exception ex)
            {
                Log.Log.err($"{ex}");
                rsp.err((int)em_error.db_error);
            }
        }

        private async void Player_archive_Module_on_cost_coin(int cost_amount, EMCostCoinPath cost_path, int role_id)
        {
            var rsp = player_archive_Module.rsp as player_archive_cost_coin_rsp;
            var uuid = Hub.Hub._gates.current_client_uuid;

            try
            {
                var _avatar = await Player.client_Mng.uuid_get_client_proxy(uuid);
                if (_avatar != null)
                {
                    var _data = _avatar.get_clone_hosting_data<PlayerInfo>();
                    var strength_is_change = _data.Data.CheckStrength();
                    _data.write_back();
                    int err = _data.Data.CostCoin(cost_amount, cost_path, role_id);
                    if (err == (int)em_error.success)
                    {
                        rsp.rsp(_data.Data.info);
                        _data.write_back();
                    }
                    else
                    {
                        if (strength_is_change)
                        {
                            player_client_Caller.get_client(uuid).archive_sync(_data.Data.info);
                        }
                        rsp.err(err);
                    }
                }
                else
                {
                    rsp.err((int)em_error.unregistered_palyer);
                }
            }
            catch (System.Exception ex)
            {
                Log.Log.err($"{ex}");
                rsp.err((int)em_error.db_error);
            }
        }

        private async void Player_archive_Module_on_cost_strength(int strength)
        {
            var rsp = player_archive_Module.rsp as player_archive_cost_strength_rsp;
            var uuid = Hub.Hub._gates.current_client_uuid;

            try
            {
                var _avatar = await Player.client_Mng.uuid_get_client_proxy(uuid);
                if (_avatar != null)
                {
                    var _data = _avatar.get_clone_hosting_data<PlayerInfo>();
                    var strength_is_change = _data.Data.CheckStrength();
                    int err = _data.Data.CostStrength(strength);
                    if (err == (int)em_error.success)
                    {
                        rsp.rsp(_data.Data.info);
                    }
                    else
                    {
                        if (strength_is_change)
                        {
                            player_client_Caller.get_client(uuid).archive_sync(_data.Data.info);
                        }
                        rsp.err(err);
                    }
                    _data.write_back();
                }
                else
                {
                    rsp.err((int)em_error.unregistered_palyer);
                }
            }
            catch (System.Exception ex)
            {
                Log.Log.err($"{ex}");
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
                rsp.rsp(_avatar.PlayerInfo());
            }
            catch (LoginException ex)
            {
                Log.Log.err(ex.ErrorInfo);
                Hub.Hub._gates.disconnect_client(uuid);
            }
            catch (System.Exception ex)
            {
                Log.Log.err($"{ex}");
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
                    if (string.IsNullOrEmpty(_data.Data.info.User.UserName) && _data.Data.info.User.UserUid == 0)
                    {
                        rsp.err((int)em_error.unregistered_palyer);
                    }
                    else
                    {
                        _data.Data.info.User.UserName = name;
                        _data.write_back();

                        rsp.rsp(_avatar.PlayerInfo());

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
