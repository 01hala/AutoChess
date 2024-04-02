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

function splitEvs(evs:skill.Event[]) {
    let injuredEvs:skill.Event[] = [];
    let normalEvs:skill.Event[] = [];

    for (let ev of evs) {
        if (enums.EventType.RemoteInjured == ev.type || enums.EventType.AttackInjured == ev.type || enums.EventType.Exit == ev.type) {
            injuredEvs.push(ev);
        }
        else {
            normalEvs.push(ev);
        }
    }
    
    return [injuredEvs, normalEvs]
}

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
        console.log("推送战斗开始事件");
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
        if (self && !self.CheckDead() && enemy && !enemy.CheckDead()) {
            console.log("battle Attack");

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

    private async tickInjuredEventChain(evs:skill.Event[]) {
        if (evs == null || evs.length <= 0) {
            return;
        }

        await this.on_event.call(null, evs);

        this.tickSkill(evs);
        let _evs = this.evs.slice();
        this.evs = [];
        let [injuredEvs, normalEvs] = splitEvs(_evs);
        await this.tickInjuredEvent(injuredEvs);
        await this.tickInjuredEventChain(normalEvs);

        this.CheckRemoveDeadRole();
        _evs = this.evs.slice();
        this.evs = [];
        [injuredEvs, normalEvs] = splitEvs(_evs);

        await this.tickInjuredEvent(injuredEvs);
        await this.tickInjuredEventChain(normalEvs);
    }

    private async tickInjuredEvent(evs:skill.Event[]) {
        if (evs == null || evs.length <= 0) {
            return;
        }

        let tmpEvs:skill.Event[] = [];
        for (let ev of evs) {
            if (!this.checkTriggerSkill([ev])) {
                tmpEvs.push(ev);
            }
            else {
                await this.on_event.call(null, [ev]);

                this.tickSkill([ev]);
                let _evs = this.evs.slice();
                this.evs = [];
                let [injuredEvs, normalEvs] = splitEvs(_evs);

                await this.tickInjuredEvent(injuredEvs);
                await this.tickInjuredEventChain(normalEvs);

                this.CheckRemoveDeadRole();
                _evs = this.evs.slice();
                this.evs = [];
                [injuredEvs, normalEvs] = splitEvs(_evs);

                await this.tickInjuredEvent(injuredEvs);
                await this.tickInjuredEventChain(normalEvs);
            }
        }
        await this.on_event.call(null, tmpEvs);
    }

    private async tickBattleInjuredEvent(evs:skill.Event[]) {
        if (evs == null || evs.length <= 0) {
            return;
        }

        this.tickSkill(evs);
        let _evs = this.evs.slice();
        this.evs = [];
        let [injuredEvs, normalEvs] = splitEvs(_evs);

        await this.tickInjuredEvent(injuredEvs);
        await this.tickInjuredEventChain(normalEvs);
    }

    private checkTriggerSkill(evs:skill.Event[]) {
        let selfTeam = this.selfTeam.GetRoles();
        for(let index in selfTeam) {
            let role = selfTeam[index];
            if (role.CheckSkillIsLock()) {
                continue;
            }

            let roleInfo = new skill.RoleInfo();
            roleInfo.properties=role.GetProperties();
            console.log("战斗事件中角色攻击力:")
            
            roleInfo.index =  role.index;
            roleInfo.camp = enums.Camp.Self;
            let p = 0;
            let skillImpl: skill.SkillBase = null;
            for(let skill of role.skill) {
                let flag=skill.trigger.CheckSkillTrigger(evs, roleInfo)
                if (flag) {
                    if (skill.skill.Priority > p) {
                        skillImpl = skill.skill;
                        p = skill.skill.Priority;
                    }
                }
            }
            if (skillImpl) {
                return true;
            }
        }

        let enemyTeam = this.enemyTeam.GetRoles();
        for(let index in enemyTeam) {
            let role = enemyTeam[index];
            if (role.CheckSkillIsLock()) {
                continue;
            }

            let roleInfo = new skill.RoleInfo();
            roleInfo.properties=role.GetProperties();
            
            roleInfo.index =  role.index;
            roleInfo.camp = enums.Camp.Enemy;
            let p = 0;
            let skillImpl: skill.SkillBase = null;
            for(let skill of role.skill) {
                let flag=skill.trigger.CheckSkillTrigger(evs, roleInfo)
                if (flag) {
                    if (skill.skill.Priority > p) {
                        skillImpl = skill.skill;
                        p = skill.skill.Priority;
                    }
                }
            }
            if (skillImpl) {
                return true;
            }
        }

        return false;
    }

    private tickSkill(evs:skill.Event[]) {
        console.log("TickBattle evs:", evs);

        let selfTeam = this.selfTeam.GetRoles();
        for(let index in selfTeam) {
            let role = selfTeam[index];
            if (role.CheckSkillIsLock()) {
                continue;
            }

            let roleInfo = new skill.RoleInfo();
            roleInfo.properties=role.GetProperties();
            console.log("战斗事件中角色攻击力:")
            
            roleInfo.index =  role.index;
            roleInfo.camp = enums.Camp.Self;
            let p = 0;
            let skillImpl: skill.SkillBase = null;
            let isPar=false;
            for(let skill of role.skill) {
                let flag=skill.trigger.CheckSkillTrigger(evs, roleInfo)
                if (flag) {
                    if(2==flag){
                        isPar=true;
                        console.log("Parallel skill detected");
                    }
                    if (skill.skill.Priority > p) {
                        skillImpl = skill.skill;
                        p = skill.skill.Priority;
                    }
                }
            }
            if (skillImpl) {
                role.LockSkill();
                console.log("Are skills parallel:"+isPar);
                skillImpl.UseSkill(roleInfo, this,isPar);
            }
        }

        let enemyTeam = this.enemyTeam.GetRoles();
        for(let index in enemyTeam) {
            let role = enemyTeam[index];
            if (role.CheckSkillIsLock()) {
                continue;
            }

            let roleInfo = new skill.RoleInfo();
            roleInfo.properties=role.GetProperties();
            
            roleInfo.index =  role.index;
            roleInfo.camp = enums.Camp.Enemy;
            let p = 0;
            let skillImpl: skill.SkillBase = null;
            let isPar=false;
            for(let skill of role.skill) {
                let flag=skill.trigger.CheckSkillTrigger(evs, roleInfo)
                if (flag) {
                    if(2==flag) isPar=true;
                    if (skill.skill.Priority > p) {
                        skillImpl = skill.skill;
                        p = skill.skill.Priority;
                    }
                }
            }
            if (skillImpl) {
                role.LockSkill();
                skillImpl.UseSkill(roleInfo, this,isPar);
            }
        }
    }

    private triggerBeforeAttack : boolean = true;
    public async TickBattle() : Promise<boolean> {
        let evs = this.evs.slice();
        this.evs = [];
        let [injuredEvs, normalEvs] = splitEvs(evs);
        await this.tickInjuredEvent(injuredEvs);
        await this.on_event.call(null, normalEvs);
        
        if (normalEvs.length > 0) {
            this.tickSkill(normalEvs);
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

            return false;
        }

        this.battle();
        this.triggerBeforeAttack = true;

        if (this.evs.length > 0) {
            let evs = this.evs.slice();
            this.evs = [];
            await this.on_event.call(null, evs);
            let [injuredEvs, _] = splitEvs(evs);
            await this.tickBattleInjuredEvent(injuredEvs);
            return false;
        }

        return this.CheckEndBattle();
    }
}

export function GetSelfTeam() {
    throw new Error('Function not implemented.')
}
