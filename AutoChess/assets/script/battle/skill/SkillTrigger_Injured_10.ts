/*
 * SkillTrigger_Injured_10.ts
 * author: Guanliu
 * 2023/10/1
 * 触发条件：受伤时
 */
import { _decorator, Component, debug, log, Node, random } from 'cc';
import { SkillBase,Event, RoleInfo,SkillTriggerBase } from './skill_base';
import { Battle } from '../battle';
import { Team } from '../team';
import { Role,Property } from '../role';
import { Camp, EventType, SkillType } from '../enums';

export class SkillTrigger_Injured_10 extends SkillTriggerBase
{    
    public res:string="battle/skill/SkillTrigger_Injured_10";
    // public EventType:EventType=EventType.Injured;

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
                if(EventType.Injured==element.type){
                    element.recipient.forEach(_recipient => {
                        if(_recipient==selfInfo) return true;
                    });
                } 
            });

            return false;
        }
        catch (error) 
        {
            console.warn(this.res+"下的 CheckSkill 错误");
        }
    }
}


