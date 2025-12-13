/*
 * Skill_AttGain.ts
 * author: Hotaru
 * 2023/9/27
 * 获得+m生命值和+k攻击力（随机n人、前后左右或者自己）
 */
import { _decorator, Component, debug, log, Node } from 'cc';
import { SkillBase,Event, RoleInfo,SkillTriggerBase, } from './skill_base';
import { Battle } from '../battle';
import { Team } from '../team';
import { Role } from '../role';
import * as BattleEnums from '../BattleEnums'
import { Direction } from '../common'
import { random } from '../util';

export class Skill_AttGain extends SkillBase 
{
    public res:string="battle/skill/Skill_AttGain.ts/Skill_AttGain";
    public SkillType:BattleEnums.SkillType=BattleEnums.SkillType.Intensifier;

    private numberOfRole:number=null;
    private dir:Direction=null;
    private health:number;
    private attack:number;
    private effectScope:number=0;

    private eventSound:string;

    event:Event=new Event();

    public constructor(priority:number,health:number, attack:number,dir:Direction,numberOfRole?:number,effectScope?:number,eventSound?:string,isfetter:boolean=false) 
    {
        super(priority,isfetter);

        this.attack = attack;
        this.health=health;
        if(null!=dir)
        {
            this.dir=dir;
        }
        if(null!=numberOfRole)
        {
            this.numberOfRole=numberOfRole;
        }
        if(null!=effectScope){
            this.effectScope=effectScope;
        }
        if(null!=eventSound){
            this.eventSound=eventSound;
        }       
    }

    public UseSkill(selfInfo: RoleInfo, battle: Battle,isParallel:boolean): void 
    {
        try
        {
            let event: Event = new Event();
            event.isParallel = isParallel;
            event.spellcaster = selfInfo;
            event.type = BattleEnums.EventType.UsedSkill;
            battle.AddBattleEvent(event);

            if(!this.numberOfRole || 0==this.numberOfRole)
            {
                this.SkillEffect_1(selfInfo,battle,isParallel);    
            }
            else if(Direction.None == this.dir && this.numberOfRole < 6)
            {
                this.SkillEffect_2(selfInfo,battle,isParallel);  
            }

            if(this.dir && Direction.Summon != this.dir)
            {
                this.SkillEffect_3(selfInfo,battle,isParallel);
            }
            else if (Direction.Summon == this.dir)
            {
                this.SkillEffect_5(selfInfo, battle, isParallel);
            }

            if(6 == this.numberOfRole)
            {
                this.SkillEffect_4(selfInfo,battle,isParallel);
            }     
            battle.onPlayerOnShot.call(null, this.eventSound);
        }
        catch (error) 
        {
            console.warn(this.res+"下的 UseSkill 错误");
        }
        
    }

    SkillEffect_1(selfInfo: RoleInfo, battle: Battle,isPar:boolean):void          //指定某一对象生效,前后左右或自己
    {
        console.log("Skill_AttGain_1 SkillEffect_1! selfInfo:", selfInfo, " dir:", this.dir);
        try
        {
            let event = new Event();
            event.type = BattleEnums.EventType.IntensifierProperties;
            event.spellcaster = selfInfo;
            event.recipient = [];
            event.isParallel=isPar;
            event.eventSound=this.eventSound;
            event.isFetter=this.isFetter;

            let teamTemp:Team=null;
            let recipientRole:Role=null;

            let roleInfo = new RoleInfo();
            roleInfo.camp = selfInfo.camp;
            roleInfo.index = 0;

            if(BattleEnums.Camp.Self==selfInfo.camp)
            {
                teamTemp=battle.GetSelfTeam();  
            }
            if(BattleEnums.Camp.Enemy==selfInfo.camp)
            {
                teamTemp=battle.GetEnemyTeam();
            }
            switch(this.dir)
                {
                    case Direction.Self:
                        recipientRole=teamTemp.GetRole(selfInfo.index);
                        roleInfo.index = selfInfo.index;
                        break;
                    case Direction.Forward:
                        if(selfInfo.index>=3)
                        {
                            recipientRole=teamTemp.GetRole(selfInfo.index-3);
                            roleInfo.index = selfInfo.index-3;
                        }
                        break;
                    case Direction.Back:
                        if(selfInfo.index<3)
                        {
                            console.log("Skill_AttGain_1 SkillEffect_1! dir:", this.dir, " teamTemp:", teamTemp);
                            recipientRole=teamTemp.GetRole(selfInfo.index+3);
                            roleInfo.index = selfInfo.index+3;
                        }
                        break;
                    case Direction.Rigiht:
                        if(2!=selfInfo.index && 5!=selfInfo.index)
                        {
                            if(1==selfInfo.index||4==selfInfo.index)
                            {
                                recipientRole=teamTemp.GetRole(selfInfo.index-3);
                                roleInfo.index = selfInfo.index-3;
                            }
                            if(0==selfInfo.index||3==selfInfo.index)
                            {
                                recipientRole=teamTemp.GetRole(selfInfo.index+2);
                                roleInfo.index = selfInfo.index+2;
                            }
                        }
                        break;
                    case Direction.Left:
                        if(1!=selfInfo.index && 4!= selfInfo.index)
                        {
                            if(0==selfInfo.index||3==selfInfo.index)
                            {
                                recipientRole=teamTemp.GetRole(selfInfo.index+1);
                                roleInfo.index = selfInfo.index+1;
                            }
                            if(2==selfInfo.index||5==selfInfo.index)
                            {
                                recipientRole=teamTemp.GetRole(selfInfo.index-2);
                                roleInfo.index = selfInfo.index-2;
                            }
                        }
                        break;
                    default:
                        break;
                }
            
            if(null!=recipientRole)
            {
                console.log("Skill_AttGain skill:", this);
                console.log("recipientRole:", recipientRole, " ChangeProperties!");
                recipientRole.ChangeProperties(BattleEnums.Property.HP, recipientRole.GetProperty(BattleEnums.Property.HP) + this.health,this.effectScope==1);
                recipientRole.ChangeProperties(BattleEnums.Property.TotalHP, recipientRole.GetProperty(BattleEnums.Property.TotalHP) + this.health,this.effectScope==1);
                recipientRole.ChangeProperties(BattleEnums.Property.Attack,recipientRole.GetProperty(BattleEnums.Property.Attack) + this.attack,this.effectScope==1);
                console.log("recipientRole:", recipientRole, " ChangeProperties done!");

                event.recipient.push(roleInfo);
                event.value = [this.health, this.attack];
                event.effectScope=this.effectScope;
                battle.AddBattleEvent(event);
            }
        }
        catch (error) 
        {
            console.warn(this.res+"下的 SkillEffect_1 错误 ",error);
        }
    }

