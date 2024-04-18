/*
 * CardLibPanel.ts
 * author: Hotaru
 * 2024/03/14
 * 牌库
 */
import { _decorator, Button, Component, EventHandler, instantiate, Node, PageView, Prefab, Toggle, ToggleContainer } from 'cc';
import { BundleManager } from '../bundle/BundleManager';
import { Biomes } from '../other/enums';
import { config } from '../config/config';
import { RoleCard } from './RoleCard';
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

    private cardListPage:Node;

    public toggleGroup:Node;

    protected async onLoad(): Promise<void> 
    {
        try
        {
            let cardListPrePromise=BundleManager.Instance.loadAssetsFromBundle("Parts", "CardPage");
            let roleCardPrePromise=BundleManager.Instance.loadAssetsFromBundle("Roles", "RoleCard");

            let awaitResult=await Promise.all(
                [
                    cardListPrePromise,
                    roleCardPrePromise
            ]);

            this.cardListPre=awaitResult[0] as Prefab;
            this.roleCardPre=awaitResult[1] as Prefab;

            this.backBtn=this.node.getChildByPath("Back_Btn");
            this.pageView=this.node.getChildByPath("CardArea/PageView").getComponent(PageView);
            this.toggleGroup=this.node.getChildByPath("ToggleGroup");
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
                this.pageView.removeAllPages();
    
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
            const containerEventHandler = new EventHandler();
            containerEventHandler.target = this.node; // 这个 node 节点是你的事件处理代码组件所属的节点
            containerEventHandler.component = 'CardLib';// 这个是脚本类名
            containerEventHandler.handler = 'OnCheckToggleEvent';

            this.toggleGroup.getComponent(ToggleContainer).checkEvents.push(containerEventHandler);
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
            this.LoadCard(Biomes.Mountain);
            this.toggleGroup.getChildByPath("Mountain").getComponent(Toggle).isChecked=true;
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
            this.pageView.removeAllPages();
            if(this.toggleGroup.getChildByPath("Sea").getComponent(Toggle).isChecked)
            {
                this.LoadCard(Biomes.Sea);
            }
            if(this.toggleGroup.getChildByPath("Mountain").getComponent(Toggle).isChecked)
            {
                this.LoadCard(Biomes.Mountain);
            }
            if(this.toggleGroup.getChildByPath("Grassland").getComponent(Toggle).isChecked)
            {
                this.LoadCard(Biomes.Grassland);
            }
            if(this.toggleGroup.getChildByPath("Wind").getComponent(Toggle).isChecked)
            {
                this.LoadCard(Biomes.Wind);
            }
            if(this.toggleGroup.getChildByPath("Jungle").getComponent(Toggle).isChecked)
            {
                this.LoadCard(Biomes.Jungle);
            }
            if(this.toggleGroup.getChildByPath("Cave").getComponent(Toggle).isChecked)
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
            this.cardListPage=instantiate(this.cardListPre);
            this.pageView.addPage(this.cardListPage);
            console.log("LoadCard!!!");
            let jconfig=null;
            let i=100001;   //角色id
            let j=0;        //背包里物品下标

            let num=0;      //页面里的card数量
            do
            {
                //console.log("id: "+i);
                jconfig=config.RoleConfig.get(i);
                if(jconfig!=null)
                {
                    if(_biomes == jconfig.Biomes)
                    {
                        let card=instantiate(this.roleCardPre);
                        card.getComponent(RoleCard).Init(i);
                        try
                        {
                            if(singleton.netSingleton.mainInterface.userAccount.playerBag.ItemList[j].isTatter)
                            {
                                card.getComponent(RoleCard).Lock=true;
                                card.getComponent(RoleCard).SetNumberText
                                (
                                    singleton.netSingleton.mainInterface.userAccount.playerBag.ItemList[j].Number,8
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
                        this.cardListPage.addChild(card);
                        num++;
                        if(num%8 == 0)
                        {
                            this.cardListPage=instantiate(this.cardListPre);
                            this.pageView.addPage(this.cardListPage);
                        }
                    }
                    
                    //card.getComponent(RoleCard).storePanel=this.node;
                    
                    i++;j++;
                }
            }
            while(jconfig!=null)
            console.log("LoadCard done!!!");
        }
        catch(error)
        {
            console.error("CardLibPanel 下的 LoadCard 错误：",error);
        }
    }
}


