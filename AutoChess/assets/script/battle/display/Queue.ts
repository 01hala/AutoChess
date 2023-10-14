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

@ccclass('Queue')
export class Queue extends Component 
{
    private res:string="script/display/Queue.ts"

    @property([Node])
    public locationTemp:Node[]=[];

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
                let newNode = await BundleManager.Instance.loadAssets("Roles", roleRes) as Prefab;
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
}


