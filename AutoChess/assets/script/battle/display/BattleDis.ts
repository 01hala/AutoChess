/*
 * BattleDis.ts
 * author: Hotaru
 * 2023/10/12
 * 战斗展示类
 */
import { _decorator, instantiate, Node, Prefab, Label, Button, UITransform } from 'cc';
import { Queue } from './Queue';
import { Battle } from '../battle';
import * as skill from '../skill/skill_base'
import { Camp, EventType } from '../../other/enums';
import { sleep } from '../../other/sleep'
import { RoleDis } from './RoleDis';
import { BundleManager } from '../../bundle/BundleManager'
import { hub_call_gate_reverse_reg_client_hub_rsp } from '../../serverSDK/gate';
import { Role } from '../../serverSDK/common';
import { netSingleton } from '../../netDriver/netSingleton';
import { battle_victory } from '../../serverSDK/ccallmatch';
const { ccclass, property } = _decorator;

export class BattleDis 
{
    //父级对象
    public father:Node;
    //顶级面板
    private panelNode:Node;
    //战斗效果
    private battleEffectImg:Node;
    //敌我队列
    public selfQueue:Queue;
    public enemyQueue:Queue;

    //胜利或者失败
    private victory:Node;

    private gmBtn:Button;
    private pauseBtn:Button;
    private puase:boolean = false;

    //战斗系统类
    public battle:Battle = null;
    
    public constructor(battle:Battle) 
    {
        this.battle = battle;
        this.onEvent();
    }

    public destory() {
        this.panelNode.destroy();
    }

    public async Start(father:Node) 
    {
        try
        {
            console.log("battledis start");
            let panel = await BundleManager.Instance.loadAssetsFromBundle("Battle", "BattlePanel") as Prefab;
            this.panelNode = instantiate(panel);

            this.selfQueue = this.panelNode.getChildByName("Self_Queue").getComponent(Queue);
            this.enemyQueue = this.panelNode.getChildByName("Enemy_Queue").getComponent(Queue);

            this.battleEffectImg=this.panelNode.getChildByName("BattleEffectImg");
            this.battleEffectImg.active=false;

            this.gmBtn = this.panelNode.getChildByName("gm").getComponent(Button);
            this.gmBtn.node.on(Node.EventType.TOUCH_START, async ()=>{
                console.log("gm Button!");
                let gmPrefab = await BundleManager.Instance.loadAssetsFromBundle("Battle", "gm") as Prefab;
                let gmPanel = instantiate(gmPrefab);
                this.panelNode.addChild(gmPanel);
            }, this);

            let pauseNode = this.panelNode.getChildByName("pause");
            this.pauseBtn = pauseNode.getComponent(Button);
            this.pauseBtn.node.on(Node.EventType.TOUCH_START, async ()=>{
                console.log("pause Button!");
                this.puase = !this.puase;
                if (this.puase) {
                    pauseNode.getChildByName("Label").getComponent(Label).string = "run";
                }
                else {    
                    pauseNode.getChildByName("Label").getComponent(Label).string = "pause";
                }
            }, this);

            this.victory = this.panelNode.getChildByName("victory");
            this.victory.active = false;
    
            await this.PutRole();
            this.father=father;
            father.addChild(this.panelNode);
            this.battle.StartBattle();
            setTimeout(this.TickBattle.bind(this), 500);
        }
        catch(error)
        {
            console.error("BattleDis 下的 Start 错误 err:", error);
        }
        
    }

    async TickBattle() 
    {
        try
        {
            while (!this.battle.CheckEndBattle()) 
            {
                await this.battle.TickBattle();

                while (this.puase) {
                    await sleep(200);
                }
            }

            await this.battle.TickBattle();
            while (!this.battle.CheckEndBattle()) 
            {
                await this.battle.TickBattle();
            }

            this.victory.active = true;
            let is_victory = battle_victory.tie;
            if (this.battle.GetWinCamp() == Camp.Self) {
                is_victory = battle_victory.victory;
            }
            else if (this.battle.GetWinCamp() == Camp.Enemy) {
                is_victory = battle_victory.faild;
            }

            if ((is_victory == battle_victory.victory && (this.battle.victory + 1) < 10) ||
                (is_victory == battle_victory.faild && (this.battle.faild - 1) > 0))
            {
                this.victory.getComponent(Label).string = (is_victory == battle_victory.victory) ? "战斗胜利!" : "战斗失败!";
            }
            else if (is_victory == battle_victory.tie) {
                this.victory.getComponent(Label).string = "战斗平局!";
            }

            await sleep(4000);

            netSingleton.game.confirm_round_victory(is_victory);
        }
        catch(error)
        {
            console.error("BattleDis 下的 TickBattle 错误 err:", error);
        }
        
    }

