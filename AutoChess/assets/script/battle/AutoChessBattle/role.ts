/*
 * role.ts
 * author: qianqians
 * 2023/9/24
 */
import * as skill from './skill/skill_base'
import * as buffer from './buffer/buffer'
import * as battle from './battle'
import * as enums from './BattleEnums'
import * as common from './common'
import * as create_skill from './create_skill'
import * as create_fetters from './create_fetters'
import * as create_trigger from './create_trigger'
import * as create_equip_skill from './create_equip_skill'
import * as create_buffer from './create_buffer'
import * as config from './config/config'

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

function createFettersSkill(id:number, level:number) : SkillInfo {
    let fettersConfig = config.config.FettersConfig.get(id);
    if (fettersConfig) {
        let skill = new SkillInfo();
        skill.trigger = create_trigger.CreateTrigger(fettersConfig.EffectTime);
        skill.skill = create_fetters.CreateFetters(level, id);
    
        if (skill.trigger && skill.skill) {
            return skill;
        }
    }
    return null;
}

function createEquipSkill(r:Role, equipId:number) {
    create_equip_skill.createEquipSkill(r, equipId);
}

function createBuffer(id:number , value?:number , round?:number , frequency?:number) : buffer.Buffer {
    let bufferConfig = config.config.BufferConfig.get(id);
    if (bufferConfig) {
        return create_buffer.CreateBuff(id,value,round,frequency);
    }
    return null;
}

export class Role {
    public c_role:common.Role;
    public index:number;
    public id:number;
    public skillid:number;
    public level:number;
    public exp:number;

    public foeRoleIndex:number;
    public isForcedAttack=false;

    public skill : SkillInfo[] = []; // 一般情况只有一个技能，使用特殊食物时添加一个技能
    public fetterSkill : SkillInfo = null;
    public fetter:common.Fetters;
    public buffer : buffer.Buffer[] = [];
    public equip:number=null;//装备id(一般只能装备一件装备)

    public properties : Map<enums.Property, number> = new Map<enums.Property, number>();
    private tempProperties:Map<enums.Property, number> = new Map<enums.Property, number>();
    public selfCamp: enums.Camp;

    private attackCnt;

    public constructor(c_role:common.Role,index:number, id:number, level:number, exp:number, selfCamp: enums.Camp, properties: Map<enums.Property, number>, fetters:common.Fetters, equipID:number, additionBuffer?:number[],additionSkill?:number[]) 
    {
        if(c_role)
        {
            this.c_role=c_role;
        }
        this.index = index;
        this.id=id;
        this.level=level;
        this.exp=exp;
        this.selfCamp = selfCamp;
        this.fetter=fetters;
        this.attackCnt=0;
        this.equip = equipID;
        
        properties.forEach((v, k) => {
            this.properties.set(k, v);
        })

        let roleConfig = config.config.RoleConfig.get(this.id);
        this.skillid = roleConfig.SkillID;
        let skill = createSkill(roleConfig.SkillID, this.level);
        if (skill) {
            this.skill.push(skill);
        }
        else {
            let buffer = createBuffer(roleConfig.SkillID);
            if (buffer) {
                this.buffer.push(buffer);
            }
        }

        if (this.equip) {
            createEquipSkill(this, this.equip);
        }

        if(additionSkill)
        {
            let additionSkills:SkillInfo[] = [];
            if(additionSkill&&additionSkill.length>0){            
                for(let t of additionSkill){
                    additionSkills.push(createSkill(t,this.level));
                }
            }
            if (additionSkills.length>0) {
                for(let t of additionSkills) this.skill.push(t);
            }
    
            if (fetters && fetters.fetters_level > 0) {
                if (fetters.fetters_id == config.config.MechanicFetters) {
                    let skill = new SkillInfo();
                    skill.trigger = create_trigger.CreateTrigger(common.EMSkillEvent.all_mechanic_syncope);
                    skill.skill = create_fetters.CreateMechanicFettersSummon(fetters.fetters_level, id);
                
                    if (skill.trigger && skill.skill) {
                        this.fetterSkill = skill;
                    }
                }
                else {
                    let skill = createFettersSkill(fetters.fetters_id, fetters.fetters_level);
                    if (skill) {
                        this.fetterSkill = skill;
                    }
                }
            }
        }
        
        if (additionBuffer) {
            for (let id of additionBuffer) {
                let buffer = createBuffer(id);
                if (buffer) {
                    this.buffer.push(buffer);
                }
            }
        }
    }

