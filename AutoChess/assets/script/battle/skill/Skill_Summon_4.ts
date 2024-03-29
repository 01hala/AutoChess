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
            console.warn(this.res+"下的 UseSkill 错误"+error);
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

            let addedIdx:number;
            if(Camp.Self==selfInfo.camp)
            {
                //addedIdx=new Role(-1,this.addedID,0, this.addedLevel, Camp.Self, this.addedProperties,null);
                addedIdx = battle.GetSelfTeam().GetVacancies();
            }
            if(Camp.Enemy==selfInfo.camp)
            {
                //addedIdx=new Role(-1,this.addedID,0, this.addedLevel, Camp.Enemy, this.addedProperties, null);
                addedIdx = battle.GetEnemyTeam().GetVacancies();
            }

            if(-1==addedIdx){
                console.warn("召唤角色失败，场上没有空位");
                return;
            }        

            
            let roleInfo = new RoleInfo();
            roleInfo.camp = selfInfo.camp;
            roleInfo.id=this.addedID;
            roleInfo.index = addedIdx;
            roleInfo.properties=this.addedProperties;
            // roleInfo.hp=this.addedProperties[Property.HP];
            // roleInfo.attack=this.addedProperties[Property.Attack];
            battleEvent.recipient.push(roleInfo);
            battle.AddBattleEvent(battleEvent);
        }
        catch (error) 
        {
            console.warn(this.res+"下的 SkillEffect 错误"+error);
        }
    }
}

/*
 * Skill_SummonMecha.ts
 * author: Guanliu
 * 2023/12/21
 * 机械师羁绊技能，召唤机甲。（因为机甲数据不明确暂时未实现）
 */
export class Skill_SummonMecha extends SkillBase 
{
    public res:string="battle/skill/Skill_SummonMecha";
    public SkillType:SkillType=SkillType.Summon;

    event:Event=new Event();

    private addedID: number;
    private addedLevel:number;
    private addedProperties: Map<Property, number>;
    private addedBuildLevel:number;
    public constructor(priority:number, id : number,level:number=1,buildValue:number=1,roleProperties : Map<Property, number>=null) {
        super(priority);

        this.addedID=id;
        this.addedLevel=level;
        this.addedBuildLevel=buildValue;
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
            console.log("召唤机甲技能");
            let battleEvent : Event = new Event();
            battleEvent.type = EventType.Summon;
            battleEvent.spellcaster = selfInfo;
            battleEvent.recipient = [];
            battleEvent.value = [];

            let addedIdx:number;
            //机甲修建值表现
            switch(this.addedBuildLevel){
                case 4:break;
                case 20:break;
                case 40:break;
            }
            if(Camp.Self==selfInfo.camp)
            {
                //addedIdx=new Role(-1,this.addedID, this.addedLevel,0, Camp.Self, this.addedProperties,null);
                addedIdx = battle.GetSelfTeam().GetVacancies();
            }
            if(Camp.Enemy==selfInfo.camp)
            {
                //addedIdx=new Role(-1,this.addedID, this.addedLevel,0, Camp.Enemy, this.addedProperties, null);
                addedIdx= battle.GetEnemyTeam().GetVacancies();
            }

            if(-1==addedIdx){
                console.warn("召唤机甲失败，场上没有空位");
                
                return;
            }        
            let roleInfo = new RoleInfo();
                roleInfo.camp = selfInfo.camp;
                roleInfo.index = addedIdx;
                roleInfo.properties=this.addedProperties;
                // roleInfo.hp=this.addedProperties[Property.HP];
                // roleInfo.attack=this.addedProperties[Property.Attack];
                battleEvent.recipient.push(roleInfo);
                battle.AddBattleEvent(battleEvent);
        }
        catch (error) 
        {
            console.warn(this.res+"下的 SkillEffect 错误");
        }
    }
}
