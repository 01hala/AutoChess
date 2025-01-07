/*
 * RoleToggleList.ts
 * author: Hotaru
 * 2024/05/16
 * 牌库复选栏
 */
import { _decorator, assetManager, Button, CCInteger, Color, color, Component, EventHandler, instantiate, Label, Node, Prefab, RichText, Sprite, Toggle } from 'cc';
import * as common from '../battle/AutoChessBattle/common';
import { BundleManager } from '../bundle/BundleManager';
import { config } from '../battle/AutoChessBattle/config/config';
import { loadAssets } from '../bundle/LoadAsset';
import { RoleConfig } from '../battle/AutoChessBattle/config/role_config';
import { CardEditor } from '../panel/CardEditor';
const { ccclass, property } = _decorator;

@ccclass('RoleToggleList')
export class RoleToggleList extends Component 
{
    @property(CCInteger)
    public stageLv:number;
    //选中的toggle列表
    private confirmToggles:Node[]=[];
    //等阶文本
    private stageLvText:Label;
    private countText:Label;
    //父节点组件
    private cardEditor:CardEditor;

    private roleGroup:common.RoleGroup;

    private checkEventHandler:EventHandler;

    protected onLoad(): void
    {
        //点击勾选事件
        this.checkEventHandler = new EventHandler();
        this.checkEventHandler.target = this.node; //这个 node 节点是你的事件处理代码组件所属的节点
        this.checkEventHandler.component = 'RoleToggleList';//这个是脚本类名
        this.checkEventHandler.handler = 'ClickToggle';
    }

    start() 
    {
        
    }

    protected onDestroy(): void
    {
        this.destroy();
    }

    public async Init(_cardEditor:CardEditor , _stageLv:number ,_pre:Prefab)
    {
        try
        {
            this.cardEditor=_cardEditor;
            this.roleGroup=_cardEditor.roleGroup;
            console.log("Init RoleToggleList !");
            
            this.stageLvText=this.node.parent.getChildByPath("Label").getComponent(Label);
            this.countText=this.node.parent.getChildByPath("Label/Count").getComponent(Label);

            this.stageLvText.string=+_stageLv+"阶角色";
            this.stageLv=_stageLv;
            let i=100001;   //角色id
            let rConfig:RoleConfig=null;
            
            
            let allAwait = [];
            do
            {
                rConfig = config.RoleConfig.get(i);
                if (rConfig != null)
                {
                    //console.warn("load RoleToggle:",i);
                    i++;
                    if (rConfig.Stage == this.stageLv)
                    {
                        allAwait.push(this.InstantiateToggle(rConfig,_pre));
                    }
                }
            } while (rConfig != null);

            await Promise.all(allAwait);
        }
        catch(error)
        {
            console.error("RoleToggleList 下的 Init 错误:",error);
        }
    }

    private InstantiateToggle(_config:RoleConfig,_pre:Prefab)
    {
        return new Promise<void>(async (resolve, reject) =>
        {
            try
            {
                let t_node = instantiate(_pre);
                t_node.setParent(this.node);
                t_node.name = _config.Id.toString();
                t_node.getComponent(Toggle).isChecked;
                if (this.roleGroup.RoleList.find((value) => (value == _config.Id)))
                {
                    this.confirmToggles.push(t_node);
                    t_node.getComponent(Toggle).isChecked = true;
                }
                //this.checkEventHandler.customEventData = _config.Id.toString();
                t_node.on(Button.EventType.CLICK,()=>
                {
                    this.ClickToggle(null,t_node.name);
                })
                //t_node.getComponent(Button).clickEvents.push(this.checkEventHandler);
                await this.LoadImgOnConfig(t_node, _config.Avatar);
                resolve()
            } 
            catch (error)
            {
                console.error("RoleToggleList 下的 InstantiateToggle 错误:",error);
                reject();
            }
        })
    }

    private LoadImgOnConfig(_node:Node,_address:string)
    {
        return new Promise<void>((resolve, reject) => 
        {
            try
            {
                loadAssets.LoadImg(_address).then((data) =>
                {
                    let texture = data;
                    if (texture)
                    {
                        _node.getChildByPath("IconMask/RoleSprite").getComponent(Sprite).spriteFrame = texture;
                    }
                    let color;
                    switch (this.stageLv)
                    {
                        case 1: color = new Color().fromHEX("#ffffff"); break;
                        case 2: color = new Color().fromHEX("#6fce98"); break;
                        case 3: color = new Color().fromHEX("#6f8ed3"); break;
                        case 4: color = new Color().fromHEX("#c97ef3"); break;
                        case 5: color = new Color().fromHEX("#e5ad27"); break;
                        case 6: color = new Color().fromHEX("#d34fsa"); break;
                    }
                    _node.getChildByPath("Farme").getComponent(Sprite).color = color;

                    resolve();
                });
            }
            catch(error)
            {
                console.log("RoleToggleList 下的 LoadImgOnConfig 错误:",error);
                reject();
            }
        })
    }

    private ClickToggle(event: Event, customEventData: string)
    {
        try
        {
            
            let checkNode=this.node.getChildByName(customEventData);
            if(checkNode.getComponent(Toggle).isChecked)
            {
                checkNode.getComponent(Toggle).isChecked=true;
                this.confirmToggles.push(checkNode);
                this.cardEditor.roleGroup.RoleList.push(Number(checkNode.name));

                //如果已选角色超过9人
                if (this.confirmToggles.length > 9)
                {
                    //将当前组里的一个角色取消勾选
                    let t = this.confirmToggles.shift();
                    t.getComponent(Toggle).isChecked = false;
                    let index=this.cardEditor.roleGroup.RoleList.findIndex((value)=>(value==Number(t.name)));
                    this.cardEditor.roleGroup.RoleList.splice(index,1);
                }

                // for (let i = 0; i < this.confirmToggles.length; i++)
                // {
                //     if (this.confirmToggles[i].name == checkNode.name)
                //     {
                //         this.confirmToggles.splice(i, 1);

                //         for (let j = 0; j < this.cardEditor.roleGroup.RoleList.length; j++)
                //         {
                //             if (Number(checkNode.name) == this.cardEditor.roleGroup.RoleList[j])
                //             {
                //                 this.cardEditor.roleGroup.RoleList.splice(j, 1, Number(checkNode.name));
                //                 break;
                //             }
                //         }
                //         break;
                //     }
                // }
            }
            else
            {
                checkNode.getComponent(Toggle).isChecked = false;
                let index=this.confirmToggles.findIndex((value)=>(value.name == checkNode.name));
                this.confirmToggles.splice(index,1);

                index=this.cardEditor.roleGroup.RoleList.findIndex((value)=>(value==Number(checkNode.name)));
                this.cardEditor.roleGroup.RoleList.splice(index,1);
            }
            this.countText.string=this.confirmToggles.length+" / 9";
            console.warn("rolr list length:",this.cardEditor.roleGroup.RoleList.length);
        }
        catch(error)
        {
            console.error("RoleToggleList 下的 CheckToggle 错误:",error);
        }
    }
}


