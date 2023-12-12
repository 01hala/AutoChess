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
        start_round = 1,     //������ʼʱ
        end_round = 2,       //��������ʱ
        start_battle = 3,    //ս����ʼʱ
        buy = 4,             //����ʱ
        sales = 5,           //����ʱ
        camp_sales = 6,      //�ѷ�����ʱ
        update = 7,          //������
        syncope = 8,         //����ʱ
        camp_syncope = 9,    //�������ʱ
        strengthen = 10,     //�ܵ�ǿ��ʱ
        use_skill = 11,      //�ͷż��ܺ�
        eat_food = 12,       //�Ե�ʳ��ʱ
        camp_eat_food = 13,  //�ѷ��Ե�ʳ��ʱ
        kill = 14,           //������
        front_attack = 15,   //ǰ����鹥��ʱ
        camp_attack3 = 16,   //�ѷ��������κ�
        front_attack3 = 17,  //ǰ���������κ�
        be_hurt = 18,        //����ʱ
        camp_be_hurt = 19,   //�ѷ�����ʱ
        enemy_summon = 20,   //���˱��ٻ����ƶ�ʱ
        camp__summon = 21,   //��鱻�ٻ�ʱ
        front_be_hurt = 22,  //ǰ���������ʱ
        before_attack = 23,  //����ǰ
    }

    public enum EMRoleShopEvent
    {
        sales = 1,       //����ʱ
        buy = 2,         //����ʱ
        update = 3,      //����ʱ
        food = 4,        //��ʳ��ʱ
        start_round = 5, //�غϿ�ʼ
        end_round = 6,   //�غϽ���
        syncope = 7,     //����ʱ
        refresh = 8,     //�̵����ʱ
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