using Microsoft.AspNetCore.Identity;
using Newtonsoft.Json;
using StackExchange.Redis;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Abelkhan
{
    public class RedisHandle
    {
        private ConnectionMultiplexer connectionMultiplexer;
        private RedisConnectionHelper _connHelper;
        private IDatabase database;

        public RedisHandle(string connUrl)
        {
            _connHelper = new RedisConnectionHelper(connUrl, "RedisForCache");
            _connHelper.ConnectOnStartup(ref connectionMultiplexer, ref database);
        }

        void Recover(System.Exception e)
        {
            _connHelper.Recover(ref connectionMultiplexer, ref database, e);
        }

        public Task<bool> SetStrData(string key, string data, int timeout)
        {
            while (true)
            {
                try
                {
                    if (timeout != 0)
                    {
                        return database.StringSetAsync(key, data, System.TimeSpan.FromMilliseconds(timeout));
                    }
                    else
                    {
                        return database.StringSetAsync(key, data);
                    }
                }
                catch (RedisTimeoutException e)
                {
                    Recover(e);
                }
            }
        }

        public Task<bool> SetData<T>(string key, T data, int timeout = 0)
        {
            return SetStrData(key, JsonConvert.SerializeObject(data), timeout);
        }

        public Task<RedisValue> GetStrData(string key)
        {
            while (true)
            {
                try
                {
                    return database.StringGetAsync(key);
                }
                catch (RedisTimeoutException e)
                {
                    Recover(e);
                }
            }
        }

        public async Task<T> GetData<T>(string key)
        {
            string json = await GetStrData(key);
            if (string.IsNullOrEmpty(json))
            {
                return default(T);
            }
            return JsonConvert.DeserializeObject<T>(json);
        }

        public bool DelData(string key)
        {
            while (true)
            {
                try
                {
                    return database.KeyDelete(key);
                }
                catch (RedisTimeoutException e)
                {
                    Recover(e);
                }
            }
        }

        public void PushList<T>(string key, T data)
        {
            while (true)
            {
                try
                {
                    database.ListLeftPushAsync(key, JsonConvert.SerializeObject(data));
                    return;
                }
                catch (RedisTimeoutException e)
                {
                    Recover(e);
                }
            }
        }

        public async Task<T> RandomList<T>(string key)
        {
            while (true)
            {
                try
                {
                    var count = await database.ListLengthAsync(key);
                    var index = RandomHelper.RandomInt((int)count);
                    string json = await database.ListGetByIndexAsync(key, index);
                    if (string.IsNullOrEmpty(json))
                    {
                        return default;
                    }
                    return JsonConvert.DeserializeObject<T>(json);
                }
                catch (RedisTimeoutException e)
                {
                    Recover(e);
                }
            }
        }

        public async Task Lock(string key, string token, uint timeout)
        {
            var wait_time = 8;
            while (true)
            {
                try
                {
                    var ret = await database.LockTakeAsync(key, token, System.TimeSpan.FromMilliseconds(timeout));
                    if (!ret)
                    {
                        var task = new TaskCompletionSource();
                        var tasks = new Task[1] { task.Task };
                        Task.WaitAny(tasks, wait_time);
                        wait_time *= 2;
                        continue;
                    }
                    break;
                }
                catch (RedisTimeoutException e)
                {
                    Recover(e);
                }
            }
        }

        public async Task UnLock(string key, string token)
        {
            while (true)
            {
                try
                {
                    await database.LockReleaseAsync(key, token);
                    break;
                }
                catch (RedisTimeoutException e)
                {
                    Recover(e);
                }
            }
        }
    }
}
