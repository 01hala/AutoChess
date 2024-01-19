import { _decorator, Button, Component, instantiate, Node, Prefab, primitives, Toggle } from 'cc';
import * as singleton from '../netDriver/netSingleton';
import { BundleManager } from '../bundle/BundleManager';
const { ccclass, property } = _decorator;

@ccclass('StorePanel')
export class StorePanel extends Component 
{
    private backBtn:Node;
    private pageViewContent:Node;

    private storePagePre:Prefab;
    private cardEditPre:Prefab;
    private rechargePre:Prefab;

    private storePage:Node;
    private cardEditPage:Node;
    private rechargePage:Node;

    public toggleGroup:Node;

    onLoad()
    {
        this.backBtn=this.node.getChildByPath("Back_Btn");
        this.pageViewContent=this.node.getChildByPath("StoreArea/PageView/view/content");
        this.toggleGroup=this.node.getChildByPath("ToggleGroup");
    }

    async start() 
    {
        this.backBtn.on(Button.EventType.CLICK,()=>
        {
            this.node.active=false;
            singleton.netSingleton.mainInterface.mainPanel.active=true;
        },this);

        //this.CheckStoreToggle();

    }


    async CheckStoreToggle()
    {
        try
        {
            if(!this.toggleGroup.getChildByPath("Store").getComponent(Toggle).isChecked)
            {
                console.log("CheckStoreToggle!!!");
                for (let node of this.pageViewContent.children) 
                {
                    node.destroy();
                }
                if (!this.storePagePre) 
                {
                    this.storePagePre = await BundleManager.Instance.loadAssetsFromBundle("Panel", "StorePage") as Prefab;
                }
                this.storePage = instantiate(this.storePagePre);
                this.pageViewContent.addChild(this.storePage);
            }
            
        }
        catch(error)
        {
            console.error('StorePanel 下 CheckStoreToggle 错误 err: ',error);
        }
        
    }

    async CheckCardEditToggle()
    {
        try
        {
            if(!this.toggleGroup.getChildByPath("CardEdit").getComponent(Toggle).isChecked)
            {
                console.log("CheckCardEditToggle!!!");
                for (let node of this.pageViewContent.children) {
                    node.destroy();
                }
                if (!this.cardEditPre) {
                    this.cardEditPre = await BundleManager.Instance.loadAssetsFromBundle("Panel", "CardPage") as Prefab;
                }
                this.cardEditPage = instantiate(this.cardEditPre);
                this.pageViewContent.addChild(this.cardEditPage);
            }
           
        }
        catch(error)
        {
            console.error('StorePanel 下 CheckCardEditToggle 错误 err: ',error);
        }
    }

    async CheckRechargeToggle()
    {
        try
        {
            if(!this.toggleGroup.getChildByPath("Recharge").getComponent(Toggle).isChecked)
            {
                console.log("CheckRechargeToggle!!!");
                for (let node of this.pageViewContent.children) {
                    node.destroy();
                }
                if (!this.rechargePre) {
                    this.rechargePre = await BundleManager.Instance.loadAssetsFromBundle("Panel", "RechargePage") as Prefab;
                }
                this.rechargePage = instantiate(this.rechargePre);
                this.pageViewContent.addChild(this.rechargePage);
            }
            
        }
        catch(error)
        {
            console.error('StorePanel 下 CheckRechargeToggle 错误 err: ',error);
        }
        
    }

    update(deltaTime: number) 
    {
        
    }
}


