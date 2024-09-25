import { _decorator, Component, Node, sp } from 'cc';
import * as enums from '../../other/enums';
const { ccclass, property } = _decorator;
import * as common from '../../battle/AutoChessBattle/common';
import { loadAssets } from '../../bundle/LoadAsset';
import { config } from '../AutoChessBattle/config/config';

@ccclass('EffectSpine')
export class EffectSpine extends Component 
{
    private effectSkele:sp.Skeleton;
    private shieldSkele:sp.Skeleton;

    protected onLoad(): void
    {
        this.effectSkele=this.node.getChildByPath("Effect").getComponent(sp.Skeleton);
        this.shieldSkele=this.node.getChildByPath("Shield").getComponent(sp.Skeleton);

        this.effectSkele.node.active=false;
        this.shieldSkele.node.active=false;
    }

    private async LoadEffectData(_str:string , _style:number)
    {
        try
        {
            await loadAssets.LoadSkeletonData(_str, (data) =>
            {
                if (data)
                {
                    try
                    {
                        this.effectSkele.skeletonData = data;
                        let anims = data.getAnimsEnum();
                        this.effectSkele.setAnimation(0, String(anims[_style]), true);
                    }
                    catch (error)
                    {
                        console.warn(`效果获取失败：${error}`);
                    }
                }
            });
        }
        catch (error)
        {
            console.error(`EffectSpine 下的 LoadEffectData错误 err:${error}`);
        }
    }

    private async LoadBuffSpine(_buffID:number)
    {
        try
        {
            let jconfig=config.BufferConfig.get(_buffID);
            await this.LoadEffectData(jconfig.Skel , 1);
        }
        catch(error)
        {
            console.error("EffectSpine 下的 LoadBuffSpine 错误：",error);
        }
    }

    /**
     * 显示特效
     * @param _effect 效果类型
     * @param _isParallel 是否是并发效果
     * @param _style 样式
     * @param _buffID buff
     * 
     */
    public ShowEffect(_effect:enums.SpecialEffect ,_isParallel:boolean, _style:number = 1 , _buffID?:number):Promise<void>
    {
        return new Promise(async (resolve , reject)=>
        {
            try
            {   
                let show=false;
                switch (_effect)
                {
                    case enums.SpecialEffect.Shields:
                        {
                            let anims = this.shieldSkele.skeletonData.getAnimsEnum();
                            this.shieldSkele.setAnimation(0, String(anims[2]), true);
                            this.shieldSkele.node.active=true;
                            this.shieldSkele.setCompleteListener((trackEntry)=>
                            {
                                if(trackEntry.animation.name === String(anims[2]))
                                {
                                    this.shieldSkele.setAnimation(0, String(anims[1]), true);
                                }
                            });
                        }
                        break;
                    case enums.SpecialEffect.AddProperty:
                        {
                            if(!_isParallel)
                            {
                                await this.LoadEffectData("EffectSpine/zqsx/level up" ,_style);
                            }
                            else
                            {
                                await this.LoadEffectData("EffectSpine/zqsx/attribute",_style);
                            }
                            show=true;
                        }
                        break;
                    case enums.SpecialEffect.AddBuff:
                        {
                            await this.LoadBuffSpine(_buffID);
                            show=true;
                        }
                        break;
                    case enums.SpecialEffect.Summon:
                        {
                            await this.LoadEffectData("EffectSpine/magic/magic",_style);
                            show=true
                        }
                        break;
                    case enums.SpecialEffect.Heath:
                        {
                            await this.LoadEffectData("EffectSpine/hs/hushi",_style);
                            show=true;
                        }
                        break;
                    case enums.SpecialEffect.SwapProperties:
                        {
                            await this.LoadEffectData("EffectSpine/jhsx/change",_style);
                            show=true;
                        }
                        break;
                }
                if(show)
                {
                    this.effectSkele.node.active = true;
                    let anims = this.effectSkele.skeletonData.getAnimsEnum();
                    this.effectSkele.setCompleteListener((trackEntry) =>
                    {
                        if (trackEntry.animation.name === String(anims[1]))
                        {
                            this.effectSkele.enabled = false;
                        }
                    });
                }
                resolve();
            }
            catch(error)
            {
                console.error("EffectSpine 下的 ShowEffect 错误：",error);
                reject();
            }
        });
    }

    public RemoveEffect(_effect:enums.SpecialEffect):Promise<void>
    {
        return new Promise((resolve , reject)=>
            {
                try
                {
                    if (enums.SpecialEffect.Shields == _effect)
                    {
                        let anims = this.shieldSkele.skeletonData.getAnimsEnum();
                        this.shieldSkele.setAnimation(0, String(anims[2]), true);
                        this.shieldSkele.timeScale=-1;
                        this.shieldSkele.setCompleteListener((trackEntry) =>
                        {
                            this.shieldSkele.node.active=false;
                        });
                    }
                    resolve();
                }
                catch(error)
                {
                    console.error("EffectSpine 下的 RemoveEffect 错误：",error);
                    reject();
                }
            });
    }
}


