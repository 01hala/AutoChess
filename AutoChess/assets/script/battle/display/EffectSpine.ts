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

        this.effectSkele.enabled=false;
        this.shieldSkele.enabled=false;
    }

    private LoadEffectData(_str:string)
    {
        try
        {
            loadAssets.LoadSkeletonData(_str, (data) =>
            {
                if (data)
                {
                    try
                    {
                        this.effectSkele.skeletonData = data;
                        let anims = data.skeletonData.getAnimsEnum();
                        this.effectSkele.setAnimation(0, String(anims[1]), true);
                    }
                    catch (error)
                    {
                        console.warn(`效果获取失败：`, error);
                    }
                }
            });
        }
        catch (error)
        {
            console.error(`Bullet 下的 LoadOnConfig 错误 err:${error}`);
        }
    }

    private LoadBuffSpine(_buffID:number)
    {
        try
        {
            let jconfig=config.BufferConfig.get(_buffID);
            this.LoadEffectData(jconfig.Skel);
        }
        catch(error)
        {
            console.error("EffectSpine 下的 LoadBuffSpine 错误：",error);
        }
    }

    public ShowEffect(_effect:enums.SpecialEffect , _buffID?:number):Promise<void>
    {
        return new Promise((resolve , reject)=>
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
                            this.shieldSkele.enabled=true;
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
                            this.LoadEffectData("EffectSpine/zqsx/attribute");
                            show=true;
                        }
                        break;
                    case enums.SpecialEffect.AddBuff:
                        {
                            this.LoadBuffSpine(_buffID);
                            show=true;
                        }
                        break;
                    case enums.SpecialEffect.Summon:
                        {
                            this.LoadEffectData("EffectSpine/magic/magic");
                            show=true
                        }
                        break;
                }
                if(show)
                {
                    this.effectSkele.enabled = true;
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
                            this.shieldSkele.enabled=false;
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


