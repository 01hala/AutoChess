/*
 * BattleDis.ts
 * author: Hotaru
 * 2023/10/12
 * 战斗展示类
 */
import { _decorator, instantiate, Node, Prefab, Label, Button, UITransform, Vec3, sp } from 'cc';
import { Queue } from './Queue';
import { Battle } from '../AutoChessBattle/battle';
import * as skill from '../AutoChessBattle/skill/skill_base'
import * as battleEnums from '../AutoChessBattle/enum';
import { delay, sleep } from '../../other/sleep'
import { RoleDis } from './RoleDis';
import { BundleManager } from '../../bundle/BundleManager'
import { hub_call_gate_reverse_reg_client_hub_rsp } from '../../serverSDK/gate';
import { Role } from '../AutoChessBattle/common';
import { Role as rRole } from '../AutoChessBattle/role';
import { netSingleton } from '../../netDriver/netSingleton';
import * as singleton from '../../netDriver/netSingleton';
import { BattleVictory } from '../AutoChessBattle/common';
import { Team } from '../AutoChessBattle/team';
import { GameManager } from '../../other/GameManager';
import { SendMessage } from '../../other/MessageEvent';
import { AudioManager } from '../../other/AudioManager';
import * as enums from '../../other/enums';
import * as common from '../../battle/AutoChessBattle/common';
const { ccclass, property } = _decorator;

export class BattleDis 
{
    //摄像机
    private cameraNode:Node;
    private originCameraPos:Vec3;
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
    public puase:boolean = false;

    //所有需要并行执行的事件队列,分己方和敌人方，己方先执行
    private selfParallelList:Promise<void>[]=[]
    private enemyParallelList:Promise<void>[]=[]

    //战斗系统类
    public battleCentre:Battle = null;
    
    public constructor(battle:Battle) 
    {
        this.battleCentre = battle;

        this.battleCentre.onPlaySound = (sound:string) => {
            AudioManager.Instance.PlaySound(sound);
        };
        this.battleCentre.onPlayerOnShot = (sound:string) => {
            AudioManager.Instance.PlayerOnShot(sound);
        };
        this.battleCentre.onKillRole = (r:Role) => {
            singleton.netSingleton.game.kill_Role_ntf(r);
        };

        this.onEvent();
    }

    public destory() 
    {
        this.selfQueue.destroyRole();
        this.enemyQueue.destroyRole();
        this.panelNode.destroy();
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

            //await this.battleCentre.TickBattle();
            //while (!this.battleCentre.CheckEndBattle()) 
            //{
            //    await this.battleCentre.TickBattle();
            //}

            let is_victory = BattleVictory.tie;
            if (this.battleCentre.GetWinCamp() == battleEnums.Camp.Self) {
                is_victory = BattleVictory.victory;
            }
            else if (this.battleCentre.GetWinCamp() == battleEnums.Camp.Enemy) {
                is_victory = BattleVictory.faild;
            }

            let addTime=false;
            let settlement=false;
            if(this.battleCentre.round<=15 && 10 == this.battleCentre.victory)
            {
                addTime=true;
            }
            if (is_victory == BattleVictory.victory || (is_victory == BattleVictory.faild && (this.battleCentre.faild - 1) > 0))
            {
                let heath=(is_victory == BattleVictory.victory) ? this.battleCentre.faild : this.battleCentre.faild-1;
                settlement=true;
                this.panelNode.dispatchEvent(new SendMessage('OpenSettlement',true,{outcome:is_victory , hpNum: heath , isAddTime : addTime}));
            }
            else if (is_victory == BattleVictory.tie) 
            {
                settlement=true;
                this.panelNode.dispatchEvent(new SendMessage('OpenSettlement',true,{outcome:is_victory , hpNum: this.battleCentre.faild , isAddTime : addTime}));
            }

            if(!settlement)
            {
                await sleep(500);
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
            return delay(0,()=>{});
        }
        this.launchSkillEffect.active=true;

        this.launchSkillEffect.getChildByPath("BottomImg").getComponent(sp.Skeleton).animation="a2";
        this.launchSkillEffect.getChildByPath("RoleImg").getComponent(sp.Skeleton).animation="a";
        this.launchSkillEffect.getChildByPath("TopImg").getComponent(sp.Skeleton).animation="a";

        return delay(2000,()=>
        {
            this.launchSkillEffect.active=false;
        });

    }

