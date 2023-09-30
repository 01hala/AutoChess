/*
 * Skill_RemoteAttack_3.ts
 * author: Hotaru
 * 2023/9/25
 * 对N敌方随机单位造成M点远程伤害
 */
import { _decorator, Component, Node } from 'cc';
import { SkillBase,Event, RoleInfo, SkillTriggerBase } from './skill_base';
import { Camp, EventType, SkillType } from '../enums';
import { Battle } from '../battle';
import { Property, Role } from '../role';
import { random } from '../util';

export class Skill_RemoteAttack_3 extends SkillBase  
{
    public res:string="battle/skill/Skill_RemoteAttack_3";
    public SkillType:SkillType=SkillType.Attack;

    private numberOfRole : number;
    private attack : number;

    public constructor(numberOfRole:number, attack:number) {
        super();

        this.numberOfRole = numberOfRole;
        this.attack = attack;
    }

    event:Event=new Event();
    UseSkill(selfInfo: RoleInfo, battle: Battle): void 
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
            let recipientRoles:Role[] = new Array();
            let self:Role = null;
            let enemyRoles:Role[] = null;
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
            while(recipientRoles.length < this.numberOfRole) {
                let index = random(0, enemyRoles.length);
                recipientRoles.push(enemyRoles[index]);
                enemyRoles.splice(index, 1);
            }
            recipientRoles.forEach((role)=>{
                role.BeHurted(this.attack, self, battle);
            });
        }
        catch (error) 
        {
            console.warn(this.res+"下的 SkillEffect 错误");
        }
    }
}

