import { _decorator, Animation, assetManager, BlockInputEvents, Button, color, Component, EventHandler, ImageAsset, instantiate, Label, Node, Prefab, ScrollView, Sprite, SpriteFrame, Texture2D, Vec3 } from 'cc';
import { AudioManager } from '../other/AudioManager';
import { rank_item } from '../serverSDK/rank_comm';
import * as singleton from '../netDriver/netSingleton';
import { BundleManager } from '../bundle/BundleManager';
import { Role, UserData, UserRankInfo } from '../serverSDK/common';
import { loadAssets } from '../bundle/LoadAsset';
import { config } from '../config/config';
const { ccclass, property } = _decorator;

@ccclass('RankList')
export class RankList extends Component 
{
    private closeBtn:Node;
    private board:Node;
    private listcontent:Node;

    //预制体
    private rankFarmePre:Prefab;
    private roleFarmePre:Prefab;

    private pointer:number=0;
    private listStartY:number=0;
    private rankInfo:Map<rank_item,UserRankInfo>;

    protected onLoad(): void 
    {
        this.closeBtn=this.node.getChildByPath("Board/Close_Btn");
        this.board=this.node.getChildByPath("Board");
        this.listcontent=this.board.getChildByPath("RankView/view/content");

        this.Init();
    }

    start() 
    {
        this.closeBtn.on(Button.EventType.CLICK,()=>
        {
            AudioManager.Instance.PlayerOnShot("Sound/sound_click_close_01");
            this.node.getComponent(BlockInputEvents).enabled=false;
            this.Close();
        },this);

        this.node.on(Button.EventType.CLICK,()=>
        {
            this.node.getComponent(BlockInputEvents).enabled=false;
            this.Close();
        },this);

        this.listStartY=this.listcontent.position.y;
    }

    private async Init()
    {
        this.RegCallBack();
        this.rankFarmePre=await BundleManager.Instance.loadAssetsFromBundle("Parts","RankFarme") as Prefab;
        this.roleFarmePre=await BundleManager.Instance.loadAssetsFromBundle("Parts","RoleFarme") as Prefab;
    }
    
    private RegCallBack()
    {
        singleton.netSingleton.player.cb_get_rank_guid=(_rank,_info)=>
        {
            //获取个人排行、展示代码写这
        }
        singleton.netSingleton.player.cb_get_rank_range=(_rank_info)=>
        {
            //获取区间排行、展示代码写这
        }
    }

    protected update(dt: number): void
    {
        this.OnDragEvent();
    }

    //列表采用动态加载，节省空间
    private OnDragEvent()
    {
        //100记得改成字典的长度
        if(this.pointer+24 < 100 && this.listcontent.position.y>=this.listStartY+16*120)
        {
            if(this.board.getChildByPath("RankView").getComponent(ScrollView).isAutoScrolling())
            {
                return;
            }
            let downLoad=8;
            this.pointer+=downLoad;
            
            if(this.pointer+24>100)//100记得改成字典的长度
            {
                let outLen=this.pointer+24-100;//100记得改成字典的长度
                downLoad-=outLen;
                this.pointer-=downLoad;
            }
            //此处更新物体信息
            //.....
            this.listcontent.setPosition(new Vec3(0,this.listcontent.position.y-downLoad*120,0));
            return;
        }

        if(this.pointer>0 && this.listcontent.position.y<= this.listStartY)
        {
            if(this.board.getChildByPath("RankView").getComponent(ScrollView).isAutoScrolling())
            {
                return;
            }
            let upLoad=8;
            this.pointer-=upLoad;
            if(this.pointer<0)
            {
                upLoad+=this.pointer;
                this.pointer=0;
            }
            //此处更新物体信息
            //.....
            this.listcontent.setPosition(new Vec3(0,this.listcontent.position.y+upLoad*120,0));
        }
    }

    public OpenRankListBoard(_userInfo:UserData)
    {
        try
        {
            AudioManager.Instance.PlayerOnShot("Sound/sound_home_return_feedback_01");
            this.node.getComponent(BlockInputEvents).enabled=true;
            this.node.setSiblingIndex(98);
            this.node.active=true;
            this.board.getComponent(Animation).play("PanelAppear");
            let avatar=this.board.getChildByPath("UserAvatar");
            this.ShowUserData(_userInfo,avatar);
        }
        catch(error)
        {
            console.error("RankList 下的 OpenRankListBoard 错误 : ",error);
        }
    }

    private async ShowUserData(_userData:UserData,_avatar:Node)
    {
        try
        {
            console.log("尝试加载头像：",_userData.User.Avatar);
            this.ShowAvatar(_userData.User.Avatar , _avatar.getChildByPath("Mask/Sprite"));
            //显示用户信息
            //...

        }
        catch(error)
        {
            console.error('UserInfo 下 ShowUserData 错误 err: ',error);
        }
        
    }

    private async ShowAvatar(_url:string,_avatar:Node)
    {
        try
        {
            console.log("尝试加载头像：",_url);
            let sprite=_avatar.getComponent(Sprite);
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

    private ShowRankList(_rank_Info:Map<rank_item,UserRankInfo>)
    {
        let i=0;
        for(let [key , value] of _rank_Info)
        {
            if(i>24)
            {
                this.pointer=i;
                break;
            }
            let t=instantiate(this.rankFarmePre);
            if(key.rank<=3)
            {
                switch(key.rank)
                {
                    case 1:t.getChildByPath("RankFlag").children[0].active=true;break;
                    case 2:t.getChildByPath("RankFlag").children[1].active=true;break;
                    case 3:t.getChildByPath("RankFlag").children[2].active=true;break;
                }
            }
            t.getChildByPath("RankNmber").getComponent(Label).string=""+key.rank;
            t.getChildByPath("UserName").getComponent(Label).string=""+value.nick_name;
            t.getChildByPath("RoundInfo").getComponent(Label).string=`${value.battle_data.victory}\n${value.battle_data.faild}\n${value.battle_data.round}`;
            this.ShowAvatar(value.avatar , t.getChildByPath("UserAvatar/Mask/Sprite"));
            this.node.getChildByPath("RankView/view/content").addChild(t);
            this.ShowRoleList(value.battle_data.RoleList,t.getChildByPath("RoleList"));
            i++;
        }
    }

    private async ShowRoleList(_roleList:Role[] , _parent:Node)
    {
        for(let i=0;i<_roleList.length;i++)
        {
            let jconfig=config.RoleConfig.get(_roleList[i].RoleID);
            let str=jconfig.Avatar;
            let t=instantiate(this.roleFarmePre);
            t.getChildByPath("Mask/Sprite").getComponent(Sprite).spriteFrame=await loadAssets.LoadImg(str);
            switch(_roleList[i].Level)
            {
                case 1:t.getChildByPath("Farme").getComponent(Sprite).color.set(255,255,255);break;
                case 2:t.getChildByPath("Farme").getComponent(Sprite).color.set(255,255,255);break;
                case 3:t.getChildByPath("Farme").getComponent(Sprite).color.set(255,255,255);break;
            }
            _parent.addChild(t);
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


