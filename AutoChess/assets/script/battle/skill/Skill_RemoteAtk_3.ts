/*
 * Skill_RemoteAtk_3
 * author: Hotaru
 * 2023/9/25
 * 对N敌方随机单位造成M点远程伤害
 */
import { _decorator, Component, Node } from 'cc';
import { SkillBase,Event, RoleInfo, SkillTriggerBase } from './skill_base';
import { Camp, EventType, SkillType } from '../../other/enums';
import { Battle } from '../battle';
import { Role } from '../role';
import { random } from '../util';

export class Skill_RemoteAtk_3 extends SkillBase  
{
    public res:string="battle/skill/Skill_RemoteAtk_3";
    public SkillType:SkillType=SkillType.Attack;

    private numberOfRole : number;
    private attack : number;
    private isAll:boolean;

    public constructor(priority:number, numberOfRole:number, attack:number,isAll:boolean) {
        super(priority);

        this.numberOfRole = numberOfRole;
        this.attack = attack;
        this.isAll=isAll;

        //this.event.type=EventType.RemoteInjured;
    }

    event:Event=new Event();
    UseSkill(selfInfo: RoleInfo, battle: Battle): void 
    {
        try 
        {
            if(6>=this.numberOfRole && !this.isAll)
            {
                this.SkillEffect_1(selfInfo,battle);
            }
            else
            {
                console.warn("生效人数不能大于6人");
            }

            if(this.isAll)
            {
                this.SkillEffect_2(selfInfo,battle);
            }
            
        } 
        catch (error) 
        {
            console.warn(this.res+"下的 UseSkill 错误");
        }   
    }

    private SkillEffect_1(selfInfo: RoleInfo, battle: Battle):void          //随机对象生效
    {
        try
        {
            console.log("try to use remote skill");
            //let battleEvent : Event = new Event();
            //battleEvent.type = EventType.RemoteInjured;
            //battleEvent.spellcaster = selfInfo;
            //battleEvent.recipient = [];
            //battleEvent.value = [];

            let recipientRoles:Role[] = new Array();
            let self:Role = null;
            let enemyRoles:Role[] = null;

            let roleInfo=new RoleInfo();

            if(Camp.Self==selfInfo.camp)
            {
                self = battle.GetSelfTeam().GetRole(selfInfo.index);
                enemyRoles=battle.GetEnemyTeam().GetRoles().slice();

                roleInfo.camp=Camp.Enemy;
            }
            if(Camp.Enemy==selfInfo.camp)
            {
                self = battle.GetEnemyTeam().GetRole(selfInfo.index);
                enemyRoles=battle.GetSelfTeam().GetRoles().slice();

                roleInfo.camp=Camp.Self;
            }
            while(recipientRoles.length < this.numberOfRole) {
                let index = random(0, enemyRoles.length);
                recipientRoles.push(enemyRoles[index]);
                enemyRoles.splice(index, 1);

                roleInfo.index=index;
            }
            recipientRoles.forEach((role)=>{
                role.BeHurted(this.attack, self, battle);
                //console.log("远程攻击角色受伤 :",this.attack);
            });

            //battleEvent.recipient.push(roleInfo);
            //battle.AddBattleEvent(battleEvent);
        }
        catch (error) 
        {
            console.warn(this.res+"下的 SkillEffect 错误");
            console.log(error);
        }
    }

    private SkillEffect_2(selfInfo: RoleInfo, battle: Battle)         //场上全部生效
    {
        let battleEvent : Event = new Event();
        battleEvent.type = EventType.RemoteInjured;
        battleEvent.spellcaster = selfInfo;
        battleEvent.recipient = [];
        battleEvent.value = [];

        let self:Role=null;

        if(Camp.Self==selfInfo.camp)
        {
            self=battle.GetSelfTeam().GetRole(selfInfo.index);
        }
        if(Camp.Enemy==selfInfo.camp)
        {
            self=battle.GetEnemyTeam().GetRole(selfInfo.index);
        }

        let recipientRoles:Role[] = battle.GetSelfTeam().GetRoles();
        let enemyRoles:Role[] = battle.GetEnemyTeam().GetRoles();

        for(let t of enemyRoles)
        {
            recipientRoles.push(t);
            let roleInfo=new RoleInfo();

            roleInfo.camp=t.selfCamp;
            if(Camp.Enemy==selfInfo.camp) roleInfo.index=battle.GetSelfTeam().GetRoleIndex(t);
            else roleInfo.index=battle.GetEnemyTeam().GetRoleIndex(t);
            battleEvent.recipient.push(roleInfo);
        }

        for(let role of recipientRoles)
        {
            role.BeHurted(this.attack, self, battle)
        }
        battle.AddBattleEvent(battleEvent);
    }
}


