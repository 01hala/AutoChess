import { _decorator, BlockInputEvents, Button, Component, Label, Node, RichText, Sprite } from 'cc';
import { PropsType } from '../other/enums';
const { ccclass, property } = _decorator;

@ccclass('InfoPanel')
export class InfoPanel extends Component 
{
    private exitBtn:Button;
    private infoLabel:Label;
    private nameText:RichText;
    private levelText:RichText;
    private atkText:RichText;
    private hpText:RichText;
    private sculpture:Sprite;

    private simpleBoard:Node;
    private detailedPanel:Node;

    onLoad()
    {
        this.node.getComponent(BlockInputEvents).enabled=false;
        this.exitBtn=this.node.getChildByPath("Detailed/Exit_Btn").getComponent(Button);
        
        //this.infoLabel=this.node.getChildByPath("Detailed/RoleIntroduce").getComponent(Label);
        this.nameText=this.node.getChildByPath("Detailed/RoleName").getComponent(RichText);
        this.levelText=this.node.getChildByPath("Detailed/RoleLevel").getComponent(RichText);
        this.atkText=this.node.getChildByPath("Detailed/AtkNum").getComponent(RichText);
        this.hpText=this.node.getChildByPath("Detailed/HpNum").getComponent(RichText);
        this.sculpture=this.node.getChildByPath("Detailed/Sculpture/Sprite").getComponent(Sprite);

        //this.simpleBoard=this.node.getChildByPath("Simple");
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
    
    OpenDetailed(id:number,propType?:PropsType)
    {
        try
        {
            // if(this.detailedPanel.active)
            // {
            //     this.detailedPanel.active=false;
            // }
    
            if(null!=propType)
            {
    
            }
            else
            {
                this.detailedPanel.active=true;
                this.node.setSiblingIndex(99);
                this.node.getComponent(BlockInputEvents).enabled=true;
                this.nameText.string="角色ID:"+id;
                this.levelText.string=""+1;
            }
        }
        catch(error)
        {
            console.error('InfoPanel 下 OpenDetailed 错误 err: ',error);
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


