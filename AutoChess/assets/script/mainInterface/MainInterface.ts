import { _decorator, Animation, animation, assetManager, Button, Camera, Component, ImageAsset, instantiate, Node, Prefab, RichText, screen, Sprite, SpriteFrame, sys, Texture2D, Toggle, tween, Vec3, view, Widget } from 'cc';
import * as singleton from '../netDriver/netSingleton';
import { BundleManager } from '../bundle/BundleManager';
import { StorePanel } from './StorePanel';
import * as common from "../battle/AutoChessBattle/common"
import { Bag, RankReward, RoleCardInfo, UserAchievement, UserData, UserWeekAchievement } from '../battle/AutoChessBattle/common';
import { CardPacket } from '../serverSDK/ccallplayer';
import { StorePrompt } from '../secondaryPanel/StorePrompt';
import { UserInfo } from '../secondaryPanel/UserInfo';
import { CardLib } from './CardLib';
import { SendMessage } from '../other/MessageEvent';
import { StartGame } from './StartGame';
import { AudioManager } from '../other/AudioManager';
import * as enums from '../other/enums';
import { CardEditor } from './CardEditor';
import { GameManager } from '../other/GameManager';
import SdkManager from '../SDK/SdkManager';
import { login } from '../login/login';
const { ccclass, property } = _decorator;

//玩家账户信息
export class UserAccount
{
    public money:number;//金币
    public diamond:number;//钻石
    public playerBag:Bag;//背包
    public Achiev : UserAchievement | null = null;//成就
    public wAchiev : UserWeekAchievement | null = null;//周成就（任务）
    public guideStep:common.GuideStep;
    public rank:common.UserRank;
    public rankScore:number;

