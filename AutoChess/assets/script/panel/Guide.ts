import { _decorator, BlockInputEvents, Button, Camera, Component, EventTouch, instantiate, Node, RichText, tween, Tween, UITransform, Vec3 } from 'cc';
import { GameManager } from '../other/GameManager';
import { ShopArea } from '../ready/display/ShopArea';
import { RoleArea } from '../ready/display/RoleArea';
import { RoleIcon } from '../ready/display/RoleIcon';
import * as common from "../battle/AutoChessBattle/common"
import * as singleton from '../netDriver/netSingleton';
import { sleep } from '../other/sleep';
const { ccclass, property } = _decorator;

@ccclass('Guide')
export class Guide extends Component
{
    //步骤
    public step:common.GuideStep;
    //结束步骤
    public end:common.GuideStep;
    //当前步骤
    public next:common.GuideStep;
    //面板
    private panel:Node;
    //步骤文本
    public guideText:Node;
    //跳过按钮
    private skipBtn:Node;
    //拖动提示手
    private hand:Node;
    //层级
    private siblingIndex:number;
    //临时物体
    private tnode:Node
    //缓动
    private tween:Tween<Node>;

    private interval;

    protected onLoad(): void
    {
        this.panel=this.node.getChildByPath("Panel");
        this.guideText=this.node.getChildByPath("Panel/GuideText");
        this.hand=this.node.getChildByPath("Panel/Hand");
        this.skipBtn=this.node.getChildByPath("Skip_Btn");
    }

    protected start(): void
    {
        this.panel.on(Button.EventType.CLICK, () =>
        {
            switch(this.step)
            {
                case common.GuideStep.CoinInfo: 
                case common.GuideStep.HPInfo: 
                case common.GuideStep.TrophyInfo:
                case common.GuideStep.RoundInfo:
                    {
                        this.CheckGuide();
                    }
            }
        }, this);
        
        this.panel.on(Node.EventType.TOUCH_END,this.OnTouch,this);
        this.panel.on(Node.EventType.TOUCH_START,this.OnTouch,this);

        this.skipBtn.on(Button.EventType.CLICK, () =>
        {
            GameManager.Instance.guide = null;
            //clearInterval(this.interval);
            singleton.netSingleton.player.guide_step_ntf(common.GuideStep.Done);
            this.panel.getComponent(BlockInputEvents).enabled=false;
            this.node.destroy();
        }, this);
    }

    protected onDestroy(): void
    {
        this.destroy();
    }
    
    public async Init(_step:common.GuideStep)
    {   
        this.step = _step;
        if(common.GuideStep.None==this.step)
        {
            this.next=common.GuideStep.ClickGameLobby;
        }
        this.panel.active=false;
        this.skipBtn.active=false;
        this.node.getChildByPath("BG").active=false;
        // this.next = _step;
        // this.end = common.GuideStep.Done;
        // this.node.setSiblingIndex(101);
        // this.StartGuide();
        this.CheckGuide();
    }

