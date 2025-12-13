/*
 * SkillTrigger_FriendlysideInjured_19.ts
 * author: Guanliu
 * 2023/12/22
 * 触发条件：前方伙伴攻击时（后）
 */
import { _decorator, Component, debug, log, Node, random } from 'cc';
import { SkillBase,Event, RoleInfo,SkillTriggerBase } from '../skill/skill_base';
import * as enums from '../BattleEnums';
import { Direction } from '../common';

export class SkillTrigger_FrontAtk extends SkillTriggerBase
{    
    public res:string="battle/skill/SkillTrigger_FrontAtk";
    public EventType:enums.EventType=enums.EventType.FrontAtk;
    private dir:Direction;

    event:Event=new Event();

    constructor(){
        super();
        this.dir=Direction.Forward;
    }

    CheckSkillTrigger(frameEvent: Event[], selfInfo: RoleInfo,): number {
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
                if(enums.EventType.AfterAttack==element.type){
                    if(element.spellcaster.camp==selfInfo.camp&&element.spellcaster.index+3==selfInfo.index){
                        console.log("Check FrontATK!");
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


