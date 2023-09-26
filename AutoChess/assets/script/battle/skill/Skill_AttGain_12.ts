/*
 * Skill_AttGain_12.ts
 * author: Hotaru
 * 2023/9/26
 * 右方吃掉食物时——使其额外获得+1生命值
 */
import { _decorator, Component, debug, log, Node, random } from 'cc';
import { SkillBase,Event, RoleInfo,Camp, EventType,SkillTriggerBase, SkillType} from './skill_base';
import { Battle } from '../battle';
import { Team } from '../team';
import { Role,Property } from '../role';

export class Skill_AttGain_12 extends SkillBase 
{
    public res:string="battle/skill/Skill_AttGain_12";
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
            let recipient:Role=new Role();
            if(Camp.Self==selfInfo.camp)
            {
                switch(selfInfo.index)
                {
                    case 0:case 3:
                        recipient=battle.GetSelfTeam().GetRole(this.event.spellcaster.index+2);
                        break;
                    case 1:case 4:
                        recipient=battle.GetSelfTeam().GetRole(this.event.spellcaster.index-1);
                        break;
                    default:
                        break;
                }
            }
            if(Camp.Enemy==selfInfo.camp)
            {
                switch(selfInfo.index)
                {
                    case 0:case 3:
                        recipient=battle.GetEnemyTeam().GetRole(this.event.spellcaster.index+2);
                        break;
                    case 1:case 4:
                        recipient=battle.GetEnemyTeam().GetRole(this.event.spellcaster.index-1);
                        break;
                    default:
                        break;
                }
            }
            recipient.ChangeProperties(Property.HP,this.event.value[0]);
            
        }
        catch (error) 
        {
            console.warn(this.res+"下的 SkillEffect 错误");
        }
    }

    
}


