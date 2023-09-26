/*
 * Skill_AttGain_1.ts
 * author: Hotaru
 * 2023/9/25
 * 购买时——随机一兵种获得+1生命值和+1攻击力
 */
import { _decorator, Component, debug, log, Node, random } from 'cc';
import { SkillBase,Event, RoleInfo,Camp, EventType,SkillTriggerBase, SkillType} from './skill_base';
import { Battle } from '../battle';
import { Team } from '../team';
import { Role,Property } from '../role';

export class skillTirgger extends SkillTriggerBase
{
    CheckSkillTrigger(frameEvent: Event[], selfInfo: RoleInfo): boolean 
    {
        return false;
    }

}

export class Skill_AttGain_1 extends SkillBase 
{
    public res:string="battle/skill/Skill_AttGain_1";
    public SkillType:SkillType=SkillType.Intensifier;

    event:Event=new Event();

    public UseSkill(selfInfo: RoleInfo, battle: Battle): void 
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
            recipientRoles[randnum].ChangeProperties(Property.HP,this.event.value[0]);
            recipientRoles[randnum].ChangeProperties(Property.Attack,this.event.value[1]);
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
            return 0;
        }
    }
}


