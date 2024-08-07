/*
 * RoleToggleList.ts
 * author: Hotaru
 * 2024/05/16
 * 牌组编辑界面
 */
import { _decorator, Animation, Button, Component, instantiate, Node, Prefab } from 'cc';
import { BundleManager } from '../bundle/BundleManager';
import * as common from '../battle/AutoChessBattle/common';
import * as singleton from '../netDriver/netSingleton';
import { RoleToggleList } from '../part/RoleToggleList';
import { SendMessage } from '../other/MessageEvent';
import * as enums from '../other/enums';
import { AudioManager } from '../other/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('CardEditor')
export class CardEditor extends Component 
{
    //卡牌栏区域
    private pageContent:Node;
    //复选框预制体
    private framePre:Prefab;
    //牌组信息
    public roleGroup:common.RoleGroup;
    //保存并关闭按钮
    private backBtn:Node;

    protected async onLoad(): Promise<void>
    {
        this.pageContent=this.node.getChildByPath("PageView/view/content");
        this.backBtn=this.node.getChildByPath("Close_Btn");
        this.framePre=await BundleManager.Instance.loadAssetsFromBundle("Parts","RoleToggleFarme")as Prefab;
    }

    start() 
    {
        try
        {
            this.roleGroup=singleton.netSingleton.mainInterface.userData.roleGroup[0];
            this.backBtn.on(Button.EventType.CLICK,()=>
            {
                try
                {
                    this.node.dispatchEvent(new SendMessage('OpenPopUps', true,
                    {
                        type: enums.PopUpsType.ConfirmBoard,
                        title: "提 醒",
                        subheading: "是否保存并返回主界面",
                        items: null
                    }, (flag) =>
                    {
                        AudioManager.Instance.PlayerOnShot("Sound/sound_click_close_01");
                        this.node.active = false;
                        singleton.netSingleton.mainInterface.panelNode.active = true;
                        if (flag)
                        {
                            singleton.netSingleton.player.edit_role_group(this.roleGroup);
                        }
                        this.CloseCardEditor();
                    }));
                }
                catch(error)
                {
                    console.error("返回按钮 错误:",error);
                }
                
            },this);
        }
        catch(error)
        {
            console.error("CardEditor 下的 start 错误:",error);
        }
    }

    public OpenCardEditor()
    {
        try
        {
            this.LoadGroup();
        }
        catch(error)
        {
            console.error("CardEditor 下的 OpenCardEditor 错误:",error);
        }
    }
    
    private async LoadGroup(_cardDeck:number=1)
    {
        try
        {
            this.roleGroup=singleton.netSingleton.mainInterface.userData.roleGroup[0];
            for (let i = 1; i <= 6; i++)
            {
                let t_node = instantiate(this.framePre);
                t_node.setParent(this.pageContent);
                await t_node.getChildByPath("RoleToggleList").getComponent(RoleToggleList).Init(this.roleGroup, i, this.node);
            }
        }
        catch(error)
        {
            console.error("CardEditor 下的 LoadGroup 错误:",error);
        }
    }

    private CloseCardEditor()
    {
        for (let t of this.pageContent.children)
        {
            t.destroy();
        }
    }
}


