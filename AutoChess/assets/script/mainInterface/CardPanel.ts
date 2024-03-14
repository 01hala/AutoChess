/*
 * CardPanel.ts
 * author: Hotaru
 * 2024/03/14
 * 牌库
 */
import { _decorator, Button, Component, EventHandler, instantiate, Node, PageView, Prefab, Toggle, ToggleContainer } from 'cc';
import { BundleManager } from '../bundle/BundleManager';
import { Fetters } from '../other/enums';
import { config } from '../config/config';
import { RoleCard } from './RoleCard';
import * as singleton from '../netDriver/netSingleton';
const { ccclass, property } = _decorator;

@ccclass('CardPanel')
export class CardPanel extends Component 
{
    private backBtn:Node;

    private pageView:PageView;
    private cardListPre:Prefab;
    private roleCardPre:Prefab;

    private cardListPage:Node;

    public toggleGroup:Node;

    protected onLoad(): void 
    {
        try
        {
            this.backBtn=this.node.getChildByPath("Back_Btn");
            this.pageView=this.node.getChildByPath("PageView").getComponent(PageView);
            this.toggleGroup=this.node.getChildByPath("ToggleGroup");
        }
        catch(error)
        {
            console.error("CardPanel 下的 onLoad 错误：",error);
        }
    }

    async start() 
    {
        try
        {
            this.backBtn.on(Button.EventType.CLICK,()=>
            {
                this.node.active=false;
                singleton.netSingleton.mainInterface.mainPanel.active=true;
                this.ClearPageView();

            },this);

            let cardListPrePromise=BundleManager.Instance.loadAssetsFromBundle("Panel", "CardPage");
            let roleCardPrePromise=BundleManager.Instance.loadAssetsFromBundle("Roles", "RoleCard");

            let awaitResult=await Promise.all(
                [
                    cardListPrePromise,
                    roleCardPrePromise
            ]);

            this.cardListPre=awaitResult[0] as Prefab;
            this.roleCardPre=awaitResult[1] as Prefab;

            const containerEventHandler = new EventHandler();
            containerEventHandler.target = this.node; // 这个 node 节点是你的事件处理代码组件所属的节点
            containerEventHandler.component = 'CardPanel';// 这个是脚本类名
            containerEventHandler.handler = 'OnCheckToggleEvent';

            this.toggleGroup.getComponent(ToggleContainer).checkEvents.push(containerEventHandler);
        }
        catch(error)
        {
            console.error("CardPanel 下的 start 错误：",error);
        }
    }

    update(deltaTime: number) 
    {

    }

    private ClearPageView()
    {
        for (let node of this.pageView.node.getChildByPath("view/content").children) {
            node.destroy();
        }
    }

    private OnCheckToggleEvent(event: Event, customEventData: string)
    {
        try
        {
            console.log("check");
            this.ClearPageView();
            if(this.toggleGroup.getChildByPath("Sea").getComponent(Toggle).isChecked)
            {
                this.LoadCard(Fetters.Sea);
            }
            if(this.toggleGroup.getChildByPath("Mountain").getComponent(Toggle).isChecked)
            {
                this.LoadCard(Fetters.Mountain);
            }
            if(this.toggleGroup.getChildByPath("Grassland").getComponent(Toggle).isChecked)
            {
                this.LoadCard(Fetters.Grassland);
            }
            if(this.toggleGroup.getChildByPath("Wind").getComponent(Toggle).isChecked)
            {
                this.LoadCard(Fetters.Wind);
            }
            if(this.toggleGroup.getChildByPath("Jungle").getComponent(Toggle).isChecked)
            {
                this.LoadCard(Fetters.Jungle);
            }
            if(this.toggleGroup.getChildByPath("Cave").getComponent(Toggle).isChecked)
            {
                this.LoadCard(Fetters.Cave);
            }
        }
        catch(error)
        {
            console.error("CardPanel 下的 OnCheckToggleEvent 错误：",error);
        }
    }

    private LoadCard(_fetters:Fetters)
    {
        try
        {
            console.log("LoadCard!!!");
            let jconfig=null;
            let i=100001;   //角色id
            let j=0;        //背包里物品下标

            let num=1;      //页面里的card数量
            do
            {
                //console.log("id: "+i);
                jconfig=config.RoleConfig.get(i);
                if(jconfig!=null)
                {
                    if(_fetters == jconfig.Fetters)
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
                        num++;
                    }
                    
                    //card.getComponent(RoleCard).storePanel=this.node;
                    if(num%8==0)
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
            console.error("CardPanel 下的 CheckFetters 错误：",error);
        }
    }
}


