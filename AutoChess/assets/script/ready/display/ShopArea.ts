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
    @property(Node)
    public panel:Node;

    private shopRoles:Node[]=[];

    private roleArea:RoleArea;

    protected onLoad(): void 
    {
        for(let t of this.node.getChildByPath("TopArea/Role").children)
        {
            this.rolesSquare.push(t);
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
        this.shopRoles=[];
        if(roles)
        {
            for(let i=0;i<roles.length;i++)
            {
                if(roles[i])
                {
                    let newNode=instantiate(this.roleIcon);
                    newNode.setParent(this.panel);
                    //console.log(newNode.parent.name);
                    newNode.setWorldPosition(this.rolesSquare[i].worldPosition);
                    newNode.getComponent(RoleIcon).Init(roles[i].RoleID,roles[i].HP,roles[i].Attack);
                    this.shopRoles.push(newNode);
                }
            }
        }
    }

    async BuyRole(_index:number, _obj:Node)
    {
        console.log(this.shopRoles.length);
        for(let i=0;i<this.shopRoles.length;i++)
        {
            if(this.shopRoles[i] && this.shopRoles[i].getComponent(RoleIcon).isBuy)
            {
                await singleton.netSingleton.ready.ready.Buy(ShopIndex.Role , i , _index);
                this.roleArea.rolesNode.push(_obj);
                this.shopRoles[i] = null;
            }
        }
        
    }

    async BuyProp(_index:number)
    {
        
    }


}


