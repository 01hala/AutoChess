import { _decorator, Component, debug, log, Node, random } from 'cc';
import { SkillBase,Event, RoleInfo,SkillTriggerBase } from '../skill/skill_base';
import { Camp, EventType, SkillType } from '../../other/enums';
const { ccclass, property } = _decorator;

@ccclass('SkillTrigger_CampSyncope')
export class SkillTrigger_CampSyncope extends SkillTriggerBase {
    public res:string="battle/skill/SkillTrigger_CampSyncope";
    public EventType:EventType=EventType.Syncope;

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
                if(EventType.Syncope == element.type){
                    console.log("CheckSkill element:", element, " selfInfo:", selfInfo);
                    if(element.spellcaster.camp == selfInfo.camp) {
                        console.log("CheckSkill CampSyncope!");
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


