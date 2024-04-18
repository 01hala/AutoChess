/*
 * BattleDis.ts
 * author: Hotaru
 * 2023/10/12
 * 战斗展示类
 */
import { _decorator, instantiate, Node, Prefab, Label, Button, UITransform, Vec3, sp } from 'cc';
import { Queue } from './Queue';
import { Battle } from '../battle';
import * as skill from '../skill/skill_base'
import { Camp, EventType } from '../../other/enums';
import { sleep } from '../../other/sleep'
import { RoleDis } from './RoleDis';
import { BundleManager } from '../../bundle/BundleManager'
import { hub_call_gate_reverse_reg_client_hub_rsp } from '../../serverSDK/gate';
import { Role } from '../../serverSDK/common';
import { Role as rRole } from '../role';
import { netSingleton } from '../../netDriver/netSingleton';
import * as singleton from '../../netDriver/netSingleton';
import { battle_victory } from '../../serverSDK/ccallmatch';
import { Team } from '../team';
import { GameManager } from '../../other/GameManager';
import { SendMessage } from '../../other/MessageEvent';
const { ccclass, property } = _decorator;

export class BattleDis 
{
    //父级对象
    public father:Node;
    //顶级面板
    public panelNode:Node;
    //战斗效果
    private battleEffectImg:Node;
    private launchSkillEffect:Node;
    //敌我开场介绍面板
    private selfBeginEffect:Node;
    private enemyBeginEffect:Node;
    //敌我队列
    public selfQueue:Queue;
    public enemyQueue:Queue;

    private gmBtn:Button;
    private pauseBtn:Button;
    private puase:boolean = false;

    //所有需要并行执行的事件队列,分己方和敌人方，己方先执行
    private selfParallelList:Promise<void>[]=[]
    private enemyParallelList:Promise<void>[]=[]

    //战斗系统类
    public battleCentre:Battle = null;
    
    public constructor(battle:Battle) 
    {
        this.battleCentre = battle;
        this.onEvent();
    }

    public destory() {
        this.panelNode.destroy();
    }

    private delay(ms: number, release: () => void): Promise<void> 
    {
        return new Promise(async (resolve) => {
            await setTimeout(() => {
                resolve();
                release();
            }, ms);
        });
    }
/*
 * 修改start
 * author：Hotaru
 * 2024/03/07
 * 让加载更平顺
 */
    public async Start(father:Node,_callBack:(e?:()=>void)=>void) 
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
            
            this.selfBeginEffect=this.panelNode.getChildByName("SelfBeginEffect");
            this.selfBeginEffect.active=false;

            this.enemyBeginEffect=this.panelNode.getChildByName("EnemyBeginEffect");
            this.enemyBeginEffect.active=false;

            this.launchSkillEffect=this.panelNode.getChildByName("LaunchSkillEffect");
            this.launchSkillEffect.active=false;

            this.gmBtn = this.panelNode.getChildByName("gm").getComponent(Button);
            this.gmBtn.node.on(Node.EventType.TOUCH_START, async ()=>{
                console.log("gm Button!");
                let gmPrefab = await BundleManager.Instance.loadAssetsFromBundle("Panel", "gm") as Prefab;
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

            let victory = this.panelNode.getChildByName("victory");
            if (victory) {
                victory.active = false;
            }
    
            console.log("PutRole start");
            await this.PutRole();
            console.log("PutRole end");
            this.father=father;
            
            _callBack(()=>
            {
                setTimeout(this.TickBattle.bind(this), 500);
            });
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
            while (!this.battleCentre.CheckEndBattle()) 
            {
                await this.battleCentre.TickBattle();

                while (this.puase) {
                    await sleep(200);
                }
            }

            await this.battleCentre.TickBattle();
            while (!this.battleCentre.CheckEndBattle()) 
            {
                await this.battleCentre.TickBattle();
            }

            let is_victory = battle_victory.tie;
            if (this.battleCentre.GetWinCamp() == Camp.Self) {
                is_victory = battle_victory.victory;
            }
            else if (this.battleCentre.GetWinCamp() == Camp.Enemy) {
                is_victory = battle_victory.faild;
            }

            let settlement:boolean=false;
            if ((is_victory == battle_victory.victory && (this.battleCentre.victory + 1) < 10) ||
                (is_victory == battle_victory.faild && (this.battleCentre.faild - 1) > 0))
            {
                let heath=(is_victory == battle_victory.victory) ? this.battleCentre.faild : this.battleCentre.faild-1;
                settlement=true;
                this.panelNode.dispatchEvent(new SendMessage('OpenSettlement',true,{outcome:is_victory , hpNum: heath}));
            }
            else if (is_victory == battle_victory.tie) 
            {
                settlement=true;
                this.panelNode.dispatchEvent(new SendMessage('OpenSettlement',true,{outcome:is_victory , hpNum: this.battleCentre.faild}));
            }

            if(!settlement)
            {
                await sleep(4000);
                netSingleton.game.confirm_round_victory(is_victory);
            }
            
        }
        catch(error)
        {
            console.error("BattleDis 下的 TickBattle 错误 err:", error);
        }
        
    }

