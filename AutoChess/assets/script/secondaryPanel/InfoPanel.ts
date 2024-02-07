import { _decorator, BlockInputEvents, Button, Component, Label, Node, RichText, Sprite } from 'cc';
import { PropsType } from '../other/enums';
import { Team } from '../battle/team';
import { RoleDis } from '../battle/display/RoleDis';
const { ccclass, property } = _decorator;

@ccclass('InfoPanel')
export class InfoPanel extends Component 
{
    private exitBtn:Button;
    //private infoLabel:Label;
    //private nameText:RichText;
    private levelText:RichText;
    // private atkText:RichText;
    // private hpText:RichText;
    // private sculpture:Sprite;

    private simpleBoard:Node;
    private detailedBoard:Node;

    onLoad()
    {
        this.node.getComponent(BlockInputEvents).enabled=false;
        this.exitBtn=this.node.getChildByPath("Detailed/Exit_Btn").getComponent(Button);
        
        //this.infoLabel=this.node.getChildByPath("Detailed/RoleIntroduce").getComponent(Label);
        //this.nameText=this.node.getChildByPath("Detailed/RoleName").getComponent(RichText);
        this.levelText=this.node.getChildByPath("Detailed/RoleLevel").getComponent(RichText);
        // this.atkText=this.node.getChildByPath("Detailed/AtkNum").getComponent(RichText);
        // this.hpText=this.node.getChildByPath("Detailed/HpNum").getComponent(RichText);
        //this.sculpture=this.node.getChildByPath("Detailed/Sculpture/Sprite").getComponent(Sprite);

        this.simpleBoard=this.node.getChildByPath("Simple");
        this.detailedBoard=this.node.getChildByPath("Detailed");
    }

    start() 
    {
        //this.simpleBoard.active=false;
        //this.detailedBoard.active=false;

        this.exitBtn.node.on(Button.EventType.CLICK,()=>
        {
            this.Exit();
        });
        this.simpleBoard.on(Button.EventType.CLICK,()=>
        {
            this.Exit();
        },this);
    }
    
    OpenInfoBoard(id:number,role?:RoleDis,propType?:PropsType)
    {
        try
        {
            // if(this.detailedBoard.active)
            // {
            //     this.detailedBoard.active=false;
            // }
    
            if(null!=propType)
            {
                switch(propType)
                {
                    case PropsType.Food:break;
                    case PropsType.Equip:break;
                }
            }
            else
            {
                if(null==role){
                    this.simpleBoard.active=true;
                    this.detailedBoard.active=false;
                    this.node.setSiblingIndex(99);
                    this.node.getComponent(BlockInputEvents).enabled=true;
                    this.simpleBoard.getChildByName("RoleName").getComponent(Label).string="角色ID:"+id;
                } 
                else{
                    this.simpleBoard.active=false;
                    this.detailedBoard.active=true;
                    this.node.setSiblingIndex(99);
                    this.node.getComponent(BlockInputEvents).enabled=true;
                    //"<color=0>1</color>"
                    
                    this.detailedBoard.getChildByPath("RoleData/RoleName").getComponent(RichText).string="<color=0>"+role.RoleId+"</color>";
                    this.detailedBoard.getChildByPath("RoleData/RoleLevel").getComponent(RichText).string="<color=0>"+role.Level+"</color>";
                    this.detailedBoard.getChildByPath("RoleData/AtkNum").getComponent(RichText).string="<color=0>"+role.AtkNum+"</color>";
                    this.detailedBoard.getChildByPath("RoleData/HpNum").getComponent(RichText).string="<color=0>"+role.Hp+"</color>";
                }   
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
        //this.detailedBoard.active=false;
        this.node.getComponent(BlockInputEvents).enabled=false;
        this.node.active=false;
    }

    update(deltaTime: number) {
        
    }
}


