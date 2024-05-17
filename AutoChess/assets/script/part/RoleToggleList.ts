/*
 * RoleToggleList.ts
 * author: Hotaru
 * 2024/05/16
 * 牌库复选栏
 */
import { _decorator, assetManager, CCInteger, Color, color, Component, instantiate, Node, Prefab, RichText, Sprite, Toggle } from 'cc';
import * as common from '../serverSDK/common';
import { BundleManager } from '../bundle/BundleManager';
import { config } from '../config/config';
import { loadAssets } from '../bundle/LoadAsset';
import { RoleConfig } from '../config/role_config';
import { CardEditor } from '../mainInterface/CardEditor';
const { ccclass, property } = _decorator;

@ccclass('RoleToggleList')
export class RoleToggleList extends Component 
{
    @property(CCInteger)
    public stageLv:number;
    //toggle预制体
    private roleTogglePre:Prefab
    //选中的toggle列表
    private confirmToggles:Node[];
    //等阶文本
    private stageLvText:RichText;
    //父节点组件
    private cardEditor:CardEditor;

    protected async onLoad(): Promise<void>
    {
        this.roleTogglePre=await BundleManager.Instance.loadAssetsFromBundle("Parts","RoleToggel") as Prefab;
        this.stageLvText=this.node.getChildByPath("RichText").getComponent(RichText);
    }


    start() 
    {

    }

    public async Init(_roleGroup:common.RoleGroup , _stageLv:number , _father:Node)
    {
        try
        {
            this.stageLvText.string="<color=#ffffff>"+_stageLv+"阶角色</color>";
            this.stageLv=_stageLv;
            this.cardEditor=_father.getComponent(CardEditor);
            let i=100001;   //角色id
            let jconfig:RoleConfig=null;
            //点击勾选事件
            let checkEventHandler = new RoleToggleList.EventHandler();
            checkEventHandler.target = this.node; //这个 node 节点是你的事件处理代码组件所属的节点
            checkEventHandler.component = 'RoleToggleList';//这个是脚本类名
            checkEventHandler.handler = 'CheckToggle';
            
            do
            {
                jconfig=config.RoleConfig.get(i);
                if(jconfig!=null)
                {
                    let t_node=instantiate(this.roleTogglePre);
                    t_node.name=jconfig.Id.toString();
                    this.LoadImgOnConfig(t_node,jconfig.Avatar);
                    t_node.setParent(this.node);
                    if(_roleGroup.RoleList.find((value)=>(value==jconfig.Id)))
                    {
                        this.confirmToggles.push(t_node);
                        t_node.getComponent(Toggle).isChecked=true;
                    }
                    checkEventHandler.customEventData = jconfig.Id.toString();
                    let toggle=t_node.getComponent(Toggle);
                    toggle.checkEvents.push(checkEventHandler);
                }
            }while(jconfig!=null)
        }
        catch(error)
        {
            console.log("RoleToggleList 下的 Init 错误:",error);
        }
    }

    private async LoadImgOnConfig(_node:Node,_address:string)
    {
        try
        {
            _node.getChildByPath("IconMask/RoleSprite").getComponent(Sprite).spriteFrame=await loadAssets.LoadImg(_address);
            let color;
            switch(this.stageLv)
            {
                case 1:color=new Color().fromHEX("#ffffff");break;
                case 2:color=new Color().fromHEX("#6fce98");break;
                case 3:color=new Color().fromHEX("#6f8ed3");break;
                case 4:color=new Color().fromHEX("#c97ef3");break;
                case 5:color=new Color().fromHEX("#e5ad27");break;
                case 6:color=new Color().fromHEX("#d34fsa");break;
            }
            _node.getChildByPath("Farme").getComponent(Sprite).color=color;
        }
        catch(error)
        {
            console.log("RoleToggleList 下的 LoadImgOnConfig 错误:",error);
        }
    }

    private CheckToggle(event: Event, customEventData: string)
    {
        try
        {
            //将当前组里第一个角色取消勾选
            let t=this.confirmToggles.pop();
            t.getComponent(Toggle).isChecked=false;
            this.confirmToggles.push(this.node.getChildByName(customEventData));
            //查找并替换卡组里原本的角色
            for(let i=0;i<this.cardEditor.roleGroup.RoleList.length;i++)
            {
                if(Number(customEventData)==this.cardEditor.roleGroup.RoleList[i])
                {
                    this.cardEditor.roleGroup.RoleList.splice(i,1,Number(customEventData));
                    break;
                }
            }
        }
        catch(error)
        {
            console.log("RoleToggleList 下的 CheckToggle 错误:",error);
        }
    }
}


