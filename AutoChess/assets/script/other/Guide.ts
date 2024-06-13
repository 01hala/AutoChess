import { _decorator, BlockInputEvents, Button, Camera, Component, EventTouch, instantiate, Node, RichText, tween, Tween, UITransform, Vec3 } from 'cc';
import { SendEvent } from './MessageEvent';
import { GameManager } from './GameManager';
import { ShopArea } from '../ready/display/ShopArea';
import { RoleArea } from '../ready/display/RoleArea';
import { RoleIcon } from '../ready/display/RoleIcon';
import * as common from "../serverSDK/common"
import * as singleton from '../netDriver/netSingleton';
const { ccclass, property } = _decorator;

@ccclass('Guide')
export class Guide extends Component
{
    //步骤
    public step:number;
    //结束步骤
    public end:number;
    //当前步骤
    private next:number;

    public pointer:Node;
    public guideText:Node;
    private skipBtn:Node;

    private mask:Node;

    private siblingIndex:number;
    private tnode:Node
    private tween:Tween<Node>;

    private interval;

    protected onLoad(): void
    {
        this.pointer=this.node.getChildByPath("Pointer");
        this.guideText=this.node.getChildByPath("Mask/GuideText");
        this.mask=this.node.getChildByPath("Mask");
        this.skipBtn=this.node.getChildByPath("Skip_Btn");

    }

    protected start(): void
    {
        this.mask.on(Button.EventType.CLICK, () =>
        {
            if (this.step >= 3 && this.step <= 7)
            {
                this.Checkguide();
                this.step++;
            }
        }, this);
        
        this.mask.on(Node.EventType.TOUCH_END,this.OnTouch,this);
        this.mask.on(Node.EventType.TOUCH_START,this.OnTouch,this);

        this.skipBtn.on(Button.EventType.CLICK, () =>
        {
            GameManager.Instance.guide = null;
            clearInterval(this.interval);
            singleton.netSingleton.player.guide_step_ntf(common.GuideStep.Done);
            this.node.destroy();
        }, this);
    }
    
    public async Init(_step:common.GuideStep)
    {   
        this.step=_step+1;
        this.next=_step;
        
        this.end=common.GuideStep.Done;

        this.node.setSiblingIndex(101);

        this.StartGuide();
    }

