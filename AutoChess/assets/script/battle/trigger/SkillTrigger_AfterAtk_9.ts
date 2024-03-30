/*
 * SkillTrigger_AfterAtk_9.ts
 * author: Guanliu
 * 2023/10/1
 * 触发条件：攻击前
 */
import { _decorator, Component, debug, log, Node, random } from 'cc';
import { SkillBase,Event, RoleInfo,SkillTriggerBase } from '../skill/skill_base';
import { Camp, EventType, SkillType } from '../../other/enums';

export class SkillTrigger_AfterAtk_9 extends SkillTriggerBase
{    
    public res:string="battle/skill/SkillTrigger_AfterAtk_9";
    public EventType: EventType[];

    event:Event=new Event();

    constructor(){
        super();
        this.EventType.push(EventType.AfterAttack);
    }

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
                if(EventType.AfterAttack==element.type) {
                    return 1;
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


