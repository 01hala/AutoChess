/*
 * SkillTrigger_BeforeAtk_8.ts
 * author: Guanliu
 * 2023/10/1
 * 触发条件：攻击前
 */
import { _decorator, Component, debug, log, Node, random } from 'cc';
import { SkillBase,Event, RoleInfo,SkillTriggerBase } from '../skill/skill_base';
import { Camp, EventType, SkillType } from '../BattleEnums';

export class SkillTrigger_BeforeAtk extends SkillTriggerBase
{    
    public res:string="battle/skill/SkillTrigger_BeforeAtk";
    public EventType:EventType=EventType.BeforeAttack;

    event:Event=new Event();

    CheckSkillTrigger(frameEvent: Event[], selfInfo: RoleInfo): number {
        try
        {
            return this.CheckSkill(frameEvent,selfInfo);          
        }
        catch (error) 
        {
            console.warn(this.res+"下的 CheckSkillTrigger 错误");            
        }

        return 0;
    }

    private CheckSkill(frameEvent: Event[], selfInfo: RoleInfo): number
    {
        try
        {
            for (let element of frameEvent) {
                if(EventType.BeforeAttack==element.type) 
                {
                    if(element.spellcaster.index == selfInfo.index && element.spellcaster.camp == selfInfo.camp)
                    {
                        console.log("CheckSkillTrigger BeforeAttack!");
                        return 1;
                    }
                }
            }
        }
        catch (error) 
        {
            console.warn(this.res+"下的 CheckSkill 错误");
        }

        return 0;
    }
}


