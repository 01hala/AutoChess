/*
 * battle.ts
 * author: qianqians
 * 2023/9/24
 */
import * as skill from './skill/skill_base'
import * as role from './role'
import * as team from './team'
import * as enums from './enums'

export class Battle {
    private selfTeam : team.Team;
    private enemyTeam : team.Team;

    private evs:skill.Event[] = [];

    public GetSelfTeam() : team.Team {
        return this.selfTeam;
    }

    public GetEnemyTeam() : team.Team {
        return this.enemyTeam;
    }

    public AddBattleEvent(ev:skill.Event) {
        this.evs.push(ev);
    }

    public on_event : ((evs:skill.Event[]) => void)[];

    public StartBattle() {
        let ev = new skill.Event();
        ev.type = enums.EventType.BattleBegin;
        this.AddBattleEvent(ev);
    }

    private battle() {
        let self = this.selfTeam.GetRole(0);
        let enemy = this.enemyTeam.GetRole(0);

        if (self != null && enemy != null) {
            let damageEnemy = self.Attack(enemy, this);
            let damageSelf = enemy.Attack(self, this);
        }
    }

    public GetWinCamp() : enums.Camp {
        if (!this.checkEndBattle()){
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

    private checkEndBattle() : boolean {
        return this.selfTeam.CheckDefeated() || this.enemyTeam.CheckDefeated();
    }

    private triggerBeforeAttack : boolean = true;
    public TickBattle() : boolean {
        if (this.evs.length > 0) {
            let evs = this.evs;
            this.evs = [];
            for(let ev of this.on_event) {
                ev.call(null, evs);
            }

            this.selfTeam.CheckRemoveDeadRole();
            this.enemyTeam.CheckRemoveDeadRole();

            return false;
        }

        if (this.triggerBeforeAttack) {
            let ev = new skill.Event();
            ev.type = enums.EventType.BeforeAttack;
            this.AddBattleEvent(ev);
            this.triggerBeforeAttack = false;
            return false;
        }

        this.battle();
        this.triggerBeforeAttack = true;

        if (this.evs.length > 0) {
            return false;
        }

        return this.checkEndBattle();
    }
}