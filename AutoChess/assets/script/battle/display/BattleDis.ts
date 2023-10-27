/*
 * BattleDis.ts
 * author: Hotaru
 * 2023/10/12
 * ս��չʾ��
 */
import { _decorator, instantiate, Node, Prefab, tween, Button } from 'cc';
import { Queue } from './Queue';
import { Battle } from '../battle';
import * as skill from '../skill/skill_base'
import { Camp, EventType } from '../../other/enums';
import { RoleDis } from './RoleDis';
import { BundleManager } from '../../bundle/BundleManager'
import { hub_call_gate_reverse_reg_client_hub_rsp } from '../../serverSDK/gate';
import { Role } from '../../serverSDK/common';
const { ccclass, property } = _decorator;

export class BattleDis 
{
    private panelNode:Node;
    private battleEffectImg:Node;

    public selfQueue:Queue;
    public enemyQueue:Queue;

    private gmBtn:Button;

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
        this.battleEffectImg.active=false;
        this.gmBtn = this.panelNode.getChildByName("gm").getComponent(Button);
        this.gmBtn.node.on(Node.EventType.TOUCH_START, async ()=>{
            console.log("gm Button!");
            let gmPanel = await BundleManager.Instance.loadAssetsFromBundle("Battle", "gm") as Prefab;
            this.panelNode.addChild(instantiate(gmPanel));
        }, this);

        await this.PutRole();
        
        father.addChild(this.panelNode);

        this.battle.StartBattle();
        setTimeout(this.tickBattle.bind(this), 500);
    }

    async tickBattle() {
        while (!this.battle.CheckEndBattle()) {
            let awaiter = this.displayDone();
            this.battle.TickBattle();
            await awaiter;
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
        let selfAttack = false;
        let enemyAttack = false;
        let r = null;
        for(let ev of evs)
        {
            if (EventType.AttackInjured == ev.type && Camp.Self == ev.spellcaster.camp)
            {
                if (!selfAttack)
                {
                    console.log("checkAttevent: selfcamp " + ev.spellcaster.index);
                    let roleNode = this.selfQueue.roleList[ev.spellcaster.index];
                    if (roleNode) {
                        console.log("checkAttevent: selfcamp id " + roleNode.getComponent(RoleDis).RoleId);
                        r = this.battle.GetSelfTeam().GetRole(ev.spellcaster.index);
                        allAwait.push(roleNode.getComponent(RoleDis).Attack(
                            this.selfQueue.readyLocation.position, this.selfQueue.battleLocation.position, ev.spellcaster.camp, r));
                        selfAttack = true;
                    } else {
                        console.log("checkAttevent: selfcamp roleList", this.selfQueue.roleList);
                    }
                }
            }
            else if (EventType.AttackInjured == ev.type && Camp.Enemy == ev.spellcaster.camp)
            {
                if (!enemyAttack)
                {
                    console.log("checkAttevent: enemycamp " + ev.spellcaster.index);
                    let enemyNode = this.enemyQueue.roleList[ev.spellcaster.index];
                    if (enemyNode) {
                        console.log("checkAttevent: enemycamp id " + enemyNode.getComponent(RoleDis).RoleId);
                        r = this.battle.GetEnemyTeam().GetRole(ev.spellcaster.index);
                        allAwait.push(enemyNode.getComponent(RoleDis).Attack(
                            this.enemyQueue.readyLocation.position, this.enemyQueue.battleLocation.position, ev.spellcaster.camp, r));
                        enemyAttack = true;
                    } else {
                        console.log("checkAttevent: enemycamp roleList", this.enemyQueue.roleList);
                    }
                }
            }
        }
        await Promise.all(allAwait);
    }

    private async checkRemoteInjured(evs:skill.Event[]) {
        let allAwait = [];
        for(let ev of evs)
        {
            if(EventType.RemoteInjured==ev.type){
                console.log("checkRemoteInjured RemoteInjured");

                let spList = Camp.Self == ev.spellcaster.camp ? this.selfQueue.roleList : this.enemyQueue.roleList;
                ev.recipient.forEach(element=>{
                    let targetList = Camp.Enemy == element.camp ? this.enemyQueue.roleList : this.selfQueue.roleList;

                    let self = spList[ev.spellcaster.index];
                    let target = targetList[element.index];

                    if (self && target) {
                        allAwait.push(self.getComponent(RoleDis).RemoteAttack(self.getPosition(), target.getPosition()));
                    }
                });
            }
        }
        await Promise.all(allAwait);
    }

    showBattleEffect(bool:boolean)
    {
        this.battleEffectImg.active=bool;
    }


    private async ChangeAttEvent(evs:skill.Event[])
    {
        let allAwait = [];
        for(let ev of evs)
        {
            if(EventType.RemoteInjured==ev.type || EventType.IntensifierProperties == ev.type || EventType.AttackInjured==ev.type) {
                if(Camp.Self == ev.spellcaster.camp)
                {
                    let r = this.battle.GetSelfTeam().GetRole(ev.spellcaster.index);
                    let node = this.selfQueue.roleList[ev.spellcaster.index];
                    if (r && node) {
                        allAwait.push(node.getComponent(RoleDis).changeAtt(r));
                    }
                }
                if(Camp.Enemy==ev.spellcaster.camp)
                {
                    let r = this.battle.GetEnemyTeam().GetRole(ev.spellcaster.index);
                    let node = this.enemyQueue.roleList[ev.spellcaster.index];
                    if (r && node) {
                        allAwait.push(node.getComponent(RoleDis).changeAtt(r));
                    }
                }
            }
        }
        await Promise.all(allAwait);
    }

    async CheckExitEvent(evs:skill.Event[])
    {
        let allAwait = [];
        for(let ev of evs)
        {
            if(EventType.Syncope == ev.type)
            {
                if(Camp.Self==ev.spellcaster.camp)
                {
                    console.log("Self Syncope index:", ev.spellcaster.index);
                    allAwait.push(this.selfQueue.RemoveRole(ev.spellcaster.index));
                }
                else if(Camp.Enemy==ev.spellcaster.camp)
                {
                    console.log("Enemy Syncope index:", ev.spellcaster.index);
                    allAwait.push(this.enemyQueue.RemoveRole(ev.spellcaster.index));
                }
            }
        }
        await Promise.all(allAwait);
    }

    onEvent()
    {
        this.battle.on_event = async (evs) => {
            //console.log("begin on_event!");
            
            await this.checkAttackEvent(evs);
            await this.checkRemoteInjured(evs);
            await this.ChangeAttEvent(evs);
            await this.CheckExitEvent(evs);

            if (this.resolve) {
                this.resolve.call(null);
                this.resolve = null;
            }

            //console.log("end on_event!");
        }
    }
}


