/*
 * CardLibPanel.ts
 * author: Hotaru
 * 2024/03/14
 * 牌库
 */
import { _decorator, Button, Component, EventHandler, instantiate, Node, PageView, Prefab, ScrollView, Toggle, ToggleContainer, UITransform } from 'cc';
import { BundleManager } from '../bundle/BundleManager';
import { Biomes } from '../other/enums';
import { config } from '../config/config';
import { RoleCard } from '../part/RoleCard';
import * as singleton from '../netDriver/netSingleton';
import { AudioManager } from '../other/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('CardLib')
export class CardLib extends Component 
{
    private backBtn:Node;

    private pageView:PageView;
    private cardListPre:Prefab;
    private roleCardPre:Prefab;

    private cardBoothPre:Prefab;
    private rolePaintingPre:Prefab;

    private cardListPage:Node;

    public toggleBar:Node;
    //角色立绘展示区域
    private cardContent:Node;
    //滑动组件
    private scroll:ScrollView;

    private containerEventHandler:EventHandler;

    protected async onLoad(): Promise<void> 
    {
        try
        {
            //let cardListPrePromise=BundleManager.Instance.loadAssetsFromBundle("Parts", "CardPage");
            //let roleCardPrePromise=BundleManager.Instance.loadAssetsFromBundle("Roles", "RoleCard");

            let rp = BundleManager.Instance.loadAssetsFromBundle("Roles", "RolePainting");
            let cb = BundleManager.Instance.loadAssetsFromBundle("Parts", "CardBooth");

            let awaitResult=await Promise.all(
            [
                rp,
                cb
            ]);

            this.rolePaintingPre=awaitResult[0] as Prefab;
            this.cardBoothPre=awaitResult[1] as Prefab;

            this.backBtn=this.node.getChildByPath("Back_Btn");
            //this.pageView=this.node.getChildByPath("CardArea/PageView").getComponent(PageView);
            this.toggleBar=this.node.getChildByPath("ToggleBar");

            this.cardContent=this.node.getChildByPath("CardView/view/content");
            this.scroll=this.node.getChildByPath("CardView").getComponent(ScrollView);
        }
        catch(error)
        {
            console.error("CardPanel 下的 onLoad 错误：",error);
        }
    }

    start() 
    {
        try
        {
            this.backBtn.on(Button.EventType.CLICK,()=>
            {
                AudioManager.Instance.PlayerOnShot("Sound/sound_click_close_01");
                this.node.active=false;
                singleton.netSingleton.mainInterface.panelNode.active=true;
                //this.pageView.removeAllPages();
                this.RemoveAllBooth();
                this.toggleBar.getComponent(ToggleContainer).checkEvents.splice(0,this.toggleBar.getComponent(ToggleContainer).checkEvents.length);
    
            },this);

            this.Init();
        }
        catch(error)
        {
            console.error("CardLibPanel 下的 start 错误：",error);
        }
    }

    private Init()
    {
        try
        {
            this.containerEventHandler = new EventHandler();
            this.containerEventHandler.target = this.node; // 这个 node 节点是你的事件处理代码组件所属的节点
            this.containerEventHandler.component = 'CardLib';// 这个是脚本类名
            this.containerEventHandler.handler = 'OnCheckToggleEvent';

            this.toggleBar.getComponent(ToggleContainer).checkEvents.push(this.containerEventHandler);
        }
        catch(error)
        {
            console.error("CardLibPanel 下的 Init 错误：",error);
        }
    }

    public OpenCardLib()
    {
        try
        {
            this.toggleBar.getChildByPath("Mountain").getComponent(Toggle).isChecked=true;
            this.toggleBar.getComponent(ToggleContainer).checkEvents.push(this.containerEventHandler);
            this.LoadCard(Biomes.Mountain);
        }
        catch(error)
        {
            console.error("CardLibPanel 下的 Open 错误：",error);
        }
    }

