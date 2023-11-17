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
import { Camp, Property } from '../../other/enums';
const { ccclass, property } = _decorator;

@ccclass('RoleIcon')
export class RoleIcon extends Component 
{
    @property(Node)
    public myTouch: Node;
    public target:Node;

    public roleId:number;
    public index:number;
    //public canvas:Node;

    private panel:Node;

    private collider:Collider2D;
    private touchStartPoint: Vec2 = new Vec2(0, 0);

    private roleNode:Node;

    private roleArea:RoleArea;
    private shopArea:ShopArea;

    private rolePrefab:Prefab;

    
    private iconMask:Node;

    public originalPos:Vec3;
    private tweenNode:Tween<Node>;

    public isBuy:boolean=false;
    public isSale:boolean=false;
    private isSwitch:boolean=false;

    private tempTarget:Node=null;
    private t:Node=null;

    protected async onLoad()
    {
       try
       {
            //this.canvas=director.getScene().getChildByPath("Canvas");
            this.panel=this.node.parent;
            this.roleArea=this.panel.getChildByPath("RoleArea").getComponent(RoleArea);
            this.shopArea=this.panel.getChildByPath("ShopArea").getComponent(ShopArea);
            this.iconMask=this.node.getChildByName("IconMask");
            this.iconMask.active=false;
            this.collider=this.node.getComponent(Collider2D);
       }
       catch(error)
       {
            console.error("RoleIconTouch 下的 onLoad 错误",error);
       }
        
    }
    //初始化
    async Init(id:number,hp:number,atk:number)
    {
        let map=new Map<Property,number>().set(Property.HP,hp).set(Property.Attack,atk);
        let r=new role.Role(0,id,1,0,Camp.Self,map);
        this.roleNode=await this.SpawnRole(r);
        this.originalPos=this.node.getPosition();
/*拖拽*/
        //拖拽取消
        this.myTouch.on(Input.EventType.TOUCH_CANCEL, () => 
        {
            this.touchStartPoint = new Vec2(0, 0);
        }, this);
        //拖拽结束
        this.myTouch.on(Input.EventType.TOUCH_END, async () => 
        {
            this.touchStartPoint = new Vec2(0, 0);
            if(this.isSwitch)
            {
                this.roleArea.SwitchPos(this.target,this.t);
                this.target=this.tempTarget;
                this.roleArea.targets.set(this.target.name,this.node);
                this.isSwitch=false;
            }
            if(this.isSale)
            {
                this.roleNode.active=false;
                await this.roleArea.SaleRole(this.node);
                this.roleNode.destroy();
                this.node.destroy();
            }
            //吸附缓动
            this.Adsorption();
            
        }, this);
        //拖拽中
        this.myTouch.on(Input.EventType.TOUCH_MOVE, (event: EventTouch) => 
        {
            let node: Node = event.currentTarget;
            let pos = new Vec2();
            let shit = pos.set(event.getUILocation());
            let x = shit.x - view.getVisibleSize().width / 2 - this.touchStartPoint.x;
            let y = shit.y - view.getVisibleSize().height / 2 - this.touchStartPoint.y;
            node.setPosition(x, y, 0);
        }, this);
        //拖拽开始
        this.myTouch.on(Input.EventType.TOUCH_START, (event: EventTouch) => 
        {
            let node: Node = event.currentTarget;

            this.touchStartPoint.set(event.getUILocation());

            let x = this.touchStartPoint.x - view.getVisibleSize().width / 2 - node.getPosition().x;
            let y = this.touchStartPoint.y - view.getVisibleSize().height / 2 - node.getPosition().y;

            this.touchStartPoint = new Vec2(x, y);
            this.roleNode.active=true;
            this.iconMask.active=false;
        }, this);
/*拖拽*/

        this.iconMask.active=true;
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
            role.setParent(this.node);
            let roleDis = role.getComponent(RoleDis);
            roleDis.Refresh(r);
            role.active=false;
            resolve(role);
        });
    }

    start() 
    {
        this.collider.on(Contact2DType.END_CONTACT,(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null)=>
            {
                if(null!=otherCollider && 1 == otherCollider.tag)
                {
                    //console.log(otherCollider.name);
                    for(let i=0;i<this.roleArea.targets.size;i++)
                    {
                        if(this.roleArea.GetTargetValue(otherCollider.node.name)==selfCollider.node)
                        {
                            //console.log("set null");
                            this.roleArea.targets.set(otherCollider.node.name,null);
                            //console.log(otherCollider.node.name,this.roleArea.targets.get(otherCollider.node.name));
                            return;
                        }
                    }
                }
                if(null!=otherCollider && 2 == otherCollider.tag)
                {
                    if(this.isBuy)
                    {
                        this.isSale=false;
                    }
                }
            },this);

            this.collider.on(Contact2DType.BEGIN_CONTACT, (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null)=>
            {
                if(null!=otherCollider && 1 == otherCollider.tag)
                {
                    if(null==this.roleArea.GetTargetValue(otherCollider.node.name))
                    { 
                        let num=otherCollider.node.name.slice(otherCollider.node.name.length-1,otherCollider.node.name.length);
                        this.index=Number(num);
                        console.log(this.index);
                        this.target=otherCollider.node;
                        this.roleArea.targets.set(otherCollider.node.name,selfCollider.node);
                        this.isSwitch=false;
                    }
                    else if(this.isBuy)
                    {
                        this.tempTarget=otherCollider.node;
                        this.t=this.roleArea.GetTargetValue(otherCollider.node.name);
                        this.isSwitch=true;
                     }
                }  
                if(null!=otherCollider && 2 == otherCollider.tag)
                {
                    if(this.isBuy)
                    {
                        this.isSale=true;
                    }
                    
                }
            }, this);
  
    }

    update(deltaTime: number) 
    {

    }

    //拖拽吸附
    Adsorption()
    {
        if(null!=this.target && !this.isSale)
        {
            if(!this.isBuy)
            {
                this.isBuy=true;
                this.shopArea.BuyRole();
            }
            this.roleArea.rolesNode.push(this.roleNode);
            this.tweenNode=tween(this.node).to(0.1,{worldPosition:this.target.worldPosition})
             .call(()=>
             {
                this.originalPos=this.node.getPosition();
                this.tweenNode.stop();
             })
             .start();
            //this.node.setWorldPosition(this.target.worldPosition);
        }
        else
        {
            this.tweenNode=tween(this.node).to(0.1,{position:this.originalPos})
            .call(()=>
            {
                this.tweenNode.stop();
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
    //互相换位
    TransPos(Vec3:Vec3)
    {
        this.tweenNode=tween(this.node).to(0.1,{worldPosition:Vec3})
        .call(()=>
        {
            //this.originalPos=this.node.getPosition();
            this.tweenNode.stop();
        })
        .start();
        //this.node.setWorldPosition(Vec3);
        console.log("tarnspos!");
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


