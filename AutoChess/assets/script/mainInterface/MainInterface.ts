import { _decorator, Animation, animation, Button, Component, instantiate, Node, Prefab, Toggle, tween } from 'cc';
import * as singleton from '../netDriver/netSingleton';
import { BundleManager } from '../bundle/BundleManager';
import { StorePanel } from './StorePanel';
import { Bag, RoleCardInfo, UserData } from '../serverSDK/common';
import { CardPacket } from '../serverSDK/ccallplayer';
const { ccclass, property } = _decorator;

//玩家账户信息
export class PlyaerAccount
{
    public money:number;//金币
    public diamond:number;//钻石
    public playerBag:Bag;//背包
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

    private startGameBtn:Node;
    private BackMainBtn:Node;
    //侧边伸缩按钮区
    private btnList:Node;
    //伸缩按钮区切换开关
    private btnListSwitch:boolean=false;
    //二级信息界面
    public infoPanel:Node;

    async start(father:Node)
    {
        try
        {
            this.father=father;
            let panel=await BundleManager.Instance.loadAssetsFromBundle("Panel", "MainInterface") as Prefab;
            this.mainNode=instantiate(panel);
            this.father.addChild(this.mainNode);
    
            panel=await BundleManager.Instance.loadAssetsFromBundle("Panel", "Information") as Prefab;
            this.infoPanel=instantiate(panel);
            this.infoPanel.setParent(this.mainNode);
            this.infoPanel.active=false;
    
            this.mainPanel=this.mainNode.getChildByPath("MainPanel")
            this.startGamePanel=this.mainNode.getChildByPath("StartGamePanel");
            this.storePanel=this.mainNode.getChildByPath("StorePanel");
    
            this.startBtn=this.mainNode.getChildByPath("MainPanel/BottomLayer/StartHouse/Start_Btn");
            this.storeBtn=this.mainNode.getChildByPath("MainPanel/BottomLayer/StoreHoues/Store_Btn");
    
            this.startGameBtn=this.mainNode.getChildByPath("StartGamePanel/StartGame_Btn");
            this.BackMainBtn=this.mainNode.getChildByPath("StartGamePanel/Back_Btn");
    
            this.btnList=this.mainNode.getChildByPath("MainPanel/UiLayer/BtnList");
            
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
            this.RegCallBack();

            this.startGamePanel.active=false;
            this.storePanel.active=false;
    
            this.startBtn.on(Button.EventType.CLICK,()=>
            {
                this.startGamePanel.active=true;
                this.mainPanel.active=false;
    
            },this);
    
            this.storeBtn.on(Button.EventType.CLICK,()=>
            {
                this.storePanel.active=true;
                this.mainPanel.active=false;
                this.storePanel.getComponent(StorePanel).CheckStoreToggle(true);
                this.storePanel.getComponent(StorePanel).toggleGroup.getChildByPath("Store").getComponent(Toggle).isChecked=true;
            },this);
    
            this.startGameBtn.on(Button.EventType.CLICK,()=>
            {
                //开始准备阶段
                this.startGamePanel.active=false;
                this.mainPanel.active=false;
                singleton.netSingleton.game.start_battle();
    
            },this);
    
            this.BackMainBtn.on(Button.EventType.CLICK,()=>
            {
                this.startGamePanel.active=false;
                this.mainPanel.active=true;
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
        };
        singleton.netSingleton.player.cb_buy_card_merge=(_roleId:number,_playerInfo:UserData)=>
        {
            //回调合并碎片后获得卡牌
        }
        singleton.netSingleton.player.cb_edit_role_group=(_userInfo:UserData)=>
        {
            //回调编辑卡组
        }
    }

}


