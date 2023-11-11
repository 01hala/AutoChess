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
const { ccclass, property } = _decorator;

@ccclass('ReadyDis')
export class ReadyDis 
 {
    public father:Node;

    private panelNode:Node;

    private roleArea:Node;

    private shopArea:Node;

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
            let panel = await BundleManager.Instance.loadAssetsFromBundle("Battle", "BattlePanel") as Prefab;
            this.panelNode = instantiate(panel);

            this.refreshBtn=this.panelNode.getChildByPath("ShopArea/Falsh_Btn").getComponent(Button);
            this.refreshBtn.node.on(Button.EventType.CLICK,()=>
            {
                this.ready.Refresh();
                this.shopArea.getComponent(ShopArea).ShopUpdate();

            },this);
            
            this.father=father;
            father.addChild(this.panelNode);

        }
        catch(error)
        {

        }
    }


    onEvent()
    {
        
    }



}


