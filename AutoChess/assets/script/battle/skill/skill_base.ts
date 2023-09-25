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
    Attack = 9,
    Injured = 10,
    Syncope = 11,
    Fall = 12,
    ChangeSelfLocation = 13,
    ChangeEnemyLocation = 14,
    AfterAttack = 15,
    ReleaseSkill = 16,
}

export enum Camp {
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
    public recipient : RoleInfo;
    public value : number[];
}

export abstract class SkillBase {
    abstract CheckSkillTrigger(frameEvent: Event[], selfInfo: RoleInfo): boolean;
    abstract UseSkill(selfInfo: RoleInfo, battle: battle.Battle): void;
}