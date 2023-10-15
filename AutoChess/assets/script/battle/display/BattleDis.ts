/*
 * BattleDis.ts
 * author: Hotaru
 * 2023/10/12
 * 战斗展示类
 */
import { _decorator, instantiate, Node, Prefab } from 'cc';
import { Queue } from './Queue';
import { Battle } from '../battle';
import * as skill from '../skill/skill_base'
import { Camp, EventType } from '../enums';
import { RoleDis } from './RoleDis';
import { BundleManager } from '../../bundle/BundleManager'
const { ccclass, property } = _decorator;

enum AttackState {
    Not = 0,
    AttackReady = 1,
    Attack = 2,
    AttackReduction = 3,
}

class AttackRole {
    public selfIndex = 0;
    public enemyIndex = 0;
}

export class BattleDis {
    private panelNode:Node;
    public selfQueue:Queue;
    public enemyQueue:Queue;

    private battle:Battle = null;
    
    private resolve: ()=>void;

    public constructor(battle:Battle) {
        this.battle = battle;

        this.onEvent();
    }

    public async Start(father:Node) {
        let panel = await BundleManager.Instance.loadAssets("Battle", "BattlePanel") as Prefab;

        this.panelNode = instantiate(panel);
        this.selfQueue = this.panelNode.getChildByName("Self_Queue").getComponent(Queue);
        this.enemyQueue = this.panelNode.getChildByName("Enemy_Queue").getComponent(Queue);

        await this.PutRole();
        
        father.addChild(this.panelNode);

        this.battle.StartBattle();
        setInterval(this.tickBattle.bind(this), 500);
    }

    async tickBattle() {
        while (!this.battle.CheckEndBattle()) {
            //console.log("begin TickBattle!");
            let awaiter = this.displayDone();
            this.battle.TickBattle();
            //console.log("await displayDone");
            await awaiter;
            //console.log("end TickBattle!");
        }
    }

    async PutRole()
    {
        let roles=this.battle.GetSelfTeam().GetRoles();
        await this.selfQueue.SpawnRole(roles);

        roles=this.battle.GetEnemyTeam().GetRoles();
        await this.enemyQueue.SpawnRole(roles);
    }

    private displayDone() : Promise<void> {
        return new Promise((resolve)=>{
            this.resolve = resolve;
        });
    }

    private checkAttackEvent(evs:skill.Event[]) {
        let allAwait = [];
        if (this.attackState == AttackState.Not) {
            for(let ev of evs)
            {
                if(EventType.AttackInjured==ev.type && Camp.Self == ev.spellcaster.camp)
                {
                    allAwait.push(this.selfQueue.roleList[ev.spellcaster.index].getComponent(RoleDis).AttackReady(this.selfQueue.readyLocation.position));

                    console.log("set attackState AttackState.AttackReady!");
                    this.attackState = AttackState.AttackReady;
                    this.attackRole.selfIndex = ev.spellcaster.index;
                }
                if(EventType.AttackInjured==ev.type && Camp.Enemy == ev.spellcaster.camp)
                {
                    allAwait.push(this.enemyQueue.roleList[ev.spellcaster.index].getComponent(RoleDis).AttackReady(this.enemyQueue.readyLocation.position));

                    this.attackRole.enemyIndex = ev.spellcaster.index;
                }
            }
        }
        return allAwait;
    }

    private attackState:AttackState = AttackState.Not;
    private attackRole:AttackRole = new AttackRole();
    onEvent()
    {
        this.battle.on_event.push(async (evs)=>
        {
            //console.log("begin on_event!");
            
            /*for(let ev of evs)
            {
                if (EventType.RemoteInjured == ev.type && Camp.Self == ev.spellcaster.camp) {
                    console.log(`本方${ev.spellcaster.index}远程攻击敌方[${ev.recipient}]`);
                }
                if (EventType.RemoteInjured==ev.type && Camp.Enemy == ev.spellcaster.camp) {
                    console.log(`敌方${ev.spellcaster.index}远程攻击本方[${ev.recipient}]`);
                }

                if (EventType.Summon == ev.type && Camp.Self == ev.spellcaster.camp) {
                    console.log(`本方${ev.spellcaster.index}召唤[${ev.recipient}]`);
                }
                if (EventType.Summon == ev.type && Camp.Enemy == ev.spellcaster.camp) {
                    console.log(`敌方${ev.spellcaster.index}召唤[${ev.recipient}]`);
                }

                if (EventType.ChangeLocation == ev.type && Camp.Self == ev.spellcaster.camp) {
                    console.log(`本方${ev.spellcaster.index}改变敌方位置[${ev.recipient}]`);
                }
                if (EventType.ChangeLocation == ev.type && Camp.Enemy == ev.spellcaster.camp) {
                    console.log(`敌方${ev.spellcaster.index}改变本方位置[${ev.recipient}]`);
                }

                if (EventType.SwapProperties == ev.type && Camp.Self == ev.spellcaster.camp) {
                    console.log(`本方${ev.spellcaster.index}发起交换属性[${ev.value}]`);
                }
                if (EventType.SwapProperties == ev.type && Camp.Enemy == ev.spellcaster.camp) {
                    console.log(`敌方${ev.spellcaster.index}发起交换属性[${ev.value}]`);
                }

                if(EventType.IntensifierProperties==ev.type && Camp.Self == ev.spellcaster.camp)
                {
                    for(let role of ev.recipient) {
                        this.selfQueue.roleList[role.index].getComponent(RoleDis).changeAtt();
                    }
                }
                if(EventType.IntensifierProperties==ev.type && Camp.Enemy == ev.spellcaster.camp)
                {
                    for(let role of ev.recipient) {
                        this.enemyQueue.roleList[role.index].getComponent(RoleDis).changeAtt();
                    }
                }
            }*/
            
            let allAwait = this.checkAttackEvent(evs);
            await Promise.all(allAwait);

            if (this.attackState == AttackState.AttackReady) {
                console.log("do AttackReady!");

                this.attackState = AttackState.Attack;

                let allAwait1 = []
                allAwait1.push(this.selfQueue.roleList[this.attackRole.selfIndex].getComponent(RoleDis).Attack(this.selfQueue.battleLocation.position));
                allAwait1.push(this.enemyQueue.roleList[this.attackRole.enemyIndex].getComponent(RoleDis).Attack(this.enemyQueue.battleLocation.position));

                await Promise.all(allAwait1);
            }
            else if (this.attackState == AttackState.Attack) {
                console.log("do AttackReduction!");

                this.attackState = AttackState.AttackReduction;

                let selfRoleDis = this.selfQueue.roleList[this.attackRole.selfIndex].getComponent(RoleDis);
                let enemyRoleDis = this.enemyQueue.roleList[this.attackRole.enemyIndex].getComponent(RoleDis);

                let allAwait2 = []
                allAwait2.push(selfRoleDis.AttackReduction());
                allAwait2.push(enemyRoleDis.AttackReduction());

                await Promise.all(allAwait2);

            }
            else if (this.attackState == AttackState.AttackReduction) {
                //this.attackState = AttackState.Not;
            }

            if (this.resolve) {
                this.resolve.call(null);
                this.resolve = null;
            }

            //console.log("end on_event!");
        });
    }
}


