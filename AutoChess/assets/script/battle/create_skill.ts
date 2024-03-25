/*
 * create_skill.ts
 * author: qianqians
 * 2023/10/3
 */
import * as config from '../config/config'
import * as enums from '../other/enums'
import * as common from '../serverSDK/common'
import * as skill from './skill/skill_base'
import * as Skill_AttGain_1 from './skill/Skill_AttGain_1'
import * as Skill_RecoveryHP_2 from './skill/Skill_RecoveryHP_2'
import * as Skill_RemoteAtk_3 from './skill/Skill_RemoteAtk_3'
import * as Skill_RemoteAtk_3_1 from './skill/Skill_RemoteAtk_3_1'
import * as Skill_Summon_4 from './skill/Skill_Summon_4'
import * as Skill_SwapProperties_5 from './skill/Skill_SwapProperties_5'
import * as Skill_Shields_6 from './skill/Skill_Shields_6'
import * as Skill_ChangePosition_7 from './skill/Skill_ChangePosition_7'
import * as Skill_SubstituteDamage_11 from './skill/Skill_SubstituteDamage_11'

export function CreateSkill(level:number, skillID:number) : skill.SkillBase {
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
    console.log("skillID:", skillID, " level:", level, " value0:", value0, " value1", value1);

    let skillObj:skill.SkillBase = null;
    switch(skillConfig.Effect) {
        case common.SkillEffectEM.AddProperty:
        {
            console.log("Skill_AttGain_1 skillConfig:", skillConfig);
            if (skillConfig.ObjectDirection != common.Direction.None) {
                skillObj = new Skill_AttGain_1.Skill_AttGain_1(skillConfig.Priority, value0, value1, skillConfig.ObjectDirection);
            }
            else {
                skillObj = new Skill_AttGain_1.Skill_AttGain_1(skillConfig.Priority, value0, value1,null,skillConfig.ObjCount);
            }
        }
        break;
        case common.SkillEffectEM.RecoverHP:
        {
            skillObj = new Skill_RecoveryHP_2.Skill_RecoveryHP_2(skillConfig.Priority, skillConfig.ObjCount, value0);
        }
        break;
        case common.SkillEffectEM.RemoteAttack:
        {
            if(value0 >= 1)
            {
                skillObj = new Skill_RemoteAtk_3.Skill_RemoteAtk_3(skillConfig.Priority, skillConfig.ObjCount, Math.floor(value0), false);
            }
            else
            {
                skillObj=new Skill_RemoteAtk_3_1.Skill_RemoteAtk_3_1(skillConfig.Priority, skillConfig.ObjCount, value0, false);
            }
        }
        break;
        case common.SkillEffectEM.SummonBattle:
        {
            // if (skillConfig.SummonLevel == 0) {
            //     let p = new Map<enums.Property, number>();
            //     p.set(enums.Property.HP, value0);
            //     p.set(enums.Property.TotalHP, value0);
            //     p.set(enums.Property.Attack, value1);
            //     skillObj = new Skill_Summon_4.Skill_Summon_4(skillConfig.Priority, skillConfig.SummonId[0], 0, p);
            // }
            // else {
            //     skillObj = new Skill_Summon_4.Skill_Summon_4(skillConfig.Priority, skillConfig.SummonId[0], skillConfig.SummonLevel);
            // }
            let p = new Map<enums.Property, number>();
                p.set(enums.Property.HP, value0);
                p.set(enums.Property.TotalHP, value0);
                p.set(enums.Property.Attack, value1);

                skillObj = new Skill_Summon_4.Skill_Summon_4(skillConfig.Priority, skillConfig.SummonId[0], skillConfig.SummonLevel,p);
        }
        break;
        case common.SkillEffectEM.ExchangeProperty:
        {
            skillObj = new Skill_SwapProperties_5.Skill_SwapProperties_5(skillConfig.Priority, skillConfig.SwapPropertiesType, value0, value1);
        }
        break;
        case common.SkillEffectEM.GainShield:
        {
            skillObj = new Skill_Shields_6.Skill_Shields_6(skillConfig.Priority, value0, value1, skillConfig.ObjectDirection);
        }
        break;
        case common.SkillEffectEM.ChangePosition:
        {
            skillObj = new Skill_ChangePosition_7.Skill_ChangePosition_7(skillConfig.Priority, skillConfig.ChangePositionType, value0, value1);
        }
        break;
        case common.SkillEffectEM.ReductionHurt:{
            skillObj = new Skill_SubstituteDamage_11.Skill_SubstituteDamage_11(skillConfig.Priority, skillConfig.ChangePositionType, value0, value1);
        }
        break;
        case common.SkillEffectEM.AddTmpExp:{
            
        }break;
        case common.SkillEffectEM.ReductionPrice:{

        }break;
        case common.SkillEffectEM.AddPropertyByCoin:{

        }break;
    }

    return skillObj;
}
