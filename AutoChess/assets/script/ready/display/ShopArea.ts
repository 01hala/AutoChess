/*
 * ShopArea.ts
 * author: Hotaru
 * 2023/11/11
 */
import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
import { ShopProp, ShopRole } from '../../serverSDK/common';
import { RoleIcon } from './RoleIcon';
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

    Init(roles:ShopRole[],props:ShopProp[])
    {
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

    ShopUpdate(roles:ShopRole[],props:ShopProp[])
    {

    }

}


