/*
 * SkillTrigger_BattleBegin_7.ts
 * author: Hotaru
 * 2023/10/01
 * 触发器——战斗开始
 */
import { Event, RoleInfo, SkillTriggerBase } from "../skill/skill_base";
import { Camp, EventType, SkillType } from '../../other/enums';

export class SkillTrigger_BattleBegin_7 extends SkillTriggerBase
{
    public res:string="battle/skill/SkillTrigger_BattleBegin_7";

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
            console.log("尝试触发战斗开始触发器事件");
            for(let b of frameEvent)
            {
                if(EventType.BattleBegin==b.type)
                {
                    console.log("CheckSkillTrigger BattleBegin!");
                    return 2;
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

