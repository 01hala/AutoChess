/*
 * role.ts
 * author: qianqians
 * 2023/9/24
 */
import * as skill from './skill/skill_base'
import * as buffer from './buffer/buffer'
import * as battle from './battle'
import * as enums from './enums'
import * as create_skill from './create_skill'
import * as create_trigger from './create_trigger'
import * as create_buffer from './create_buffer'
import * as config from '../config/config'

export class SkillInfo {
    public trigger : skill.SkillTriggerBase;
    public skill : skill.SkillBase;
}

function createSkill(id:number) : SkillInfo {
    let skillConfig = config.config.SkillConfig.get(id);
    if (skillConfig) {let skill = new SkillInfo();
        skill.trigger = create_trigger.CreateTrigger(skillConfig.EffectTime);
        skill.skill = create_skill.CreateSkill(this.level, id);
    
        return skill;
    }
    return null;
}

function createBuffer(id:number) : buffer.Buffer {
    let bufferConfig = config.config.BufferConfig.get(id);
    if (bufferConfig) {
        return create_buffer.CreateSkill(id);
    }
    return null;
}

export class Role {
    public id:number;
    public level:number;

    public skill : SkillInfo[] = []; // 一般情况只有一个技能，使用特殊食物时添加一个技能
    public buffer : buffer.Buffer[] = [];

    private properties : Map<enums.Property, number> = new Map<enums.Property, number>();
    public selfCamp: enums.Camp;

    public constructor(id:number,level:number,selfCamp: enums.Camp, properties : Map<enums.Property, number>, additionSkill:number, additionBuffer:number) {
        this.id=id;
        this.level=level;
        
        this.selfCamp = selfCamp;
        this.properties = properties;

        let roleConfig = config.config.RoleConfig.get(this.id);
        console.log("id:", this.id, roleConfig);

        let skill = createSkill(roleConfig.Id);
        if (skill) {
            this.skill.push();
        }

        let buffer = createBuffer(roleConfig.Id);
        if (buffer) {
            this.buffer.push(buffer);
        }

        skill = createSkill(additionSkill);
        if (skill) {
            this.skill.push();
        }

        buffer = createBuffer(additionBuffer);
        if (buffer) {
            this.buffer.push(buffer);
        }
    }

    private sendHurtedEvent(enemy: Role, damage: number, battle: battle.Battle, Injured: enums.EventType = enums.EventType.RemoteInjured) {
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
            ev.type = Injured;
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
                --b.Round;
                return true;
            }
        }
        return false;
    }

    private checkInevitableKill() : boolean {
        for (let b of this.buffer) {
            if (enums.BufferType.InevitableKill == b.BufferType && b.Round > 0) {
                --b.Round;
                return true;
            }
        }
        return false;
    }

    private checkSubstituteDamageFront() : boolean {
        for (let b of this.buffer) {
            if (enums.BufferType.SubstituteDamageFront == b.BufferType && b.Round > 0) {
                --b.Round;
                return true;
            }
        }
        return false;
    }

    private checkSubstituteDamageRandom() : boolean {
        for (let b of this.buffer) {
            if (enums.BufferType.SubstituteDamageRandom == b.BufferType && b.Round > 0) {
                --b.Round;
                return true;
            }
        }
        return false;
    }

    private checkShields():boolean
    {
        for(let b of this.buffer)
        {
            if(enums.BufferType.Shields==b.BufferType&& b.Value>0)
            {
                --b.Round;
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

    private getintensifierAtk():number{

        for(let b of this.buffer)
        {
            if(enums.BufferType.intensifierAtk == b.BufferType && b.Round > 0)
            {
                return b.Value;
            }
        }

        return 0;
    }

    private getShields(){
        for(let b of this.buffer)
        {
            if(enums.BufferType.Shields==b.BufferType&& this.checkShields())
            {
                return b;
            }
        }
        return null;
    }

    public BeHurted(damage:number, enemy: Role, battle: battle.Battle, Injured: enums.EventType = enums.EventType.RemoteInjured) {

        let hp = this.GetProperty(enums.Property.HP);
        let reduction = this.getReductionDamage();
        let Shields=this.getShields();

        damage -= reduction;
        damage = damage < 0 ? 0 : damage;
        

        if(null!= Shields)
        {
            if(Shields.Value>=damage)
            {
                Shields.Value-=damage;
                damage = 0;
            }
            else
            {
                damage-=Shields.Value;
                Shields.Value=0;
            }
        }
        hp -= damage;
        this.ChangeProperties(enums.Property.HP, hp);
        this.sendHurtedEvent(enemy, damage, battle, Injured);
    }

    public BeInevitableKill(enemy: Role, battle: battle.Battle) {
        let damageSelf = this.properties[enums.Property.HP];
        this.properties[enums.Property.HP] = 0;
        this.sendHurtedEvent(enemy, damageSelf, battle, enums.EventType.AttackInjured);
    }
    
    public ChangeProperties(type:enums.Property,value:number) {
        value = value > 50 ? 50 : value;
        this.properties.set(type, value);
    }

    public GetProperty(em: enums.Property) {
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
    public GetProperties():Map<enums.Property, number>{
        let t=new Map<enums.Property, number>(this.properties);
        return t;
    }

    public CheckDead() {
        return this.properties[enums.Property.HP] <= 0;
    }

    public Attack(enemy: Role, battle: battle.Battle) {
        if (enemy.checkInevitableKill()) {
            this.BeInevitableKill(enemy, battle);
        }
        
        let list = this.getShareDamageArray(battle);
        let substitute = this.getSubstituteDamage(battle);
        let damage = this.GetProperty(enums.Property.Attack)+this.getintensifierAtk() / list.length;
        for (let r of list) {
            if (null != substitute && this == r) {
                substitute.BeHurted(damage, enemy, battle, enums.EventType.AttackInjured);
            }
            else {
                if (enemy.checkInevitableKill() && this == r) {
                    continue;
                }
                r.BeHurted(damage, enemy, battle, enums.EventType.AttackInjured);
            }
        }
    }
}