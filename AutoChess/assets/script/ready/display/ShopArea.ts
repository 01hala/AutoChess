/*
 * ShopArea.ts
 * author: Hotaru
 * 2023/11/11
 */
import { _decorator, BlockInputEvents, Camera, Canvas, Component, instantiate, Node, Prefab, tween, Tween, UITransform, Vec3, view, Widget } from 'cc';
import { ShopIndex, ShopProp, ShopRole } from '../../serverSDK/common';
import { RoleIcon } from './RoleIcon';
import * as singleton from '../../netDriver/netSingleton';
import * as common from "../../serverSDK/common"
import { RoleArea } from './RoleArea';
import { PropIcon } from './PropIcon';
import { PropsType } from '../../other/enums';
const { ccclass, property } = _decorator;

@ccclass('ShopArea')
export class ShopArea extends Component 
{
    @property({
        type: Prefab,
        displayName: "图标预制体"
    })
    public roleIcon:Node;
    @property({
        type: Prefab,
        displayName: "食物图标预制体"
    })
    public propIcon:Node;
    //物体位置
    public rolesSquare:Node[]=[];
    public PropsSquare:Node[]=[];
    @property(Node)
    public panel:Node;
    public cam:Node;
    //物体列表
    private shopRoles:Node[]=[];
    private shopProps:Node[]=[];
    //各操作区域
    private roleArea:RoleArea;
    private freezeArea:Node;

    

    protected onLoad(): void 
    {
        for(let t of this.node.getChildByPath("TopArea/Role").children)
        {
            this.rolesSquare.push(t);
        }
        for(let t of this.node.getChildByPath("TopArea/Prop").children)
        {
            this.PropsSquare.push(t);
        }
        this.roleArea=this.panel.getChildByPath("RoleArea").getComponent(RoleArea);
        this.freezeArea=this.node.getChildByPath("FreezeArea");
        this.cam=this.panel.parent.getChildByPath("Camera");
    }

    start() 
    {
        
        if(wx.getSystemInfoSync().safeArea.height==wx.getSystemInfoSync().screenHeight)
        {
            return;
        }
        let bpttomHeigh=(wx.getSystemInfoSync().screenHeight-wx.getSystemInfoSync().safeArea.height)/2;

        let outPos:Vec3=this.cam.getComponent(Camera).screenToWorld(new Vec3(0,bpttomHeigh,0));
        this.node.getComponent(Widget).bottom=outPos.y;
    }

    update(deltaTime: number) 
    {
        
    }

    Init(roles?:ShopRole[],props?:ShopProp[])
    {
        for(let t of this.shopRoles)
        {
            if(t)
            {
                t.destroy();
            }
            
        }
        for(let t of this.shopProps)
        {
            if(t)
            {
                t.destroy();
            }
        }
        this.shopRoles=[];
        this.shopProps=[];
        if(roles)
        {
            for(let i=0;i<roles.length;i++)
            {
                if(roles[i])
                {
                    console.log("shopRoleId: ",roles[i].RoleID);
                    let newNode=instantiate(this.roleIcon);
                    newNode.setParent(this.panel);
                    //console.log(newNode.parent.name);
                    newNode.setWorldPosition(this.rolesSquare[i].worldPosition);
                    newNode.getComponent(RoleIcon).Init(roles[i].RoleID , roles[i].HP , roles[i].Attack , 1 , 1 ,roles[i].IsFreeze);
                    this.shopRoles.push(newNode);
                }
            }
            
        }
        if(props)
        {
            for(let i=0;i<props.length;i++)
            {
                if(props[i]) 
                {
                    let newNode=instantiate(this.propIcon);
                    newNode.setParent(this.panel);
                    //console.log(newNode.parent.name);
                    newNode.setWorldPosition(this.PropsSquare[i].worldPosition);
                    console.log("props id:"+props[i].PropID)
                    newNode.getComponent(PropIcon).Init(props[i].PropID, props[i].IsFreeze);
                    this.shopProps.push(newNode);
                }
            }
            
        }
    }

    async BuyRole(_index:number, _obj:Node ,_isMerge:boolean)
    {
        console.log('buy Role');
        for(let i=0;i<this.shopRoles.length;i++)
        {
            if(this.shopRoles[i] == _obj)
            {
                await singleton.netSingleton.ready.ready.Buy(ShopIndex.Role , i , _index);
                if(!_isMerge)
                {
                    this.roleArea.rolesNode[_index]=_obj;
                }
                this.shopRoles[i] = null;
            }
        }
        
    }

    async BuyProp(_index:number,_obj:Node)
    {
        for(let i=0;i<this.shopProps.length;i++)
        {
            if(this.shopProps[i] == _obj)
            {
                await singleton.netSingleton.ready.ready.Buy(ShopIndex.Prop , i , _index);
                this.shopProps[i] = null;
            }
        }
    }

    ShowFreezeArea(_flag:boolean)
    {
        if(_flag)
        {
            this.freezeArea.active=true;
            this.freezeArea.getComponent(BlockInputEvents).enabled=true;
            tween(this.freezeArea).to(0.2,{position:new Vec3(0,170,0)}).start();
        }
        else
        {
            this.freezeArea.getComponent(BlockInputEvents).enabled=false;
            tween(this.freezeArea).to(0.1,{position:new Vec3(0,0,0)}).call(()=>
            {
                this.freezeArea.active=false;
            }).start();
        }
    }

    async FreezeEntity(_shop_index:common.ShopIndex,_obj:Node , _isFreeze:boolean)
    {
        if(common.ShopIndex.Prop==_shop_index)
        {
            for(let i=0;i<this.shopProps.length;i++)
            {
                if(this.shopProps[i] == _obj)
                {
                    await singleton.netSingleton.ready.ready.Freeze(_shop_index , i,_isFreeze);
                }
            }
        }
        if(common.ShopIndex.Role==_shop_index)
        {
            for(let i=0;i<this.shopRoles.length;i++)
            {
                if(this.shopRoles[i] == _obj)
                {
                    await singleton.netSingleton.ready.ready.Freeze(_shop_index , i ,_isFreeze);
                }
            }
        }
    }


}


