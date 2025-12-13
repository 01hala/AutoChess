/*
 * Skill_AddBuff.ts
 * author: Hotaru
 * 2023/08/21
 * 
 */
import { _decorator, Component, Node } from 'cc';
import { SkillBase,Event, RoleInfo, SkillTriggerBase } from './skill_base';
import * as enums from '../BattleEnums';
import { Battle } from '../battle';
import { Role } from '../role';
import { random } from '../util';
import * as config from '../config/config';

export class Skill_AddAttackCoin extends SkillBase 
{
    public res:string="battle/skill/Skill_RemoteAtk.ts/Skill_AddCoin";

    private eventSound:string;
    private count:number;

    /**
     * 
     * @param priority 优先权
     */
    constructor(priority:number, eventSound?:string ,isFetter:boolean=false)
    {
        super(priority,isFetter);
        this.eventSound = eventSound;
        this.count = 0;
    }

    UseSkill(selfInfo: RoleInfo, battle: Battle, isParallel: boolean, evs?: Event[]): void
    {
        try
        {
            if (enums.Camp.Self == selfInfo.camp && this.count < 2)
            {
                battle.addCoin++;
                this.count++;
            }
            battle.onPlayerOnShot.call(null, this.eventSound);
        }
        catch(error)
        {
            console.warn(this.res+"下的 UseSkill 错误");
        }
    }
}


