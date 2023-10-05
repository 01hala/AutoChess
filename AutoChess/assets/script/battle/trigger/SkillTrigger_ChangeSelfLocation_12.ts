import { _decorator, Component, debug, log, Node, random } from 'cc';
import { SkillBase,Event, RoleInfo,SkillTriggerBase } from '../skill/skill_base';
import { Camp, EventType, SkillType } from '../enums';
const { ccclass, property } = _decorator;

@ccclass('SkillTrigger_ChangeSelfLocation_12')
export class SkillTrigger_ChangeSelfLocation_12 extends SkillTriggerBase {
    public res:string="battle/skill/SkillTrigger_ChangeSelfLocation_12";
    
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
                if(EventType.ChangeLocation == element.type){
                    for (let _recipient of element.recipient) {
                        if(_recipient.camp == selfInfo.camp && _recipient.index == selfInfo.index) {
                            return true;
                        }
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


