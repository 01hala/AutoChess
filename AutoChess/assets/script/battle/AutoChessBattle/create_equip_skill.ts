/*
 * create_equip_skill.ts
 * author: qianqians
 * 2025/2/26
 */
import * as config from './config/config'
import * as enums from './BattleEnums'
import * as common from './common'
import * as skill from './skill/skill_base'
import * as Skill_Summon from './skill/Skill_Summon'
import * as create_trigger from './create_trigger'
import * as create_buffer from './create_buffer'
import {SkillInfo, Role} from './role'
import { Skill_Avoid_Killed } from './equip/Equip_Skill_Avoid_Killed'

export enum EquipEffectEM{
    AddHP = 1,                      //提高生命值
    AddAttack = 2,                  //提高攻击力
    DeDamage = 3,                   //抵抗伤害
    Summon = 7,                     //召唤
    AdditionalAttack = 8,           //额外伤害
    Resurrect = 9,                  //复活  
    AddArmor = 10,                  //额外护甲
    Die = 11,                       //即死
    ImmuneFatalDamage = 12,         //免疫致命伤害
    FirstAttackDoubleDamage = 13,   //首次攻击双倍伤害
    PiercingDamage = 14,            //穿刺伤害
}

export function createEquipSkill(r:Role, equipID:number) {
    let equip = config.config.EquipConfig.get(equipID);
    if (!equip) {
        return null;
    }

    switch(equip.Effect) {
        case EquipEffectEM.Summon:
        {
            let skill = new SkillInfo();
            let p = new Map<enums.Property, number>();
            p.set(enums.Property.HP, equip.Vaule[1]);
            p.set(enums.Property.TotalHP, equip.Vaule[1]);
            p.set(enums.Property.Attack, equip.Vaule[2]);
            skill.trigger = create_trigger.CreateTrigger(common.EMSkillEvent.syncope);
            skill.skill = new Skill_Summon.Skill_Summon(common.Priority.Normal, equip.Vaule[0], 1, p);
            r.skill.push(skill);
        }
        break;

        case EquipEffectEM.Resurrect:
        {
            let skill = new SkillInfo();
            let p = new Map<enums.Property, number>();
            p.set(enums.Property.HP, equip.Vaule[1]);
            p.set(enums.Property.TotalHP, equip.Vaule[1]);
            p.set(enums.Property.Attack, equip.Vaule[2]);
            skill.trigger = create_trigger.CreateTrigger(common.EMSkillEvent.syncope);
            skill.skill = new Skill_Summon.Skill_Summon(common.Priority.Normal, r.id, 1, p);
            r.skill.push(skill);
        }
        break;

        case EquipEffectEM.DeDamage:
        {
            let bufferConfig = config.config.BufferConfig.get(enums.BufferType.ReductionDamage);
            if (bufferConfig) {
                let buf = create_buffer.CreateBuff(bufferConfig.Id, equip.Vaule[0], 10);
                r.buffer.push(buf);
            }
        }
        break;

        case EquipEffectEM.AdditionalAttack:
        {
            let bufferConfig = config.config.BufferConfig.get(enums.BufferType.Strength);
            if (bufferConfig) {
                let buf = create_buffer.CreateBuff(bufferConfig.Id, equip.Vaule[0], 10);
                r.buffer.push(buf);
            }
        }
        break;

        case EquipEffectEM.AddArmor:
        {
            let bufferConfig = config.config.BufferConfig.get(enums.BufferType.Shields);
            if (bufferConfig) {
                let buf = create_buffer.CreateBuff(bufferConfig.Id, equip.Vaule[0]);
                r.buffer.push(buf);
            }
        }
        break;

        case EquipEffectEM.Die:
        {
            let bufferConfig = config.config.BufferConfig.get(enums.BufferType.InevitableKill);
            if (bufferConfig) {
                let buf = create_buffer.CreateBuff(bufferConfig.Id, equip.Vaule[0], 10);
                r.buffer.push(buf);
            }
        }
        break;

        case EquipEffectEM.ImmuneFatalDamage:
        {
            let skill = new SkillInfo();
            skill.trigger = create_trigger.CreateTrigger(common.EMSkillEvent.syncope);
            skill.skill = new Skill_Avoid_Killed(common.Priority.Normal);
            r.skill.push(skill);
        }
        break;
    }

    return skill;
}