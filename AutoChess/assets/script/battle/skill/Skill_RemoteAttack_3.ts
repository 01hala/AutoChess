/*
 * Skill_RemoteAttack_3.ts
 * author: Hotaru
 * 2023/9/25
 * 战斗开始时——对敌方随机单位造成1点远程伤害
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
export class Skill_RemoteAttack_3 extends SkillBase  
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

    private SkillEffect(selfInfo: RoleInfo, battle: Battle):void
    {
        try
        {
            let recipientRoles:Role[]=battle.GetSelfTeam().GetRoles();
            let randnum=this.GetRandomNum(1,recipientRoles.length);
            recipientRoles[randnum].BeHurted(this.event.value[0]);
        }
        catch (error) 
        {
            console.warn(this.res+"下的 SkillEffect 错误");
        }
    }
    
    private GetRandomNum(min:number,max:number):number
    {
        try
        {
            let range=max-min;
            let rand=Math.random();
            return (min+Math.round(rand*range));
        }
        catch (error) 
        {
            console.warn(this.res+"下的 getRandomNum 错误");
        }
    }
}


