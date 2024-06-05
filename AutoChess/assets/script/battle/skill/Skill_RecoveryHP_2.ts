import { _decorator, Component, error, Node } from 'cc';
import { SkillBase,Event, RoleInfo, SkillTriggerBase } from './skill_base';
import { Property, Camp, EventType, SkillType } from '../../other/enums';
import { Battle } from '../battle';
import { Role } from '../role';
import { random } from '../util';
import { AudioManager } from '../../other/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('Skill_RecoveryHP_2')
export class Skill_RecoveryHP_2 extends SkillBase {
    public res:string="battle/skill/Skill_RecoveryHP_2";
    private numberOfRole:number;
    private effectiveValue : number;
    private eventSound:string;

    constructor(priority:number, numberOfRole:number, effectiveValue : number,eventSound?:string){
        super(priority);
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
            let effectiveRole : Role[] = null;
            if(Camp.Enemy == selfInfo.camp) {
                effectiveRole = battle.GetEnemyTeam().GetRoles().slice();
            }
            else if(Camp.Self == selfInfo.camp) {
                effectiveRole = battle.GetSelfTeam().GetRoles().slice();
            }

            let recipientRoles:Role[] = [];
            while(recipientRoles.length < this.numberOfRole && effectiveRole.length > 0) {
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
                AudioManager.Instance.PlaySound(this.eventSound);
                r.ChangeProperties(Property.HP, HP);
            }
        }
        catch(e)
        {
            console.error(this.res + "下的" +  e + "异常");
        }
    }
}


