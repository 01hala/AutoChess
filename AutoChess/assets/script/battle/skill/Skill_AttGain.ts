/*
 * Skill_AttGain.ts
 * author: Hotaru
 * 2023/9/27
 * 获得+m生命值和+k攻击力
 */
import { _decorator, Component, debug, log, Node } from 'cc';
import { SkillBase,Event, RoleInfo,SkillTriggerBase, } from './skill_base';
import { Battle } from '../battle';
import { Team } from '../team';
import { Role,Property } from '../role';
import { Camp, SkillType } from '../enums';
import { random } from '../util';

export class Skill_AttGain extends SkillBase 
{
    public res:string="battle/skill/Skill_AttGain";
    public SkillType:SkillType=SkillType.Intensifier;

    private health:number;
    private attack:number;

    event:Event=new Event();

    public constructor(health:number, attack:number) {
        super();

        this.attack = attack;
        this.health=health;
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
            let recipientRole:Role=null;

            if(Camp.Self==selfInfo.camp)
            {
                recipientRole=battle.GetSelfTeam().GetRole(selfInfo.index);
                //...
            }
            if(Camp.Enemy==selfInfo.camp)
            {
                recipientRole=battle.GetEnemyTeam().GetRole(selfInfo.index);
                //...
            }
            recipientRole.ChangeProperties(Property.Health,this.health);
            recipientRole.ChangeProperties(Property.Attack,this.attack);
            
        }
        catch (error) 
        {
            console.warn(this.res+"下的 SkillEffect 错误");
        }
    }

}


