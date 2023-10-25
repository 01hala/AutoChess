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

    public roleList:Node[]=[];

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
            for(let i:number=0;i<6;i++)
            {
                //let roleRes=""+address+r[i].id;
                let roleRes=address+"1";
                // resources.load(roleRes,Prefab,(err,prefab)=>
                //     {
                //         const newNode=instantiate(prefab);
                //         newNode.position=new Vec3(this.queueTemp[i].position.x,this.queueTemp[i].position.y);
                //         this.node.addChild(newNode);
                //         this.roleList.push(newNode);
                //     });
                let newNode = await BundleManager.Instance.loadAssetsFromBundle("Roles", roleRes) as Prefab;
                let role=instantiate(newNode);
                role.position=new Vec3(this.locationTemp[i].position.x,this.locationTemp[i].position.y);
                this.node.addChild(role);
                this.roleList.push(role);

                let roleDis = role.getComponent(RoleDis.RoleDis);
                await roleDis.Refresh(r[i]);
            }
        } 
        catch (error) 
        {
            console.warn(this.res+" 下的 SpawnRole 错误", error);
        }
        
    }

    async Shiftdis(r:role.Role[])
    {
        let n:number[]=[];
        for(let t of r)
        {
            n.push(t.id);
            //console.log("Shiftdis:"+n);
        }
        /*
        let tm=this.roleList;
        for(let i:number=0;i<n.length;i++)//找到需要离场的角色
        {
            for(let j:number=0;j<tm.length;j++)
            {
                if(tm[j].getComponent(RoleDis.RoleDis).RoleId==n[i])
                {
                    tm.splice(j,0);
                    break;
                }
            }      
        }
        if(0!=tm.length)//移除列表里需要离场的角色
        {
            for(let i:number=0;i<tm.length;i++)
            {
                for(let j:number=0;j<this.roleList.length;j++)
                {
                    if(this.roleList[j]==tm[i])
                    {
                        this.roleList.splice(j,0);
                    }
                }
            }
        }
        */
        // let tm=[];
        // for(let i:number=0;i<n.length;i++ )
        // {
        //     for(let j:number=0;j<this.roleList.length;j++)
        //     {
        //         if(this.roleList[j].getComponent(RoleDis.RoleDis).RoleId==n[i])
        //         {
        //             tm.push(this.roleList[j]);
        //             this.roleList[j].position=this.locationTemp[i].position;
        //         }
        //     }
        // }
        // this.roleList=tm;

        for(let i=0;i<this.roleList.length;i++)
        {
            //this.roleList[i].position = this.locationTemp[i].position;
            await this.roleList[i].getComponent(RoleDis.RoleDis).ShiftPos(this.locationTemp[i].position);
            this.roleList[i].getComponent(RoleDis.RoleDis).AttackInit();
        }
    }

    async RemoveRole(index:number)
    {
        try
        {
            await this.roleList[index].getComponent(RoleDis.RoleDis).Exit();
            this.roleList.splice(index,1);
        }
        
        catch (err)
        {
            console.warn(this.res+" 下的 RemoveRole 错误:", err);
        }
    }
}


