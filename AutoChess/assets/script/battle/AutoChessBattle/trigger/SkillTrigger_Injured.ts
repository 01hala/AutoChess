/*
 * SkillTrigger_Injured_10.ts
 * author: Guanliu
 * 2023/10/1
 * 触发条件：受伤时
 */
import { _decorator, Component, debug, log, Node, random } from 'cc';
import { SkillBase,Event, RoleInfo,SkillTriggerBase } from '../skill/skill_base';
import * as enums from '../BattleEnums';

export class SkillTrigger_Injured extends SkillTriggerBase
{    
    public res:string="battle/skill/SkillTrigger_Injured.ts";
    public EventType:enums.EventType=enums.EventType.AttackInjured;

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
                if(enums.EventType.AttackInjured==element.type || enums.EventType.RemoteInjured==element.type){
                    for (let _recipient of element.recipient) {
                        if(_recipient.camp == selfInfo.camp && _recipient.index == selfInfo.index) {
                            console.log("受伤技能触发器已触发");
                            return 1;
                        }
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


