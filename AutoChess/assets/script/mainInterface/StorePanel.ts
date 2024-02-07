import { _decorator, Button, Component, instantiate, Node, PageView, Prefab, primitives, RichText, Sprite, Toggle } from 'cc';
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
    private pageView:PageView;

    private storePagePre:Prefab;
    private cardListPre:Prefab;
    private rechargePre:Prefab;
    private roleCardPre:Prefab;

    private storePage:Node;
    private cardListPage:Node;
    private rechargePage:Node;

    public toggleGroup:Node;

    private cards:Node[]=[];

    onLoad()
    {
        this.backBtn=this.node.getChildByPath("Back_Btn");
        this.pageView=this.node.getChildByPath("StoreArea/PageView").getComponent(PageView);
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

        let storePagePrePromise=BundleManager.Instance.loadAssetsFromBundle("Panel", "StorePage");
        let cardListPrePromise=BundleManager.Instance.loadAssetsFromBundle("Panel", "CardPage");
        let rechargePrePromise=BundleManager.Instance.loadAssetsFromBundle("Panel", "RechargePage");
        let roleCardPrePromise=BundleManager.Instance.loadAssetsFromBundle("Roles", "RoleCard")
        
        let awaitResult=await Promise.all(
            [
                storePagePrePromise,
                cardListPrePromise,
                rechargePrePromise,
                roleCardPrePromise
        ]);
        this.storePagePre=awaitResult[0] as Prefab;
        this.cardListPre=awaitResult[1] as Prefab;
        this.rechargePre=awaitResult[2] as Prefab;
        this.roleCardPre=awaitResult[3] as Prefab;

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
                this.pageView.addPage(this.storePage);

                this.InitStore();
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
                this.pageView.addPage(this.cardListPage);
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
                this.pageView.addPage(this.rechargePage);
            }
            
        }
        catch(error)
        {
            console.error('StorePanel 下 CheckRechargeToggle 错误 err: ',error);
        }
        
    }

    private ClearPageView()
    {
        for (let node of this.pageView.node.getChildByPath("view/content").children) {
            node.destroy();
        }
    }

    private async LoadCard()
    {
        try
        {
            console.log("LoadCard!!!");
            let jconfig=null;
            let i=100001;
            let j=0;
            do
            {
                //console.log("id: "+i);
                jconfig=config.RoleConfig.get(i);
                if(jconfig!=null)
                {
                    let card=instantiate(this.roleCardPre);
                    card.getComponent(RoleCard).Init(i);
                    try
                    {
                        if(singleton.netSingleton.mainInterface.userData.playerBag.ItemList[j].isTatter)
                        {
                            card.getComponent(RoleCard).Lock=true;
                            card.getComponent(RoleCard).SetNumberText
                            (
                                singleton.netSingleton.mainInterface.userData.playerBag.ItemList[j].Number,8
                            );
                        }
                        else
                        {
                            card.getComponent(RoleCard).Lock=false;
                            card.getChildByPath("NumberText").active=false;
                        }
                    }
                    catch(error)
                    {
                        console.error('StorePanel 下 LoadCard 无法读取到玩家数据 err: ',error);
                    }
                    //this.cards.push(card);
                    this.cardListPage.addChild(card);
                    //card.getComponent(RoleCard).storePanel=this.node;
                    if(i%8==0)
                    {
                        this.cardListPage=instantiate(this.cardListPre);
                        this.pageView.addPage(this.cardListPage);
                    }
                    i++;j++;
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

    InitStore()
    {
        //购买卡包
        this.storePage.getChildByPath("Commodity").on(Button.EventType.CLICK,()=>
        {
            singleton.netSingleton.player.buy_card_packet();
        },this);
    }

    update(deltaTime: number) 
    {
        
    }
}


