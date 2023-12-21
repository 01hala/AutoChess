/*
 * battle.ts
 * author: qianqians
 * 2023/9/24
 */
import * as common from "../serverSDK/common"
import * as skill from './skill/skill_base'
import * as role from './role'
import * as team from './team'
import * as enums from '../other/enums'

export class Battle {
    private selfTeam : team.Team;
    private enemyTeam : team.Team;

    private evs:skill.Event[] = [];

    public victory = 0;
    public faild = 0;

    public constructor(self:common.UserBattleData, target:common.UserBattleData) {
        this.selfTeam = new team.Team(enums.Camp.Self, self, self.RoleList);
        this.enemyTeam = new team.Team(enums.Camp.Enemy, target, target.RoleList);

        this.victory = self.victory;
        this.faild = self.faild;
    }

    public GetSelfTeam() : team.Team {
        return this.selfTeam;
    }

    public GetEnemyTeam() : team.Team {
        return this.enemyTeam;
    }

    public AddBattleEvent(ev:skill.Event) {
        this.evs.push(ev);
    }

    public on_event : ((evs:skill.Event[]) => Promise<void>) = null;

    public StartBattle() {
        let ev = new skill.Event();
        ev.type = enums.EventType.BattleBegin;
        this.AddBattleEvent(ev);
    }

    private battle() {
        console.log("battle begin!");

        let selfTeam = this.selfTeam.GetRoles();
        for(let role of selfTeam) {
            role.UnlockSkill();
        }

        let enemyTeam = this.enemyTeam.GetRoles();
        for(let role of enemyTeam) {
            role.UnlockSkill();
        }

        let self = this.selfTeam.GetLasterRole();
        let enemy = this.enemyTeam.GetLasterRole();

        if (self != null && enemy != null) {
            self.Attack(enemy, this);
            enemy.Attack(self, this);

            let ev = new skill.Event();
            ev.type = enums.EventType.AfterAttack;
            this.AddBattleEvent(ev);
        }

        console.log("battle end!");
    }

    public GetWinCamp() : enums.Camp {
        if (!this.CheckEndBattle()){
            return enums.Camp.None;
        }

        if (this.selfTeam.CheckDefeated() && this.enemyTeam.CheckDefeated()) {
            return enums.Camp.Tie;
        }

        if (this.selfTeam.CheckDefeated()) {
            return enums.Camp.Enemy;
        }

        return enums.Camp.Self;
    }

    public CheckEndBattle() : boolean {
        return this.evs.length <= 0 && (this.selfTeam.CheckDefeated() || this.enemyTeam.CheckDefeated());
    }

    public CheckRemoveDeadRole() {
        return this.selfTeam.CheckRemoveDeadRole(this) || this.enemyTeam.CheckRemoveDeadRole(this);
    }

    private triggerBeforeAttack : boolean = true;
    public async TickBattle() : Promise<boolean> {
        let evs = this.evs.slice();
        await this.on_event.call(null, evs);

        if (this.evs.length > 0) {
            this.evs = [];

            console.log("TickBattle evs:", evs);

            let selfTeam = this.selfTeam.GetRoles();
            for(let index in selfTeam) {
                let role = selfTeam[index];
                if (role.CheckSkillIsLock()) {
                    continue;
                }

                let roleInfo = new skill.RoleInfo();
                roleInfo.attack=role.GetProperty(enums.Property.Attack);
                roleInfo.hp=role.GetProperty(enums.Property.HP);
                roleInfo.index =  role.index;
                roleInfo.camp = enums.Camp.Self;
                let p = 0;
                let skillImpl: skill.SkillBase = null;
                for(let skill of role.skill) {
                    if (skill.trigger.CheckSkillTrigger(evs, roleInfo)) {
                        if (skill.skill.Priority > p) {
                            skillImpl = skill.skill;
                            p = skill.skill.Priority;
                        }
                    }
                }
                if (skillImpl) {
                    role.LockSkill();
                    skillImpl.UseSkill(roleInfo, this);
                }
            }

            let enemyTeam = this.enemyTeam.GetRoles();
            for(let index in enemyTeam) {
                let role = enemyTeam[index];
                if (role.CheckSkillIsLock()) {
                    continue;
                }

                let roleInfo = new skill.RoleInfo();
                roleInfo.attack=role.GetProperty(enums.Property.Attack);
                roleInfo.hp=role.GetProperty(enums.Property.HP);
                roleInfo.index =  role.index;
                roleInfo.camp = enums.Camp.Enemy;
                let p = 0;
                let skillImpl: skill.SkillBase = null;
                for(let skill of role.skill) {
                    if (skill.trigger.CheckSkillTrigger(evs, roleInfo)) {
                        if (skill.skill.Priority > p) {
                            skillImpl = skill.skill;
                            p = skill.skill.Priority;
                        }
                    }
                }
                if (skillImpl) {
                    role.LockSkill();
                    skillImpl.UseSkill(roleInfo, this);
                }
            }

            //console.log("tick events");
            return false;
        }

        if (this.evs.length <= 0) {
            if (this.CheckRemoveDeadRole()) {
                return false;
            }
        }

        if (this.triggerBeforeAttack) {
            let ev = new skill.Event();
            ev.type = enums.EventType.BeforeAttack;
            this.AddBattleEvent(ev);
            this.triggerBeforeAttack = false;

            //console.log("trigger Before Attack");
            return false;
        }

        this.battle();
        //console.log("battle Attack");
        this.triggerBeforeAttack = true;

        if (this.evs.length > 0) {
            return false;
        }

        return this.CheckEndBattle();
    }
}