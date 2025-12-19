using Abelkhan;
using Amazon.Util.Internal;
using config;
using InfluxData.Net.Common.Helpers;
using Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

// to do 
namespace Match
{
    public class peak_strength_player
    {
        public long LastActiveTime = Timerservice.Tick;

        private long guid;
        public long GUID
        {
            get
            {
                return guid;
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

        private string player_hub_name;
        public string PlayerHubName
        {
            get
            {
                return player_hub_name;
            }
        }

        public peak_strength_player(string _player_hub_name, string _clientUUID, long _guid) 
        {
            player_hub_name = _player_hub_name;
            clientUUID = _clientUUID;
            guid = _guid;
        }
    }

    public class peak_strength_mng
    {
        private Dictionary<string, peak_strength_player> peak_strength_battles = new();

        public peak_strength_mng()
        {
            Hub.Hub._timer.addticktime(5 * 60 * 1000, tick_clear_timeout_player);
        }

        private void tick_clear_timeout_player(long tick_time)
        {
            List<peak_strength_player> timeout_battle_player = new();
            foreach (var it in peak_strength_battles)
            {
                if ((it.Value.LastActiveTime + 30 * 60 * 1000) < Timerservice.Tick)
                {
                    timeout_battle_player.Add(it.Value);
                }
                else
                {
                    it.Value.LastActiveTime = Timerservice.Tick;
                }
            }
            foreach (var _player in timeout_battle_player)
            {
                peak_strength_battles.Remove(_player.ClientUUID);
            }

            Hub.Hub._timer.addticktime(5 * 60 * 1000, tick_clear_timeout_player);
        }

        public peak_strength_player add_player_to_battle(string player_hub_name, string clientUUID, long guid)
        {
            Log.Log.trace("peak_strength_mng add_player_to_battle player_hub_name:{0} clientUUID:{1} guid:{2}", player_hub_name, clientUUID, guid);
            var _player = new peak_strength_player(player_hub_name, clientUUID, guid);
            peak_strength_battles[clientUUID] = _player;
            return _player;
        }

        public bool change_player_uuid(string old_client_uuid, string new_client_uuid)
        {
            if (peak_strength_battles.Remove(old_client_uuid, out var _player))
            {
                _player.ClientUUID = new_client_uuid;
                peak_strength_battles[new_client_uuid] = _player;
            }

            return true;
        }

        public peak_strength_player get_battle_player(string clientUUID)
        {
            Log.Log.trace("peak_strength_mng get_battle_player peak_strength_battles:{0} clientUUID:{1}", peak_strength_battles.ToJson(), clientUUID);
            if (peak_strength_battles.TryGetValue(clientUUID, out var _player))
            {
                _player.LastActiveTime = Timerservice.Tick;
            }
            return _player;
        }
    }
}
