/*
 * create_trigger.ts
 * author: qianqians
 * 2023/10/3
 */
import * as skill from './skill/skill_base'
import * as common from '../serverSDK/common'
import * as SkillTrigger_RoundStarts_5 from './trigger/SkillTrigger_RoundStarts_5'
import * as SkillTrigger_RoundEnd_6 from './trigger/SkillTrigger_RoundEnd_6'
import * as SkillTrigger_BattleBegin_7 from './trigger/SkillTrigger_BattleBegin_7'
import * as SkillTrigger_BeforeAtk_8 from './trigger/SkillTrigger_BeforeAtk_8'
import * as SkillTrigger_Injured_10 from './trigger/SkillTrigger_Injured_10'
import * as SkillTrigger_Syncope_11 from './trigger/SkillTrigger_Syncope_11'
import * as SkillTrigger_ChangeSelfLocation_12 from './trigger/SkillTrigger_ChangeSelfLocation_12'
import * as SkillTrigger_ChangeEnemyLocation_13 from './trigger/SkillTrigger_ChangeEnemyLocation_13'
import * as SkillTrigger_UsedSKill_14 from './trigger/SkillTrigger_UsedSKill_14'

export function CreateTrigger(triggerID:number) : skill.SkillTriggerBase {
    let triggerObj: skill.SkillTriggerBase = null;

    switch(triggerID) {
        case common.EMSkillEvent.start_round:
        {
            triggerObj = new SkillTrigger_RoundStarts_5.SkillTrigger_RoundStarts_5();
        }
        break;
        case common.EMSkillEvent.end_round:
        {
            triggerObj = new SkillTrigger_RoundEnd_6.SkillTrigger_RoundEnd_6();
        }
        break;
        case common.EMSkillEvent.start_battle:
        {
            triggerObj = new SkillTrigger_BattleBegin_7.SkillTrigger_BattleBegin_7();
        }
        break;
        case common.EMSkillEvent.before_attack:
        {
            triggerObj = new SkillTrigger_BeforeAtk_8.SkillTrigger_BeforeAtk_8();
        }
        break;
        case common.EMSkillEvent.be_hurt:
        {
            triggerObj = new SkillTrigger_Injured_10.SkillTrigger_Injured_10();
        }
        break;
        case common.EMSkillEvent.syncope:
        {
            triggerObj = new SkillTrigger_Syncope_11.SkillTrigger_Syncope_11();
        }
        break;
        case common.EMSkillEvent.camp_summon:
        {
            triggerObj = new SkillTrigger_ChangeSelfLocation_12.SkillTrigger_ChangeSelfLocation_12();
        }
        break;
        case common.EMSkillEvent.enemy_summon:
        {
            triggerObj = new SkillTrigger_ChangeEnemyLocation_13.SkillTrigger_ChangeEnemyLocation_13();
        }
        break;
        case common.EMSkillEvent.use_skill:
        {
            triggerObj = new SkillTrigger_UsedSKill_14.SkillTrigger_UsedSKill_14();
        }
        break;
        case common.EMSkillEvent.all_mechanic_syncope:
        {
            // to do ...
        }
        break;
    }
    
    return triggerObj;
}