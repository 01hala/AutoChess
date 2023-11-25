import { _decorator, BlockInputEvents, Button, Component, Label, Node, Sprite } from 'cc';
import { PropsType } from '../other/enums';
const { ccclass, property } = _decorator;

@ccclass('InfoPanel')
export class InfoPanel extends Component 
{
    private exitBtn:Button;
    private infoLabel:Label;
    private sculpture:Sprite;

    onLoad()
    {
        this.node.getComponent(BlockInputEvents).enabled=false;
        this.exitBtn=this.node.getChildByPath("InfoBoard/Exit_Btn").getComponent(Button);
        this.exitBtn.node.on(Button.EventType.CLICK,()=>
        {
            this.Exit();
        });

        this.infoLabel=this.node.getChildByPath("InfoBoard/RoleIntroduce").getComponent(Label);
        this.sculpture=this.node.getChildByPath("InfoBoard/Sculpture/Sprite").getComponent(Sprite);

    }

    start() 
    {

    }
    
    Open(id:number,propType?:PropsType)
    {
        if(null!=propType)
        {

        }
        else
        {
            this.node.setSiblingIndex(99);
            this.node.getComponent(BlockInputEvents).enabled=true;
            this.infoLabel.string="角色ID:"+id;
        }
    }

    Exit()
    {
        this.node.getComponent(BlockInputEvents).enabled=false;
        this.node.active=false;
    }

    update(deltaTime: number) {
        
    }
}


