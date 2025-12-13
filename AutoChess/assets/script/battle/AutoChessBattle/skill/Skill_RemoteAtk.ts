/*
 * Skill_RemoteAtk_3
 * author: Hotaru
 * 2023/9/25
 * 对N敌方随机单位造成M点远程伤害
 */
import { _decorator, Component, DirectionalLight, Node } from 'cc';

import { SkillBase,Event, RoleInfo, SkillTriggerBase } from './skill_base';
import { Direction, Priority } from '../common';
import * as BattleEnums from '../BattleEnums';
import { Battle } from '../battle';
import { Role } from '../role';
import { random } from '../util';

export class Skill_RemoteAtk extends SkillBase  
{
    public res:string="battle/skill/Skill_RemoteAtk.ts/Skill_RemoteAtk";
    public SkillType:BattleEnums.SkillType=BattleEnums.SkillType.Attack;

    private numberOfRole : number=0;
    private attack : number=0;
    private isAll:boolean=false;
    private eventSound:string="";

    public constructor(priority:number, numberOfRole:number, attack:number,eventSound?:string,isfetter:boolean=false) {
        super(priority,isfetter);

        this.numberOfRole = numberOfRole;
        this.attack = attack;
        if(numberOfRole>=12) this.isAll=true;
        else this.isAll=false;

        if(null!=eventSound){
            this.eventSound=eventSound;
        }
        //this.event.type=EventType.RemoteInjured;
        console.log("create Skill_RemoteAtk_3 attack:", this.attack);
    }

    UseSkill(selfInfo: RoleInfo, battle: Battle,isParallel:boolean , evs?:Event[]): void 
    {
        try 
        {
            let event: Event = new Event();
            event.isParallel = isParallel;
            event.eventSound = this.eventSound;
            event.spellcaster = selfInfo;
            event.type = BattleEnums.EventType.UsedSkill;

            battle.AddBattleEvent(event);

            if (evs)
            {
                let ev: Event = null;
                for (let e of evs)
                {
                    if (BattleEnums.EventType.ChangeLocation == e.type || BattleEnums.EventType.Summon)
                    {
                        ev = e;
                        break;
                    }
                }
                if (ev)
                {
                    this.SkillEffect_3(selfInfo, battle, isParallel, ev);
                    return;
                }
            }
            if(!this.isAll && this.numberOfRole<6)
            {
                this.SkillEffect_1(selfInfo,battle,isParallel);
                return;
            }
            else if(this.isAll)
            {
                this.SkillEffect_2(selfInfo,battle);
                return
            }
            if(this.numberOfRole>=6)
            {
                this.SkillEffect_4(selfInfo,battle);
                return;
            }
           
            battle.onPlayerOnShot.call(null, this.eventSound);
        } 
        catch (error) 
        {
            console.error(this.res+"下的 UseSkill 错误:",error);
        }   
    }

    private SkillEffect_1(selfInfo: RoleInfo, battle: Battle,isPar:boolean):void          //随机对象生效
    {
        try
        {
            console.log("try to use remote Skill_RemoteAtk_3 attack:", this.attack);

            let recipientRoles:Role[] = new Array();
            let self:Role = null;
            let enemyRoles:Role[] = null;

            let event = new Event();
            event.type = BattleEnums.EventType.RemoteInjured;
            event.spellcaster = selfInfo;
            event.spellcaster.camp = selfInfo.camp;
            event.spellcaster.index = selfInfo.index;
            event.recipient = [];
            event.value=[this.attack];
            event.isFetter=this.isFetter;

            if(BattleEnums.Camp.Self==selfInfo.camp)
            {
                self = battle.GetSelfTeam().GetRole(selfInfo.index);
                enemyRoles=battle.GetEnemyTeam().GetRoles();
            }
            if(BattleEnums.Camp.Enemy==selfInfo.camp)
            {
                self = battle.GetEnemyTeam().GetRole(selfInfo.index);
                enemyRoles=battle.GetSelfTeam().GetRoles();
            }
            let i=0;
            while(recipientRoles.length < this.numberOfRole && enemyRoles.length > 0) 
            {
                let index = random(0, enemyRoles.length);
                if (enemyRoles[index].CheckDead() && i <= enemyRoles.length)
                {
                    i++;
                    continue;
                }
                if(i>enemyRoles.length) break;
                recipientRoles.push(enemyRoles[index]);
                enemyRoles.splice(index, 1);
            }
            recipientRoles.forEach((role) =>
            {
                console.log("Skill_RemoteAtk_1 远程攻击角色受伤 :", this.attack);
                if (!role.CheckDead())
                {
                    role.BeHurted(this.attack, self, battle, BattleEnums.EventType.RemoteInjured, isPar);
                }

                let roleInfo=new RoleInfo();
                roleInfo.index=role.index;
                roleInfo.camp=role.selfCamp;
                event.recipient.push(roleInfo);
            });
            battle.AddBattleEvent(event);
        }
        catch (error) 
        {
            console.error(this.res+"下的 SkillEffect_1 错误:",error);
        }
    }

