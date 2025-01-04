/*
 * RoleToggleList.ts
 * author: Hotaru
 * 2024/05/16
 * 牌组编辑界面
 */
import { _decorator, Animation, Button, Component, EventHandler, instantiate, Node, Prefab, Toggle, ToggleContainer, UITransform, Vec2, Vec3 } from 'cc';
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
    private content:Node=null;
    //复选框预制体
    private framePre:Prefab=null;
    //牌组信息
    public roleGroup:common.RoleGroup=null;
    //保存并关闭按钮
    private exitBtn:Node=null; 
    //保存按钮
    private saveBtn:Node=null;
    //事件句柄
    private containerEventHandler:EventHandler=null;

    //toggle预制体
    public roleTogglePre:Prefab=null;
    //标签栏
    public toggleGroup: Node=null;

    private oriContentPosY:number=0;
    private viewHight:number=0;

    protected async onLoad(): Promise<void>
    {
        this.content=this.node.getChildByPath("Panel/ScrollView/view/content");
        this.exitBtn=this.node.getChildByPath("Close_Btn");
        this.saveBtn=this.node.getChildByPath("Save_Btn");
        this.toggleGroup=this.node.getChildByPath("Panel/ToggleGroup");
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
                    if(this.roleGroup.RoleList.length<54)
                    {
                        this.node.dispatchEvent(new SendMessage(enums.SendMseeageType.ShowTip,true,"<outline color=black width=4>卡 组 未 选 满</outline>"))
                    }
                    else
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

            this.containerEventHandler = new EventHandler();
            this.containerEventHandler.target = this.node; // 这个 node 节点是你的事件处理代码组件所属的节点
            this.containerEventHandler.component = 'CardEditor';// 这个是脚本类名
            this.containerEventHandler.handler = 'OnCheckToggleEvent';
            this.toggleGroup.getComponent(ToggleContainer).checkEvents.push(this.containerEventHandler);

        }
        catch(error)
        {
            console.error("CardEditor 下的 start 错误:",error);
        }
    }

     private OnCheckToggleEvent(event: Event, customEventData: string)
        {
            try
            {
                AudioManager.Instance.PlayerOnShot("Sound/sound_bookmark_select_01");
                console.log("check");
                let targetY=0;
                let contentHight=this.content.getComponent(UITransform).contentSize.height;
                this.viewHight=this.content.parent.getComponent(UITransform).contentSize.height;
                
                if (this.toggleGroup.getChildByPath("Stage_1").getComponent(Toggle).isChecked)
                {
                    this.content.setPosition(new Vec3(0,this.oriContentPosY,0));
                }
                else
                {
                    let n=0;
                    if (this.toggleGroup.getChildByPath("Stage_2").getComponent(Toggle).isChecked)
                    {
                        n=1;
                    }
                    if (this.toggleGroup.getChildByPath("Stage_3").getComponent(Toggle).isChecked)
                    {
                        n=2;
                    }
                    if (this.toggleGroup.getChildByPath("Stage_4").getComponent(Toggle).isChecked)
                    {
                        n=3;
                    }
                    if (this.toggleGroup.getChildByPath("Stage_5").getComponent(Toggle).isChecked)
                    {
                        n=4;
                    }
                    if (this.toggleGroup.getChildByPath("Stage_6").getComponent(Toggle).isChecked)
                    {
                        n=5;
                    }
                    for (let i = 0; i < n; i++)
                    {
                        targetY += this.content.children[i].getComponent(UITransform).contentSize.height + 20;
                    }
                    if (contentHight - targetY > this.viewHight)
                    {
                        this.content.setPosition(new Vec3(0, this.oriContentPosY + targetY, 0));
                    }
                    else
                    {
                        let offset = contentHight - this.viewHight;
                        this.content.setPosition(new Vec3(0, this.oriContentPosY + offset, 0));
                    }
                }
            }
            catch (error)
            {
                console.error("CardLibPanel 下的 OnCheckToggleEvent 错误：", error);
            }
        }

    public Exit()
    {
        for (let t of this.content.children)
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
            this.oriContentPosY=this.content.position.y;
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
                t_node.setParent(this.content);
                await t_node.getChildByPath("RoleToggleList").getComponent(RoleToggleList).Init(this, i,this.roleTogglePre);
            }
        }
        catch(error)
        {
            console.error("CardEditor 下的 LoadGroup 错误:",error);
        }
    }

}


