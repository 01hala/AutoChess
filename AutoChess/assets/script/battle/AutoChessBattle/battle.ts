/*
 * battle.ts
 * author: qianqians
 * 2023/9/24
 */
import * as common from "../../serverSDK/common";
import * as skill from "./skill/skill_base";
import * as role from "./role";
import * as team from "./team";
import * as battleEnums from "./BattleEnums";
import * as enums from "../../other/enums";

function splitEvs(evs: skill.Event[]) {
  let injuredEvs: skill.Event[] = [];
  let normalEvs: skill.Event[] = [];

  for (let ev of evs) {
    switch (ev.type) {
      case battleEnums.EventType.RemoteInjured:
      case battleEnums.EventType.AttackInjured:
      case battleEnums.EventType.Syncope:
      case battleEnums.EventType.ChangeLocation:
      case battleEnums.EventType.IntensifierProperties:
      case battleEnums.EventType.SwapProperties:
        {
          injuredEvs.push(ev);
        }
        break;
      default:
        {
          normalEvs.push(ev);
        }
        break;
    }
  }

  return [injuredEvs, normalEvs];
}

export class Battle {
  private selfTeam: team.Team;
  private enemyTeam: team.Team;

  public evs: skill.Event[] = [];

  public victory = 0;
  public faild = 0;
  public round = 0;
  public addCoin = 0;

  public gamemode: enums.GameMode;

  public on_event: (evs: skill.Event[]) => Promise<void> = null;
  public onPlaySound: (eventSound: string) => void;
  public onPlayerOnShot: (eventSound: string) => void;
  public onKillRole: (r: common.Role) => void;

  public constructor(
    self: common.UserBattleData,
    enemy: common.UserBattleData,
    gamemode: enums.GameMode,
  ) {
    this.selfTeam = new team.Team(battleEnums.Camp.Self, self, self.RoleList);
    this.enemyTeam = new team.Team(
      battleEnums.Camp.Enemy,
      enemy,
      enemy.RoleList,
    );

    this.selfTeam.onKillRole = (_r: common.Role) => {
      if (this.onKillRole) {
        this.onKillRole.call(null, _r);
      }
    };
    this.enemyTeam.onKillRole = (_r: common.Role) => {
      if (this.onKillRole) {
        this.onKillRole.call(null, _r);
      }
    };

    this.victory = self.victory;
    this.faild = self.faild;
    this.round = self.round;
    this.gamemode = gamemode;
  }

  public GetSelfTeam(): team.Team {
    return this.selfTeam;
  }

  public GetEnemyTeam(): team.Team {
    return this.enemyTeam;
  }

  public AddBattleEvent(ev: skill.Event) {
    this.evs.push(ev);
  }

  public StartBattle() {
    let ev = new skill.Event();
    ev.type = battleEnums.EventType.BattleBegin;
    console.log("推送战斗开始事件");
    this.AddBattleEvent(ev);
  }

  private battle() {
    console.log("battle begin!");

    let self = this.selfTeam.GetLasterRole();
    let enemy = this.enemyTeam.GetLasterRole();
    if (self && !self.CheckDead() && enemy && !enemy.CheckDead()) {
      console.log("battle Attack");

      self.Attack(enemy, this);
      enemy.Attack(self, this);

      let ev = new skill.Event();
      ev.type = battleEnums.EventType.AfterAttack;
      ev.spellcaster = new skill.RoleInfo();
      ev.spellcaster.camp = self.selfCamp;
      ev.spellcaster.index = self.index;
      ev.recipient = [];
      this.AddBattleEvent(ev);

      ev = new skill.Event();
      ev.type = battleEnums.EventType.AfterAttack;
      ev.spellcaster = new skill.RoleInfo();
      ev.spellcaster.camp = enemy.selfCamp;
      ev.spellcaster.index = enemy.index;
      ev.recipient = [];
      this.AddBattleEvent(ev);
    }

    console.log("battle end!");
  }

  public GetWinCamp(): battleEnums.Camp {
    if (!this.CheckEndBattle()) {
      return battleEnums.Camp.None;
    }

    if (this.selfTeam.CheckDefeated() && this.enemyTeam.CheckDefeated()) {
      return battleEnums.Camp.Tie;
    }

    if (this.selfTeam.CheckDefeated()) {
      return battleEnums.Camp.Enemy;
    }

    return battleEnums.Camp.Self;
  }

  public CheckEndBattle(): boolean {
    return (
      this.evs.length <= 0 &&
      (this.selfTeam.CheckDefeated() || this.enemyTeam.CheckDefeated())
    );
  }

  public CheckRemoveDeadRole() {
    return (
      this.selfTeam.CheckRemoveDeadRole(this) ||
      this.enemyTeam.CheckRemoveDeadRole(this)
    );
  }

