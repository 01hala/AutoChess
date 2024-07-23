using Abelkhan;

namespace Login
{
    class client_msg_handle
    {
        private login_module login_Module = new login_module();

        public client_msg_handle()
        {
            login_Module.on_player_login_no_token += Login_Module_on_player_login_no_token;
            login_Module.on_player_login_dy += Login_Module_on_player_login_dy;
            login_Module.on_player_login_wx += Login_Module_on_player_login_wx;
        }

        private void try_player_login(player_proxy _proxy, string account, login_player_login_no_token_rsp rsp)
        {
            Log.Log.trace("try_player_login _proxy.name:{0}", _proxy.name);

            var key = RedisHelp.BuildPlayerSvrCacheKey(account);
            Login._redis_handle.SetStrData(key, _proxy.name, RedisHelp.PlayerSvrInfoCacheTimeout);

            _proxy.player_login_no_token(account).callBack((token) => {
                rsp.rsp(_proxy.name, token, account);
            }, (err) => {
                rsp.err(err);
            }).timeout(20000, () => {
                Log.Log.trace("try_player_login _proxy.name:{0} timeout!", _proxy.name);
                rsp.err((int)em_error.timeout);
            });
        }

        private async void random_player_svr_rsp(string account, login_player_login_no_token_rsp rsp)
        {
            var _proxy = await Login._player_proxy_mng.random_idle_player();
            if (_proxy != null)
            {
                try_player_login(_proxy, account, rsp);
            }
            else
            {
                rsp.err((int)em_error.server_busy);
            }
        }

        private async void Login_Module_on_player_login_no_token(string account)
        {
            var uuid = Hub.Hub._gates.current_client_uuid;
            var rsp = login_Module.rsp as login_player_login_no_token_rsp;

            Log.Log.trace("on_player_login_no_author begin! player account:{0}, uuid:{1}", account, uuid);

            var lock_key = RedisHelp.BuildPlayerSvrCacheLockKey(account);
            var token = $"lock_{account}";
            try
            {
                await Login._redis_handle.Lock(lock_key, token, 1000);

                var key = RedisHelp.BuildPlayerSvrCacheKey(account);
                var _player_proxy_name = await Login._redis_handle.GetStrData(key);
                if (string.IsNullOrEmpty(_player_proxy_name))
                {
                    random_player_svr_rsp(account, rsp);
                }
                else
                {
                    var _proxy = Login._player_proxy_mng.get_player(_player_proxy_name);
                    if (_proxy != null)
                    {
                        await Login._redis_handle.Expire(key, RedisHelp.PlayerSvrInfoCacheTimeout);
                        try_player_login(_proxy, account, rsp);
                    }
                    else
                    {
                        random_player_svr_rsp(account, rsp);
                    }
                }

                var gate_key = RedisHelp.BuildPlayerGateCacheKey(account);
                await Login._redis_handle.SetStrData(gate_key, Hub.Hub._gates.get_client_gate_name(uuid), RedisHelp.PlayerSvrInfoCacheTimeout);
            }
            catch (System.Exception ex)
            {
                Log.Log.err($"{ex}");
                rsp.err((int)em_error.db_error);
            }
            finally
            {
                await Login._redis_handle.UnLock(lock_key, token);
            }
        }

        private void try_player_login(player_proxy _proxy, string account, string code, string anonymous_code, login_player_login_dy_rsp rsp)
        {
            Log.Log.trace("try_player_login _proxy.name:{0}", _proxy.name);

            var key = RedisHelp.BuildPlayerSvrCacheKey(account);
            Login._redis_handle.SetStrData(key, _proxy.name, RedisHelp.PlayerSvrInfoCacheTimeout);

            _proxy.player_login(code, anonymous_code).callBack((token) => {
                rsp.rsp(_proxy.name, token, account);
            }, (err) => {
                rsp.err(err);
            }).timeout(10000, () => {
                rsp.err((int)em_error.timeout);
            });
        }

        private async void random_player_svr_rsp(string account, string code, string anonymous_code, login_player_login_dy_rsp rsp)
        {
            var _proxy = await Login._player_proxy_mng.random_idle_player();
            if (_proxy != null)
            {
                try_player_login(_proxy, account, code, anonymous_code, rsp);
            }
            else
            {
                rsp.err((int)em_error.server_busy);
            }
        }

