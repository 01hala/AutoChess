import { _decorator, Component, error, Node } from 'cc';
import { SkillBase,Event, RoleInfo, SkillTriggerBase } from './skill_base';
import { Camp, EventType, SkillType } from '../enums';
import { Battle } from '../battle';
import { Property, Role } from '../role';
import { ChangePositionType } from '../enums';
import { random } from '../util';
const { ccclass, property } = _decorator;

@ccclass('Skill_ChangePosition_7')
export class Skill_ChangePosition_7 extends SkillBase {
    public res:string="battle/skill/Skill_ChangePosition_7";

    private index1:number;
    private index2:number;
    private changeType : ChangePositionType;

    constructor(priority:number, changeType : ChangePositionType, change1:number, change2:number)
    {
        super(priority);

        this.changeType = changeType;
        this.index1=change1;
        this.index2=change2;
    }


    UseSkill(selfInfo: RoleInfo, battle: Battle): void
    {
        try
        {
            let battleEvent : Event = new Event();
            battleEvent.type = EventType.ChangeEnemyLocation;
            battleEvent.spellcaster = selfInfo;
            battleEvent.recipient = [];
            battleEvent.value = [];

            let originalRoleList:Role[] = null;
            if(Camp.Self==selfInfo.camp)
            {
                originalRoleList=battle.GetEnemyTeam().GetRoles().slice();
            }
            if(Camp.Enemy==selfInfo.camp)
            {
                originalRoleList=battle.GetSelfTeam().GetRoles().slice();
            }

            if(ChangePositionType.AssignChange == this.changeType)
            {
                let begin = originalRoleList[this.index1];
                let end = originalRoleList[this.index2];
                originalRoleList[this.index1] = end;
                originalRoleList[this.index2] = begin;
                let recipient = new RoleInfo();
                recipient.index = this.index1;
                recipient.camp = begin.selfCamp;
                battleEvent.recipient.push(recipient);
                recipient = new RoleInfo();
                recipient.index = this.index2;
                recipient.camp = begin.selfCamp;
                battleEvent.recipient.push(recipient);
                battleEvent.value.push(this.index1);
                battleEvent.value.push(this.index2);
            }
            else if(ChangePositionType.RandomChange == this.changeType)
            {
                let recipientRoles:number[] = [];
                while(recipientRoles.length < 2) {
                    let index = random(0, originalRoleList.length);
                    if (index in recipientRoles) {
                        continue;
                    }
                    recipientRoles.push(index);
                }
                let begin = originalRoleList[recipientRoles[0]];
                let end = originalRoleList[recipientRoles[1]];
                originalRoleList[recipientRoles[0]] = end;
                originalRoleList[recipientRoles[1]] = begin;
                let recipient = new RoleInfo();
                recipient.index = recipientRoles[0];
                recipient.camp = begin.selfCamp;
                battleEvent.recipient.push(recipient);
                recipient = new RoleInfo();
                recipient.index = recipientRoles[1];
                recipient.camp = begin.selfCamp;
                battleEvent.recipient.push(recipient);
                battleEvent.value.push(recipientRoles[0]);
                battleEvent.value.push(recipientRoles[1]);
            }
            battle.AddBattleEvent(battleEvent);
        }
        catch(e)
        {
            console.error(this.res + "下的" +  e + "异常");
        }
    }
}



