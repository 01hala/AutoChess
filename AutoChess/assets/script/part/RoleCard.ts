/*
 * RoleCard.ts
 * editor: Hotaru
 * 2024/05/22
 * 修改
 */
import { _decorator, Animation, assetManager, Button, ccenum, Color, color, Component, debug, enumerableProps, error, log, Node, RichText, Skeleton, sp, Sprite } from 'cc';
import * as singleton from '../netDriver/netSingleton';
import { InfoPanel } from '../secondaryPanel/InfoPanel';
import { loadAssets } from '../bundle/LoadAsset';
import { config } from '../config/config';
import { SendMessage } from '../other/MessageEvent';
const { ccclass, property } = _decorator;

export enum CardType
{
    Card=1,
    Painting=2
}

@ccclass('RoleCard')
export class RoleCard extends Component 
{
    @property({
        type:ccenum(CardType),
        displayName:"Type"
    })
    public type:CardType;

    private spr:Sprite;
    private painting:sp.Skeleton

    private lock:boolean=false;
    private numberText:RichText;

    public roleId:number = 0;

    public get Lock()
    {
        return this.lock;
    }

    public set Lock(value:boolean)
    {
        this.lock=value;
        //this.spr.grayscale=this.lock;
        if (CardType.Card == this.type)
        {
            this.node.getChildByPath("RoleAvatar/Sprite").getComponent(Sprite).grayscale = value;
        }
        if (CardType.Painting == this.type)
        {
            this.node.getChildByPath("Sprite").getComponent(sp.Skeleton).color = new Color().fromHEX('#686868');
        }
    }

    protected onLoad(): void 
    {
        if(CardType.Card==this.type)
        {
            this.spr=this.node.getChildByPath("RoleAvatar/Sprite").getComponent(Sprite);
            this.numberText=this.node.getChildByPath("NumberText").getComponent(RichText);
        }
        if(CardType.Painting==this.type)
        {
            this.painting=this.node.getChildByPath("Sprite").getComponent(sp.Skeleton);
        }

        this.node.active=false;
    }


    start() 
    {
        this.node.on(Button.EventType.CLICK,()=>
        {
            console.log("OpenInfoBoard");
            this.node.dispatchEvent(new SendMessage('OpenCardInfo',true,this.roleId));

        },this);

    }

    public async Init(_id:number)
    {
        try
        {
            this.roleId=_id;
            
            this.LoadOnConfig();
            
        }
        catch(error)
        {
            console.error('RoleCard 下 Init 错误 err: ',error);
        }
    }

    public SetNumberText(_molecule:number,_denominator:number)
    {
        this.numberText.string=
        "<color=#000000>"+ _molecule + "</color>" +
        "<color=#000000> | "+ _denominator +"</color>";
    }

    private async LoadOnConfig()
    {
        try
        {
            let jconfig = config.RoleConfig.get(this.roleId);
            if(CardType.Card==this.type)
            {
                let img = await loadAssets.LoadImg(jconfig.Avatar);
                if(img)
                {
                    this.node.getChildByPath("RoleAvatar/Sprite").getComponent(Sprite).spriteFrame=img;
                }
            }
            if(CardType.Painting==this.type)
            {
                loadAssets.LoadSkeletonData(jconfig.Skel,(data)=>
                {
                    console.log(`当前 ${jconfig.Id} 的动画信息 ${data}`);
                    try
                    {
                        this.painting.skeletonData = data;
                        let anims = data.getAnimsEnum();
                        //this.roleSprite.animation="animation";
                        this.painting.setAnimation(0, String(anims[1]), true);
                    }
                    catch (error)
                    {
                        console.warn(`角色 ${jconfig.Id} 的动画设置失败：`, error);
                    }
                    this.node.active=true;
                    this.node.getComponent(Animation).play();
                });
                // let skdata:sp.SkeletonData;
                // let ads=jconfig.Skel.split('/');
                // let path=ads[1]+"/"+ads[2];
                // console.log(ads[0]);
                // assetManager.loadBundle(ads[0],(error,bundle)=>
                // {
                //     if(error)
                //     {
                //         console.log("没有此bundle");
                //     }
                //     else
                //     {
                //         bundle.load(path,sp.SkeletonData,(error,data)=>
                //         {
                //             if(error)
                //             {
                //                 console.log("没有此资源");
                //             }
                //             else
                //             {
                //                 skdata=data;
                               
                //             }
                //         })
                //     }
                // });
            }
        }
       catch(error)
       {
            console.error("RoleCard 下的 LoadOnConfig 错误 err:",error)
       }
    }
}


