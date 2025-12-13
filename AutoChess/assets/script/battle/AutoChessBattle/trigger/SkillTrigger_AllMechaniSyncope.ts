/*
 * SkillTrigger_AllSyncope.ts
 * author: Guanliu
 * 2023/12/20
 * 检测是否是场上某一类型角色全部昏迷（主要用于羁绊）
 */
import { _decorator, Component, debug, log, Node, random } from 'cc';
import { SkillBase,Event, RoleInfo,SkillTriggerBase } from '../skill/skill_base';
import * as enums from '../BattleEnums';
import { Battle } from '../battle';
import { Fetters } from '../common';
import { Role } from '../role';
import * as config from '../config/config'

export class SkillTrigger_AllMechaniSyncope extends SkillTriggerBase {
    public res:string="battle/skill/SkillTrigger_AllSyncope";
    //public EventType:EventType=EventType.Syncope;
    private targetFetterID:number;
    
    constructor(){
        super();
        this.targetFetterID = config.config.MechanicFetters;
    }

    override CheckSkillTrigger(frameEvent: Event[], selfInfo: RoleInfo,battle?: Battle): number
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

    private checkHasMechaniFetter(selfInfo: RoleInfo, battle: Battle) {
        let evTeam = selfInfo.camp == enums.Camp.Self ? battle.GetSelfTeam() : battle.GetEnemyTeam();
        for (let f of evTeam.GetBattleData().FettersList) {
            if (f.fetters_id == config.config.MechanicFetters && f.fetters_level > 0) {
                return true;
            }
        }
        return false;
    }

    private checkAllMechaniSyncope(selfInfo: RoleInfo, battle: Battle) {
        let evTeam = selfInfo.camp == enums.Camp.Self ? battle.GetSelfTeam() : battle.GetEnemyTeam();
        for (let r of evTeam.GetRoles()) {
            if (r != null && r.fetter.fetters_id == config.config.MechanicFetters && !r.CheckDead()) {
                return false;
            }
        }
        return true;
    }

    private  CheckSkill(frameEvent: Event[], selfInfo: RoleInfo, battle: Battle): number
    {
        try
        {
            if (!this.checkHasMechaniFetter(selfInfo, battle)) {
                return 1;
            }

            if (this.checkAllMechaniSyncope(selfInfo, battle)) {
                return 1;
            }
        }
        catch (error) 
        {
            console.warn(this.res+"下的 CheckSkill 错误");
        }

        return 0;
    }
}


