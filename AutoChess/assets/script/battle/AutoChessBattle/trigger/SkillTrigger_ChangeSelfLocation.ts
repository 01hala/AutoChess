import { _decorator, Component, debug, log, Node, random } from 'cc';
import { SkillBase,Event, RoleInfo,SkillTriggerBase } from '../skill/skill_base';
import * as enums from '../BattleEnums';
const { ccclass, property } = _decorator;

@ccclass('SkillTrigger_ChangeSelfLocation_12')
export class SkillTrigger_ChangeSelfLocation extends SkillTriggerBase {
    public res:string="battle/skill/SkillTrigger_ChangeSelfLocation.ts";
    
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
                if(enums.EventType.ChangeLocation == element.type){
                    for (let _recipient of element.recipient) {
                        if(_recipient.camp == selfInfo.camp && _recipient.index == selfInfo.index) {
                            return 1;
                        }
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


