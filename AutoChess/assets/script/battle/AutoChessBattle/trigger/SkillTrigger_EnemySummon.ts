import { _decorator, Component, debug, log, Node, random } from 'cc';
import { SkillBase,Event, RoleInfo,SkillTriggerBase } from '../skill/skill_base';
import * as enums from '../BattleEnums';

export class SkillTrigger_EnemySummon extends SkillTriggerBase {
    public res:string="battle/skill/SkillTrigger_EnemySummon";

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

    private CheckSkill(frameEvent: Event[], selfInfo: RoleInfo): number
    {
        try
        {
            for (let element of frameEvent) {
                if(enums.EventType.Summon == element.type){
                    if(element.spellcaster.camp!=selfInfo.camp){
                        console.log("Check EnemySummon!");
                        return 1;
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


