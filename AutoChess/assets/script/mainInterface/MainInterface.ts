import { _decorator, Animation, animation, assetManager, Button, Component, ImageAsset, instantiate, Node, Prefab, RichText, Sprite, SpriteFrame, Texture2D, Toggle, tween } from 'cc';
import * as singleton from '../netDriver/netSingleton';
import { BundleManager } from '../bundle/BundleManager';
import { StorePanel } from './StorePanel';
import { Bag, RoleCardInfo, UserData } from '../serverSDK/common';
import { CardPacket } from '../serverSDK/ccallplayer';
import { StorePrompt } from '../secondaryPanel/StorePrompt';
import { UserInfo } from '../secondaryPanel/UserInfo';
import { CardLib } from './CardLib';
import { SendMessage } from '../other/MessageEvent';
import { StartGame } from './StartGame';
import { AudioManager } from '../other/AudioManager';
const { ccclass, property } = _decorator;

//玩家账户信息
export class UserAccount
{
    public money:number;//金币
    public diamond:number;//钻石
    public playerBag:Bag;//背包

    constructor()
    {
        this.money=0;
        this.diamond=0;
        this.playerBag=null;
    }
}

export class MainInterface 
{
    //父节点
    public father:Node;
    //主体
    public panelNode:Node;
    //主界面
    public mainPanel:Node
    //开始界面
    public startGamePanel:Node;
    //商店界面
    private storePanel:Node;
    //牌库界面
    private cardLibPanel:Node;
    //各区域按钮
    private startBtn:Node;
    private storeBtn:Node;
    private amusementBtn:Node;
    private cardlibraryBtn:Node;
    private taskAchieveBtn:Node;
    //侧边伸缩按钮区
    private btnList:Node;
    //伸缩按钮区切换开关
    private btnListSwitch:boolean=false;
    //玩家信息
    public userAccount:UserAccount;
    private userMoney:Node;
    private userDiamonds:Node;
    private avatarUrl:string;
    private userData:UserData;
    //玩家头像
    private userAvatar:Node;

    constructor()
    {
        this.RegCallBack();
        this.userAccount=new UserAccount();
    }
/*
 * 添加Load
 * author：Hotaru
 * 2024/03/20
 * 整理代码
 */
    private async Load()
    {
        let MainInterfacePromise= BundleManager.Instance.loadAssetsFromBundle("Panel", "MainInterface");
        let StorePanelmPromise= BundleManager.Instance.loadAssetsFromBundle("Panel", "StorePanel");
        let CardLibPromise=BundleManager.Instance.loadAssetsFromBundle("Panel","CardLibrary");

        let awaitResult= await Promise.all([
            MainInterfacePromise, 
            StorePanelmPromise,
            CardLibPromise
        ]);;

        return awaitResult;
    }
/*
 * 修改start
 * author：Hotaru
 * 2024/03/07
 * 让加载更平顺
 */
    async start(_father:Node,_callBack:(e?:()=>void)=>void)
    {
        try
        {
            this.father=_father;
            //加载
            let assets = await this.Load();
            let MainInterfacepanel = assets[0] as Prefab;
            let StorePanel=assets[1] as Prefab;
            let CardLib=assets[2] as Prefab;
            //主界面
            this.panelNode=instantiate(MainInterfacepanel);
            //商店界面
            this.storePanel=instantiate(StorePanel);
            this.storePanel.setParent(_father);
            this.storePanel.active=false;
            //牌库界面
            this.cardLibPanel=instantiate(CardLib);
            this.cardLibPanel.setParent(_father);
            this.cardLibPanel.active=false;
            //各区域面板
            this.mainPanel=this.panelNode.getChildByPath("MainPanel")
            this.startGamePanel=this.panelNode.getChildByPath("StartGamePanel");
            //各区域按钮
            this.startBtn=this.panelNode.getChildByPath("MainPanel/BottomLayer/StartHouse/Start_Btn");
            this.storeBtn=this.panelNode.getChildByPath("MainPanel/BottomLayer/StoreHoues/Store_Btn");
            this.amusementBtn=this.panelNode.getChildByPath("MainPanel/BottomLayer/Amusement/Amusement_Btn");
            this.cardlibraryBtn=this.panelNode.getChildByPath("MainPanel/BottomLayer/CardLib/CardLib_Btn");
            this.btnList=this.panelNode.getChildByPath("MainPanel/UiLayer/BtnList");
            this.taskAchieveBtn=this.panelNode.getChildByPath("MainPanel//UiLayer/BtnList/BtnLayout/Task_Btn");
            //玩家信息
            this.userMoney=this.panelNode.getChildByPath("MainPanel/UiLayer/UserMoney");
            this.userDiamonds=this.panelNode.getChildByPath("MainPanel/UiLayer/UserDiamonds");
            this.userAvatar=this.panelNode.getChildByPath("MainPanel/UiLayer/UserAvatar");
            //初始化
            this.Init();
            _callBack();
        }
        catch(error)
        {
            console.error('MainInterface 下 Start 错误 err: ',error);
        }
        
    }

