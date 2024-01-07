import { _decorator, Button, Component, instantiate, Node, Prefab } from 'cc';
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


    async start(father:Node)
    {
        this.father=father;
        let panel=await BundleManager.Instance.loadAssetsFromBundle("Panel", "MainInterface") as Prefab;
        this.mainInterface=instantiate(panel);

        this.mainPanel=this.mainInterface.getChildByPath("MainPanel")
        this.startGamePanel=this.mainInterface.getChildByPath("StartGamePanel");

        this.startBtn=this.mainInterface.getChildByPath("MainPanel/Start_Btn");
        this.startGameBtn=this.mainInterface.getChildByPath("StartGamePanel/StartGame_Btn");

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
    }

}


