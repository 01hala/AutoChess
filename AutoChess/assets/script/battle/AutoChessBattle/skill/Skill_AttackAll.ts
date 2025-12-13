/*
 * Skill_AttackAll.ts
 * author: Guanliu
 * 2023/12/20
 * 攻击场上所有敌人造成n点伤害
 */
import { _decorator, Component, error, Node } from 'cc';
import { SkillBase,Event, RoleInfo, SkillTriggerBase } from './skill_base';
import * as BattleEnums from '../BattleEnums';
import { Battle } from '../battle';
import { Role } from '../role';
import { random } from '../util';
const { ccclass, property } = _decorator;

@ccclass('Skill_AttackAll')
export class Skill_AttackAll extends SkillBase {
    public res:string="battle/skill/Skill_AttackAll";
    private effectiveValue:number;
    private eventSound:string;

    constructor(priority:number, effectiveValue : number,eventSound:string,isfetter:boolean=false){
        super(priority,isfetter);
        this.effectiveValue = effectiveValue;
        if(null!=eventSound){
            this.eventSound=eventSound;
        }
    }

    UseSkill(selfInfo: RoleInfo, battle: Battle, isParallel:boolean): void
    {
        try
        {
            let effectiveRole : Role[] = null;
            battle.onPlayerOnShot.call(null, this.eventSound);

            effectiveRole = battle.GetEnemyTeam().GetRoles().slice();
            for(const r of effectiveRole){
                r.BeHurted(this.effectiveValue,null,battle,BattleEnums.EventType.RemoteInjured);
            }
            effectiveRole = battle.GetSelfTeam().GetRoles().slice();
            for(const r of effectiveRole){
                r.BeHurted(this.effectiveValue,null,battle,BattleEnums.EventType.RemoteInjured);
            }
        }
        catch(e)
        {
            console.error(this.res + "下的" +  e + "异常");
        }
    }
}


