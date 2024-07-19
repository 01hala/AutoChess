import { _decorator, Animation, animation, Button, CCString, Component, instantiate, Label, Node, Prefab, RichText, Widget } from 'cc';
import * as enums from '../other/enums'
import { BundleManager } from '../bundle/BundleManager';
const { ccclass, property } = _decorator;

@ccclass('PopUps')
export class PopUps extends Component 
{
    private titleStr:string;
    public set title(value:string)
    {
        this.titleStr=value;
        this.node.getChildByPath("Board/Title").getComponent(RichText).string="<color=#ffffff><outline color=#888888 width=5>"+this.titleStr+"</outline></color>";
    }

    private subheadingStr:string;
    public set subheading(value:string)
    {
        this.subheadingStr=value;
        this.node.getChildByPath("Board/Subheading").getComponent(RichText).string="<color=#ffff00><outline width=3>- "+this.subheadingStr+" -</outline></color>";
    }
    
    private bar:Node;
    //标题
    private titleText:Node;
    //小标题
    private subheadingText:Node;
    //奖励显示区域
    private content:Node;
    //确认按钮区域
    private BtnArea:Node;

    private board:Node

    protected onLoad(): void
    {
        this.bar=this.node.getChildByPath("Board/Bar01");
        this.titleText=this.node.getChildByPath("Board/Title");
        this.subheadingText=this.node.getChildByPath("Board/Subheading");
        this.content=this.node.getChildByPath("Board/ScrollView/view/content");
        this.board=this.node.getChildByPath("Board");
        this.BtnArea=this.node.getChildByPath("Board/BtnArea");

        this.content.active = false;
        this.BtnArea.active = false;
    }

    start() 
    {
        try
        {
            this.node.getChildByPath("BG").on(Button.EventType.CLICK, () =>
            {
                this.CloseBoard();
            }, this);
        }
        catch (error)
        {
            console.log("PopUps 下的 start 错误:", error);
        }
    }

    public async OpenBoard(_type:enums.PopUpsType , _items:Map<string,number> , _callBack?:(e?:boolean)=>void)
    {
        try
        {
            this.node.setSiblingIndex(99);
            //奖励面板
            if (enums.PopUpsType.Reward == _type) 
            {
                this.content.active = true;
                if (_items.size > 4)
                {
                    this.content.getComponent(Widget).isAlignRight = true;
                    this.content.getComponent(Widget).left = 0;
                }
                let rewardIcon = await BundleManager.Instance.loadAssetsFromBundle("Icons", "RewardIcon") as Prefab;
                for (let [key, value] of _items)
                {
                    let newNode = instantiate(rewardIcon);
                    newNode.getChildByPath("Mask/Label").getComponent(Label).string = "" + value;
                    newNode.setParent(this.content);
                }
            }
            //确认面板
            if (enums.PopUpsType.ConfirmBoard == _type)
            {
                console.log("打开确认面板")
                this.BtnArea.active = true;
                this.BtnArea.getChildByPath("Confim").on(Button.EventType.CLICK,()=>
                {
                    if (_callBack)
                    {
                        this.CloseBoard();
                        _callBack(true);
                    }
                });
                this.BtnArea.getChildByPath("Cancel").on(Button.EventType.CLICK, () =>
                {
                    if (_callBack)
                    {
                        this.CloseBoard();
                        _callBack(false);
                    }
                });
            }
            this.board.getComponent(Animation).play("PanelAppear");
        }
        catch(error)
        {
            console.log("PopUps 下的 OpenBoard 错误:",error);
        }
    }

    private CloseBoard()
    {
        try
        {
            this.board.getComponent(Animation).on(Animation.EventType.FINISHED, () =>
            {
                this.board.getComponent(Animation).off(Animation.EventType.FINISHED);
                this.node.destroy();
            });
            this.board.getComponent(Animation).play("PanelDisappear");
        }
        catch(error)
        {
            console.log("PopUps 下的 CloseBoard 错误:",error);
        }
    }
}


