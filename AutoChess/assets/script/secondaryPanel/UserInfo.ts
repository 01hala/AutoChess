
import { _decorator, Animation, assetManager, BlockInputEvents, Button, Component, ImageAsset, Label, Node, RichText, Sprite, SpriteFrame, Texture2D } from 'cc';
import { AudioManager } from '../other/AudioManager';
import * as singleton from '../netDriver/netSingleton';
import * as common from "../battle/AutoChessBattle/common"
const { ccclass, property } = _decorator;

@ccclass('UserInfo')
export class UserInfo extends Component 
{
    private closeBtn:Node;
    private panelNode:Node;


    protected onLoad(): void 
    {
        this.closeBtn=this.node.getChildByPath("PanelNode/Close_Btn");
        this.panelNode=this.node.getChildByPath("PanelNode");
    }


    start() 
    {
        this.closeBtn.on(Button.EventType.CLICK,()=>
        {
            AudioManager.Instance.PlayerOnShot("Sound/sound_click_close_01");
            this.node.getComponent(BlockInputEvents).enabled=false;
            this.Close();
        },this);
    }

    update(deltaTime: number) {
        
    }

    public OpenUserInfoBoard(_url:string)
    {
        try
        {
            AudioManager.Instance.PlayerOnShot("Sound/sound_home_return_feedback_01");
            this.node.getComponent(BlockInputEvents).enabled=true;
            this.node.setSiblingIndex(98);
            this.node.active=true;
            this.ShowUserInfo();
            this.ShowAvatar(_url);
            this.panelNode.getComponent(Animation).play("PanelAppear");
        }
        catch(error)
        {
            console.error('UserInfo 下 Open 错误 err: ',error);
        }
    }

    private Close()
    {
        try
        {
            this.panelNode.getComponent(Animation).on(Animation.EventType.FINISHED,()=>
            {
                this.node.active=false;
                this.panelNode.getComponent(Animation).off(Animation.EventType.FINISHED);
            });
            this.panelNode.getComponent(Animation).play("PanelDisappear");
        }
        catch(error)
        {
            console.error('UserInfo 下 Close 错误 err: ',error);
        }
    }

    public async ShowAvatar(_url:string)
    {
        try
        {
            console.log("尝试加载头像：",_url);
            let sprite=this.node.getChildByPath("PanelNode/UserAvatar/Mask/Sprite").getComponent(Sprite);
            await assetManager.loadRemote<ImageAsset>(_url,{ext:'.jpg'},(_err,image)=>
            {
                let sp = new SpriteFrame();
                let texture = new Texture2D();
                texture.image = image;
                sp.texture = texture
                sprite.spriteFrame = sp;
            });
        }
        catch(error)
        {
            console.error('UserInfo 下 ShowAvatar 错误 err: ',error);
        }
        
    }

    ShowUserInfo()
    {
        //用户名
        this.node.getChildByPath("PanelNode/UserName/Label").getComponent(Label).string=""+singleton.netSingleton.mainInterface.userData.User.UserName;
        //id
        this.node.getChildByPath("PanelNode/BasicInfo/UserId/RichText").getComponent(RichText).string=
            "<color=#f3bb51><outline color=72461f width=3>" +singleton.netSingleton.mainInterface.userData.User.UserGuid + "</outline></color>";
        //分段
        let rank;
        switch(singleton.netSingleton.mainInterface.userData.rank)
        {
            case common.UserRank.BlackIron:rank="黑铁";break;
            case common.UserRank.Bronze:rank="青铜";break;
            case common.UserRank.Silver:rank="白银";break;
            case common.UserRank.Gold:rank="黄金";break;
            case common.UserRank.Diamond:rank="钻石";break;
            case common.UserRank.Master:rank="大师";break;
            case common.UserRank.King:rank="王者";break;
        }
        this.node.getChildByPath("PanelNode/BasicInfo/Rank/RichText").getComponent(RichText).string="<color=#f3bb51><outline color=72461f width=3>" + rank + "</color>";
    }
}


