using System.Collections.Generic;
using System.IO;

namespace config
{
    public enum EMRoleShopEvent
    {
        sales = 1,       //����ʱ
        buy = 2,         //����ʱ
        update = 3,      //����ʱ
        food = 4,        //��ʳ��ʱ
        start_round = 5, //�غϿ�ʼ
        end_round = 6,   //�غϽ���
        syncope = 7,     //����ʱ
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