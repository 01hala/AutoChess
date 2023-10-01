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
    private camp : Camp;
    private effectiveValue : number;

    constructor(camp : Camp, effectiveValue : number){
        super();
        this.camp = camp;
    }

    UseSkill(selfInfo: RoleInfo, battle: Battle): void
    {
        try
        {
            let effectiveRole : Role[] = null;
            if(Camp.Enemy == this.camp) {
                effectiveRole = battle.GetEnemyTeam().GetRoles();
            }
            else if(Camp.Self == this.camp) {
                effectiveRole = battle.GetSelfTeam().GetRoles();
            }

            for(const r of effectiveRole) {
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


