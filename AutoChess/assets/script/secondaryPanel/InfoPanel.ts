import { _decorator, animation, Animation, BlockInputEvents, Button, Component, Label, Node, RichText, sp, Sprite } from 'cc';
import { PropsType } from '../other/enums';
import { Team } from '../battle/team';
import { RoleDis } from '../battle/display/RoleDis';
import { RoleInfo } from '../battle/skill/skill_base';
const { ccclass, property } = _decorator;

@ccclass('InfoPanel')
export class InfoPanel extends Component 
{
    private exitBtn:Button;

    private simpleBoard:Node;
    private detailedBoard:Node;
    private simplePropBoard:Node;

    onLoad()
    {
        this.node.getComponent(BlockInputEvents).enabled=false;
        this.exitBtn=this.node.getChildByPath("BG").getComponent(Button);
    
        this.simpleBoard=this.node.getChildByPath("Simple");
        this.detailedBoard=this.node.getChildByPath("Detailed");
        this.simplePropBoard=this.node.getChildByPath("SimpleProps");
    }

    start() 
    {
        //this.simpleBoard.active=false;
        //this.detailedBoard.active=false;

        this.exitBtn.node.on(Button.EventType.CLICK,()=>
        {
            console.log("exitboard!");
            this.Exit();
        });
        // this.simpleBoard.on(Button.EventType.CLICK,()=>
        // {
        //     this.Exit();
        // },this);
        // this.detailedBoard.on(Button.EventType.CLICK,()=>
        // {
        //     this.Exit();
        // },this);
        // this.simplePropBoard.on(Button.EventType.CLICK,()=>
        // {
        //     this.Exit();
        // },this);
    }
    
    OpenInfoBoard(id:number,role?:RoleDis,isBuy?:boolean,propType?:PropsType)
    {
        try
        {
            // if(this.detailedBoard.active)
            // {
            //     this.detailedBoard.active=false;
            // }
            this.simpleBoard.active=false;
            this.detailedBoard.active=false;
            this.simplePropBoard.active=false;
    
            if(null!=propType)
            {
                this.simplePropBoard.active=true;
                this.simplePropBoard.getComponent(Animation).play("PanelAppear");
                this.node.setSiblingIndex(99);
                this.node.getComponent(BlockInputEvents).enabled=true;
                this.simplePropBoard.getChildByName("PropName").getComponent(Label).string="道具ID:"+id;
                if(role) 
                {
                    //this.simplePropBoard.getChildByPath("Sculpture/Sprite").getComponent(Sprite).spriteFrame=role.roleSprite;
                }

                // switch(propType)
                // {
                //     case PropsType.Food:break;
                //     case PropsType.Equip:break;
                // }
            }
            else
            {
                if(null==role||!isBuy){
                    this.simpleBoard.active=true;
                    this.simpleBoard.getComponent(Animation).play("PanelAppear");
                    //this.detailedBoard.active=false;
                    this.node.setSiblingIndex(99);
                    this.node.getComponent(BlockInputEvents).enabled=true;
                    this.simpleBoard.getChildByName("RoleName").getComponent(Label).string="角色ID:"+id;
                    let tSp = this.simpleBoard.getChildByPath("Sculpture/Sprite").getComponent(sp.Skeleton);
                    tSp.skeletonData=role.roleSprite.skeletonData;
                    tSp.animation=role.roleSprite.animation;
                } 
                else{
                    //this.simpleBoard.active=false;
                    this.detailedBoard.active=true;
                    this.detailedBoard.getComponent(Animation).play("PanelAppear");
                    this.node.setSiblingIndex(99);
                    this.node.getComponent(BlockInputEvents).enabled=true;  
                    this.detailedBoard.getChildByPath("RoleData/RoleName").getComponent(RichText).string="<color=0>"+role.RoleId+"</color>";
                    this.detailedBoard.getChildByPath("RoleData/RoleLevel").getComponent(RichText).string="<color=0>"+role.Level+"</color>";
                    this.detailedBoard.getChildByPath("RoleData/AtkNum").getComponent(RichText).string="<color=0>"+role.AtkNum+"</color>";
                    this.detailedBoard.getChildByPath("RoleData/HpNum").getComponent(RichText).string="<color=0>"+role.Hp+"</color>";
                    let tSp =this.detailedBoard.getChildByPath("Sculpture/Sprite").getComponent(sp.Skeleton);
                    tSp.skeletonData=role.roleSprite.skeletonData;
                    tSp.animation=role.roleSprite.animation;
                }   
            }
        }
        catch(error)
        {
            console.error('InfoPanel 下 OpenInfoBoard 错误 err: ',error);
        }
        
    }

    Exit()
    {
        //this.simpleBoard.active=false;
        //this.detailedBoard.active=false;
        this.node.getComponent(BlockInputEvents).enabled=false;
        if(this.simpleBoard.active)
        {
            this.simpleBoard.getComponent(Animation).on(Animation.EventType.FINISHED,()=>
            {
                this.node.active=false;
                this.simpleBoard.getComponent(Animation).off(Animation.EventType.FINISHED);
            });
            this.simpleBoard.getComponent(Animation).play("PanelDisappear");
        }
        if(this.simplePropBoard.active)
        {
            this.simplePropBoard.getComponent(Animation).on(Animation.EventType.FINISHED,()=>
            {
                this.node.active=false;
                this.simplePropBoard.getComponent(Animation).off(Animation.EventType.FINISHED);
            });
            this.simplePropBoard.getComponent(Animation).play("PanelDisappear");
        }
        if(this.detailedBoard.active)
        {
            this.detailedBoard.getComponent(Animation).on(Animation.EventType.FINISHED,()=>
            {
                this.node.active=false;
                this.detailedBoard.getComponent(Animation).off(Animation.EventType.FINISHED);
            });
            this.detailedBoard.getComponent(Animation).play("PanelDisappear");
        }

        
    }

    update(deltaTime: number) {
        
    }
}


