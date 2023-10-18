import { _decorator, Component, debug, log, Node, random } from 'cc';
import { SkillBase,Event, RoleInfo,SkillTriggerBase } from '../skill/skill_base';
import { Camp, EventType, SkillType } from '../../other/enums';
const { ccclass, property } = _decorator;

@ccclass('SkillTrigger_Syncope_11')
export class SkillTrigger_Syncope_11 extends SkillTriggerBase {
    public res:string="battle/skill/SkillTrigger_Syncope_11";
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


