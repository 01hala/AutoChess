/*
 * killTrigger_FrontInjured_10.ts
 * author: Hotaru
 * 2024/08/13
 * 触发条件：前方受伤时
 */
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;
import * as enums from '../BattleEnums';
import { Event, RoleInfo, SkillTriggerBase } from '../skill/skill_base';
import { Battle } from '../battle';

@ccclass('SkillTrigger_FrontInjured')
export class SkillTrigger_FrontInjured extends SkillTriggerBase
{
    public res:string="battle/skill/SkillTrigger_FrontInjured.ts";

    CheckSkillTrigger(frameEvent: Event[], selfInfo: RoleInfo, battle?: Battle): number
    {
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
            for (let element of frameEvent)
                {
                    if(enums.EventType.AttackInjured==element.type || enums.EventType.RemoteInjured==element.type)
                    {
                        for (let _recipient of element.recipient)
                        {
                            if(_recipient.camp == selfInfo.camp && _recipient.index == selfInfo.index-3)
                            {
                                console.log("前方队友受伤技能触发器已触发");
                                return 1;
                            }
                        }
                    }
                }
        }
       catch(error)
       {
            console.warn(this.res+"下的 CheckSkill 错误");
       }
       return 0;
    }
}


