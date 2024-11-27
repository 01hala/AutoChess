
import { _decorator, Component, instantiate, Node, sp } from 'cc';
import * as enums from './enums';
import * as common from '../battle/AutoChessBattle/common';
import { loadAssets } from '../bundle/LoadAsset';
import { config } from '../battle/AutoChessBattle/config/config';
import * as BattleEnums from '../battle/AutoChessBattle/BattleEnums'
const { ccclass, property } = _decorator;

/**
 * @class 特效类
 * @author Hotaru
 * @CreateTime 2024/11/27
 */
export class SpEffect
{
    //自我增强时特效
    private intensifierSelf: sp.SkeletonData;
    //被召唤特效
    private onSummon: sp.SkeletonData;
    //特殊战斗特效
    private specialBattle: sp.SkeletonData;
    //触发技能特效
    private skill: sp.SkeletonData;

    //群体增强时特效
    private intensifierColony: sp.SkeletonData;
    //存在buff特效
    private buff: Map<string, sp.SkeletonData>;

    //父节点
    private parent: Node;

    constructor(_roleId: number, _parent: Node)
    {
        this.parent = _parent;
    }

    /**
     * 使用技能特效
     * @returns 
     */
    public UseSkillEffect(): Promise<void>
    {
        return new Promise((resolve) =>
        {
            try
            {
                let node = instantiate(new Node("SkillEffect"));
                node.setParent(this.parent.getChildByPath("EffectSpine"));
                let spEffect = node.addComponent(sp.Skeleton);
                spEffect.skeletonData = this.skill;
                let anim = this.skill.getAnimsEnum();
                spEffect.setAnimation(0, String(anim[1]), false);

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
        });
    }

    /**
     * 使用增益特效
     * @param _isColony 是否是群体效果
     * @returns 
     */
    public UseIntensifierEffect(_isColony: boolean): Promise<void>
    {
        return new Promise((resolve) =>
        {
            try
            {
                let node = instantiate(new Node("IntensifierEffect"))
                node.setParent(this.parent.getChildByPath("EffectSpine"));
                let spEffect = node.addComponent(sp.Skeleton);
                if (_isColony)
                {
                    spEffect.skeletonData = this.intensifierColony;
                }
                else
                {
                    spEffect.skeletonData = this.intensifierSelf;
                }
                let anim = spEffect.skeletonData.getAnimsEnum();
                spEffect.setAnimation(0, String(anim[1]), false);

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
                let node = instantiate(new Node("OnSummonEffect"))
                node.setParent(this.parent.getChildByPath("EffectSpine"));
                let spEffect = node.addComponent(sp.Skeleton);
                spEffect.skeletonData = this.onSummon;
                let anim = this.onSummon.getAnimsEnum();
                spEffect.setAnimation(0, String(anim[1]), false);

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
     * 使用特殊战斗特效
     * @returns 
     */
    public UseSpecialBattleEffet(): Promise<void>
    {
        return new Promise((resolve) =>
        {

            try
            {
                let node = instantiate(new Node("SpecialBattleEffect"))
                node.setParent(this.parent.getChildByPath("EffectSpine"));
                let spEffect = node.addComponent(sp.Skeleton);
                spEffect.skeletonData = this.specialBattle;
                let anim = this.specialBattle.getAnimsEnum();
                spEffect.setAnimation(0, String(anim[1]), false);

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
                console.error("SpEffect 下的 UseSpecialBattleEffet 错误: ",error);
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
                let node = instantiate(new Node());
                node.setParent(this.parent.getChildByPath("EffectSpine"));
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
                }
                anim = spEffect.skeletonData.getAnimsEnum();
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
                            }

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
}

/**
 * @class UI特效类
 * @author Hotaru
 * @CreateTime 2024/11/27
 */
export class SpEffectUI
{

}

