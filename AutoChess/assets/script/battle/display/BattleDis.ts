/*
 * BattleDis.ts
 * author: Hotaru
 * 2023/10/12
 * 战斗展示类
 */
import { _decorator, instantiate, Node, Prefab, tween, Button } from 'cc';
import { Queue } from './Queue';
import { Battle } from '../battle';
import * as skill from '../skill/skill_base'
import { Camp, EventType } from '../../other/enums';
import { RoleDis } from './RoleDis';
import { BundleManager } from '../../bundle/BundleManager'
import { hub_call_gate_reverse_reg_client_hub_rsp } from '../../serverSDK/gate';
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
        let selfAttack = false;
        let enemyAttack = false;
        for(let ev of evs)
        {
            if(EventType.AttackInjured==ev.type && Camp.Self == ev.spellcaster.camp) {
                if (!selfAttack) {
                    console.log("checkAttevent: eslfcamp "+this.selfQueue.roleList[0].getComponent(RoleDis).RoleId);
                    allAwait.push(this.selfQueue.roleList[0].getComponent(RoleDis).Attack(
                        this.selfQueue.readyLocation.position,  this.selfQueue.battleLocation.position,ev.spellcaster.camp));
                    selfAttack = true;
                }
            }
            else if(EventType.AttackInjured==ev.type && Camp.Enemy == ev.spellcaster.camp) {
                if (!enemyAttack) {
                    console.log("checkAttevent: enemtcamp "+this.enemyQueue.roleList[0].getComponent(RoleDis).RoleId);
                    allAwait.push(this.enemyQueue.roleList[0].getComponent(RoleDis).Attack(
                        this.enemyQueue.readyLocation.position, this.enemyQueue.battleLocation.position,ev.spellcaster.camp));
                    enemyAttack = true;
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
                //判断发射者所在的阵营
                let spList=Camp.Self == ev.spellcaster.camp?this.selfQueue.roleList:this.enemyQueue.roleList;
                ev.recipient.forEach(element=>{
                    //判断每一个受到远程攻击者所在的阵营
                    let targetList=Camp.Enemy == element.camp?this.enemyQueue.roleList:this.selfQueue.roleList;
                    allAwait.push(spList[ev.spellcaster.index].getComponent(RoleDis).RemoteAttack(
                        spList[ev.spellcaster.index].getPosition(),targetList[element.index].getPosition()));
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
                    if (r) {
                        allAwait.push(this.selfQueue.roleList[ev.spellcaster.index].getComponent(RoleDis).changeAtt(r));
                    }
                }
                if(Camp.Enemy==ev.spellcaster.camp)
                {
                    let r = this.battle.GetEnemyTeam().GetRole(ev.spellcaster.index);
                    if (r) {
                        allAwait.push(this.enemyQueue.roleList[ev.spellcaster.index].getComponent(RoleDis).changeAtt(r));
                    }
                }
            }
            
            if(EventType.IntensifierProperties == ev.type)
            {
                if(Camp.Self == ev.spellcaster.camp)
                {
                    this.selfQueue.roleList[ev.spellcaster.index].getComponent(RoleDis).Intensifier(ev.value);
                }
                if(Camp.Enemy==ev.spellcaster.camp)
                {
                    this.selfQueue.roleList[ev.spellcaster.index].getComponent(RoleDis).Intensifier(ev.value);
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
                    allAwait.push(this.selfQueue.RemoveRole(ev.spellcaster.index));
                }
                if(Camp.Enemy==ev.spellcaster.camp)
                {
                    allAwait.push(this.enemyQueue.RemoveRole(ev.spellcaster.index));
                }
            }
        }
        await Promise.all(allAwait);
    }

    async CheckShiftEvent(evs:skill.Event[])
    {
        let allAwait = [];
        for(let ev of evs)
        {
            if(EventType.BeforeAttack==ev.type)
            {
                let roles=this.battle.GetSelfTeam().GetRoles();
                allAwait.push(this.selfQueue.Shiftdis(roles));

                roles=this.battle.GetEnemyTeam().GetRoles();
                allAwait.push(this.enemyQueue.Shiftdis(roles));
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
            await this.ChangeAttEvent(evs);
            await this.CheckExitEvent(evs);
            await this.CheckShiftEvent(evs);
            await this.checkRemoteInjured(evs);

            if (this.resolve) {
                this.resolve.call(null);
                this.resolve = null;
            }

            //console.log("end on_event!");
        }
    }
}


