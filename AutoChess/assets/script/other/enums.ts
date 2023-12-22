/*
 * enums.ts
 * author: qianqians
 * 2023/9/27
 */

export enum Property {
    HP = 1,
    TotalHP = 2,
    Attack = 3,
}

export enum EventType {
    Sold = 1,
    Purchase = 2,
    Upgrade = 3,
    EatFood = 4,
    RoundStarts = 5,
    RoundEnd = 6,
    BattleBegin = 7,
    BeforeAttack = 8,
    AfterAttack = 9,
    AttackInjured = 10,
    RemoteInjured = 11,
    Syncope = 12,
    ChangeLocation = 13,
    Summon = 14,
    BattleFail=15,
    UsedSkill=16,
    SwapProperties = 17,
    IntensifierProperties = 18,
    Exit = 19,
    FriendlysideInjured=20,
}

export enum ChangePositionType {
    AssignChange = 1,
    RandomChange = 2,
} 

export enum SwapPropertiesType {
    SelfSwap = 1,
    AssignSwap = 2,
    RandomSwap = 3,
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
    SubstituteDamageFront = 3,
    SubstituteDamageRandom = 4,
    ReductionDamage = 5,
    intensifierAtk = 6,
    Shields = 7,
}

export enum Camp {
    None = -1,
    Tie = 0,
    Self = 1,
    Enemy = 2,
}

export enum PropsType
{
    None=0,
    Food=1,
}
