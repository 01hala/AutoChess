﻿
namespace Abelkhan
{
    public class RedisHelp
    {
        static public string BuildPlayerSvrInfoCacheKey(string player_hub_name)
        {
            return $"Svr:PlayerSvrInfoCache:{player_hub_name}";
        }

        static public string BuildPlayerGateCacheKey(string sdk_uuid)
        {
            return $"Player:GateSDKUUIDCache:{sdk_uuid}";
        }

        static public string BuildPlayerSDKUUIDCacheKey(string uuid)
        {
            return $"Player:PlayerUUIDSDKUUIDCache:{uuid}";
        }

        static public string BuildPlayerSvrCacheLockKey(string sdk_uuid)
        {
            return $"Player:PlayerSDKUUIDLockCache:{sdk_uuid}";
        }

        static public string BuildPlayerSvrCacheKey(string sdk_uuid)
        {
            return $"Player:PlayerSDKUUIDCache:{sdk_uuid}";
        }

        static public string BuildPlayerGuidCacheKey(long guid)
        {
            return $"Player:PlayerGuidCache:{guid}";
        }

        static public string BuildPlayerMatchSvrCache(long guid)
        {
            return $"Player:PlayerMatchCache:{guid}";
        }

        static public string BuildAutoChessBattleCache(int round)
        {
            return $"AutoChess:battle:{round}";
        }

        static public string BuildPlayerPeakStrengthCache(long guid)
        {
            return $"AutoChess:Player:Peak:Strength:{guid}";
        }

        static public string BuildPlayerPeakStrengthFormationCache(long guid)
        {
            return $"AutoChess:Player:Peak:Strength:Formation:{guid}";
        }

        static public string BuildPeakStrengthCache()
        {
            return $"AutoChess:Peak:Strength";
        }

        static public int PlayerSvrInfoCacheTimeout = 1000 * 60 * 30;

        static public int PlayerMatchSvrCacheTimeout = 1000 * 60 * 30;
    }
}
