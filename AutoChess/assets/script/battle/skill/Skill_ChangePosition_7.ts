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
    private battleEvent : Event = new Event();
    private newRoleList : Role[] = [];

    constructor(recipients : RoleInfo[])
    {
        super();
        this.battleEvent.type = EventType.ChangeEnemyLocation;
        this.battleEvent.recipient = recipients;
        this.battleEvent.value = null;
    }


    UseSkill(selfInfo: RoleInfo, battle: Battle): void
    {
        try
        {
            this.battleEvent.spellcaster = selfInfo;
            let originalRoleList = battle.GetEnemyTeam().GetRoles();
            if(this.battleEvent.recipient.length == 1)
            {
                this.newRoleList = originalRoleList.slice(1,originalRoleList.length);
                this.newRoleList.unshift(originalRoleList[0]);
                originalRoleList = this.newRoleList;
            }
            else if(this.battleEvent.recipient.length == 2)
            {
                let tempRole = originalRoleList[this.battleEvent.recipient[0].index];
                originalRoleList[this.battleEvent.recipient[0].index] = originalRoleList[this.battleEvent.recipient[1].index];
                originalRoleList[this.battleEvent.recipient[1].index] = tempRole;
            }
            battle.AddBattleEvent(this.battleEvent);
        }
        catch(e)
        {
            console.error(this.res + "下的" +  e + "异常");
        }
    }
}



