/*
 * create_trigger.ts
 * author: qianqians
 * 2023/10/3
 */
import * as skill from './skill/skill_base'
import * as common from './common'
import * as SkillTrigger_RoundStarts from './trigger/SkillTrigger_RoundStarts'
import * as SkillTrigger_RoundEnd from './trigger/SkillTrigger_RoundEnd'
import * as SkillTrigger_BattleBegin from './trigger/SkillTrigger_BattleBegin'
import * as SkillTrigger_BeforeAtk from './trigger/SkillTrigger_BeforeAtk'
import * as SkillTrigger_Injured from './trigger/SkillTrigger_Injured'
import * as SkillTrigger_Syncope from './trigger/SkillTrigger_Syncope'
import * as SkillTrigger_ChangeSelfLocation from './trigger/SkillTrigger_ChangeSelfLocation'
import * as SkillTrigger_ChangeEnemyLocation from './trigger/SkillTrigger_ChangeEnemyLocation'
import * as SkillTrigger_UsedSKill from './trigger/SkillTrigger_UsedSKill'
import { SkillTrigger_AllMechaniSyncope } from './trigger/SkillTrigger_AllMechaniSyncope'
import { SkillTrigger_FriendlysideInjured } from './trigger/SkillTrigger_FriendlysideInjured'
import { SkillTrigger_Kill } from './trigger/SkillTrigger_Kill'
import { SkillTrigger_CampSyncope } from './trigger/SkillTrigger_CampSyncope'
import { SkillTrigger_FrontAtk } from './trigger/SkillTrigger_FrontAtk'
import * as  SkillTrigger_AfterAtk from './trigger/SkillTrigger_AfterAtk'
import * as SkillTrigger_EnemySummon from './trigger/SkillTrigger_EnemySummon'
import * as SkillTrigger_SelfFrontNull from './trigger/SkillTrigger_SelfFrontNull';
import * as SkillTirgger_EnemyFrontNulll from './trigger/SkillTirgger_EnemyFrontNull';
import { SkillTirgger_Upgrade } from './trigger/SkillTirgger_Upgrade'

export function CreateTrigger(triggerID:number) : skill.SkillTriggerBase {
    let triggerObj: skill.SkillTriggerBase = null;

    switch (triggerID)
    {
        case common.EMSkillEvent.start_round:
            {
                triggerObj = new SkillTrigger_RoundStarts.SkillTrigger_RoundStarts();//回合开始
            }
            break;
        case common.EMSkillEvent.end_round:
            {
                triggerObj = new SkillTrigger_RoundEnd.SkillTrigger_RoundEnd();//回合结束
            }
            break;
        case common.EMSkillEvent.start_battle:
            {
                triggerObj = new SkillTrigger_BattleBegin.SkillTrigger_BattleBegin();//战斗开始
            }
            break;
        case common.EMSkillEvent.before_attack:
            {
                triggerObj = new SkillTrigger_BeforeAtk.SkillTrigger_BeforeAtk();//攻击前
            }
            break;
        case common.EMSkillEvent.after_attack:
            {
                triggerObj = new SkillTrigger_AfterAtk.SkillTrigger_AfterAtk()//攻击后（或友方攻击后）
            }
        case common.EMSkillEvent.be_hurt:
            {
                triggerObj = new SkillTrigger_Injured.SkillTrigger_Injured();//受击
            }
            break;
        case common.EMSkillEvent.syncope:
            {
                triggerObj = new SkillTrigger_Syncope.SkillTrigger_Syncope();//角色倒下
            }
            break;
        case common.EMSkillEvent.camp_summon:
            {

            }
            break;
        case common.EMSkillEvent.enemy_summon:
            {
                triggerObj = new SkillTrigger_EnemySummon.SkillTrigger_EnemySummon();//敌方召唤
            }
            break;
        case common.EMSkillEvent.change_self_location:
            {
                triggerObj = new SkillTrigger_ChangeSelfLocation.SkillTrigger_ChangeSelfLocation();//我方被推动
            }
            break;
        case common.EMSkillEvent.change_enemy_location:
            {
                triggerObj = new SkillTrigger_ChangeEnemyLocation.SkillTrigger_ChangeEnemyLocation();//敌方被推动
            }
            break;
        case common.EMSkillEvent.use_skill:
            {
                triggerObj = new SkillTrigger_UsedSKill.SkillTrigger_UsedSKill();//使用技能
            }
            break;
        case common.EMSkillEvent.front_be_hurt:
            {
                triggerObj = new SkillTrigger_FriendlysideInjured(common.Direction.Forward);//前方受击
            }
            break;
        case common.EMSkillEvent.kill:
            {
                triggerObj = new SkillTrigger_Kill();//击败敌人
            }
            break;
        case common.EMSkillEvent.camp_syncope:
            {
                triggerObj = new SkillTrigger_CampSyncope();//队友倒下
            }
            break;
        case common.EMSkillEvent.front_attack:
            {
                triggerObj = new SkillTrigger_FrontAtk();//前方攻击
            }
            break;
        case common.EMSkillEvent.all_mechanic_syncope:
            {
                //还需要传入一个battle
                triggerObj = new SkillTrigger_AllMechaniSyncope();
            }
            break;
        case common.EMSkillEvent.self_front_null://我方前排为空
            {
                triggerObj = new SkillTrigger_SelfFrontNull.SkillTrigger_SelfFrontNull();
            }
            break;
        case common.EMSkillEvent.enemy_front_null://敌方前排为空
            {
                triggerObj = new SkillTirgger_EnemyFrontNulll.SkillTirgger_EnemyFrontNull();
            }
            break;
        case common.EMSkillEvent.camp_attack3:
            {
                triggerObj = new SkillTrigger_AfterAtk.SkillTrigger_AfterAtk(3);
            }
            break;
        case common.EMSkillEvent.upgrade://升级时
            {
                triggerObj=new SkillTirgger_Upgrade();
            }
    }
    
    return triggerObj;
}