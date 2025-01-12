import { _decorator, Component, instantiate, Node, Prefab, UITransform, Vec3 } from 'cc';
import * as skill from '../AutoChessBattle//skill/skill_base';
import * as singleton from '../../netDriver/netSingleton';
import * as BattleEnums from '../AutoChessBattle/BattleEnums';
import { Bullet, BulletInfo } from './Bullet';
import { delay } from '../../other/sleep';
import { BundleManager } from '../../bundle/BundleManager';
import { RoleDis } from './RoleDis';
import { Role as rRole } from '../AutoChessBattle/role';
import { spEffectObj } from '../../other/SpEffect';
const { ccclass, property } = _decorator;

export class SkillDis
{
    //父节点
    private parent: Node;
    //自身位置
    private index: number;
    //子弹预制体
    private remoteNode: Prefab;

    constructor(_parent: Node, _index: number)
    {
        this.parent = _parent;
        this.index = _index;
    }

    public async Init()
    {

    }

    public UseSkill(_ev: skill.Event): Promise<void>
    {
        return new Promise(async (resolve) =>
        {
            switch (_ev.type)
            {
                case BattleEnums.EventType.RemoteInjured:
                    {
                        await this.RemoteAttack(_ev);
                    }
                    break;
                case BattleEnums.EventType.IntensifierExp:
                case BattleEnums.EventType.IntensifierProperties:
                    {
                        await this.DeliveryGain(_ev);
                    }
                    break;
                case BattleEnums.EventType.Summon:
                    {
                        await this.Summon(_ev);
                    }
                    break;
                case BattleEnums.EventType.ChangeLocation:
                    {
                        await this.TransPosition(_ev);
                    }
                    break;
                case BattleEnums.EventType.SwapProperties:
                    {
                        await this.SwapProperties(_ev);
                    }
                    break;
                case BattleEnums.EventType.AddBuff:
                case BattleEnums.EventType.GiveShields:
                    {
                        await this.AddBuff(_ev);
                    }
                    break;
                case BattleEnums.EventType.SubstituteDamage:
                    {
                        await this.SubstituteDamage(_ev);
                    }
                    break;
            }
            resolve();
        });
    }
    /**
     * -远程攻击-
     * @param _ev 事件
     * @returns 回调
     * 
     * author：Hotaru
     * 2024/11/24
     */
    private async RemoteAttack(_ev: skill.Event) 
    {
        return new Promise<void>(async (resolve, reject) =>
        {
            try 
            {
                let spList = BattleEnums.Camp.Self == _ev.spellcaster.camp ? singleton.netSingleton.battle.selfQueue : singleton.netSingleton.battle.enemyQueue;
                let self = this.parent;
                let selfpos = singleton.netSingleton.battle.panelNode.getComponent(UITransform).convertToNodeSpaceAR(self.getWorldPosition());

                if(_ev.objCount>=6)
                {
                    await this.RemoteAttackColony(_ev).then(resolve);
                }

                for (let element of _ev.recipient)
                {
                    let targetList = BattleEnums.Camp.Enemy == element.camp ? singleton.netSingleton.battle.enemyQueue : singleton.netSingleton.battle.selfQueue;
                    let target = targetList.roleNodes[element.index];

                    if (self && target) 
                    {
                        let targetpos = singleton.netSingleton.battle.panelNode.getComponent(UITransform).convertToNodeSpaceAR(target.getWorldPosition());

                        await this.parent.getComponent(RoleDis).OnSkill(_ev.isFetter,new BulletInfo(selfpos,targetpos,false)).then(async ()=>
                        {
                            await target.getComponent(RoleDis).BeHurted(_ev);
                            await target.getComponent(RoleDis).ChangeAtt();
                        });
                    }
                }
                resolve();
            }
            catch (err) 
            {
                console.error("SkillDis 下的 RemoteAttack 错误 err:" + err);
                reject();
            }
        })
    }
    /**
     * -群伤远程攻击-
     * @param _ev 
     */
    private async RemoteAttackColony(_ev: skill.Event)
    {
        return new Promise<void>(async (resolve, reject)=>
        {
            try
            {
                let spList = BattleEnums.Camp.Self == _ev.spellcaster.camp ? singleton.netSingleton.battle.selfQueue : singleton.netSingleton.battle.enemyQueue;
                let self = this.parent;
                
                let allAwait=[];

                for (let element of _ev.recipient)
                {
                    let targetList = BattleEnums.Camp.Enemy == element.camp ? singleton.netSingleton.battle.enemyQueue : singleton.netSingleton.battle.selfQueue;

                    let target = targetList.roleNodes[element.index];

                    if (self && target) 
                    {
                        allAwait.push(new Promise<void>(async (resolve)=>
                        {
                            await target.getComponent(RoleDis).BeHurted(_ev);
                            await target.getComponent(RoleDis).ChangeAtt();
                            resolve();
                        }));
                    }
                }
                await this.parent.getComponent(RoleDis).OnSkill(_ev.isFetter).then(()=>
                {
                    Promise.all(allAwait);
                });
                resolve();
            }
            catch(err)
            {
                console.error("SkillDis 下的 RemoteAttackColony 错误 err:" + err);
                reject();
            }
        })
    }
    /**
    * -使用增益-
    * @param _ev 事件
    * 
    * author：Hotaru
    * 2024/11/24
    */
    private async DeliveryGain(_ev: skill.Event)
    {
        return new Promise<void>(async (resolve, reject) =>
        {
            try
            {
                let self = this.parent;
                let allAwait=[];
                let isColony=_ev.recipient.length>1?true:false;

                for (let element of _ev.recipient)
                {
                    if (element.index == this.index && _ev.recipient.length<=1)
                    {
                        await this.parent.getComponent(RoleDis).Intensifier(_ev.value, false);
                        break;
                    }
                    let targetList = BattleEnums.Camp.Enemy == element.camp ? singleton.netSingleton.battle.enemyQueue : singleton.netSingleton.battle.selfQueue;
                    let target = targetList.roleNodes[element.index];

                    if (self && target)
                    {
                        let selfpos = singleton.netSingleton.battle.panelNode.getComponent(UITransform).convertToNodeSpaceAR(self.getWorldPosition());
                        let targetpos = singleton.netSingleton.battle.panelNode.getComponent(UITransform).convertToNodeSpaceAR(target.getWorldPosition());

                        let style=_ev.value[0]?1:3;
                        if(BattleEnums.EventType.IntensifierExp ==_ev.type)
                        {
                            style=2;
                        }

                        allAwait.push(this.parent.getComponent(RoleDis).OnSkill(_ev.isFetter,new BulletInfo(selfpos,targetpos,true,style)).then(async ()=>
                        {
                            switch (_ev.type)
                            {
                                case BattleEnums.EventType.IntensifierProperties:
                                    {
                                        await target.getComponent(RoleDis).Intensifier(_ev.value, isColony);
                                    }
                                    break;
                                case BattleEnums.EventType.IntensifierExp:
                                    {
                                        await target.getComponent(RoleDis).IntensifierExp(_ev.value[0],isColony);
                                    }
                                    break;
                            }
                        }));
                    }
                }
                if(allAwait.length>0)
                {
                   await Promise.all(allAwait);
                }
                resolve();
            } catch (error)
            {
                console.error("SkillDis 下的 DeliveryGain 错误 err:" + error);
                reject();
            }
        })
        //return delay(1200, () => { });
    }

