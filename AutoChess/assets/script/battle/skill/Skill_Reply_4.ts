/*
 * Skill_Reply_4.ts
 * author: Hotaru
 * 2023/9/25
 * 受伤时——己方全部单位+1生命值（回合外失效）
 */
import { _decorator, Component, Node } from 'cc';
import { SkillBase,Event, RoleInfo,Camp, EventType,SkillTriggerBase, SkillType} from './skill_base';
import { Battle } from '../battle';
import { Property, Role } from '../role';

export class skillTirgger extends SkillTriggerBase
{
    CheckSkillTrigger(frameEvent: Event[], selfInfo: RoleInfo): boolean 
    {
        return false;
    }

}

export class Skill_Reply_4 extends SkillBase  
{
    public res:string="battle/skill/Skill_RemoteAttack_3";
    public SkillType:SkillType=SkillType.Attack;

    event:Event=new Event();
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

    SkillEffect(selfInfo: RoleInfo, battle: Battle) 
    {
        try 
        {
            let arr:Role[]=battle.GetSelfTeam().GetRoles();
            arr.forEach(element => 
        {
            element.ChangeProperties(Property.HP,this.event.value[0]);
        });
        } 
        catch (error) 
        {
            console.warn(this.res+"下的 SkillEffect 错误");
        }
        
    }


}
