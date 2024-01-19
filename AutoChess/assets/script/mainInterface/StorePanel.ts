import { _decorator, Button, Component, instantiate, Node, Prefab, primitives } from 'cc';
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

    onLoad()
    {
        this.backBtn=this.node.getChildByPath("Back_Btn");
        this.pageViewContent=this.node.getChildByPath("StoreArea/PageView/view/content");
    }

    async start() 
    {
        await this.LoadPre();

        this.backBtn.on(Button.EventType.CLICK,()=>
        {
            this.node.active=false;
            singleton.netSingleton.mainInterface.mainPanel.active=true;
        },this);

        //this.CheckStoreToggle();

    }

    async LoadPre()
    {
        try
        {
            this.storePagePre=await BundleManager.Instance.loadAssetsFromBundle("Panel", "StorePage") as Prefab;
            this.cardEditPre=await BundleManager.Instance.loadAssetsFromBundle("Panel", "CardPage") as Prefab;
            this.rechargePre=await BundleManager.Instance.loadAssetsFromBundle("Panel", "RechargePage") as Prefab;
        }
        catch(error)
        {
            console.error('StorePanel 下 LoadPre 错误 err: ',error);
        }
    }

    CheckStoreToggle()
    {
        try
        {
            if(this.cardEditPage)
            {
                this.cardEditPage.destroy();
            }
            if(this.rechargePage)
            {
                this.rechargePage.destroy();
            }
            this.storePage=instantiate(this.storePagePre);
            this.pageViewContent.addChild(this.storePage);
        }
        catch(error)
        {
            console.error('StorePanel 下 CheckStoreToggle 错误 err: ',error);
        }
        
    }

    CheckCardEditToggle()
    {
        try
        {
            if(this.storePage)
            {
                this.storePage.destroy();
            }
            if(this.rechargePage)
            {
                this.rechargePage.destroy();
            }
            this.cardEditPage=instantiate(this.cardEditPre);
            this.pageViewContent.addChild(this.cardEditPage);
        }
        catch(error)
        {
            console.error('StorePanel 下 CheckCardEditToggle 错误 err: ',error);
        }
    }

    CheckRechargeToggle()
    {
        try
        {
            if(this.storePage)
            {
                this.storePage.destroy();
            }
            if(this.cardEditPage)
            {
                this.cardEditPage.destroy();
            }
            this.rechargePage=instantiate(this.rechargePre);
            this.pageViewContent.addChild(this.rechargePage);
        }
        catch(error)
        {
            console.error('StorePanel 下 CheckRechargeToggle 错误 err: ',error);
        }
        
    }

    update(deltaTime: number) {
        
    }
}


