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

    Repair()
    {
        if(null==this.roleList[0])
        {
            if(null!=this.roleList[3])//优先后排补位
            {
                this.roleList[0]=this.roleList[3];
                if(null!=this.roleList[5])//补位后先右边往中间移
                {
                    this.roleList[3]=this.roleList[5];
                    this.roleList[5]=null;
                }
                else if(null!=this.roleList[4])//右边没有就移左边
                {
                    this.roleList[3]=this.roleList[4];
                    this.roleList[4]=null;
                } 
            }
            else if(null!=this.roleList[2])//如果后排无人
            {
                this.roleList[0]=this.roleList[2];
                this.roleList[2]=null
            }
            else
            {
                this.roleList[0]=this.roleList[1];
                this.roleList[1]=null
            }
        }
    }
}


