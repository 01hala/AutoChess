/*
 * Skill_SwapProperties.ts
 * author: Guanliu
 * 2023/9/30
 * 交换队伍中指定两个位置上的角色的属性，若有交换方不存在则不交换
 */
import { _decorator, Component, debug, log, Node, ValueType } from 'cc';
import { SkillBase,Event, RoleInfo,SkillTriggerBase } from './skill_base';
import { Battle } from '../battle';
import { Team } from '../team';
import { Role } from '../role';
import * as BattleEnums from '../BattleEnums';
import { random } from '../util';

export class Skill_SwapProperties extends SkillBase 
{
    public res:string="battle/skill/Skill_SwapProperties.ts/Skill_SwapProperties";
    public SkillType:BattleEnums.SkillType=BattleEnums.SkillType.SwapProperties;

    event:Event=new Event();

    private type:BattleEnums.SwapPropertiesType;
    private count:number
    private index1:number;
    private index2:number;

    private eventSound:string;

    public constructor(priority:number, type:BattleEnums.SwapPropertiesType, count:number ,swapper1:number,swapper2:number,eventSound:string,isfetter:boolean=false) {
        super(priority,isfetter);

        this.type = type;
        this.index1=swapper1;
        this.index2=swapper2;

        if(eventSound!=null)
        {
            this.eventSound=eventSound;
        }
    }

    public UseSkill(selfInfo: RoleInfo, battle: Battle,isParallel:boolean): void 
    {
        try
        {
            this.SkillEffect(selfInfo,battle,isParallel); 
            battle.onPlayerOnShot.call(null, this.eventSound);            
        }
        catch (error) 
        {
            console.warn(this.res+"下的 UseSkill 错误", error);
        }
        
    }

    private SkillEffect(selfInfo: RoleInfo, battle: Battle,isPar:boolean):void
    {
        try
        {
            let event = new Event();
            event.type = BattleEnums.EventType.SwapProperties;
            event.spellcaster = selfInfo;
            event.recipient = [];
            event.isParallel=isPar;
            event.isFetter=this.isFetter;

            if (BattleEnums.SwapPropertiesType.SelfSwap == this.type) {
                let swapRole:Role = null;
                if(BattleEnums.Camp.Self==selfInfo.camp){
                    swapRole = battle.GetSelfTeam().GetRole(selfInfo.index);
                }
                if(BattleEnums.Camp.Enemy==selfInfo.camp){
                    swapRole = battle.GetEnemyTeam().GetRole(selfInfo.index);
                }
                if (!swapRole) {
                    return;
                }

                let hp = swapRole.GetProperty(BattleEnums.Property.HP);
                let attack = swapRole.GetProperty(BattleEnums.Property.Attack);
                swapRole.ChangeProperties(BattleEnums.Property.HP, attack);
                swapRole.ChangeProperties(BattleEnums.Property.Attack, hp);

                event.value = [BattleEnums.SwapPropertiesType.SelfSwap];
            }
            else if (BattleEnums.SwapPropertiesType.AssignSwap == this.type) {
                let swapRoles:Role[];
                if(BattleEnums.Camp.Self==selfInfo.camp){
                    swapRoles.push(battle.GetSelfTeam().GetRole(this.index1));
                    swapRoles.push(battle.GetSelfTeam().GetRole(this.index2));
                }
                if(BattleEnums.Camp.Enemy==selfInfo.camp){
                    swapRoles.push(battle.GetEnemyTeam().GetRole(this.index1));
                    swapRoles.push(battle.GetEnemyTeam().GetRole(this.index2));
                }
                if(!swapRoles[0] || !swapRoles[1]) {
                    return;
                }

                let temp=swapRoles[0].GetProperties();
                temp.forEach((value,key)=>{
                    swapRoles[0].ChangeProperties(key,swapRoles[1].GetProperty(key));
                    swapRoles[1].ChangeProperties(key,value);
                });

                event.value = [BattleEnums.SwapPropertiesType.AssignSwap, this.index1, this.index2];
            }
            else if (BattleEnums.SwapPropertiesType.RandomSwap == this.type) {
                let swapRoles:Role[];
                let rolesTemp:Role[]=null;     

                let original:Role[] = null;
                if(BattleEnums.Camp.Self==selfInfo.camp) {
                    rolesTemp=battle.GetSelfTeam().GetRoles().slice();
                    original = battle.GetSelfTeam().GetRoles();
                }
                else if(BattleEnums.Camp.Enemy==selfInfo.camp) {
                    rolesTemp=battle.GetEnemyTeam().GetRoles().slice();
                    original = battle.GetSelfTeam().GetRoles();
                }
                while(swapRoles.length<2 && rolesTemp.length > 0) {
                    let index = random(0, rolesTemp.length);
                    if(index!=selfInfo.index) {
                        swapRoles.push(rolesTemp[index]);
                        rolesTemp.splice(index, 1);
                    }
                }
                if (swapRoles.length<2) {
                    return;
                }

                let temp=swapRoles[0].GetProperties();
                temp.forEach((value,key)=>{
                    swapRoles[0].ChangeProperties(key,swapRoles[1].GetProperty(key));
                    swapRoles[1].ChangeProperties(key,value);
                });

                event.value = [BattleEnums.SwapPropertiesType.RandomSwap , swapRoles[0].index , swapRoles[1].index];
            }
            battle.AddBattleEvent(event);
        }
        catch (error) 
        {
            console.warn(this.res+"下的 SkillEffect 错误", error);
        }
    }