    private SkillEffect_2(selfInfo: RoleInfo, battle: Battle)         //场上全部生效
    {
        let self:Role=null;

        let event = new Event();
        event.type = BattleEnums.EventType.RemoteInjured;
        event.spellcaster = selfInfo;
        event.spellcaster.camp = selfInfo.camp;
        event.spellcaster.index = selfInfo.index;
        event.recipient = [];
        event.value = [this.attack];
        event.objCount=this.numberOfRole;
        event.isFetter=this.isFetter;

        if(BattleEnums.Camp.Self==selfInfo.camp)
        {
            self=battle.GetSelfTeam().GetRole(selfInfo.index);
        }
        if(BattleEnums.Camp.Enemy==selfInfo.camp)
        {
            self=battle.GetEnemyTeam().GetRole(selfInfo.index);
        }

        let recipientRoles:Role[] = [];
        let selfRoles:Role[] = battle.GetSelfTeam().GetRoles();
        let enemyRoles:Role[] = battle.GetEnemyTeam().GetRoles();

        for (let t of selfRoles) 
        {
            if(t!=self) recipientRoles.push(t);
        }
        for (let t of enemyRoles)
        {
            if(t!=self) recipientRoles.push(t);
        }

        //同时发射子弹,同时受伤
        for(let role of recipientRoles)
        {
            if (!role.CheckDead())
            {
                role.BeHurted(this.attack, self, battle, BattleEnums.EventType.RemoteInjured);       //强制并发
            }

            let roleInfo=new RoleInfo();
            roleInfo.index=role.index;
            roleInfo.camp=role.selfCamp;
            event.recipient.push(roleInfo);
        }
        battle.AddBattleEvent(event);
    }

    private SkillEffect_3(selfInfo: RoleInfo, battle: Battle,isPar:boolean , ev:Event)        //指定对象
    {
        try
        {
            let self: Role = null;
            let enemyRoles: Role[] = null;

            let event = new Event();
            event.type = BattleEnums.EventType.RemoteInjured;
            event.spellcaster = selfInfo;
            event.spellcaster.camp = selfInfo.camp;
            event.spellcaster.index = selfInfo.index;
            event.recipient = [];
            event.value = [this.attack];
            event.objCount = this.numberOfRole;
            event.isFetter = this.isFetter;

            if (BattleEnums.Camp.Self == selfInfo.camp)
            {
                self = battle.GetSelfTeam().GetRole(selfInfo.index);
                enemyRoles = battle.GetEnemyTeam().GetRoles();
            }
            if (BattleEnums.Camp.Enemy == selfInfo.camp)
            {
                self = battle.GetEnemyTeam().GetRole(selfInfo.index);
                enemyRoles = battle.GetSelfTeam().GetRoles();
            }

            let recipientRoles: Role[] = [];

            for (let t of ev.recipient)
            {
                for (let r of enemyRoles)
                {
                    if (t.index == r.index && t.camp == r.selfCamp)
                    {
                        recipientRoles.push(r);
                    }
                }
            }

            for (let role of recipientRoles)
            {
                if (!role.CheckDead())
                {
                    role.BeHurted(this.attack, self, battle, BattleEnums.EventType.RemoteInjured, isPar);
                }
                let roleInfo = new RoleInfo();
                roleInfo.index = role.index;
                roleInfo.camp = role.selfCamp;
                event.recipient.push(roleInfo);
            }

            battle.AddBattleEvent(event);
        } catch (error)
        {
            console.error(this.res+"下的 SkillEffect_3 错误:",error);
        }
    }

