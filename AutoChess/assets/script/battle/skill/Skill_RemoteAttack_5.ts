/*
 * Skill_RemoteAttack_5.ts
 * author: Hotaru
 * 2023/9/25
 * 战斗开始时——对敌方三名随机单位造成2点远程伤害
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
export class Skill_RemoteAttack_5 extends SkillBase  
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
            //let randnum=this.GetRandomNum(0,5);
            let recipientRoles:Role[]=battle.GetEnemyTeam().GetRoles();
            if(recipientRoles.length<=3)
            {
                recipientRoles.forEach(element => 
                {
                    element.BeHurted(this.event.value[0]);
                });
            }
            else
            {
                for(let i:number=0;i<3;i++)
                {
                    let randnum=this.GetRandomNum(0,recipientRoles.length);
                    recipientRoles[randnum].BeHurted(this.event.value[0]);
                    recipientRoles.splice(randnum);
                }
            }
            
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


