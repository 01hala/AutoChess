import { _decorator, animation, Animation, BlockInputEvents, Button, Component, Label, Node, RichText, sp, Sprite, SpriteFrame } from 'cc';
import { PropsType } from '../other/enums';
import { Team } from '../battle/team';
import { RoleDis } from '../battle/display/RoleDis';
import { RoleInfo } from '../battle/skill/skill_base';
import { config } from '../config/config';
import * as singleton from '../netDriver/netSingleton';
import { loadAssets } from '../bundle/LoadAsset';
import { Role } from '../serverSDK/common';
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
    }
    
    async OpenInfoBoard(id:number,role?:RoleDis,isBuy?:boolean,propType?:PropsType)
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
                this.node.setSiblingIndex(98);
                this.node.getComponent(BlockInputEvents).enabled=true;
                
                //道具名
                let pn=config.FoodConfig.get(id);
                this.simplePropBoard.getChildByName("PropName").getComponent(Label).string=pn.Name;
                //立绘
                let img = await loadAssets.LoadImg(pn.Res);
                this.simpleBoard.getChildByPath("Sculpture/Sprite").getComponent(Sprite).spriteFrame = img;
                //简介
                this.simplePropBoard.getChildByName("PropIntroduce").getComponent(Label).string=pn.Introduce;
               
                // switch(propType)
                // {
                //     case PropsType.Food:break;
                //     case PropsType.Equip:break;
                // }
            }
            else
            {
                if(null==role||!isBuy)
                {
                    this.simpleBoard.active=true;
                    this.simpleBoard.getComponent(Animation).play("PanelAppear");
                    this.node.setSiblingIndex(98);
                    this.node.getComponent(BlockInputEvents).enabled=true;
                    //立绘
                    let tSp = this.simpleBoard.getChildByPath("Sculpture/Sprite").getComponent(sp.Skeleton);
                    tSp.skeletonData = role.roleSprite.skeletonData;
                    tSp.animation = role.roleSprite.animation;

                    this.ShowSimpel(id);
                } 
                else
                {
                    this.detailedBoard.active=true;
                    this.detailedBoard.getComponent(Animation).play("PanelAppear");
                    this.node.setSiblingIndex(98);
                    this.node.getComponent(BlockInputEvents).enabled=true;
                    //立绘  
                    let tSp =this.detailedBoard.getChildByPath("RoleArea/Sculpture/Sprite").getComponent(sp.Skeleton);
                    tSp.skeletonData=role.roleSprite.skeletonData;
                    tSp.animation=role.roleSprite.animation;
                    
                    this.ShowDetailed(id);
                }   
            }
        }
        catch(error)
        {
            console.error('InfoPanel 下 OpenInfoBoard 错误 err: ',error);
        }
        
    }

    OpenCardInfo(_id:number)
    {
        this.node.getComponent(BlockInputEvents).enabled=true;
        this.simpleBoard.active=true;
        this.detailedBoard.active=false;
        this.simplePropBoard.active=false;
        this.node.setSiblingIndex(98);

        this.simpleBoard.getComponent(Animation).play("PanelAppear");
    }

    private ShowSimpel(_id:number)
    {
        //角色名
        this.simpleBoard.getChildByPath("ID").getComponent(Label).string = "id: " + _id;
        let ro = config.RoleConfig.get(_id);
        this.simpleBoard.getChildByName("RoleName").getComponent(Label).string = ro.Name;
        //技能介绍
        let str = config.SkillIntroduceConfig.get(_id % 100000);
        console.log(str.Id);
        this.simpleBoard.getChildByPath("RoleIntroduce").getComponent(Label).string = str.Leve1Text;
        this.simpleBoard.getChildByPath("TimeText").getComponent(RichText).string = "<color=#00ff00>" + str.Timeing_Text + ":</color>";
        //羁绊
        let ft = config.FettersConfig.get(ro.Fetters);
        this.simpleBoard.getChildByPath("Fetters").getComponent(RichText).string = "<color=#00ff00>" + ft.Name + "</color>";
    }

    private ShowDetailed(_id:number)
    {
        try
        {
            let r = singleton.netSingleton.ready.readyData.GetRole(_id);
            let imgs = this.LoadRoleImage(r);
            //工具生命等级
            this.detailedBoard.getChildByPath("RoleArea/Atk/RichText").getComponent(RichText).string="<color=0>"+r.Attack+"</color>";
            this.detailedBoard.getChildByPath("RoleArea/HP/RichText").getComponent(RichText).string="<color=0>"+r.HP+"</color>";
            this.detailedBoard.getChildByPath("RoleArea/Lv/RichText").getComponent(RichText).string="<color=0>"+r.Level+"</color>";
            //名字
            let ro=config.RoleConfig.get(_id);
            this.detailedBoard.getChildByPath("RoleArea/Name/RichText").getComponent(RichText).string="<color=#b98b00><outline width=5>"+ro.Name+"</outline></color>";
            //技能信息
            let sk=config.SkillIntroduceConfig.get(_id%100000);
            this.detailedBoard.getChildByPath("IntroduceArea/TimeingText").getComponent(RichText).string="<color=#785d00><outline width=5>"+sk.Timeing_Text+"</outline></color>";
            let str="";
            switch(r.Level)
            {
                case 1:str=sk.Leve1Text;break;
                case 2:str=sk.Leve2Text;break;
                case 3:str=sk.Leve3Text;break;
            }
            this.detailedBoard.getChildByPath("IntroduceArea/Label").getComponent(Label).string=str;
            //羁绊
            let ft=config.FettersConfig.get(ro.Fetters);
            this.detailedBoard.getChildByPath("DetailsArea/Fetters/RichText").getComponent(RichText).string="<color=#785d00>"+ft.Name+"</color>";
            //buff
            let bustr:string="";
            if(r.additionBuffer)
            {
                for(let i of r.additionBuffer)
                {
                    bustr+=config.BufferConfig.get(i).Name+"\n";
                }
            }
            this.detailedBoard.getChildByPath("DetailsArea/Buff/Label").getComponent(Label).string=bustr;
            //购买时的回合
            this.detailedBoard.getChildByPath("DetailsArea/BuyRound/RichText").getComponent(RichText).string=`<color=#ac8352>--在第${r.BuyRound}回合购买--</color>`;
            //装备图片
            this.detailedBoard.getChildByPath("DetailsArea/Equip/Sprite").getComponent(Sprite).spriteFrame=imgs[0];
            //羁绊图标
            this.detailedBoard.getChildByPath("DetailsArea/Fetters/Sprite/Icon").getComponent(Sprite).spriteFrame=imgs[1];
        }
        catch(error)
        {
            console.error('InfoPanel 下 ShowDetailed 错误 err: ',error);
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

    private async LoadRoleImage(_role:Role)
    {
        try
        {
            let eq=config.EquipConfig.get(_role.equipID);
            let equipimg=loadAssets.LoadImg(eq.Res);
    
            let fe=config.FettersConfig.get(_role.equipID);
            let fettersImg=loadAssets.LoadImg(fe.Res);
    
            let awaitResult= await Promise.all([equipimg , fettersImg]);
            return awaitResult;
        }
        catch(error)
        {
            console.error('InfoPanel 下 LoadImage 错误 err: ',error);
            return null;
        }
    }
}


