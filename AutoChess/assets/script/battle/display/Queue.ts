/*
 * Queue.ts
 * author: Hotaru
 * 2023/10/04
 * 队列展示类
 */
import { _decorator, Component, instantiate, Node, Prefab, resources, tween, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

import * as RoleDis from './RoleDis'
import { BundleManager } from '../../bundle/BundleManager';
import * as role from '../role'
import { Battle } from '../battle';
import { Role } from '../../serverSDK/common';
import { RoleInfo } from '../skill/skill_base';

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
    public roleNodes:Node[] = [null, null, null, null, null, null];

    start() 
    {

    }

    update(deltaTime: number) 
    {
        
    }
/*
 * 修改
 * author：Hotaru
 * 2023/10/31
 * 生成角色
 */
    SpawnRole(r:role.Role):Promise<Node>
    {
        return new Promise (async (resolve)=>
        {
            try 
            {
                let address: string = "Role_";
                //let roleRes=""+address+r[i].id;
                let roleRes = address + "1";
                let newNode = await BundleManager.Instance.loadAssetsFromBundle("Roles", roleRes) as Prefab;
                let role = instantiate(newNode);

                this.node.addChild(role);

                //r.roleNode = role;
                this.roleNodes[r.index] = role;
                console.log("role:", r);

                let roleDis = role.getComponent(RoleDis.RoleDis);
                await roleDis.Refresh(r);
                resolve(role);
            }
            catch (error) 
            {
                console.warn("Queue 下的 SpawnRole 错误", error);
                resolve(null);
            }
        })
    }

/*
 * 添加
 * author：Hotaru
 * 2023/10/31
 * 召唤角色
 */
    async SummonRole(r:role.Role[],spellcaster:RoleInfo)
    {
        try
        {
            for(let i=0;i<r.length;i++)
            {
                let role=await this.SpawnRole(r[i]) as Node;
                if(null==role)
                {
                    console.warn("Queue 下的 SummonRole 读取的 role 为空");
                    break;
                }
                let emptyIndex=-1;
                for(let j=0;j<this.roleNodes.length;j++)
                {
                    if(null==this.roleNodes[j])
                    {
                        emptyIndex=j;
                        break;
                    }
                    else
                    {
                        continue;
                    }
                }
                if(-1!=emptyIndex)
                {
                    let roleNode = this.roleNodes[spellcaster.index];
                    role.position = roleNode.position;
                    await role.getComponent(RoleDis.RoleDis).ShiftPos(this.locationTemp[emptyIndex].position);
                }
                else if(-1==emptyIndex)
                {
                    await role.getComponent(RoleDis.RoleDis).Exit();
                }
            }
        }
        catch(error)
        {
            console.warn("Queue 下的 SummonRole 错误", error);
        }
        
    }
/*
 * 添加
 * author：Hotaru
 * 2023/10/31
 * 战斗开始初始化角色
 */
    async InitRole(r:role.Role[])
    {
        try
        {
            for(let i = 0; i<r.length; i++)
            {
                let role=await this.SpawnRole(r[i]) as Node;
                if(null==role)
                {
                    console.warn("Queue 下的 InitRole 读取的 role 为空");
                    break;
                }
                role.position=new Vec3(this.locationTemp[i].position);
            }
        }
        catch(error)
        {
            console.warn("Queue 下的 InitRole 错误", error);
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
            this.roleNodes[index]=null;

            await node.getComponent(RoleDis.RoleDis).Exit();
        }
        catch (err)
        {
            console.warn("Queue 下的 RemoveRole 错误:", err);
        }
    }
}


