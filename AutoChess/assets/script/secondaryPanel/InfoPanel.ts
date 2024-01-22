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
        this.exitBtn=this.node.getChildByPath("Detailed/Exit_Btn").getComponent(Button);
        
        this.simpleInfoLabel=this.node.getChildByPath("Simple/RoleIntroduce").getComponent(Label);
        this.simpleSculpture=this.node.getChildByPath("Simple/Sculpture/Sprite").getComponent(Sprite);
        this.simpleBoard=this.node.getChildByPath("Simple");
        this.detailedPanel=this.node.getChildByPath("Detailed");

    }

    start() 
    {
        //this.simpleBoard.active=false;
        //this.detailedPanel.active=false;

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
        try
        {
            if(this.detailedPanel.active)
            {
                this.detailedPanel.active=false;
            }
    
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
        catch(error)
        {
            console.error('InfoPanel 下 OpenSimple 错误 err: ',error);
        }
        
    }

    Exit()
    {
        //this.simpleBoard.active=false;
        //this.detailedPanel.active=false;
        this.node.getComponent(BlockInputEvents).enabled=false;
        this.node.active=false;
    }

    update(deltaTime: number) {
        
    }
}


