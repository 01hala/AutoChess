/*
 * Skill_AttGain_14.ts
 * author: Hotaru
 * 2023/9/26
 * 吃掉食物时——使随机两个伙伴获得+1攻击和+1生命值
 */
import { _decorator, Component, debug, log, Node, random } from 'cc';
import { SkillBase,Event, RoleInfo,Camp, EventType,SkillTriggerBase, SkillType} from './skill_base';
import { Battle } from '../battle';
import { Team } from '../team';
import { Role,Property } from '../role';

export class Skill_AttGain_14 extends SkillBase 
{
    public res:string="battle/skill/Skill_AttGain_14";
    public SkillType:SkillType=SkillType.Intensifier;

    event:Event=new Event();

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

    private SkillEffect(selfInfo: RoleInfo, battle: Battle):void
    {
        try
        {
            let recipientRoles:Role[]=new Array();
            if(Camp.Self==selfInfo.camp)
            {
                recipientRoles=battle.GetSelfTeam().GetRoles();
            }
            if(Camp.Enemy==selfInfo.camp)
            {
                recipientRoles=battle.GetEnemyTeam().GetRoles()
            }
            if(recipientRoles.length<=2)
            {
                recipientRoles.forEach(element => 
                {
                    element.ChangeProperties(Property.HP,this.event.value[0]);
                    element.ChangeProperties(Property.Attack,this.event.value[2]);
                });
            }
            else
            {
                for(let i:number=0;i<2;i++)
                {
                    // let randnum=this.GetRandomNum(0,recipientRoles.length);
                    // recipientRoles[randnum].BeHurted(this.event.value[0]);
                    // recipientRoles.splice(randnum);
                }
            }
 
        }
        catch (error) 
        {
            console.warn(this.res+"下的 SkillEffect 错误");
        }
    }

    
}


