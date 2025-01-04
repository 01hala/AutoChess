import { _decorator, Button, Component, EventHandler, instantiate, Node, Prefab, Toggle, ToggleContainer } from 'cc';
import { AudioManager } from '../other/AudioManager';
import * as singleton from '../netDriver/netSingleton';
import * as enums from '../other/enums';
import { BundleManager } from '../bundle/BundleManager';
import { User } from '../login/User';
import { RoleConfig } from '../battle/AutoChessBattle/config/role_config';
import { RoleCard } from '../part/RoleCard';
import { GameManager } from '../other/GameManager';
import { sleep } from '../other/sleep';
import { config } from '../battle/AutoChessBattle/config/config';
const { ccclass, property } = _decorator;

@ccclass('CardLibPanel')
export class CardLibPanel extends Component 
{
    private backBtn: Node;
    //角色立绘展示区域
    private cardContent: Node;
    private rolePaintingPre:Prefab;
    //临时数组
    private cardCfgs:RoleConfig[] = [];
    //标签栏
    public toggleGroup: Node;
    
    private containerEventHandler:EventHandler;

    protected onLoad(): void
    {
        this.backBtn=this.node.getChildByPath("Panel/Back_Btn");
        this.toggleGroup=this.node.getChildByPath("Panel/Bottom/ToggleGroup");
        this.cardContent=this.node.getChildByPath("Panel/ScrollView/view/content");
    }

    protected start(): void
    {
        try
        {
            this.backBtn.on(Button.EventType.CLICK, () =>
            {
                AudioManager.Instance.PlayerOnShot("Sound/sound_click_close_01");
                singleton.netSingleton.mainInterface.panelNode.active = true;
                this.Exit();
            }, this);

            this.containerEventHandler = new EventHandler();
            this.containerEventHandler.target = this.node; // 这个 node 节点是你的事件处理代码组件所属的节点
            this.containerEventHandler.component = 'CardLibPanel';// 这个是脚本类名
            this.containerEventHandler.handler = 'OnCheckToggleEvent';
            this.toggleGroup.getComponent(ToggleContainer).checkEvents.push(this.containerEventHandler);
        }
        catch (error)
        {
            console.error("CardLibPanel 下的 start 错误：", error);
        }
    }

    public async OpenCardLib()
    {
        try
        {
            this.toggleGroup.getChildByPath("Jungle").getComponent(Toggle).isChecked = true;
            this.toggleGroup.getComponent(ToggleContainer).checkEvents.push(this.containerEventHandler);
            this.LoadCard(enums.Biomes.Jungle);
        }
        catch (error)
        {
            console.error("CardLibPanel 下的 OpenCardLib 错误：", error);
        }
    }

    private OnCheckToggleEvent(event: Event, customEventData: string)
    {
        try
        {
            AudioManager.Instance.PlayerOnShot("Sound/sound_bookmark_select_01");
            console.log("check");
            this.RemoveAll();
            if (this.toggleGroup.getChildByPath("Sea").getComponent(Toggle).isChecked)
            {
                this.LoadCard(enums.Biomes.Sea);
            }
            if (this.toggleGroup.getChildByPath("Mountain").getComponent(Toggle).isChecked)
            {
                this.LoadCard(enums.Biomes.Mountain);
            }
            if (this.toggleGroup.getChildByPath("Grassland").getComponent(Toggle).isChecked)
            {
                this.LoadCard(enums.Biomes.Grassland);
            }
            if (this.toggleGroup.getChildByPath("Wind").getComponent(Toggle).isChecked)
            {
                this.LoadCard(enums.Biomes.Wind);
            }
            if (this.toggleGroup.getChildByPath("Jungle").getComponent(Toggle).isChecked)
            {
                this.LoadCard(enums.Biomes.Jungle);
            }
            if (this.toggleGroup.getChildByPath("Cave").getComponent(Toggle).isChecked)
            {
                this.LoadCard(enums.Biomes.Cave);
            }
        }
        catch (error)
        {
            console.error("CardLibPanel 下的 OnCheckToggleEvent 错误：", error);
        }
    }

    private ReadConfig(_biomes: enums.Biomes)
    {
        let i=100001;
        let rc=null;
        do
        {
            rc=config.RoleConfig.get(i);
            if(rc!=null)
            {
                i++;
                if(_biomes == rc.Biomes)
                {
                    this.cardCfgs.push(rc);
                }
            }
        }
        while(rc!=null)
    }

    private async LoadCard(_biomes: enums.Biomes)
    {
        try
        {
            this.ReadConfig(_biomes);
            this.rolePaintingPre = await BundleManager.Instance.loadAssetsFromBundle("PartPrefabs", "RoleCard") as Prefab;
            //console.log("LoadCard!!! User.UserData.bag.ItemList:", User.UserData.bag.ItemList);
            for (let j = 0; j < this.cardCfgs.length; j++)
            {
                let card = instantiate(this.rolePaintingPre);
                card.getComponent(RoleCard).Init(this.cardCfgs[j].Id, this.cardCfgs[j].Res).then(()=>
                {
                    card.getComponent(RoleCard).Stage = this.cardCfgs[j].Stage;
                    card.getComponent(RoleCard).Name = GameManager.Instance.GetText(this.cardCfgs[j].Name);
                    card.setParent(this.cardContent);
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
                });
                await sleep(30);
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
            t.destroy();
        }
    }

    public Exit()
    {
        this.node.destroy();
    }

}


