/*
 * Queue.ts
 * author: Hotaru
 * 2023/10/04
 * 队列展示类
 */
import { _decorator, Component, instantiate, Node, Prefab, resources, Vec2, Vec3 } from 'cc';
import { BundleManager } from '../../bundle/BundleManager';
const { ccclass, property } = _decorator;

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

    PutRole(ID:number[])
    {
        try 
        {
            let address:string="Roles/role_";
            for(let i:number=0;i<6;i++)
            {
                let roleRes=""+address+ID[i];
                // resources.load(roleRes,Prefab,(err,prefab)=>
                //     {
                //         const newNode=instantiate(prefab);
                //         newNode.position=new Vec3(this.queueTemp[i].position.x,this.queueTemp[i].position.y);
                //         this.node.addChild(newNode);
                //         this.roleList.push(newNode);
                //     });
                let newNode=BundleManager.Instance.loadAssets("",roleRes);
                let role=instantiate(newNode);
                role.position=new Vec3(this.locationTemp[i].position.x,this.locationTemp[i].position.y);
                this.node.addChild(role);
                this.roleList.push(role);
            }
        } 
        catch (error) 
        {
            console.warn(this.res+" 下的 PutRole 错误");
        }
        
    }
}


