/*
 * ShopArea.ts
 * author: Hotaru
 * 2023/11/11
 */
import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
import { ShopIndex, ShopProp, ShopRole } from '../../serverSDK/common';
import { RoleIcon } from './RoleIcon';
import * as singleton from '../../netDriver/netSingleton';
const { ccclass, property } = _decorator;

@ccclass('ShopArea')
export class ShopArea extends Component 
{
    @property({
        type: Prefab,
        displayName: "图标预制体"
    })
    public roleIcon:Node;

    public rolesSquare:Node[]=[];

    public panel:Node;

    private shopRoles:Node[]=[];

    protected onLoad(): void 
    {
        for(let t of this.node.getChildByPath("TopArea/Role").children)
        {
            this.rolesSquare.push(t);
        }
        this.panel=this.node.parent;
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
        this.shopRoles=[];
        if(roles)
        {
            for(let i=0;i<roles.length;i++)
            {
                let newNode=instantiate(this.roleIcon);
                newNode.getComponent(RoleIcon).SetProperty(roles[i].HP,roles[i].Attack)
                newNode.setParent(this.panel);
                newNode.setWorldPosition(this.rolesSquare[i].worldPosition);
            }
        }
    }

    BuyRole()
    {
        for(let i=0;i<this.shopRoles.length;i++)
        {
            if(this.shopRoles[i].getComponent(RoleIcon).isBuy)
            {
                singleton.netSingleton.ready.ready.Buy(ShopIndex.Role , i , this.shopRoles[i].getComponent(RoleIcon).Index);
            }
        }
        
    }

    SaleRole()
    {
        
    }


}


