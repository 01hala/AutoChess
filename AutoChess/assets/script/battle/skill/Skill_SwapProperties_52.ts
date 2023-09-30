/*
 * Skill_SwapProperties_49.ts
 * author: Guanliu
 * 2023/9/30
 * 战斗开始时——交换两个相邻伙伴的属性
 */
import { _decorator, Component, debug, log, Node, random, ValueType } from 'cc';
import { SkillBase,Event, RoleInfo,SkillTriggerBase } from './skill_base';
import { Battle } from '../battle';
import { Team } from '../team';
import { Role,Property } from '../role';
import { Camp, SkillType } from '../enums';

export class Skill_SwapProperties_49 extends SkillBase 
{
    public res:string="battle/skill/Skill_SwapProperties_49";
    public SkillType:SkillType=SkillType.SwapProperties;

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
        /*
        如果阵型是   1 0 2
                    3 4 5
        我的假设：角落角色的相邻角色是它的左/右和下/上方，中间角色的相邻角色是它的左右手边的角色
        */
        try
        {
            let leftOne:number,rightOne:number;

            switch(selfInfo.index){
                case 0:case 4:
                    leftOne=selfInfo.index-1,rightOne=selfInfo.index+1;break;
                case 1:
                    leftOne=selfInfo.index-1,rightOne=selfInfo.index+2;break;
                case 2:
                    leftOne=selfInfo.index-2,rightOne=selfInfo.index+3;break;
                case 3:
                    leftOne=selfInfo.index-2,rightOne=selfInfo.index+1;break;
                case 5:
                    leftOne=selfInfo.index-3,rightOne=selfInfo.index-1;break;
            }
            let swapRoles:Role[];
            if(Camp.Self==selfInfo.camp){
                swapRoles.push(battle.GetSelfTeam().GetRole(leftOne));
                swapRoles.push(battle.GetSelfTeam().GetRole(rightOne));
            }
            if(Camp.Enemy==selfInfo.camp){
                swapRoles.push(battle.GetEnemyTeam().GetRole(leftOne));
                swapRoles.push(battle.GetEnemyTeam().GetRole(rightOne));
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


