/*
 * Skill_AttGain_1_1.ts
 * author: Hotaru
 * 2023/9/27
 * 获得+m生命值和+k攻击力（前后左右或者自己）
 */
import { _decorator, Component, debug, log, Node } from 'cc';
import { SkillBase,Event, RoleInfo,SkillTriggerBase, } from './skill_base';
import { Battle } from '../battle';
import { Team } from '../team';
import { Role,Property } from '../role';
import { Camp, Direction, SkillType } from '../enums';
import { random } from '../util';

export class Skill_AttGain_1_1 extends SkillBase 
{
    public res:string="battle/skill/Skill_AttGain_1_1";
    public SkillType:SkillType=SkillType.Intensifier;

    private health:number;
    private attack:number;
    private dir:Direction;

    event:Event=new Event();

    public constructor(health:number, attack:number,dir:Direction = 0) {
        super();

        this.attack = attack;
        this.health=health;
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
                    case 0:
                        recipientRole=teamTemp[selfInfo.index];
                        break;
                    case 1:
                        if(selfInfo.index>=3)
                        {
                            recipientRole=teamTemp[selfInfo.index-3];
                        }
                        break;
                    case 2:
                        if(selfInfo.index<3)
                        {
                            recipientRole=teamTemp[selfInfo.index+3];
                        }
                        break;
                    case 3:
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
                    case 4:
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
                recipientRole.ChangeProperties(Property.HP, recipientRole.GetProperty(Property.HP) + this.health);
                recipientRole.ChangeProperties(Property.TotalHP, recipientRole.GetProperty(Property.TotalHP) + this.health);
                recipientRole.ChangeProperties(Property.Attack,recipientRole.GetProperty(Property.Attack) + this.attack);
            }
        }
        catch (error) 
        {
            console.warn(this.res+"下的 SkillEffect 错误");
        }
    }

}