    async SetGameVictory(is_victory:boolean) {
        this.victory.active = true;
        this.victory.getComponent(Label).string = is_victory ? "游戏胜利!" : "游戏失败!";

        await sleep(4000);
    }

    async PutRole()
    {
        try
        {
            let roles=this.battle.GetSelfTeam().GetRoles();
            await this.selfQueue.InitRole(roles);
    
            roles=this.battle.GetEnemyTeam().GetRoles();
            await this.enemyQueue.InitRole(roles);
        }
        catch(error)
        {
            console.error("BattleDis 下的 PutRole 错误 err:", error);
        }
        
    }

    showBattleEffect(bool:boolean)
    {
        this.battleEffectImg.active=bool;
    }

    /*
     * 
     * 以下为事件响应函数
     * 
     */

    private async CheckAttackEvent(evs:skill.Event[]) 
    {
        try 
        {
            let allAwait = [];
            let selfAttack = false;
            let enemyAttack = false;
            for(let ev of evs)
            {
                //console.log("checkAttackEvent ev:", ev)
                if (EventType.AttackInjured != ev.type)
                {
                    continue;
                }

                if (Camp.Self == ev.spellcaster.camp)
                {
                    if (!selfAttack)
                    {
                        //console.log("checkAttackEvent: selfcamp " + ev.spellcaster.index);
                        //let r = this.battle.GetSelfTeam().GetRole(ev.spellcaster.index);
                        let roleNode = this.selfQueue.roleNodes[ev.spellcaster.index];
                        allAwait.push(roleNode.getComponent(RoleDis).Attack(
                            this.selfQueue.readyLocation.position, this.selfQueue.battleLocation.position, ev.spellcaster.camp));
                        selfAttack = true;
                    }
                }
                else if (Camp.Enemy == ev.spellcaster.camp)
                {
                    if (!enemyAttack)
                    {
                        //let r = this.battle.GetEnemyTeam().GetRole(ev.spellcaster.index);
                        let roleNode = this.enemyQueue.roleNodes[ev.spellcaster.index];
                        allAwait.push(roleNode.getComponent(RoleDis).Attack(
                            this.enemyQueue.readyLocation.position, this.enemyQueue.battleLocation.position, ev.spellcaster.camp));
                        enemyAttack = true;
                    }
                }
            }
            //console.log("checkAttackEvent allAwait:", allAwait, " evs:", evs);
            await Promise.all(allAwait);
        }
        catch(error) 
        {
            console.error("BattleDis 下的 CheckAttackEvent 错误 err:", error);
        }
    }

    private async CheckRemoteInjured(evs:skill.Event[]) 
    {
        try 
        {
            let allAwait = [];
            for(let ev of evs)
            {
                if(EventType.RemoteInjured != ev.type) 
                {
                    continue;
                }

                //console.log("checkRemoteInjured RemoteInjured");

                let spList = Camp.Self == ev.spellcaster.camp ? this.selfQueue : this.enemyQueue;
                ev.recipient.forEach(element=>{
                    let targetList = Camp.Enemy == element.camp ? this.enemyQueue : this.selfQueue;

                    let self = spList.roleNodes[ev.spellcaster.index];
                    let target = targetList.roleNodes[element.index];

                    if (self && target) 
                    {                
                        let selfpos=this.panelNode.getComponent(UITransform).convertToNodeSpaceAR(self.getWorldPosition());
                        let targetpos=this.panelNode.getComponent(UITransform).convertToNodeSpaceAR(target.getWorldPosition());
                        allAwait.push(self.getComponent(RoleDis).RemoteAttack(
                            selfpos, targetpos,this.father));
                    }
                });
            }
            //console.log("checkRemoteInjured allAwait:", allAwait);
            await Promise.all(allAwait);
        }
        catch(error) 
        {
            console.error("BattleDis 下的 CheckRemoteInjured 错误 err:", error);
        }
    }

    private async CheckSummonEvent(evs:skill.Event[]) 
    {
        try 
        {
            let allAwait = [];
            for(let ev of evs)
            {
                if(EventType.Summon != ev.type) 
                {
                    continue;
                }

                //释放技能者所在阵营列表
                let roleList = Camp.Self == ev.spellcaster.camp ? this.battle.GetSelfTeam().GetRoles() : this.battle.GetEnemyTeam().GetRoles();
                
                ev.recipient.forEach(element=>{
                    this.selfQueue.SummonRole(roleList,ev.spellcaster);
                });
            }
            await Promise.all(allAwait);
        }
        catch(error) 
        {
            console.error("BattleDis 下的 CheckSummon 错误 err:", error);
        }
    }

