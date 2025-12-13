/*
 * Skill_DeAttGain.ts
 * author: Hotaru
 * 2024/07/19
 * 对敌方造成减益，减少n生命m攻击
 */
import { _decorator, Component, debug, log, Node } from 'cc';
import { SkillBase, Event, RoleInfo, SkillTriggerBase, } from './skill_base';
import { Battle } from '../battle';
import { Team } from '../team';
import { Role } from '../role';
import * as BattleEnums from '../BattleEnums'
import { random } from '../util';


export class Skill_DeAttGain extends SkillBase  
{
    public res: string = "battle/skill/Skill_DeAttGain.ts/Skill_DeAttGain";
    public SkillType: BattleEnums.SkillType = BattleEnums.SkillType.Intensifier;

    private numberOfRole: number = null;
    private isAll:boolean;
    private dehealth: number;
    private deattack: number;

    private eventSound: string;

    constructor(priority: number, dehealth: number, deattack: number, isAll?:boolean ,numberOfRole?: number, eventSound?: string,isfetter:boolean=false) 
    {
        super(priority,isfetter);

        this.deattack = deattack;
        this.dehealth = dehealth;
        this.isAll=isAll;

        if (null != numberOfRole)
        {
            this.numberOfRole = numberOfRole;
        }
        if (null != eventSound)
        {
            this.eventSound = eventSound;
        }
    }

    UseSkill(selfInfo: RoleInfo, battle: Battle, isParallel: boolean): void
    {
        try
        {
            let event: Event = new Event();
            event.isParallel = isParallel;
            event.spellcaster = selfInfo;
            event.type = BattleEnums.EventType.UsedSkill;
            battle.AddBattleEvent(event);
            if (this.isAll)
            {
                this.SkillEffect_1(selfInfo, battle, isParallel);
            }
            battle.onPlayerOnShot.call(null, this.eventSound);
        }
        catch (error)
        {
            console.warn(this.res + "下的 UseSkill 错误");
        }
    }

    /**
     * 敌方所有单位攻击力、生命值下降
     * @param selfInfo 发动单位
     * @param battle 战局信息
     * @param isPar 是否是并行发动的
     */
    SkillEffect_1(selfInfo: RoleInfo, battle: Battle, isPar: boolean)
    {
        try
        {
            let event = new Event();
            let recipientRoles: Role[] = new Array();
            let self: Role = null;
            let enemyRoles: Role[] = null;
            event.isParallel = isPar
            event.eventSound = this.eventSound;
            event.isFetter=this.isFetter;

            if (BattleEnums.Camp.Self == selfInfo.camp)
            {
                self = battle.GetSelfTeam().GetRole(selfInfo.index);
                enemyRoles = battle.GetEnemyTeam().GetRoles().slice();
            }
            if (BattleEnums.Camp.Enemy == selfInfo.camp)
            {
                self = battle.GetEnemyTeam().GetRole(selfInfo.index);
                enemyRoles = battle.GetSelfTeam().GetRoles().slice();
            }

            for (let r of enemyRoles)
            {
                if (r != null)
                {
                    r.ChangeProperties(BattleEnums.Property.Attack, r.GetProperty(BattleEnums.Property.Attack) - this.deattack);
                    r.ChangeProperties(BattleEnums.Property.HP,r.GetProperty(BattleEnums.Property.HP)-this.dehealth);
                }
            }

            event.recipient.push(selfInfo);
            event.value = [this.deattack,this.dehealth];
            battle.AddBattleEvent(event);
        }
        catch (error)
        {
            console.warn(this.res + "下的 SkillEffect_1 错误 ", error);
        }
    }
}

export class Skill_DeAttGainPre extends SkillBase 
{
    public res: string = "battle/skill/Skill_DeAttGain.ts/Skill_DeAttGainPre";
    public SkillType: BattleEnums.SkillType = BattleEnums.SkillType.Intensifier;

    private numberOfRole: number = null;
    private isAll: boolean;
    private dehealth: number;
    private deattack: number;

    private eventSound: string;

    constructor(priority: number,isfetter:boolean=false, dehealth: number, deattack: number, isAll?: boolean, numberOfRole?: number, eventSound?: string) 
    {
        super(priority,isfetter);

        this.deattack = deattack;
        this.dehealth = dehealth;
        this.isAll = isAll;

        if (null != numberOfRole)
        {
            this.numberOfRole = numberOfRole;
        }
        if (null != eventSound)
        {
            this.eventSound = eventSound;
        }
    }

    UseSkill(selfInfo: RoleInfo, battle: Battle, isParallel: boolean): void
    {
        try
        {
            if ((this.deattack > 0 && this.deattack <= 1) || (this.dehealth > 0 && this.dehealth <= 1))
            {
                if (this.isAll)
                {
                    this.SkillEffect_1(selfInfo, battle, isParallel);
                }
            }
            else
            {
                console.warn("数值错误");
            }

        }
        catch (error)
        {
            console.warn(this.res + "下的 UseSkill 错误");
        }
    }

    /**
    * 敌方所有单位攻击力、生命值下降(百分比)
    * @param selfInfo 发动单位
    * @param battle 战局信息
    * @param isPar 是否是并行发动的
    */
    SkillEffect_1(selfInfo: RoleInfo, battle: Battle, isPar: boolean)
    {
        try
        {
            let event = new Event();
            let recipientRoles: Role[] = new Array();
            let self: Role = null;
            let enemyRoles: Role[] = null;
            event.isParallel = isPar
            event.eventSound = this.eventSound;
            event.isFetter=this.isFetter;

            if (BattleEnums.Camp.Self == selfInfo.camp)
            {
                self = battle.GetSelfTeam().GetRole(selfInfo.index);
                enemyRoles = battle.GetEnemyTeam().GetRoles().slice();
            }
            if (BattleEnums.Camp.Enemy == selfInfo.camp)
            {
                self = battle.GetEnemyTeam().GetRole(selfInfo.index);
                enemyRoles = battle.GetSelfTeam().GetRoles().slice();
            }

            let atk = 0;
            let hp = 0;
            for (let r of enemyRoles)
            {
                if (r != null)
                {
                    if (this.deattack > 0 && this.deattack <= 1)
                    {
                        atk=Math.round((r.GetProperty(BattleEnums.Property.Attack)*(1+this.deattack)));
                        if(atk<1)
                        {
                            atk=1;
                        }
                        r.ChangeProperties(BattleEnums.Property.Attack, r.GetProperty(BattleEnums.Property.Attack) - atk);
                    }

                    if (this.dehealth > 0 && this.dehealth <= 1)
                    {
                        hp = Math.round(r.GetProperty(BattleEnums.Property.HP) * (1 + this.dehealth));
                        if (hp < 1)
                        {
                            hp = 1;
                        }
                        r.ChangeProperties(BattleEnums.Property.HP, r.GetProperty(BattleEnums.Property.HP) - this.dehealth);
                    }
                }
            }

            event.recipient.push(selfInfo);
            event.value = [this.deattack,this.dehealth];
            battle.AddBattleEvent(event);
        }
        catch (error)
        {
            console.warn(this.res + "下的 SkillEffect_1 错误 ", error);
        }
    }

}


