import { _decorator, Component, Node } from 'cc';
import { Event, RoleInfo, SkillTriggerBase } from '../skill/skill_base';
import * as enums from '../BattleEnums';
import { Direction } from '../common';
import * as battle from '../battle'

/**
 * 触发器——升级时
 * author: Hotaru
 * 2023/09/09
 */
export class SkillTirgger_Upgrade extends SkillTriggerBase
{
    public res:string="battle/skill/SkillTirgger_SkillTirgger_Upgrade.ts";
    public EventType:enums.EventType=enums.EventType.Upgrade;

    CheckSkillTrigger(frameEvent: Event[], selfInfo: RoleInfo, battle?: battle.Battle): number
    {
        try
        {
            return this.CheckSkill(frameEvent,selfInfo, battle);          
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
            for (let element of frameEvent) 
            {
                if(enums.EventType.Upgrade == element.type && element.spellcaster.index == selfInfo.index)
                {
                    return 1;
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
    


