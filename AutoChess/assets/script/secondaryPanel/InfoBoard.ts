import { _decorator, animation, Animation, BlockInputEvents, Button, Component, Label, Node, RichText, sp, Sprite, SpriteFrame } from 'cc';
import { PropsType } from '../other/enums';
import { Team } from '../battle/AutoChessBattle/team';
import { RoleDis } from '../battle/display/RoleDis';
import { RoleInfo } from '../battle/AutoChessBattle/skill/skill_base';
import { config } from '../battle/AutoChessBattle/config/config';
import * as singleton from '../netDriver/netSingleton';
import { loadAssets } from '../bundle/LoadAsset';
import { Role } from '../battle/AutoChessBattle/common';
import { RoleConfig } from '../battle/AutoChessBattle/config/role_config';
import { AudioManager } from '../other/AudioManager';
import { GameManager } from '../other/GameManager';
import * as common from "../battle/AutoChessBattle/common"
import * as battleEnums from '../battle/AutoChessBattle/enum';
const { ccclass, property } = _decorator;

@ccclass('InfoPanel')
export class InfoBoard extends Component 
{
    private exitBtn:Button;

    private simpleBoard:Node;
    private detailedBoard:Node;
    private propBoard:Node;
    private fetterBoard:Node;

    onLoad()
    {
        this.node.getComponent(BlockInputEvents).enabled=false;
        this.exitBtn=this.node.getChildByPath("BG").getComponent(Button);
    
        this.simpleBoard=this.node.getChildByPath("Simple");
        this.detailedBoard=this.node.getChildByPath("Detailed");
        this.propBoard=this.node.getChildByPath("SimpleProps");
        this.fetterBoard=this.node.getChildByPath("Fetter");
    }

    start() 
    {
        //this.simpleBoard.active=false;
        //this.detailedBoard.active=false;

        this.exitBtn.node.on(Button.EventType.CLICK,()=>
        {
            AudioManager.Instance.PlayerOnShot("Sound/battle_return_feedback_01");
            console.log("exitboard!");
            this.Exit();
        });
    }
    
