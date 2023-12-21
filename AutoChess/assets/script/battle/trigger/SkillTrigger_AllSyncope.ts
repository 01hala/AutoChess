/*
 * SkillTrigger_AllSyncope.ts
 * author: Guanliu
 * 2023/12/20
 * 检测是否是场上某一类型角色全部昏迷（主要用于羁绊）
 */
import { _decorator, Component, debug, log, Node, random } from 'cc';
import { SkillBase,Event, RoleInfo,SkillTriggerBase } from '../skill/skill_base';
import { Camp, EventType, SkillType } from '../../other/enums';
import { Battle } from '../battle';
import { Fetters } from '../../serverSDK/common';
import { Role } from '../role';
const { ccclass, property } = _decorator;

@ccclass('SkillTrigger_AllSyncope')
export class SkillTrigger_AllSyncope extends SkillTriggerBase {
    public res:string="battle/skill/SkillTrigger_AllSyncope";
    //public EventType:EventType=EventType.Syncope;
    private targetFetterID:number;
    
    constructor(targetFetterID : number){
        super();
        this.targetFetterID = targetFetterID;
    }

    override CheckSkillTrigger(frameEvent: Event[], selfInfo: RoleInfo,battle?: Battle): boolean 
    {
        try
        {
            return this.CheckSkill(frameEvent,selfInfo,battle);          
        }
        catch (error) 
        {
            console.warn(this.res+"下的 CheckSkillTrigger 错误");
        }
        
        return false;
    }

    private  CheckSkill(frameEvent: Event[], selfInfo: RoleInfo,battle: Battle): boolean
    {
        try
        {
            for (let element of frameEvent) {
                if(EventType.Syncope == element.type){
                    console.log("CheckSkill element:", element, " selfInfo:", selfInfo);
                    if(element.spellcaster.camp == selfInfo.camp && element.spellcaster.index == selfInfo.index
                        &&this.targetFetterID == element.spellcaster.Fetters) {
                            let t:Role[];
                            if(Camp.Enemy == selfInfo.camp) {
                                t = battle.GetEnemyTeam().GetRoles().slice()
                            }
                            else if(Camp.Self == selfInfo.camp) {
                                t = battle.GetSelfTeam().GetRoles().slice();
                            }
                            for(let temp of t){
                                if(this.targetFetterID == temp.fetter.fetters_id) return false;
                            }
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


