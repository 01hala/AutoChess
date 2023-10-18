/*
 * SkillTrigger_BeforeAtk_8.ts
 * author: Guanliu
 * 2023/10/1
 * 触发条件：攻击前
 */
import { _decorator, Component, debug, log, Node, random } from 'cc';
import { SkillBase,Event, RoleInfo,SkillTriggerBase } from '../skill/skill_base';
import { Camp, EventType, SkillType } from '../../other/enums';

export class SkillTrigger_BeforeAtk_8 extends SkillTriggerBase
{    
    public res:string="battle/skill/SkillTrigger_BeforeAtk_8";
    public EventType:EventType=EventType.BeforeAttack;

    event:Event=new Event();

    CheckSkillTrigger(frameEvent: Event[], selfInfo: RoleInfo): boolean {
        try
        {
            return this.CheckSkill(frameEvent,selfInfo);          
        }
        catch (error) 
        {
            console.warn(this.res+"下的 CheckSkillTrigger 错误");            
        }

        return false;
    }

    private CheckSkill(frameEvent: Event[], selfInfo: RoleInfo): boolean
    {
        try
        {
            for (let element of frameEvent) {
                if(EventType.BeforeAttack==element.type) {
                    return true;
                }
            }
        }
        catch (error) 
        {
            console.warn(this.res+"下的 CheckSkill 错误");
        }

        return false;
    }
}


