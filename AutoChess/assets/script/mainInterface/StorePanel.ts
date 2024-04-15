/*
 * 修改 StorePanel
 * author：Hotaru
 * 2024/03/18
 * 商店界面
 */
import { _decorator, Button, Component, instantiate, Node, PageView, Prefab, primitives, RichText, Sprite, Toggle } from 'cc';
import * as singleton from '../netDriver/netSingleton';
import { BundleManager } from '../bundle/BundleManager';
import { config } from '../config/config';
import { loadAssets } from '../bundle/LoadAsset';
import { RoleCard } from './RoleCard';
import { CardPacket } from '../serverSDK/ccallplayer';
import { StorePrompt } from '../secondaryPanel/StorePrompt';
import { InfoPanel } from '../secondaryPanel/InfoPanel';
import { SendMessage } from '../other/MessageEvent';
import { AudioManager } from '../other/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('StorePanel')
export class StorePanel extends Component 
{
    private backBtn:Node;
    private pageView:PageView;
    //界面组件预制体
    private storePagePre:Prefab;
    private cardListPre:Prefab;
    private rechargePre:Prefab;
    private roleCardPre:Prefab;
    //分页组件
    private storePage:Node;
    private cardListPage:Node;
    private rechargePage:Node;
    //页签组
    public toggleGroup:Node;
    //二级界面
    //public storePrompt:Node;
    //卡牌列表
    private cards:Node[]=[];

    private Init()
    {
        this.backBtn=this.node.getChildByPath("Back_Btn");
        this.pageView=this.node.getChildByPath("StoreArea/PageView").getComponent(PageView);
        this.toggleGroup=this.node.getChildByPath("ToggleGroup");
    }

    async onLoad()
    {
        this.Init();

        let storePagePrePromise=BundleManager.Instance.loadAssetsFromBundle("Parts", "StorePage");
        let cardListPrePromise=BundleManager.Instance.loadAssetsFromBundle("Parts", "CardPage");
        let rechargePrePromise=BundleManager.Instance.loadAssetsFromBundle("Parts", "RechargePage");
        let roleCardPrePromise=BundleManager.Instance.loadAssetsFromBundle("Roles", "RoleCard");
        //let StorePromptPanelPromise= BundleManager.Instance.loadAssetsFromBundle("Board", "StorePromptPanel");
        
        let awaitResult=await Promise.all(
            [
                storePagePrePromise,
                cardListPrePromise,
                rechargePrePromise,
                roleCardPrePromise, 
                //StorePromptPanelPromise
        ]);

        this.storePagePre=awaitResult[0] as Prefab;
        this.cardListPre=awaitResult[1] as Prefab;
        this.rechargePre=awaitResult[2] as Prefab;
        this.roleCardPre=awaitResult[3] as Prefab;
        //let StorePromptPanelpanel = awaitResult[4] as Prefab;

        //二级信息界面
        // this.infoPanel=instantiate(Informationpanel);
        // this.infoPanel.setParent(this.node);
        // this.infoPanel.active=false;
        //商店购买提示框
        // this.storePrompt=instantiate(StorePromptPanelpanel);
        // this.storePrompt.setParent(this.node);
        // this.storePrompt.active=false;

    }

    start() 
    {
        this.backBtn.on(Button.EventType.CLICK,()=>
        {
            AudioManager.Instance.PlayerOnShot("Sound/sound_click_close_01");
            this.node.active=false;
            singleton.netSingleton.mainInterface.panelNode.active=true;
            this.ClearPageView();

        },this);     
    }

    async CheckStoreToggle(_fromBtn?:boolean)
    {
        try
        {
            AudioManager.Instance.PlayerOnShot("Sound/sound_bookmark_select_01");
            console.log(this.toggleGroup);
            if(!this.toggleGroup.getChildByPath("Store").getComponent(Toggle).isChecked || _fromBtn==true?true:false)
            {
                console.log("CheckStoreToggle!!!");
                this.node.getChildByPath("StoreArea/PageView").getComponent(PageView).removeAllPages();
                this.ClearPageView();
                if (!this.storePagePre) 
                {
                    this.storePagePre = await BundleManager.Instance.loadAssetsFromBundle("Page", "StorePage") as Prefab;
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
            AudioManager.Instance.PlayerOnShot("Sound/sound_bookmark_select_01");
            if(!this.toggleGroup.getChildByPath("CardList").getComponent(Toggle).isChecked)
            {
                console.log("CheckCardListToggle!!!");
                this.node.getChildByPath("StoreArea/PageView").getComponent(PageView).removeAllPages();
                this.ClearPageView();
                if (!this.cardListPre) {
                    this.cardListPre = await BundleManager.Instance.loadAssetsFromBundle("Page", "CardPage") as Prefab;
                }
                this.cardListPage = instantiate(this.cardListPre);
                this.pageView.addPage(this.cardListPage);
                //this.LoadCard();
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
            AudioManager.Instance.PlayerOnShot("Sound/sound_bookmark_select_01");
            if(!this.toggleGroup.getChildByPath("Recharge").getComponent(Toggle).isChecked)
            {
                console.log("CheckRechargeToggle!!!");
                this.node.getChildByPath("StoreArea/PageView").getComponent(PageView).removeAllPages();
                this.ClearPageView();
                if (!this.rechargePre) {
                    this.rechargePre = await BundleManager.Instance.loadAssetsFromBundle("Page", "RechargePage") as Prefab;
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

    private InitStore()
    {
        //购买卡包
        this.storePage.getChildByPath("Commodity").on(Button.EventType.CLICK,()=>
        {
            singleton.netSingleton.player.buy_card_packet();
        },this);
    }

    public ShowCardPacketContent(_cardPacketInfo:CardPacket)
    {
        //this.storePrompt.getComponent(StorePrompt).ShowPacketItem(_cardPacketInfo);
    }
}


