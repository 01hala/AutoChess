import { _decorator, Component, instantiate, Node, Prefab, UITransform, Vec3 } from 'cc';
import * as skill from '../AutoChessBattle//skill/skill_base';
import * as singleton from '../../netDriver/netSingleton';
import * as BattleEnums from '../AutoChessBattle/BattleEnums';
import { Bullet } from './Bullet';
import { delay } from '../../other/sleep';
import { BundleManager } from '../../bundle/BundleManager';
import { RoleDis } from './RoleDis';
import { Role as rRole } from '../AutoChessBattle/role';
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

    async Init()
    {
        this.remoteNode = await BundleManager.Instance.loadAssetsFromBundle("Remote", "remote") as Prefab;
    }

    UseSkill(_ev: skill.Event): Promise<void>
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
            }
            resolve(null);
        });
    }
    /**
     * 远程攻击
     * @param _ev 事件
     * @returns 回调
     * 
     * author：Hotaru
     * 2024/11/24
     */
    private async RemoteAttack(_ev: skill.Event) 
    {
        try 
        {
            let spList = BattleEnums.Camp.Self == _ev.spellcaster.camp ? singleton.netSingleton.battle.selfQueue : singleton.netSingleton.battle.enemyQueue;
            let self = spList.roleNodes[_ev.spellcaster.index];

            for (let element of _ev.recipient)
            {
                let targetList = BattleEnums.Camp.Enemy == element.camp ? singleton.netSingleton.battle.enemyQueue : singleton.netSingleton.battle.selfQueue;

                let target = targetList.roleNodes[element.index];

                if (self && target) 
                {
                    let selfpos = singleton.netSingleton.battle.panelNode.getComponent(UITransform).convertToNodeSpaceAR(self.getWorldPosition());
                    let targetpos = singleton.netSingleton.battle.panelNode.getComponent(UITransform).convertToNodeSpaceAR(target.getWorldPosition());

                    let bulletNode = instantiate(this.remoteNode);
                    bulletNode.setPosition(selfpos);
                    console.log(bulletNode);
                    bulletNode.getComponent(Bullet).Init(targetpos, null, async () =>
                    {
                        await target.getComponent(RoleDis).BeHurted(_ev.value[0]);
                        await target.getComponent(RoleDis).ChangeAtt();
                    });
                    singleton.netSingleton.battle.panelNode.addChild(bulletNode);
                }
            }

            return delay(1200, () => { });
        }
        catch (err) 
        {
            console.warn("RoleDis 下的 RemoteAttack 错误 err:" + err);
        }
    }

    /**
    * 使用增益
    * @param _ev 事件
    * @returns 回调
    * 
    * author：Hotaru
    * 2024/11/24
    */
    private async DeliveryGain(_ev: skill.Event)
    {
        try 
        {
            let spList = BattleEnums.Camp.Self == _ev.spellcaster.camp ? singleton.netSingleton.battle.selfQueue : singleton.netSingleton.battle.enemyQueue;
            let self = spList.roleNodes[_ev.spellcaster.index];

            for (let element of _ev.recipient)
            {
                if (element.index == this.index)
                {
                    return this.parent.getComponent(RoleDis).Intensifier(_ev.value);
                }
                let targetList = BattleEnums.Camp.Enemy == element.camp ? singleton.netSingleton.battle.enemyQueue : singleton.netSingleton.battle.selfQueue;
                let target = targetList.roleNodes[element.index];

                if (self && target)
                {
                    let selfpos = singleton.netSingleton.battle.panelNode.getComponent(UITransform).convertToNodeSpaceAR(self.getWorldPosition());
                    let targetpos = singleton.netSingleton.battle.panelNode.getComponent(UITransform).convertToNodeSpaceAR(target.getWorldPosition());


                    let bulletNode = instantiate(this.remoteNode);
                    bulletNode.setPosition(selfpos);
                    console.log(bulletNode);
                    bulletNode.getComponent(Bullet).Init(targetpos, true, () =>
                    {
                        switch (_ev.type)
                        {
                            case BattleEnums.EventType.IntensifierProperties:
                                {
                                    target.getComponent(RoleDis).Intensifier(_ev.value);
                                }
                                break;
                            case BattleEnums.EventType.IntensifierExp:
                                {
                                    target.getComponent(RoleDis).IntensifierExp(_ev.value[0]);
                                }
                                break;
                        }
                    });
                    singleton.netSingleton.battle.panelNode.addChild(bulletNode);
                }
            }
            return delay(700, () => { });
        }
        catch (err) 
        {
            console.warn("RoleDis 下的 DeliveryGain 错误 err:" + err);
        }
    }

    //召唤
    private Summon(_ev: skill.Event)
    {
        for (let element of _ev.recipient)
        {
            let tmp: rRole;
            tmp = new rRole(null, element.index, element.id, 1, 0, element.camp, element.properties, null, 0);
            let targetTeam = BattleEnums.Camp.Self == element.camp ? singleton.netSingleton.battle.battleCentre.GetSelfTeam() : singleton.netSingleton.battle.battleCentre.GetEnemyTeam();
            targetTeam.AddRole(tmp);
            let queue = BattleEnums.Camp.Self == element.camp ? singleton.netSingleton.battle.selfQueue : singleton.netSingleton.battle.enemyQueue;
            queue.SummonRole([tmp], _ev.spellcaster);
        }
    }
    //换位
    private TransPosition(_ev: skill.Event)
    {
        let queue = BattleEnums.Camp.Self == _ev.spellcaster.camp ? singleton.netSingleton.battle.selfQueue : singleton.netSingleton.battle.enemyQueue;
        queue.SwitchRolePos(_ev.recipient, _ev.value);
    }
    //交换属性
    private SwapProperties(_ev: skill.Event)
    {
        let queue = BattleEnums.Camp.Self == _ev.spellcaster.camp ? singleton.netSingleton.battle.selfQueue : singleton.netSingleton.battle.enemyQueue;
        queue.GetRole(_ev.spellcaster.index).getComponent(RoleDis).ChangeAtt();
    }
}


