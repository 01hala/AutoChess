/*
 * ReadyDis.ts
 * author: Hotaru
 * 2023/11/11
 */
import { _decorator, Button, Component, EventHandler, instantiate, Node, Prefab } from 'cc';
import { RoleArea } from './RoleArea';
import { Ready } from '../Ready';
import { BundleManager } from '../../bundle/BundleManager';
import { ShopArea } from './ShopArea';
import * as skill from '../../battle/skill/skill_base'
const { ccclass, property } = _decorator;

@ccclass('ReadyDis')
export class ReadyDis 
 {
    public father:Node;

    private panelNode:Node;
    private coinText:Text;

    private roleArea:Node;
    private shopArea:ShopArea;

    public ready:Ready;

    private refreshBtn:Button;

    public constructor(ready:Ready) 
    {
        this.ready = ready;
        this.onEvent();
    }

    async start(father:Node) 
    {
        try
        {
            let panel = await BundleManager.Instance.loadAssetsFromBundle("Battle", "ReadyPanel") as Prefab;
            console.log(panel);
            this.panelNode = instantiate(panel);

            this.father=father;
            father.addChild(this.panelNode);

            this.shopArea=this.panelNode.getChildByPath("ShopArea").getComponent(ShopArea);
            this.RefreshShop();
            //刷新按钮
            this.refreshBtn=this.panelNode.getChildByPath("ShopArea/Falsh_Btn").getComponent(Button);
            this.refreshBtn.node.on(Button.EventType.CLICK,()=>
            {
                this.RefreshShop();
            },this);
            
            this.ready.StartReady();
        }
        catch(error)
        {

        }
    }

    //刷新商店
    RefreshShop()
    {
        this.ready.Refresh();
        this.shopArea.Init(this.ready.GetShopRoles(),this.ready.GetShopProps());
    }

    private CheckCoinEvent(evs:skill.Event[])
    {

    }

    onEvent()
    {
        this.ready.on_event = async (evs) =>
        {
            await this.CheckCoinEvent(evs);
        }
    }



}


