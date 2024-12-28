
import { _decorator, assetManager, Component, director, instantiate, Layers, Node, sp, UITransform, Vec3 } from 'cc';
import * as enums from './enums';
import * as common from '../battle/AutoChessBattle/common';
import { loadAssets } from '../bundle/LoadAsset';
import { config } from '../battle/AutoChessBattle/config/config';
import * as BattleEnums from '../battle/AutoChessBattle/BattleEnums'
import { delay } from './sleep';
import { Bullet } from '../battle/display/Bullet';
import { GameManager } from './GameManager';
import * as singleton from '../netDriver/netSingleton';
import { RoleSpConfig } from '../battle/AutoChessBattle/config/RoleSp_config';
const { ccclass, property } = _decorator;

export class spEffectObj
{
    public key:string;
    public battleType:BattleEnums.BufferType | BattleEnums.SwapPropertiesType;
    public style:number;

    constructor(_key:string,_battlestype:BattleEnums.BufferType | BattleEnums.SwapPropertiesType | null ,_style?:number)
    {
        this.key=_key;
        this.battleType-_battlestype;
        if(_style)
        {
            this.style=_style;
        }
    }
}

const OnSummonEffectStr="skill_0001";

/**
 * @class 特效类
 * @author Hotaru
 * @CreateTime 2024/11/27
 */
export class SpEffectOnRole
{
    //被召唤出场特效
    private onSummon: sp.SkeletonData=null; 
    //登场特效
    private admission:sp.SkeletonData=null; 
    //技能起手特效
    private useSkill: sp.SkeletonData=null;
    //技能发动时特效
    private onSkill : sp.SkeletonData[]=[];
    //单体增强时特效
    private intensifierSelf: sp.SkeletonData=null;
    //群体增强时特效
    private intensifierColony: sp.SkeletonData=null;
    //存在buff特效
    private buff: Map<string, sp.SkeletonData>=new Map<string,sp.SkeletonData>();
    //技能生效特效
    private checkSkill: Map<string, sp.SkeletonData>=new Map<string,sp.SkeletonData>();
    //父节点
    private parent:Node=null;
    //配置文件
    private roleSpCfg:RoleSpConfig=null;

    constructor(_roleId:number,_parent: Node)
    {
        this.parent = _parent;
        this.roleSpCfg=config.RoleSpConfig.get(_roleId);
    }

