/*
 * RoleIcon.ts
 * author: Hotaru
 * 2023/11/09
 * 图标拖拽类
 */

import { _decorator, Asset, Button, Collider, Collider2D, Component, Contact2DType, director, EventTouch, ImageAsset, Input, instantiate, IPhysics2DContact, ITriggerEvent, Layers, Mask, Node, Prefab, rect, Sprite, SpriteAtlas, SpriteFrame, Texture2D, tween, Tween, UITransform, Vec2, Vec3, view } from 'cc';
import { RoleArea } from './RoleArea';
import { BundleManager } from '../../bundle/BundleManager';
import { sleep } from '../../other/sleep';
import * as role from '../../battle/role'
import * as common from '../../serverSDK/common';
import { RoleDis } from '../../battle/display/RoleDis';
import { ReadyDis } from './ReadyDis';
import * as singleton from '../../netDriver/netSingleton';
import { ShopArea } from './ShopArea';
import { Camp, Property } from '../../other/enums';
import { InfoPanel } from '../../secondaryPanel/InfoPanel';
const { ccclass, property } = _decorator;

@ccclass('RoleIcon')
export class RoleIcon extends Component 
{
    @property(Node)
    public myTouch: Node;
    //目标站位
    public target:Node;
    //角色信息
    public roleId:number;
    public index:number;

    private tempIndex:number;
    //父级面板
    private panel:Node;
    //图标碰撞体
    private collider:Collider2D;
    //拖拽起始位置
    private touchStartPoint: Vec2 = new Vec2(0, 0);
    //角色实体
    public roleNode:Node;
    //各操作区域
    private roleArea:RoleArea;
    private shopArea:ShopArea;

    private rolePrefab:Prefab;

    
    public iconMask:Node;

    public originalPos:Vec3;
    private tweenNode:Tween<Node>;

    public isBuy:boolean=false;
    public isSale:boolean=false;
    private isSwitch:boolean=false;
    private isMerge:boolean=false;

    private tempTarget:Node=null;
    private t:Node=null;
    //锁存，防止使用食物过快,导致bug
    public upgradeLock:boolean=false;

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

