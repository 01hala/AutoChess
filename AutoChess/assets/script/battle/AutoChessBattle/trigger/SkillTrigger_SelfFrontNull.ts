import { _decorator, Component, Node } from 'cc';
import { Event, RoleInfo, SkillTriggerBase } from '../skill/skill_base';
import * as enums from '../BattleEnums';
import { Direction } from '../common';
import * as battle from '../battle'

/**
 * 触发条件：前排为空
 * author: Hotaru
 * 2024/07/19添加
 * SkillTrigger_FrontNull.ts
 */
export class SkillTrigger_SelfFrontNull extends SkillTriggerBase
{
    public res:string="battle/skill/SkillTrigger_SelfFrontNull.ts ";
    public EventType:enums.EventType=enums.EventType.SelfFrontNull;

    constructor(){
        super();
    }

    CheckSkillTrigger(frameEvent: Event[], selfInfo: RoleInfo , battle?:battle.Battle): number
    {
        try
        {
            return this.CheckSkill(frameEvent,selfInfo,battle);          
        }
        catch (error) 
        {
            console.warn(this.res+"下的 CheckSkillTrigger 错误");            
        }

        return 0;
    }
    
    CheckSkill(frameEvent: Event[], selfInfo: RoleInfo , battle:battle.Battle) : number
    {
        try
        {
            let selfTeam = battle.GetSelfTeam();
            for (let element of frameEvent) 
            {
                if(enums.EventType.SelfFrontNull == element.type)
                {
                    if(selfTeam.CheckFront())
                    {
                        return 1;
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


