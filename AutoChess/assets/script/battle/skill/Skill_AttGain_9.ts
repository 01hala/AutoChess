/*
 * Skill_AttGain_9.ts
 * author: Hotaru
 * 2023/9/26
 * 回合结束时——使最近的一个前方伙伴获得+1攻击力和+1生命值
 */
import { _decorator, Component, debug, log, Node, random } from 'cc';
import { SkillBase,Event, RoleInfo,Camp, EventType,SkillTriggerBase, SkillType} from './skill_base';
import { Battle } from '../battle';
import { Team } from '../team';
import { Role,Property } from '../role';

export class Skill_AttGain_9 extends SkillBase 
{
    public res:string="battle/skill/Skill_AttGain_9";
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
                if(selfInfo.index>=3)
                {
                    battle.GetSelfTeam().GetRole(selfInfo.index-3);
                }
            }
            if(Camp.Enemy==selfInfo.camp)
            {
                if(selfInfo.index>=3)
                {
                    battle.GetEnemyTeam().GetRole(selfInfo.index-3);
                }
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


