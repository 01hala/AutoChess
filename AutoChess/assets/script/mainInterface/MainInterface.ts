import { _decorator, Animation, animation, Button, Component, instantiate, Node, Prefab, RichText, Toggle, tween } from 'cc';
import * as singleton from '../netDriver/netSingleton';
import { BundleManager } from '../bundle/BundleManager';
import { StorePanel } from './StorePanel';
import { Bag, RoleCardInfo, UserData } from '../serverSDK/common';
import { CardPacket } from '../serverSDK/ccallplayer';
import { StorePrompt } from './StorePrompt';
import { StartGamePanel } from './StartGamePanel';
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
    public mainNode:Node;
    //主界面
    public mainPanel:Node
    //开始界面
    public startGamePanel:Node;
    //商店界面
    public storePanel:Node;
    //各区域按钮
    private startBtn:Node;
    private storeBtn:Node;
    private amusementBtn:Node;
    //侧边伸缩按钮区
    private btnList:Node;
    //伸缩按钮区切换开关
    private btnListSwitch:boolean=false;
    //二级界面
    public infoPanel:Node;
    public storePrompt:Node;
    //玩家信息
    public userData:UserAccount;
    private userMoney:Node;
    private userDiamonds:Node;

    constructor()
    {
        this.RegCallBack();
        this.userData=new UserAccount();
    }

    async start(father:Node)
    {
        try
        {
            this.father=father;
            let MainInterfacePromise= BundleManager.Instance.loadAssetsFromBundle("Panel", "MainInterface");
            let InformationPromise= BundleManager.Instance.loadAssetsFromBundle("Panel", "Information");
            let StorePromptPanelPromise= BundleManager.Instance.loadAssetsFromBundle("Panel", "StorePromptPanel");

            let awaitResult = await Promise.all([MainInterfacePromise, InformationPromise, StorePromptPanelPromise]);
            let MainInterfacepanel = awaitResult[0] as Prefab;
            let Informationpanel = awaitResult[1] as Prefab;
            let StorePromptPanelpanel = awaitResult[2] as Prefab;

            this.mainNode=instantiate(MainInterfacepanel);
            this.father.addChild(this.mainNode);
            this.infoPanel=instantiate(Informationpanel);
            this.infoPanel.setParent(this.mainNode);
            this.infoPanel.active=false;
            this.storePrompt=instantiate(StorePromptPanelpanel);
            this.storePrompt.setParent(this.mainNode);
            this.storePrompt.active=false;
    
            this.mainPanel=this.mainNode.getChildByPath("MainPanel")
            this.startGamePanel=this.mainNode.getChildByPath("StartGamePanel");
            this.storePanel=this.mainNode.getChildByPath("StorePanel");
    
            this.startBtn=this.mainNode.getChildByPath("MainPanel/BottomLayer/StartHouse/Start_Btn");
            this.storeBtn=this.mainNode.getChildByPath("MainPanel/BottomLayer/StoreHoues/Store_Btn");
            this.amusementBtn=this.mainNode.getChildByPath("MainPanel/BottomLayer/Amusement/Amusement_Btn");

            this.btnList=this.mainNode.getChildByPath("MainPanel/UiLayer/BtnList");

            this.userMoney=this.mainNode.getChildByPath("MainPanel/UiLayer/UserMoney");
            this.userDiamonds=this.mainNode.getChildByPath("MainPanel/UiLayer/UserDiamonds");
            
            this.Init();
        }
        catch(error)
        {
            console.error('MainInterface 下 Start 错误 err: ',error);
        }
        
    }

    Init() 
    {
        try
        {
            this.startGamePanel.active=false;
            this.storePanel.active=false;
    
            this.startBtn.on(Button.EventType.CLICK,()=>
            {
                console.log("startBtn OpenAthleticsWindow!");
                this.startGamePanel.active=true;
                this.startGamePanel.getComponent(StartGamePanel).OpenAthleticsWindow();
                //this.mainPanel.active=false;
    
            },this);

            this.amusementBtn.on(Button.EventType.CLICK,()=>
            {
                this.startGamePanel.active=true;
                this.startGamePanel.getComponent(StartGamePanel).OpenAmusementWindow();
            },this);
    
            this.storeBtn.on(Button.EventType.CLICK,()=>
            {
                this.storePanel.active=true;
                this.mainPanel.active=false;
                this.storePanel.getComponent(StorePanel).CheckStoreToggle(true);
                this.storePanel.getComponent(StorePanel).toggleGroup.getChildByPath("Store").getComponent(Toggle).isChecked=true;
            },this);

            this.btnList.getChildByPath("Switch_Btn").on(Button.EventType.CLICK,()=>
            {
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
                this.userData.playerBag=_bagInfo;
                this.storePrompt.getComponent(StorePrompt).ShowPacketItem(_cardPacketInfo);
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
        singleton.netSingleton.player.cb_get_user_data=(_userInfo:UserData)=>
        {
            this.userData.money=_userInfo.gold;
            this.userData.playerBag=_userInfo.bag;
            this.userData.diamond=_userInfo.diamond;
            this.userMoney.getChildByPath("RichText").getComponent(RichText).string=""+_userInfo.gold;
            this.userDiamonds.getChildByPath("RichText").getComponent(RichText).string=""+_userInfo.diamond;
        }
    }

}


