/*
 * Skill_SubstituteDamage_11.ts
 * author: Guanliu
 * 2023/12/22
 * 角色A为角色B承担所有伤害后额外减免x伤害（如果角色B=角色A，相当于角色A自我减伤x）
 */
import { _decorator, Component, debug, log, Node } from 'cc';
import { SkillBase,Event, RoleInfo,SkillTriggerBase, } from './skill_base';
import { Battle } from '../battle';
import { Team } from '../team';
import { Role} from '../role';
import * as BattleEnums from '../BattleEnums';
import { random } from '../util';
import { Buffer } from '../buffer/buffer';
import { Direction } from '../common';

export class Skill_SubstituteDamage extends SkillBase 
{
    public res:string="battle/skill/Skill_SubstituteDamage.ts";
    public SkillType:BattleEnums.SkillType=BattleEnums.SkillType.Support;

    private value:number;
    private round:number;
    private dir:Direction;

    private eventSound:string;    

    public constructor(priority:number, value:number,round:number,dir:Direction,eventSound?:string,isfetter:boolean=false) {
        super(priority,isfetter);

        this.value=value;
        this.round=round;
        this.dir=dir;

        if(eventSound!=null)
        {
            this.eventSound=eventSound;
        }
    }

    public UseSkill(selfInfo: RoleInfo, battle: Battle,isParallel:boolean): void 
    {
        try
        {
            let event: Event = new Event();
            event.isParallel = isParallel;
            event.spellcaster = selfInfo;
            event.type = BattleEnums.EventType.UsedSkill;
            battle.AddBattleEvent(event);

            this.SkillEffect(selfInfo,battle,isParallel);    

            battle.onPlayerOnShot.call(null, this.eventSound);     
        }
        catch (error) 
        {
            console.warn(this.res+"下的 UseSkill 错误");
        }
        
    }

    SkillEffect(selfInfo: RoleInfo, battle: Battle,isPar:boolean):void
    {
        try 
        {
            let event:Event=new Event();
            event.isFetter=this.isFetter;

            let teamTemp:Team=null;
            let recipientRole:Role=null;

            if(BattleEnums.Camp.Self==selfInfo.camp)
            {
                teamTemp=battle.GetSelfTeam();
            }
            if(BattleEnums.Camp.Enemy==selfInfo.camp)
            {
                teamTemp=battle.GetEnemyTeam();
            }
            switch(this.dir)
            {
                case Direction.Self:
                recipientRole=teamTemp[selfInfo.index];
                    break;
                case Direction.Forward:
                    if(selfInfo.index>=3)
                    {
                        recipientRole=teamTemp.GetRole(selfInfo.index-3);
                    }
                    break;
                case Direction.Back:
                    if(selfInfo.index<3)
                    {
                        recipientRole=teamTemp.GetRole(selfInfo.index+3);
                    }
                    break;
                case Direction.Rigiht:
                    if(2!=selfInfo.index && 5!=selfInfo.index)
                    {
                        recipientRole=teamTemp.GetRole(selfInfo.index+1);
                    }
                    break;
                case Direction.Left:
                    if(0!=selfInfo.index && 3!= selfInfo.index)
                    {
                        recipientRole=teamTemp.GetRole(selfInfo.index-1);
                    }
            }
         
            if(null!=recipientRole)
            { 
                event.isParallel = isPar;
                event.spellcaster = selfInfo;
                
                let role=new RoleInfo();
                role.index=recipientRole.index;
                role.camp=recipientRole.selfCamp;

                event.recipient.push(role);
                event.type = BattleEnums.EventType.SubstituteDamage;
                event.value.push(this.value);
                battle.AddBattleEvent(event);
            }

            //let self=teamTemp[selfInfo.index];
            // let buff: Buffer = new Buffer();
            // buff.BufferType = enums.BufferType.OffsetDamage;
            // buff.Value = this.value;
            // buff.Round = this.round;
            // self.buffer.push(buff);
            
        } 
        catch (error) 
        {
            console.warn(this.res+"下的 SkillEffect 错误");
        }
        
    }
}

