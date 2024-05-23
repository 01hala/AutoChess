/*
 * RoleCard.ts
 * editor: Hotaru
 * 2024/05/22
 * 修改
 */
import { _decorator, Animation, Button, ccenum, Color, color, Component, debug, enumerableProps, log, Node, RichText, Skeleton, sp, Sprite } from 'cc';
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
            
            await this.LoadOnConfig();
            this.node.active=true;
            this.node.getComponent(Animation).play();
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
                let skdata = await loadAssets.LoadSkeletonData(jconfig.Skel);
                if(skdata)
                    {
                        console.log(`当前 ${jconfig.Id} 的动画信息 ${skdata}`);
                        try
                        {
                            this.painting.skeletonData=skdata;
                            let anims=skdata.getAnimsEnum();
                            //this.roleSprite.animation="animation";
                            this.painting.setAnimation(0,String(anims[1]),true);
                        }
                        catch
                        {
                            console.warn(`角色 ${jconfig.Id} 的动画设置失败`);
                        }
                    }
            }
        }
       catch(error)
       {
            console.error("RoleCard 下的 LoadOnConfig 错误 err:",error)
       }
    }
}


