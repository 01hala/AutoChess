/*
 * SkillTrigger_FriendlysideInjured_19.ts
 * author: Guanliu
 * 2023/12/22
 * 触发条件：友方受伤时
 */
import { _decorator, Component, debug, log, Node, random } from 'cc';
import { SkillBase,Event, RoleInfo,SkillTriggerBase } from '../skill/skill_base';
import * as enums from '../BattleEnums';
import { Direction } from '../common';

export class SkillTrigger_FriendlysideInjured extends SkillTriggerBase
{    
    public res:string="battle/skill/SkillTrigger_FriendlysideInjured.ts";
    public EventType:enums.EventType=enums.EventType.FriendlysideInjured;
    private dir:Direction;

    event:Event=new Event();

    constructor(dir:Direction=Direction.None){
        super();
        this.dir=dir;
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
            for (let element of frameEvent)
            {
                if (enums.EventType.BeforeHurt == element.type)
                {
                    for (let _recipient of element.recipient)
                    {
                        if (_recipient.camp == selfInfo.camp && _recipient.index != selfInfo.index)
                        {
                            switch (this.dir)
                            {
                                case Direction.Forward:
                                    if (_recipient.index + 3 == selfInfo.index) return 1;
                                    break;
                                case Direction.Back:
                                    if (_recipient.index - 3 == selfInfo.index) return 1;
                                    break;
                                case Direction.Left:
                                    if (((1 == selfInfo.index || 4 == selfInfo.index) && _recipient.index - 1 == selfInfo.index)
                                        || (3 == selfInfo.index || 6 == selfInfo.index) && _recipient.index + 2 == selfInfo.index) return 1;
                                    break;
                                case Direction.Rigiht:
                                    if (((2 == selfInfo.index || 5 == selfInfo.index) && _recipient.index + 1 == selfInfo.index)
                                        || (1 == selfInfo.index || 4 == selfInfo.index) && _recipient.index - 2 == selfInfo.index) return 1;
                                    break;
                                default: return 1;
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


