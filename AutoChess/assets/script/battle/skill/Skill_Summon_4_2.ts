/*
 * Skill_Summon_4_2.ts
 * author: Guanliu
 * 2023/9/30
 * 出售时——召唤鲨女仆和（草原系保险专员）各一只
 */
import { _decorator, Component, debug, log, Node, random } from 'cc';
import { SkillBase,Event, RoleInfo,SkillTriggerBase } from './skill_base';
import { Battle } from '../battle';
import { Team } from '../team';
import { Role,Property } from '../role';
import { Camp, SkillType } from '../enums';

export class Skill_Summon_4_2 extends SkillBase 
{
    public res:string="battle/skill/Skill_Summon_4_2";
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
            //鲨女仆ID未确定，暂时用-1占位
            let added:Role;
            if(Camp.Self==selfInfo.camp)
            {
                added=new Role(-1,1,Camp.Self,new Map<Property,number>());
                battle.GetSelfTeam().AddRole(added);
                added=new Role(24,1,Camp.Self,new Map<Property,number>());
                battle.GetSelfTeam().AddRole(added);
            }
            if(Camp.Enemy==selfInfo.camp)
            {
                added=new Role(-1,1,Camp.Enemy,new Map<Property,number>());
                battle.GetEnemyTeam().AddRole(added);
                added=new Role(24,1,Camp.Enemy,new Map<Property,number>());
                battle.GetEnemyTeam().AddRole(added);
            }
        }
        catch (error) 
        {
            console.warn(this.res+"下的 SkillEffect 错误");
        }
    }
}