  private async tickInjuredEventChain(evs: skill.Event[]) {
    if (evs == null || evs.length <= 0) {
      return;
    }

    console.log("tickInjuredEventChain evs:", evs);
    await this.on_event.call(null, evs);
    this.tickSkill(evs);

    if (this.CheckEndBattle()) {
      return;
    }
    this.CheckRemoveDeadRole();

    let _evs = this.evs.slice();
    this.evs = [];
    let [injuredEvs, normalEvs] = splitEvs(_evs);
    await this.tickInjuredEvent(injuredEvs);
    await this.tickInjuredEventChain(normalEvs);

    if (this.CheckEndBattle()) {
      return;
    }
    this.CheckRemoveDeadRole();

    _evs = this.evs.slice();
    this.evs = [];
    [injuredEvs, normalEvs] = splitEvs(_evs);
    await this.tickInjuredEvent(injuredEvs);
    await this.tickInjuredEventChain(normalEvs);
  }

  private async tickInjuredEvent(evs: skill.Event[]) {
    if (evs == null || evs.length <= 0) {
      return;
    }

    console.log("tickInjuredEvent evs:", evs);
    await this.on_event.call(null, evs);

    let tmpPriorityEvs: skill.Event[] = [];
    for (let ev of evs) {
      if (this.checkTriggerSkill([ev]) && !tmpPriorityEvs.includes(ev)) {
        tmpPriorityEvs.push(ev);
        for (let _tmpev of evs) {
          if (
            _tmpev.roleParallel == ev.roleParallel &&
            !tmpPriorityEvs.includes(_tmpev)
          ) {
            tmpPriorityEvs.push(_tmpev);
          }
        }
      }
    }
    let tmpEvs: skill.Event[] = evs.filter(
      (element) => !tmpPriorityEvs.includes(element),
    );
    console.log("tickInjuredEvent tmpPriorityEvs:", tmpPriorityEvs);
    console.log("tickInjuredEvent tmpEvs:", tmpEvs);
    if (tmpPriorityEvs.length > 0) {
      this.tickSkill(tmpPriorityEvs);

      if (this.CheckEndBattle()) {
        return;
      }
      this.CheckRemoveDeadRole();

      let _evs = this.evs.slice();
      this.evs = [];
      let [injuredEvs, normalEvs] = splitEvs(_evs);
      await this.tickInjuredEvent(injuredEvs);
      await this.tickInjuredEventChain(normalEvs);

      if (this.CheckEndBattle()) {
        return;
      }
      this.CheckRemoveDeadRole();

      _evs = this.evs.slice();
      this.evs = [];
      [injuredEvs, normalEvs] = splitEvs(_evs);
      await this.tickInjuredEvent(injuredEvs);
      await this.tickInjuredEventChain(normalEvs);
    }
  }

  private async tickBattleInjuredEvent(evs: skill.Event[]) {
    if (evs == null || evs.length <= 0) {
      return;
    }

    console.log("tickBattleInjuredEvent evs:", evs);

    await this.on_event.call(null, evs);
    this.tickSkill(evs);

    if (this.CheckEndBattle()) {
      return;
    }
    this.CheckRemoveDeadRole();

    let _evs = this.evs.slice();
    this.evs = [];
    let [injuredEvs, normalEvs] = splitEvs(_evs);
    await this.tickInjuredEvent(injuredEvs);
    await this.tickInjuredEventChain(normalEvs);
  }

