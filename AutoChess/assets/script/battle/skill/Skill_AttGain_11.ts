/*
 * Skill_AttGain_11.ts
 * author: Hotaru
 * 2023/9/26
 * 升级时——使所有伙伴获得+2生命值和+2攻击力
 */
import { _decorator, Component, debug, log, Node, random } from 'cc';
import { SkillBase,Event, RoleInfo,Camp, EventType,SkillTriggerBase, SkillType} from './skill_base';
import { Battle } from '../battle';
import { Team } from '../team';
import { Role,Property } from '../role';

export class Skill_AttGain_11 extends SkillBase 
{
    public res:string="battle/skill/Skill_AttGain_11";
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
                recipientRoles=battle.GetEnemyTeam().GetRoles();
            }
            recipientRoles.forEach(element => 
            {
                element.ChangeProperties(Property.HP,this.event.value[0]);
                element.ChangeProperties(Property.Attack,this.event.value[1]);
            });
            
        }
        catch (error) 
        {
            console.warn(this.res+"下的 SkillEffect 错误");
        }
    }

    
}