    public destory() {
        this.panelNode.destroy();
    }

    private Init() 
    {
        try
        {
            this.startGamePanel.active=false;
            this.storePanel.active=false;
            //打开匹配
            this.startBtn.on(Button.EventType.CLICK,()=>
            {
                AudioManager.Instance.PlayerOnShot("Sound/sound_base_select_01");
                console.log("startBtn OpenAthleticsWindow!");
                this.startGamePanel.active=true;
                this.startGamePanel.getComponent(StartGame).OpenAthleticsWindow();
                //this.mainPanel.active=false;
    
            },this);
            //打开自定义模式
            this.amusementBtn.on(Button.EventType.CLICK,()=>
            {
                AudioManager.Instance.PlayerOnShot("Sound/sound_base_select_01");
                this.startGamePanel.active=true;
                this.startGamePanel.getComponent(StartGame).OpenAmusementWindow();
            },this);
            //打开商店
            this.storeBtn.on(Button.EventType.CLICK,()=>
            {
                AudioManager.Instance.PlayerOnShot("Sound/sound_base_select_01");
                this.storePanel.active=true;
                this.panelNode.active=false;
                this.storePanel.getComponent(StorePanel).CheckStoreToggle(true);
                this.storePanel.getComponent(StorePanel).toggleGroup.getChildByPath("Store").getComponent(Toggle).isChecked=true;
            },this);
            //打开牌库界面
            this.cardlibraryBtn.on(Button.EventType.CLICK,()=>
            {
                AudioManager.Instance.PlayerOnShot("Sound/sound_base_select_01");
                this.cardLibPanel.active=true;
                this.panelNode.active=false;
                this.cardLibPanel.getComponent(CardLib).Open();
            },this);
            //按钮条切换
            this.btnList.getChildByPath("Switch_Btn").on(Button.EventType.CLICK,()=>
            {
                AudioManager.Instance.PlayerOnShot("Sound/sound_click_01");
                this.btnListSwitch=!this.btnListSwitch;
                tween(this.btnList).to(0,{}).call(()=>
                {
                    if(this.btnListSwitch)
                    {
                        this.btnList.getComponent(Animation).play("ListDown");
                    }
                    else
                    {
                        this.btnList.getChildByPath("BtnLayout").active=this.btnListSwitch;
                        this.btnList.getComponent(Animation).play("ListUp");
                    }
                }).delay(0.4).call(()=>
                {
                    this.btnList.getComponent(Animation).resume();
                    this.btnList.getChildByPath("BtnLayout").active=this.btnListSwitch;
                }).start();
    
            },this);
            //打开用户信息界面
            this.userAvatar.on(Button.EventType.CLICK,()=>
            {
                AudioManager.Instance.PlayerOnShot("Sound/sound_player_homepage_01");
                this.panelNode.dispatchEvent(new SendMessage('OpenUserInfoBoard',true,this.avatarUrl));
            },this);
            //打开任务、成就界面
            this.taskAchieveBtn.on(Button.EventType.CLICK,()=>
            {
                AudioManager.Instance.PlayerOnShot("Sound/sound_click_01");
                this.panelNode.dispatchEvent(new SendMessage('OpenTaskAchieveBoard',true));
            })
        }
        catch(error)
        {
            console.error('MainInterface 下 Init 错误 err: ',error);
        }
    }

    RegCallBack()
    {
        singleton.netSingleton.player.cb_buy_card_packet=(_cardPacketInfo:CardPacket,_bagInfo:Bag)=>
        {
            //回调打开弹窗显示获得的卡牌或者碎片
            if(_bagInfo && _cardPacketInfo)
            {
                this.userAccount.playerBag=_bagInfo;
                this.storePanel.getComponent(StorePanel).ShowCardPacketContent(_cardPacketInfo);
            }
        };
        singleton.netSingleton.player.cb_buy_card_merge=(_roleId:number,_playerInfo:UserData)=>
        {
            //回调合并碎片后获得卡牌
        }
        singleton.netSingleton.player.cb_edit_role_group=(_userInfo:UserData)=>
        {
            //回调编辑卡组
        }
        singleton.netSingleton.player.cb_get_user_data=(_userData:UserData)=>
        {
            this.userData=_userData;
            this.userAccount.money=_userData.gold;
            this.userAccount.playerBag=_userData.bag;
            this.userAccount.diamond=_userData.diamond;
            this.userMoney.getChildByPath("RichText").getComponent(RichText).string=""+_userData.gold;
            this.userDiamonds.getChildByPath("RichText").getComponent(RichText).string=""+_userData.diamond;
        }
    }

    public async ShowAvatar(_url:string)
    {
        try
        {
            console.log("尝试加载头像：",_url);
            this.avatarUrl=_url;
            let sprite=this.mainPanel.getChildByPath("UiLayer/UserAvatar/Mask/Sprite").getComponent(Sprite);
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
            console.error('MainInterface 下 ShowAvatar 错误 err: ',error);
        }
        
    }
}