    public async init()
    {
        console.log("初始化特效类 config.SpListConfig:", config.SpListConfig);
        
        let allAwait=[];

        allAwait.push(new Promise<void>(async (resolve) =>
        {
            let cfg = config.SpListConfig.get(OnSummonEffectStr);
            if (!cfg) {
                console.log("初始化特效类 get cfg faild:", OnSummonEffectStr);
                resolve();
            }
            else {
                //召唤出场特效
                let address = "EffectSpine/" + OnSummonEffectStr + "/" + cfg.path;
                //console.log("出场特效文件路径：", address);
                await loadAssets.LoadSkeletonData(address, (data) =>
                {
                    if (data)
                    {
                        this.onSummon = data;
                    }
                    resolve();
                });
            }
        }));

        allAwait.push(new Promise<void>(async (resolve) =>
        {
            let cfg = config.SpListConfig.get(this.roleSpCfg.Admission);
            if (!cfg) {
                console.log("初始化特效类 get cfg faild:", this.roleSpCfg.Admission);
                resolve();
            }
            else {
                //入场特效
                let address = "EffectSpine/" + this.roleSpCfg.Admission + "/" + cfg.path;
                await loadAssets.LoadSkeletonData(address, (data) =>
                {
                    if (data)
                    {
                        this.admission = data;
                    }
                    resolve();
                });
            }
        }));

        allAwait.push(new Promise<void>(async(resolve) => {
            let cfg = config.SpListConfig.get(this.roleSpCfg.IntensifierSelf);
            if (!cfg) {
                console.log("初始化特效类 get cfg faild:", this.roleSpCfg.IntensifierSelf);
                resolve();
            }
            else {
                //单体增强时特效
                let address = "EffectSpine/" + this.roleSpCfg.IntensifierSelf + "/" + cfg.path;
                //console.log("单体增强特效文件路径：", address);
                await loadAssets.LoadSkeletonData(address, (data) => {
                    if (data)
                    {
                        this.intensifierSelf = data;
                    }
                    resolve();
                });
            }
        }));

        allAwait.push(new Promise<void>(async(resolve) => {
            let cfg = config.SpListConfig.get(this.roleSpCfg.IntensifierColony);
            if (!cfg) {
                console.log("初始化特效类 get cfg faild:", this.roleSpCfg.IntensifierColony);
                resolve();
            }
            else {
                //单体增强时特效
                let address = "EffectSpine/" + this.roleSpCfg.IntensifierColony + "/" + cfg.path;
                //console.log("群体增强特效文件路径：", address);
                await loadAssets.LoadSkeletonData(address, (data) =>
                {
                    if (data)
                    {
                        this.intensifierColony = data;
                    }
                    resolve();
                });
            }
        }));
        
        allAwait.push(new Promise<void>(async(resolve) => {
            let cfg = config.SpListConfig.get(this.roleSpCfg.UseSkill);
            if (!cfg) {
                console.log("初始化特效类 get cfg faild:", this.roleSpCfg.UseSkill);
                resolve();
            }
            else {
                //使用技能
                if(!("null"===this.roleSpCfg.UseSkill))
                {
                    //console.log("this.spConfig.UseSkill:", this.spConfig.UseSkill);
                    let address = "EffectSpine/" + this.roleSpCfg.UseSkill + "/" + cfg.path;
                    //console.log("使用技能特效文件路径：", address);
                    await loadAssets.LoadSkeletonData(address, (data) =>
                    {
                        if (data)
                        {
                            this.useSkill = data;
                        }
                        resolve();
                    });
                }
                else {
                    resolve();
                }
            }
        }));

        allAwait.push(new Promise<void>(async(resolve) => {
            //技能特效
            if(this.roleSpCfg.OnSkill.length>0)
            {
                for(let t of this.roleSpCfg.OnSkill)
                {
                    if(!(t==="null"))
                    {
                        let cfg = config.SpListConfig.get(t);
                        if (!cfg) {
                            console.log("初始化特效类 get cfg faild:", t);
                        }
                        else {
                            let address = "EffectSpine/" + t + "/" + cfg.path;
                            await loadAssets.LoadSkeletonData(address, (data) =>
                            {
                                if (data)
                                {
                                    this.onSkill.push(data);
                                }
                            });
                        }
                    }
                }
                resolve();
            }
            else
            {
                resolve();
            }
            
        }));

        allAwait.push(new Promise<void>(async(resolve) => {
            //buff特效
            let address;
            for (let t in enums.BuffEffectSp)
            {
                let cfg = config.SpListConfig.get(t);
                if (!cfg) {
                    console.log("初始化特效类 get cfg faild:", t);
                }
                else {
                    address = "EffectSpine/" + t + "/" + cfg.path;
                    //console.log("buff特效文件路径：", address);
                    await loadAssets.LoadSkeletonData(address, (data) =>
                    {
                        if (data)
                        {
                            this.buff.set(t, data);
                        }
                        resolve();
                    });
                }
            }
        }));
    
        allAwait.push(new Promise<void>(async(resolve) => {
            //技能生效特效
            let address;
            for (let t in enums.CheckSkillEffectSp)
            {
                let cfg = config.SpListConfig.get(t);
                if (!cfg) {
                    console.log("初始化特效类 get cfg faild:", t);
                }
                else {
                    address = "EffectSpine/" + t + "/" + cfg.path;
                    //console.log("技能生效特效文件路径：", address);
                    await loadAssets.LoadSkeletonData(address, (data) =>
                    {
                        if (data)
                        {
                            this.checkSkill.set(t, data);
                        }
                        resolve();
                    });
                }
            }
        }));
        
        await Promise.all(allAwait);
        console.log("初始化特效类完毕");
    }

