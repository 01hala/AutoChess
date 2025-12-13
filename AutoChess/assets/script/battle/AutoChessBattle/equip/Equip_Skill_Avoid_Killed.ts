/*
 * Equip_Skill_Avoid_Killed.ts
 * author: qianqian
 * 2025/02/28
 * 免疫一次必死伤害
 */
import { _decorator, Component, Node } from 'cc';
import { SkillBase,Event, RoleInfo, SkillTriggerBase } from '../skill/skill_base';
import * as BattleEnums from '../BattleEnums';
import { Battle } from '../battle';
import { Role } from '../role';
import { random } from '../util';
import * as config from '../config/config';
import { Team } from '../team';

export class Skill_Avoid_Killed extends SkillBase
{
    public constructor(priority:number, isfetter:boolean=false) {
        super(priority,isfetter);
    }

    UseSkill(selfInfo:RoleInfo, battle:Battle, isParallel:boolean , evs?:Event[]): void {
        let t:Team = null;
        if (selfInfo.camp == BattleEnums.Camp.Self) {
            t = battle.GetSelfTeam();
        }
        else {
            t = battle.GetEnemyTeam();
        }

        let r = t.GetRole(selfInfo.index);
        r.equip = 0;
        r.properties.set(BattleEnums.Property.HP, 1);
        r.properties.set(BattleEnums.Property.TotalHP, 1);
    }
}