    /**
     * -召唤-
     * @param _ev 事件
     * 
     * @author：Hotaru
     * @time 2024/11/24
     */
    private Summon(_ev: skill.Event)
    {
        return new Promise<void>(async (resolve, reject) =>
        {
            try
            {
                for (let element of _ev.recipient)
                {
                    let tmp: rRole;
                    tmp = new rRole(null, element.index, element.id, 1, 0, element.camp, element.properties, null, 0);
                    let targetTeam = BattleEnums.Camp.Self == element.camp ? singleton.netSingleton.battle.battleCentre.GetSelfTeam() : singleton.netSingleton.battle.battleCentre.GetEnemyTeam();
                    targetTeam.AddRole(tmp);
                    let queue = BattleEnums.Camp.Self == element.camp ? singleton.netSingleton.battle.selfQueue : singleton.netSingleton.battle.enemyQueue;
                    await queue.SummonRole([tmp], _ev.spellcaster);
                    resolve();
                }
            } catch (error)
            {
                console.error("SkillDis 下的 Summon 错误 err:" + error);
                reject();
            }
        })
    }
    /**
     * -换位-
     * @param _ev 事件
     * 
     * @author：Hotaru
     * @time 2024/11/24
     */
    private TransPosition(_ev: skill.Event)
    {
        return new Promise<void>(async (resolve, reject) =>
        {
            try
            {
                let queue = BattleEnums.Camp.Self == _ev.spellcaster.camp ? singleton.netSingleton.battle.enemyQueue : singleton.netSingleton.battle.selfQueue;
                await queue.SwitchRolePos(_ev.recipient, _ev.value);
                resolve();
            } catch (error)
            {
                console.error("SkillDis 下的 TransPosition 错误 err:" + error);
                reject();
            }
        })
    }
    /**
     * -交换属性-
     * @param _ev 事件
     * 
     * @author：Hotaru
     * @time 2024/11/24
     */
    private SwapProperties(_ev: skill.Event)
    {
        return new Promise<void>(async (resolve, reject) =>
        {
            try
            {
                await this.parent.getComponent(RoleDis).SwapProperties(_ev.value[0]);
                resolve();
            } catch (error)
            {
                console.error("SkillDis 下的 SwapProperties 错误 err:" + error);
                reject();
            }
        })
    }

    /**
     * -加buff-
     * @param _ev 事件
     * 
     * @author：Hotaru
     * @time 2024/11/24
     */
    private AddBuff(_ev:skill.Event)
    {
        new Promise<void>(async (resolve, reject) =>
        {
            try
            {
                let spList = BattleEnums.Camp.Self == _ev.spellcaster.camp ? singleton.netSingleton.battle.selfQueue : singleton.netSingleton.battle.enemyQueue;

                for (let element of _ev.recipient)
                {
                    await spList.roleNodes[element.index].getComponent(RoleDis).ReceptionBuff(_ev.value[0]);
                }
                resolve();
            } catch (error)
            {
                console.error("SkillDis 下的 AddBuff 错误 err:" + error);
                reject();
            }
        })
    }
    /**
     * -转移伤害-
     * @param _ev 事件
     */
    private SubstituteDamage(_ev:skill.Event)
    {
        return new Promise<void>(async (resolve, reject) =>
        {
            try
            {
                let spList = singleton.netSingleton.battle.selfQueue;

                for (let element of _ev.recipient)
                {
                    if (spList.roleNodes[element.index]) {
                        await spList.roleNodes[element.index].getComponent(RoleDis).DeflexionDamage();
                    }
                }
                if (this.parent) {
                    await this.parent.getComponent(RoleDis).SubstituteDamage();
                }
                resolve();
            } catch (error)
            {
                console.error("SkillDis 下的 SubstituteDamage 错误 err:" + error);
                reject();
            }
        });
    }
}


