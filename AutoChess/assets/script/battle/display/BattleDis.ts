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
    private father:Node;

    private panelNode:Node;
    private battleEffectImg:Node;

    public selfQueue:Queue;
    public enemyQueue:Queue;

    private gmBtn:Button;

    private battle:Battle = null;
    
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
        
        this.father=father;
        father.addChild(this.panelNode);

        this.battle.StartBattle();
        setTimeout(this.tickBattle.bind(this), 500);
    }

    async tickBattle() {
        console.log("tickBattle begin!");

        while (!this.battle.CheckEndBattle()) {
            await this.battle.TickBattle();
        }
    }

    async PutRole()
    {
        let roles=this.battle.GetSelfTeam().GetRoles();
        await this.selfQueue.SpawnRole(roles);

        roles=this.battle.GetEnemyTeam().GetRoles();
        await this.enemyQueue.SpawnRole(roles);
    }

    private async checkAttackEvent(evs:skill.Event[]) {
        try {
            let allAwait = [];
            let selfAttack = false;
            let enemyAttack = false;
            for(let ev of evs)
            {
                console.log("checkAttackEvent ev:", ev)
                if (EventType.AttackInjured != ev.type)
                {
                    continue;
                }

                if (Camp.Self == ev.spellcaster.camp)
                {
                    if (!selfAttack)
                    {
                        console.log("checkAttackEvent: selfcamp " + ev.spellcaster.index);
                        let r = this.battle.GetSelfTeam().GetRole(ev.spellcaster.index);
                        allAwait.push(r.roleNode.getComponent(RoleDis).Attack(
                            this.selfQueue.readyLocation.position, this.selfQueue.battleLocation.position, ev.spellcaster.camp));
                        selfAttack = true;
                    }
                }
                else if (Camp.Enemy == ev.spellcaster.camp)
                {
                    if (!enemyAttack)
                    {
                        console.log("checkAttackEvent: enemycamp " + ev.spellcaster.index);
                        let r = this.battle.GetEnemyTeam().GetRole(ev.spellcaster.index);
                        allAwait.push(r.roleNode.getComponent(RoleDis).Attack(
                            this.enemyQueue.readyLocation.position, this.enemyQueue.battleLocation.position, ev.spellcaster.camp));
                        enemyAttack = true;
                    }
                }
            }
            console.log("checkAttackEvent allAwait:", allAwait, " evs:", evs);
            await Promise.all(allAwait);
        }
        catch(error) {
            console.error("checkAttackEvent err:", error);
        }
    }

    private async checkRemoteInjured(evs:skill.Event[]) {
        try {
            let allAwait = [];
            for(let ev of evs)
            {
                if(EventType.RemoteInjured != ev.type) {
                    continue;
                }

                console.log("checkRemoteInjured RemoteInjured");

                let spList = Camp.Self == ev.spellcaster.camp ? this.battle.GetSelfTeam() : this.battle.GetEnemyTeam();
                ev.recipient.forEach(element=>{
                    let targetList = Camp.Enemy == element.camp ? this.battle.GetEnemyTeam() : this.battle.GetSelfTeam();

                    let self = spList.GetRole(ev.spellcaster.index);
                    let target = targetList.GetRole(element.index);

                    if (self && target) {
                        allAwait.push(self.roleNode.getComponent(RoleDis).RemoteAttack(
                            self.roleNode.getPosition(), target.roleNode.getPosition(),this.father));
                    }
                });
            }
            console.log("checkRemoteInjured allAwait:", allAwait);
            await Promise.all(allAwait);
        }
        catch(error) {
            console.error("checkRemoteInjured err:", error);
        }
    }

    showBattleEffect(bool:boolean)
    {
        this.battleEffectImg.active=bool;
    }

    private async ChangeAttEvent(evs:skill.Event[])
    {
        try {
            let allAwait = [];
            for(let ev of evs)
            {
                if(EventType.RemoteInjured==ev.type || EventType.IntensifierProperties == ev.type || EventType.AttackInjured==ev.type) {
                    if(Camp.Self == ev.spellcaster.camp)
                    {
                        let r = this.battle.GetSelfTeam().GetRole(ev.spellcaster.index);
                        if (r && r.roleNode) {
                            allAwait.push(r.roleNode.getComponent(RoleDis).changeAtt());
                        }
                    }
                    if(Camp.Enemy==ev.spellcaster.camp)
                    {
                        let r = this.battle.GetEnemyTeam().GetRole(ev.spellcaster.index);
                        if (r && r.roleNode) {
                            allAwait.push(r.roleNode.getComponent(RoleDis).changeAtt());
                        }
                    }
                }
            }
            console.log("ChangeAttEvent allAwait:", allAwait);
            await Promise.all(allAwait);
        }
        catch(error) {
            console.error("ChangeAttEvent err:", error);
        }
    }

    async CheckExitEvent(evs:skill.Event[])
    {
        try {
            let allAwait = [];
            for(let ev of evs)
            {
                if(EventType.Exit != ev.type)
                {
                    continue;
                }

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
            console.log("CheckExitEvent allAwait:", allAwait);
            await Promise.all(allAwait);
        }
        catch(error) {
            console.error("CheckExitEvent err:", error);
        }
    }

    onEvent()
    {
        console.log("onEvent begin!");

        this.battle.on_event = async (evs) => {
            console.log("begin on_event! evs:", evs);

            try {
                await this.checkAttackEvent(evs);
                await this.checkRemoteInjured(evs);
                await this.ChangeAttEvent(evs);
                await this.CheckExitEvent(evs);
            }
            catch(error) {
                console.error("on_event err:", error);
            }

            console.log("end on_event!");
        }
    }
}


