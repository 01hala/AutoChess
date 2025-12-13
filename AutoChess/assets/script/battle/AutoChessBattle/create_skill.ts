/*
 * create_skill.ts
 * author: qianqians
 * 2023/10/3
 */
import * as config from './config/config'
import * as enums from './BattleEnums'
import * as common from './common'
import * as skill from './skill/skill_base'
import * as Skill_AddTmpExp from './skill/Skill_AddTmpExp'
import * as Skill_AttackAll from './skill/Skill_AttackAll'
import * as Skill_AttGain from './skill/Skill_AttGain'
import * as Skill_ChangePosition from './skill/Skill_ChangeLocation'
import * as Skill_Counterattack from './skill/Skill_Counterattack'
import * as Skill_DeAttGain from './skill/Skill_DeAttGain'
import * as Skill_ForcedAttack from './skill/Skill_ForcedAttack'
import * as Skill_RecoveryHP from './skill/Skill_RecoveryHP'
import * as Skill_RemoteAtk from './skill/Skill_RemoteAtk'
import * as Skill_Shields from './skill/Skill_Shields'
import * as Skill_SubstituteDamage from './skill/Skill_SubstituteDamage'
import * as Skill_Summon from './skill/Skill_Summon'
import * as Skill_SwapProperties from './skill/Skill_SwapProperties'
import * as Skill_AddBuff from './skill/Skill_AddBuff'
import * as Skill_AddAttackCoin from './skill/Skill_AddAttackCoin'

export function CreateSkill(level:number, skillID:number) : skill.SkillBase {
    let skillConfig = config.config.SkillConfig.get(skillID);
    let soundConfig=config.config.SkillSoundConfig.get(skillID);
    if("null"===soundConfig.Path)
    {
        soundConfig.Path=null;
    }
    
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

    let ObjCount=skillConfig.ObjCount;
    if(54==skillID)
    {
        ObjCount=level;
    }
    console.log("skillID:", skillID, " level:", level, " value0:", value0, " value1", value1);

    let skillObj:skill.SkillBase = null;
    switch (skillConfig.Effect)
    {
        case common.SkillEffectEM.AddTmpExp:
            {
                skillObj = new Skill_AddTmpExp.Skill_AddTmpExp(skillConfig.Priority, value0, skillConfig.ObjectDirection, skillConfig.ObjCount, soundConfig.Path);
            }
            break;
        case common.SkillEffectEM.AttackAll:
            {
                skillObj = new Skill_AttackAll.Skill_AttackAll(skillConfig.Priority, value0, soundConfig.Path);
            }
            break;
        case common.SkillEffectEM.CounterAttack:
            {
                skillObj = new Skill_Counterattack.Skill_Counterattack(skillConfig.Priority, skillConfig.ObjCount, value0, skillConfig.ObjCount == 6, soundConfig.Path);
            }
            break;
        case common.SkillEffectEM.DeAttGain:
            {
                skillObj = new Skill_DeAttGain.Skill_DeAttGain(skillConfig.Priority, value0, value1, skillConfig.ObjCount == 6, skillConfig.ObjCount, soundConfig.Path);
            }
            break;
        case common.SkillEffectEM.ForcedAttack:
            {
                skillObj = new Skill_ForcedAttack.Skill_ForcedAttack(skillConfig.Priority, soundConfig.Path);
            }
            break;
        case common.SkillEffectEM.AddProperty:
            {
                console.log("Skill_AttGain_1 skillConfig:", skillConfig);
                if (skillConfig.ObjectDirection != common.Direction.None)
                {
                    skillObj = new Skill_AttGain.Skill_AttGain(skillConfig.Priority, value0, value1, skillConfig.ObjectDirection,null,null,soundConfig.Path);
                }
                else
                {
                    skillObj = new Skill_AttGain.Skill_AttGain(skillConfig.Priority, value0, value1, null, skillConfig.ObjCount,null,soundConfig.Path);
                }
            }
            break;
        case common.SkillEffectEM.RecoverHP:
            {
                skillObj = new Skill_RecoveryHP.Skill_RecoveryHP(skillConfig.Priority, skillConfig.ObjCount, value0,soundConfig.Path);
            }
            break;
        case common.SkillEffectEM.RemoteAttack:
            {
                if (value0 >= 1)
                {
                    skillObj = new Skill_RemoteAtk.Skill_RemoteAtk(skillConfig.Priority, skillConfig.ObjCount, Math.floor(value0),soundConfig.Path);
                }
                else
                {
                    skillObj = new Skill_RemoteAtk.Skill_RemoteAtkPre(skillConfig.Priority, skillConfig.ObjCount, value0,null,soundConfig.Path);
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

                skillObj = new Skill_Summon.Skill_Summon(skillConfig.Priority, skillConfig.SummonId[0], skillConfig.SummonLevel, p,soundConfig.Path);
            }
            break;
        case common.SkillEffectEM.ExchangeProperty:
            {
                switch (skillConfig.SwapPropertiesType)
                {
                    case enums.SwapPropertiesType.AssignSwap:
                    case enums.SwapPropertiesType.RandomSwap:
                    case enums.SwapPropertiesType.SelfSwap:
                        {
                            skillObj = new Skill_SwapProperties.Skill_SwapProperties(skillConfig.Priority, skillConfig.SwapPropertiesType ,0 , value0, value1,soundConfig.Path);
                        }
                        break;
                    case enums.SwapPropertiesType.HpSwap:
                    case enums.SwapPropertiesType.AttackSwap:
                        {
                            skillObj = new Skill_SwapProperties.Skill_SwapPropertiesSingle(skillConfig.Priority, skillConfig.SwapPropertiesType, value0,soundConfig.Path);
                        }
                        break;
                    default:
                        {
                            console.warn("类型SkillEffectEM.ExchangeProperty下没有相关技能");
                        }
                        break;
                }
            }
            break;
        case common.SkillEffectEM.GainShield:
            {
                skillObj = new Skill_Shields.Skill_Shields(skillConfig.Priority, skillConfig.ObjCount ,value0 , skillConfig.ObjectDirection,soundConfig.Path);
            }
            break;
        case common.SkillEffectEM.ChangePosition:
            {
                skillObj = new Skill_ChangePosition.Skill_ChangeLocation(skillConfig.Priority, skillConfig.ChangeLocationType, value0, value1,soundConfig.Path);
            }
            break;
        case common.SkillEffectEM.ReductionHurt: 
            {
                skillObj = new Skill_SubstituteDamage.Skill_SubstituteDamage(skillConfig.Priority, skillConfig.ChangeLocationType, value0, value1,soundConfig.Path);
            }
            break;
        case common.SkillEffectEM.AddBuffer:
            {
                skillObj = new Skill_AddBuff.Skill_AddBuff(skillConfig.Priority , skillConfig.AddBufferID, value0 , value1 , ObjCount,soundConfig.Path);
            }
            break;
        case common.SkillEffectEM.AttackCoin:
            {
                skillObj = new Skill_AddAttackCoin.Skill_AddAttackCoin(skillConfig.Priority,soundConfig.Path);
            }
            break;
    }

    return skillObj;
}
