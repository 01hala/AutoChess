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
    private effectiveRoleInfo : RoleInfo[];
    private effectiveValue : number;

    constructor(effectiveRoleInfo : RoleInfo[], effectiveValue : number){
        super();
        this.Init(effectiveRoleInfo, effectiveValue);
    }

    //回复生命脚本，第一个参数是需要回复生命值的RoleInfo，第二个参数是需要回复生命的数值，第三个参数是回复生命的目标阵容
    Init(effectiveRoleInfo : RoleInfo[], effectiveValue : number) : void
    {
        this.effectiveRoleInfo = effectiveRoleInfo;
        this.effectiveValue = effectiveValue;
    }

    UseSkill(selfInfo: RoleInfo, battle: Battle): void
    {
        try
        {
            for(const roleInfo of this.effectiveRoleInfo)
            {
                if(Camp.Enemy == roleInfo.camp)
                    battle.GetEnemyTeam().GetRole(roleInfo.index).ChangeProperties(Property.HP,this.effectiveValue);
                else if(Camp.Self == roleInfo.camp)
                    battle.GetSelfTeam().GetRole(roleInfo.index).ChangeProperties(Property.HP,this.effectiveValue);
                else
                    throw new error("阵营");
            }
        }
        catch(e)
        {
            console.error(this.res + "下的" +  e + "异常");
        }
    }
}


