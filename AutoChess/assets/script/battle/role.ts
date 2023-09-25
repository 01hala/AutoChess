/*
 * role.ts
 * author: qianqians
 * 2023/9/24
 */
import * as skill from './skill/skill_base'

export enum Property {
    HP = 1,
    Attack = 2,
    DamageReduction = 3,
    DamageReductionRound = 4,
    //
    InevitableKill = 5, // 暂时放这里. 0 普通伤害，1 必杀
}

export class SkillInfo {
    public trigger : skill.SkillTriggerBase;
    public skill : skill.SkillBase;
}

export class Role {
    public skill : SkillInfo[]; // 一般情况只有一个技能，使用特殊食物时添加一个技能

    private properties : Map<Property, number>;

    public BeHurted(damage: number) : number {
        return 0;
    }
    
    public ChangeProperties(type:Property,value:number) : Map<Property, number> {
        return null;
    }

    public GetProperty(em: Property) {
        if (this.properties.has(em)) {
            return this.properties[em];
        }
        return 0;
    }
}