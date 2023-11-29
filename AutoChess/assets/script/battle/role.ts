/*
 * role.ts
 * author: qianqians
 * 2023/9/24
 */
import * as skill from './skill/skill_base'
import * as buffer from './buffer/buffer'
import * as battle from './battle'
import * as enums from '../other/enums'
import * as create_skill from './create_skill'
import * as create_trigger from './create_trigger'
import * as create_buffer from './create_buffer'
import * as config from '../config/config'

export class SkillInfo {
    public trigger : skill.SkillTriggerBase;
    public skill : skill.SkillBase;
}

function createSkill(id:number, level:number) : SkillInfo {
    let skillConfig = config.config.SkillConfig.get(id);
    if (skillConfig) {
        let skill = new SkillInfo();
        skill.trigger = create_trigger.CreateTrigger(skillConfig.EffectTime);
        skill.skill = create_skill.CreateSkill(level, id);
    
        if (skill.trigger && skill.skill) {
            return skill;
        }
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
    public index:number;
    public id:number;
    public skillid:number;
    public level:number;
    public exp:number;

    public skill : SkillInfo[] = []; // 一般情况只有一个技能，使用特殊食物时添加一个技能
    public buffer : buffer.Buffer[] = [];
    private skill_is_lock : boolean = false;

    private properties : Map<enums.Property, number> = new Map<enums.Property, number>();
    public selfCamp: enums.Camp;

    public constructor(index:number, id:number, skillid:number, level:number, exp:number, selfCamp: enums.Camp, properties : Map<enums.Property, number>, additionBuffer?:number) {
        this.index = index;
        this.id=id;
        this.skillid = skillid;
        this.level=level;
        this.exp=exp;
        this.selfCamp = selfCamp;
        
        properties.forEach((v, k) => {
            this.properties.set(k, v);
        })

        let roleConfig = config.config.RoleConfig.get(this.id);

        let skill = createSkill(roleConfig.SkillID, this.level);
        if (skill) {
            this.skill.push(skill);
        }

        let buffer = createBuffer(roleConfig.SkillID);
        if (buffer) {
            this.buffer.push(buffer);
        }
        buffer = createBuffer(additionBuffer);
        if (buffer) {
            this.buffer.push(buffer);
        }
    }

    public CheckSkillIsLock() {
        return this.skill_is_lock;
    }

    public LockSkill() {
        this.skill_is_lock = true;
    }

    public UnlockSkill() {
        this.skill_is_lock = false;
    }

    private sendHurtedEvent(enemy: Role, damage: number, battle: battle.Battle, Injured: enums.EventType = enums.EventType.RemoteInjured) {
        let selfIndex = this.index;
        let enemyIndex = enemy.index;

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
        
        if (this.CheckDead()) {
            let ev = new skill.Event();
            ev.type = enums.EventType.Syncope;
            ev.spellcaster = new skill.RoleInfo();
            ev.spellcaster.camp = this.selfCamp;
            ev.spellcaster.index = selfIndex;
            ev.recipient = [];
            let recipient = new skill.RoleInfo();
            recipient.camp = enemy.selfCamp;
            recipient.index = enemyIndex;
            ev.recipient.push(recipient);
            ev.value = [];
            ev.value.push(damage);
            battle.AddBattleEvent(ev);
        } 
    }

    public SendExitEvent(battle: battle.Battle) {
        let ev = new skill.Event();
        ev.type = enums.EventType.Exit;
        ev.spellcaster = new skill.RoleInfo();
        ev.spellcaster.camp = this.selfCamp;
        ev.spellcaster.index = this.index;
        ev.recipient = [];
        ev.value = [];
        battle.AddBattleEvent(ev);
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
            if (this == r || (!r.CheckDead() && r.checkShareDamageBuffer())) {
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

            if (!r) {
                continue;
            }
            
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
        

        if(null != Shields)
        {
            if(Shields.Value >= damage)
            {
                Shields.Value -= damage;
                damage = 0;
            }
            else
            {
                damage -= Shields.Value;
                Shields.Value = 0;
            }
        }
        hp -= damage;
        this.ChangeProperties(enums.Property.HP, hp);
        this.sendHurtedEvent(enemy, damage, battle, Injured);
    }

    public BeInevitableKill(enemy: Role, battle: battle.Battle) {
        let damageSelf = this.properties.get(enums.Property.HP);
        this.properties.set(enums.Property.HP, 0);
        this.sendHurtedEvent(enemy, damageSelf, battle, enums.EventType.AttackInjured);
    }
    
    public ChangeProperties(type:enums.Property,value:number) {
        value = value > 50 ? 50 : value;
        this.properties.set(type, value);
    }

    public GetProperty(em: enums.Property) {
        if (this.properties.has(em)) {
            return this.properties.get(em);
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
        let t = new Map<enums.Property, number>();
        this.properties.forEach((v, k) => {
            t.set(k, v);
        })
        return t;
    }

    public CheckDead() {
        let hp = this.properties.get(enums.Property.HP);
        return hp <= 0;
    }

    public Attack(enemy: Role, battle: battle.Battle) {
        if (enemy.checkInevitableKill()) {
            //console.log("role checkInevitableKill!");
            this.BeInevitableKill(enemy, battle);
        }
        
        let list = this.getShareDamageArray(battle);
        let substitute = this.getSubstituteDamage(battle);
        let damage = enemy.GetProperty(enums.Property.Attack) + enemy.getintensifierAtk() / list.length;
        console.log("role Attack list.length:", list.length + " camp:", this.selfCamp);
        for (let r of list) {
            if (null != substitute && this == r) {
                //console.log("role substitute!");
                substitute.BeHurted(damage, enemy, battle, enums.EventType.AttackInjured);
            }
            else {
                if (enemy.checkInevitableKill() && this == r) {
                    //console.log("role checkInevitableKill continue!");
                    continue;
                }
                //console.log("role AttackInjured!");
                r.BeHurted(damage, enemy, battle, enums.EventType.AttackInjured);
            }
        }
    }
}