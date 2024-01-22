import { _decorator, Button, Component, instantiate, Node, PageView, Prefab, primitives, Sprite, Toggle } from 'cc';
import * as singleton from '../netDriver/netSingleton';
import { BundleManager } from '../bundle/BundleManager';
import { config } from '../config/config';
import { loadAssets } from '../bundle/LoadAsset';
import { RoleCard } from './RoleCard';
const { ccclass, property } = _decorator;

@ccclass('StorePanel')
export class StorePanel extends Component 
{
    private backBtn:Node;
    private pageViewContent:Node;

    private storePagePre:Prefab;
    private cardListPre:Prefab;
    private rechargePre:Prefab;

    private storePage:Node;
    private cardListPage:Node;
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
            this.ClearPageView();

        },this);

        //this.CheckStoreToggle();

    }


    async CheckStoreToggle(_fromBtn?:boolean)
    {
        try
        {
            if(!this.toggleGroup.getChildByPath("Store").getComponent(Toggle).isChecked || _fromBtn==true?true:false)
            {
                console.log("CheckStoreToggle!!!");
                this.node.getChildByPath("StoreArea/PageView").getComponent(PageView).removeAllPages();
                this.ClearPageView();
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

    async CheckCardListToggle()
    {
        try
        {
            if(!this.toggleGroup.getChildByPath("CardList").getComponent(Toggle).isChecked)
            {
                console.log("CheckCardListToggle!!!");
                this.node.getChildByPath("StoreArea/PageView").getComponent(PageView).removeAllPages();
                this.ClearPageView();
                if (!this.cardListPre) {
                    this.cardListPre = await BundleManager.Instance.loadAssetsFromBundle("Panel", "CardPage") as Prefab;
                }
                this.cardListPage = instantiate(this.cardListPre);
                this.node.getChildByPath("StoreArea/PageView").getComponent(PageView).addPage(this.cardListPage);
                //this.pageViewContent.addChild(this.cardListPage);
                this.LoadCard();
            }
           
        }
        catch(error)
        {
            console.error('StorePanel 下 CheckCardListToggle 错误 err: ',error);
        }
    }

    async CheckRechargeToggle()
    {
        try
        {
            if(!this.toggleGroup.getChildByPath("Recharge").getComponent(Toggle).isChecked)
            {
                console.log("CheckRechargeToggle!!!");
                this.node.getChildByPath("StoreArea/PageView").getComponent(PageView).removeAllPages();
                this.ClearPageView();
                if (!this.rechargePre) {
                    this.rechargePre = await BundleManager.Instance.loadAssetsFromBundle("Panel", "RechargePage") as Prefab;
                }
                this.rechargePage = instantiate(this.rechargePre);
                this.pageViewContent.addChild(this.rechargePage);
                //this.node.getChildByPath("StoreArea/PageView").getComponent(PageView).addPage(this.cardListPage);
            }
            
        }
        catch(error)
        {
            console.error('StorePanel 下 CheckRechargeToggle 错误 err: ',error);
        }
        
    }

    private ClearPageView()
    {
        for (let node of this.pageViewContent.children) {
            node.destroy();
        }
    }

    private async LoadCard()
    {
        try
        {
            console.log("LoadCard!!!");
            let cardPre=await BundleManager.Instance.loadAssetsFromBundle("Roles", "RoleCard") as Prefab;
            let jconfig=null;
            let i=100001;
            do
            {
                //console.log("id: "+i);
                jconfig=config.RoleConfig.get(i);
                if(jconfig!=null)
                {
                    // let path="Avatar/Role_"+i;
                    // let img=await loadAssets.LoadImg(path);
                    let card=instantiate(cardPre);
                    card.getComponent(RoleCard).storePanel=this.node;
                    card.getComponent(RoleCard).roleId=i;
                    // if(img)
                    // {
                    //     card.getChildByPath("RoleAvatar/Sprite").getComponent(Sprite).spriteFrame=img;
                    // }
                    this.cardListPage.addChild(card);
                    if(i%8==0)
                    {
                        this.cardListPage=instantiate(this.cardListPre);
                        //this.pageViewContent.addChild(this.cardListPage);
                        this.node.getChildByPath("StoreArea/PageView").getComponent(PageView).addPage(this.cardListPage);
                        console.log(this.node.getChildByPath("StoreArea/PageView").getComponent(PageView).getPages().length);
                    }
                    i++;
                }
            }
            while(jconfig!=null)
            console.log("LoadCard done!!!");
        }
        catch(error)
        {
            console.error('StorePanel 下 LoadCard 错误 err: ',error);
        }
    }

    update(deltaTime: number) 
    {
        
    }
}


