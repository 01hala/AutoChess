import { _decorator, Button, Component, Node, RichText, tween, Tween, Vec3 } from 'cc';
import { SendEvent } from './MessageEvent';
import { GameManager } from './GameManager';
import { ShopArea } from '../ready/display/ShopArea';
import { RoleArea } from '../ready/display/RoleArea';
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

    private mask:Node;

    private siblingIndex:number;
    private tnode:Node
    private tween:Tween<Node>;

    public Init()
    {   

        this.next=0;

        this.step=1;
        this.end=9;

        this.pointer=this.node.getChildByPath("Pointer");
        this.guideText=this.node.getChildByPath("Text");
        this.mask=this.node.getChildByPath("Mask");

        this.node.setSiblingIndex(101);

        this.node.on(Button.EventType.CLICK,()=>
        {
            if(this.step>=3 && this.step<=8)
            {
                this.Checkguide();
                this.step++;
            }
        },this);

        this.StartGuide();
    }

    private StartGuide():Promise<void>
    {
        return new Promise((resolve)=>
        {
            while(this.step<=this.end)
            {
                if(this.next!=this.step)
                {
                    this.OnGuide();
                    this.next=this.step;
                }
            }
            GameManager.Instance.guide=null;
            this.node.destroy();
            resolve();
        });
    }

    private OnGuide()
    {
        this.mask.active=true;
        switch(this.step)
        {
            case 1:
                this.tnode=this.node.parent.getChildByPath("MainInterface/MainPanel/BottomLayer/StartHouse");
                this.siblingIndex=this.tnode.getSiblingIndex();
                this.tnode.setSiblingIndex(102);
                this.pointer.active=true;
                this.pointer.setWorldPosition(this.tnode.getChildByPath("Start_Btn").worldPosition);
                this.guideText.getComponent(RichText).string="点击游戏大厅";
                break;
            case 2:
                this.tnode=this.node.parent.getChildByPath("MainInterface/StartGamePanel/AthleticsWindow/Normal");
                this.siblingIndex=this.tnode.getSiblingIndex();
                this.tnode.setSiblingIndex(102);
                this.pointer.active=true;
                this.pointer.setWorldPosition(this.tnode.worldPosition);
                this.guideText.getComponent(RichText).string="点击匹配";
                break;
            case 3:
                this.tnode=this.node.parent.getChildByPath("ReadyPanel/TopArea/HpInfo");
                this.siblingIndex=this.tnode.getSiblingIndex();
                this.tnode.setSiblingIndex(102);
                this.guideText.getComponent(RichText).string="生命值";
                break;
            case 4:
                this.tnode=this.node.parent.getChildByPath("ReadyPanel/TopArea/TrophyInfo");
                this.siblingIndex=this.tnode.getSiblingIndex();
                this.tnode.setSiblingIndex(102);
                this.guideText.getComponent(RichText).string="奖杯";
                break;
            case 5:
                this.tnode=this.node.parent.getChildByPath("ReadyPanel/TopArea/CoinInfo");
                this.siblingIndex=this.tnode.getSiblingIndex();
                this.tnode.setSiblingIndex(102);
                this.guideText.getComponent(RichText).string="金币";
                break;
            case 6:
                this.tnode=this.node.parent.getChildByPath("ReadyPanel/TopArea/RoundInfo");
                this.siblingIndex=this.tnode.getSiblingIndex();
                this.tnode.setSiblingIndex(102);
                this.guideText.getComponent(RichText).string="回合";
                break;
            case 7:
                this.tnode=this.node.parent.getChildByPath("ReadyPanel/ShopArea");
                this.siblingIndex=this.tnode.getSiblingIndex();
                this.tnode.setSiblingIndex(102);
                this.guideText.getComponent(RichText).string="商店";
                break;
            case 8:
                this.pointer.active=true;
                this.pointer.setWorldPosition(this.tnode.worldPosition);
                this.tween=tween(this.pointer).to(1,{position:this.node.parent.getChildByPath("ReadyPanel/RoleArea/Node/Location_0").worldPosition}).repeatForever().start();
                this.guideText.getComponent(RichText).string="拖拽购买角色";
                break;
            case 9:
                for(let t of this.node.parent.getChildByPath("ReadyPanel/RoleArea").getComponent(RoleArea).rolesNode)
                {
                    if(null != t)
                    {
                        this.tnode=t;
                        break;
                    }
                }
                this.siblingIndex=this.tnode.getSiblingIndex();
                this.tnode.setSiblingIndex(102);
                this.pointer.setWorldPosition(this.tnode.worldPosition);
                this.guideText.getComponent(RichText).string="点击角色查看详细界面";
                break;

            default:break;
        }
    }

    public Checkguide()
    {
        if(this.tnode)
        {
            this.tnode.setSiblingIndex(this.siblingIndex);
            this.tnode=null;
        }
        if(this.step<3 && this.step > 8)
        {
            this.mask.active=false;
        }
        if(8==this.step)
        {
            this.tween.stop();
        }
        this.pointer.active=false;
    }
}


