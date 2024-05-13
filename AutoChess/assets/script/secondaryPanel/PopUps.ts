import { _decorator, Animation, animation, Button, CCString, Component, instantiate, Label, Node, Prefab, RichText, Widget } from 'cc';
import * as enums from '../other//enums'
import { BundleManager } from '../bundle/BundleManager';
const { ccclass, property } = _decorator;

@ccclass('PopUps')
export class PopUps extends Component 
{
    private titleStr:string;
    public set title(value)
    {
        this.titleStr=value;
        this.titleText.getComponent(RichText).string="<color=#ffffff><outline color=#888888 width=5>"+this.titleStr+"</outline></color>";
    }

    private subheadingStr:string;
    public set subheading(value)
    {
        this.subheadingStr=value;
        this.subheadingText.getComponent(RichText).string="<color=#ffff00><outline width=3>- "+this.subheadingStr+" -</outline></color>";
    }
    
    private bar:Node;
    private titleText:Node;
    private subheadingText:Node;
    private content:Node;

    private board:Node

    protected onLoad(): void
    {
        this.bar=this.node.getChildByPath("Board/Bar01");
        this.titleText=this.node.getChildByPath("Board/Title");
        this.subheadingText=this.node.getChildByPath("Board/Subheading");
        this.content=this.node.getChildByPath("Board/ScrollView/view/content");
        this.board=this.node.getChildByPath("Board");
    }

    start() 
    {
        this.node.getChildByPath("BG").on(Button.EventType.CLICK,()=>
        {
            this.CloseBoard();
        },this);
    }

    public async OpenBoard(_type:enums.PopUpsType , _items:Map<string,number>)
    {
        if(enums.PopUpsType.Reward == _type)
        {
            if(_items.size > 4)
            {
                this.content.getComponent(Widget).isAlignRight=true;
                this.content.getComponent(Widget).left=0;
            }
            let rewardIcon=await BundleManager.Instance.loadAssetsFromBundle("Icons","RewardIcon") as Prefab;
            for(let [key , value] of _items)
            {
                let newNode=instantiate(rewardIcon);
                newNode.getChildByPath("Mask/Label").getComponent(Label).string=""+value;
                newNode.setParent(this.content);
            }
        }
        this.board.getComponent(Animation).play("PanelAppear");
    }

    private CloseBoard()
    {
        this.board.getComponent(Animation).on(Animation.EventType.FINISHED,()=>
        {
            this.board.getComponent(Animation).off(Animation.EventType.FINISHED);
            this.node.destroy();
        });
        this.board.getComponent(Animation).play("PanelDisappear");
    }
}


