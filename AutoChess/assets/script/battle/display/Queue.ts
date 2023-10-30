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
    //站位列表
    @property([Node])
    public locationTemp:Node[]=[];

    @property(Node)
    public readyLocation:Node;
    @property(Node)
    public battleLocation:Node;
    //角色列表
    public roleNodes:Node[] = [];

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

                r[i].roleNode = role;
                this.roleNodes.push(role);
                console.log("role:", r[i]);

                let roleDis = role.getComponent(RoleDis.RoleDis);
                await roleDis.Refresh(r[i]);
            }
        } 
        catch (error) 
        {
            console.warn("Queue 下的 SpawnRole 错误", error);
        }
        
    }

    async Shiftdis(r:role.Role[])
    {
        try
        {
            for(let i=0;i<this.roleNodes.length;i++)
            {
                //this.roleList[i].position = this.locationTemp[i].position;
                await this.roleNodes[i].getComponent(RoleDis.RoleDis).ShiftPos(this.locationTemp[i].position);
                this.roleNodes[i].getComponent(RoleDis.RoleDis).AttackInit();
            }
        }
       catch(err)
       {
            console.warn("Queue 下的 Shiftdis 错误:", err);
       }
    }

    async RemoveRole(index:number)
    {
        try
        {
            console.log("RemoveRole role:", role);
            let node = this.roleNodes[index];
            await node.getComponent(RoleDis.RoleDis).Exit();
        }
        catch (err)
        {
            console.warn("Queue 下的 RemoveRole 错误:", err);
        }
    }
}


