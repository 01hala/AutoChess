/*
 * ShopArea.ts
 * author: Hotaru
 * 2023/11/11
 */
import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
import { ShopIndex, ShopProp, ShopRole } from '../../serverSDK/common';
import { RoleIcon } from './RoleIcon';
import * as singleton from '../../netDriver/netSingleton';
import { RoleArea } from './RoleArea';
import { PropIcon } from './PropIcon';
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

    public rolesSquare:Node[]=[];

    public PropsSquare:Node[]=[];
    @property(Node)
    public panel:Node;

    private shopRoles:Node[]=[];

    private shopProps:Node[]=[];

    private roleArea:RoleArea;

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
    }

    start() 
    {
        //this.Init();
    }

    update(deltaTime: number) 
    {
        
    }

    Init(roles?:ShopRole[],props?:ShopProp[])
    {
        for(let t of this.shopRoles)
        {
            t.destroy();
        }
        for(let t of this.shopProps)
        {
            t.destroy();
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
                    newNode.getComponent(RoleIcon).Init(roles[i].RoleID,roles[i].HP,roles[i].Attack);
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
                    newNode.getComponent(PropIcon).Init();
                    this.shopRoles.push(newNode);
                }
            }
            
        }
    }

    async BuyRole(_index:number, _obj:Node , _isBuy:boolean)
    {
        console.log(this.shopRoles.length);
        for(let i=0;i<this.shopRoles.length;i++)
        {
            if(!this.shopRoles[i])
            {
                continue;
            }

            let role = this.shopRoles[i].getComponent(RoleIcon);
            if (!role || !role.isBuy)
            {
                continue;
            }

            await singleton.netSingleton.ready.ready.Buy(ShopIndex.Role , i, _index);
            this.roleArea.rolesNode.push(_obj);
            this.shopRoles[i] = null;
        }
        
    }

    async BuyProp(_index:number)
    {
        
    }


}


