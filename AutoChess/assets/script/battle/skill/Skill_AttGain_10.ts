/*
 * Skill_AttGain_10.ts
 * author: Hotaru
 * 2023/9/26
 * 出售时——从前往后依次使伙伴获得+1攻击力，次数等于此兵种参与的战斗数
 */
import { _decorator, Component, debug, log, Node, random } from 'cc';
import { SkillBase,Event, RoleInfo,Camp, EventType,SkillTriggerBase, SkillType} from './skill_base';
import { Battle } from '../battle';
import { Team } from '../team';
import { Role,Property } from '../role';

export class Skill_AttGain_10 extends SkillBase 
{
    public res:string="battle/skill/Skill_AttGain_10";
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
            for(let i:number=0;i<selfInfo.battleCount;i++)
            {
                recipientRoles[i].ChangeProperties(Property.HP,this.event.value[0]);
                recipientRoles[i].ChangeProperties(Property.Attack,this.event.value[1]);
            }
            
        }
        catch (error) 
        {
            console.warn(this.res+"下的 SkillEffect 错误");
        }
    }

    
}