    private showLaunchFettersEffect()
    {
        return delay(2000,()=>
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
                if (battleEnums.EventType.BattleBegin != ev.type)
                {
                    continue;
                }

                this.selfBeginEffect.active=true;
                this.enemyBeginEffect.active=true;

                this.selfBeginEffect.setSiblingIndex(100);
                this.enemyBeginEffect.setSiblingIndex(100);

                this.selfBeginEffect.getChildByPath("BottomImg").getComponent(sp.Skeleton).animation="a2";
                this.selfBeginEffect.getChildByPath("UserName").getComponent(Label).string="己方队伍";
                this.selfBeginEffect.getChildByPath("TopImg").getComponent(sp.Skeleton).animation="a";
                
                this.enemyBeginEffect.getChildByPath("BottomImg").getComponent(sp.Skeleton).animation="a2";
                this.enemyBeginEffect.getChildByPath("UserName").getComponent(Label).string="敌方队伍";
                this.enemyBeginEffect.getChildByPath("TopImg").getComponent(sp.Skeleton).animation="a";

                return delay(1000,()=>
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
                if (battleEnums.EventType.AttackInjured != ev.type)
                {
                    continue;
                }

                evs_floating.push(ev);

                if (battleEnums.Camp.Self == ev.spellcaster.camp)
                {
                    if (!selfAttack)
                    {
                        for(let r of ev.recipient)
                        {
                            if(this.battleCentre.GetEnemyTeam().GetRole(r.index).CheckDead())
                            {
                                // singleton.netSingleton.game.kill_Role_ntf(this.battleCentre.GetSelfTeam().GetRole(ev.spellcaster.index).c_role);
                            }
                        }
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
                else if (battleEnums.Camp.Enemy == ev.spellcaster.camp)
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
                    this.selfQueue.readyLocation.worldPosition, 
                    this.selfQueue.battleLocation.worldPosition, 
                    battleEnums.Camp.Self));
                allAwait.push(enemyRoleNodeRoleDis.Attack(
                    this.enemyQueue.readyLocation.worldPosition, 
                    this.enemyQueue.battleLocation.worldPosition, 
                    battleEnums.Camp.Enemy));
                
                await Promise.all(allAwait);
                allAwait=[];

                //震动部分                
                if(null==this.cameraNode){
                    this.cameraNode = this.panelNode.parent.getChildByName('Camera');
                    if (!this.cameraNode) {
                        console.error('Camera node not found,shake screen failed');
                    }
                    else{
                        this.originCameraPos = this.cameraNode.getPosition();
                    }
                }
                this.shakeScreen(0.5,10);
                await this.CheckBehurted(evs_floating);
                //角色回到准备战斗位置，手动调用，使得角色在执行到这里、回到原位之前的部分就执行受伤效果展示，即时性更强
                // {
                //     allAwait.push(selfRoleNodeRoleDis.ResetPos(
                //     this.selfQueue.readyLocation.position));

                //     allAwait.push(enemyRoleNodeRoleDis.ResetPos(
                //     this.enemyQueue.readyLocation.position));
                // }
                // await Promise.all(allAwait);

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
        // const cameraNode = this.panelNode.parent.getChildByName('Camera');
        // if (!cameraNode) {
        //     console.error('Camera node not found,shake screen failed');
        //     return;
        // }
    
        // 保存原始位置，以便震动后可以恢复
    
        // 震动效果
        if(null==this.cameraNode) return;
        let elapsed = 0;
        const shake = () => {
            if (elapsed < duration) {
                // 随机确定摄像机震动的新位置
                const randomX = Math.random() * magnitude * 2 - magnitude;
                const randomY = Math.random() * magnitude * 2 - magnitude;
                this.cameraNode.setPosition(this.originCameraPos.x + randomX, this.originCameraPos.y + randomY);
    
                // 更新已经过去的时间
                elapsed += 0.05;
                // 请求下一帧继续执行震动
                requestAnimationFrame(shake);
            } else {
                // 震动结束，恢复摄像机的原始位置
                this.cameraNode.setPosition(this.originCameraPos);
            }
        };
    
        // 开始震动
        shake();
    }

    private async showRemoteAttack(selfRoleDis: RoleDis, spellcasterLocation: Vec3, targetLocation: Vec3, ev:skill.Event) {
        await selfRoleDis.RemoteAttack(spellcasterLocation, targetLocation);
        await this.CheckBehurted([ev]);
    }

    //远程攻击技能
    private async CheckRemoteInjured(evs:skill.Event[]) 
    {
        try 
        {
            let allAwait = [];
            for(let ev of evs)
            {
                
                if(battleEnums.EventType.RemoteInjured != ev.type) 
                {
                    continue;
                }

                let spList = battleEnums.Camp.Self == ev.spellcaster.camp ? this.selfQueue : this.enemyQueue;
                for (let element of ev.recipient) {

                    let targetList = battleEnums.Camp.Enemy == element.camp ? this.enemyQueue : this.selfQueue;

                    let self = spList.roleNodes[ev.spellcaster.index];
                    let target = targetList.roleNodes[element.index];

                    if (self && target) 
                    {                
                        let selfpos = this.panelNode.getComponent(UITransform).convertToNodeSpaceAR(self.getWorldPosition());
                        let targetpos = this.panelNode.getComponent(UITransform).convertToNodeSpaceAR(target.getWorldPosition());   
                        if(!ev.isParallel)
                        {
                            let selfRoleDis = self.getComponent(RoleDis);
                            if (selfRoleDis) 
                            {
                                //allAwait.push(this.showRemoteAttack(selfRoleDis, selfpos, targetpos, ev))
                                //await selfRoleDis.RemoteAttack(selfpos, targetpos);
                                //await this.ChangeAttEvent([ev]);
                            }
                        }
                        else
                        {
                            if(battleEnums.Camp.Self==ev.spellcaster.camp) 
                            {
                                let selfRoleDis = self.getComponent(RoleDis);
                                if (selfRoleDis) {
                                    this.selfParallelList.push(this.showRemoteAttack(selfRoleDis, selfpos, targetpos, ev));
                                }
                            }
                            else 
                            {
                                let selfRoleDis = self.getComponent(RoleDis); 
                                if (selfRoleDis) {
                                    this.enemyParallelList.push(this.showRemoteAttack(selfRoleDis, selfpos, targetpos, ev));
                                }
                            }
                        }
                    }
                };
            }
            await Promise.all(allAwait);
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
                
                if(battleEnums.EventType.Summon != ev.type) 
                {
                    continue;
                }
                else
                {
                    //await this.showLaunchSkillEffect();
                }
                console.log("检测到召唤技能！");
                ev.recipient.forEach(element=>{
                    let tmp:rRole;
                    tmp = new rRole(null,element.index,element.id, 1,0, element.camp, element.properties,null, 0);
                    let targetTeam = battleEnums.Camp.Self == element.camp ? this.battleCentre.GetSelfTeam() : this.battleCentre.GetEnemyTeam();
                    targetTeam.AddRole(tmp);
                    let queue = battleEnums.Camp.Self == element.camp ? this.selfQueue : this.enemyQueue;
                    if(!ev.isParallel) 
                    {
                        allAwait.push(queue.SummonRole([tmp],ev.spellcaster));
                    }
                    else{
                        if(battleEnums.Camp.Self == ev.spellcaster.camp) {
                            this.selfParallelList.push(queue.SummonRole([tmp],ev.spellcaster));
                        }
                        else {

                            this.enemyParallelList.push(queue.SummonRole([tmp],ev.spellcaster));
                        }
                    }
                });
            } 
            await Promise.all(allAwait);         
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
                
                if(battleEnums.EventType.IntensifierExp != ev.type) 
                {
                    continue;
                }
                else
                {
                    //await this.showLaunchSkillEffect();
                }
                console.log("检测到加临时经验值事件");
                
                //受到增益者            
                ev.recipient.forEach(element=>{
                    
                    if(battleEnums.Camp.Self==element.camp)
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
                if(battleEnums.EventType.IntensifierProperties != ev.type) 
                {
                    continue;
                }
                
                console.log("检测到加属性事件");
                //受到增益者            
                ev.recipient.forEach(element=>
                {
                    let effectEm:common.SkillEffectEM = common.SkillEffectEM.AddProperty;
                    if(1 == ev.effectScope)
                    {
                        effectEm=common.SkillEffectEM.RecoverHP;
                    }
                    if(battleEnums.Camp.Self==element.camp)
                    {
                        if(this.selfQueue.roleNodes[element.index] && element.index != ev.spellcaster.index)
                        {
                            if (!ev.isParallel) 
                            {
                                allAwait.push(this.selfQueue.roleNodes[ev.spellcaster.index].getComponent(RoleDis).SpellcastEffect(effectEm,this.selfQueue.roleNodes[element.index], async ()=>
                                {
                                    await this.selfQueue.roleNodes[element.index].getComponent(RoleDis).ReceptionEffect(effectEm,ev.isParallel);
                                    await this.selfQueue.roleNodes[element.index].getComponent(RoleDis).Intensifier(ev.value);
                                }));
                            }
                            else
                            {
                                this.selfParallelList.push(this.selfQueue.roleNodes[ev.spellcaster.index].getComponent(RoleDis).SpellcastEffect(effectEm,this.selfQueue.roleNodes[element.index], async ()=>
                                {
                                    await this.selfQueue.roleNodes[element.index].getComponent(RoleDis).ReceptionEffect(effectEm,ev.isParallel);
                                    await this.selfQueue.roleNodes[element.index].getComponent(RoleDis).Intensifier(ev.value);
                                }));
                            }
                        } 
                        if(element.index == ev.spellcaster.index)
                        {
                            allAwait.push(this.selfQueue.roleNodes[element.index].getComponent(RoleDis).ReceptionEffect(effectEm,ev.isParallel));
                            allAwait.push(this.selfQueue.roleNodes[element.index].getComponent(RoleDis).Intensifier(ev.value));
                        }
                    }

                    if(battleEnums.Camp.Enemy == element.camp)
                    {
                        if(this.enemyQueue.roleNodes[element.index] && element.index != ev.spellcaster.index)
                        {
                            if (!ev.isParallel)
                            {
                                allAwait.push(this.enemyQueue.roleNodes[ev.spellcaster.index].getComponent(RoleDis).SpellcastEffect(effectEm,this.enemyQueue.roleNodes[element.index],async ()=>
                                {
                                    await this.enemyQueue.roleNodes[element.index].getComponent(RoleDis).ReceptionEffect(effectEm,ev.isParallel);
                                    await this.enemyQueue.roleNodes[element.index].getComponent(RoleDis).Intensifier(ev.value);
                                }));
                            }
                            else
                            {
                                this.enemyParallelList.push(this.enemyQueue.roleNodes[ev.spellcaster.index].getComponent(RoleDis).SpellcastEffect(effectEm,this.enemyQueue.roleNodes[element.index],async ()=>
                                {
                                    await this.enemyQueue.roleNodes[element.index].getComponent(RoleDis).ReceptionEffect(effectEm,ev.isParallel);
                                    await this.enemyQueue.roleNodes[element.index].getComponent(RoleDis).Intensifier(ev.value);
                                }));
                            }
                        }
                        if(element.index == ev.spellcaster.index)
                        {
                            allAwait.push(this.enemyQueue.roleNodes[element.index].getComponent(RoleDis).ReceptionEffect(effectEm,ev.isParallel));
                            allAwait.push(this.enemyQueue.roleNodes[element.index].getComponent(RoleDis).Intensifier(ev.value));
                        }
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

    //加buff或者护盾
    private async CheckAddBuff(evs: skill.Event[])
    {
        try
        {
            let allAwait = [];
            for (let ev of evs)
            {
                if (battleEnums.EventType.GiveShields == ev.type || battleEnums.EventType.AddBuff == ev.type) 
                {
                    let skilleffectem;
                    switch (ev.type)
                    {
                        case battleEnums.EventType.GiveShields: skilleffectem = common.SkillEffectEM.GainShield; break;
                        case battleEnums.EventType.AddBuff: skilleffectem = common.SkillEffectEM.AddBuffer; break;
                    }

                    for (let r of ev.recipient)
                    {
                        if (battleEnums.Camp.Self == r.camp)
                        {
                            if (this.selfQueue.roleNodes[r.index])
                            {
                                if (!ev.isParallel) 
                                {
                                    allAwait.push(this.selfQueue.roleNodes[r.index].getComponent(RoleDis).ReceptionEffect(skilleffectem, ev.isParallel, ev.value[0]));
                                }
                                else
                                {
                                    this.selfParallelList.push(this.selfQueue.roleNodes[r.index].getComponent(RoleDis).ReceptionEffect(skilleffectem, ev.isParallel, ev.value[0]));
                                }
                            }
                        }
                        if (battleEnums.Camp.Enemy == r.camp)
                        {
                            if (this.enemyQueue.roleNodes[r.index])
                            {
                                if (!ev.isParallel)
                                {
                                    allAwait.push(this.enemyQueue.roleNodes[r.index].getComponent(RoleDis).ReceptionEffect(skilleffectem, ev.isParallel, ev.value[0]));
                                }
                                else
                                {
                                    this.enemyParallelList.push(this.selfQueue.roleNodes[r.index].getComponent(RoleDis).ReceptionEffect(skilleffectem, ev.isParallel, ev.value[0]));
                                }
                            }
                        }
                    }
                }
            }


            await Promise.all(allAwait);
        }
        catch (error)
        {
            console.error("BattleDis 下的 CheckAddBuff 错误 err:", error);
        }
    }

    //属性改变
    private async CheckBehurted(evs:skill.Event[])
    {
        try 
        {
            let allAwait = [];
            let r:Node = null;
            for(let ev of evs)
            {
                if(battleEnums.EventType.RemoteInjured==ev.type || battleEnums.EventType.IntensifierProperties == ev.type || battleEnums.EventType.AttackInjured==ev.type) 
                {
                    if (ev.is_trigger_floating) {
                        continue;
                    }
                    ev.is_trigger_floating = true;

                    if(battleEnums.Camp.Self == ev.spellcaster.camp)
                    {
                        if(battleEnums.EventType.RemoteInjured==ev.type)
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
                    if(battleEnums.Camp.Enemy==ev.spellcaster.camp)
                    {
                        if(battleEnums.EventType.RemoteInjured==ev.type)
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
                if(battleEnums.EventType.Exit != ev.type)
                {
                    continue;
                }

                if(battleEnums.Camp.Self==ev.spellcaster.camp)
                {
                    allAwait.push(this.selfQueue.RemoveRole(ev.spellcaster.index));
                }
                else if(battleEnums.Camp.Enemy==ev.spellcaster.camp)
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
    
    //换位
    async CheckTransPosition(evs:skill.Event[])
    {
        try
        {
            let allAwait = [];
            for (let ev of evs)
            {
                if (battleEnums.EventType.ChangeLocation != ev.type)
                {
                    continue;
                }

                if (battleEnums.Camp.Self == ev.spellcaster.camp)
                {
                    allAwait.push(this.enemyQueue.SwitchRolePos(ev.recipient, ev.value));
                }
                if (battleEnums.Camp.Enemy == ev.spellcaster.camp)
                {
                    allAwait.push(this.selfQueue.SwitchRolePos(ev.recipient, ev.value));
                }
            }
            await Promise.all(allAwait);
        }
        catch(error) 
        {
            console.error("BattleDis 下的 CheckTransPosition 错误 err:", error);
        }
    }

    //属性交换
    async CheckSwapProperties(evs:skill.Event[])
    {
        try
        {
            let allAwait = [];
            for(let ev of evs)
            {
                if(battleEnums.EventType.SwapProperties != ev.type)
                {
                    continue;
                }

                let queue:Queue = this.selfQueue;
                if(battleEnums.Camp.Enemy == ev.spellcaster.camp)
                {
                    queue = this.enemyQueue;
                }
                let style;
                switch (ev.value[0])
                {
                    case battleEnums.SwapPropertiesType.HpSwap:
                    case battleEnums.SwapPropertiesType.AttackSwap:
                        {
                            style = 1;
                        }
                        break;
                    case battleEnums.SwapPropertiesType.SelfSwap:
                        {
                            style = 2;
                        }
                        break;
                }
                allAwait.push(queue.GetRole(ev.spellcaster.index).getComponent(RoleDis).changeAtt(2000));
                allAwait.push(queue.GetRole(ev.spellcaster.index).getComponent(RoleDis).ReceptionEffect(common.SkillEffectEM.ExchangeProperty, false, null, style));
                //allAwait.push(queue.roleNodes[ev.spellcaster.index].getComponent(RoleDis).Intensifier([0, ev.value[1]]));
            }
            await Promise.all(allAwait);
        }
        catch(error)
        {
            console.error("BattleDis 下的 CheckSwapProperties 错误 err:", error);
        }
    }

    onEvent()
    {
        this.battleCentre.on_event = async (evs) => 
        {
            try 
            {
                console.log("onEvent evs:", evs);

                await this.CheckBeginBattle(evs);
                await this.CheckSwapProperties(evs);
                await this.CheckAddBuff(evs);
                await this.CheckSummonEvent(evs);
                await this.CheckAttGainEvent(evs);
                await this.CheckAttExpEvent(evs);
                await this.CheckTransPosition(evs);
                await this.CheckRemoteInjured(evs);
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


