/*
 * SkillTrigger_Kill.ts
 * author: 未知
 * 2023/10/01
 * 触发器——击败敌人
 */
import { _decorator, Component, debug, log, Node, random } from 'cc';
import { SkillBase,Event, RoleInfo,SkillTriggerBase } from '../skill/skill_base';
import * as enums from '../BattleEnums';
const { ccclass, property } = _decorator;

@ccclass('SkillTrigger_Kill')
export class SkillTrigger_Kill extends SkillTriggerBase {
    public res:string="battle/skill/SkillTrigger_Kill.ts";
    public EventType:enums.EventType=enums.EventType.Kill;

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
            for (let element of frameEvent)
            {
                if (enums.EventType.Syncope == element.type)
                {
                    //console.log("CheckSkill element:", element, " selfInfo:", selfInfo);
                    // if (element.spellcaster == selfInfo)
                    // {
                    //     for (let _r of element.recipient)
                    //     {
                    //         if (_r.camp != selfInfo.camp)
                    //         {
                    //             console.log("CheckSkill Kill!");
                    //             return 1;
                    //         }
                    //     }
                    // }
                    if(element.recipient[0].index == selfInfo.index)
                    {
                        console.log("CheckSkill Kill!");
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


