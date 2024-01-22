import { _decorator, BlockInputEvents, Button, Component, Label, Node, Sprite } from 'cc';
import { PropsType } from '../other/enums';
const { ccclass, property } = _decorator;

@ccclass('InfoPanel')
export class InfoPanel extends Component 
{
    private exitBtn:Button;
    private simpleInfoLabel:Label;
    private simpleSculpture:Sprite;

    private simpleBoard:Node;
    private detailedPanel:Node;

    onLoad()
    {
        this.node.getComponent(BlockInputEvents).enabled=false;
        this.exitBtn=this.node.getChildByPath("InfoBoard/Exit_Btn").getComponent(Button);
        
        this.simpleInfoLabel=this.node.getChildByPath("InfoBoard/Simple/RoleIntroduce").getComponent(Label);
        this.simpleSculpture=this.node.getChildByPath("InfoBoard/Simple/Sculpture/Sprite").getComponent(Sprite);
        this.simpleBoard=this.node.getChildByPath("Simple");
        this.detailedPanel=this.node.getChildByPath("Detailed");

    }

    start() 
    {
        this.simpleBoard.active=false;
        this.detailedPanel.active=false;

        this.exitBtn.node.on(Button.EventType.CLICK,()=>
        {
            this.Exit();
        });

        this.simpleBoard.on(Button.EventType.CLICK,()=>
        {
            this.Exit();
        },this);
    }
    
    OpenSimple(id:number,propType?:PropsType)
    {

        if(null!=propType)
        {

        }
        else
        {
            this.simpleBoard.active=true;
            this.node.setSiblingIndex(99);
            this.node.getComponent(BlockInputEvents).enabled=true;
            this.simpleInfoLabel.string="角色ID:"+id;
        }
    }

    Exit()
    {
        this.simpleBoard.active=false;
        this.detailedPanel.active=false;
        this.node.getComponent(BlockInputEvents).enabled=false;
        this.node.active=false;
    }

    update(deltaTime: number) {
        
    }
}