    async SetGameVictory(is_victory:boolean) 
    {
        let msg=is_victory ? "游戏胜利!" : "游戏失败!";
        let text="<outline color=black width=4>"+msg+"</outline>";
        this.panelNode.dispatchEvent(new SendMessage('ShowTip',true,text));

        await sleep(4000);
    }

    async PutRole()
    {
        try
        {
            let waits = [];

            let selfRoles = this.battleCentre.GetSelfTeam().GetRoles();
            waits.push(this.selfQueue.InitRole(selfRoles));
    
            let enemyRoles = this.battleCentre.GetEnemyTeam().GetRoles();
            waits.push(this.enemyQueue.InitRole(enemyRoles));

            await Promise.all(waits);
        }
        catch(error)
        {
            console.error("BattleDis 下的 PutRole 错误 err:", error);
        }
        
    }

    showBattleEffect(_bool:boolean)
    {
        this.battleEffectImg.active=_bool;
    }

    private showLaunchSkillEffect(isShow:boolean=false)
    {
        if(!isShow){
            return this.delay(0,()=>{});
        }
        this.launchSkillEffect.active=true;

        this.launchSkillEffect.getChildByPath("BottomImg").getComponent(sp.Skeleton).animation="a2";
        this.launchSkillEffect.getChildByPath("RoleImg").getComponent(sp.Skeleton).animation="a";
        this.launchSkillEffect.getChildByPath("TopImg").getComponent(sp.Skeleton).animation="a";

        return this.delay(2000,()=>
        {
            this.launchSkillEffect.active=false;
        });

    }

    private showLaunchFettersEffect()
    {
        return this.delay(2000,()=>
        {
            this.launchSkillEffect.active=false;
        })
    }

    /*
     * 
     * 以下为事件响应函数
     * 
     */
    //战斗开始阶段展示双方名牌
    private async CheckBeginBattle(evs: skill.Event[]) {
        try{
            for(let ev of evs)
            {
                //console.log("checkAttackEvent ev:", ev)
                if (EventType.BattleBegin != ev.type)
                {
                    continue;
                }

                this.selfBeginEffect.active=true;
                this.enemyBeginEffect.active=true;

                this.selfBeginEffect.getChildByPath("BottomImg").getComponent(sp.Skeleton).animation="a2";
                this.selfBeginEffect.getChildByPath("UserName").getComponent(Label).string="己方队伍";
                this.selfBeginEffect.getChildByPath("TopImg").getComponent(sp.Skeleton).animation="a";
                
                this.enemyBeginEffect.getChildByPath("BottomImg").getComponent(sp.Skeleton).animation="a2";
                this.enemyBeginEffect.getChildByPath("UserName").getComponent(Label).string="敌方队伍";
                this.enemyBeginEffect.getChildByPath("TopImg").getComponent(sp.Skeleton).animation="a";

                return this.delay(1000,()=>
                {
                    this.selfBeginEffect.active=false;
                    this.enemyBeginEffect.active=false;
                });
            }   
                
        }
        catch(error) 
        {
            console.error("BattleDis 下的 CheckBeginBattle 错误 err:", error);
        }
    }

