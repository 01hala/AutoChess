import { _decorator, Animation, animation, Button, Component, Node } from 'cc';
import * as singleton from '../netDriver/netSingleton';
const { ccclass, property } = _decorator;

@ccclass('ChooseTag')
export class ChooseTag extends Component 
{   
    private board:Node;

    private tag_1:Node;
    private tag_2:Node;
    private tag_3:Node;

    protected onLoad(): void
    {
        this.board=this.node.getChildByPath("Board");

        this.tag_1=this.node.getChildByPath("Board/Layout/Tag_1");
        this.tag_2=this.node.getChildByPath("Board/Layout/Tag_2");
        this.tag_3=this.node.getChildByPath("Board/Layout/Tag_3");
    }

    start() 
    {
        this.board.active=false;

        this.tag_1.on(Button.EventType.CLICK, () =>
        {
            singleton.netSingleton.ready.readyData.ChooseTag(1);
            this.Exit();
        }, this);
        this.tag_2.on(Button.EventType.CLICK, () =>
        {
            singleton.netSingleton.ready.readyData.ChooseTag(2);
            this.Exit();
        }, this);
        this.tag_3.on(Button.EventType.CLICK, () =>
        {
            singleton.netSingleton.ready.readyData.ChooseTag(3);
            this.Exit();
        }, this);
    }

    Open()
    {   
        this.board.active=true;
        this.board.getComponent(Animation).play("PanelAppear");
        
        this.SetTags();
    }

    SetTags()
    {

    }

    Exit()
    {
        this.board.getComponent(Animation).on(Animation.EventType.FINISHED,()=>
        {
            this.destroy();
        })
        this.board.getComponent(Animation).play("PanelDisappear");
    }
}


