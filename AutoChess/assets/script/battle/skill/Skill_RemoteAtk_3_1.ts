/*
 * Skill_RemoteAtk_3_1
 * author: Hotaru
 * 2023/11/2
 * 对N敌方随机单位造成M点远程伤害(百分比)
 */
import { _decorator, Component, Node } from 'cc';
import { SkillBase,Event, RoleInfo, SkillTriggerBase } from './skill_base';
import { Camp, EventType, SkillType } from '../../other/enums';
import { Battle } from '../battle';
import { Role } from '../role';
import * as enums from '../../other/enums'
import { random } from '../util';

export class Skill_RemoteAtk_3_1 extends SkillBase  
{
    
    public res:string="battle/skill/Skill_RemoteAtk_3_1";
    public SkillType:SkillType=SkillType.Attack;

    private numberOfRole : number;
    private attack : number;
    private isAll:boolean;

    public constructor(priority:number, numberOfRole:number, attack:number,isAll:boolean) {
        super(priority);

        this.numberOfRole = numberOfRole;
        this.attack = attack;
        this.isAll=isAll;

        //this.event.type=EventType.RemoteInjured;
    }

    event:Event=new Event();
    UseSkill(selfInfo: RoleInfo, battle: Battle): void 
    {
        try 
        {

            if(6>=this.numberOfRole && !this.isAll)
            {
                this.SkillEffect_1(selfInfo,battle,this.attack*(1+selfInfo.properties.get(enums.Property.Attack)));
            }
            else
            {
                console.warn("生效人数不能大于6人");
            }

            // if(this.isAll)
            // {
            //     this.SkillEffect_2(selfInfo,battle);
            // }
            
        } 
        catch (error) 
        {
            console.warn(this.res+"下的 UseSkill 错误");
        }   
    }

    SkillEffect_1(selfInfo: RoleInfo, battle: Battle,attack:number)               //随机对象生效
    {
        try
        {
            let recipientRoles:Role[] = new Array();
            let self:Role = null;
            let enemyRoles:Role[] = null;
            attack=Math.round(attack);                                          //四舍五入
            if(attack<1)
            {
                attack=1;
            }
            console.log("try to use remote Skill_RemoteAtk_3_1 attack:", attack);

            if(Camp.Self==selfInfo.camp)
            {
                self = battle.GetSelfTeam().GetRole(selfInfo.index);
                enemyRoles=battle.GetEnemyTeam().GetRoles().slice();
            }
            if(Camp.Enemy==selfInfo.camp)
            {
                self = battle.GetEnemyTeam().GetRole(selfInfo.index);
                enemyRoles=battle.GetSelfTeam().GetRoles().slice();
            }
            while(recipientRoles.length < this.numberOfRole && enemyRoles.length > 0) {
                let index = random(0, enemyRoles.length);
                recipientRoles.push(enemyRoles[index]);
                enemyRoles.splice(index, 1);
            }
            recipientRoles.forEach((role)=>{
                role.BeHurted(attack, self, battle);
                console.log("Skill_RemoteAtk_3_1 远程攻击角色受伤 :",attack);
            });
        }
        catch (error) 
        {
            console.warn(this.res+"下的 SkillEffect 错误");
            console.log(error);
        }
    }

    SkillEffect_2(selfInfo: RoleInfo, battle: Battle)
    {

    }
}