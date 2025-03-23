import { _decorator, animation, Animation, BlockInputEvents, Button, Component, director, game, Label, Node, RichText, sp, Sprite, SpriteFrame } from 'cc';
import { PropsType } from '../other/enums';
import { Team } from '../battle/AutoChessBattle/team';
import { RoleDis } from '../battle/display/RoleDis';
import { RoleInfo } from '../battle/AutoChessBattle/skill/skill_base';
import { config } from '../battle/AutoChessBattle/config/config';
import * as singleton from '../netDriver/netSingleton';
import { loadAssets } from '../bundle/LoadAsset';
import { Role } from '../battle/AutoChessBattle/role';
import { RoleConfig } from '../battle/AutoChessBattle/config/role_config';
import { AudioManager } from '../other/AudioManager';
import { GameManager } from '../other/GameManager';
import * as common from "../battle/AutoChessBattle/common"
import * as battleEnums from '../battle/AutoChessBattle/BattleEnums';
import { BundleManager } from '../bundle/BundleManager';
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

    protected update(dt: number): void
    {
        
    }

    protected onDestroy(): void
    {
        this.destroy();
    }

    public Exit()
    {
        //this.simpleBoard.active=false;
        //this.detailedBoard.active=false;
        this.node.getComponent(BlockInputEvents).enabled=false;
        if(this.simpleBoard.active)
        {
            this.simpleBoard.getComponent(Animation).on(Animation.EventType.FINISHED,()=>
            {
                this.simpleBoard.getComponent(Animation).off(Animation.EventType.FINISHED);
                //this.node.destroy();
                this.node.active=false;
            });
            this.simpleBoard.getComponent(Animation).play("PanelDisappear");
        }

        if(this.propBoard.active)
        {
            this.propBoard.getComponent(Animation).on(Animation.EventType.FINISHED,()=>
            {
                this.propBoard.getComponent(Animation).off(Animation.EventType.FINISHED);
                //this.node.destroy();
                this.node.active=false;
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
                this.detailedBoard.getComponent(Animation).off(Animation.EventType.FINISHED);
                //this.node.destroy();
                this.node.active=false;
            });
            this.detailedBoard.getComponent(Animation).play("PanelDisappear");
        }

        if(this.fetterBoard.active){
            this.fetterBoard.getComponent(Animation).on(Animation.EventType.FINISHED,()=>
            {
                this.fetterBoard.getComponent(Animation).off(Animation.EventType.FINISHED);
                //this.node.destroy();
                this.node.active=false;
            });
            this.fetterBoard.getComponent(Animation).play("PanelDisappear");
        } 
    }
    
    async OpenEntityInfo(id:number,index?:number,role?:RoleDis,isBuy?:boolean,propType?:PropsType)
    {
        try
        {
            this.node.setSiblingIndex(100);
            this.node.active=true;

            this.simpleBoard.active=false;
            this.detailedBoard.active=false;
            this.propBoard.active=false;
            this.fetterBoard.active=false;
    
            if(null!=propType)
            {
                this.propBoard.active=true;
                this.propBoard.getComponent(Animation).play("PanelAppear");
                this.node.getComponent(BlockInputEvents).enabled=true;
                
                //道具名
                let pn=null;
                if(1000<id&&id<2000) pn=config.FoodConfig.get(id);
                else pn=config.EquipConfig.get(id);
                
                this.propBoard.getChildByName("PropName").getComponent(Label).string=GameManager.Instance.GetText(pn.Name);
                //立绘
                let img = await loadAssets.LoadImg(pn.Res);
                if(img)
                {
                    this.propBoard.getChildByPath("Sculpture/Sprite").getComponent(Sprite).spriteFrame = img;
                }
                //简介
                this.propBoard.getChildByName("Introduce").getComponent(Label).string=GameManager.Instance.GetText(pn.Introduce);
               
            }
            else
            {
                if(null==role||!isBuy)
                {
                    //立绘
                    let tSp = this.simpleBoard.getChildByPath("Sculpture/Spine").getComponent(sp.Skeleton);
                    tSp.skeletonData = role.roleSprite.skeletonData;
                    tSp.animation = role.roleSprite.animation;

                    await this.ShowSimpel(id);

                    this.simpleBoard.active=true;
                    this.simpleBoard.getComponent(Animation).play("PanelAppear");
                    this.node.getComponent(BlockInputEvents).enabled=true;
                } 
                else
                {
                    //立绘  
                    let tSp =this.detailedBoard.getChildByPath("RoleArea/Sculpture/Sprite").getComponent(sp.Skeleton);
                    tSp.skeletonData=role.roleSprite.skeletonData;
                    tSp.animation=role.roleSprite.animation;
                    
                    await this.ShowDetailed(index,role);

                    this.detailedBoard.active=true;
                    this.detailedBoard.getComponent(Animation).play("PanelAppear");
                    this.node.getComponent(BlockInputEvents).enabled=true;
                }   
            }
            if (GameManager.Instance.guide)
            {
                GameManager.Instance.guide.next=common.GuideStep.HPInfo;
            }
        }
        catch(error)
        {
            console.error('InfoPanel 下 OpenEntityInfo 错误 err: ',error);
        }
        
    }

    async OpenFetterInfo(_id:number,spritePath:string,level:number)
    {
        this.node.setSiblingIndex(100);
        this.node.active=true;

        this.simpleBoard.active=false;
        this.detailedBoard.active=false;
        this.propBoard.active=false;
        this.fetterBoard.active=true;

        this.fetterBoard.getComponent(Animation).play("PanelAppear");
        
        this.node.getComponent(BlockInputEvents).enabled=true;

        let cf=config.FetterIntroduceConfig.get(_id);

        let sp=await loadAssets.LoadImg(spritePath);
        this.fetterBoard.getChildByPath("Sculpture/Sprite").getComponent(Sprite).spriteFrame=sp;

        this.fetterBoard.getChildByName("FetterName").getComponent(RichText).string="<color=#ffffff><outline color=#000000 width=4>"+ GameManager.Instance.GetText(cf.FetterName) + "</outline></color>";

        this.fetterBoard.getChildByName("Introduce").getComponent(Label).string=GameManager.Instance.GetText(cf.Introductory);
        let content="";
        let list=GameManager.Instance.GetText(cf.Text).split("\n");
        for(let i=0;i<list.length;i++)
        {
            if(level>=i+1) 
                content+="<color=#FFD700>"+list[i]+"</color>\n";
            else 
                content+="<color=#AAAAAA>"+list[i]+"</color>\n";        
        }
        this.fetterBoard.getChildByName("Text").getComponent(RichText).string=content;
    }

    /**
     * 打开角色卡信息
     * @param _id 角色id
     */
    public async OpenCardInfo(_id:number)
    {
        try
        {
            this.node.setSiblingIndex(100);
            this.node.active = true;
            this.node.getComponent(BlockInputEvents).enabled = true;

            this.detailedBoard.active = false;
            this.propBoard.active = false;
            this.fetterBoard.active = false;

            //立绘
            let tSp = this.simpleBoard.getChildByPath("Sculpture/Spine").getComponent(sp.Skeleton);
            loadAssets.LoadSkeletonData(config.RoleConfig.get(_id).Skel, (data) =>
            {
                if (data)
                {
                    tSp.skeletonData = data
                    let anims = tSp.skeletonData.getAnimsEnum()
                    tSp.setAnimation(0, String(anims[1]), true);
                }
            })

            await this.ShowSimpel(_id);
            this.simpleBoard.active = true;
            this.simpleBoard.getComponent(Animation).play("PanelAppear");
        } catch (error)
        {
            console.error('InfoPanel 下 OpenCardInfo 错误 err: ',error);
        }
    }

    private async ShowSimpel(_id:number)
    {
        try
        {
            //角色名
            this.simpleBoard.getChildByPath("ID").getComponent(Label).string = "id: " + _id;
            let ro = config.RoleConfig.get(_id);
            this.simpleBoard.getChildByPath("RoleName").getComponent(Label).string = GameManager.Instance.GetText(ro.Name);
            this.simpleBoard.getChildByPath("Sculpture/HP/RichText").getComponent(RichText).string = "<color=#ffffff><outline color=#670004 width=10>" + ro.Hp + "</color>";
            this.simpleBoard.getChildByPath("Sculpture/Attack/RichText").getComponent(RichText).string = "<color=#ffffff><outline color=#670004 width=10>" + ro.Attack + "</color>";
            this.simpleBoard.getChildByPath("Sculpture/Stage/RichText").getComponent(RichText).string = "<color=#ffffff><outline color=#114224 width=10>" + ro.Stage + "</color>";
            //技能介绍
            let str = config.SkillIntroduceConfig.get(_id % 100000);
            console.log(str.Id);

            this.simpleBoard.getChildByPath("TimeText").getComponent(RichText).string =
                "<color=#ffffff><outline width=5 color=#1F0000><b>发动时机：</outline></color><color=#FFB518><outline width =5 color=#1F0000><size=20><b>" +
                GameManager.Instance.GetText(str.Timeing_Text) + "</outline></color>";

            let introduce =
                "<size=50><color=#896646><outline width=5 color=#1F0000>L</outline></color></size><color=#FFB518><outline width=5 color=#1F0000>1</color></outline>" +
                "<color=#1F0000><size=30><b> " + GameManager.Instance.GetText(str.Leve1Text) + "</size>";

            this.simpleBoard.getChildByPath("RoleIntroduce/RichText").getComponent(RichText).string = introduce;

            introduce =
                "<size=50><color=#896646><outline width=5 color=#1F0000>L</outline></color></size><color=#FFB518><outline width=5 color=#1F0000>2</color></outline>" +
                "<color=#1F0000><size=30><b> " + GameManager.Instance.GetText(str.Leve2Text) + "</size>";

            this.simpleBoard.getChildByPath("RoleIntroduce/RichText-001").getComponent(RichText).string = introduce;

            introduce =
                "<size=50><color=#896646><outline width=5 color=#1F0000>L</outline></color></size><color=#FFB518><outline width=5 color=#1F0000>3</color></outline>" +
                "<color=#1F0000><size=30><b> " + GameManager.Instance.GetText(str.Leve3Text) + "</size>";

            this.simpleBoard.getChildByPath("RoleIntroduce/RichText-002").getComponent(RichText).string = introduce;

            //this.simpleBoard.getChildByPath("RoleIntroduce").getComponent(Label).string = GameManager.Instance.GetText(str.Leve1Text);
            //羁绊
            //let ft = config.FettersConfig.get(ro.Fetters);
            //this.simpleBoard.getChildByPath("Fetters").getComponent(RichText).string = "<color=#ffffff><outline color=#000000 width = 4>" + GameManager.Instance.GetText(ft.Name) + "</outline></color>";
            //羁绊图标
            //let fe=config.FettersConfig.get(ro.Fetters);
            //let fettersImg = await loadAssets.LoadImg(fe.Res);
            //this.simpleBoard.getChildByPath("Fetters/FettersSprite/Icon").getComponent(Sprite).spriteFrame=fettersImg;
        } catch (error)
        {
            console.error('InfoPanel 下 ShowSimpel 错误 err: ',error);
        }
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
                r=new common.Role();
                r.RoleID=_role.GetRoleInfo().id;
                r.Attack=_role.GetRoleInfo().GetProperty(battleEnums.Property.Attack);
                r.HP=_role.GetRoleInfo().GetProperty(battleEnums.Property.HP);
                r.Level=_role.GetRoleInfo().level;
                r.equipID=_role.GetRoleInfo().equip;
                r.SkillID=_role.GetRoleSkillID();
                let buff=[];
                for(let i of _role.GetRoleInfo().buffer)
                {
                    buff.push(i);
                }
                r.additionBuffer=buff;
                r.FettersSkillID=_role.GetRoleInfo().fetter;
                //r=_role.GetRoleInfo().c_role;
            }
            let ro=config.RoleConfig.get(r.RoleID);
            //工具生命等级
            this.detailedBoard.getChildByPath("RoleArea/Atk/RichText").getComponent(RichText).string="<color=0>"+r.Attack+"</color>";
            this.detailedBoard.getChildByPath("RoleArea/HP/RichText").getComponent(RichText).string="<color=0>"+r.HP+"</color>";
            this.detailedBoard.getChildByPath("RoleArea/Lv/RichText").getComponent(RichText).string="<color=0>"+r.Level+"</color>";
            //名字
            this.detailedBoard.getChildByPath("RoleArea/Name/RichText").getComponent(RichText).string="<color=#b98b00><outline width=5>"+GameManager.Instance.GetText(ro.Name)+"</outline></color>";
            //技能信息
            let sk=config.SkillIntroduceConfig.get(r.SkillID);
            this.detailedBoard.getChildByPath("IntroduceArea/TimeingText").getComponent(RichText).string="<color=#785d00><outline width=5>"+GameManager.Instance.GetText(sk.Timeing_Text)+": </outline></color>";
            let str="";
            switch(r.Level)
            {
                case 1:str=GameManager.Instance.GetText(sk.Leve1Text);break;
                case 2:str=GameManager.Instance.GetText(sk.Leve2Text);break;
                case 3:str=GameManager.Instance.GetText(sk.Leve3Text);break;
            }
            this.detailedBoard.getChildByPath("IntroduceArea/Label").getComponent(Label).string=str;
            //羁绊
            let ft=config.FettersConfig.get(ro.Fetters);
            this.detailedBoard.getChildByPath("DetailsArea/Fetters/RichText").getComponent(RichText).string="<color=#785d00>"+GameManager.Instance.GetText(ft.Name)+"</color>";
            //buff
            let bustr:string="";
            if(r.additionBuffer)
            {
                console.warn("角色身上的buff：",r.additionBuffer);
                for(let i of r.additionBuffer)
                {
                    let b=config.BufferConfig.get(i);
                    if(b)
                    {
                        bustr+=b.Name+"\n";
                    }
                }
            }
            this.detailedBoard.getChildByPath("DetailsArea/Buff/Label").getComponent(Label).string=bustr;
            //购买时的回合
            if(singleton.netSingleton.battle)
            {
                this.detailedBoard.getChildByPath("DetailsArea/BuyRound/RichText").active=false;
            }
            else
            {
                this.detailedBoard.getChildByPath("DetailsArea/BuyRound/RichText").getComponent(RichText).string=`<color=#ac8352>--在第${r.BuyRound}回合购买--</color>`;
            }
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

    private async LoadRoleImage(_r:common.Role)
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


