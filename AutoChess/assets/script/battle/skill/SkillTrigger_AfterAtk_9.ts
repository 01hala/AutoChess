/*
 * SkillTrigger_AfterAtk_9.ts
 * author: Guanliu
 * 2023/10/1
 * 触发条件：攻击前
 */
import { _decorator, Component, debug, log, Node, random } from 'cc';
import { SkillBase,Event, RoleInfo,SkillTriggerBase } from './skill_base';
import { Camp, EventType, SkillType } from '../enums';

export class SkillTrigger_AfterAtk_9 extends SkillTriggerBase
{    
    public res:string="battle/skill/SkillTrigger_AfterAtk_9";
    public EventType:EventType=EventType.AfterAttack;

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
    }

    private CheckSkill(frameEvent: Event[], selfInfo: RoleInfo): boolean
    {
        try
        {
            frameEvent.forEach((element)=>{
                if(EventType.AfterAttack==element.type&&element.spellcaster==selfInfo) 
                    return true; 
            });

            return false;
        }
        catch (error) 
        {
            console.warn(this.res+"下的 CheckSkill 错误");
        }
    }
}


