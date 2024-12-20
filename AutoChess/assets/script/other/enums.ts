/*
 * enums.ts
 * author: qianqians
 * 2023/9/27
 */

export enum PropsType
{
    None=0,
    Food=1,
    Equip=2,
}

export enum StoreCommodityType
{
    None=0,
    CardPacket=1
}

export enum GameDifficulty
{
    None=0,
    Simple=1,
    Ordinary=2,
    Hard=3
}

export enum Biomes
{
    Sea=1,
    Mountain=2,
    Grassland=3,
    Wind=4,
    Jungle=5,
    Cave=6
}

export enum PageType
{
    Task=1,
    Achieve=2
}

export enum PopUpsType
{
    Other=1,
    Reward=2,
    ConfirmBoard=3
}

export enum GameMode
{
    PVP=1,
    PVE=2
}

export enum SDK_TYPE 
{
    PC = 0,			
    WX = 1, 	
    Default = 2,	
}

export enum SpecialEffect
{
    /** 护盾 */
    Shields=1,
    /** 加属性 */
    AddProperty=2,
    /** 加buff */
    AddBuff=3,
    /** 召唤 */
    Summon=4,
    /** 治疗 */
    Heath=5,
    /** 交换属性 */
    SwapProperties=6,
    /** 加经验 */
    AddExp=7,
    /** 抗伤并减伤 */
    SubstituteDamage=8,
}

export enum SendMseeageType
{
    /** 打开角色简介面板 */
    OpenCardInfo="OpenCardInfo",
    /** 打开羁绊简介面板 */
    OpenFetterInfo="OpenFetterInfo",
    /** 打开角色详细信息面板 */
    OpenInfoBoard="OpenInfoBoard",
    /** 显示提示信息 */
    ShowTip = "ShowTip",
    /** 打开结算界面 */
    OpenSettlement="OpenSettlement",
    /** 打开升阶界面 */
    OpenUpStageBoard="OpenUpStageBoard",
    /** 打开用户信息界面 */
    OpenUserInfoBoard="OpenUserInfoBoard",
    /** 打开任务面板 */
    OpenTaskAchieveBoard="OpenTaskAchieveBoard",
    /** 刷新任务面板 */
    RefreshTaskAchieveBoard="RefreshTaskAchieveBoard",
    /** 打开排行榜面板 */
    OpenRankListBoard="OpenRankListBoard",
    /** 打开弹窗 */
    OpenPopUps="OpenPopUps",
    /** 打开事件选择面板 */
    OpenChooseTag="OpenChooseTag",
    /** 打开关卡信息面板 */
    OpenLevelInfo="OpenLevelInfo"
}

export enum CheckSkillEffectSp
{
    /** 即死 */
    skill_0009="skill_0009",
    /** 转移伤害-前 */
    skill_0013_1="skill_0013_1",
    /** 转移伤害-前 */
    skill_0013_2="skill_0013_2",
    /** 换位 */
    skill_0014="skill_0014",
    /** 受到虚弱效果 */
    skill_0015="skill_0015",
    /**  */
    skill_0016="skill_0016",
    /**  */
    skill_0017="skill_0017",
    /**  */
    skill_0019="skill_0019",
    /**  */
    skill_0023="skill_0023",
    /** 交换属性 */
    skill_0024="skill_0024",
    /**  */
    skill_0026="skill_0026",
    /** 圣光 */
    skill_0027="skill_0027",
}

export enum BuffEffectSp
{
    /** 圣盾 */
    skill_0002="skill_0002",
    /** 护盾 */
    skill_0005="skill_0005",
    /** 减疗 */
    skill_0025="skill_0025",
}