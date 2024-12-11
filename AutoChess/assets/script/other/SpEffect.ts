
import { _decorator, assetManager, Component, director, instantiate, Layers, Node, sp, UITransform, Vec3 } from 'cc';
import * as enums from './enums';
import * as common from '../battle/AutoChessBattle/common';
import { loadAssets } from '../bundle/LoadAsset';
import { config } from '../battle/AutoChessBattle/config/config';
import * as BattleEnums from '../battle/AutoChessBattle/BattleEnums'
import { delay } from './sleep';
const { ccclass, property } = _decorator;

export class spEffectObj
{
    public key:string;
    public battleType:BattleEnums.BufferType | BattleEnums.SwapPropertiesType;
}

/**
 * @class 特效类
 * @author Hotaru
 * @CreateTime 2024/11/27
 */
export class SpEffect
{
    //被召唤出场特效
    private onSummon: sp.SkeletonData=null; 
    //技能起手特效
    private useSkill: sp.SkeletonData=null;
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
    private roleId:number=0;

    private spConfig=null;

    constructor(_roleId:number,_parent: Node)
    {
        this.parent = _parent;
        this.roleId=_roleId;
    }

    public async init()
    {
        console.log("初始化特效类");
        this.spConfig=config.RoleSpConfig.get(this.roleId);
        
        let allAwait=[];
       
        allAwait.push(new Promise<void>(async(resolve) => {
            //单体增强时特效
            let address = "EffectSpine/" + this.spConfig.IntensifierSelf + "/" + config.SpListConfig.get(this.spConfig.IntensifierSelf).path;
            //console.log("单体增强特效文件路径：", address);
            await loadAssets.LoadSkeletonData(address, (data) => {
                if (data)
                {
                    this.intensifierSelf = data;
                }
                resolve();
            });
        }));

        allAwait.push(new Promise<void>(async(resolve) => {
            //单体增强时特效
            let address = "EffectSpine/" + this.spConfig.IntensifierColony + "/" + config.SpListConfig.get(this.spConfig.IntensifierColony).path;
            //console.log("群体增强特效文件路径：", address);
            await loadAssets.LoadSkeletonData(address, (data) =>
            {
                if (data)
                {
                    this.intensifierColony = data;
                }
                resolve();
            });
        }));

        allAwait.push(new Promise<void>(async(resolve) => {
            //召唤出场特效
            let address = "EffectSpine/" + this.spConfig.OnSummon + "/" + config.SpListConfig.get(this.spConfig.OnSummon).path;
            //console.log("出场特效文件路径：", address);
            await loadAssets.LoadSkeletonData(address, (data) =>
            {
                if (data)
                {
                    this.onSummon = data;
                }
                resolve();
            });
        }));
        
        allAwait.push(new Promise<void>(async(resolve) => {
            //使用技能
            if(!("null"===this.spConfig.UseSkill))
            {
                let address = "EffectSpine/" + this.spConfig.UseSkill + "/" + config.SpListConfig.get(this.spConfig.UseSkill).path;
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
        }));

        allAwait.push(new Promise<void>(async(resolve) => {
            //buff特效
            let address;
            for (let t of this.spConfig.Buff)
            {
                address = "EffectSpine/" + t + "/" + config.SpListConfig.get(t).path;
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
        }));
    
        allAwait.push(new Promise<void>(async(resolve) => {
            //技能生效特效
            let address;
            for (let t of this.spConfig.CheckSkill)
            {
                address = "EffectSpine/" + t + "/" + config.SpListConfig.get(t).path;
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

                    switch(this.spConfig.useSkill)
                    {
                        case "skill_0022":
                            {
                                node.setScale(new Vec3(0.3,0.3,1));
                            }
                            break;
                        case "skill_0007":
                        {
                            node.setScale(new Vec3(0.5,0.5,1));
                        }
                        break;
                    }

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
                    console.error("SpEffect 下的 UseSkillEffect 错误: ",error);
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
                if (!this.intensifierSelf)
                {
                    console.warn("单体增益 特效为空");
                    resolve();
                }
                if (!this.intensifierColony)
                {
                    console.warn("群体增益 特效为空");
                    resolve();
                }
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
                            spEffect.skeletonData = this.buff.get("shield");
                        }
                        break;
                    case BattleEnums.BufferType.OffsetDamage:
                        {

                        }
                    
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
                }
            } catch (error)
            {
                console.error("SpEffect 下的 RemoveBuffEffect 错误: ",error);
                resolve();
            }
        });
    }
}

/**
 * @class UI特效类
 * @author Hotaru
 * @CreateTime 2024/11/27
 */
export class SpEffectUI
{

}

