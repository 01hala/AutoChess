/*
 * SkillTrigger_Syncope_11.ts
 * author: 未知
 * 2023/10/01
 * 触发器——角色晕厥
 */
import { _decorator, Component, debug, log, Node, random } from 'cc';
import { SkillBase,Event, RoleInfo,SkillTriggerBase } from '../skill/skill_base';
import * as enums from '../BattleEnums';
const { ccclass, property } = _decorator;

@ccclass('SkillTrigger_Syncope_11')
export class SkillTrigger_Syncope extends SkillTriggerBase {
    public res:string="battle/skill/SkillTrigger_Syncope.ts";
    public EventType:enums.EventType=enums.EventType.Syncope;

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
            console.log(frameEvent);
            for (let element of frameEvent) {
                //console.log("CheckSkill element:", element, " selfInfo:", selfInfo);
                if(enums.EventType.Syncope == element.type)
                {
                    //console.log("CheckSkill Syncope element:", element, " selfInfo:", selfInfo);
                    if(element.spellcaster.camp == selfInfo.camp && element.spellcaster.index == selfInfo.index) 
                    {
                        console.log("CheckSkill Syncope!");
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