    SkillEffect_2(selfInfo: RoleInfo, battle: Battle,isPar:boolean):void          //随机一对象生效
    {
        console.log("Skill_AttGain_1 SkillEffect_2!");
        try
        {
            let event = new Event();
            event.type = BattleEnums.EventType.IntensifierProperties;
            event.spellcaster = selfInfo;
            event.recipient = [];
            event.isParallel=isPar;
            event.isFetter=this.isFetter;

            let recipientRoles:Role[]=new Array();
            let rolesTemp:Role[]=null;

            if(BattleEnums.Camp.Self==selfInfo.camp)
            {
                rolesTemp=battle.GetSelfTeam().GetRoles().slice();
            }
            if(BattleEnums.Camp.Enemy==selfInfo.camp)
            {
                rolesTemp=battle.GetEnemyTeam().GetRoles().slice();
            }
            while(recipientRoles.length<this.numberOfRole && recipientRoles.length<rolesTemp.length)
            {
                let index = random(0, rolesTemp.length);
                if(index!=selfInfo.index)                                   //随机但不包括自己
                {
                    recipientRoles.push(rolesTemp[index]);
                    rolesTemp.splice(index, 1);

                    let roleInfo = new RoleInfo();
                    roleInfo.camp = selfInfo.camp;
                    roleInfo.index = index;
                    event.recipient.push(roleInfo);
                }
            }
            recipientRoles.forEach((role) => 
            {
                console.log("recipientRoles role:", role, " ChangeProperties!");
                role.ChangeProperties(BattleEnums.Property.HP, role.GetProperty(BattleEnums.Property.HP) + this.health,this.effectScope==1);
                role.ChangeProperties(BattleEnums.Property.TotalHP, role.GetProperty(BattleEnums.Property.TotalHP) + this.health,this.effectScope==1);
                role.ChangeProperties(BattleEnums.Property.Attack,role.GetProperty(BattleEnums.Property.Attack) + this.attack,this.effectScope==1);
            });
            event.value = [this.health,this.attack];
            event.effectScope=this.effectScope;
            battle.AddBattleEvent(event);
        }
        catch (error) 
        {
            console.warn(this.res+"下的 SkillEffect_2 错误 ",error);
        }
    }

/*
 * 添加相邻位置的角色生效
 * author: Hotaru
 * 2023/10/8
 */
    SkillEffect_3(selfInfo: RoleInfo, battle: Battle,isPar:boolean):void
    {
        try
        {
            let event = new Event();
            event.type = BattleEnums.EventType.IntensifierProperties;
            event.spellcaster = selfInfo;
            event.isParallel=isPar;
            event.recipient = [];
            event.isFetter=this.isFetter;

            let indexs:number[]=[];

            let team:Team;

            if(BattleEnums.Camp.Self==selfInfo.camp)
            {
                team=battle.GetSelfTeam();
            }

            if(BattleEnums.Camp.Enemy==selfInfo.camp)
            {
                team=battle.GetEnemyTeam();
            }

            if(Direction.Cross==this.dir)
            {
                switch(selfInfo.index)
                {
                    case 0:
                        indexs.push(1,2,3);break;
                    case 1:
                        indexs.push(0,4);break;
                    case 2:
                        indexs.push(0,5);break;
                    case 3:
                        indexs.push(0,4,5);break;
                    case 4:
                        indexs.push(1,3);break;
                    case 5:
                        indexs.push(2,3);break;
                }
            }

            let recipientRoles:Role[]=new Array();
            for(let i=0;i<indexs.length;i++)
            {
                if(null!=team.GetRole(indexs[i]))
                {
                    recipientRoles.push(team.GetRole(indexs[i]));
                }
                
            }

            recipientRoles.forEach((role) => 
            {
                console.log("recipientRoles role:", role, " ChangeProperties!");
                role.ChangeProperties(BattleEnums.Property.HP, role.GetProperty(BattleEnums.Property.HP) + this.health);
                role.ChangeProperties(BattleEnums.Property.TotalHP, role.GetProperty(BattleEnums.Property.TotalHP) + this.health);
                role.ChangeProperties(BattleEnums.Property.Attack, role.GetProperty(BattleEnums.Property.Attack) + this.attack);
            });

            for(let i of indexs)
            {
                let roleInfo:RoleInfo=new RoleInfo();
                roleInfo.camp=selfInfo.camp;

                if(null!=team.GetRole(i))
                {
                    roleInfo.index=i;
                    event.recipient.push(roleInfo);
                }
            }
            event.value = [this.health, this.attack];
            event.effectScope=this.effectScope;
            battle.AddBattleEvent(event);
        }
        catch(error)
        {
            console.warn(this.res+"下的 SkillEffect_3 错误 ",error);
        }
        
    }

/*
 * 添加全队角色（除自己）生效
 * author: Hotaru
 * 2024/8/13
 */