    private OnTouch(event:EventTouch)
    {
        switch(this.step)
        {
            case common.GuideStep.ClickGameLobby:
            case common.GuideStep.ClickMatch:
            case common.GuideStep.RoleInfo:
            case common.GuideStep.BuyRole: 
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
                        this.CheckGuide();
                    }
                }
            }
            break;
        }
    }

    private StartGuide()
    {
        // this.interval=setInterval(()=>
        // {
        //     if(this.next!=this.step)
        //     {
        //         this.OnGuide();
        //         this.next = this.step;
        //     }
        //     if(this.step>=this.end)
        //     {
        //         GameManager.Instance.guide = null;
        //         clearInterval(this.interval);
        //         singleton.netSingleton.player.guide_step_ntf(common.GuideStep.Done);
        //         this.node.destroy();
        //     }
        // }, 50);
    }

    public CheckGuide()
    {
        try
        {
            if (this.tnode)
            {
                this.tnode.destroy();
            }
            if (this.tween)
            {
                this.tween.stop();
            }
            this.hand.active = false;
            this.tween = null;

            switch(this.step)
            {
                case common.GuideStep.ClickGameLobby: this.next = common.GuideStep.ClickMatch;break;
                case common.GuideStep.ClickMatch: this.next = common.GuideStep.BuyRole;break;
                case common.GuideStep.RoleInfo: this.next = common.GuideStep.HPInfo;break;
                case common.GuideStep.BuyRole: this.next = common.GuideStep.CoinInfo;break;
                case common.GuideStep.CoinInfo: this.next = common.GuideStep.RoleInfo;break;
                case common.GuideStep.HPInfo: this.next = common.GuideStep.TrophyInfo;break;
                case common.GuideStep.TrophyInfo: this.next = common.GuideStep.RoundInfo;break;
                case common.GuideStep.RoundInfo: this.next = common.GuideStep.Done;break;
            }

            switch (this.step)
            {
                case common.GuideStep.ClickGameLobby:
                case common.GuideStep.ClickMatch:
                case common.GuideStep.RoleInfo:
                case common.GuideStep.BuyRole:
                    {
                        this.panel.getComponent(BlockInputEvents).enabled = false;
                        this.node.getChildByPath("BG").active = false;
                        this.skipBtn.active=false;
                        this.panel.active = false;   //此处必须关闭panel中断touch侦听，不然OnTouch会多执行一次导致报错，也不能删掉这行，不然就判断不到触点位置是否处于范围内
                    }
                    break;
                case common.GuideStep.CoinInfo:
                case common.GuideStep.HPInfo:
                case common.GuideStep.TrophyInfo:
                case common.GuideStep.RoundInfo:
                    {
                        this.OnGuide(this.next);
                    }
                    break;
                default: break;
            }
            console.warn(this.next);
        }
        catch (error)
        {
            console.error("Guide 下的 CheckGuide 错误:",error);
        }
    }

    public OnGuide(_step:common.GuideStep)
    {
        try
        {
            return;
            singleton.netSingleton.player.guide_step_ntf(_step);
            this.step=_step;
            this.panel.active=true;
            this.skipBtn.active = true;
            this.node.getChildByPath("BG").active=true;
            this.node.setSiblingIndex(101);
            this.panel.getComponent(BlockInputEvents).enabled=true;

            let t=null;
            switch(_step)
            {
                case common.GuideStep.ClickGameLobby:
                    t=this.node.parent.getChildByPath("MainInterface/MainPanel/BottomLayer/StartHouse");         
                    this.guideText.setPosition(new Vec3(-211.372,54.5225,0));
                    this.guideText.getComponent(RichText).string="点击游戏大厅";
                    break;
                case common.GuideStep.ClickMatch:
                    t = this.node.parent.getChildByPath("MainInterface/StartGamePanel/AthleticsWindow/Normal");
                    this.guideText.setPosition(new Vec3(0, -365.5275, 0));
                    this.guideText.getComponent(RichText).string = "点击匹配";
                    break;
                case common.GuideStep.BuyRole:
                    {
                        t = this.node.parent.getChildByPath("ReadyPanel/Shop/ShopArea").getComponent(ShopArea).shopRoleNodes[0];
                        let target = this.node.parent.getChildByPath("ReadyPanel/RoleArea/Node/Location_4").worldPosition;
                        this.hand.active = true;
                        this.tween = tween(this.hand).repeatForever(tween().to(0, { worldPosition: t.worldPosition, scale: new Vec3(0.8, 0.8, 1) }).
                            to(0.7, { worldPosition: target }).to(0, { scale: new Vec3(1, 1, 1) })).start();
                        this.guideText.setPosition(new Vec3(0, -637.995, 0));
                        this.guideText.getComponent(RichText).string = "拖拽购买角色";
                    }
                    break;
                case common.GuideStep.CoinInfo:
                    {
                        t = this.node.parent.getChildByPath("ReadyPanel/State/TopArea/CoinInfo");
                        this.guideText.setPosition(new Vec3(0, 595.665, 0));
                        this.guideText.getComponent(RichText).string = "每次刷新和购买角色道具都会消耗金币";
                    }
                    break;
                case common.GuideStep.RoleInfo:
                    {
                        for (let r of this.node.parent.getChildByPath("ReadyPanel/RoleArea").getComponent(RoleArea).rolesNode)
                        {
                            if (null != r)
                            {
                                t = r;
                                break;
                            }
                        }
                        this.hand.active = true;
                        this.tween=tween(this.hand).repeatForever(tween().to(0, { worldPosition: t.worldPosition, scale: new Vec3(1, 1, 1) }).
                            to(0.5, { scale: new Vec3(0.8, 0.8, 1) })).start();
                        this.guideText.setPosition(new Vec3(0, -85.498, 0));
                        this.guideText.getComponent(RichText).string = "点击角色查看详细界面";
                    }
                    break;
                case common.GuideStep.HPInfo:
                    {
                        t = this.node.parent.getChildByPath("ReadyPanel/State/TopArea/HpInfo");
                        this.guideText.setPosition(new Vec3(0, 595.665, 0));
                        this.guideText.getComponent(RichText).string = "回合失败扣除生命值，生命归零本场游戏失败";
                    }
                    break;
                case common.GuideStep.TrophyInfo:
                    {
                        t = this.node.parent.getChildByPath("ReadyPanel/State/TopArea/TrophyInfo");
                        this.guideText.setPosition(new Vec3(0, 595.665, 0));
                        this.guideText.getComponent(RichText).string = "回合胜利获得奖杯，集齐10个赢得本场游戏";
                    }
                    break;
                case common.GuideStep.RoundInfo:
                    {
                        t = this.node.parent.getChildByPath("ReadyPanel/State/TopArea/RoundInfo");
                        this.guideText.setPosition(new Vec3(0, 595.665, 0));
                        this.guideText.getComponent(RichText).string = "当前回合数，对战难度逐步递增";
                    }
                    break;
                case common.GuideStep.Done:
                    {
                        this.node.getChildByPath("BG").active = false;
                        this.skipBtn.active = false;
                        GameManager.Instance.guide = null;
                        this.node.destroy();
                    }
                default:break;
            }

            if (t != null)
            {
                this.tnode = instantiate(t);
                if(this.tnode.getChildByName("Button"))
                {
                    this.tnode.getChildByName("Button").getComponent(Button).enabled=false;
                }
                if(this.tnode.getComponent(RoleIcon))
                {
                    this.tnode.getComponent(RoleIcon).destroy();
                }
                
                this.tnode.setParent(this.panel);
                this.tnode.setWorldPosition(t.worldPosition);
                sleep(100).then(() =>
                {
                    this.tnode.setWorldPosition(t.worldPosition);   //异步等待0.1秒刷新位置，解决执行适配代码后图标覆盖不上的问题
                });
            }
            this.hand.setSiblingIndex(101);
        }
        catch(error)
        {
            console.error("Guide 下的 OnGuide 错误 err:",error);
        }
    }
}


