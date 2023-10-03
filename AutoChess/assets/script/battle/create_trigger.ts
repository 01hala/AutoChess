/*
 * create_trigger.ts
 * author: qianqians
 * 2023/10/3
 */
import * as skill from './skill/skill_base'
import * as SkillTrigger_RoundStarts_5 from './trigger/SkillTrigger_RoundStarts_5'
import * as SkillTrigger_RoundEnd_6 from './trigger/SkillTrigger_RoundEnd_6'
import * as SkillTrigger_BattleBegin_7 from './trigger/SkillTrigger_BattleBegin_7'
import * as SkillTrigger_BeforeAtk_8 from './trigger/SkillTrigger_BeforeAtk_8'
import * as SkillTrigger_AfterAtk_9 from './trigger/SkillTrigger_AfterAtk_9'
import * as SkillTrigger_Injured_10 from './trigger/SkillTrigger_Injured_10'
import * as SkillTrigger_Syncope_11 from './trigger/SkillTrigger_Syncope_11'
import * as SkillTrigger_ChangeSelfLocation_12 from './trigger/SkillTrigger_ChangeSelfLocation_12'
import * as SkillTrigger_ChangeEnemyLocation_13 from './trigger/SkillTrigger_ChangeEnemyLocation_13'

export function CreateTrigger(triggerID:number) : skill.SkillTriggerBase {
    let triggerObj: skill.SkillTriggerBase = null;

    switch(triggerID) {
        case 5:
        {
            triggerObj = new SkillTrigger_RoundStarts_5.SkillTrigger_RoundStarts_5();
        }
        break;
        case 6:
        {
            triggerObj = new SkillTrigger_RoundEnd_6.SkillTrigger_RoundEnd_6();
        }
        break;
        case 7:
        {
            triggerObj = new SkillTrigger_BattleBegin_7.SkillTrigger_BattleBegin_7();
        }
        break;
        case 8:
        {
            triggerObj = new SkillTrigger_BeforeAtk_8.SkillTrigger_BeforeAtk_8();
        }
        break;
        case 9:
        {
            triggerObj = new SkillTrigger_AfterAtk_9.SkillTrigger_AfterAtk_9();
        }
        break;
        case 10:
        {
            triggerObj = new SkillTrigger_Injured_10.SkillTrigger_Injured_10();
        }
        break;
        case 11:
        {
            triggerObj = new SkillTrigger_Syncope_11.SkillTrigger_Syncope_11();
        }
        break;
        case 12:
        {
            triggerObj = new SkillTrigger_ChangeSelfLocation_12.SkillTrigger_ChangeSelfLocation_12();
        }
        break;
        case 13:
        {
            triggerObj = new SkillTrigger_ChangeEnemyLocation_13.SkillTrigger_ChangeEnemyLocation_13();
        }
        break;
    }
    
    return triggerObj;
}