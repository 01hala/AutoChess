import { _decorator, Animation, assetManager, Button, Component, ImageAsset, Node, Sprite, SpriteFrame, Texture2D } from 'cc';
import { AudioManager } from '../other/AudioManager';
import { rank_item } from '../serverSDK/rank_comm';
const { ccclass, property } = _decorator;

@ccclass('RankList')
export class RankList extends Component 
{
    private closeBtn:Node;
    private board:Node;

    protected onLoad(): void 
    {
        this.closeBtn=this.node.getChildByPath("Board/Close_Btn");
        this.board=this.node.getChildByPath("Board");
    }

    start() 
    {
        this.closeBtn.on(Button.EventType.CLICK,()=>
        {
            AudioManager.Instance.PlayerOnShot("Sound/sound_click_close_01");
            this.Close();
        },this);

    }

    update(deltaTime: number) {
        
    }

    public OpenRankListBoard(_url:string,_rank:number,_rank_list:rank_item[])
    {
        try
        {
            AudioManager.Instance.PlayerOnShot("Sound/sound_home_return_feedback_01");
            this.node.setSiblingIndex(98);
            this.node.active=true;
            this.board.getComponent(Animation).play("PanelAppear");
            let avatar=this.board.getChildByPath("UserAvatar/Mask/Sprite");
            this.ShowAvatar(_url,avatar);
        }
        catch(error)
        {
            console.error("RankList 下的 OpenRankListBoard 错误 : ",error);
        }
    }

    private async ShowAvatar(_url:string,_node:Node)
    {
        try
        {
            console.log("尝试加载头像：",_url);
            let sprite=_node.getComponent(Sprite);
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

    private Close()
    {
        try
        {
            this.board.getComponent(Animation).on(Animation.EventType.FINISHED,()=>
            {
                this.node.active=false;
                this.board.getComponent(Animation).off(Animation.EventType.FINISHED);
            });
            this.board.getComponent(Animation).play("PanelDisappear");
        }
        catch(error)
        {
            console.error("RankList 下的 Close 错误 : ",error);
        }
    }
}


