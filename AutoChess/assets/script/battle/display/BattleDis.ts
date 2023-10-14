/*
 * BattleDis.ts
 * author: Hotaru
 * 2023/10/12
 * 战斗展示类
 */
import { _decorator, instantiate, Node, Prefab } from 'cc';
import { Queue } from './Queue';
import { Battle } from '../battle';
import { Camp, EventType } from '../enums';
import { RoleDis } from './RoleDis';
import { BundleManager } from '../../bundle/BundleManager'
const { ccclass, property } = _decorator;

export class BattleDis {
    private panelNode:Node;
    public selfQueue:Queue;
    public enemyQueue:Queue;

    private battle:Battle = null;

    public constructor(battle:Battle) {
        this.battle = battle;
    }

    public async Init(father:Node) {
        let panel = await BundleManager.Instance.loadAssets("Battle", "BattlePanel") as Prefab;

        this.panelNode = instantiate(panel);
        this.selfQueue = this.panelNode.getChildByName("Self_Queue").getComponent(Queue);
        this.enemyQueue = this.panelNode.getChildByName("Enemy_Queue").getComponent(Queue);

        await this.PutRole();
        
        father.addChild(this.panelNode);
    }

    async PutRole()
    {
        let ids:number[];
        let roles=this.battle.GetSelfTeam().GetRoles();
        await this.selfQueue.SpawnRole(roles);

        roles=this.battle.GetEnemyTeam().GetRoles();
        await this.enemyQueue.SpawnRole(roles);
    }

    onAttackEvent()
    {
        this.battle.on_event.push((evs)=>
        {
            for(let ev of evs)
            {
                if(EventType.AttackInjured==ev.type && Camp.Self == ev.spellcaster.camp)
                {
                    this.selfQueue.roleList[ev.spellcaster.index].getComponent(RoleDis).Attack(ev.spellcaster.camp);
                }
                if(EventType.AttackInjured==ev.type && Camp.Enemy == ev.spellcaster.camp)
                {
                    this.enemyQueue.roleList[ev.spellcaster.index].getComponent(RoleDis).Attack(ev.spellcaster.camp);
                }
            }
        });
    }

    onChangeAtt()
    {
        this.battle.on_event.push((evs)=>
        {
            for(let ev of evs)
            {
                if(EventType.EatFood==ev.type && Camp.Self == ev.spellcaster.camp)
                {
                    this.selfQueue.roleList[ev.spellcaster.index].getComponent(RoleDis).changeAtt;
                }
                if(EventType.EatFood==ev.type && Camp.Enemy == ev.spellcaster.camp)
                {
                    this.enemyQueue.roleList[ev.spellcaster.index].getComponent(RoleDis).changeAtt;
                }
            }
        });
    }
}


