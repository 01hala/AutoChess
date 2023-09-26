/*
 * skill_base.ts
 * author: qianqians
 * 2023/9/24
 */
import * as battle from '../battle'

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
    Injured = 10,
    Syncope = 11,
    ChangeSelfLocation = 12,
    ChangeEnemyLocation = 13,
    ReleaseSkill = 14,
}

/*
 * 技能类型
 * Editor:Hotaru
 * 2023.09.25
 */
export enum SkillType
{
    Intensifier = 1,
    Attack = 2,
    Summon = 3,
    Support = 4,
    Economy = 5,
}

export enum Camp {
    None = -1,
    Tie = 0,
    Self = 1,
    Enemy = 2,
}

export class RoleInfo {
    public camp : Camp;
    public index : number;
}

export class Event {
    public type : EventType;
    public spellcaster : RoleInfo;
    public recipient : RoleInfo[];
    public value : number[];
}

export abstract class SkillTriggerBase {
    abstract CheckSkillTrigger(frameEvent: Event[], selfInfo: RoleInfo): boolean;
}

export abstract class SkillBase {
    abstract UseSkill(selfInfo: RoleInfo, battle: battle.Battle): void;
}