    SkillEffect_4(selfInfo: RoleInfo, battle: Battle)     //敌方全部
    {
        let self:Role=null;
        let enemyRoles:Role[] = null;

        let event: Event = new Event();
        event.isParallel = false;
        event.eventSound = this.eventSound;
        event.spellcaster = selfInfo;
        event.type = BattleEnums.EventType.RemoteInjured;
        event.value=[this.attack];
        event.objCount=this.numberOfRole;
        event.isFetter=this.isFetter;

        if (BattleEnums.Camp.Self == selfInfo.camp)
        {
            self = battle.GetSelfTeam().GetRole(selfInfo.index);
            enemyRoles = battle.GetEnemyTeam().GetRoles();
        }
        if (BattleEnums.Camp.Enemy == selfInfo.camp)
        {
            self = battle.GetEnemyTeam().GetRole(selfInfo.index);
            enemyRoles = battle.GetSelfTeam().GetRoles();
        }

        for (let role of enemyRoles)
        {
            if (!role.CheckDead())
            {
                role.BeHurted(this.attack, self, battle, BattleEnums.EventType.RemoteInjured);
            }

            let roleInfo = new RoleInfo();
            roleInfo.index = role.index;
            roleInfo.camp = role.selfCamp;
            event.recipient.push(roleInfo);
        }
        battle.AddBattleEvent(event);
    }
}


/*
 * Skill_RemoteAtkPre
 * author: Hotaru
 * 2023/11/2
 * 对N敌方随机单位造成M点远程伤害(百分比)
 */

export class Skill_RemoteAtkPre extends SkillBase  
{
    
    public res:string="battle/skill/Skill_RemoteAtk.ts/Skill_RemoteAtkPre";
    public SkillType:BattleEnums.SkillType=BattleEnums.SkillType.Attack;

    private numberOfRole : number;
    private attack : number;
    private isAll:boolean;
    private eventSound;
    private dir;

    public constructor(priority:number, numberOfRole:number, attack:number,dir?:Direction,eventSound?:string,isfetter:boolean=false) {
        super(priority,isfetter);

        this.numberOfRole = numberOfRole;
        this.attack = attack;
        if(numberOfRole>=12)
        {
            this.isAll=true;
        }
        if(null!=eventSound){
            this.eventSound=eventSound;
        }
        if(null!=dir){
            this.dir=dir;
        }

        //this.event.type=EventType.RemoteInjured;
    }

    UseSkill(selfInfo: RoleInfo, battle: Battle,isParallel:boolean): void 
    {
        try 
        {
            let event: Event = new Event();
            event.isParallel = isParallel;
            event.spellcaster = selfInfo;
            event.type = BattleEnums.EventType.UsedSkill;
            battle.AddBattleEvent(event);

            if(this.attack>0 && this.attack <=1)
            {
                console.log("useskill Skill_RemoteAtkPre");
                if (6 >= this.numberOfRole && !this.isAll)
                {
                    this.SkillEffect_1(selfInfo, battle, this.attack * (1 + selfInfo.properties.get(BattleEnums.Property.Attack)), isParallel);
                }
                else
                {
                    console.warn("生效人数不能大于6人");
                }
                if(this.isAll)
                {
                    this.SkillEffect_2(selfInfo,battle,this.attack * (1 + selfInfo.properties.get(BattleEnums.Property.Attack)), isParallel);
                }
            }
            
        } 
        catch (error) 
        {
            console.warn(this.res+"下的 UseSkill 错误");
        }   
    }

