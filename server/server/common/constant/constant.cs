using Microsoft.IO;

namespace Constant
{
    public class Constant
    {
        public static readonly string player_db_name = "tsxs";

        public static readonly string player_db_collection = "player";

        public static readonly string player_db_offline_msg_collection = "offline_msg";

        public static readonly string player_db_guid_collection = "guid";

        public static readonly string player_db_guid_rank = "rank";

        public const long RedisMQTickTime = 33;
    }

}
