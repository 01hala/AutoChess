import { _decorator, Animation, animation, Button, Component, Label, Node, RichText, Sprite } from 'cc';
import * as singleton from '../netDriver/netSingleton';
import { config } from '../battle/AutoChessBattle/config/config';
import { loadAssets } from '../bundle/LoadAsset';
import { GameManager } from '../other/GameManager';
const { ccclass, property } = _decorator;

@ccclass('ChooseTag')
export class ChooseTag extends Component 
{   
    private board:Node;

    private tag_1:Node;
    private tag_2:Node;
    private tag_3:Node;

    private tags:number[]=[];

    private tagnodes=[];

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
        this.tagnodes=[this.tag_1,this.tag_2,this.tag_3];
    }

    protected onDestroy(): void
    {
        this.destroy();
    }

    Init()
    {
        this.tag_1.on(Button.EventType.CLICK, () =>
        {
            console.log(" On ChooseTag：",this.tags[0]);
            singleton.netSingleton.ready.readyData.ChooseTag(this.tags[0]);
            this.Exit();
        }, this);
        this.tag_2.on(Button.EventType.CLICK, () =>
        {
            console.log(" On ChooseTag：",this.tags[1]);
            singleton.netSingleton.ready.readyData.ChooseTag(this.tags[1]);
            this.Exit();
        }, this);
        this.tag_3.on(Button.EventType.CLICK, () =>
        {
            console.log(" On ChooseTag：",this.tags[2]);
            singleton.netSingleton.ready.readyData.ChooseTag(this.tags[2]);
            this.Exit();
        }, this);
    }

    Open(_events:number[])
    {   
        this.board.active=true;
        console.log("open ChooseTag")
        this.node.setSiblingIndex(100);

        this.board.getComponent(Animation).play("PanelAppear");
        
        this.SetTags(_events);
        this.Init();
    }

    async SetTags(_events:number[])
    {
        
        for(let i=0;i<_events.length;i++)
        {
            this.tags.push(_events[i]);
            let pvec=config.PVEventConfig.get(_events[i]);
            if (pvec.RoleId)
            {
                let rolec = config.RoleConfig.get(pvec.RoleId);
                this.tagnodes[i].getChildByPath("RichText").getComponent(RichText).string = "<color=#000000>" + GameManager.Instance.GetText(rolec.Name) + "</color>";

                this.tagnodes[i].getChildByPath("Avatar/Hp/RichText").
                    getComponent(RichText).string = "<color=#9d0c27><outline color=#e93552 width=4>" + pvec.RoleHP + "</outline></color>";
                this.tagnodes[i].getChildByPath("Avatar/Atk/RichText").
                    getComponent(RichText).string = "<color=#f99b08><outline color=#fff457 width=4>" + pvec.RoleAttack + "</outline></color>";
                this.tagnodes[i].getChildByPath("Avatar/Lvl/RichText").
                    getComponent(RichText).string = "<color=1d994f><outline color=74eda5 width=4>"+(pvec.RoleLevel?pvec.RoleLevel:1)+"</outline></color>";


                let skcfg = config.SkillIntroduceConfig.get(rolec.SkillID);
                let skillInfo = "";
                switch (pvec.RoleLevel)
                {
                    case 1: skillInfo = GameManager.Instance.GetText(skcfg.Leve1Text); break;
                    case 2: skillInfo = GameManager.Instance.GetText(skcfg.Leve2Text); break;
                    case 3: skillInfo = GameManager.Instance.GetText(skcfg.Leve3Text); break;
                    default:skillInfo = GameManager.Instance.GetText(skcfg.Leve1Text);
                }
                this.tagnodes[i].getChildByPath("Label").getComponent(Label).string = GameManager.Instance.GetText(skcfg.Timeing_Text) + ":\n" + skillInfo;

                let img = await loadAssets.LoadImg(rolec.Avatar);
                if (img)
                {
                    this.tagnodes[i].getChildByPath("Avatar/Mask/Sprite").getComponent(Sprite).spriteFrame = img;
                }
                
                let propc=config.EquipConfig.get(pvec.RoleEquip);
                if (propc) {
                    img =await loadAssets.LoadImg(propc.Res);
                    if(img)
                    {
                        this.tagnodes[i].getChildByPath("Avatar/Equip/Sprite").getComponent(Sprite).spriteFrame = img;
                    }
                    else
                    {
                        this.tagnodes[i].getChildByPath("Avatar/Equip/Sprite").getComponent(Sprite).spriteFrame=null;
                    }
                }
            }            
        }
    }

    Exit()
    {
        this.board.getComponent(Animation).on(Animation.EventType.FINISHED,()=>
        {
            this.node.destroy();
        })
        this.board.getComponent(Animation).play("PanelDisappear");
    }
}


