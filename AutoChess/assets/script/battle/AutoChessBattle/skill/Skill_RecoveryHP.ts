/*
 * Skill_RecoveryHP
 * author: ?
 * 2023/10/1
 * 恢复生命
 */

import { _decorator, Component, error, Node } from 'cc';
import { SkillBase,Event, RoleInfo, SkillTriggerBase } from './skill_base';
import * as BattleEnums from '../BattleEnums';
import { Battle } from '../battle';
import { Role } from '../role';
import { random } from '../util';
const { ccclass, property } = _decorator;

@ccclass('Skill_RecoveryHP')
export class Skill_RecoveryHP extends SkillBase {
    public res:string="battle/skill/Skill_RecoveryHP.ts";
    private numberOfRole:number;
    private effectiveValue : number;
    private eventSound:string;

    constructor(priority:number, numberOfRole:number, effectiveValue : number,eventSound?:string,isfetter:boolean=false){
        super(priority,isfetter);
        this.numberOfRole = numberOfRole;
        this.effectiveValue = effectiveValue;
        if(null!=eventSound){
            this.eventSound=eventSound;
        }
    }

    UseSkill(selfInfo: RoleInfo, battle: Battle,isParallel:boolean): void
    {
        try
        {
            let event: Event = new Event();
            event.isParallel = isParallel;
            event.spellcaster = selfInfo;
            event.type = BattleEnums.EventType.UsedSkill;
            battle.AddBattleEvent(event);
           if(this.numberOfRole<6)
           {
                this.SkillEffect_2(selfInfo , battle, isParallel);
           }
           if(6==this.numberOfRole)
           {
                this.SkillEffect_1(selfInfo , battle,true);
           }
           battle.onPlayerOnShot.call(null, this.eventSound);
        }
        catch(e)
        {
            console.error(this.res + "下的" +  e + "异常");
        }
    }

    SkillEffect_1(selfInfo: RoleInfo, battle: Battle,isPar:boolean)
    {
        try
        {
            let event = new Event();
            event.type = BattleEnums.EventType.IntensifierProperties;
            event.spellcaster = selfInfo;
            event.isParallel=isPar;
            event.recipient = [];
            event.isFetter=this.isFetter;
    
            let indexs: number[] = [];
    
            let rolesTemp: Role[] = [];
    
            if (BattleEnums.Camp.Self == selfInfo.camp)
            {
                rolesTemp = battle.GetSelfTeam().GetRoles().slice();
            }
    
            if (BattleEnums.Camp.Enemy == selfInfo.camp)
            {
                rolesTemp = battle.GetEnemyTeam().GetRoles().slice();
            }

            let recipientRoles:Role[]=new Array();
            for(let r of rolesTemp)
            {
                if(r!=null && r.index != selfInfo.index)
                {
                    recipientRoles.push(r);
                }
            }

            recipientRoles.forEach((role) => 
            {
                console.log("recipientRoles role:", role, " ChangeProperties!");
                role.ChangeProperties(BattleEnums.Property.HP, role.GetProperty(BattleEnums.Property.HP) + this.effectiveValue);
                role.ChangeProperties(BattleEnums.Property.TotalHP, role.GetProperty(BattleEnums.Property.TotalHP) + this.effectiveValue);
            });
    
            for(let r of rolesTemp)
            {
                if(r!=null && r.index != selfInfo.index)
                {
                    let roleInfo:RoleInfo=new RoleInfo();
                    roleInfo.camp=selfInfo.camp;
                    roleInfo.index=r.index;
                    event.recipient.push(roleInfo);
                }
            }
    
            event.value = [this.effectiveValue];
            event.effectScope=1;
            battle.AddBattleEvent(event);
        }
        catch(error)
        {
            console.warn(this.res+"下的 SkillEffect_4 错误 ",error);
        }
    }

    SkillEffect_2(selfInfo: RoleInfo, battle: Battle,isPar:boolean)
    {
        let event = new Event();
        event.type = BattleEnums.EventType.IntensifierProperties;
        event.spellcaster = selfInfo;
        event.isParallel=isPar;
        event.recipient = [];
        event.isFetter=this.isFetter;

        let effectiveRole : Role[] = null;
        if(BattleEnums.Camp.Enemy == selfInfo.camp) {
            effectiveRole = battle.GetEnemyTeam().GetRoles().slice();
        }
        else if(BattleEnums.Camp.Self == selfInfo.camp) {
            effectiveRole = battle.GetSelfTeam().GetRoles().slice();
        }

        let recipientRoles:Role[] = [];
        while(recipientRoles.length < this.numberOfRole && effectiveRole.length > 0) {
            let index = random(0, effectiveRole.length);
            recipientRoles.push(effectiveRole[index]);
            effectiveRole.splice(index, 1);
        }

        for(const r of recipientRoles) {
            let totalHP = r.GetProperty(BattleEnums.Property.TotalHP);
            let HP = r.GetProperty(BattleEnums.Property.HP) + this.effectiveValue;
            if (HP > totalHP) {
                HP = totalHP;
            }
            battle.onPlaySound.call(null, this.eventSound);
            r.ChangeProperties(BattleEnums.Property.HP, HP);

            let tRoleInfo=new RoleInfo();
            tRoleInfo.id=r.id;
            tRoleInfo.index=r.index;
            tRoleInfo.properties=r.GetProperties();
            tRoleInfo.battleCount=r.selfCamp;

            event.recipient.push(tRoleInfo);
        }

        event.value = [this.effectiveValue];
        event.effectScope=1;
        battle.AddBattleEvent(event)
    }
}
