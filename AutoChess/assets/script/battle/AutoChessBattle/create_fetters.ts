/*
 * create_fetters.ts
 * author: qianqians
 * 2023/12/15
 */
import * as config from './config/config'
import * as enums from './BattleEnums'
import * as common from './common'
import * as skill from './skill/skill_base'
import * as Skill_AttGain_1 from './skill/Skill_AttGain'
import * as Skill_RecoveryHP from './skill/Skill_RecoveryHP'
import * as Skill_RemoteAtk from './skill/Skill_RemoteAtk'
import * as Skill_Summon from './skill/Skill_Summon'
import * as Skill_SwapProperties_5 from './skill/Skill_SwapProperties'
import * as Skill_Shields from './skill/Skill_Shields'
import * as Skill_ChangePosition_7 from './skill/Skill_ChangeLocation'
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
            skillObj = new Skill_AttGain_1.Skill_AttGain(fettersConfig.Priority, value0, value1,null,count,fettersConfig.EffectScope,fettersConfig.FetterAudio,true);
        }
        break;
        case common.SkillEffectEM.RecoverHP:
        {
            let count_index = fettersConfig.ObjCount.length < level ? fettersConfig.ObjCount.length  - 1 : level - 1;
            let count = fettersConfig.ObjCount[count_index];
            skillObj = new Skill_RecoveryHP.Skill_RecoveryHP(fettersConfig.Priority, count, value0,fettersConfig.FetterAudio,true);
        }
        break;
        case common.SkillEffectEM.RemoteAttack:
        {
            let count_index = fettersConfig.ObjCount.length < level ? fettersConfig.ObjCount.length  - 1 : level - 1;
            let count = fettersConfig.ObjCount[count_index];
            if(value0 >= 1)
            {
                skillObj = new Skill_RemoteAtk.Skill_RemoteAtk(fettersConfig.Priority, count, Math.floor(value0),fettersConfig.FetterAudio,true);
            }
            else
            {
                skillObj=new Skill_RemoteAtk.Skill_RemoteAtkPre(fettersConfig.Priority, count, value0,null,fettersConfig.FetterAudio,true);
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
                skillObj = new Skill_Summon.Skill_Summon(fettersConfig.Priority, fettersConfig.SummonId, 0, p,fettersConfig.FetterAudio,true);
            }
            else {
                skillObj = new Skill_Summon.Skill_Summon(fettersConfig.Priority, fettersConfig.SummonId, fettersConfig.SummonLevel,null,fettersConfig.FetterAudio,true);
            }
        }
        break;
        case common.SkillEffectEM.GainShield:
        {
            skillObj = new Skill_Shields.Skill_Shields(fettersConfig.Priority, value0, value1,common.Direction.None,fettersConfig.FetterAudio,true);
        }
        break;
        case common.SkillEffectEM.AttackAll:
        {
            skillObj=new Skill_AttackAll(fettersConfig.Priority,value0,fettersConfig.FetterAudio,true);
        }
        break;
    }

    return skillObj;
}

export function CreateMechanicFettersSummon(level:number, buildValue:number) : skill.SkillBase {
    // to do ...
    let t = config.config.FettersConfig.get(6);
    let skillObj:skill.SkillBase = null;
    skillObj=new Skill_Summon.Skill_SummonMecha(null,null,level,buildValue,null,t.FetterAudio,true);
    return null;
}