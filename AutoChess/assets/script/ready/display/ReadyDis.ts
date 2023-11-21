/*
 * ReadyDis.ts
 * author: Hotaru
 * 2023/11/11
 */
import { _decorator, BlockInputEvents, Button, Component, EventHandler, instantiate, Node, Prefab, RichText, Size, size, UITransform, Vec3, view } from 'cc';
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

    private roleArea:RoleArea;
    private shopArea:ShopArea;

    public ready:Ready;

    private refreshBtn:Button;
    private startBtn:Button;
    private coinText:RichText;

    private waitingPanel:Node;
    public infoPanel:Node;

    public constructor(ready:Ready) 
    {
        this.ready = ready;
        this.onEvent();
    }

    async start(father:Node) 
    {
        try
        {
            //注册回调
            singleton.netSingleton.game.cb_battle_info=(battle_info:common.UserBattleData)=>
            {
                this.ready.SetCoins(battle_info.coin);
                this.ready.SetRoles(battle_info.RoleList);
            }
            singleton.netSingleton.game.cb_shop_info=(shop_info:common.ShopData)=>
            {
                this.ready.SetShopData(shop_info);
            }
            this.father=father;
            //主要界面
            let panel = await BundleManager.Instance.loadAssetsFromBundle("Battle", "ReadyPanel") as Prefab;
            this.panelNode = instantiate(panel);
            father.addChild(this.panelNode);
            //等待界面
            panel=await BundleManager.Instance.loadAssetsFromBundle("Panel", "waiting") as Prefab;
            this.waitingPanel=instantiate(panel);
            this.waitingPanel.setParent(this.panelNode);
            this.waitingPanel.setSiblingIndex(100);
            //角色信息二级界面
            panel=await BundleManager.Instance.loadAssetsFromBundle("Panel", "Information") as Prefab;
            this.infoPanel=instantiate(panel);
            this.infoPanel.setParent(this.panelNode);
            this.infoPanel.active=false;
            //操作区域
            this.shopArea=this.panelNode.getChildByPath("ShopArea").getComponent(ShopArea);
            this.roleArea=this.panelNode.getChildByPath("RoleArea").getComponent(RoleArea);
            //金币文本
            this.coinText=this.panelNode.getChildByPath("TopArea/CoinInfo/RichText").getComponent(RichText);
            //刷新按钮
            this.refreshBtn=this.panelNode.getChildByPath("ShopArea/Falsh_Btn").getComponent(Button);
            this.refreshBtn.node.on(Button.EventType.CLICK,()=>
            {
                this.RefreshShop();
            },this);
            //开始按钮
            this.startBtn=this.panelNode.getChildByPath("ShopArea/Start_Btn").getComponent(Button);
            this.startBtn.node.on(Button.EventType.CLICK,()=>
            {
                if(this.roleArea.rolesNode.length!=0)
                {
                    this.panelNode.active=false;
                    this.ready.StartBattle();
                }
            });
            //准备开始
            this.ready.StartReady();
            this.coinText.string=""+this.ready.coin;
            await this.RefreshShop();
            //隐藏等待界面
            this.waitingPanel.getComponent(BlockInputEvents).enabled=false;
            this.waitingPanel.active=false;
        }
        catch(error)
        {
            console.error("ReadyDis 里的 start 错误 err:",error);
        }
    }

    Restore()
    {
        this.panelNode.active=true;
        this.ready.StartReady();
        this.RefreshShop();
        this.coinText.string=""+this.ready.coin;
    }

    Waiting(sw:boolean)
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


