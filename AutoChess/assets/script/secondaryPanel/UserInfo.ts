
import { _decorator, Animation, assetManager, Button, Component, ImageAsset, Node, Sprite, SpriteFrame, Texture2D } from 'cc';
import { AudioManager } from '../other/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('UserInfo')
export class UserInfo extends Component 
{
    private closeBtn:Button;
    private panelNode:Node;


    protected onLoad(): void 
    {
        this.closeBtn=this.node.getChildByPath("PanelNode/Close_Btn").getComponent(Button);
        this.panelNode=this.node.getChildByPath("PanelNode");
    }


    start() 
    {
        this.closeBtn.node.on(Button.EventType.CLICK,()=>
        {
            AudioManager.Instance.PlayerOnShot("Sound/sound_click_close_01");
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
            this.node.setSiblingIndex(98);
            this.node.active=true;
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
}