    constructor()
    {
        this.money=0;
        this.diamond=0;
        this.rank = common.UserRank.BlackIron;
        this.rankScore=0;
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
    //卡组编辑界面
    private cardEditorPanel:Node
    //各区域按钮
    private startBtn:Node;//匹配按钮
    private storeBtn:Node;//商店按钮
    private amusementBtn:Node;//娱乐模式按钮
    private cardlibraryBtn:Node;//牌库按钮
    private taskAchieveBtn:Node;//任务按钮
    private rankListBtn:Node;//排行榜按钮
    private cardEditor:Node;//卡组编辑按钮
    //侧边伸缩按钮区
    private btnList:Node;
    //伸缩按钮区切换开关
    private btnListSwitch:boolean=false;
    //玩家信息
    public userAccount:UserAccount;
    private userMoney:Node;
    private userDiamonds:Node;
    private avatarUrl:string;
    public userData:common.UserData;
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
        let CardEditorPromise = BundleManager.Instance.loadAssetsFromBundle("Panel" , "CardEditor");

        let awaitResult= await Promise.all([
            MainInterfacePromise, 
            StorePanelmPromise,
            CardLibPromise,
            CardEditorPromise
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
            let CardEditor=assets [3] as Prefab;
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
            //
            this.cardEditorPanel=instantiate(CardEditor);
            this.cardEditorPanel.setParent(_father);
            this.cardEditorPanel.active=false;
            //各区域面板
            this.mainPanel=this.panelNode.getChildByPath("MainPanel")
            this.startGamePanel=this.panelNode.getChildByPath("StartGamePanel");
            //各区域按钮
            this.startBtn=this.panelNode.getChildByPath("MainPanel/BottomLayer/StartHouse/Button");//匹配
            this.storeBtn=this.panelNode.getChildByPath("MainPanel/BottomLayer/StoreHoues/Store_Btn");//商店
            this.amusementBtn=this.panelNode.getChildByPath("MainPanel/BottomLayer/Amusement/Amusement_Btn");//娱乐
            this.cardlibraryBtn=this.panelNode.getChildByPath("MainPanel/BottomLayer/CardLib/CardLib_Btn");//牌库
            this.rankListBtn=this.panelNode.getChildByPath("MainPanel/BottomLayer/RankList/Rank_Btn");//排行
            //下拉按钮列表
            this.btnList=this.panelNode.getChildByPath("MainPanel/UiLayer/TopArea/BtnList");//下拉列表
            this.cardEditor=this.panelNode.getChildByPath("MainPanel/UiLayer/TopArea/BtnList/BtnLayout/Card_Btn");//卡组编辑
            this.taskAchieveBtn=this.panelNode.getChildByPath("MainPanel/UiLayer/TopArea/BtnList/BtnLayout/Task_Btn");//任务
            //玩家信息
            this.userMoney=this.panelNode.getChildByPath("MainPanel/UiLayer/TopArea/UserMoney");
            this.userDiamonds=this.panelNode.getChildByPath("MainPanel/UiLayer/TopArea/UserDiamonds");
            this.userAvatar=this.panelNode.getChildByPath("MainPanel/UiLayer/TopArea/UserAvatar");
            //屏幕适配
            this.Adaptation();
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
/*
 * 添加Adaptation
 * author：Hotaru
 * 2024/06/1
 * 屏幕适配
 */
    private Adaptation()
    {
        try
        {
            let cam=this.father.getChildByPath("Camera");
            
            if (SdkManager.SDK.getSystemInfo().safeArea.height == SdkManager.SDK.getSystemInfo().screenHeight)
            {
                return;
            }
            //底部物体对齐
            let outPos: Vec3 = cam.getComponent(Camera).screenToWorld(new Vec3(0, 0, 0));
            this.mainPanel.getChildByPath("BG/Foreground").getComponent(Widget).bottom=outPos.y;
            //顶部物体对齐
            this.mainPanel.getChildByPath("BG/SkyBg").getComponent(Widget).top=outPos.y;
            
            let safeHeigh=(SdkManager.SDK.getSystemInfo().screenHeight - SdkManager.SDK.getSystemInfo().safeArea.height);
            if(SdkManager.SDK.getSystemInfo().platform === "android")
            {
                safeHeigh*=2;
            }
            console.log("screen Height : ",SdkManager.SDK.getSystemInfo().screenHeight);
            console.log("SafeArea Height : ",SdkManager.SDK.getSystemInfo().safeArea.height);
            console.log("bpttomHeigh : ",safeHeigh);
            
            // outPos=cam.getComponent(Camera).screenToWorld(new Vec3(0, safeHeigh, 0));
            // console.log("outPos : ",outPos.y);
            // this.mainPanel.getChildByPath("UiLayer/TopArea").getComponent(Widget).top=outPos.y;

            // let node = this.mainPanel.getChildByPath("UiLayer/TopArea");
            // let topHeight = SdkManager.SDK.getSystemInfo().safeArea.top;
            // outPos = cam.getComponent(Camera).screenToWorld(new Vec3(0, topHeight, 0));
            // console.log("SafeArea Top : ", outPos.y);
            // console.log("node pos : ", node.worldPosition.y);
            // node.setWorldPosition(new Vec3(0, node.worldPosition.y - outPos.y, 0));

        }
        catch(error)
        {
            console.error('MainInterface 下 Adaptation 错误 err: ',error);
        }
        
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
                if (GameManager.Instance.guide)
                {
                    //GameManager.Instance.guide.Checkguide();
                }
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
                //AudioManager.Instance.PlayerOnShot("Sound/sound_base_select_01");
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
                this.cardLibPanel.getComponent(CardLib).OpenCardLib();
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
                this.panelNode.dispatchEvent(new SendMessage('OpenTaskAchieveBoard',true,this.userAccount));
            },this);
            //打开排行榜
            this.rankListBtn.on(Button.EventType.CLICK,()=>
            {
                AudioManager.Instance.PlayerOnShot("Sound/sound_player_homepage_01");
                this.panelNode.dispatchEvent(new SendMessage('OpenRankListBoard',true,this.userData));
            },this);
            //打开卡组编辑界面
            this.cardEditor.on(Button.EventType.CLICK,()=>
            {
                AudioManager.Instance.PlayerOnShot("Sound/sound_click_01");
                this.cardEditorPanel.active=true;
                this.panelNode.active=false;
                this.cardEditorPanel.getComponent(CardEditor).OpenCardEditor();

            },this);
        }
        catch(error)
        {
            console.error('MainInterface 下 Init 错误 err: ',error);
        }
    }
/*
 * 修改RegCallBack
 * author：Hotaru
 * 2024/05/13
 * 格式化、回调排行榜周结算奖励
 */
    private RegCallBack()
    {
        //回调打开弹窗显示获得的卡牌或者碎片
        singleton.netSingleton.player.cb_buy_card_packet=(_cardPacketInfo:CardPacket,_bagInfo:common.Bag)=>
        {
            if(_bagInfo && _cardPacketInfo)
            {
                this.userAccount.playerBag=_bagInfo;
                this.storePanel.getComponent(StorePanel).ShowCardPacketContent(_cardPacketInfo);
            }
        };
        //回调合并碎片后获得卡牌
        singleton.netSingleton.player.cb_buy_card_merge=(_roleId:number,_playerInfo:common.UserData)=>
        {
            
        }
        //回调编辑卡组
        singleton.netSingleton.player.cb_edit_role_group=(_userInfo:common.UserData)=>
        {
            
        }
        //回调返回用户信息
        singleton.netSingleton.player.cb_get_user_data=(_userData:common.UserData , _onLoad:boolean)=>
        {
            this.userData=_userData;
            this.userAccount.money=_userData.gold;
            this.userAccount.playerBag=_userData.bag;
            this.userAccount.diamond=_userData.diamond;
            this.userMoney.getChildByPath("RichText").getComponent(RichText).string=""+_userData.gold;
            this.userDiamonds.getChildByPath("RichText").getComponent(RichText).string=""+_userData.diamond;
            this.userAccount.Achiev=_userData.Achiev;
            this.userAccount.wAchiev=_userData.wAchiev;
            this.userAccount.guideStep=_userData.guideStep;
            if(_onLoad)
            {
                login.panelOnReady=true;
            }
        }
        //回调任务成就完成
        singleton.netSingleton.player.cb_achievement_complete=(achieve:common.UserAchievement , wAchieve:common.UserWeekAchievement)=>
        {
            this.userAccount.money=this.userData.gold;
            this.userAccount.playerBag=this.userData.bag;
            this.userAccount.diamond=this.userData.diamond;
            this.userAccount.Achiev=achieve;
            this.userAccount.wAchiev=wAchieve;

            //不在战斗中,说明在主界面（？
            if(null != singleton.netSingleton.battle){
                //this.userMoney.getChildByPath("RichText").getComponent(RichText).string=""+this.userData.gold;
                //this.userDiamonds.getChildByPath("RichText").getComponent(RichText).string=""+this.userData.diamond;
                this.panelNode.dispatchEvent(new SendMessage('RefreshTaskAchieveBoard',true,this.userAccount));
            }
        }
        //回调领取任务奖励
        singleton.netSingleton.game.cb_check_achievement=(_achievementReward:common.AchievementReward)=>
        {
            this.userAccount.money+=_achievementReward.gold;
        }
        //回调排行榜周结算奖励
        singleton.netSingleton.player.cb_rank_reward=(_reward:common.RankReward , _timeDiff)=>
        {
            if(_timeDiff>7)
            {
                singleton.netSingleton.player.get_user_data();
            }
            else
            {
                let items:Map<string,number>=new Map();
                items.set("Gold",_reward.gold);
                this.panelNode.dispatchEvent(new SendMessage('OpenPopUps',true,
                {
                    type:enums.PopUpsType.Reward , 
                    title:"获得" , 
                    subheading:"周排行榜奖励" , 
                    items:items
                }));
            }
        }
    }

    public async ShowAvatar(_url:string)
    {
        try
        {
            console.log("尝试加载头像：",_url);
            this.avatarUrl=_url;
            let sprite=this.mainPanel.getChildByPath("UiLayer/TopArea/UserAvatar/Mask/Sprite").getComponent(Sprite);
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


