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
        Syncope = 4,
    }

    public enum EffectScope
    {
        SingleBattle = 1,
        WholeGame = 2,
    }

    public enum EMSkillEvent
    {
        start_round = 1,     //休整开始时
        end_round = 2,       //休整结束时
        start_battle = 3,    //战斗开始时
        buy = 4,             //购买时
        sales = 5,           //出售时
        camp_sales = 6,      //友方出售时
        update = 7,          //升级后
        syncope = 8,         //晕厥时
        camp_syncope = 9,    //伙伴晕厥时
        strengthen = 10,     //受到强化时
        use_skill = 11,      //释放技能后
        eat_food = 12,       //吃掉食物时
        camp_eat_food = 13,  //友方吃掉食物时
        kill = 14,           //击倒后
        front_attack = 15,   //前方伙伴攻击时
        camp_attack3 = 16,   //友方攻击三次后
        front_attack3 = 17,  //前方攻击三次后
        be_hurt = 18,        //受伤时
        camp_be_hurt = 19,   //友方受伤时
        enemy_summon = 20,   //敌人被召唤或推动时
        camp__summon = 21,   //伙伴被召唤时
        front_be_hurt = 22,  //前方伙伴受伤时
        before_attack = 23,  //攻击前
    }

    public enum EMRoleShopEvent
    {
        sales = 1,       //出售时
        buy = 2,         //购买时
        update = 3,      //升级时
        food = 4,        //吃食物时
        start_round = 5, //回合开始
        end_round = 6,   //回合结束
        syncope = 7,     //晕厥时
        refresh = 8,     //商店更新时
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
        public static Dictionary<int, FettersConfig> FettersConfigs;
        public static Dictionary<int, ShopSkillConfig> ShopSkillConfigs;

        public static void Load(string path)
        {
            RoleConfigs = RoleConfig.Load(Path.Combine(path, "Role.json"));
            RoleStageConfigs = RoleConfig.LoadStage(RoleConfigs);
            FoodConfigs = FoodConfig.Load(Path.Combine(path, "Food.json"));
            FoodStageConfigs = FoodConfig.LoadStage(FoodConfigs);
            ShopProbabilityConfigs = ShopProbabilityConfig.Load(Path.Combine(path, "ShopProbability.json"));
            BufferConfigs = BufferConfig.Load(Path.Combine(path, "buffer.json"));
            FettersConfigs = FettersConfig.Load(Path.Combine(path, "Fetters.json"));
            ShopSkillConfigs = ShopSkillConfig.Load(Path.Combine(path, "Shop_Skill.json"));
        }
    }
}