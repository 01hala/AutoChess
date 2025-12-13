/*
 * Skill_ForcedAttack
 * author: Hotaru
 * 2024/07/30
 * 强制战斗
 */

import { Battle } from "../battle";
import { SkillBase, Event, RoleInfo, SkillTriggerBase, } from './skill_base';
import * as BattleEnums from '../BattleEnums'
import { random } from '../util';

export class Skill_ForcedAttack extends SkillBase  
{
    public res:string="battle/skill/Skell_ForcedAttack.ts";

    private eventSound;

    constructor(priority: number, eventSound?: string,isfetter:boolean=false)
    {
        super(priority,isfetter);

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
            this.SkillEffect_1(selfInfo,battle,isParallel);
            battle.onPlayerOnShot.call(null, this.eventSound);
        }
        catch(error)
        {
            console.error(this.res + "下的 UseSkill 异常: ",error);
        }
    }

    SkillEffect_1(_selfInfo: RoleInfo, _battle: Battle, _isParallel: boolean)
    {
        let event = new Event();
        event.type=BattleEnums.EventType.ForcedAttack;
        event.isFetter=this.isFetter;

        if(BattleEnums.Camp.Self==_selfInfo.camp)
        {
            let radonIndex=random(3, 5);
            _battle.GetSelfTeam().SetAttackRole(radonIndex);
        }
        if(BattleEnums.Camp.Enemy==_selfInfo.camp)
        {
            let radonIndex=random(3, 5);
            _battle.GetEnemyTeam().SetAttackRole(radonIndex);
        }

        _battle.AddBattleEvent(event);
    }
    
}