    private async CheckAttGainEvent(evs:skill.Event[]) 
    {
        try 
        {
            let allAwait = [];
            for(let ev of evs)
            {
                if(EventType.IntensifierProperties != ev.type) 
                {
                    continue;
                }

                //受到增益者            
                ev.recipient.forEach(element=>{
                    if(Camp.Self==element.camp){
                        allAwait.push(this.selfQueue.roleNodes[element.index].getComponent(RoleDis).Intensifier(ev.value));
                    }
                    else{
                        allAwait.push(this.enemyQueue.roleNodes[element.index].getComponent(RoleDis).Intensifier(ev.value));
                    }            
                });
            }
            await Promise.all(allAwait);
        }
        catch(error) 
        {
            console.error("BattleDis 下的 CheckAttGainEvent 错误 err:", error);
        }
    }

    private async ChangeAttEvent(evs:skill.Event[])
    {
        try 
        {
            let allAwait = [];
            let r:Node = null;
            for(let ev of evs)
            {
                if(EventType.RemoteInjured==ev.type || EventType.IntensifierProperties == ev.type || EventType.AttackInjured==ev.type) 
                {
                    if(Camp.Self == ev.spellcaster.camp)
                    {
                        if(EventType.RemoteInjured==ev.type)
                        {
                            for(let t of ev.recipient)
                            {
                                r = this.enemyQueue.roleNodes[t.index];
                                //console.warn("敌方role",r.index);
                                if(r)
                                {
                                    
                                    //console.warn("敌方角色远程受伤表现");
                                    allAwait.push(r.getComponent(RoleDis).BeHurted(ev.value[0]));
                                    allAwait.push(r.getComponent(RoleDis).changeAtt());
                                }
                            }
                        }
                        else
                        {
                            r = this.selfQueue.roleNodes[ev.spellcaster.index];
                            if (r)
                            {
                                allAwait.push(r.getComponent(RoleDis).BeHurted(ev.value[0]));
                                allAwait.push(r.getComponent(RoleDis).changeAtt());
                            }
                        }
                    }
                    if(Camp.Enemy==ev.spellcaster.camp)
                    {
                        if(EventType.RemoteInjured==ev.type)
                        {
                            for(let t of ev.recipient)
                            {
                                r=this.selfQueue.roleNodes[t.index];
                                //console.warn("我方role",r.index);
                                if(r)
                                {
                                    //console.warn("我方角色远程受伤表现");
                                    allAwait.push(r.getComponent(RoleDis).BeHurted(ev.value[0]));
                                    allAwait.push(r.getComponent(RoleDis).changeAtt());
                                }
                            }
                        }
                        else
                        {
                            r = this.enemyQueue.roleNodes[ev.spellcaster.index];
                            if (r) 
                            {
                                allAwait.push(r.getComponent(RoleDis).BeHurted(ev.value[0]));
                                allAwait.push(r.getComponent(RoleDis).changeAtt());
                            }
                        }
                        
                    }
                }
            }
            console.log("ChangeAttEvent allAwait:", allAwait);
            await Promise.all(allAwait);
        }
        catch(error) 
        {
            console.error("BattleDis 下的 ChangeAttEvent 错误 err:", error);
        }
    }

    async CheckExitEvent(evs:skill.Event[])
    {
        try 
        {
            let allAwait = [];
            for(let ev of evs)
            {
                if(EventType.Exit != ev.type)
                {
                    continue;
                }

                if(Camp.Self==ev.spellcaster.camp)
                {
                    allAwait.push(this.selfQueue.RemoveRole(ev.spellcaster.index));
                }
                else if(Camp.Enemy==ev.spellcaster.camp)
                {
                    allAwait.push(this.enemyQueue.RemoveRole(ev.spellcaster.index));
                }
            }
            await Promise.all(allAwait);
        }
        catch(error) 
        {
            console.error("BattleDis 下的 CheckExitEvent 错误 err:", error);
        }
    }

    onEvent()
    {
        this.battle.on_event = async (evs) => 
        {
            try 
            {
                await this.CheckAttackEvent(evs);
                await this.CheckRemoteInjured(evs);
                await this.CheckSummonEvent(evs);
                await this.CheckAttGainEvent(evs);
                await this.ChangeAttEvent(evs);
                await this.CheckExitEvent(evs);
            }
            catch(error) 
            {
                console.error("BattleDis 下的 on_event 错误 err:", error);
            }
        }
    }
    
}


