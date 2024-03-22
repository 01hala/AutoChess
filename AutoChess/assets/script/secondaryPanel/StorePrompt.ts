/*
 * 修改 StorePrompt
 * author：Hotaru
 * 2024/03/18
 * 商店购买卡包提示面板
 */
import { _decorator, Button, Component, instantiate, Label, labelAssembler, Node, Prefab, ScrollView, Sprite } from 'cc';
import { CardPacket } from '../serverSDK/ccallplayer';
import { BundleManager } from '../bundle/BundleManager';
import { loadAssets } from '../bundle/LoadAsset';
const { ccclass, property } = _decorator;

@ccclass('StorePrompt')
export class StorePrompt extends Component 
{
    private itemPre:Prefab;

    private viewContent:Node;
    start() 
    {
        this.Init();
        this.viewContent=this.node.getChildByPath("ScrollView/view/content");
    }

    private async Init()
    {
        this.itemPre=await BundleManager.Instance.loadAssetsFromBundle("Icons","CardPacketItem")as Prefab;
    }

    update(deltaTime: number) {
        
    }

    async ShowPacketItem(_cardPacketInfo:CardPacket)
    {
        let item:Node=null;
        for(let i=0;i<_cardPacketInfo.ItemList.length;i++)
        {
            item=instantiate(this.itemPre);
            this.viewContent.addChild(item);
            let path="Avatar/Role_"+_cardPacketInfo.ItemList[i].roleID;
            let img=await loadAssets.LoadImg("path")
            item.getChildByPath("IconMask/RoleSprite").getComponent(Sprite).spriteFrame=img;
            item.getChildByPath("Label").getComponent(Label).string=""+_cardPacketInfo.ItemList[i].Number;
        }
    }
}


