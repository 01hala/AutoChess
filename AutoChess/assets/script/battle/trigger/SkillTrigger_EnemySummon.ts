import { _decorator, Component, debug, log, Node, random } from 'cc';
import { SkillBase,Event, RoleInfo,SkillTriggerBase } from '../skill/skill_base';
import { Camp, EventType, SkillType } from '../../other/enums';

export class SkillTrigger_EnemySummon extends SkillTriggerBase {
    public res:string="battle/skill/SkillTrigger_EnemySummon";

    CheckSkillTrigger(frameEvent: Event[], selfInfo: RoleInfo): boolean 
    {
        try
        {
            return this.CheckSkill(frameEvent,selfInfo);          
        }
        catch (error) 
        {
            console.warn(this.res+"下的 CheckSkillTrigger 错误");
        }
        
        return false;
    }

    private CheckSkill(frameEvent: Event[], selfInfo: RoleInfo): boolean
    {
        try
        {
            for (let element of frameEvent) {
                if(EventType.Summon == element.type){
                    if(element.spellcaster.camp!=selfInfo.camp){
                        console.log("Check EnemySummon!");
                        return true;
                    }
                } 
            }
        }
        catch (error) 
        {
            console.warn(this.res+"下的 CheckSkill 错误");
        }

        return false;
    }
}