    public onKillRole : (r:common.Role) => void;
    private sendHurtedEvent(enemy: Role, damage: number, battle: battle.Battle, Injured: enums.EventType = enums.EventType.AttackInjured,isParallel:boolean=false) 
    {
        let selfIndex = this.index;
        let enemyIndex = enemy.index;

        if(Injured)
        {
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
            ev.priority=0;
            ev.isParallel=isParallel;
            ev.roleParallel = enemy;
            battle.AddBattleEvent(ev);
        }
        
        if (this.CheckDead()) 
        {
            if(this.isForcedAttack)
            {
                if(this.selfCamp == enums.Camp.Self)
                {
                    battle.GetSelfTeam().ReSetAttackRole();
                }
                if(this.selfCamp==enums.Camp.Enemy)
                {
                    battle.GetEnemyTeam().ReSetAttackRole();
                }
            }
            this.foeRoleIndex=enemy.selfCamp!=this.selfCamp?enemy.index:null;
            let ev = new skill.Event();
            ev.type = enums.EventType.Syncope;
            ev.spellcaster = new skill.RoleInfo();
            ev.spellcaster.camp = this.selfCamp;
            ev.spellcaster.index = selfIndex;
            let role = new skill.RoleInfo();
            role.camp=enemy.selfCamp;
            role.index=enemy.index;
            ev.recipient = [role];
            ev.value = [];
            ev.value.push(damage);
            battle.AddBattleEvent(ev);
            //console.log("CheckDead sendHurtedEvent:", JSON.stringify(battle.evs));
            //把单次对局加上的临时属性去掉
            this.tempProperties.forEach((value,key)=>{
                if(this.properties.has(key)){
                    this.properties.set(key,this.properties.get(key)+value);
                }
            })

            if (this.onKillRole) {
                this.onKillRole.call(null, enemy.c_role);
            }
        } 
    }

    private SendBeforeHurtEvent(enemy: Role, battle: battle.Battle,isParallel:boolean=false)
    {
        let ev = new skill.Event();

        let selfIndex = this.index;
        let enemyIndex = enemy.index;

        ev.type=enums.EventType.BeforeHurt;
        ev.spellcaster = new skill.RoleInfo();
        ev.spellcaster.camp = enemy.selfCamp;
        ev.spellcaster.index = enemyIndex;
        ev.recipient = [];
        let recipient = new skill.RoleInfo();
        recipient.camp = this.selfCamp;
        recipient.index = selfIndex;
        ev.recipient.push(recipient);
        ev.value = [];
        ev.priority=0;
        ev.isParallel=isParallel;
        ev.roleParallel = enemy;
        battle.AddBattleEvent(ev);
    }

