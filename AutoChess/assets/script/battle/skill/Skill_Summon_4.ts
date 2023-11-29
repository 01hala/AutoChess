/*
 * Skill_Summon_4_1.ts
 * author: Guanliu
 * 2023/9/27
 * 召唤一个角色（可选指定属性与等级）
 */
import { _decorator, Component, debug, log, Node, random } from 'cc';
import { SkillBase,Event, RoleInfo,SkillTriggerBase } from './skill_base';
import { Battle } from '../battle';
import { Team } from '../team';
import { Role } from '../role';
import { Camp, SkillType, Property, EventType } from '../../other/enums';

export class Skill_Summon_4 extends SkillBase 
{
    public res:string="battle/skill/Skill_Summon_4";
    public SkillType:SkillType=SkillType.Summon;

    event:Event=new Event();

    private addedID: number;
    private addedLevel:number;
    private addedProperties: Map<Property, number>;
    public constructor(priority:number, id : number,level:number=1,roleProperties : Map<Property, number>=null) {
        super(priority);

        this.addedID=id;
        this.addedLevel=level;
        this.addedProperties=roleProperties;
    }

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
            console.log("召唤技能");
            let battleEvent : Event = new Event();
            battleEvent.type = EventType.Summon;
            battleEvent.spellcaster = selfInfo;
            battleEvent.recipient = [];
            battleEvent.value = [];

            let added:Role;
            if(Camp.Self==selfInfo.camp)
            {
                added=new Role(-1,this.addedID,this.addedID-100000, this.addedLevel,0, Camp.Self, this.addedProperties, 0);
                added.index = battle.GetSelfTeam().AddRole(added);
            }
            if(Camp.Enemy==selfInfo.camp)
            {
                added=new Role(-1,this.addedID,this.addedID-100000, this.addedLevel,0, Camp.Self, this.addedProperties, 0);
                added.index = battle.GetEnemyTeam().AddRole(added);
            }

            if(-1==added.index){
                console.warn("召唤角色失败，场上没有空位");
                
                return;
            }        
            let roleInfo = new RoleInfo();
                roleInfo.camp = selfInfo.camp;
                roleInfo.index = 0;
                roleInfo.hp=this.addedProperties[Property.HP];
                roleInfo.attack=this.addedProperties[Property.Attack];
                battleEvent.recipient.push(roleInfo);
                battle.AddBattleEvent(battleEvent);
        }
        catch (error) 
        {
            console.warn(this.res+"下的 SkillEffect 错误");
        }
    }
}


