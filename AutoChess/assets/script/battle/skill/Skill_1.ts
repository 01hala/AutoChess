/*
 * Skill_1.ts
 * author: Hotaru
 * 2023/9/25
 * 购买时——随机一兵种获得+1生命值和+1攻击力
 */
import { _decorator, Component, debug, log, Node, random } from 'cc';
import { SkillBase,Event, RoleInfo,Camp, EventType} from './skill_base';
import { Battle } from '../battle';
import { Team } from '../team';
import { Role,Property } from '../role';

export class Skill_1 extends SkillBase 
{
    private res:string="battle/skill/Skill_1";

    event:Event=new Event();

    CheckSkillTrigger(frameEvent: Event[], selfInfo: RoleInfo): boolean 
    {
        try 
        {
            if(frameEvent[0].type==EventType.Purchase)
            {
                this.event=frameEvent[0];
                return true;
            }
            else return false;
        
        } 
        catch (error) 
        {
            console.warn(this.res+"下的 CheckSkillTrigger 错误");
            //return null;
        }
    }

    UseSkill(selfInfo: RoleInfo, battle: Battle): void 
    {
        try
        {
            let randnum=this.GetRandomNum(1,5);
            let recipientRole:Role=battle.GetSelfTeam().GetRole(randnum);
            while(null==recipientRole)
            {
                randnum=this.GetRandomNum(1,5);
                recipientRole=battle.GetSelfTeam().GetRole(randnum);
            }
            this.SkillEffect(recipientRole);          
        }
        catch (error) 
        {
            console.warn(this.res+"下的 UseSkill 错误");
        }
        
    }

    SkillEffect(role:Role):void
    {
        try
        {
            role.ChangeProperties(Property.HP,this.event.value[0]);
            role.ChangeProperties(Property.Attack,this.event.value[1]);
        }
        catch (error) 
        {
            console.warn(this.res+"下的 SkillEffect 错误");
        }
    }

    GetRandomNum(min:number,max:number):number
    {
        try
        {
            let range=max-min;
            let rand=Math.random();
            return (min+Math.round(rand*range));
        }
        catch (error) 
        {
            console.warn(this.res+"下的 getRandomNum 错误");
        }
    }
}


