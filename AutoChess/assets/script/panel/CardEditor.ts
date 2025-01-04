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
import { User } from '../login/User';
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
    private exitBtn:Node;   
    //保存按钮
    private saveBtn:Node;

    //toggle预制体
    public roleTogglePre:Prefab

    protected async onLoad(): Promise<void>
    {
        this.pageContent=this.node.getChildByPath("PageView/view/content");
        this.exitBtn=this.node.getChildByPath("Close_Btn");
        this.saveBtn=this.node.getChildByPath("Save_Btn");
    }

    start() 
    {
        try
        {
            this.roleGroup=User.UserData.roleGroup[0];
            this.exitBtn.on(Button.EventType.CLICK,()=>
            {
                try
                {
                    this.node.dispatchEvent(new SendMessage(enums.SendMseeageType.OpenPopUps, true,
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
                        this.Exit();
                    }));
                }
                catch(error)
                {
                    console.error("返回按钮 错误:",error);
                }
                
            },this);

            this.saveBtn.on(Button.EventType.CLICK,()=>
            {
                singleton.netSingleton.player.edit_role_group(this.roleGroup);
            },this);

        }
        catch(error)
        {
            console.error("CardEditor 下的 start 错误:",error);
        }
    }

    public Exit()
    {
        for (let t of this.pageContent.children)
        {
            t.destroy();
        }

        this.node.destroy();
    }

    public async OpenCardEditor()
    {
        try
        {
            this.framePre = await BundleManager.Instance.loadAssetsFromBundle("PartPrefabs","RoleToggleFarme")as Prefab;
            this.roleTogglePre=await BundleManager.Instance.loadAssetsFromBundle("PartPrefabs","RoleToggel") as Prefab;
            await this.LoadGroup();
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
            this.roleGroup=User.UserData.roleGroup[0];
            for (let i = 1; i <= 6; i++)
            {
                let t_node = instantiate(this.framePre);
                t_node.setParent(this.pageContent);
                await t_node.getChildByPath("RoleToggleList").getComponent(RoleToggleList).Init(this.roleGroup, i,this.roleTogglePre);
            }
        }
        catch(error)
        {
            console.error("CardEditor 下的 LoadGroup 错误:",error);
        }
    }

}


