/*
 * CardLibPanel.ts
 * author: Hotaru
 * 2024/03/14
 * 牌库
 */
import { _decorator, Button, Component, EventHandler, instantiate, Node, PageView, Prefab, ScrollView, Toggle, ToggleContainer, UITransform } from 'cc';
import { BundleManager } from '../bundle/BundleManager';
import { Biomes } from '../other/enums';
import { config } from '../battle/AutoChessBattle/config/config';
import { RoleCard } from '../part/RoleCard';
import * as singleton from '../netDriver/netSingleton';
import { AudioManager } from '../other/AudioManager';
import { RoleConfig } from '../battle/AutoChessBattle/config/role_config';
import { sleep } from '../other/sleep';
import { User } from '../login/User';
import { GameManager } from '../other/GameManager';
const { ccclass, property } = _decorator;

@ccclass('CardLibrary')
export class CardLibrary extends Component 
{
    private backBtn:Node;
    //预制体
    private cardBoothPre:Prefab;
    private rolePaintingPre:Prefab;
    //标签栏
    public toggleBar:Node;
    //角色立绘展示区域
    private cardContent:Node;
    //滑动组件
    private scroll:ScrollView;
    //临时数组
    private cardCfgs:RoleConfig[] = [];

    private containerEventHandler:EventHandler;

    protected async onLoad(): Promise<void> 
    {
        try
        {
            this.backBtn=this.node.getChildByPath("UI/Back_Btn");
            //this.pageView=this.node.getChildByPath("CardArea/PageView").getComponent(PageView);
            this.toggleBar=this.node.getChildByPath("UI/ToggleBar");

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
                singleton.netSingleton.mainInterface.panelNode.active=true;
                this.Exit();
            },this);

            this.containerEventHandler = new EventHandler();
            this.containerEventHandler.target = this.node; // 这个 node 节点是你的事件处理代码组件所属的节点
            this.containerEventHandler.component = 'CardLibrary';// 这个是脚本类名
            this.containerEventHandler.handler = 'OnCheckToggleEvent';

            this.toggleBar.getComponent(ToggleContainer).checkEvents.push(this.containerEventHandler);
        }
        catch(error)
        {
            console.error("CardLibPanel 下的 start 错误：",error);
        }
    }

    public Exit()
    {
        this.RemoveAll();
        this.toggleBar.getComponent(ToggleContainer).checkEvents.splice(0,this.toggleBar.getComponent(ToggleContainer).checkEvents.length);
        this.node.destroy();
    }

    public async OpenCardLib()
    {
        try
        {
            this.cardContent=this.node.getChildByPath("CardView/view/content");
            this.toggleBar.getChildByPath("Mountain").getComponent(Toggle).isChecked=true;
            this.toggleBar.getComponent(ToggleContainer).checkEvents.push(this.containerEventHandler);
            this.cardBoothPre=await BundleManager.Instance.loadAssetsFromBundle("PartPrefabs", "CardBooth") as Prefab;
            this.LoadCard(Biomes.Mountain);
        }
        catch(error)
        {
            console.error("CardLibPanel 下的 OpenCardLib 错误：",error);
        }
    }

    private OnCheckToggleEvent(event: Event, customEventData: string)
    {
        try
        {
            AudioManager.Instance.PlayerOnShot("Sound/sound_bookmark_select_01");
            console.log("check");
            //this.pageView.removeAllPages();
            this.RemoveAll();
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

    //显示底图
    private ShowBooth(_biomes: Biomes)
    {
        let i = 100001;   //角色id
        let jconfig = null;
        let num = 0;
        let tnode:Node;
        tnode = instantiate(this.cardBoothPre);
        tnode.setParent(this.cardContent);
        do
        {
            jconfig = config.RoleConfig.get(i);
            if (jconfig != null)
            {
                if (_biomes == jconfig.Biomes)
                {
                    this.cardCfgs.push(jconfig);
                    num++;

                    if (num % 3 == 0)
                    {
                        tnode = instantiate(this.cardBoothPre);
                        tnode.setParent(this.cardContent);
                        console.log("instantiate booth");
                    }
                }
                i++;
            }
        }
        while (jconfig != null)
    }

    //加载立绘
    private async LoadCard(_biomes: Biomes)
    {
        try
        {
            this.ShowBooth(_biomes);
            this.rolePaintingPre=await BundleManager.Instance.loadAssetsFromBundle("PartPrefabs", "RolePainting") as Prefab;
            console.log("LoadCard!!! User.UserData.bag.ItemList:", User.UserData.bag.ItemList);
            let boothNum = 0;
            for(let j=0;j<this.cardCfgs.length;j++)
            {
                let card = instantiate(this.rolePaintingPre);
                await card.getComponent(RoleCard).Init(this.cardCfgs[j].Id);
                card.getComponent(RoleCard).Stage = this.cardCfgs[j].Stage;
                card.getComponent(RoleCard).Name = GameManager.Instance.GetText(this.cardCfgs[j].Name);
                card.setParent(this.cardContent.children[boothNum].getChildByPath("Layout"));
                try
                {
                    if (User.UserData.bag.ItemList[j].isTatter)
                    {
                        card.getComponent(RoleCard).Lock = true;
                        card.getComponent(RoleCard).SetNumber
                            (
                                User.UserData.bag.ItemList[j].Number, 8
                            );
                    }
                    else
                    {
                        card.getComponent(RoleCard).Lock = false;
                    }
                }
                catch (error)
                {
                    console.warn('StorePanel 下 LoadCard 无法读取到玩家数据 err: ', error);
                }

                if ((j + 1) % 3 == 0)
                {
                    boothNum++;
                }
                await sleep(30);
            }

            if ((this.cardContent.getComponent(UITransform).contentSize.y - 400) < this.cardContent.parent.getComponent(UITransform).contentSize.y)
            {
                this.scroll.enabled = false;
            }
            console.log("LoadCard done!!!");
        }
        catch (error)
        {
            console.error("CardLibPanel 下的 LoadCard 错误：", error);
        }
    }

    private RemoveAll()
    {
        this.cardCfgs.splice(0,this.cardCfgs.length);
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