  public CheckRoleTriggerSkill(role: role.Role, evs: skill.Event[]) {
    let roleInfo = new skill.RoleInfo();
    roleInfo.properties = role.GetProperties();
    console.log("战斗事件中角色攻击力:");

    roleInfo.index = role.index;
    roleInfo.camp = battleEnums.Camp.Self;
    let p = 0;
    let skillImpl: skill.SkillBase = null;
    for (let skill of role.skill) {
      let flag = skill.trigger.CheckSkillTrigger(evs, roleInfo);
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

    if (
      role.fetterSkill &&
      role.fetterSkill.trigger.CheckSkillTrigger(evs, roleInfo)
    ) {
      return true;
    }

    return false;
  }

  private checkTriggerSkill(evs: skill.Event[]) {
    let selfTeam = this.selfTeam.GetRoles();
    for (let index in selfTeam) {
      let role = selfTeam[index];
      if (!this.CheckRoleTriggerSkill(role, evs)) {
        continue;
      } else {
        return true;
      }
    }

    let enemyTeam = this.enemyTeam.GetRoles();
    for (let index in enemyTeam) {
      let role = enemyTeam[index];
      if (!this.CheckRoleTriggerSkill(role, evs)) {
        continue;
      } else {
        return true;
      }
    }

    return false;
  }

  private tickSkill(evs: skill.Event[]) {
    console.log("TickBattle evs:", evs);

    let selfTeam = this.selfTeam.GetRoles();
    for (let index in selfTeam) {
      let role = selfTeam[index];

      let roleInfo = new skill.RoleInfo();
      roleInfo.properties = role.GetProperties();
      console.log("战斗事件中角色攻击力:");

      roleInfo.index = role.index;
      roleInfo.camp = battleEnums.Camp.Self;
      let p = 0;
      let skillImpl: skill.SkillBase = null;
      let isPar = false;
      for (let skill of role.skill) {
        let flag = skill.trigger.CheckSkillTrigger(evs, roleInfo);
        if (0 == flag) {
          flag = this.CheckRepeatSkill(evs, roleInfo);
        }
        if (flag) {
          if (2 == flag) {
            isPar = true;
            console.log("Parallel skill detected");
          }
          if (skill.skill.Priority > p) {
            skillImpl = skill.skill;
            p = skill.skill.Priority;
          }
        }
      }
      if (skillImpl) {
        console.log("Are skills parallel:" + isPar);
        skillImpl.UseSkill(roleInfo, this, isPar, evs);
      }

      if (
        role.fetterSkill &&
        role.fetterSkill.trigger.CheckSkillTrigger(evs, roleInfo)
      ) {
        console.log("Are skills parallel:" + isPar);
        role.fetterSkill.skill.UseSkill(roleInfo, this, isPar, evs);
      }
    }

    let enemyTeam = this.enemyTeam.GetRoles();
    for (let index in enemyTeam) {
      let role = enemyTeam[index];

      let roleInfo = new skill.RoleInfo();
      roleInfo.properties = role.GetProperties();

      roleInfo.index = role.index;
      roleInfo.camp = battleEnums.Camp.Enemy;
      let p = 0;
      let skillImpl: skill.SkillBase = null;
      let isPar = false;
      for (let skill of role.skill) {
        let flag = skill.trigger.CheckSkillTrigger(evs, roleInfo);
        if (0 == flag) {
          flag = this.CheckRepeatSkill(evs, roleInfo);
        }
        if (flag) {
          if (2 == flag) isPar = true;
          if (skill.skill.Priority > p) {
            skillImpl = skill.skill;
            p = skill.skill.Priority;
          }
        }
      }
      if (skillImpl) {
        skillImpl.UseSkill(roleInfo, this, isPar, evs);
      }

      if (
        role.fetterSkill &&
        role.fetterSkill.trigger.CheckSkillTrigger(evs, roleInfo)
      ) {
        console.log("Are skills parallel:" + isPar);
        role.fetterSkill.skill.UseSkill(roleInfo, this, isPar, evs);
      }
    }
  }

  private CheckRepeatSkill(evs: skill.Event[], selfInfo: skill.RoleInfo) {
    for (let ev of evs) {
      if (battleEnums.EventType.RepeatSkill == ev.type) {
        for (let roleinfo of ev.recipient) {
          if (
            roleinfo.index == selfInfo.index &&
            roleinfo.camp == selfInfo.camp
          ) {
            return 1;
          }
        }
      }
    }
    return 0;
  }

  private triggerBeforeAttack: boolean = true;
  public async TickBattle(): Promise<boolean> {
    let _evs = this.evs.slice();
    this.evs = [];
    let [injuredEvs, normalEvs] = splitEvs(_evs);
    await this.tickInjuredEvent(injuredEvs);
    await this.tickInjuredEventChain(normalEvs);

    if (this.CheckEndBattle()) {
      return false;
    }
    this.CheckRemoveDeadRole();

    let self = this.selfTeam.GetLasterRole();
    let enemy = this.enemyTeam.GetLasterRole();
    if (this.triggerBeforeAttack) {
      if (self && enemy) {
        let ev = new skill.Event();
        ev.type = battleEnums.EventType.BeforeAttack;
        ev.spellcaster = new skill.RoleInfo();
        ev.spellcaster.camp = self.selfCamp;
        ev.spellcaster.index = self.index;
        ev.recipient = [];
        this.AddBattleEvent(ev);

        ev = new skill.Event();
        ev.type = battleEnums.EventType.BeforeAttack;
        ev.spellcaster = new skill.RoleInfo();
        ev.spellcaster.camp = enemy.selfCamp;
        ev.spellcaster.index = enemy.index;
        ev.recipient = [];
        this.AddBattleEvent(ev);

        this.triggerBeforeAttack = false;

        return false;
      }
    }

    this.battle();
    this.triggerBeforeAttack = true;

    if (this.evs.length > 0) {
      let evs = this.evs.slice();
      this.evs = [];
      await this.tickBattleInjuredEvent(evs);
      return false;
    }

    return this.CheckEndBattle();
  }
}

export function GetSelfTeam() {
  throw new Error("Function not implemented.");
}
