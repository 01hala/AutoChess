using Abelkhan;
using Microsoft.AspNetCore.DataProtection.KeyManagement;
using Microsoft.AspNetCore.Http;
using Service;
using System;
using System.Threading;
using System.Xml.Linq;

namespace center_svr
{
    class Program
    {
        public static RedisHandle _redis_handle;

        static void Main(string[] args)
        {
            var _center = new Abelkhan.Center(args[0], args[1]);
            _center.on_svr_disconnect += (Abelkhan.SvrProxy _proxy) =>
            {
                Log.Log.err("svr:{0},{1} exception!", _proxy.type, _proxy.name);
            };

            if (!_center._root_cfg.has_key("redis_for_mq_pwd"))
            {
                _redis_handle = new RedisHandle(_center._root_cfg.get_value_string("redis_for_cache"), string.Empty);
            }
            else
            {
                _redis_handle = new RedisHandle(_center._root_cfg.get_value_string("redis_for_cache"), _center._root_cfg.get_value_string("redis_for_mq_pwd"));
            }

            if (_center._config.get_value_bool("init_peak_strength_id"))
            {
                var peak_strength_id = RandomHelper.RandomInt(100);
                _redis_handle.SetData(RedisHelp.BuildPeakStrengthID(), peak_strength_id);
            }

            _center._timer.addloopweekdaytime(System.DayOfWeek.Monday, 0, 0, 0, reset_peak_strength);

            Log.Log.trace("Center start ok");

            _center.run();
        }

        private static async void reset_peak_strength(System.DateTime _)
        {
            try
            {
                var key = RedisHelp.BuildPeakStrengthID();
                var peak_strength_id = await _redis_handle.GetData<long>(key);
                await _redis_handle.SetData(key, ++peak_strength_id);
            }
            catch (System.Exception ex)
            {
                Log.Log.err("reset_peak_strength:{0}", ex);
            }
        }
    }
}
