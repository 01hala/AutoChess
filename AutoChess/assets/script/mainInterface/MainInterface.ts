import { _decorator, Animation, animation, Button, Component, instantiate, Node, Prefab, tween } from 'cc';
import * as singleton from '../netDriver/netSingleton';
import { BundleManager } from '../bundle/BundleManager';
const { ccclass, property } = _decorator;

export class MainInterface 
{
    public father:Node;

    private mainInterface:Node;

    private mainPanel:Node
    private startGamePanel:Node;

    private startBtn:Node;
    private startGameBtn:Node;

    private btnList:Node;


    private btnListSwitch:boolean=false;

    async start(father:Node)
    {
        this.father=father;
        let panel=await BundleManager.Instance.loadAssetsFromBundle("Panel", "MainInterface") as Prefab;
        this.mainInterface=instantiate(panel);
        this.father.addChild(this.mainInterface);

        this.mainPanel=this.mainInterface.getChildByPath("MainPanel")
        this.startGamePanel=this.mainInterface.getChildByPath("StartGamePanel");

        this.startBtn=this.mainInterface.getChildByPath("MainPanel/ButtonMask/StartHouse/Start_Btn");
        this.startGameBtn=this.mainInterface.getChildByPath("StartGamePanel/StartGame_Btn");

        this.btnList=this.mainInterface.getChildByPath("MainPanel/UiMask/BtnList");

        this.Init();
    }

    Init() 
    {
        this.startGamePanel.active=false;

        this.startBtn.on(Button.EventType.CLICK,()=>
        {
            this.startGamePanel.active=true;
            this.mainPanel.active=false;

        },this);

        this.startGameBtn.on(Button.EventType.CLICK,()=>
        {
            //开始准备阶段
            this.startGamePanel.active=false;
            this.mainPanel.active=false;
            singleton.netSingleton.game.start_battle();

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


