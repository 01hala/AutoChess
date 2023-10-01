import { _decorator, Component, error, Node } from 'cc';
import { SkillBase,Event, RoleInfo, SkillTriggerBase } from './skill_base';
import { Camp, EventType, SkillType } from '../enums';
import { Battle } from '../battle';
import { Property, Role } from '../role';
import { random } from '../util';
const { ccclass, property } = _decorator;

@ccclass('Skill_ChangePosition_7')
export class Skill_ChangePosition_7 extends SkillBase {
    public res:string="battle/skill/Skill_ChangePosition_7";
    private battleEvent : Event;

    constructor(){
        super();
        this.battleEvent.type = EventType.ChangeEnemyLocation;
    }


    UseSkill(selfInfo: RoleInfo, battle: Battle): void
    {
        try
        {

        }
        catch(e)
        {
            console.error(this.res + "下的" +  e + "异常");
        }
    }
}


