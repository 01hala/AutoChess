/*
 * Skill_RemoteAtk_3
 * author: Hotaru
 * 2023/9/25
 * 对N敌方随机单位造成M点远程伤害
 */
import { _decorator, Component, Node } from 'cc';
import { SkillBase,Event, RoleInfo, SkillTriggerBase } from './skill_base';
import { Camp, EventType, SkillType } from '../../other/enums';
import { Battle } from '../battle';
import { Role } from '../role';
import { random } from '../util';

export class Skill_RemoteAtk_3 extends SkillBase  
{
    public res:string="battle/skill/Skill_RemoteAtk_3";
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
        console.log("create Skill_RemoteAtk_3 attack:", this.attack);
    }

    event:Event=new Event();
    UseSkill(selfInfo: RoleInfo, battle: Battle,isParallel:boolean): void 
    {
        try 
        {
            if(6>=this.numberOfRole && !this.isAll)
            {
                this.SkillEffect_1(selfInfo,battle,isParallel);
            }
            else
            {
                console.warn("生效人数不能大于6人");
            }

            if(this.isAll)
            {
                this.SkillEffect_2(selfInfo,battle,isParallel);
            }
            
        } 
        catch (error) 
        {
            console.warn(this.res+"下的 UseSkill 错误");
        }   
    }

    private SkillEffect_1(selfInfo: RoleInfo, battle: Battle,isPar:boolean):void          //随机对象生效
    {
        try
        {
            console.log("try to use remote Skill_RemoteAtk_3 attack:", this.attack);

            let recipientRoles:Role[] = new Array();
            let self:Role = null;
            let enemyRoles:Role[] = null;
            this.event.isParallel=isPar

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
                role.BeHurted(this.attack, self, battle,EventType.RemoteInjured,isPar);
                console.log("Skill_RemoteAtk_3 远程攻击角色受伤 :",this.attack);
            });
        }
        catch (error) 
        {
            console.warn(this.res+"下的 SkillEffect 错误");
            console.log(error);
        }
    }

    private SkillEffect_2(selfInfo: RoleInfo, battle: Battle,isPar:boolean)         //场上全部生效
    {
        let self:Role=null;
        this.event.isParallel=isPar;

        if(Camp.Self==selfInfo.camp)
        {
            self=battle.GetSelfTeam().GetRole(selfInfo.index);
        }
        if(Camp.Enemy==selfInfo.camp)
        {
            self=battle.GetEnemyTeam().GetRole(selfInfo.index);
        }

        let recipientRoles:Role[] = battle.GetSelfTeam().GetRoles();
        let enemyRoles:Role[] = battle.GetEnemyTeam().GetRoles();

        for(let t of enemyRoles)
        {
            recipientRoles.push(t);
        }

        for(let role of recipientRoles)
        {
            role.BeHurted(this.attack, self, battle,EventType.RemoteInjured,isPar)
        }
    }
}


