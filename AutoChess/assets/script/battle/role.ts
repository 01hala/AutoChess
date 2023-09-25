/*
 * role.ts
 * author: qianqians
 * 2023/9/24
 */
import * as skill from './skill/skill_base'

export enum Property {

}

export class Role {
    public skill : skill.SkillBase;

    private properties : Map<Property, number>;

    public BeHurted(damage: number) : number {
        return 0;
    }

    public ChangeProperties(change: Map<Property, number>) : Map<Property, number> {
        return null;
    }

    public GetProperty(em: Property) {
        return 0;
    }
}