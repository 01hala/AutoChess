/*
 * SkillTrigger_RoundStarts_5.ts
 * author: Hotaru
 * 2023/10/01
 * 触发器——回合开始
 */
import { Event, RoleInfo, SkillTriggerBase } from "../skill/skill_base";
import { Camp, EventType, SkillType } from '../../other/enums';

export class SkillTrigger_RoundStarts_5 extends SkillTriggerBase
{
    public res:string="battle/skill/SkillTrigger_RoundStarts_5";

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
                if(EventType.RoundStarts==b.type)
                {
                    console.log(`SkillTrigger_RoundStarts_5 selfInfo${selfInfo}`)
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

