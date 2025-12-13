import { _decorator, Component, DirectionalLight, Node } from 'cc';

import { SkillBase,Event, RoleInfo, SkillTriggerBase } from './skill_base';
import { Direction, Priority } from '../common';
import * as BattleEnums from '../BattleEnums';
import { Battle } from '../battle';
import { Role } from '../role';
import { random } from '../util';
import { Team } from '../team';

export class Skill_RepeatSkill extends SkillBase  
{
    public res:string="battle/skill/Skill_RemoteAtk.ts/Skill_RepeatSkill";

    private dir:Direction;
    private eventSound:string;
    private lvl:number;

    constructor(priority:number , dir:Direction , lvl:number,eventSound?:string,isfetter:boolean=false)
    {
        super(priority,isfetter);

        if(eventSound!=null)
        {
            this.eventSound = eventSound;
        }
        this.dir=dir;
        this.lvl=lvl;
    }

    UseSkill(selfInfo: RoleInfo, battle: Battle, isParallel: boolean, evs?: Event[]): void
    {
        try
        {

        }
        catch(error)
        {
            console.warn(this.res+"下的 UseSkill 错误");
        }
    }
    
    private SkillEffect_1(selfInfo: RoleInfo, battle: Battle,isPar:boolean):void
    {
        try
        {
            let event:Event;
            event.type=BattleEnums.EventType.RepeatSkill;
            event.isFetter=this.isFetter;
    
            let teamTemp:Team=null;
            let recipientRole:Role=null;
    
            let roleInfo = new RoleInfo();
            roleInfo.camp = selfInfo.camp;
            roleInfo.index = 0;
    
            if (BattleEnums.Camp.Self == selfInfo.camp)
            {
                teamTemp = battle.GetSelfTeam();
            }
            if (BattleEnums.Camp.Enemy == selfInfo.camp)
            {
                teamTemp = battle.GetEnemyTeam();
            }
    
            switch(this.dir)
            {
                case Direction.Self:
                    {
                        roleInfo.index = selfInfo.index;
                    }
                    break;
                case Direction.Forward:
                    if (selfInfo.index >= 3)
                    {
                        roleInfo.index = selfInfo.index - 3;
                    }
                    break;
                case Direction.Back:
                    if (selfInfo.index < 3)
                    {
                        roleInfo.index = selfInfo.index + 3;
                    }
                    break;
                case Direction.Rigiht:
                    if (2 != selfInfo.index && 5 != selfInfo.index)
                    {
                        if (1 == selfInfo.index || 4 == selfInfo.index)
                        {
                            roleInfo.index = selfInfo.index - 3;
                        }
                        if (0 == selfInfo.index || 3 == selfInfo.index)
                        {
                            roleInfo.index = selfInfo.index + 2;
                        }
                    }
                    break;
                case Direction.Left:
                    if (1 != selfInfo.index && 4 != selfInfo.index)
                    {
                        if (0 == selfInfo.index || 3 == selfInfo.index)
                        {
                            roleInfo.index = selfInfo.index + 1;
                        }
                        if (2 == selfInfo.index || 5 == selfInfo.index)
                        {
                            roleInfo.index = selfInfo.index - 2;
                        }
                    }
                    break;
                default:
                    break;
            }
            event.spellcaster=selfInfo;
            event.recipient.push(roleInfo);
            event.value.push(this.lvl);

            battle.AddBattleEvent(event);

        }
        catch(error)
        {
            console.warn(this.res+"下的 SkillEffect_1 错误 ",error);
        }
    }
}

