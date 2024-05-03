using System.Collections.Generic;
using System.IO;

namespace config
{
    public enum EMRoleShopEvent
    {
        sales = 1,       //出售时
        buy = 2,         //购买时
        update = 3,      //升级时
        food = 4,        //吃食物时
        start_round = 5, //回合开始
        end_round = 6,   //回合结束
        syncope = 7,     //晕厥时
    }

    public static class Config
    {
        public const int FoodIDMin = 1000;
        public const int FoodIDMax = 1999;

        public const int EquipIDMin = 3000;
        public const int EquipIDMax = 3999;

        public static Dictionary<int, RoleConfig> RoleConfigs;
        public static Dictionary<int, List<RoleConfig> > RoleStageConfigs;
        public static Dictionary<int, List<RoleConfig> > RoleGradeConfigs;
        public static Dictionary<int, FoodConfig> FoodConfigs;
        public static Dictionary<int, List<FoodConfig> > FoodStageConfigs;
        public static Dictionary<int, ShopProbabilityConfig> ShopProbabilityConfigs;
        public static Dictionary<int, BufferConfig> BufferConfigs;
        public static Dictionary<int, EquipConfig> EquipConfigs;
        public static Dictionary<int, List<EquipConfig>> EquipStageConfigs;
        public static Dictionary<int, FettersConfig> FettersConfigs;
        public static Dictionary<int, ShopSkillConfig> ShopSkillConfigs;
        public static Dictionary<int, SkillConfig> SkillConfigs;
        public static Dictionary<string, TaskConfig> TaskConfigs;

        public static void Load(string path)
        {
            RoleConfigs = RoleConfig.Load(Path.Combine(path, "Role.json"));
            RoleGradeConfigs = RoleConfig.LoadGrade(RoleConfigs);
            RoleStageConfigs = RoleConfig.LoadStage(RoleConfigs);
            FoodConfigs = FoodConfig.Load(Path.Combine(path, "Food.json"));
            FoodStageConfigs = FoodConfig.LoadStage(FoodConfigs);
            ShopProbabilityConfigs = ShopProbabilityConfig.Load(Path.Combine(path, "ShopProbability.json"));
            BufferConfigs = BufferConfig.Load(Path.Combine(path, "buffer.json"));
            EquipConfigs = EquipConfig.Load(Path.Combine(path, "Equip.json"));
            EquipStageConfigs = EquipConfig.LoadStage(EquipConfigs);
            FettersConfigs = FettersConfig.Load(Path.Combine(path, "Fetters.json"));
            ShopSkillConfigs = ShopSkillConfig.Load(Path.Combine(path, "Shop_Skill.json"));
            SkillConfigs = SkillConfig.Load(Path.Combine(path, "Skill.json"));
            TaskConfigs = TaskConfig.Load(Path.Combine(path, "Task.json"));
        }
    }
}