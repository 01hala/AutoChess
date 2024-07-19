/*
 * Skill_AttGain_1_1.ts
 * author: Hotaru
 * 2024/07/19
 * 对敌方造成减益，减少n生命m攻击
 */
import { _decorator, Component, debug, log, Node } from 'cc';
import { SkillBase, Event, RoleInfo, SkillTriggerBase, } from './skill_base';
import { Battle } from '../battle';
import { Team } from '../team';
import { Role } from '../role';
import { Camp, SkillType, Property, EventType } from '../../other/enums';
import { Direction } from '../../serverSDK/common'
import { random } from '../util';


export class Skill_AttGain_1_1 extends SkillBase  
{
    public res: string = "battle/skill/Skill_AttGain_1_1.ts ";
    public SkillType: SkillType = SkillType.Intensifier;

    private numberOfRole: number = null;
    private isAll:boolean;
    private dehealth: number;
    private deattack: number;

    private eventSound: string;

    constructor(priority: number, dehealth: number, deattack: number, isAll?:boolean ,numberOfRole?: number, eventSound?: string) 
    {
        super(priority);

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
            if (this.isAll)
            {
                this.SkillEffect_1(selfInfo, battle, isParallel);
            }
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

            if (Camp.Self == selfInfo.camp)
            {
                self = battle.GetSelfTeam().GetRole(selfInfo.index);
                enemyRoles = battle.GetEnemyTeam().GetRoles().slice();
            }
            if (Camp.Enemy == selfInfo.camp)
            {
                self = battle.GetEnemyTeam().GetRole(selfInfo.index);
                enemyRoles = battle.GetSelfTeam().GetRoles().slice();
            }

            for (let r of enemyRoles)
            {
                if (r != null)
                {
                    r.ChangeProperties(Property.Attack, r.GetProperty(Property.Attack) - this.deattack);
                    r.ChangeProperties(Property.HP,r.GetProperty(Property.HP)-this.dehealth);
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