    private SkillEffect_2(selfInfo: RoleInfo, battle: Battle,isPar:boolean)
    {

    }
}

/**
 * 单方面替换属性
 */
export class Skill_SwapPropertiesSingle extends SkillBase 
{
    public res:string="battle/skill/Skill_SwapProperties.ts/Skill_SwapPropertiesSingle";
    public SkillType:BattleEnums.SkillType=BattleEnums.SkillType.SwapProperties;

    private type:BattleEnums.SwapPropertiesType;
    private value:number;

    private eventSound:string;

    public constructor(priority: number, type: BattleEnums.SwapPropertiesType, value: number, eventSound: string, isfetter: boolean = false)
    {
        super(priority, isfetter);

        this.type = type;
        this.value = value;

        if (eventSound != null)
        {
            this.eventSound = eventSound;
        }
    }

    UseSkill(selfInfo: RoleInfo, battle: Battle, isParallel: boolean): void
    {
        let event = new Event();
        event.type = BattleEnums.EventType.UsedSkill;
        event.spellcaster = selfInfo;
        event.recipient = [];
        event.isParallel = isParallel;
        battle.AddBattleEvent(event);

        if(BattleEnums.SwapPropertiesType.HpSwap == this.type)
        {
            this.SkillEffect_1(selfInfo,battle,isParallel);
        }
        if(BattleEnums.SwapPropertiesType.AttackSwap == this.type)
        {
            this.SkillEffect_2(selfInfo,battle,isParallel);
        }
    }

    SkillEffect_1(_selfInfo: RoleInfo, _battle: Battle, _isPar: boolean)        //生命交换到攻击
    {
        try
        {
            let event = new Event();
            event.type = BattleEnums.EventType.SwapProperties;
            event.spellcaster = _selfInfo;
            event.recipient = [];
            event.isParallel=_isPar;
            event.isFetter=this.isFetter;

            let swapRole:Role = null;
            if(BattleEnums.Camp.Self==_selfInfo.camp){
                swapRole = _battle.GetSelfTeam().GetRole(_selfInfo.index);
            }
            if(BattleEnums.Camp.Enemy==_selfInfo.camp){
                swapRole = _battle.GetEnemyTeam().GetRole(_selfInfo.index);
            }
            if (!swapRole) 
            {
                return;
            }

            let hp = swapRole.GetProperty(BattleEnums.Property.HP) + this.value;
            swapRole.ChangeProperties(BattleEnums.Property.Attack, hp);

            event.value = [BattleEnums.SwapPropertiesType.HpSwap , hp];
            _battle.AddBattleEvent(event);
        }
        catch(error)
        {
            console.warn(this.res+"下的 SkillEffect_1 错误", error);
        }
    }

    SkillEffect_2(_selfInfo: RoleInfo, _battle: Battle, _isPar: boolean)        //攻击交换到生命值
    {
        try
        {
            let event = new Event();
            event.type = BattleEnums.EventType.SwapProperties;
            event.spellcaster = _selfInfo;
            event.recipient = [];
            event.isParallel=_isPar;

            let swapRole:Role = null;
            if(BattleEnums.Camp.Self==_selfInfo.camp){
                swapRole = _battle.GetSelfTeam().GetRole(_selfInfo.index);
            }
            if(BattleEnums.Camp.Enemy==_selfInfo.camp){
                swapRole = _battle.GetEnemyTeam().GetRole(_selfInfo.index);
            }
            if (!swapRole) 
            {
                return;
            }

            let Attack = swapRole.GetProperty(BattleEnums.Property.Attack) + this.value;
            swapRole.ChangeProperties(BattleEnums.Property.HP, Attack);

            event.value = [BattleEnums.SwapPropertiesType.AttackSwap , Attack];
            _battle.AddBattleEvent(event);
        }
        catch(error)
        {
            console.warn(this.res+"下的 SkillEffect_2 错误", error);
        }
    }

    
}

