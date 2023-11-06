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

    public enum BufferAndEquipEffect
    {
        AddHP = 1,
        AddAttack = 2,
        AddBuffer = 3,
    }

    public enum EffectScope
    {
        SingleBattle = 1,
        WholeGame = 2,
    }

    public static class Config
    {
        public const int FoodIDMin = 1000;
        public const int FoodIDMax = 1999;

        public static Dictionary<int, RoleConfig> RoleConfigs;
        public static Dictionary<int, List<RoleConfig> > RoleStageConfigs;
        public static Dictionary<int, FoodConfig> FoodConfigs;
        public static Dictionary<int, List<FoodConfig> > FoodStageConfigs;
        public static Dictionary<int, ShopProbabilityConfig> ShopProbabilityConfigs;
        public static Dictionary<int, BufferConfig> BufferConfigs;
        public static Dictionary<int, ShopSkillConfig> ShopSkillConfigs;

        public static void Load(string path)
        {
            RoleConfigs = RoleConfig.Load(Path.Combine(path, "Role.json"));
            RoleStageConfigs = RoleConfig.LoadStage(RoleConfigs);
            FoodConfigs = FoodConfig.Load(Path.Combine(path, "Food.json"));
            FoodStageConfigs = FoodConfig.LoadStage(FoodConfigs);
            ShopProbabilityConfigs = ShopProbabilityConfig.Load(Path.Combine(path, "ShopProbability.json"));
            BufferConfigs = BufferConfig.Load(Path.Combine(path, "buffer.json"));
            ShopSkillConfigs = ShopSkillConfig.Load(Path.Combine(path, "Shop_Skill.json"));
        }
    }
}