/*
 * Skill_ChangePosition.ts
 * author: 未知
 * 2024/08/19
 * 交换位置
 */
import { _decorator, Component, error, Node } from 'cc';
import { SkillBase,Event, RoleInfo, SkillTriggerBase } from './skill_base';
import * as BattleEnums from '../BattleEnums';
import { Battle } from '../battle';
import { Role } from '../role';
import { random } from '../util';
import { Team } from '../team';
const { ccclass, property } = _decorator;

@ccclass('Skill_ChangeLocation')
export class Skill_ChangeLocation extends SkillBase {
    public res:string="battle/skill/Skill_ChangeLocation.ts";

    private index1:number;
    private index2:number;
    private changeType : BattleEnums.ChangeLocationType;
    private eventSound:string;

    private count=0;

    constructor(priority:number, changeType : BattleEnums.ChangeLocationType, change1:number, change2:number,eventSound?:string,isfetter:boolean=false)
    {
        super(priority,isfetter);

        this.changeType = changeType;
        this.index1=change1;
        this.index2=change2;
        if(null!=eventSound){
            this.eventSound=eventSound;
        } 
    }


    UseSkill(selfInfo: RoleInfo, battle: Battle,isParallel:boolean): void
    {
        try
        {
            let event: Event = new Event();
            event.isParallel = isParallel;
            event.spellcaster = selfInfo;
            event.type = BattleEnums.EventType.UsedSkill;
            battle.AddBattleEvent(event);

            if(BattleEnums.ChangeLocationType.AssignChange == this.changeType)
            {
               this.SkillEffect_1(selfInfo,battle,isParallel);
            }
            if(BattleEnums.ChangeLocationType.RandomChange == this.changeType)
            {
                this.SkillEffect_2(selfInfo,battle,isParallel);
            }
            if(BattleEnums.ChangeLocationType.BackChange == this.changeType && this.count<1)
            {
                this.SkillEffect_3(selfInfo,battle,isParallel);
                this.count++;
            }
            battle.onPlayerOnShot.call(null, this.eventSound);
        }
        catch(e)
        {
            console.error(this.res + "下的" +  e + "异常");
        }
    }

    SkillEffect_1(_selfInfo: RoleInfo, _battle: Battle,_isPar:boolean)        //指定位置
    {
        try
        {
            let event : Event = new Event();
            event.type = BattleEnums.EventType.ChangeLocation;
            event.spellcaster = _selfInfo;
            event.recipient = [];
            event.value = [];
            event.isParallel=_isPar;
            event.isFetter=this.isFetter;
    
            let originalRoleList:Team = null;
            if(BattleEnums.Camp.Self==_selfInfo.camp)
            {
                originalRoleList=_battle.GetEnemyTeam();
            }
            if(BattleEnums.Camp.Enemy==_selfInfo.camp)
            {
                originalRoleList=_battle.GetSelfTeam();
            }
    
            //获取要交换的两个角色
            let begin = originalRoleList.GetRole(this.index1);
            let end = originalRoleList.GetRole(this.index2);
            let recipient;

            if(begin)
            {
                recipient = new RoleInfo();
                recipient.index = this.index1;
                recipient.camp = begin.selfCamp;
                event.recipient.push(recipient);
            }
           
            if(end)
            {
                recipient = new RoleInfo();
                recipient.index = this.index2;
                recipient.camp = end.selfCamp;
                event.recipient.push(recipient);
            }
            
    
            //提交要交换的位置信息
            event.value.push(this.index2);
            event.value.push(this.index1);
    
            if (BattleEnums.Camp.Self == _selfInfo.camp)
            {
                _battle.GetEnemyTeam().SwitchRole(begin.index, end.index);
            }
            if (BattleEnums.Camp.Enemy == _selfInfo.camp)
            {
                _battle.GetSelfTeam().SwitchRole(begin.index, end.index);
            }
    
            _battle.AddBattleEvent(event);
        }
        catch(error)
        {
            console.warn(this.res+"下的 SkillEffect_1 错误 ",error);
        }
    }

