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
import { BufferType, Camp,  SkillType } from '../../other/enums';
import { random } from '../util';
import { Buffer } from '../buffer/buffer';
import { Direction } from '../../serverSDK/common';

export class Skill_SubstituteDamage_11 extends SkillBase 
{
    public res:string="battle/skill/Skill_SubstituteDamage_11";
    public SkillType:SkillType=SkillType.Support;

    private value:number;
    private round:number;
    private dir:Direction;

    event:Event=new Event();

    public constructor(priority:number, value:number,round:number,dir:Direction) {
        super(priority);

        this.value=value;
        this.round=round;
        this.dir=dir;
    }

    public UseSkill(selfInfo: RoleInfo, battle: Battle): void 
    {
        try
        {
            this.SkillEffect(selfInfo,battle);          
        }
        catch (error) 
        {
            console.warn(this.res+"下的 UseSkill 错误");
        }
        
    }

    SkillEffect(selfInfo: RoleInfo, battle: Battle):void
    {
        try 
        {
            let teamTemp:Role[]=null;
            let recipientRole:Role=null;

            if(Camp.Self==selfInfo.camp)
            {
            teamTemp=battle.GetSelfTeam().GetRoles();
            }
            if(Camp.Enemy==selfInfo.camp)
            {
                teamTemp=battle.GetEnemyTeam().GetRoles();
            }
            switch(this.dir)
            {
                case Direction.Self:
                recipientRole=teamTemp[selfInfo.index];
                    break;
                case Direction.Forward:
                    if(selfInfo.index>=3)
                    {
                        recipientRole=teamTemp[selfInfo.index-3];
                    }
                    break;
                case Direction.Back:
                    if(selfInfo.index<3)
                    {
                        recipientRole=teamTemp[selfInfo.index+3];
                    }
                    break;
                case Direction.Rigiht:
                    if(2!=selfInfo.index && 5!=selfInfo.index)
                    {
                        if(1==selfInfo.index||4==selfInfo.index)
                        {
                            recipientRole=teamTemp[selfInfo.index-3];
                        }
                        if(0==selfInfo.index||3==selfInfo.index)
                        {
                            recipientRole=teamTemp[selfInfo.index+2];
                        }
                    }
                    break;
                case Direction.Left:
                    if(1!=selfInfo.index && 4!= selfInfo.index)
                    {
                        if(0==selfInfo.index||3==selfInfo.index)
                        {
                            recipientRole=battle.GetSelfTeam().GetRole(selfInfo.index+1);
                        }
                        if(2==selfInfo.index||5==selfInfo.index)
                        {
                            recipientRole=battle.GetSelfTeam().GetRole(selfInfo.index-2);
                        }
                    }
            }
         
            if(null!=recipientRole)
            {
                let buff:Buffer=new Buffer();
                buff.BufferType=BufferType.SubstituteDamageFront;
                buff.Value=this.value;
                buff.Round=this.round;
                recipientRole.buffer.push(buff);
            }
        } 
        catch (error) 
        {
            console.warn(this.res+"下的 SkillEffect 错误");
        }
        
    }
}

