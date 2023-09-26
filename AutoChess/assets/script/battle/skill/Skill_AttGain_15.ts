/*
 * Skill_AttGain_15.ts
 * author: Hotaru
 * 2023/9/26
 * 受伤时——获得+4攻击力
 */
import { _decorator, Component, debug, log, Node, random } from 'cc';
import { SkillBase,Event, RoleInfo,Camp, EventType,SkillTriggerBase, SkillType} from './skill_base';
import { Battle } from '../battle';
import { Team } from '../team';
import { Role,Property } from '../role';

export class Skill_AttGain_15 extends SkillBase 
{
    public res:string="battle/skill/Skill_AttGain_15";
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
                recipientRole=battle.GetSelfTeam().GetRole(selfInfo.index);
            }
            if(Camp.Enemy==selfInfo.camp)
            {
                recipientRole=battle.GetEnemyTeam().GetRole(selfInfo.index);
            }
            if(!recipientRole.CheckDead())
            {
                recipientRole.ChangeProperties(Property.Attack,this.event.value[1]);
            }
        }
        catch (error) 
        {
            console.warn(this.res+"下的 SkillEffect 错误");
        }
    }

    
}