    /**
     * 使用技能特效
     * @returns 
     */
    public UseSkillEffect(): Promise<void>
    {
        return new Promise((resolve) =>
        {
            if (null==this.useSkill)
            {
                console.warn("使用技能 特效为空");
                resolve();
            }
            else
            {
                try
                {
                    let node = new Node("SkillEffect");
                    node.layer=Layers.Enum.UI_2D;
                    this.parent.getChildByPath("EffectSpine").addChild(node);
                    let spEffect = node.addComponent(sp.Skeleton);
                    spEffect.skeletonData = this.useSkill;
                    let anim = this.useSkill.getAnimsEnum();

                    let style=1;

                    switch(this.roleSpCfg.UseSkill)
                    {
                        case "skill_0007":
                            {
                                node.setPosition(new Vec3(-45,70,0));
                                node.setScale(new Vec3(0.4, 0.4, 1));
                                style=2;
                            }
                            break;
                    }

                    spEffect.setAnimation(0, String(anim[style]), false);
                    spEffect.setSkin("default");
                    spEffect.setCompleteListener((trackEntry) =>
                    {
                        if (trackEntry.animation.name === String(anim[style]))
                        {
                            node.destroy();
                            resolve();
                        }
                    });
                } catch (error)
                {
                    console.error("SpEffect 下的 UseSkillEffect 错误: ",error);
                    resolve();
                }
            }
           
        });
    }

    public OnSkillEffect(_isFetter:boolean): Promise<void>
    {
        return new Promise((resolve)=>
        {
            if(null==this.onSkill)
            {
                console.warn("技能 特效为空");
                resolve();
            }
            else
            {
                try
                {
                    let node = new Node("OnSkillEffect");
                    node.layer=Layers.Enum.UI_2D;
                    let spEffect = node.addComponent(sp.Skeleton);

                    let style = 1;
                    switch (this.roleSpCfg.OnSkill[_isFetter?1:0])
                    {
                        case "skill_0022":
                            {
                                singleton.netSingleton.battle.panelNode.addChild(node);
                            }
                            break;
                        default: 
                        {
                            this.parent.getChildByPath("EffectSpine").addChild(node);
                        }
                    }

                    let anim = spEffect.skeletonData.getAnimsEnum();
                    spEffect.setSkin("default");
                    spEffect.setAnimation(0, String(anim[style]), false);
                    spEffect.setCompleteListener((trackEntry) =>
                    {
                        if (trackEntry.animation.name === String(anim[style]))
                        {
                            node.destroy();
                            resolve();
                        }
                    });
                }
                catch(error)
                {
                    console.error("SpEffect 下的 OnSkillEffect 错误: ",error);
                    resolve();
                }
            }
        });
    }

    /**
     * 技能生效特效
     * @param 特效对象
     * @returns 
     */
    public CheckSkillEffect(_obj:spEffectObj): Promise<void>
    {
        return new Promise((resolve) =>
        {
            if (this.checkSkill.size <= 0)
            {
                console.warn("技能生效 特效为空");
                resolve();
            }
            try
            {
                let node = new Node("CheckSkillEffect");
                node.layer=Layers.Enum.UI_2D;
                this.parent.getChildByPath("EffectSpine").addChild(node);
                let spEffect = node.addComponent(sp.Skeleton);
                spEffect.skeletonData = this.checkSkill.get(_obj.key);

                let anim = spEffect.skeletonData.getAnimsEnum();
                spEffect.setSkin("default");

                let style=1;
                switch (_obj.key)
                {
                    case "skill_0024":
                        {
                            node.setPosition(new Vec3(0, -55));
                            node.setScale(new Vec3(0.5,0.5,1));
                            if (BattleEnums.SwapPropertiesType.AttackSwap == _obj.battleType)
                            {
                                spEffect.timeScale = -1;
                            }
                        }
                        break;
                    case "skill_0014":
                        {
                            node.setScale(new Vec3(0.3,0.3,1));
                            style=2;
                        }
                        break;
                    case "skill_0009":
                        {
                            node.setPosition(new Vec3(0, -90));
                            node.setScale(new Vec3(0.5,0.5,1));
                        }
                        break;
                    case "skill_0013_1":
                        {
                            node.setScale(new Vec3(0.5,0.5,1));
                        }
                        break;
                    case "skill_0013_2":
                        {
                            node.setScale(new Vec3(0.5,0.5,1));
                        }
                        break;
                    case "skill_0015":
                        {
                            node.setScale(new Vec3(0.35,0.35,1));
                        }
                        break;
                    default: resolve();
                }

                spEffect.setAnimation(0, String(anim[style]), false);

                spEffect.setCompleteListener((trackEntry) =>
                {
                    if (trackEntry.animation.name === String(anim[style]))
                    {
                        node.destroy();
                        resolve();
                    }
                });
            } catch (error)
            {
                console.error("SpEffect 下的 CheckSkillEffect 错误: ", error);
                resolve();
            }
        });
    }

