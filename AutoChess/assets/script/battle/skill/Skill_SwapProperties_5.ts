/*
 * Skill_SwapProperties_5.ts
 * author: Guanliu
 * 2023/9/30
 * 交换队伍中指定两个位置上的角色的属性，若有交换方不存在则不交换
 */
import { _decorator, Component, debug, log, Node, random, ValueType } from 'cc';
import { SkillBase,Event, RoleInfo,SkillTriggerBase } from './skill_base';
import { Battle } from '../battle';
import { Team } from '../team';
import { Role,Property } from '../role';
import { Camp, SkillType } from '../enums';

export class Skill_SwapProperties_5 extends SkillBase 
{
    public res:string="battle/skill/Skill_SwapProperties_5";
    public SkillType:SkillType=SkillType.SwapProperties;

    event:Event=new Event();

    private index1:number;
    private index2:number;
    public constructor(swapper1:number,swapper2:number) {
        super();

        this.index1=swapper1;
        this.index2=swapper2;
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
            let swapRoles:Role[];
            if(Camp.Self==selfInfo.camp){
                swapRoles.push(battle.GetSelfTeam().GetRole(this.index1));
                swapRoles.push(battle.GetSelfTeam().GetRole(this.index1));
            }
            if(Camp.Enemy==selfInfo.camp){
                swapRoles.push(battle.GetEnemyTeam().GetRole(this.index1));
                swapRoles.push(battle.GetEnemyTeam().GetRole(this.index1));
            }
            if(swapRoles[0]==null||swapRoles[1]==null) return;

            let temp=swapRoles[0].GetProperties();
            temp.forEach((value,key)=>{
                swapRoles[0].ChangeProperties(key,swapRoles[1].GetProperty(key));
                swapRoles[1].ChangeProperties(key,value);
            });
        }
        catch (error) 
        {
            console.warn(this.res+"下的 SkillEffect 错误");
        }
    }
}