    private OnCheckToggleEvent(event: Event, customEventData: string)
    {
        try
        {
            AudioManager.Instance.PlayerOnShot("Sound/sound_bookmark_select_01");
            console.log("check");
            //this.pageView.removeAllPages();
            this.RemoveAllBooth();
            if(this.toggleBar.getChildByPath("Sea").getComponent(Toggle).isChecked)
            {
                this.LoadCard(Biomes.Sea);
            }
            if(this.toggleBar.getChildByPath("Mountain").getComponent(Toggle).isChecked)
            {
                this.LoadCard(Biomes.Mountain);
            }
            if(this.toggleBar.getChildByPath("Grassland").getComponent(Toggle).isChecked)
            {
                this.LoadCard(Biomes.Grassland);
            }
            if(this.toggleBar.getChildByPath("Wind").getComponent(Toggle).isChecked)
            {
                this.LoadCard(Biomes.Wind);
            }
            if(this.toggleBar.getChildByPath("Jungle").getComponent(Toggle).isChecked)
            {
                this.LoadCard(Biomes.Jungle);
            }
            if(this.toggleBar.getChildByPath("Cave").getComponent(Toggle).isChecked)
            {
                this.LoadCard(Biomes.Cave);
            }
        }
        catch(error)
        {
            console.error("CardLibPanel 下的 OnCheckToggleEvent 错误：",error);
        }
    }

    private LoadCard(_biomes:Biomes)
    {
        try
        {
            //this.cardListPage=instantiate(this.cardListPre);
            //this.pageView.addPage(this.cardListPage);

            let tnode=instantiate(this.cardBoothPre);
            tnode.setParent(this.cardContent);
            console.log("LoadCard!!!");
            let jconfig=null;
            let i=100001;   //角色id
            let j=0;        //背包里物品下标

            let num=0;      //页面里的card数量
            let promise=[];
            do
            {
                //console.log("id: "+i);
                jconfig=config.RoleConfig.get(i);
                if(jconfig!=null)
                {
                    if(_biomes == jconfig.Biomes)
                    {
                        let card=instantiate(this.rolePaintingPre);
                        tnode.getChildByPath("Layout").addChild(card);
                        card.getComponent(RoleCard).Init(i,jconfig.Skel);
                        card.getComponent(RoleCard).Stage=jconfig.Stage;
                        card.getComponent(RoleCard).Name=jconfig.Name;
                        try
                        {
                            if(singleton.netSingleton.mainInterface.userAccount.playerBag.ItemList[j].isTatter)
                            {
                                card.getComponent(RoleCard).Lock=true;
                                card.getComponent(RoleCard).SetNumberText
                                    (
                                        singleton.netSingleton.mainInterface.userAccount.playerBag.ItemList[j].Number, 8
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
                            console.warn('StorePanel 下 LoadCard 无法读取到玩家数据 err: ',error);
                        }
                        //this.cards.push(card);
                        num++;
                        if(num%3 == 0)
                        {
                            //this.cardListPage=instantiate(this.cardListPre);
                            //this.pageView.addPage(this.cardListPage);
                            tnode=instantiate(this.cardBoothPre);
                            tnode.setParent(this.cardContent);
                        }
                    }
                    
                    //card.getComponent(RoleCard).storePanel=this.node;
                    
                    i++;j++;
                }
            }
            while(jconfig!=null);
            if((this.cardContent.getComponent(UITransform).contentSize.y-400) < this.cardContent.parent.getComponent(UITransform).contentSize.y)
            {
                this.scroll.enabled=false;
            }
            console.log("LoadCard done!!!");
        }
        catch(error)
        {
            console.error("CardLibPanel 下的 LoadCard 错误：",error);
        }
    }

    private RemoveAllBooth()
    {
        for(let t of this.cardContent.children)
        {
            for(let tt of t.children)
            {
                tt.destroy();
            }
            t.destroy();
        }
    }
}


