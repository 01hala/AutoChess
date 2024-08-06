/*
 * RoleCard.ts
 * editor: Hotaru
 * 2024/05/22
 * 修改
 */
import { _decorator, Animation, assetManager, Button, ccenum, Color, color, Component, debug, enumerableProps, error, Label, log, Node, RichText, Skeleton, sp, Sprite } from 'cc';
import * as singleton from '../netDriver/netSingleton';
import { InfoBoard } from '../secondaryPanel/InfoBoard';
import { loadAssets } from '../bundle/LoadAsset';
import { config } from '../battle/AutoChessBattle/config/config';
import { SendMessage } from '../other/MessageEvent';
import { AudioManager } from '../other/AudioManager';
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
    //立绘
    private spr:Sprite;
    private painting:sp.Skeleton
    //是否解锁
    private lock:boolean=false;
    //碎片数量
    private numberText:Label;
    //角色ID
    public roleId:number = 0;
    //角色名
    private roleName:string;
    //阶数
    private stage:number;
    //解锁按钮
    private unlockBtn:Node;

    //获取阶数
    public get Stage()
    {
        return this.stage;
    }
    //设置阶数
    public set Stage(value:number)
    {
        this.stage=value;
        this.node.getChildByPath("Info/Stage/RichText").getComponent(RichText).string="<color=#1d994f><outline color=#74eda5 width=4>"+ value +"</outline></color>";
    }

    //获取角色名
    public get Name()
    {
        return this.roleName;
    }
    //设置角色名
    public set Name(value:string)
    {
        this.roleName=value;
        this.node.getChildByPath("Info/Name").getComponent(RichText).string="<color=#ffffff>"+ value +"</color>";
    }

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
            let color;
            if(value)
            {
                color = new Color().fromHEX('#686868');
                this.unlockBtn.active=true;
            }
            else
            {
                color = new Color().fromHEX('#FFFFFF');
                this.unlockBtn.active=false;
            }
            this.node.getChildByPath("Sprite").getComponent(sp.Skeleton).color = color;
        }
    }

    protected onLoad(): void 
    {
        if(CardType.Card==this.type)
        {
            this.spr=this.node.getChildByPath("RoleAvatar/Sprite").getComponent(Sprite);
        }
        if(CardType.Painting==this.type)
        {
            this.painting=this.node.getChildByPath("Sprite").getComponent(sp.Skeleton);
        }

        this.numberText=this.node.getChildByPath("Unlock_Btn/Label").getComponent(Label);
        this.unlockBtn=this.node.getChildByPath("Unlock_Btn");

        this.painting.node.active=false;
    }


    start() 
    {
        this.node.on(Button.EventType.CLICK,()=>
        {
            console.log("OpenInfoBoard");
            AudioManager.Instance.PlayerOnShot("Sound/sound_character_select_01");
            this.node.dispatchEvent(new SendMessage('OpenCardInfo',true,this.roleId));

        },this);

        this.unlockBtn.on(Button.EventType.CLICK,()=>
        {
            this.Lock=false;
            //合成代码...
        },this);

        this.unlockBtn.getComponent(Button).enabled=false;
    }

    public Init(_id:number,_res:string):Promise<void>
    {
        return new Promise(async(resolve)=>
        {
            try
            {
                this.roleId=_id;
                if (CardType.Card == this.type)
                {
                    let img = await loadAssets.LoadImg(_res);
                    if (img)
                    {
                        this.node.getChildByPath("RoleAvatar/Sprite").getComponent(Sprite).spriteFrame = img;
                    }
                }
                if (CardType.Painting == this.type)
                {
                    loadAssets.LoadSkeletonData(_res, (data) =>
                    {
                        //console.log(`当前 ${this.roleId} 的动画信息 ${data}`);
                        if (data)
                        {
                            try
                            {
                                this.painting.skeletonData = data;
                                let anims = data.getAnimsEnum();
                                //this.roleSprite.animation="animation";
                                this.painting.setAnimation(0, String(anims[1]), true);
                            }
                            catch (error)
                            {
                                console.warn(`角色 ${this.roleId} 的动画设置失败：`, error);
                            }
                        }
                        if(this.node)
                        {
                            this.painting.node.active=true;
                            this.node.getComponent(Animation).play();
                        }
                    });
                }
            }
            catch(error)
            {
                console.error('RoleCard 下 Init 错误 err: ',error);
            }
            resolve();
        });
    }

    public SetNumber(_molecule:number,_denominator:number)
    {
        this.numberText.string= "" + _molecule  + " | " + _denominator;
        if(_molecule>=_denominator)
        {
            this.unlockBtn.getComponent(Button).enabled=true;
            this.unlockBtn.getComponent(Sprite).grayscale=false;
            this.numberText.string="可合成";
        }
    }
}
