import { _decorator, Component, error, Node } from 'cc';
import { SkillBase,Event, RoleInfo, SkillTriggerBase } from './skill_base';
import { Camp, EventType, SkillType } from '../enums';
import { Battle } from '../battle';
import { Property, Role } from '../role';
import { random } from '../util';
const { ccclass, property } = _decorator;

@ccclass('Skill_RecoveryHP_2')
export class Skill_RecoveryHP_2 extends SkillBase {
    public res:string="battle/skill/Skill_RecoveryHP_2";
    private numberOfRole:number;
    private effectiveValue : number;

    constructor(priority:number, numberOfRole:number, effectiveValue : number){
        super(priority);
        this.numberOfRole = numberOfRole;
        this.effectiveValue = effectiveValue;
    }

    UseSkill(selfInfo: RoleInfo, battle: Battle): void
    {
        try
        {
            let effectiveRole : Role[] = null;
            if(Camp.Enemy == selfInfo.camp) {
                effectiveRole = battle.GetEnemyTeam().GetRoles().slice();
            }
            else if(Camp.Self == selfInfo.camp) {
                effectiveRole = battle.GetSelfTeam().GetRoles().slice();
            }

            let recipientRoles:Role[] = [];
            while(recipientRoles.length < this.numberOfRole) {
                let index = random(0, effectiveRole.length);
                recipientRoles.push(effectiveRole[index]);
                effectiveRole.splice(index, 1);
            }

            for(const r of recipientRoles) {
                let totalHP = r.GetProperty(Property.TotalHP);
                let HP = r.GetProperty(Property.HP) + this.effectiveValue;
                if (HP > totalHP) {
                    HP = totalHP;
                }
                r.ChangeProperties(Property.HP, HP);
            }
        }
        catch(e)
        {
            console.error(this.res + "下的" +  e + "异常");
        }
    }
}