    SkillEffect_1(selfInfo: RoleInfo, battle: Battle,attack:number,isPar:boolean)               //随机对象生效
    {
        try
        {
            let recipientRoles:Role[] = new Array();
            let self:Role = null;
            let enemyRoles:Role[] = null;

            let event = new Event();
            event.type = BattleEnums.EventType.RemoteInjured;
            event.spellcaster = selfInfo;
            event.spellcaster.camp = selfInfo.camp;
            event.spellcaster.index = selfInfo.index;
            event.recipient = [];
            event.isFetter=this.isFetter;

            attack=Math.round(attack);                                          //四舍五入
            if(attack<1)
            {
                attack=1;
            }

            event.value=[attack];
            
            console.log("try to use remote Skill_RemoteAtk_3_1 attack:", attack);

            if(BattleEnums.Camp.Self==selfInfo.camp)
            {
                self = battle.GetSelfTeam().GetRole(selfInfo.index);
                enemyRoles=battle.GetEnemyTeam().GetRoles();
            }
            if(BattleEnums.Camp.Enemy==selfInfo.camp)
            {
                self = battle.GetEnemyTeam().GetRole(selfInfo.index);
                enemyRoles=battle.GetSelfTeam().GetRoles();
            }

            let i=0
            while (recipientRoles.length < this.numberOfRole && enemyRoles.length > 0)
            {
                let index = random(0, enemyRoles.length);
                if(enemyRoles[index].CheckDead() && i<=enemyRoles.length)
                {
                    i++;
                    continue;
                }
                if(i>enemyRoles.length) break;
                recipientRoles.push(enemyRoles[index]);
                enemyRoles.splice(index, 1);
            }
            recipientRoles.forEach((role) =>
            {
                console.log("Skill_RemoteAtkPre 远程攻击角色受伤 :", attack);

                if (null != role && !role.CheckDead())
                {
                    role.BeHurted(attack, self, battle, BattleEnums.EventType.RemoteInjured, isPar);
                    
                }

                let roleInfo = new RoleInfo();
                roleInfo.index = role.index;
                roleInfo.camp = role.selfCamp;
                event.recipient.push(roleInfo);
            });
           battle.AddBattleEvent(event);
        }
        catch (error) 
        {
            console.warn(this.res+"下的 SkillEffect 错误");
            console.log(error);
        }
    }

    SkillEffect_2(selfInfo: RoleInfo, battle: Battle,attack:number,isPar:boolean)       //场上全部生效
    {
        let self: Role = null;

        let event = new Event();
        event.type = BattleEnums.EventType.RemoteInjured;
        event.spellcaster = selfInfo;
        event.spellcaster.camp = selfInfo.camp;
        event.spellcaster.index = selfInfo.index;
        event.recipient = [];
        event.objCount=this.numberOfRole;
        event.isFetter=this.isFetter;
        
        attack=Math.round(attack);                                          //四舍五入
        if(attack<1)
        {
            attack=1;
        }

        event.value=[attack];

        if (BattleEnums.Camp.Self == selfInfo.camp)
        {
            self = battle.GetSelfTeam().GetRole(selfInfo.index);
        }
        if (BattleEnums.Camp.Enemy == selfInfo.camp)
        {
            self = battle.GetEnemyTeam().GetRole(selfInfo.index);
        }

        let recipientRoles: Role[] = [];
        let selfRoles: Role[] = battle.GetSelfTeam().GetRoles();
        let enemyRoles: Role[] = battle.GetEnemyTeam().GetRoles();

        for (let t of selfRoles) 
        {
            if (t != self) recipientRoles.push(t);
        }
        for (let t of enemyRoles)
        {
            if (t != self) recipientRoles.push(t);
        }

        for (let role of recipientRoles)
        {
            if (!role.CheckDead()) 
            {
                role.BeHurted(attack, self, battle, BattleEnums.EventType.RemoteInjured);
            }

            let roleInfo = new RoleInfo();
            roleInfo.index = role.index;
            roleInfo.camp = role.selfCamp;
            event.recipient.push(roleInfo);
        }
       battle.AddBattleEvent(event);
    }
}