    async OpenInfoBoard(id:number,index?:number,role?:RoleDis,isBuy?:boolean,propType?:PropsType)
    {
        try
        {
            // if(this.detailedBoard.active)
            // {
            //     this.detailedBoard.active=false;
            // }
            this.simpleBoard.active=false;
            this.detailedBoard.active=false;
            this.propBoard.active=false;
            this.fetterBoard.active=false;
    
            if(null!=propType)
            {
                this.propBoard.active=true;
                this.propBoard.getComponent(Animation).play("PanelAppear");
                this.node.setSiblingIndex(98);
                this.node.getComponent(BlockInputEvents).enabled=true;
                
                //道具名
                let pn=null;
                if(1000<id&&id<2000) pn=config.FoodConfig.get(id);
                else pn=config.EquipConfig.get(id);
                
                this.propBoard.getChildByName("PropName").getComponent(Label).string=pn.Name;
                //立绘
                let img = await loadAssets.LoadImg(pn.Res);
                if(img)
                {
                    this.propBoard.getChildByPath("Sculpture/Sprite").getComponent(Sprite).spriteFrame = img;
                }
                //简介
                this.propBoard.getChildByName("Introduce").getComponent(Label).string=pn.Introduce;
               
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
                    
                    this.ShowDetailed(index,role);
                }   
            }
            if (GameManager.Instance.guide)
            {
                GameManager.Instance.guide.step++;
            }
        }
        catch(error)
        {
            console.error('InfoPanel 下 OpenInfoBoard 错误 err: ',error);
        }
        
    }

    async OpenFetterInfo(_id:number,spritePath:string,level:number){
        this.simpleBoard.active=false;
        this.detailedBoard.active=false;
        this.propBoard.active=false;
        this.fetterBoard.active=true;

        this.fetterBoard.getComponent(Animation).play("PanelAppear");
        this.node.setSiblingIndex(98);
        this.node.getComponent(BlockInputEvents).enabled=true;

        let cf=config.FetterIntroduceConfig.get(_id);

        let sp=await loadAssets.LoadImg(spritePath);
        this.fetterBoard.getChildByPath("Sculpture/Sprite").getComponent(Sprite).spriteFrame=sp;
        this.fetterBoard.getChildByName("FetterName").getComponent(Label).string=cf.FetterName;
        this.fetterBoard.getChildByName("Introduce").getComponent(RichText).string="<color=#000000>"+cf.Introductory+"</color>";
        let content="";
        let list=cf.Text.split("\n");
        for(let i=0;i<list.length;i++){
            if(level>=i+1) content+="<color=#FFD700>"+list[i]+"</color>\n";
            else content+="<color=#AAAAAA>"+list[i]+"</color>\n";        
        }
        this.fetterBoard.getChildByName("Introduce").getComponent(RichText).string=content;
    }

    OpenCardInfo(_id:number)
    {
        this.node.setSiblingIndex(98);
        this.node.getComponent(BlockInputEvents).enabled=true;
        this.simpleBoard.active=true;
        this.detailedBoard.active=false;
        this.propBoard.active=false;
        this.fetterBoard.active=false;
        this.ShowSimpel(_id);

        this.simpleBoard.getComponent(Animation).play("PanelAppear");
    }

    private async ShowSimpel(_id:number)
    {
        //角色名
        this.simpleBoard.getChildByPath("ID").getComponent(Label).string = "id: " + _id;
        let ro = config.RoleConfig.get(_id);
        this.simpleBoard.getChildByName("RoleName").getComponent(Label).string = ro.Name;
        //技能介绍
        let str = config.SkillIntroduceConfig.get(_id);
        console.log(str.Id);
        this.simpleBoard.getChildByPath("RoleIntroduce").getComponent(Label).string = str.Leve1Text;
        this.simpleBoard.getChildByPath("TimeText").getComponent(RichText).string = "<color=#00ff00>" + str.Timeing_Text + ":</color>";
        //羁绊
        let ft = config.FettersConfig.get(ro.Fetters);
        this.simpleBoard.getChildByPath("Fetters").getComponent(RichText).string = "<color=#00ff00>" + ft.Name + "</color>";
        //羁绊图标
        let fe=config.FettersConfig.get(ro.Fetters);
        let fettersImg = await loadAssets.LoadImg(fe.Res);
        this.simpleBoard.getChildByPath("Fetters/FettersSprite/Icon").getComponent(Sprite).spriteFrame=fettersImg;
    }

    private async ShowDetailed(_index:number,_role?:RoleDis)
    {
        try
        {
            //let r = singleton.netSingleton.ready.readyData.GetRole(_id);
            let r:common.Role;
            if(singleton.netSingleton.ready)
            {
                r=singleton.netSingleton.ready.readyData.GetRole(_index);
            }
            if(singleton.netSingleton.battle)
            {
                r=_role.GetRoleInfo().c_role;
            }
            let ro=config.RoleConfig.get(r.RoleID);
            //工具生命等级
            this.detailedBoard.getChildByPath("RoleArea/Atk/RichText").getComponent(RichText).string="<color=0>"+r.Attack+"</color>";
            this.detailedBoard.getChildByPath("RoleArea/HP/RichText").getComponent(RichText).string="<color=0>"+r.HP+"</color>";
            this.detailedBoard.getChildByPath("RoleArea/Lv/RichText").getComponent(RichText).string="<color=0>"+r.Level+"</color>";
            //名字
            this.detailedBoard.getChildByPath("RoleArea/Name/RichText").getComponent(RichText).string="<color=#b98b00><outline width=5>"+ro.Name+"</outline></color>";
            //技能信息
            let sk=config.SkillIntroduceConfig.get(_index%100000);
            this.detailedBoard.getChildByPath("IntroduceArea/TimeingText").getComponent(RichText).string="<color=#785d00><outline width=5>"+sk.Timeing_Text+": </outline></color>";
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
            console.log("角色信息面板装备获取到的id"+r.equipID);
            if(r.equipID)
            {
                let eq=config.EquipConfig.get(r.equipID);
                let equipimg=await loadAssets.LoadImg(eq.Res);
                this.detailedBoard.getChildByPath("DetailsArea/Equip/Mask/Sprite").getComponent(Sprite).spriteFrame=equipimg;
            }
            else
            {
                this.detailedBoard.getChildByPath("DetailsArea/Equip/Mask/Sprite").getComponent(Sprite).spriteFrame=null;
            }
            //羁绊图标
            let fe=config.FettersConfig.get(r.FettersSkillID.fetters_id);
            let fettersImg = await loadAssets.LoadImg(fe.Res);
            this.detailedBoard.getChildByPath("DetailsArea/Fetters/Sprite/Icon").getComponent(Sprite).spriteFrame=fettersImg;
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

        if(this.propBoard.active)
        {
            this.propBoard.getComponent(Animation).on(Animation.EventType.FINISHED,()=>
            {
                this.node.active=false;
                this.propBoard.getComponent(Animation).off(Animation.EventType.FINISHED);
            });
            this.propBoard.getComponent(Animation).play("PanelDisappear");
        }

        if(this.detailedBoard.active)
        {
            this.detailedBoard.getComponent(Animation).on(Animation.EventType.FINISHED,()=>
            {
                if (singleton.netSingleton.battle)
                {
                    singleton.netSingleton.battle.puase = false;
                }
                this.node.active=false;
                this.detailedBoard.getComponent(Animation).off(Animation.EventType.FINISHED);
            });
            this.detailedBoard.getComponent(Animation).play("PanelDisappear");
        }

        if(this.fetterBoard.active){
            this.fetterBoard.getComponent(Animation).on(Animation.EventType.FINISHED,()=>
            {
                this.node.active=false;
                this.fetterBoard.getComponent(Animation).off(Animation.EventType.FINISHED);
            });
            this.fetterBoard.getComponent(Animation).play("PanelDisappear");
        }  
    }

    private async LoadRoleImage(_r:Role)
    {
        try
        {
            let eq = null;
            let equipimg = null;
            if(_r.equipID)
            {
                eq=config.EquipConfig.get(_r.equipID);
                equipimg=loadAssets.LoadImg(eq.Res);
            }
            
            let fe=config.FettersConfig.get(_r.FettersSkillID.fetters_id);
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