    SkillEffect_4(selfInfo: RoleInfo, battle: Battle,isPar:boolean)
    {
        try
        {
            let event = new Event();
            event.type = BattleEnums.EventType.IntensifierProperties;
            event.spellcaster = selfInfo;
            event.isParallel=true;
            event.recipient = [];
            event.isFetter=event.isFetter;
    
            let indexs: number[] = [];
    
            let rolesTemp: Role[] = [];
    
            if (BattleEnums.Camp.Self == selfInfo.camp)
            {
                rolesTemp = battle.GetSelfTeam().GetRoles().slice();
            }
    
            if (BattleEnums.Camp.Enemy == selfInfo.camp)
            {
                rolesTemp = battle.GetEnemyTeam().GetRoles().slice();
            }

            let recipientRoles:Role[]=new Array();
            for(let r of rolesTemp)
            {
                if(r!=null && r.index != selfInfo.index)
                {
                    recipientRoles.push(r);
                }
            }

            recipientRoles.forEach((role) => 
            {
                console.log("recipientRoles role:", role, " ChangeProperties!");
                role.ChangeProperties(BattleEnums.Property.HP, role.GetProperty(BattleEnums.Property.HP) + this.health);
                role.ChangeProperties(BattleEnums.Property.TotalHP, role.GetProperty(BattleEnums.Property.TotalHP) + this.health);
                role.ChangeProperties(BattleEnums.Property.Attack, role.GetProperty(BattleEnums.Property.Attack) + this.attack);
            });
    
            for(let r of rolesTemp)
            {
                if(r!=null && r.index != selfInfo.index)
                {
                    let roleInfo:RoleInfo=new RoleInfo();
                    roleInfo.camp=selfInfo.camp;
                    roleInfo.index=r.index;
                    event.recipient.push(roleInfo);
                }
            }
    
            event.value = [this.health, this.attack];
            event.effectScope=this.effectScope;
            battle.AddBattleEvent(event);
        }
        catch(error)
        {
            console.warn(this.res+"下的 SkillEffect_4 错误 ",error);
        }
    }

/*
 * 召唤物生效
 * author: Hotaru
 * 2024/09/09
 */
    SkillEffect_5(selfInfo: RoleInfo, battle: Battle,isPar:boolean)
    {
        let event = new Event();
        event.type = BattleEnums.EventType.IntensifierProperties;
        event.spellcaster = selfInfo;
        event.isParallel = isPar;
        event.recipient = [];
        event.isFetter=event.isFetter;

        let rolesTemp: Role[] = [];

        if (BattleEnums.Camp.Self == selfInfo.camp)
        {
            rolesTemp = battle.GetSelfTeam().GetRoles().slice();
        }

        if (BattleEnums.Camp.Enemy == selfInfo.camp)
        {
            rolesTemp = battle.GetEnemyTeam().GetRoles().slice();
        }

        
        for(let r of rolesTemp)
        {
            if(200001 == r.id || 200002 == r.id  || 200003 == r.id)
            {
                r.ChangeProperties(BattleEnums.Property.HP, r.GetProperty(BattleEnums.Property.HP) + this.health);
                r.ChangeProperties(BattleEnums.Property.TotalHP, r.GetProperty(BattleEnums.Property.TotalHP) + this.health);
                r.ChangeProperties(BattleEnums.Property.Attack, r.GetProperty(BattleEnums.Property.Attack) + this.attack);

                let roleInfo: RoleInfo = new RoleInfo();
                roleInfo.camp = selfInfo.camp;
                roleInfo.index = r.index;
                event.recipient.push(roleInfo);
            }
        }

        event.value = [this.health, this.attack];
        event.effectScope = this.effectScope;
        battle.AddBattleEvent(event);

    }
}
