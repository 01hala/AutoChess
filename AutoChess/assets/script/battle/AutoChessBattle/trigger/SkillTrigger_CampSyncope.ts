/*
 * SkillTrigger_CampSyncope.ts
 * author: 未知
 * 2023/10/1
 * 触发条件：队伍里有角色晕厥
 */
import { _decorator, Component, debug, log, Node, random } from 'cc';
import { SkillBase,Event, RoleInfo,SkillTriggerBase } from '../skill/skill_base';
import * as enums from '../BattleEnums';
const { ccclass, property } = _decorator;

@ccclass('SkillTrigger_CampSyncope')
export class SkillTrigger_CampSyncope extends SkillTriggerBase {
    public res:string="battle/skill/SkillTrigger_CampSyncope";
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
            for (let element of frameEvent) {
                if(enums.EventType.Syncope == element.type){
                    //console.log("CheckSkill element:", element, " selfInfo:", selfInfo);
                    if(element.spellcaster.camp == selfInfo.camp) {
                        console.log("CheckSkill CampSyncope!");
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