    //普通攻击
    private async CheckAttackEvent(evs:skill.Event[]) 
    {
        try 
        {
            let evs_floating:skill.Event[] = [];
            let selfAttack = false;
            let enemyAttack = false;
            let selfRoleNodeRoleDis:RoleDis = null;
            let enemyRoleNodeRoleDis:RoleDis = null;
            for(let ev of evs)
            {
                if (EventType.AttackInjured != ev.type)
                {
                    continue;
                }

                evs_floating.push(ev);

                if (Camp.Self == ev.spellcaster.camp)
                {
                    if (!selfAttack)
                    {
                        let roleNode = this.selfQueue.roleNodes[ev.spellcaster.index];
                        if(roleNode)
                        {
                            selfRoleNodeRoleDis = roleNode.getComponent(RoleDis);
                            if (selfRoleNodeRoleDis) {
                                selfAttack = true;
                            }
                        }
                    }
                }
                else if (Camp.Enemy == ev.spellcaster.camp)
                {
                    if (!enemyAttack)
                    {
                        let roleNode = this.enemyQueue.roleNodes[ev.spellcaster.index];
                        if(roleNode)
                        {
                            enemyRoleNodeRoleDis = roleNode.getComponent(RoleDis);
                            if (enemyRoleNodeRoleDis) {
                                enemyAttack = true;
                            }
                        }
                    }
                }
            }
            
            if (selfAttack && enemyAttack) {
                console.log("CheckAttackEvent begin!");
                console.log("CheckAttackEvent selfRoleNodeRoleDis:", selfRoleNodeRoleDis);
                console.log("CheckAttackEvent enemyRoleNodeRoleDis:", enemyRoleNodeRoleDis);
                
                let allAwait:Promise<void>[] = [];

                allAwait.push(selfRoleNodeRoleDis.Attack(
                    this.selfQueue.readyLocation.position, 
                    this.selfQueue.battleLocation.position, 
                    Camp.Self));
                allAwait.push(enemyRoleNodeRoleDis.Attack(
                    this.enemyQueue.readyLocation.position, 
                    this.enemyQueue.battleLocation.position, 
                    Camp.Enemy));
                
                await Promise.all(allAwait);
                this.shakeScreen(0.5,10);
                await this.ChangeAttEvent(evs_floating);

                console.log("CheckAttackEvent end!");
            }
        }
        catch(error) 
        {
            console.error("BattleDis 下的 CheckAttackEvent 错误 err:", error);
        }
    }

    private shakeScreen(duration: number, magnitude: number) {
        // 获取摄像机组件
        const cameraNode = this.panelNode.parent.getChildByName('Camera');
        if (!cameraNode) {
            console.error('Camera node not found,shake screen failed');
            return;
        }
    
        // 保存原始位置，以便震动后可以恢复
        const originalPosition = cameraNode.position;
    
        // 震动效果
        let elapsed = 0;
        const shake = () => {
            if (elapsed < duration) {
                // 随机确定摄像机震动的新位置
                const randomX = Math.random() * magnitude * 2 - magnitude;
                const randomY = Math.random() * magnitude * 2 - magnitude;
                cameraNode.setPosition(originalPosition.x + randomX, originalPosition.y + randomY);
    
                // 更新已经过去的时间
                elapsed += 0.05;
                // 请求下一帧继续执行震动
                requestAnimationFrame(shake);
            } else {
                // 震动结束，恢复摄像机的原始位置
                cameraNode.setPosition(originalPosition);
            }
        };
    
        // 开始震动
        shake();
    }

    private async showRemoteAttack(selfRoleDis: RoleDis, spellcasterLocation: Vec3, targetLocation: Vec3, father: Node, ev:skill.Event) {
        await selfRoleDis.RemoteAttack(spellcasterLocation, targetLocation, this.father)
        await this.ChangeAttEvent([ev]);
    }

    //远程攻击技能
    private async CheckRemoteInjured(evs:skill.Event[]) 
    {
        try 
        {
            for(let ev of evs)
            {
                
                if(EventType.RemoteInjured != ev.type) 
                {
                    continue;
                }
                else
                {
                    await this.showLaunchSkillEffect();
                }

                let spList = Camp.Self == ev.spellcaster.camp ? this.selfQueue : this.enemyQueue;
                for (let element of ev.recipient) {

                    let targetList = Camp.Enemy == element.camp ? this.enemyQueue : this.selfQueue;

                    let self = spList.roleNodes[ev.spellcaster.index];
                    let target = targetList.roleNodes[element.index];

                    if (self && target) 
                    {                
                        let selfpos = this.panelNode.getComponent(UITransform).convertToNodeSpaceAR(self.getWorldPosition());
                        let targetpos = this.panelNode.getComponent(UITransform).convertToNodeSpaceAR(target.getWorldPosition());   
                        if(!ev.isParallel){
                            let selfRoleDis = self.getComponent(RoleDis);
                            if (selfRoleDis) {
                                await selfRoleDis.RemoteAttack(selfpos, targetpos,this.father);
                                await this.ChangeAttEvent([ev]);
                            }
                        }
                        else{
                            if(Camp.Self==ev.spellcaster.camp) {
                                let selfRoleDis = self.getComponent(RoleDis);
                                if (selfRoleDis) {
                                    this.selfParallelList.push(this.showRemoteAttack(selfRoleDis, selfpos, targetpos,this.father, ev));
                                }
                            }
                            else {
                                let selfRoleDis = self.getComponent(RoleDis); 
                                if (selfRoleDis) {
                                    this.enemyParallelList.push(this.showRemoteAttack(selfRoleDis, selfpos, targetpos,this.father, ev));
                                }
                            }
                        }
                    }
                };
            }
        }
        catch(error) 
        {
            console.error("BattleDis 下的 CheckRemoteInjured 错误 err:", error);
        }
    }

    //召唤技能
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
                else
                {
                    this.showLaunchSkillEffect();
                }
                
