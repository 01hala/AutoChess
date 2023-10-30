using System.Collections.Generic;
using System.IO;

namespace config
{
    public static class Config
    {
        public static Dictionary<int, RoleConfig> RoleConfigs;
        public static Dictionary<int, BufferConfig> BufferConfigs;

        public static void Load(string path)
        {
            RoleConfigs = RoleConfig.Load(Path.Combine(path, "Role.json"));
            BufferConfigs = BufferConfig.Load(Path.Combine(path, "buffer.json"));
        }
    }
}