import { _decorator, Animation, animation, Button, Component, instantiate, Node, Prefab, Toggle, tween } from 'cc';
import * as singleton from '../netDriver/netSingleton';
import { BundleManager } from '../bundle/BundleManager';
import { StorePanel } from './StorePanel';
const { ccclass, property } = _decorator;

export class MainInterface 
{
    public father:Node;

    public mainNode:Node;

    public mainPanel:Node
    public startGamePanel:Node;
    public storePanel:Node;

    private startBtn:Node;
    private storeBtn:Node;

    private startGameBtn:Node;
    private BackMainBtn:Node;

    private btnList:Node;


    private btnListSwitch:boolean=false;

    public infoPanel:Node;

    async start(father:Node)
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

    Init() 
    {
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

}


