import { _decorator, Component, error, Node } from 'cc';
import { SkillBase,Event, RoleInfo, SkillTriggerBase } from './skill_base';
import { Camp, EventType, SkillType } from '../enums';
import { Battle } from '../battle';
import { Property, Role } from '../role';
import { random } from '../util';
const { ccclass, property } = _decorator;

@ccclass('Skill_RecoveryHP_2')
export class Skill_RecoveryHP_2 extends SkillBase {
    public res:string="battle/skill/Skill_RecoveryHP_2";
    private effectiveIndexOfRole : number[];
    private effectiveValue : number;
    private effectiveCamp : Camp;

    //回复生命脚本，第一个参数是需要回复生命值的角色索引，第二个参数是需要回复生命的数值，第三个参数是回复生命的目标阵容
    constructor(effectiveIndexOfRole : number[], effectiveValue : number, camp : Camp)
    {
        super();
        this.effectiveIndexOfRole = effectiveIndexOfRole;
        this.effectiveValue = effectiveValue;
        this.effectiveCamp = camp;
    }

    UseSkill(selfInfo: RoleInfo, battle: Battle): void
    {
        try
        {
            if(Camp.Enemy == this.effectiveCamp)
                for(const currIndex of this.effectiveIndexOfRole)
                {
                    battle.GetEnemyTeam().GetRole(currIndex).ChangeProperties(Property.HP,this.effectiveValue);
                }
            else if(Camp.Self == this.effectiveCamp)
                for(const currIndex of this.effectiveIndexOfRole)
                {
                    battle.GetSelfTeam().GetRole(currIndex).ChangeProperties(Property.HP,this.effectiveValue);
                }
            else
                throw new error("回复血量必须明确阵容！！");
        }
        catch(e)
        {
            console.error(this.res+"下的 UseSkill 异常");
        }
    }
}


