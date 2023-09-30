/*
 * Skill_AttGain_1_2.ts
 * author: Hotaru
 * 2023/9/27
 * 随机n人获得+m生命值和+k攻击力
 */
import { _decorator, Component, debug, log, Node } from 'cc';
import { SkillBase,Event, RoleInfo,SkillTriggerBase, } from './skill_base';
import { Battle } from '../battle';
import { Team } from '../team';
import { Role,Property } from '../role';
import { Camp, SkillType } from '../enums';
import { random } from '../util';

export class Skill_AttGain_1_2 extends SkillBase 
{
    public res:string="battle/skill/Skill_AttGain_1_2";
    public SkillType:SkillType=SkillType.Intensifier;

    private numberOfRole:number;
    private health:number;
    private attack:number;

    event:Event=new Event();

    public constructor(numberOfRole:number,health:number, attack:number) {
        super();

        this.numberOfRole = numberOfRole;
        this.attack = attack;
        this.health=health;
    }

    public UseSkill(selfInfo: RoleInfo, battle: Battle): void 
    {
        try
        {
            if(5>=this.numberOfRole)
            {
                this.SkillEffect(selfInfo,battle);
            }
            else
            {
                console.warn("生效人数不能大于5人");
            }
                  
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
            let recipientRoles:Role[]=new Array();
            let rolesTemp:Role[]=null;

            if(Camp.Self==selfInfo.camp)
            {
                rolesTemp=battle.GetSelfTeam().GetRoles();
                //...
            }
            if(Camp.Enemy==selfInfo.camp)
            {
                rolesTemp=battle.GetEnemyTeam().GetRoles();
                //...
            }
            while(recipientRoles.length<this.numberOfRole)
            {
                let index = random(0, rolesTemp.length);
                if(index!=selfInfo.index)                                   //随机但不包括自己
                {
                    recipientRoles.push(rolesTemp[index]);
                    rolesTemp.splice(index, 1);
                }
            }
            recipientRoles.forEach((role) => 
            {
                role.ChangeProperties(Property.HP, role.GetProperty(Property.HP) + this.health);
                role.ChangeProperties(Property.TotalHP, role.GetProperty(Property.TotalHP) + this.health);
                role.ChangeProperties(Property.Attack,role.GetProperty(Property.Attack) + this.attack);
            });
            
        }
        catch (error) 
        {
            console.warn(this.res+"下的 SkillEffect 错误");
        }
    }

}