        private async void Login_Module_on_player_login_dy(string code, string anonymous_code)
        {
            var uuid = Hub.Hub._gates.current_client_uuid;
            var rsp = login_Module.rsp as login_player_login_dy_rsp;

            try
            {
                var session = await dy.dySdk.code2Session(Login.DyAppID, Login.DyAppSecret, code, anonymous_code);

                string account = null;
                if (string.IsNullOrEmpty(anonymous_code))
                {
                    account = session.openid;
                }
                else
                {
                    account = session.anonymous_openid;
                }

                Log.Log.trace("on_player_login_dy begin! player account:{0}, uuid:{1}", account, uuid);
                var lock_key = RedisHelp.BuildPlayerSvrCacheLockKey(account);
                var token = $"lock_{account}";
                try
                {
                    await Login._redis_handle.Lock(lock_key, token, 1000);

                    var key = RedisHelp.BuildPlayerSvrCacheKey(account);
                    var _player_proxy_name = await Login._redis_handle.GetStrData(key);
                    if (string.IsNullOrEmpty(_player_proxy_name))
                    {
                        random_player_svr_rsp(account, session.openid, session.anonymous_openid, rsp);
                    }
                    else
                    {
                        var _proxy = Login._player_proxy_mng.get_player(_player_proxy_name);
                        if (_proxy != null)
                        {
                            await Login._redis_handle.Expire(key, RedisHelp.PlayerSvrInfoCacheTimeout);
                            try_player_login(_proxy, account, session.openid, session.anonymous_openid, rsp);
                        }
                        else
                        {
                            random_player_svr_rsp(account, session.openid, session.anonymous_openid, rsp);
                        }
                    }

                    var gate_key = RedisHelp.BuildPlayerGateCacheKey(account);
                    await Login._redis_handle.SetStrData(gate_key, Hub.Hub._gates.get_client_gate_name(uuid), RedisHelp.PlayerSvrInfoCacheTimeout);
                }
                catch (System.Exception ex)
                {
                    Log.Log.err($"{ex}");
                    rsp.err((int)em_error.db_error);
                }
                finally
                {
                    await Login._redis_handle.UnLock(lock_key, token);
                }
            }
            catch (dy.code2SessionEx ex)
            {
                Log.Log.err($"code2SessionEx:{ex}");
                rsp.err((int)em_error.login_dy_faild);
            }
            catch (System.Exception ex)
            {
                Log.Log.err($"{ex}");
                rsp.err((int)em_error.db_error);
            }
        }

        private void try_player_login(player_proxy _proxy, string account, string code, login_player_login_wx_rsp rsp)
        {
            Log.Log.trace("try_player_login _proxy.name:{0}", _proxy.name);

            var key = RedisHelp.BuildPlayerSvrCacheKey(account);
            Login._redis_handle.SetStrData(key, _proxy.name, RedisHelp.PlayerSvrInfoCacheTimeout);

            _proxy.player_login(code, "").callBack((token) => {
                rsp.rsp(_proxy.name, token, account);
            }, (err) => {
                rsp.err(err);
            }).timeout(10000, () => {
                rsp.err((int)em_error.timeout);
            });
        }

        private async void random_player_svr_rsp(string account, string code, login_player_login_wx_rsp rsp)
        {
            var _proxy = await Login._player_proxy_mng.random_idle_player();
            if (_proxy != null)
            {
                try_player_login(_proxy, account, code, rsp);
            }
            else
            {
                rsp.err((int)em_error.server_busy);
            }
        }

        private async void Login_Module_on_player_login_wx(string code)
        {
            var uuid = Hub.Hub._gates.current_client_uuid;
            var rsp = login_Module.rsp as login_player_login_wx_rsp;

            try
            {
                var session = await wx.wxSdk.code2Session(Login.WxAppID, Login.WxAppSecret, code);
                string account = session.openid;

                Log.Log.trace("on_player_login_wx begin! player account:{0}, uuid:{1}", account, uuid);
                var lock_key = RedisHelp.BuildPlayerSvrCacheLockKey(account);
                var token = $"lock_{account}";
                try
                {
                    await Login._redis_handle.Lock(lock_key, token, 1000);

                    var key = RedisHelp.BuildPlayerSvrCacheKey(account);
                    var _player_proxy_name = await Login._redis_handle.GetStrData(key);
                    if (string.IsNullOrEmpty(_player_proxy_name))
                    {
                        random_player_svr_rsp(account, session.openid, rsp);
                    }
                    else
                    {
                        var _proxy = Login._player_proxy_mng.get_player(_player_proxy_name);
                        if (_proxy != null)
                        {
                            await Login._redis_handle.Expire(key, RedisHelp.PlayerSvrInfoCacheTimeout);
                            try_player_login(_proxy, account, session.openid, rsp);
                        }
                        else
                        {
                            random_player_svr_rsp(account, session.openid, rsp);
                        }
                    }

                    var gate_key = RedisHelp.BuildPlayerGateCacheKey(account);
                    await Login._redis_handle.SetStrData(gate_key, Hub.Hub._gates.get_client_gate_name(uuid), RedisHelp.PlayerSvrInfoCacheTimeout);
                }
                catch (System.Exception ex)
                {
                    Log.Log.err($"{ex}");
                    rsp.err((int)em_error.db_error);
                }
                finally
                {
                    await Login._redis_handle.UnLock(lock_key, token);
                }
            }
            catch (System.Exception ex)
            {
                Log.Log.err($"{ex}");
                rsp.err((int)em_error.db_error);
            }
        }
    }
}
