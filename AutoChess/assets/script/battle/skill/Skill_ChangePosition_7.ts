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
    private changeType : ChangePositionType;

    constructor(priority:number, changeType : ChangePositionType)
    {
        super(priority);
        this.changeType = changeType;
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

            if(ChangePositionType.FrontEndChange == this.changeType)
            {
                let begin = originalRoleList[0];
                let end = originalRoleList[-1];
                originalRoleList[0] = end;
                originalRoleList[-1] = begin;
                let recipient = new RoleInfo();
                recipient.index = 0;
                recipient.camp = begin.selfCamp;
                battleEvent.recipient.push(recipient);
                recipient = new RoleInfo();
                recipient.index = originalRoleList.length - 1;
                recipient.camp = begin.selfCamp;
                battleEvent.recipient.push(recipient);
                battleEvent.value.push(0);
                battleEvent.value.push(originalRoleList.length - 1);
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



