import { _decorator, Component, director, EventTouch, Input, instantiate, Node, Prefab, rect, tween, Tween, UITransform, Vec2, Vec3, view } from 'cc';
import { RoleArea } from './RoleArea';
import { BundleManager } from '../bundle/BundleManager';
import { sleep } from '../other/sleep';
const { ccclass, property } = _decorator;

@ccclass('RoleIconTouch')
export class RoleIconTouch extends Component 
{
    @property(Node)
    public myTouch: Node;
    private touchStartPoint: Vec2 = new Vec2(0, 0);

    public parent:Node;
    public id:number;

    private roleArea:RoleArea;
    private rolePrefab:Prefab;
    private roleNode:Node;

    private originalPos:Vec3;
    private tweenNode:Tween<Node>;

    private isBuy:boolean=false;

    protected onLoad()
    {
       try
       {
            this.LoadPrefab();
            this.roleArea=director.getScene().getChildByPath("Canvas/ReadyPanel/RoleArea").getComponent(RoleArea);
            this.parent=director.getScene().getChildByPath("Canvas/ReadyPanel");
            this.originalPos=this.node.getPosition();
       }
       catch(error)
       {
            console.error("RoleIconTouch 下的 onLoad 错误",error);
       }
        
    }

    start() 
    {
        

        this.myTouch.on(Input.EventType.TOUCH_CANCEL, () => 
        {
            
            this.touchStartPoint = new Vec2(0, 0);
        }, this)
        this.myTouch.on(Input.EventType.TOUCH_END, () => 
        {
            this.touchStartPoint = new Vec2(0, 0);
            this.Adsorption();
            //console.log(this.roleNode.parent);
            //this.roleNode.destroy();

        }, this)
        this.myTouch.on(Input.EventType.TOUCH_MOVE, (event: EventTouch) => 
        {

            let node: Node = event.currentTarget;
            let pos = new Vec2();
            let shit = pos.set(event.getUILocation());
            let x = shit.x - view.getVisibleSize().width / 2 - this.touchStartPoint.x;
            let y = shit.y - view.getVisibleSize().height / 2 - this.touchStartPoint.y;
            node.setPosition(x, y, 0);
            this.roleNode.setPosition(this.GetUiPos(node));

        }, this)
        this.myTouch.on(Input.EventType.TOUCH_START, (event: EventTouch) => 
        {

            let node: Node = event.currentTarget;
            this.touchStartPoint.set(event.getUILocation());
            let x = this.touchStartPoint.x - view.getVisibleSize().width / 2 - node.getPosition().x;
            let y = this.touchStartPoint.y - view.getVisibleSize().height / 2 - node.getPosition().y;
            
            this.touchStartPoint = new Vec2(x, y);
            this.roleNode.active=true;
            this.roleNode.setPosition(this.GetUiPos(node));
            
            
        }, this)
    }

    update(deltaTime: number) 
    {

    }

    async LoadPrefab()
    {
        let address: string = "Role_";
        //let roleRes=""+address+r[i].id;
        let roleRes = address + "1";
        this.rolePrefab=await BundleManager.Instance.loadAssetsFromBundle("Roles", roleRes) as Prefab;
        this.roleNode=instantiate(this.rolePrefab);
        this.roleNode.setParent(this.parent);
        this.roleNode.active=false;
    }


    Adsorption()
    {
        let distance;
        let minDistance;

        let targetNode=this.roleArea.targets[0];
        console.log(targetNode.position);
        let targetPos=this.GetUiPos(targetNode);
        let selfPos=this.GetUiPos(this.node);

        //console.log(targetPos);

        distance=(targetPos.x-selfPos.x)*(targetPos.x-selfPos.x)+(targetPos.y-selfPos.y)*(targetPos.y-selfPos.y);
        minDistance=Math.sqrt(distance);

        for(let i=1;i<this.roleArea.targets.length;i++)
        {
            targetPos=this.GetUiPos(this.roleArea.targets[i]);
            //selfPos=this.node.getComponent(UITransform).convertToNodeSpaceAR(this.node.getWorldPosition());
            distance=(targetPos.x-selfPos.x)*(targetPos.x-selfPos.x)+(targetPos.y-selfPos.y)*(targetPos.y-selfPos.y);
            distance=Math.sqrt(distance);
            if(distance<minDistance)
            {
                minDistance=distance;
                targetNode=this.roleArea.targets[i];
                //console.log(i);
            }
        }

        targetPos=this.GetUiPos(targetNode);

        let r=rect(targetPos.x-targetNode.getComponent(UITransform).contentSize.x/2,targetPos.y-targetNode.getComponent(UITransform).contentSize.y/2,
                    targetNode.getComponent(UITransform).contentSize.x,targetNode.getComponent(UITransform).contentSize.y);

        //console.log(r);
        
        if(r.contains(new Vec2(selfPos.x,selfPos.y)))
        {
            //this.node.setParent(this.parent);
            this.node.setPosition(targetPos);
            this.roleNode.setPosition(targetPos);
            this.originalPos=this.node.getPosition();
            this.isBuy=true;
        }
        else 
        {
            console.log("back");
            this.node.setPosition(this.originalPos);
            console.log(this.node.position,this.originalPos);
            if(!this.isBuy)
            {
                this.roleNode.active=false;
            }
           
        }
        // this.tweenNode=tween(this.node).to(0.5,{position:minDistance})
        // .call(()=>
        // {
            
        // })
        // .start();
    }

    GetUiPos(node:Node):Vec3
    {
        try
        {
            let pos=this.parent.getComponent(UITransform).convertToNodeSpaceAR(node.getWorldPosition());
            return pos;
        }
        catch(error)
        {
            console.error("RoleIconTouch 下的 GetUiPos 错误",error);
        }
        
    }
}


