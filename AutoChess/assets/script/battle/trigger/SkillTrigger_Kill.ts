import { _decorator, Component, debug, log, Node, random } from 'cc';
import { SkillBase,Event, RoleInfo,SkillTriggerBase } from '../skill/skill_base';
import { Camp, EventType, SkillType } from '../../other/enums';
const { ccclass, property } = _decorator;

@ccclass('SkillTrigger_Kill')
export class SkillTrigger_Kill extends SkillTriggerBase {
    public res:string="battle/skill/SkillTrigger_Kill";
    public EventType:EventType=EventType.Kill;

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
                if(EventType.Syncope == element.type){
                    console.log("CheckSkill element:", element, " selfInfo:", selfInfo);
                    if(element.spellcaster==selfInfo){
                        for(let _r of element.recipient){
                            if(_r.camp!=selfInfo.camp){
                                console.log("CheckSkill Kill!");
                                return 1;
                            }
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


