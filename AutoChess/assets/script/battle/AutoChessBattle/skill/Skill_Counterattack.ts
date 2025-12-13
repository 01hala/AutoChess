/*
 * Skill_Counterattack
 * author: Hotaru
 * 2024/07/22
 * 亡语
 */
import { _decorator, Component, error, Node } from 'cc';
import { SkillBase,Event, RoleInfo, SkillTriggerBase } from './skill_base';
import { Battle } from '../battle';
import { Role } from '../role';
import { random } from '../util';
import * as BattleEnums from '../BattleEnums'

export class Skill_Counterattack extends SkillBase 
{
    public res:string="battle/skill/Skill_Counterattack.ts";

    private numberOfRole : number;
    private attack : number;
    private isAll:boolean;
    private eventSound;

    constructor(priority: number, numberOfRole: number, attack: number, isAll: boolean, eventSound?: string,isfetter:boolean=false)
    {
        super(priority,isfetter);

        this.numberOfRole = numberOfRole;
        this.attack = attack;
        this.isAll = isAll;
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
            this.SkillEffect_1(selfInfo,battle,this.attack,isParallel);
            battle.onPlayerOnShot.call(null, this.eventSound);
        }
        catch(error)
        {
            console.error(this.res + "下的 UseSkill 异常: ",error);
        }
    }

    SkillEffect_1(selfInfo: RoleInfo, battle: Battle,attack:number,isPar:boolean)
    {
        let self:Role;
        let enemy:Role;

        if(BattleEnums.Camp.Self==selfInfo.camp)
        {
            self = battle.GetSelfTeam().GetRole(selfInfo.index);
            enemy=battle.GetEnemyTeam().GetRole(self.foeRoleIndex);
        }
        if(BattleEnums.Camp.Enemy==selfInfo.camp)
        {
            self = battle.GetEnemyTeam().GetRole(selfInfo.index);
            enemy=battle.GetSelfTeam().GetRole(self.foeRoleIndex);
        }

        if(enemy)
        {
            enemy.BeHurted(self.GetProperty(BattleEnums.Property.Attack),self,battle,BattleEnums.EventType.AttackInjured,isPar);
        }
    }     
}


