/*
 * skill_base.ts
 * author: qianqians
 * 2023/9/24
 */
import * as enums from '../../other/enums'
import * as battle from '../battle'

export class RoleInfo {
    public hp:number;
    public attack:number;
    public camp : enums.Camp;
    public index : number;
    public battleCount : number;
    public Fetters:number;
}

export class Event {
    public type : enums.EventType;
    public spellcaster : RoleInfo;
    public recipient : RoleInfo[];
    public value : number[];
}

export abstract class SkillTriggerBase {
    abstract CheckSkillTrigger(frameEvent: Event[], selfInfo: RoleInfo): boolean;
}

export abstract class SkillBase {
    public Priority : number = 0;
    public constructor(priority:number) {
        this.Priority = priority
    }

    abstract UseSkill(selfInfo: RoleInfo, battle: battle.Battle): void;
}