            this.node.on(Button.EventType.CLICK,()=>
            {
                singleton.netSingleton.ready.infoPanel.active=true;
                singleton.netSingleton.ready.infoPanel.getComponent(InfoPanel).Open(this.roleId);
            });
       }
       catch(error)
       {
            console.error("RoleIconTouch 下的 onLoad 错误",error);
       }
        
    }
    //初始化
    async Init(id:number,hp:number,atk:number,teamindex:number=-1)
    {
        try
        {
            let map=new Map<Property,number>().set(Property.HP,hp).set(Property.Attack,atk);
            console.log("new role");
            let r=new role.Role(teamindex,id,id-100000,1,1,Camp.Self,map);
            console.log('RoleIcon spawn role: ',id);
            this.roleNode=await this.SpawnRole(r);
            this.originalPos=this.node.getPosition();
            this.roleId=id;
            
            this.iconMask.getChildByPath("RoleSprite").getComponent(Sprite).spriteFrame= await this.LoadImg("Role_",id);
/*----------------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------拖拽事件---------------------------------------------------------*/
/*----------------------------------------------------------------------------------------------------------------*/
            this.myTouch.on(Input.EventType.TOUCH_CANCEL, () => 
            {
                //重新注册按钮事件
                this.node.on(Button.EventType.CLICK,()=>
                {
                    singleton.netSingleton.ready.infoPanel.active=true;
                    singleton.netSingleton.ready.infoPanel.getComponent(InfoPanel).Open(this.roleId);
                });
                this.touchStartPoint = new Vec2(0, 0);
                this.Adsorption();
            }, this);
        //拖拽结束↓ 拖拽取消↑
            this.myTouch.on(Input.EventType.TOUCH_END, async () => 
            {
                //重新注册按钮事件
                this.node.on(Button.EventType.CLICK,()=>
                {
                    singleton.netSingleton.ready.infoPanel.active=true;
                    singleton.netSingleton.ready.infoPanel.getComponent(InfoPanel).Open(this.roleId);
                });
                //还原起始值
                this.touchStartPoint = new Vec2(0, 0);
                //是否出售
                if(!this.isSale)
                {
                    if(null!=this.index && !this.upgradeLock)
                    {
                        await this.roleArea.MovePos(this.index,this.tempIndex);
                    }
                    this.index=this.tempIndex;
                }
                else
                {
                    this.roleNode.active=false;
                    await this.roleArea.SaleRole(this.index);
                    this.roleNode.destroy();
                    this.node.destroy();
                    return;
                }
                if(null != this.index && !this.upgradeLock)
                {
                    if(!this.isBuy && singleton.netSingleton.ready.ready.GetCoins()>=3)
                    {
                        this.isBuy=true;
                        await this.shopArea.BuyRole(this.index, this.node);
                        if(null==this.target)
                        {
                            this.roleNode.destroy();
                            this.node.destroy();
                            return;
                        }
                    }
                }
                console.log(this.isMerge);
                //换位
                if(this.isSwitch && !this.isSale)//是否交换位置
                {
                    if(!this.isMerge)
                    {
                        this.roleArea.SwitchPos(this.index,this.target,this.t);
                        this.target=this.tempTarget;
                        this.roleArea.targets.set(this.target.name,this.node);
                        this.isSwitch=false;
                    }
                }
                //吸附缓动
                if(!this.isMerge)
                {
                    this.Adsorption();
                }
                
                
            }, this);
    //拖拽中
            this.myTouch.on(Input.EventType.TOUCH_MOVE, (event: EventTouch) => 
            {
                //关闭按钮事件
                this.node.off(Button.EventType.CLICK);
                //计算位移坐标
                let node: Node = event.currentTarget;
                let pos = new Vec2();
                let shit = pos.set(event.getUILocation());
                let x = shit.x - view.getVisibleSize().width / 2 - this.touchStartPoint.x;
                let y = shit.y - view.getVisibleSize().height / 2 - this.touchStartPoint.y;
                //隐藏图标并显示角色实体
                this.roleNode.active=true;
                this.iconMask.active=false;
                //设置坐标
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
            }, this);
/*----------------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------拖拽事件---------------------------------------------------------*/
/*----------------------------------------------------------------------------------------------------------------*/
            if(!this.isBuy)
            {
                this.iconMask.active=true;
            }
            
        }
        catch (error)
        {
            console.error('RoleIcon 下 Ini 错误 err: ',error);
        }
        
    }

    SpawnRole(r:role.Role):Promise<Node>
    {
        return new Promise (async (resolve)=>
        {
            //console.log("spawn role:",r.id);
            let address: string = "Role_";
            let roleRes=""+address+r.id;
            //let roleRes = address + "100001";
            let newNode=null;
            newNode = await BundleManager.Instance.loadAssetsFromBundle("Roles", roleRes) as Prefab;
            if(null==newNode)
            {
                console.warn('RoleIcon 里的 SpawnRole 异常 : bundle中没有此角色,替换为默认角色');
                roleRes = address + "100001";
                newNode = await BundleManager.Instance.loadAssetsFromBundle("Roles", roleRes) as Prefab;
            }

            let role = instantiate(newNode);
            role.setParent(this.node);
            let roleDis = role.getComponent(RoleDis);
            roleDis.Refresh(r);
            if(!this.isBuy)
            {
                role.active=false;
            }
            
            resolve(role);
        });
    }

    LoadImg(_address:string,_id:number):Promise<SpriteFrame>
    {
        return new Promise(async (resolve)=>
        {
            let imgRes=""+_address+_id;
            let temp=await BundleManager.Instance.LoadImgsFromBundle("Avatar", imgRes);
            if(null==temp)
            {
                console.warn('RoleIcon 里的 LoadImg 异常 : bundle中没有此角色图片,替换为默认角色图片');
                imgRes=""+_address+100001;
                temp=await BundleManager.Instance.LoadImgsFromBundle("Avatar", imgRes);
            }
            let texture=new Texture2D();
            texture.image=temp;
            let sp=new SpriteFrame();
            sp.texture=texture;
            resolve(sp);
        });
    }

    start() 
    {
        this.collider.on(Contact2DType.END_CONTACT,(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null)=>
            {
                if(null!=otherCollider && 1 == otherCollider.tag)
                {
                    //console.log(otherCollider.name);
                    
                        if(this.roleArea.GetTargetValue(otherCollider.node.name)==selfCollider.node)
                        {
                            //console.log("set null");
                            if(!this.isMerge)
                            {
                                this.roleArea.targets.set(otherCollider.node.name,null);
                            }
                            //this.isMerge=false;
                            //console.log(otherCollider.node.name,this.roleArea.targets.get(otherCollider.node.name));
                        }
                        if (this.roleArea.GetTargetValue(otherCollider.node.name)) 
                        {
                            let o=this.roleArea.GetTargetValue(otherCollider.node.name).getComponent(RoleIcon).roleId;
                            if(this.roleId==o)
                            {
                                this.isMerge=false;
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
                if(null!=otherCollider && 2 == otherCollider.tag)
                {
                    this.index=null;
                    this.tempIndex=null;
                    if(this.isBuy)
                    {
                        this.isSale=true;
                        this.isSwitch=false;
                        this.isMerge=false;
                    }
                }
                if(null!=otherCollider && 1 == otherCollider.tag)
                {
                    if(null==this.roleArea.GetTargetValue(otherCollider.node.name))
                    { 
                        let num=otherCollider.node.name.slice(otherCollider.node.name.length-1,otherCollider.node.name.length);
                        this.tempIndex=Number(num);
                        this.target=otherCollider.node;
                        this.roleArea.targets.set(otherCollider.node.name,selfCollider.node);
                        this.isSwitch=false;
                    }
                    else if(this.isBuy) //检测换位或者合并
                    {
                        this.tempTarget=otherCollider.node;
                        let num=otherCollider.node.name.slice(otherCollider.node.name.length-1,otherCollider.node.name.length);
                        this.tempIndex=Number(num);
                        this.t=this.roleArea.GetTargetValue(otherCollider.node.name);
                        console.log(this.t.getComponent(RoleIcon).roleId,this.roleId)
                        if(this.t.getComponent(RoleIcon).roleId==this.roleId)
                        {
                            this.isMerge=true;
                        }
                        console.log(this.isMerge);
                        this.isSwitch=true;
                    }
                    else
                    {
                        this.target=null;
                        let num=otherCollider.node.name.slice(otherCollider.node.name.length-1,otherCollider.node.name.length);
                        this.tempIndex=Number(num);
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
        if(null!=this.target && !this.isSale && null!=this.index)
        {
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
    //合并、升级
    async GetUpgrade(t:common.Role,is_update:boolean)
    {
        let value =[t.HP-this.roleNode.getComponent(RoleDis).Hp,t.Attack-this.roleNode.getComponent(RoleDis).AtkNum];

        let map=new Map<Property,number>().set(Property.HP,t.HP).set(Property.Attack,t.Attack);
        let r=new role.Role(this.index,this.roleId,this.roleId-100000,t.Level,t.Number,Camp.Self,map);
        this.roleNode.getComponent(RoleDis).Refresh(r);
        await this.roleNode.getComponent(RoleDis).Intensifier(value,t.Number);
        if(is_update)
        {
            this.roleNode.getComponent(RoleDis).LevelUp(t.Level);
        }
        this.upgradeLock=false;
    }

    // async GetIntensifier(value :number[])
    // {
    //     if(this.upgradeLock)
    //     {
    //         let hp=this.roleNode.getComponent(RoleDis).Hp+value[0];
    //         let atk=this.roleNode.getComponent(RoleDis).AtkNum+value[1];
    //         let exp=this.roleNode.getComponent(RoleDis).Exp;
    //         let level=this.roleNode.getComponent(RoleDis).Level;
    //         let map=new Map<Property,number>().set(Property.HP,hp).set(Property.Attack,atk);
    //         let r=new role.Role(this.index,this.roleId,100000-this.roleId,level,exp,Camp.Self,map);
    //         this.roleNode.getComponent(RoleDis).Refresh(r);
    //         await this.roleNode.getComponent(RoleDis).Intensifier(value,t.Number);
    //     }
    //     this.upgradeLock=false;
    // }

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


