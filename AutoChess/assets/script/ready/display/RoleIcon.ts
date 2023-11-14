/*
 * RoleIcon.ts
 * author: Hotaru
 * 2023/11/09
 * 图标拖拽类
 */

import { _decorator, Collider, Collider2D, Component, Contact2DType, director, EventTouch, Input, instantiate, IPhysics2DContact, ITriggerEvent, Layers, Node, Prefab, rect, tween, Tween, UITransform, Vec2, Vec3, view } from 'cc';
import { RoleArea } from './RoleArea';
import { BundleManager } from '../../bundle/BundleManager';
import { sleep } from '../../other/sleep';
import * as role from '../../battle/role'
import { RoleDis } from '../../battle/display/RoleDis';
import { ReadyDis } from './ReadyDis';
import * as singleton from '../../netDriver/netSingleton';
import { ShopArea } from './ShopArea';
const { ccclass, property } = _decorator;

@ccclass('RoleIcon')
export class RoleIcon extends Component 
{
    @property(Node)
    public myTouch: Node;
    public target:Node;

    public roleId:number;
    public Index:number;
    //public canvas:Node;

    private panel:Node;

    private collider:Collider2D;
    private touchStartPoint: Vec2 = new Vec2(0, 0);

    private roleNode:Node;

    private roleArea:RoleArea;
    private shopArea:ShopArea;

    private rolePrefab:Prefab;

    
    private iconMask:Node;

    private originalPos:Vec3;
    private tweenNode:Tween<Node>;

    public isBuy:boolean=false;

    protected async onLoad()
    {
       try
       {
            //this.canvas=director.getScene().getChildByPath("Canvas");
            this.panel=this.node.parent;
            this.roleArea=this.panel.getChildByPath("RoleArea").getComponent(RoleArea);
            this.shopArea=this.panel.getChildByPath("ShopArea").getComponent(ShopArea);
            this.originalPos=this.node.getPosition();
            this.iconMask=this.node.getChildByName("IconMask");
            this.collider=this.node.getComponent(Collider2D);
       }
       catch(error)
       {
            console.error("RoleIconTouch 下的 onLoad 错误",error);
       }
        
    }

    async start() 
    {
        //this.roleNode=this.SpawnRole()
        await this.LoadPrefab();

        this.collider.on(Contact2DType.BEGIN_CONTACT, (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null)=>
        {
            if(null!=otherCollider && 1 == otherCollider.tag)
            {
                for(let i=0;i<this.roleArea.targets.size;i++)
                {
                    if(null==this.roleArea.GetTargetValue(otherCollider.node.name))
                    {
                        
                        let num=otherCollider.node.name.slice(otherCollider.node.name.length-1,otherCollider.node.name.length);
                        this.Index=Number(num);
                        //console.log(this.Index);
                        this.target=otherCollider.node;
                        this.roleArea.targets.set(otherCollider.node.name,selfCollider.node.name);
                        //console.log(otherCollider.node.name,this.roleArea.targets.get(otherCollider.node.name));
                        return;
                    }
                }
            }  
            if(null!=otherCollider && 2 == otherCollider.tag)
            {
                //this.SellRole();
            }
        }, this);

        this.collider.on(Contact2DType.END_CONTACT,(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null)=>
        {
            if(null!=otherCollider && 1 == otherCollider.tag)
            {
                for(let i=0;i<this.roleArea.targets.size;i++)
                {
                    if(this.roleArea.GetTargetValue(otherCollider.node.name)===selfCollider.node.name)
                    {
                        this.roleArea.targets.set(otherCollider.node.name,null);
                        //console.log(otherCollider.node.name,this.roleArea.targets.get(otherCollider.node.name));
                        return;
                    }
                }
            }


        },this)

        this.myTouch.on(Input.EventType.TOUCH_CANCEL, () => 
        {
            
            this.touchStartPoint = new Vec2(0, 0);
        }, this)
        this.myTouch.on(Input.EventType.TOUCH_END, () => 
        {
            this.touchStartPoint = new Vec2(0, 0);
            this.Adsorption();
            if(this.isBuy)
            {
                this.shopArea.BuyRole();
            }

        }, this)
        this.myTouch.on(Input.EventType.TOUCH_MOVE, (event: EventTouch) => 
        {

            let node: Node = event.currentTarget;
            
            let pos = new Vec2();
            let shit = pos.set(event.getUILocation());
            let x = shit.x - view.getVisibleSize().width / 2 - this.touchStartPoint.x;
            let y = shit.y - view.getVisibleSize().height / 2 - this.touchStartPoint.y;

            node.setPosition(x, y, 0);

        }, this)
        this.myTouch.on(Input.EventType.TOUCH_START, (event: EventTouch) => 
        {

            let node: Node = event.currentTarget;

            this.touchStartPoint.set(event.getUILocation());

            let x = this.touchStartPoint.x - view.getVisibleSize().width / 2 - node.getPosition().x;
            let y = this.touchStartPoint.y - view.getVisibleSize().height / 2 - node.getPosition().y;
            
            this.touchStartPoint = new Vec2(x, y);

            this.roleNode.active=true;
            this.iconMask.active=false;

        }, this)
    }

    update(deltaTime: number) 
    {

    }

    SpawnRole(r:role.Role):Promise<Node>
    {
        return new Promise (async (resolve)=>
        {
            let address: string = "Role_";
            //let roleRes=""+address+r[i].id;
            let roleRes = address + "1";
            let newNode = await BundleManager.Instance.loadAssetsFromBundle("Roles", roleRes) as Prefab;

            let role = instantiate(newNode);
            let roleDis = role.getComponent(RoleDis);
            await roleDis.Refresh(r);
            resolve(role);
        });
    }
    

    async LoadPrefab()
    {
        let address: string = "Role_";
        //let roleRes=""+address+r[i].id;
        let roleRes = address + "1";
        this.rolePrefab=await BundleManager.Instance.loadAssetsFromBundle("Roles", roleRes) as Prefab;
        this.roleNode=instantiate(this.rolePrefab);
        this.roleNode.setParent(this.node);
        this.roleNode.active=false;
    }

    SetProperty(hp:number,atk:number)
    {
        this.roleNode.getComponent(RoleDis).HP=hp;
        this.roleNode.getComponent(RoleDis).ATK=atk;
    }

    Adsorption()
    {
        if(null!=this.target)
        {

            this.tweenNode=tween(this.node).to(0.1,{worldPosition:this.target.worldPosition})
             .call(()=>
             {
            
             })
             .start();
            //this.node.setWorldPosition(this.target.worldPosition);
            this.isBuy=true;
            this.roleArea.roles.push(this.roleNode);
        }
        else
        {
            this.tweenNode=tween(this.node).to(0.1,{position:this.originalPos})
            .call(()=>
            {
           
            })
            .start();
            //this.node.setPosition(this.originalPos);
            if(!this.isBuy)
            {
                this.roleNode.active=false;
                this.iconMask.active=true;
            }
        }
        
    }

    // GetUiPos(node:Node):Vec3
    // {
    //     try
    //     {
    //         let pos=this.canvas.getComponent(UITransform).convertToNodeSpaceAR(node.getWorldPosition());
    //         return pos;
    //     }
    //     catch(error)
    //     {
    //         console.error("RoleIconTouch 下的 GetUiPos 错误",error);
    //     }
        
    // }
}


