using System.Collections.Generic;
using System.IO;

namespace config
{
    public enum Priority
    {
        Low = 1,
        Normal = 2,
        Hight = 3,
    }

    public enum Direction
    {
        None = 0,
        Forward = 1,
        Back = 2,
        Rigiht = 3,
        Left = 4,
        Self = 5,
    }

    public static class Config
    {
        public static Dictionary<int, RoleConfig> RoleConfigs;
        public static Dictionary<int, BufferConfig> BufferConfigs;
        public static Dictionary<int, ShopSkillConfig> ShopSkillConfigs;

        public static void Load(string path)
        {
            RoleConfigs = RoleConfig.Load(Path.Combine(path, "Role.json"));
            BufferConfigs = BufferConfig.Load(Path.Combine(path, "buffer.json"));
            ShopSkillConfigs = ShopSkillConfig.Load(Path.Combine(path, "Shop_Skill.json"));
        }
    }
}