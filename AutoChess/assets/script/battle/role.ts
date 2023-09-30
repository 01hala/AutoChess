/*
 * role.ts
 * author: qianqians
 * 2023/9/24
 */
import * as skill from './skill/skill_base'
import * as buffer from './buffer/buffer'
import * as battle from './battle'
import * as enums from './enums'

export enum Property {
    HP = 1,
    Attack = 2,
}

export class SkillInfo {
    public trigger : skill.SkillTriggerBase;
    public skill : skill.SkillBase;
}

export class Role {
    public id:number;
    public level:number;

    public skill : SkillInfo[] = []; // 一般情况只有一个技能，使用特殊食物时添加一个技能
    public buffer : buffer.Buffer[] = [];

    private properties : Map<Property, number> = new Map<Property, number>();
    private selfCamp: enums.Camp;

    public constructor(id:number,level:number,selfCamp: enums.Camp, properties : Map<Property, number>) {
        this.id=id;
        this.level=level;
        
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

    private checkShareDamageBuffer() : boolean {
        for (let b of this.buffer) {
            if (enums.BufferType.ShareDamage == b.BufferType && b.Round > 0) {
                return true;
            }
        }
        return false;
    }

    private checkInevitableKill() : boolean {
        for (let b of this.buffer) {
            if (enums.BufferType.InevitableKill == b.BufferType && b.Round > 0) {
                return true;
            }
        }
        return false;
    }

    private checkSubstituteDamageFront() : boolean {
        for (let b of this.buffer) {
            if (enums.BufferType.SubstituteDamageFront == b.BufferType && b.Round > 0) {
                return true;
            }
        }
        return false;
    }

    private checkSubstituteDamageRandom() : boolean {
        for (let b of this.buffer) {
            if (enums.BufferType.SubstituteDamageRandom == b.BufferType && b.Round > 0) {
                return true;
            }
        }
        return false;
    }

    private getShareDamageArray(battle: battle.Battle) : Role[] {
        if (!this.checkShareDamageBuffer()) {
            return [this];
        }

        let list = [];
        let selfTeam = this.selfCamp == enums.Camp.Self ? battle.GetSelfTeam().GetRoles() : battle.GetEnemyTeam().GetRoles();
        for (let r of selfTeam) {
            if (r.checkShareDamageBuffer()) {
                list.push(r);
            }
        }

        return list;
    }

    private getSubstituteDamage(battle: battle.Battle) : Role {
        let selfTeam = this.selfCamp == enums.Camp.Self ? battle.GetSelfTeam() : battle.GetEnemyTeam();
        let selfIndex = selfTeam.GetRoleIndex(this);
        
        for (let index in selfTeam.GetRoles()) {
            let i = parseInt(index);
            let r = selfTeam.GetRole(i);
            
            if ((i - selfIndex) == 1 && r.checkSubstituteDamageFront()) {
                return r;
            }

            if (r.checkSubstituteDamageRandom()) {
                return r;
            }
        }

        return null;
    }

    private getReductionDamage() : number {
        for (let b of this.buffer) {
            if (enums.BufferType.ReductionDamage == b.BufferType && b.Round > 0) {
                return b.Value;
            }
        }
        return 0;
    }

    public BeHurted(damage:number, enemy: Role, battle: battle.Battle) {

        let hp = this.GetProperty(Property.HP);
        let reduction = this.getReductionDamage();

        damage -= reduction;
        damage = damage < 0 ? 0 : damage;

        hp -= damage;
        this.ChangeProperties(Property.HP, hp);
        this.sendHurtedEvent(enemy, damage, battle);
    }

    public BeInevitableKill(enemy: Role, battle: battle.Battle) {
        let damageSelf = this.properties[Property.HP];
        this.ChangeProperties(Property.HP, 0);
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
/*
 * 添加
 * 因为存在交换属性的技能，所以添加一个函数返回某个角色的所有属性Map的副本
 * Editor: Guanliu
 * 2023/9/30
 */
    public GetProperties():Map<Property, number>{
        let t=new Map<Property, number>(this.properties);
        return t;
    }

    public CheckDead() {
        return this.properties[Property.HP] == 0;
    }

    public Attack(enemy: Role, battle: battle.Battle) : number {
        if (enemy.checkInevitableKill()) {
            this.BeInevitableKill(enemy, battle);
        }
        
        let list = this.getShareDamageArray(battle);
        let substitute = this.getSubstituteDamage(battle);
        let damage = this.GetProperty(Property.Attack) / list.length;
        for (let r of list) {
            if (null != substitute && this == r) {
                substitute.BeHurted(damage, enemy, battle);
            }
            else {
                r.BeHurted(damage, enemy, battle);
            }
        }

        return 0;
    }
}