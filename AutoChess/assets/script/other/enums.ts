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
}