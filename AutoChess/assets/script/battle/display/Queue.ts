/*
 * Queue.ts
 * author: Hotaru
 * 2023/10/04
 * 队列展示类
 */
import { _decorator, Component, instantiate, Node, Prefab, resources, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

import * as RoleDis from './RoleDis'
import { BundleManager } from '../../bundle/BundleManager';
import * as role from '../role'
import { Battle } from '../battle';
import { Role } from '../../serverSDK/common';

@ccclass('Queue')
export class Queue extends Component 
{
    private res:string="script/display/Queue.ts"

    @property([Node])
    public locationTemp:Node[]=[];

    @property(Node)
    public readyLocation:Node;
    @property(Node)
    public battleLocation:Node;

    //public roleList:Node[]=[];

    start() 
    {

    }

    update(deltaTime: number) 
    {
        
    }

    async SpawnRole(r:role.Role[])
    {
        try 
        {
            console.log(this.locationTemp);
            console.log(r);

            let address:string="Role_";
            for(let i = 0; i<6; i++)
            {
                //let roleRes=""+address+r[i].id;
                let roleRes = address + "1";
                let newNode = await BundleManager.Instance.loadAssetsFromBundle("Roles", roleRes) as Prefab;
                let role=instantiate(newNode);
                role.position=new Vec3(this.locationTemp[i].position);
                this.node.addChild(role);
                //this.roleList.push(role);

                r[i].roleNode = role;
                let roleDis = role.getComponent(RoleDis.RoleDis);
                await roleDis.Refresh(r[i]);
            }
        } 
        catch (error) 
        {
            console.warn(this.res+" 下的 SpawnRole 错误", error);
        }
        
    }

    async RemoveRole(role:role.Role)
    {
        try
        {
            if (role.roleNode) {
                await role.roleNode.getComponent(RoleDis.RoleDis).Exit();
                role.roleNode = null;
            }
        }
        catch (err)
        {
            console.warn(this.res+" 下的 RemoveRole 错误:", err);
        }
    }
}


