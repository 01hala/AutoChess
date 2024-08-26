import { _decorator, Component, Node, sp } from 'cc';
import * as enums from '../../other/enums';
const { ccclass, property } = _decorator;
import * as common from '../../battle/AutoChessBattle/common';
import { loadAssets } from '../../bundle/LoadAsset';

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

    start() 
    {

    }

    update(deltaTime: number) {
        
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
                        console.warn(`子弹光球效果获取失败：`, error);
                    }
                }
            });
        }
        catch (error)
        {
            console.error(`Bullet 下的 LoadOnConfig 错误 err:${error}`);
        }
    }

    public ShowEffect(_effect:enums.SpecialEffect):Promise<void>
    {
        return new Promise((resolve , reject)=>
        {
            try
            {
                if (enums.SpecialEffect.Shields == _effect)
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
                switch(_effect)
                {
                    case enums.SpecialEffect.AddProperty:
                        {
                            this.LoadEffectData("EffectSpine/zqsx/attribute");
                            this.effectSkele.enabled=true;
                            let anims = this.effectSkele.skeletonData.getAnimsEnum();
                            this.effectSkele.setCompleteListener((trackEntry) =>
                            {
                                if (trackEntry.animation.name === String(anims[1]))
                                {
                                    this.effectSkele.enabled=false;
                                }
                            });
                        }
                        break;
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