    public SendExitEvent(battle: battle.Battle) {
        let ev = new skill.Event();
        ev.type = enums.EventType.Exit;
        ev.spellcaster = new skill.RoleInfo();
        ev.spellcaster.camp = this.selfCamp;
        ev.spellcaster.index = this.index;
        ev.recipient = [];
        ev.value = [];
        ev.priority=3;
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

    private checkOffsetDamage() : number {
        for (let b of this.buffer) {
            if (enums.BufferType.OffsetDamage == b.BufferType && b.Round > 0) {
                --b.Round;
                return b.Value;
            }
        }
        return -1;
    }

    private checkReductionAtk() : number {
        for (let b of this.buffer) {
            if (enums.BufferType.Weak == b.BufferType && b.Round > 0) {
                --b.Round;
                return b.Value;
            }
        }
        return -1;
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

    // 平摊伤害
    // Role[] 平摊伤害的所有角色
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

    private getBackRole(battle: battle.Battle) : Role {
        let target_index = -1;
        if (this.index == 0)
        {
            target_index = 3;
        }
        else if (this.index == 1)
        {
            target_index = 4;
        }
        else if (this.index == 2)
        {
            target_index = 5;
        }

        if (target_index == -1) {
            return null;
        }

        let selfTeam = this.selfCamp == enums.Camp.Self ? battle.GetSelfTeam() : battle.GetEnemyTeam();
        return selfTeam.GetRole(target_index);
    }

    // 代替当前被攻击角色受伤害
    // Role 代替受伤的角色
    // number 代替受伤的伤害上限
    private getSubstituteDamage(battle: battle.Battle) : [Role,number] 
    {
        let selfTeam = this.selfCamp == enums.Camp.Self ? battle.GetSelfTeam() : battle.GetEnemyTeam();
        let selfIndex = selfTeam.GetRoleIndex(this);
        
        for (let index in selfTeam.GetRoles()) {
            let i = parseInt(index);
            let r = selfTeam.GetRole(i);

            if (!r) {
                continue;
            }
            
            let bufferNumber:number;
            bufferNumber = r.checkOffsetDamage();
            if ((i - selfIndex) == 1 && -1!=bufferNumber) {
                return [r,bufferNumber];
            }
            
            bufferNumber=r.checkReductionAtk();
            if (-1!=bufferNumber) {
                return [r,bufferNumber];
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
            if(enums.BufferType.Strength == b.BufferType && b.Round > 0)
            {
                return b.Value;
            }
        }

        return 0;
    }

    private getEquipAttack():number {
        if (this.equip) {
            let equip = config.config.EquipConfig.get(this.equip);
            if (equip) {
               if (equip.Effect == create_equip_skill.EquipEffectEM.FirstAttackDoubleDamage) {
                    return this.GetProperty(enums.Property.Attack);
               } 
            }
        }
        return 0;
    }

    public getShields(){
        for(let b of this.buffer)
        {
            if(enums.BufferType.Shields==b.BufferType&& this.checkShields())
            {
                return b;
            }
        }
        return null;
    }

    public BeInevitableKill(enemy: Role, battle: battle.Battle) {
        let damageSelf = this.properties.get(enums.Property.HP);
        this.properties.set(enums.Property.HP, 0);
        this.sendHurtedEvent(enemy, damageSelf, battle, enums.EventType.AttackInjured);
    }
    
    public ChangeProperties(type:enums.Property,value:number,isTemp?:boolean) {
        value = value > 50 ? 50 : value;
        if(isTemp){
            if(this.tempProperties.has(type)){
                this.tempProperties.set(type, 
                    this.tempProperties.get(type)+(this.properties.get(type)-value));
            }
            else{
                this.tempProperties.set(type, this.properties.get(type)-value);
            }
        }
        this.properties.set(type, value);
    }

    public GetProperty(em: enums.Property) {
        if (this.properties.has(em)) {
            return this.properties.get(em);
        }
        return 0;
    }
    /**
     * 增加经验
     * @param _num 数值
     * 
     * author:Hotaru
     * 2024/09/09
     */
    public AddExp(_num:number)
    {
        this.exp+=_num;

        this.ChangeProperties(enums.Property.HP , this.GetProperty(enums.Property.HP)+1);
        this.ChangeProperties(enums.Property.Attack , this.GetProperty(enums.Property.Attack)+1);

        let _level=1+Math.floor(this.exp/3);
        if(this.level < _level && _level <=3)
        {
            this.level=_level;
        }
        else
        {
            this.level=3;
        }
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

    public CheckDead() 
    {
        let hp = this.properties.get(enums.Property.HP);
        //console.log(`CheckDead selfCamp:${this.selfCamp} id:${this.id} hp:${hp}`);
        return hp <= 0;
    }

    /**
     * 查找受击替身
     * @param _battle 战斗模块
     * @returns 受击替身
     */
    private CheckScapegoat(_battle:battle.Battle):[Role , number]
    {
        for(let ev of _battle.evs)
        {
            if(enums.EventType.SubstituteDamage == ev.type)
            {
                let selfTeam = this.selfCamp == enums.Camp.Self ? _battle.GetSelfTeam() : _battle.GetEnemyTeam();
                let role = selfTeam.GetRole(ev.spellcaster.index);
                return [role , ev.value[0]];
            }
        }
        return null;
    }

    public Attack(enemy: Role, battle: battle.Battle) {
        if (enemy.checkInevitableKill()) {
            //console.log("role checkInevitableKill!");
            this.BeInevitableKill(enemy, battle);
        }
        
        let list = this.getShareDamageArray(battle);
        let damage = enemy.GetProperty(enums.Property.Attack) + enemy.getEquipAttack() + enemy.getintensifierAtk() / list.length;
        console.log("role Attack list.length:", list.length + " camp:", this.selfCamp);
        if(1 == list.length)
        {
            this.BeHurted(damage,enemy, battle, enums.EventType.AttackInjured);
        }
        else
        {
            for(let r of list)
            {
                if(this == r)
                {
                    r.BeHurted(damage,enemy, battle, enums.EventType.AttackInjured);
                }
                else
                {
                    r.BeHurted(damage,this, battle, enums.EventType.RemoteInjured,true);
                }
            }
        }
        
        if (enemy.equip) {
            let equip = config.config.EquipConfig.get(enemy.equip);
            if (equip) {
               if (equip.Effect == create_equip_skill.EquipEffectEM.PiercingDamage) {
                    let r = this.getBackRole(battle);
                    if (r) {
                        r.BeHurted(equip.Vaule[0], enemy, battle, enums.EventType.AttackInjured);
                    }
               } 
            }
        }

        this.attackCnt++;
    }

    public BeHurted(damage:number, enemy: Role, battle: battle.Battle, Injured: enums.EventType,isParallel:boolean=false) 
    {
        this.SendBeforeHurtEvent(enemy,battle,isParallel);

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
        let scapegoat= this.CheckScapegoat(battle);
        if(scapegoat!=null)
        {
            scapegoat[0].ChangeProperties(enums.Property.HP,hp + scapegoat[1]);
            scapegoat[0].sendHurtedEvent(enemy , damage , battle , enums.EventType.TransferInjured , isParallel);
            damage=0;
        }
        else
        {
            this.ChangeProperties(enums.Property.HP, hp);
        }
        if(Injured!=enums.EventType.RemoteInjured)
        {
            this.sendHurtedEvent(enemy, damage, battle, Injured ,isParallel);
        }
    }

    public AddBuff(_id:number , _value:number=0 , _round:number=1 , _frequency:number=0) 
    {
        let buffer = createBuffer(_id , _value , _round , _frequency);
        if (buffer)
        {
            this.buffer.push(buffer);
        }
    }
}