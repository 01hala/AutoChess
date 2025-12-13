/*
 * Skill_Shields_6.ts
 * author: Hotaru
 * 2023/9/30
 * 获得护盾(前后左右或自己)
 */
import { _decorator, Component, debug, error, log, Node } from 'cc';
import { SkillBase,Event, RoleInfo,SkillTriggerBase, } from './skill_base';
import { Battle } from '../battle';
import { Team } from '../team';
import { Role} from '../role';
import * as BattleEnums from '../BattleEnums';
import { random } from '../util';
import { Buffer } from '../buffer/buffer';
import { Direction } from '../common';

export class Skill_Shields extends SkillBase 
{
    public res:string="battle/skill/Skill_Shields.ts";
    public SkillType:BattleEnums.SkillType=BattleEnums.SkillType.Support;

    private value:number;
    private dir:Direction;
    private numberOfRole : number;
    private eventSound:string;

    event:Event=new Event();

    public constructor(priority:number , num:number, value:number,dir?:Direction,eventSound?:string,isfetter:boolean=false) 
    {
        super(priority,isfetter);
        this.numberOfRole=num;
        this.value=value;
        if(dir)
        {
            this.dir=dir;
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
            if(this.dir!=null && this.dir != Direction.None)
            {
                this.SkillEffect_1(selfInfo,battle,isParallel);
            }
            else
            {
                this.SkillEffect_2(selfInfo,battle,isParallel);
            }
            battle.onPlayerOnShot.call(null, this.eventSound);
        }
        catch (error) 
        {
            console.warn(this.res+"下的 UseSkill 错误",error);
        }
        
    }

    SkillEffect_1(selfInfo: RoleInfo, battle: Battle,isPar:boolean):void        //前后左右或自己
    {
        try 
        {
            let teamTemp:Role[]=null;
            let recipientRole:Role=null;
            let event = new Event();
            event.isParallel=isPar;
            event.eventSound=this.eventSound;
            event.spellcaster=selfInfo;
            event.type=BattleEnums.EventType.GiveShields;
            event.isFetter=this.isFetter;

            if(BattleEnums.Camp.Self==selfInfo.camp)
            {
            teamTemp=battle.GetSelfTeam().GetRoles();
            }
            if(BattleEnums.Camp.Enemy==selfInfo.camp)
            {
                teamTemp=battle.GetEnemyTeam().GetRoles();
            }
            switch (this.dir)
            {
                case 0:
                    recipientRole = teamTemp[selfInfo.index];
                    break;
                case 1:
                    if (selfInfo.index >= 3)
                    {
                        recipientRole = teamTemp[selfInfo.index - 3];
                    }
                    break;
                case 2:
                    if (selfInfo.index < 3)
                    {
                        recipientRole = teamTemp[selfInfo.index + 3];
                    }
                    break;
                case 3:
                    if (2 != selfInfo.index && 5 != selfInfo.index)
                    {
                        if (1 == selfInfo.index || 4 == selfInfo.index)
                        {
                            recipientRole = teamTemp[selfInfo.index - 3];
                        }
                        if (0 == selfInfo.index || 3 == selfInfo.index)
                        {
                            recipientRole = teamTemp[selfInfo.index + 2];
                        }
                    }
                    break;
                case 4:
                    if (1 != selfInfo.index && 4 != selfInfo.index)
                    {
                        if (0 == selfInfo.index || 3 == selfInfo.index)
                        {
                            recipientRole = battle.GetSelfTeam().GetRole(selfInfo.index + 1);
                        }
                        if (2 == selfInfo.index || 5 == selfInfo.index)
                        {
                            recipientRole = battle.GetSelfTeam().GetRole(selfInfo.index - 2);
                        }
                    }
            }
            if(null!=recipientRole)
            {
                recipientRole.AddBuff(1,this.value);

                let roleInfo:RoleInfo=new RoleInfo();
                roleInfo.camp=selfInfo.camp;
                roleInfo.index=recipientRole.index;
   
                event.recipient.push(roleInfo);

                event.value = [this.value];
                battle.AddBattleEvent(event);
            }
        } 
        catch (error) 
        {
            console.warn(this.res+"下的 SkillEffect_1 错误",error);
        }
        
    }
    
    SkillEffect_2(selfInfo: RoleInfo, battle: Battle,isPar:boolean):void    //随机对象生效
    {
        try
        {
            console.log("给予护盾");
            let teamTemp: Role[] = null;
            let recipientRoles = [];
            let event = new Event();
            event.isParallel = isPar;
            event.eventSound = this.eventSound;
            event.spellcaster = selfInfo;
            event.type = BattleEnums.EventType.GiveShields;
            event.recipient=[];
            event.isFetter=this.isFetter;
    
            if (BattleEnums.Camp.Self == selfInfo.camp)
            {
                teamTemp = battle.GetSelfTeam().GetRoles();
            }
            if (BattleEnums.Camp.Enemy == selfInfo.camp)
            {
                teamTemp = battle.GetEnemyTeam().GetRoles();
            }
    
            let i=0;
            while (recipientRoles.length < this.numberOfRole && teamTemp.length > 0) 
            {
                let index = random(0, teamTemp.length);
                if (teamTemp[index].CheckDead() && teamTemp[index].getShields() && i <= teamTemp.length)
                {
                    if(index == selfInfo.index)
                    {
                        i++;
                        continue;
                    }
                }
                if(i>teamTemp.length) break;
                recipientRoles.push(teamTemp[index]);
                teamTemp.splice(index, 1);
            }
    
            for(let r of recipientRoles)
            {
                r.AddBuff(1,this.value);
    
                let roleInfo: RoleInfo = new RoleInfo();
                roleInfo.camp = selfInfo.camp;
                roleInfo.index = r.index;
    
                event.recipient.push(roleInfo);
            }
            event.value = [this.value];
            battle.AddBattleEvent(event);
        }
        catch(error)
        {
            console.warn(this.res+"下的 SkillEffect_2 错误",error);
        }
    }

}

