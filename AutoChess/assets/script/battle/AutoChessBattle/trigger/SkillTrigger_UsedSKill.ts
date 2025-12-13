/*
 * SkillTrigger_UsedSKill_14.ts
 * author: Hotaru
 * 2023/10/01
 * 触发器——释放技能(羁绊)
 */
import { Event, RoleInfo, SkillTriggerBase } from "../skill/skill_base";
import * as enums from '../BattleEnums';

export class SkillTrigger_UsedSKill extends SkillTriggerBase
{
    public res:string="battle/skill/SkillTrigger_UsedSKill.ts";

    CheckSkillTrigger(frameEvent: Event[], selfInfo: RoleInfo): number 
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

    private CheckSkill(frameEvent: Event[], selfInfo: RoleInfo):number
    {
        try 
        {
            for(let b of frameEvent)
            {
                if(enums.EventType.UsedSkill==b.type && 4==selfInfo.Fetters)
                {
                    return 1;
                }
            }
            return 0;
        } 
        catch (error) 
        {
            console.warn(this.res+"下的 CheckSkill 错误");
        }

        return 0;
    }
    
}

