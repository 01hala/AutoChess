/*
 * Skill_Summon_6.ts
 * author: Guanliu
 * 2023/9/27
 * 晕厥时——召唤一个2/2的虚空虫
 */
import { _decorator, Component, debug, log, Node, random } from 'cc';
import { SkillBase,Event, RoleInfo,Camp, EventType,SkillTriggerBase, SkillType} from './skill_base';
import { Battle } from '../battle';
import { Team } from '../team';
import { Role,Property } from '../role';

export class Skill_Summon_6 extends SkillBase 
{
    public res:string="battle/skill/Skill_Summon_6";
    public SkillType:SkillType=SkillType.Summon;

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
                //...
            }
            if(Camp.Enemy==selfInfo.camp)
            {
                recipientRoles=battle.GetEnemyTeam().GetRoles();
                //...
            }
        }
        catch (error) 
        {
            console.warn(this.res+"下的 SkillEffect 错误");
        }
    }
}