    /**
     * 使用增益特效
     * @param _isColony 是否是群体效果
     * @returns 
     */
    public UseIntensifierEffect(_isColony: boolean , _style:number): Promise<void>
    {
        return new Promise((resolve) =>
        {
            try
            {
                if (null==this.intensifierSelf)
                {
                    console.warn("单体增益 特效为空");
                    resolve();
                }else if (null ==this.intensifierColony)
                {
                    console.warn("群体增益 特效为空");
                    resolve();
                }
                else
                {
                    let node = new Node("IntensifierEffect");
                    node.layer=Layers.Enum.UI_2D;
                    console.log("实例化增益特效",node);
                    let spEffect = node.addComponent(sp.Skeleton);
                    if (_isColony)
                    {
                        spEffect.skeletonData = this.intensifierColony;
                    }
                    else
                    {
                        spEffect.skeletonData = this.intensifierSelf;
                    }
                    this.parent.getChildByPath("EffectSpine").addChild(node);
                    spEffect.setSkin("default");
                    node.getComponent(UITransform).anchorX=0.5;
                    node.getComponent(UITransform).anchorY=0.5;
                    node.setScale(new Vec3(0.5,0.5,1));
                    let anim = spEffect.skeletonData.getAnimsEnum();
                    spEffect.setAnimation(0, String(anim[_style]), false);
    
                    spEffect.setCompleteListener((trackEntry) =>
                    {
                        if (trackEntry.animation.name === String(anim[_style]))
                        {
                            console.log("增益特效播放完毕");
                            node.destroy();
                            resolve();
                        }
                    });
                }
            } catch (error)
            {
                console.error("SpEffect 下的 UseIntensifierEffect 错误: ",error);
                resolve();
            }
        });
    }

    /**
     * 使用召唤出场特效
     * @returns 
     */
    public UseSummonEffect(): Promise<void>
    {
        return new Promise((resolve) =>
        {
            try
            {
                if (!this.onSummon)
                {
                    console.warn("召唤出场 特效为空");
                    resolve();
                }
                let node = new Node("OnSummonEffect");
                node.layer=Layers.Enum.UI_2D;
                this.parent.getChildByPath("EffectSpine").addChild(node);
                let spEffect = node.addComponent(sp.Skeleton);
                spEffect.skeletonData = this.onSummon;
                let anim = this.onSummon.getAnimsEnum();
                spEffect.setAnimation(0, String(anim[1]), false);
                spEffect.setSkin("default");
                spEffect.setCompleteListener((trackEntry) =>
                {
                    if (trackEntry.animation.name === String(anim[1]))
                    {
                        node.destroy();
                        resolve();
                    }
                });
            } catch (error)
            {
                console.error("SpEffect 下的 UseSummonEffect 错误: ",error);
                resolve();
            }
        });
    }