    private OnTouch(event:EventTouch)
    {
        if(this.step < 3 || this.step > 7)
        {
            let t=this.tnode.getChildByName("Button");
            if(null==t)
            {
                t=this.tnode;
            }
            let contentSizeX=t.getComponent(UITransform).contentSize.x/2;
            let contentSizeY=t.getComponent(UITransform).contentSize.y/2;
            let tpos = this.node.parent.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(t.worldPosition.x,t.worldPosition.y,0));
    
            let touchPos = this.node.parent.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y,0));
            
            console.log(touchPos);
            console.log(tpos);
            if(touchPos.x > (tpos.x - contentSizeX) && touchPos.x < (tpos.x + contentSizeX))
            {
                if(touchPos.y > (tpos.y - contentSizeY) && touchPos.y < (tpos.y + contentSizeY))
                {
                    event.preventSwallow = true;
                    this.Checkguide();
                }
            }
        }
    }

    private StartGuide()
    {
        this.interval=setInterval(()=>
        {
            if(this.next!=this.step)
            {
                this.OnGuide();
                this.next = this.step;
            }
            if(this.step>=this.end)
            {
                GameManager.Instance.guide = null;
                clearInterval(this.interval);
                singleton.netSingleton.player.guide_step_ntf(common.GuideStep.Done);
                this.node.destroy();
            }
        }, 50);
    }

    private OnGuide()
    {
        try
        {
            let t=null;
            this.mask.active=true;
            this.node.getChildByPath("BG").active=true;
            this.node.setSiblingIndex(101);
            this.mask.getComponent(BlockInputEvents).enabled=true;
            switch(this.step)
            {
                case 1:
                    t=this.node.parent.getChildByPath("MainInterface/MainPanel/BottomLayer/StartHouse");         
                    //this.pointer.active=true;
                    //this.pointer.setWorldPosition(this.tnode.getChildByPath("Start_Btn").worldPosition);
                    this.guideText.setPosition(new Vec3(-211.372,54.5225,0));
                    this.guideText.getComponent(RichText).string="点击游戏大厅";
                    break;
                case 2:
                    //this.pointer.active=true;
                    //this.pointer.setWorldPosition(this.tnode.worldPosition);
                    t=this.node.parent.getChildByPath("MainInterface/StartGamePanel/AthleticsWindow/Normal");
                    this.guideText.setPosition(new Vec3(0,-365.5275,0));
                    this.guideText.getComponent(RichText).string="点击匹配";
                    break;
                case 3:
                    t=this.node.parent.getChildByPath("ReadyPanel/TopArea/HpInfo");
                    this.guideText.setPosition(new Vec3(0,595.665,0));
                    this.guideText.getComponent(RichText).string="生命值";
                    break;
                case 4:
                    t=this.node.parent.getChildByPath("ReadyPanel/TopArea/TrophyInfo");
                    this.guideText.setPosition(new Vec3(0,595.665,0));
                    this.guideText.getComponent(RichText).string="奖杯";
                    break;
                case 5:
                    t=this.node.parent.getChildByPath("ReadyPanel/TopArea/CoinInfo");
                    this.guideText.setPosition(new Vec3(0,595.665,0));
                    this.guideText.getComponent(RichText).string="金币";
                    break;
                case 6:
                    t=this.node.parent.getChildByPath("ReadyPanel/TopArea/RoundInfo");
                    this.guideText.setPosition(new Vec3(0,595.665,0));
                    this.guideText.getComponent(RichText).string="回合";
                    break;
                case 7:
                    t=this.node.parent.getChildByPath("ReadyPanel/ShopArea");
                    this.guideText.setPosition(new Vec3(0,-637.995,0));
                    this.guideText.getComponent(RichText).string="商店";
                    break;
                case 8:
                    //this.pointer.active=true;
                    //this.pointer.setWorldPosition(this.tnode.worldPosition);
                    //this.tween=tween(this.pointer).to(1,{position:this.node.parent.getChildByPath("ReadyPanel/RoleArea/Node/Location_0").worldPosition}).repeatForever().start();
                    t=this.node.parent.getChildByPath("ReadyPanel/ShopArea").getComponent(ShopArea).shopRoles[0];
                    this.guideText.setPosition(new Vec3(0,-637.995,0));
                    this.guideText.getComponent(RichText).string="拖拽购买角色";
                    break;
                case 9:
                    for(let r of this.node.parent.getChildByPath("ReadyPanel/RoleArea").getComponent(RoleArea).rolesNode)
                    {
                        if(null != r)
                        {
                            t=r;
                            break;
                        }
                    }
                    //this.pointer.setWorldPosition(this.tnode.worldPosition);
                    this.guideText.setPosition(new Vec3(0,-85.498,0));
                    this.guideText.getComponent(RichText).string="点击角色查看详细界面";
                    break;
    
                default:break;
            }
            this.tnode=instantiate(t);
            try
            {
                this.tnode.getChildByName("Button")?.getComponent(Button).destroy();
                this.tnode.getComponent(RoleIcon)?.destroy();
            }
            catch
            {

            }
            this.tnode.setParent(this.node);
            this.tnode.setWorldPosition(t.worldPosition);
        }
        catch(error)
        {
            console.error("Guide 下的 OnGuide 错误 err:",error);
        }
    }

    public Checkguide()
    {
        if(this.tnode)
        {
            this.tnode.destroy();
        }
        
        if (this.step < 3 || this.step > 7)
        {
            this.mask.getComponent(BlockInputEvents).enabled=false;
            this.mask.active = false;   //此处必须关闭mask中断touch侦听，不然OnTouch会多执行一次导致报错，也不能删掉这行，不然就判断不到触点位置是否处于范围内
            if(this.step > 7)
            {
                this.node.getChildByPath("BG").active=false;
            }
        }
        //if(8==this.step)
        //{
            //this.tween.stop();
        //}
        //this.pointer.active=false;
    }
}


