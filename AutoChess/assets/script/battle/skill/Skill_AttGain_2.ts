/*
 * Skill_AttGain_2.ts
 * author: Hotaru
 * 2023/9/25
 * 击倒时——获得+3攻击力和+3生命值
 */
import { _decorator, Component, Node } from 'cc';
import { SkillBase,Event, RoleInfo,Camp, EventType,SkillTriggerBase, SkillType} from './skill_base';
import { Battle } from '../battle';
import { Property, Role } from '../role';

export class Skill_AttGain_2 extends SkillBase 
{
    public res:string="battle/skill/Skill_AttGain_2";
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
            let recipientRole:Role=new Role();
            if(Camp.Self==selfInfo.camp)
            {
                recipientRole==battle.GetSelfTeam().GetRole(selfInfo.index);
            }
            if(Camp.Enemy==selfInfo.camp)
            {
                recipientRole==battle.GetEnemyTeam().GetRole(selfInfo.index);
            }
            recipientRole.ChangeProperties(Property.HP,this.event.value[0]);
            recipientRole.ChangeProperties(Property.Attack,this.event.value[1]);
           
        }
        catch (error) 
        {
            console.warn(this.res+"下的 SkillEffect 错误");
        }
    }

}


