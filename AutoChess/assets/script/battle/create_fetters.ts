/*
 * create_fetters.ts
 * author: qianqians
 * 2023/12/15
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
import { Skill_AttackAll } from './skill/Skill_AttackAll'

export function CreateFetters(level:number, fettersID:number) : skill.SkillBase {
    let fettersConfig = config.config.FettersConfig.get(fettersID);
    
    let value0 = 0;
    let value1 = 0;
    if (1 == level) {
        value0 = fettersConfig.Stage1value_1;
        value1 = fettersConfig.Stage1value_1;
    }
    else if (2 == level) {
        value0 = fettersConfig.Stage2value_1;
        value1 = fettersConfig.Stage2value_1;
    }
    else if (3 == level) {
        value0 = fettersConfig.Stage3value_1;
        value1 = fettersConfig.Stage3value_1;
    }
    else if (4 == level) {
        value0 = fettersConfig.Stage4value_1;
        value1 = fettersConfig.Stage4value_1;
    }

    let skillObj:skill.SkillBase = null;
    switch(fettersConfig.Effect) {
        case common.SkillEffectEM.AddProperty:
        {
            console.log("Skill_AttGain_1 fettersConfig:", fettersConfig);
            let count_index = fettersConfig.ObjCount.length < level ? fettersConfig.ObjCount.length  - 1 : level - 1;
            let count = fettersConfig.ObjCount[count_index];
            skillObj = new Skill_AttGain_1.Skill_AttGain_1(fettersConfig.Priority, value0, value1,null,count,fettersConfig.FetterAudio);
        }
        break;
        case common.SkillEffectEM.RecoverHP:
        {
            let count_index = fettersConfig.ObjCount.length < level ? fettersConfig.ObjCount.length  - 1 : level - 1;
            let count = fettersConfig.ObjCount[count_index];
            skillObj = new Skill_RecoveryHP_2.Skill_RecoveryHP_2(fettersConfig.Priority, count, value0,fettersConfig.FetterAudio);
        }
        break;
        case common.SkillEffectEM.RemoteAttack:
        {
            let count_index = fettersConfig.ObjCount.length < level ? fettersConfig.ObjCount.length  - 1 : level - 1;
            let count = fettersConfig.ObjCount[count_index];
            if(value0 >= 1)
            {
                skillObj = new Skill_RemoteAtk_3.Skill_RemoteAtk_3(fettersConfig.Priority, count, Math.floor(value0),fettersConfig.FetterAudio);
            }
            else
            {
                skillObj=new Skill_RemoteAtk_3_1.Skill_RemoteAtk_3_1(fettersConfig.Priority, count, value0, false,fettersConfig.FetterAudio);
            }
        }
        break;
        case common.SkillEffectEM.SummonBattle:
        {
            if (fettersConfig.SummonLevel == 0) {
                let p = new Map<enums.Property, number>();
                p.set(enums.Property.HP, value0);
                p.set(enums.Property.TotalHP, value0);
                p.set(enums.Property.Attack, value1);
                skillObj = new Skill_Summon_4.Skill_Summon_4(fettersConfig.Priority, fettersConfig.SummonId, 0, p,fettersConfig.FetterAudio);
            }
            else {
                skillObj = new Skill_Summon_4.Skill_Summon_4(fettersConfig.Priority, fettersConfig.SummonId, fettersConfig.SummonLevel,null,fettersConfig.FetterAudio);
            }
        }
        break;
        case common.SkillEffectEM.GainShield:
        {
            skillObj = new Skill_Shields_6.Skill_Shields_6(fettersConfig.Priority, value0, value1,common.Direction.None,fettersConfig.FetterAudio);
        }
        break;
        case common.SkillEffectEM.AttackAll:
        {
            skillObj=new Skill_AttackAll(fettersConfig.Priority,value0,fettersConfig.FetterAudio);
        }
        break;
    }

    return skillObj;
}

export function CreateMechanicFettersSummon(level:number, buildValue:number) : skill.SkillBase {
    // to do ...
    let t = config.config.FettersConfig.get(6);
    let skillObj:skill.SkillBase = null;
    skillObj=new Skill_Summon_4.Skill_SummonMecha(null,null,level,buildValue,null,t.FetterAudio);
    return null;
}