    /**
     * 使用buff特效
     * @param _buff buff类型
     * @returns 
     */
    public UseBuffEffect(_buff: BattleEnums.BufferType): Promise<void>
    {
        return new Promise((resolve) =>
        {
            try
            {
                if (this.buff.size <= 0)
                {
                    console.warn("buff 特效为空");
                    resolve();
                }
                let node = new Node();
                node.layer=Layers.Enum.UI_2D;
                this.parent.getChildByPath("EffectSpine").addChild(node);
                let spEffect = node.addComponent(sp.Skeleton);
                let anim;
                switch (_buff)
                {
                    case BattleEnums.BufferType.Shields:
                        {
                            this.parent.getChildByName("EffectSpine/Shields").destroy();
                            node.name = "Shields";
                            spEffect.skeletonData = this.buff.get("skill_0005");
                        }
                        break;
                    case BattleEnums.BufferType.OffsetDamage:
                        {
                            this.parent.getChildByName("EffectSpine/SaintShields").destroy();
                            node.name = "SaintShields";
                            spEffect.skeletonData = this.buff.get("skill_0002");
                        }
                        break;
                    case BattleEnums.BufferType.Weak:
                        {

                        }
                    case BattleEnums.BufferType.InevitableKill:
                    case BattleEnums.BufferType.ReductionDamage:
                    case BattleEnums.BufferType.ShareDamage:
                    case BattleEnums.BufferType.Strength:
                        {

                        }
                    default:
                        {
                            this.parent.getChildByName("EffectSpine/Buff").destroy();
                            node.name = "Buff";
                        }
                        break;
                }
                anim = spEffect.skeletonData.getAnimsEnum();
                spEffect.setSkin("default");
                spEffect.setAnimation(0, String(anim[1]), true);

                spEffect.setCompleteListener((trackEntry) =>
                {
                    if (trackEntry.animation.name === String(anim[1]))
                    {
                        resolve();
                    }
                });
            } catch (error)
            {
                console.error("SpEffect 下的 UseBuffEffect 错误: ",error);
                resolve();
            }
        });
    }

    /**
     * 移除buff特效 （例如护盾破碎）
     * @param _buff buff类型
     * @returns 
     */
    public RemoveBuffEffect(_buff: BattleEnums.BufferType): Promise<void>
    {
        return new Promise((resolve) =>
        {
            try
            {
                let node: Node = null;
                switch (_buff)
                {
                    case BattleEnums.BufferType.Shields:
                        {
                            node = this.parent.getChildByPath("EffectSpine/Shields");
                            if (node)
                            {
                                var anim = node.getComponent(sp.Skeleton).skeletonData.getAnimsEnum();
                                node.getComponent(sp.Skeleton).setAnimation(0, String(anim[2]), false)
                                node.getComponent(sp.Skeleton).setCompleteListener((trackEntry) =>
                                    {
                                        if (trackEntry.animation.name === String(anim[2]))
                                        {
                                            node.destroy();
                                            resolve();
                                        }
                                    });
                            }
                        }
                        break;
                    case BattleEnums.BufferType.OffsetDamage:
                        {
                            node = this.parent.getChildByName("EffectSpine/SaintShields");
                            node.getComponent(sp.Skeleton).setAnimation(0, String(anim[2]), false)
                            node.getComponent(sp.Skeleton).setCompleteListener((trackEntry) =>
                            {
                                if (trackEntry.animation.name === String(anim[2]))
                                {
                                    node.destroy();
                                    resolve();
                                }
                            });
                        }
                        break;
                }
            } catch (error)
            {
                console.error("SpEffect 下的 RemoveBuffEffect 错误: ",error);
                resolve();
            }
        });
    }

    /**
     * 飞行物特效
     * @param _self 发射位置
     * @param _target 目标位置
     * @param _isGain 增益否
     */
    public ProjectilesEffect(_self:Vec3,_target:Vec3,_isGain:boolean): Promise<void>
    {
        return new Promise((resolve)=>
        {
            try
            {
                let str:string="";
                if(_isGain)
                {
                    str=this.roleSpCfg.Projectiles[0]+"/"+config.SpListConfig.get(this.roleSpCfg.Projectiles[0]).path;
                }
                else
                {
                    str=this.roleSpCfg.Projectiles[1]+"/"+config.SpListConfig.get(this.roleSpCfg.Projectiles[1]).path;
                }
                let node = new Node("Projectiles");
                node.layer=Layers.Enum.UI_2D;
                singleton.netSingleton.battle.panelNode.addChild(node);

                node.setPosition(_self);
                node.setScale(new Vec3(0.5,0.5,1));

                node.addComponent(Bullet).Init(_target,str,_isGain).then(()=>
                {
                    resolve();
                });
            }
            catch(error)
            {
                console.log("SpEffect 下的 UseProjectiles 错误: ",error)
            }
        });
    }
}

/**
 * @class UI特效类 
 * @author Hotaru
 * @CreateTime 2024/11/27
 */
export class SpEffectOnUI
{
    private canvas:Node=null;

    constructor()
    {
        this.canvas=GameManager.Instance.node;
    }


}

