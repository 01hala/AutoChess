/*
 * SKill_Obtain_Shield.ts
 * author: jie
 * 2023/9/28
 * 获得护盾技能，使用之前需要调用SetEffectiveRole传递获得护盾的角色的编号
 */
import { _decorator, Component, Node } from 'cc';
import { SkillBase,Event, RoleInfo, SkillTriggerBase } from './skill_base';
import { Camp, EventType, SkillType } from '../enums';
import { Battle } from '../battle';
import { Property, Role } from '../role';
import { random } from '../util';
const { ccclass, property } = _decorator;

@ccclass('obtain_shield')
export class SKill_Obtain_Shield extends SkillBase {
    public res:string="battle/skill/SKill_Obtain_Shield";
    public SkillType:SkillType=SkillType.Intensifier;
    private indexOfEffectiveRole : number[];
    private shieldValue : number;
    event:Event=new Event();

    //设置受影响的角色，设置护盾值
    SetEffectiveRole(indexOfEffectiveRole : number[], shieldValue : number) : void
    {
        this.indexOfEffectiveRole = indexOfEffectiveRole;
        this.shieldValue = shieldValue;
    }


    UseSkill(selfInfo: RoleInfo, battle: Battle): void 
    {
        try 
        {
            this.SkillEffect(selfInfo,battle);
        } 
        catch (error) 
        {
            console.warn(this.res+"下的 UseSkill 错误");
        }   
    }


    SkillEffect(selfInfo: RoleInfo, battle: Battle): void
    {
        try
        {
            for(const effectiveRoleIndex of this.indexOfEffectiveRole)
            {
                battle.GetSelfTeam().GetRole(effectiveRoleIndex).ChangeProperties(Property.DamageReduction,this.shieldValue);
            }
        }
        catch
        {
            console.error(this.res + "技能异常");
        }
    }
}



