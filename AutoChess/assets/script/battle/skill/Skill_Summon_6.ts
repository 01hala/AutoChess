/*
 * Skill_Summon_6.ts
 * author: Guanliu
 * 2023/9/27
 * 晕厥时——召唤一个M/M的虚空虫
 */
import { _decorator, Component, debug, log, Node, random } from 'cc';
import { SkillBase,Event, RoleInfo,SkillTriggerBase } from './skill_base';
import { Battle } from '../battle';
import { Team } from '../team';
import { Role,Property } from '../role';
import { Camp, SkillType } from '../enums';

export class Skill_Summon_6 extends SkillBase 
{
    public res:string="battle/skill/Skill_Summon_6";
    public SkillType:SkillType=SkillType.Summon;

    event:Event=new Event();

    private addedHP:number;
    public constructor(hp:number) {
        super();

        this.addedHP=hp;
    }

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
            //虚空虫ID未确定，暂时用-1占位
            let added:Role;
            if(Camp.Self==selfInfo.camp)
            {
                added=new Role(-1,1,Camp.Self,new Map<Property,number>([[Property.HP,this.addedHP]]));
                battle.GetSelfTeam().AddRole(added);
            }
            if(Camp.Enemy==selfInfo.camp)
            {
                added=new Role(-1,1,Camp.Enemy,new Map<Property,number>([[Property.HP,this.addedHP]]));
                battle.GetEnemyTeam().AddRole(added);
            }
        }
        catch (error) 
        {
            console.warn(this.res+"下的 SkillEffect 错误");
        }
    }
}


