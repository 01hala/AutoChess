/*
 * ReadyDis.ts
 * author: Hotaru
 * 2023/11/11
 */
import { _decorator, Button, Component, EventHandler, instantiate, Node, Prefab, Size, size, UITransform, Vec3, view } from 'cc';
import { RoleArea } from './RoleArea';
import { Ready } from '../Ready';
import { BundleManager } from '../../bundle/BundleManager';
import { ShopArea } from './ShopArea';
import * as skill from '../../battle/skill/skill_base'
import * as singleton from '../../netDriver/netSingleton';
import * as common from '../../serverSDK/common';
import { login } from '../../login/login';
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
            singleton.netSingleton.game.cb_battle_info=(battle_info:common.UserBattleData)=>
            {
                this.ready.SetCoins(battle_info.coin);
                this.ready.SetRoles(battle_info.RoleList);
            }
            singleton.netSingleton.game.cb_shop_info=(shop_info:common.ShopData)=>
            {
                this.ready.SetShopData(shop_info);
            }

            let panel = await BundleManager.Instance.loadAssetsFromBundle("Battle", "ReadyPanel") as Prefab;
            console.log(panel);
            this.panelNode = instantiate(panel);

            this.father=father;
            father.addChild(this.panelNode);

            this.shopArea=this.panelNode.getChildByPath("ShopArea").getComponent(ShopArea);
            //this.waitingPanel.active=false;
            
            //刷新按钮
            this.refreshBtn=this.panelNode.getChildByPath("ShopArea/Falsh_Btn").getComponent(Button);
            this.refreshBtn.node.on(Button.EventType.CLICK,()=>
            {
                this.RefreshShop();
            },this);
            
            this.ready.StartReady();
            this.RefreshShop();
        }
        catch(error)
        {

        }
    }

    Waiting()
    {
        
    }

    //刷新商店
    async RefreshShop()
    {
        await this.ready.Refresh();
        console.log('refresh');
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


