/*
 * enums.ts
 * author: qianqians
 * 2024/7/19
 */

export enum Property {
    HP = 1,
    TotalHP = 2,
    Attack = 3,
}

export enum EventType 
{
    /** 出售 */
    Sold = 1,     
    /** 购买 */                
    Purchase = 2,
    /** 升级 */                         
    Upgrade = 3,    
    /** 使用道具 */                      
    EatFood = 4,      
    /** 回合开始 */                    
    RoundStarts = 5,   
    /** 回合结束 */                   
    RoundEnd = 6,        
    /** 战斗开始 */                 
    BattleBegin = 7,      
    /** 攻击前 */               
    BeforeAttack = 8,     
    /** 攻击后 */                
    AfterAttack = 9,      
    /** 攻击受伤 */                
    AttackInjured = 10, 
    /** 远程受伤 */                  
    RemoteInjured = 11,   
    /** 晕厥倒下 */                
    Syncope = 12,       
    /** 位置改变 */                  
    ChangeLocation = 13,  
    /** 召唤 */                
    Summon = 14,         
    /** 战斗失败 */                 
    BattleFail=15,    
    /** 使用技能*/                    
    UsedSkill=16,    
    /** 交换属性 */                     
    SwapProperties = 17,
    /** 属性强化 */                  
    IntensifierProperties = 18,
    /** 退场 */           
    Exit = 19,             
    /** 队友受伤 */               
    FriendlysideInjured=20,   
    /** 击败 */            
    Kill=21,         
    /** 前方攻击 */                     
    FrontAtk=22,     
    /** 经验提升 */                     
    IntensifierExp = 23, 
    /** 我方前排为空 */                 
    SelfFrontNull = 24,     
    /** 敌方前排为空 */              
    EnemyFrontNull=25, 
    /** 强制战斗 */
    ForcedAttack=26,
    /** 护盾 */
    GiveShields=27,
    /** 添加buff */
    AddBuff=28,
    /** 代替某角色承受伤害 */
    SubstituteDamage=29,
    /** 受伤前 */
    BeforeHurt=30,
    /** 重复使用一次技能 */
    RepeatSkill=31,
    /** 转移的伤害 */
    TransferInjured=31,
}

export enum ChangeLocationType {
    AssignChange = 1,
    RandomChange = 2,
    BackChange = 3,
} 

export enum SwapPropertiesType {
    SelfSwap = 1,
    AssignSwap = 2,
    RandomSwap = 3,
    /** 把攻击交换到生命值 */
    AttackSwap=4,   
    /** 把生命值交换到攻击 */
    HpSwap=5,
}

export enum SkillType
{
    Intensifier = 1,
    Attack = 2,
    Summon = 3,
    Support = 4,
    Economy = 5,
    SwapProperties=6,
}

export enum BufferType {
    InevitableKill = 1,
    ShareDamage = 2,
    OffsetDamage = 3,
    Weak = 4,
    ReductionDamage = 5,
    Strength = 6,
    Shields = 7,
}

export enum Camp {
    None = -1,
    Tie = 0,
    Self = 1,
    Enemy = 2,
}
