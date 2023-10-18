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
import { Camp, EventType } from '../../other/enums';
import { RoleDis } from './RoleDis';
import { BundleManager } from '../../bundle/BundleManager'
const { ccclass, property } = _decorator;

export class BattleDis 
{
    private panelNode:Node;
    private battleEffectImg:Node;

    public selfQueue:Queue;
    public enemyQueue:Queue;

    private battle:Battle = null;
    
    private resolve: ()=>void;

    public constructor(battle:Battle) {
        this.battle = battle;

        this.onEvent();
    }

    public async Start(father:Node) {
        let panel = await BundleManager.Instance.loadAssetsFromBundle("Battle", "BattlePanel") as Prefab;

        this.panelNode = instantiate(panel);
        this.selfQueue = this.panelNode.getChildByName("Self_Queue").getComponent(Queue);
        this.enemyQueue = this.panelNode.getChildByName("Enemy_Queue").getComponent(Queue);
        this.battleEffectImg=this.panelNode.getChildByName("BattleEffectImg");

        await this.PutRole();
        
        father.addChild(this.panelNode);

        this.battle.StartBattle();
        setTimeout(this.tickBattle.bind(this), 500);
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

    private async checkAttackEvent(evs:skill.Event[]) {
        let allAwait = [];
        for(let ev of evs)
        {
            if(EventType.AttackInjured==ev.type && Camp.Self == ev.spellcaster.camp) {
                allAwait.push(this.selfQueue.roleList[ev.spellcaster.index].getComponent(RoleDis).Attack(
                    this.selfQueue.readyLocation.position,  this.selfQueue.battleLocation.position));
            }
            if(EventType.AttackInjured==ev.type && Camp.Enemy == ev.spellcaster.camp) {
                allAwait.push(this.enemyQueue.roleList[ev.spellcaster.index].getComponent(RoleDis).Attack(
                    this.enemyQueue.readyLocation.position, this.enemyQueue.battleLocation.position));
            }

            if(EventType.RemoteInjured==ev.type){
                //判断发射者所在的阵营
                let spList=Camp.Self == ev.spellcaster.camp?this.selfQueue.roleList:this.enemyQueue.roleList;
                ev.recipient.forEach(element=>{
                    //判断每一个受到远程攻击者所在的阵营
                    let targetList=Camp.Enemy == element.camp?this.enemyQueue.roleList:this.selfQueue.roleList;
                    allAwait.push(spList[ev.spellcaster.index].getComponent(RoleDis).RemoteAttack(
                        spList[ev.spellcaster.index].getPosition(),targetList[element.index].getPosition()));
                })
            }
        }
        await Promise.all(allAwait);
    }

    showBattleEffect()
    {
        //this.battleEffectImg.active=true;
    }

    private async ChangeAttEvent(evs:skill.Event[])
    {
        let allAwait = [];
        for(let ev of evs)
        {
            if(Camp.Self == ev.spellcaster.camp)
            {
                if(EventType.RemoteInjured==ev.type || EventType.IntensifierProperties == ev.type || EventType.AttackInjured==ev.type)
                {
                    if(EventType.IntensifierProperties == ev.type)
                    {
                        this.selfQueue.roleList[ev.spellcaster.index].getComponent(RoleDis).Intensifier(ev.value);
                    }
                    allAwait.push(this.selfQueue.roleList[ev.spellcaster.index].getComponent(RoleDis).changeAtt(this.battle.GetSelfTeam().GetRole(ev.spellcaster.index)));
                }
            }
            if(Camp.Enemy==ev.spellcaster.camp)
            {
                if(EventType.RemoteInjured==ev.type || EventType.IntensifierProperties == ev.type || EventType.AttackInjured==ev.type)
                {
                    if(EventType.IntensifierProperties == ev.type)
                    {
                        this.selfQueue.roleList[ev.spellcaster.index].getComponent(RoleDis).Intensifier(ev.value);
                    }
                    allAwait.push(this.enemyQueue.roleList[ev.spellcaster.index].getComponent(RoleDis).changeAtt(this.battle.GetEnemyTeam().GetRole(ev.spellcaster.index)));
                }
            }
            
        }
        await Promise.all(allAwait);
    }

    onEvent()
    {
        this.battle.on_event = async (evs) => {
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
            
            await this.checkAttackEvent(evs);
            //await this.ChangeAttEvent(evs);

            if (this.resolve) {
                this.resolve.call(null);
                this.resolve = null;
            }

            //console.log("end on_event!");
        }
    }
}


