import { _decorator, Component, Node } from 'cc';
import { Event, RoleInfo, SkillTriggerBase } from '../skill/skill_base';
import * as enums from '../../other/enums';
import { Direction } from '../../serverSDK/common';
import * as battle from '../battle'

/**
 * 触发条件：前排为空或敌方前排为空
 * author: Hotaru
 * 2024/07/19添加
 * SkillTrigger_FrontNull.ts
 */
export class SkillTrigger_FrontNull extends SkillTriggerBase
{
    public res:string="battle/skill/SkillTrigger_FrontNull.ts ";

    constructor(){
        super();
    }

    CheckSkillTrigger(frameEvent: Event[], selfInfo: RoleInfo , battle?:battle.Battle): number
    {
        try
        {
            return this.CheckSkill(frameEvent,selfInfo,battle);          
        }
        catch (error) 
        {
            console.warn(this.res+"下的 CheckSkillTrigger 错误");            
        }

        return 0;
    }
    
    CheckSkill(frameEvent: Event[], selfInfo: RoleInfo , battle:battle.Battle) : number
    {
        try
        {
            let selfTeam = battle.GetSelfTeam();
            let enemyTeam= battle.GetEnemyTeam();
            for (let element of frameEvent) 
            {
                if(enums.EventType.SelfFrontNull == element.type)
                {
                    if(selfTeam.CheckFront())
                    {
                        return 1;
                    }
                }
                if(enums.EventType.EnemyFrontNull == element.type )
                {
                    if (enemyTeam.CheckFront())
                    {
                        return 1;
                    }
                }
            } 
        }
        catch(error)
        {
            console.warn(this.res+"下的 CheckSkill 错误");
        }

        return 0;
    }
}