    SkillEffect_2(_selfInfo: RoleInfo, _battle: Battle,_isPar:boolean)      //随机位置
    {
        try
        {
            let event: Event = new Event();
            event.type = BattleEnums.EventType.ChangeLocation;
            event.spellcaster = _selfInfo;
            event.recipient = [];
            event.value = [];
            event.isParallel = _isPar;
            event.isFetter=this.isFetter;
    
            let originalRoleList:Role[];
            switch(_selfInfo.camp)
            {
                case BattleEnums.Camp.Self:
                    {
                        originalRoleList=_battle.GetEnemyTeam().GetRoles();
                    }
                    break;
                case BattleEnums.Camp.Enemy:
                    {
                        originalRoleList=_battle.GetSelfTeam().GetRoles();
                    }
                    break;
            }
    
            if(originalRoleList.length<1)
            {
                return;
            }

            
            let recipientRoles: number[] = [];
            let randomRoles: number[] = [];
            while (recipientRoles.length < 2 && recipientRoles.length < originalRoleList.length && randomRoles.length < originalRoleList.length)
            {
                let index = random(0, originalRoleList.length);
                if (randomRoles.includes(index))
                {
                    continue;
                }
                if(!originalRoleList[index].CheckDead())
                {
                    recipientRoles.push(index);
                }
                randomRoles.push(index);
            }
            console.log("尝试换位",recipientRoles);

            if (recipientRoles.length < 2) {
                return;
            }

            switch (_selfInfo.camp)
            {
                case BattleEnums.Camp.Self:
                    {
                        originalRoleList = _battle.GetEnemyTeam().GetRoles();
                    }
                    break;
                case BattleEnums.Camp.Enemy:
                    {
                        originalRoleList = _battle.GetSelfTeam().GetRoles();
                    }
                    break;
            }

            let begin = originalRoleList[recipientRoles[0]];
            let end = originalRoleList[recipientRoles[1]];
    
            let recipient = new RoleInfo();
            recipient.index = begin.index;
            recipient.camp = begin.selfCamp;
            event.recipient.push(recipient);
    
            recipient = new RoleInfo();
            recipient.index = end.index;
            recipient.camp = end.selfCamp;
            event.recipient.push(recipient);
    
            event.value.push(end.index);
            event.value.push(begin.index);
    
            if (BattleEnums.Camp.Self == _selfInfo.camp)
            {
                _battle.GetEnemyTeam().SwitchRole(begin.index, end.index);
            }
            if (BattleEnums.Camp.Enemy == _selfInfo.camp)
            {
                _battle.GetSelfTeam().SwitchRole(begin.index, end.index);
            }
    
            _battle.AddBattleEvent(event);
            console.log("换位完成");
        }
        catch(error)
        {
            console.warn(this.res+"下的 SkillEffect_2 错误 ",error);
        }
    }

    SkillEffect_3(_selfInfo: RoleInfo, _battle: Battle,_isPar:boolean)      //随机后排推到前排
    {
        let event: Event = new Event();
        event.type = BattleEnums.EventType.ChangeLocation;
        event.spellcaster = _selfInfo;
        event.recipient = [];
        event.value = [];
        event.isParallel = _isPar;
        event.isFetter=this.isFetter;

        let originalRoleList: Team = null;
        if (BattleEnums.Camp.Self == _selfInfo.camp)
        {
            originalRoleList = _battle.GetEnemyTeam();
        }
        if (BattleEnums.Camp.Enemy == _selfInfo.camp)
        {
            originalRoleList = _battle.GetSelfTeam();
        }

        let _indexs=[3,4,5];
        let _index1 = _indexs[random(0, 2)];
        let _index2=_index1-3;

        let begin = originalRoleList.GetRole(_index1);
        if(null == begin)
        {
            return;
        }
        let end = originalRoleList.GetRole(_index2);

        let recipient;

        if (begin)
        {
            recipient = new RoleInfo();
            recipient.index = _index1;
            recipient.camp = begin.selfCamp;
            event.recipient.push(recipient);
        }

        if (end)
        {
            recipient = new RoleInfo();
            recipient.index = _index2;
            recipient.camp = end.selfCamp;
            event.recipient.push(recipient);
        }

        event.value.push(_index2);
        event.value.push(_index1);

        if (BattleEnums.Camp.Self == _selfInfo.camp)
        {
            _battle.GetEnemyTeam().SwitchRole(_index1, _index2);
        }
        if (BattleEnums.Camp.Enemy == _selfInfo.camp)
        {
            _battle.GetSelfTeam().SwitchRole(_index1, _index2);
        }

        _battle.AddBattleEvent(event);
    }
}



