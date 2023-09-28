/*
 * role.ts
 * author: qianqians
 * 2023/9/24
 */
import * as skill from './skill/skill_base'
import * as battle from './battle'
import * as enums from './enums'

export enum Property {
    Health = 1,
    Attack = 2,
    DamageReduction = 3,
    DamageReductionRound = 4,
    //
    InevitableKill = 5, // 暂时放这里. 0 普通伤害，1 必杀
}

export class SkillInfo {
    public trigger : skill.SkillTriggerBase;
    public skill : skill.SkillBase;
}

export class Role {
    public skill : SkillInfo[] = []; // 一般情况只有一个技能，使用特殊食物时添加一个技能

    private properties : Map<Property, number> = new Map<Property, number>();
    private selfCamp: enums.Camp;

    public constructor(selfCamp: enums.Camp, properties : Map<Property, number>) {
        this.selfCamp = selfCamp;
        this.properties = properties;
    }

    private sendHurtedEvent(enemy: Role, damage: number, battle: battle.Battle) {
        let selfTeam = this.selfCamp == enums.Camp.Self ? battle.GetSelfTeam() : battle.GetEnemyTeam();
        let enemyTeam = this.selfCamp == enums.Camp.Self ? battle.GetEnemyTeam() : battle.GetSelfTeam();
        let selfIndex = selfTeam.GetRoleIndex(this);
        let enemyIndex = enemyTeam.GetRoleIndex(enemy);

        if (this.CheckDead()) {
            let ev = new skill.Event();
            ev.type = enums.EventType.Syncope;
            ev.spellcaster = new skill.RoleInfo();
            ev.spellcaster.camp = enemy.selfCamp;
            ev.spellcaster.index = enemyIndex;
            ev.recipient = [];
            let recipient = new skill.RoleInfo();
            recipient.camp = this.selfCamp;
            recipient.index = selfIndex;
            ev.recipient.push(recipient);
            ev.value = [];
            ev.value.push(damage);
            battle.AddBattleEvent(ev);
        } 
        if (damage > 0) {
            let ev = new skill.Event();
            ev.type = enums.EventType.Injured;
            ev.spellcaster = new skill.RoleInfo();
            ev.spellcaster.camp = enemy.selfCamp;
            ev.spellcaster.index = enemyIndex;
            ev.recipient = [];
            let recipient = new skill.RoleInfo();
            recipient.camp = this.selfCamp;
            recipient.index = selfIndex;
            ev.recipient.push(recipient);
            ev.value = [];
            ev.value.push(damage);
            battle.AddBattleEvent(ev);
        }
    }

    private sendChangeEvent(enemy: Role, properties: Map<Property, number>, battle: battle.Battle)
    {
        let selfTeam = this.selfCamp == enums.Camp.Self ? battle.GetSelfTeam() : battle.GetEnemyTeam();
        let enemyTeam = this.selfCamp == enums.Camp.Enemy ? battle.GetEnemyTeam() : battle.GetSelfTeam();
        let selfIndex = selfTeam.GetRoleIndex(this);
        let enemyIndex = enemyTeam.GetRoleIndex(enemy);

        if (this.CheckDead()) {
            let ev = new skill.Event();
            ev.type = enums.EventType.Syncope;
            ev.spellcaster = new skill.RoleInfo();
            ev.spellcaster.camp = enemy.selfCamp;
            ev.spellcaster.index = enemyIndex;
            ev.recipient = [];
            let recipient = new skill.RoleInfo();
            recipient.camp = this.selfCamp;
            recipient.index = selfIndex;
            ev.recipient.push(recipient);
            ev.value = [];
            properties.forEach((value) => 
            {
                ev.value.push(value);
            });
            battle.AddBattleEvent(ev);
        } 
        
        if(properties[Property.Health]>this.properties[Property.Health] || properties[Property.Attack]>this.properties[Property.Attack])
        {
            let ev = new skill.Event();
            ev.type = enums.EventType.EatFood;
            ev.spellcaster = new skill.RoleInfo();
            ev.spellcaster.camp = enemy.selfCamp;
            ev.spellcaster.index = enemyIndex;
            ev.recipient = [];
            let recipient = new skill.RoleInfo();
            recipient.camp = this.selfCamp;
            recipient.index = selfIndex;
            ev.recipient.push(recipient);
            ev.value = [];
            properties.forEach((value) => 
            {
                ev.value.push(value);
            });
            battle.AddBattleEvent(ev);
        }

        

    }

    public BeHurted(damage:number, enemy: Role, battle: battle.Battle) {

        let hp = this.GetProperty(Property.Health);
        let reduction = this.GetProperty(Property.DamageReduction);
        let reductionRound = this.GetProperty(Property.DamageReductionRound);

        if (reductionRound > 0) {
            this.ChangeProperties(Property.DamageReductionRound, --reductionRound);
            damage -= reduction;
            damage = damage < 0 ? 0 : damage;
        }

        hp -= damage;
        this.ChangeProperties(Property.Health, hp);
        this.sendHurtedEvent(enemy, damage, battle);
    }

    public BeInevitableKill(enemy: Role, battle: battle.Battle) {
        let damageSelf = this.properties[Property.Health];
        this.ChangeProperties(Property.Health, 0);
        this.sendHurtedEvent(enemy, damageSelf, battle);
    }
    
    public ChangeProperties(type:Property,value:number) : Map<Property, number> {
        return null;
    }

    public GetProperty(em: Property) {
        if (this.properties.has(em)) {
            return this.properties[em];
        }
        return 0;
    }

    public CheckDead() {
        return this.properties[Property.Health] == 0;
    }

    public Attack(enemy: Role, battle: battle.Battle) : number {
        let inevitableKill = this.GetProperty(Property.InevitableKill);
        if (inevitableKill == 1) {
            enemy.BeInevitableKill(this, battle);
        }
        else {
            let damage = this.GetProperty(Property.Attack);
            enemy.BeHurted(damage, this, battle);
        }

        return 0;
    }
}