                ev.recipient.forEach(element=>{
                    let tmp:rRole;
                    tmp = new rRole(element.index,element.id, 1,0, element.camp, element.properties,null);
                    let targetTeam = Camp.Self == element.camp ? this.battleCentre.GetSelfTeam() : this.battleCentre.GetEnemyTeam();
                    targetTeam.AddRole(tmp);
                    let queue = Camp.Self == element.camp ? this.selfQueue : this.enemyQueue;
                    if(!ev.isParallel) {
                        allAwait.push(queue.SummonRole([tmp],ev.spellcaster));
                    }
                    else{
                        if(Camp.Self == ev.spellcaster.camp) {
                            this.selfParallelList.push(queue.SummonRole([tmp],ev.spellcaster));
                        }
                        else {
                            this.enemyParallelList.push(queue.SummonRole([tmp],ev.spellcaster));
                        }
                    }
                });
                await Promise.all(allAwait);
                allAwait=[];
            }          
        }
        catch(error) 
        {
            console.error("BattleDis 下的 CheckSummon 错误 err:", error);
        }
    }

    //增加临时经验值技能
    private async CheckAttExpEvent(evs:skill.Event[]){
        try 
        {
            let allAwait = [];
            for(let ev of evs)
            {
                
                if(EventType.IntensifierExp != ev.type) 
                {
                    continue;
                }
                else
                {
                    this.showLaunchSkillEffect();
                }
                console.log("检测到加临时经验值事件");
                
                //受到增益者            
                ev.recipient.forEach(element=>{
                    
                    if(Camp.Self==element.camp)
                    {
                        if(this.selfQueue.roleNodes[element.index])
                        {
                            allAwait.push(this.selfQueue.roleNodes[element.index].getComponent(RoleDis).IntensifierExp(ev.value));
                        }
                        
                    }
                    else
                    {
                        if(this.enemyQueue.roleNodes[element.index])
                        {
                            allAwait.push(this.enemyQueue.roleNodes[element.index].getComponent(RoleDis).IntensifierExp(ev.value));
                        }
                        
                    }            
                });
            }
            await Promise.all(allAwait);
        }
        catch(error) 
        {
            console.error("BattleDis 下的 CheckAttExpEvent 错误 err:", error);
        }
    }
    //队伍增益技能
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
                else
                {
                    this.showLaunchSkillEffect();
                }
                console.log("检测到加属性事件");
                
                //受到增益者            
                ev.recipient.forEach(element=>{
                    
                    if(Camp.Self==element.camp)
                    {
                        if(this.selfQueue.roleNodes[element.index])
                        {
                            if(!ev.isParallel) allAwait.push(this.selfQueue.roleNodes[element.index].getComponent(RoleDis).Intensifier(ev.value));
                            else{
                                this.selfParallelList.push(this.selfQueue.roleNodes[element.index].getComponent(RoleDis).Intensifier(ev.value));
                            }
                        } 
                    }
                    else
                    {
                        if(this.enemyQueue.roleNodes[element.index])
                        {
                            if(!ev.isParallel)allAwait.push(this.enemyQueue.roleNodes[element.index].getComponent(RoleDis).Intensifier(ev.value));
                            else{
                                this.enemyParallelList.push(this.selfQueue.roleNodes[element.index].getComponent(RoleDis).Intensifier(ev.value));
                            }
                        }
                        
                    }            
                });
                await Promise.all(allAwait);
                allAwait=[];
            }
        }
        catch(error) 
        {
            console.error("BattleDis 下的 CheckAttGainEvent 错误 err:", error);
        }
    }

    //属性改变
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
                    if (ev.is_trigger_floating) {
                        continue;
                    }
                    ev.is_trigger_floating = true;

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
                                    
                                    console.warn("敌方角色远程受伤表现");
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
                                if(r)
                                {
                                    console.warn("我方角色远程受伤表现");
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

    //离场
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
        this.battleCentre.on_event = async (evs) => 
        {
            try 
            {
                await this.CheckBeginBattle(evs);
                await this.CheckRemoteInjured(evs);
                await this.CheckSummonEvent(evs);
                await this.CheckAttGainEvent(evs);
                await this.CheckAttExpEvent(evs);
                if(this.selfParallelList.length > 0 || this.enemyParallelList.length > 0){
                    await Promise.all(this.selfParallelList);
                    await Promise.all(this.enemyParallelList);
                }
                this.selfParallelList=[];
                this.enemyParallelList=[];
                await this.CheckAttackEvent(evs);  
                await this.CheckExitEvent(evs);           
            }
            catch(error) 
            {
                console.error("BattleDis 下的 on_event 错误 err:", error);
            }
        }
    }
    
    
}


