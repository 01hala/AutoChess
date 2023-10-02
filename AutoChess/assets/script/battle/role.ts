/*
 * role.ts
 * author: qianqians
 * 2023/9/24
 */
import * as skill from './skill/skill_base'
import * as Skill_AttGain_1_1 from './skill/Skill_AttGain_1_1'
import * as Skill_AttGain_1_2 from './skill/Skill_AttGain_1_2'
import * as Skill_RecoveryHP_2 from './skill/Skill_RecoveryHP_2'
import * as Skill_RemoteAtk_3 from './skill/Skill_RemoteAtk_3'
import * as Skill_Summon_4 from './skill/Skill_Summon_4'
import * as Skill_SwapProperties_5 from './skill/Skill_SwapProperties_5'
import * as Skill_Shields_6 from './skill/Skill_Shields_6'
import * as Skill_ChangePosition_7 from './skill/Skill_ChangePosition_7'
import * as buffer from './buffer/buffer'
import * as battle from './battle'
import * as enums from './enums'
import * as config from '../config/config'

export enum Property {
    HP = 1,
    TotalHP = 2,
    Attack = 3,
}

export class SkillInfo {
    public trigger : skill.SkillTriggerBase;
    public skill : skill.SkillBase;
}

function createSkill(level:number, skillID:number) : skill.SkillBase {
    let skillConfig = config.config.SkillConfig.get(skillID);
    
    let value0 = 0;
    let value1 = 0;
    if (1 == level) {
        value0 = skillConfig.Level1Value_1;
        value1 = skillConfig.Level1Value_2;
    }
    else if (2 == level) {
        value0 = skillConfig.Level2Value_1;
        value1 = skillConfig.Level2Value_2;
    }
    else if (3 == level) {
        value0 = skillConfig.Level3Value_1;
        value1 = skillConfig.Level3Value_2;
    }

    let skillObj:skill.SkillBase = null;
    switch(skillConfig.Effect) {
        case 1:
        {
            if (skillConfig.ObjectDirection != enums.Direction.None) {
                skillObj = new Skill_AttGain_1_1.Skill_AttGain_1_1(skillConfig.Priority, value0, value1, skillConfig.ObjectDirection);
            }
            else {
                skillObj = new Skill_AttGain_1_2.Skill_AttGain_1_2(skillConfig.Priority, skillConfig.ObjCount, value0, value1);
            }
        }
        break;
        case 2:
        {
            skillObj = new Skill_RecoveryHP_2.Skill_RecoveryHP_2(skillConfig.Priority, skillConfig.ObjCount, value0);
        }
        break;
        case 3:
        {
            skillObj = new Skill_RemoteAtk_3.Skill_RemoteAtk_3(skillConfig.Priority, skillConfig.ObjCount, value0);
        }
        break;
        case 4:
        {
            if (skillConfig.SummonLevel == 0) {
                let p = new Map<Property, number>();
                p[Property.HP] = value0;
                p[Property.TotalHP] = value0;
                p[Property.Attack] = value1;
                skillObj = new Skill_Summon_4.Skill_Summon_4(skillConfig.Priority, skillConfig.SummonId[0], 0, p);
            }
            else {
                skillObj = new Skill_Summon_4.Skill_Summon_4(skillConfig.Priority, skillConfig.SummonId[0], skillConfig.SummonLevel);
            }
        }
        break;
        case 5:
        {
            skillObj = new Skill_SwapProperties_5.Skill_SwapProperties_5(skillConfig.Priority, value0, value1);
        }
        break;
        case 6:
        {
            skillObj = new Skill_Shields_6.Skill_Shields_6(skillConfig.Priority, value0, value1, skillConfig.ObjectDirection);
        }
        break;
        case 7:
        {
            skillObj = new Skill_ChangePosition_7.Skill_ChangePosition_7(skillConfig.Priority, value0);
        }
        break;
    }

    return skillObj;
}

export class Role {
    public id:number;
    public level:number;

    public skill : SkillInfo[] = []; // 一般情况只有一个技能，使用特殊食物时添加一个技能
    public buffer : buffer.Buffer[] = [];

    private properties : Map<Property, number> = new Map<Property, number>();
    public selfCamp: enums.Camp;

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

    private checkShields():boolean
    {
        for(let b of this.buffer)
        {
            if(enums.BufferType.Shields==b.BufferType&& b.Value>0)
            {
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

    public BeHurted(damage:number, enemy: Role, battle: battle.Battle) {

        let hp = this.GetProperty(Property.HP);
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
        this.ChangeProperties(Property.HP, hp);
        this.sendHurtedEvent(enemy, damage, battle);
    }

    public BeInevitableKill(enemy: Role, battle: battle.Battle) {
        let damageSelf = this.properties[Property.HP];
        this.properties[Property.HP] = 0;
        this.sendHurtedEvent(enemy, damageSelf, battle);
    }
    
    public ChangeProperties(type:Property,value:number) {
        value = value > 50 ? 50 : value;
        this.properties.set(type, value);
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

    public Attack(enemy: Role, battle: battle.Battle) {
        if (enemy.checkInevitableKill()) {
            this.BeInevitableKill(enemy, battle);
        }
        
        let list = this.getShareDamageArray(battle);
        let substitute = this.getSubstituteDamage(battle);
        let damage = this.GetProperty(Property.Attack)+this.getintensifierAtk() / list.length;
        for (let r of list) {
            if (null != substitute && this == r) {
                substitute.BeHurted(damage, enemy, battle);
            }
            else {
                if (enemy.checkInevitableKill() && this == r) {
                    continue;
                }
                r.BeHurted(damage, enemy, battle);
            }
        }
    }
}