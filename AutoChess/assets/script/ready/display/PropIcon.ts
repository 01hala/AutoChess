import { _decorator, Button, Collider2D, Component, Contact2DType, EventTouch, Input, IPhysics2DContact, Node, Sprite, SpriteFrame, Texture2D, tween, Tween, Vec2, Vec3, view } from 'cc';
import { PropsType } from '../../other/enums';
import { RoleArea } from './RoleArea';
import { ShopArea } from './ShopArea';
import * as singleton from '../../netDriver/netSingleton';
import { InfoPanel } from '../../secondaryPanel/InfoPanel';
import { RoleIcon } from './RoleIcon';
import { config } from '../../config/config';
import { BundleManager } from '../../bundle/BundleManager';
import * as common from '../../serverSDK/common';
const { ccclass, property } = _decorator;

@ccclass('PropIcon')
export class PropIcon extends Component 
{
    @property(Node)
    public myTouch: Node;
    //道具类型
    public propType:PropsType;
    //目标位置
    public target:Node;
    private tempTarget:Node=null;
    //道具ID
    public propId:number;
    //道具属性
    public attackBonus:number;
    public hpBonus:number;
    public vaule:number;
    //道具效果
    public effect:number[]=[];
    //目标位置
    public index:number;
    private tempIndex:number;
    //锁存，判断是否购买
    public isBuy:boolean=false;
    public freezeLock:boolean=false;
    //父级面板
    private panel:Node;
    //图标碰撞体
    private collider:Collider2D;
    //拖拽起始位置
    private touchStartPoint: Vec2 = new Vec2(0, 0);
    //各操作区域
    private roleArea:RoleArea;
    private shopArea:ShopArea;
    //初始位置
    public originalPos:Vec3;
    //缓动
    private tweenNode:Tween<Node>;
    //图标
    private iconMask:Node;
    //判定flag
    private isFreeze: boolean;

    protected onLoad(): void 
    {
        this.panel=this.node.parent;
            this.roleArea=this.panel.getChildByPath("RoleArea").getComponent(RoleArea);
            this.shopArea=this.panel.getChildByPath("ShopArea").getComponent(ShopArea);
            this.iconMask=this.node.getChildByName("IconMask");
            //this.iconMask.active=false;
            this.collider=this.node.getComponent(Collider2D);
            
            this.node.on(Button.EventType.CLICK,()=>
            {
                singleton.netSingleton.ready.infoPanel.active=true;
                singleton.netSingleton.ready.infoPanel.getComponent(InfoPanel).Open(this.propId,this.propType);
            });
    }
    //初始化
    async Init(_id:number,_type:PropsType)
    {
        this.originalPos=this.node.getPosition();
        this.propId=_id;
        this.propType=_type;
        let jconfig=null;
        if(_type==PropsType.Food)
        {
            jconfig=config.FoodConfig.get(_id);
            this.effect=jconfig.Effect;
            this.hpBonus=jconfig.HpBonus;
            this.attackBonus=jconfig.AttackBonus;
        }
        this.iconMask.getChildByPath("FoodSprite").getComponent(Sprite).spriteFrame= await this.LoadImg("battle_icon_",_id);
/*----------------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------拖拽事件---------------------------------------------------------*/
/*----------------------------------------------------------------------------------------------------------------*/
        this.myTouch.on(Input.EventType.TOUCH_CANCEL, () => 
        {
            //重新注册按钮事件
            this.node.on(Button.EventType.CLICK,()=>
            {
                singleton.netSingleton.ready.infoPanel.active=true;
                singleton.netSingleton.ready.infoPanel.getComponent(InfoPanel).Open(this.propId,this.propType);
            });
            //隐藏冻结栏
            this.shopArea.ShowFreezeArea(false);
            //还原起始值
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
                singleton.netSingleton.ready.infoPanel.getComponent(InfoPanel).Open(this.propId,this.propType);
            });
            //隐藏冻结栏
            this.shopArea.ShowFreezeArea(false);
            //还原起始值
            this.touchStartPoint = new Vec2(0, 0);
            //使用道具
            if(null != this.index || null != this.target && singleton.netSingleton.ready.ready.GetCoins()>=3)
            {
                if(!this.target.getComponent(RoleIcon).upgradeLock)
                {
                    //console.log('buy food');
                    let value=[this.hpBonus,this.attackBonus];
                    //this.target.getComponent(RoleIcon).upgradeLock=true;
                    if(this.effect.includes(1) || this.effect.includes(2))
                    {
                        //this.target.getComponent(RoleIcon).GetIntensifier(value);
                    }
                    await this.shopArea.BuyProp(this.index,this.node);
                    console.log('道具使用成功！');
                    this.node.destroy();
                    return;
                }
            }
            //冻结道具
            if(this.isFreeze && !this.isBuy)
            {
                console.log("PropFreeze!!!");
                this.freezeLock=!this.freezeLock;
                this.shopArea.FreezeEntity(common.ShopIndex.Prop,this.node, this.freezeLock);
            }
            //吸附缓动
            this.Adsorption();
            
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
            //设置坐标
            node.setPosition(x, y, 0);
        }, this);
//拖拽开始
        this.myTouch.on(Input.EventType.TOUCH_START, (event: EventTouch) => 
        {
            //显示冻结栏
            if(!this.isBuy)
            {
                this.shopArea.ShowFreezeArea(true);
            }
            //触摸到的对象
            let node: Node = event.currentTarget;
            //设置ui坐标
            this.touchStartPoint.set(event.getUILocation());
            let x = this.touchStartPoint.x - view.getVisibleSize().width / 2 - node.getPosition().x;
            let y = this.touchStartPoint.y - view.getVisibleSize().height / 2 - node.getPosition().y;
            this.touchStartPoint = new Vec2(x, y);
        }, this);
/*----------------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------拖拽事件---------------------------------------------------------*/
/*----------------------------------------------------------------------------------------------------------------*/
        this.iconMask.active=true;
    }
/*----------------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------碰撞检测---------------------------------------------------------*/
/*----------------------------------------------------------------------------------------------------------------*/
    start() 
    {
    //出--------------------------------------------------------------------------出------------------------------------------------------------------------------出//
        this.collider.on(Contact2DType.END_CONTACT,(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null)=>
        {
            //场上角色区域
            if(null!=otherCollider && 1 == otherCollider.tag)
            {
                if(this.roleArea.GetTargetValue(otherCollider.node.name)==this.target)
                {
                    this.target=null;
                    this.index=null;
                }
            }
            //冻结区域
            if(null!=otherCollider && 3 == otherCollider.tag)
            {
                this.isFreeze=false;
            }
        },this);
    //进--------------------------------------------------------------------------进------------------------------------------------------------------------------进//
        this.collider.on(Contact2DType.BEGIN_CONTACT, (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null)=>
        {
            //冻结区域
            if(null!=otherCollider && 3 == otherCollider.tag)
            {
                if(!this.isBuy)
                {
                    this.isFreeze=true;
                }
            }
            //场上角色区域
            if(null!=otherCollider && 1 == otherCollider.tag)
            {
                if(null!=this.roleArea.GetTargetValue(otherCollider.node.name))
                { 
                    let num=otherCollider.node.name.slice(otherCollider.node.name.length-1,otherCollider.node.name.length);
                    this.index=Number(num);
                    this.target=this.roleArea.GetTargetValue(otherCollider.node.name);
                    console.log(this.target.name,this.index);
                }
            }
        }, this);
    }
/*----------------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------碰撞检测---------------------------------------------------------*/
/*----------------------------------------------------------------------------------------------------------------*/
    LoadImg(_address:string,_id:number):Promise<SpriteFrame>
    {
        return new Promise(async (resolve)=>
        {
            let imgRes=""+_address+_id;
            let temp=await BundleManager.Instance.LoadImgsFromBundle("Props", imgRes);
            if(null==temp)
            {
                console.warn('propIcon 里的 LoadImg 异常 : bundle中没有此角色图片,替换为默认角色图片');
                imgRes=""+_address+1001;
                temp=await BundleManager.Instance.LoadImgsFromBundle("Props", imgRes);
            }
            let texture=new Texture2D();
            texture.image=temp;
            let sp=new SpriteFrame();
            sp.texture=texture;
            resolve(sp);
        });
    }
    
    update(deltaTime: number) {
        
    }

    Adsorption()
    {
        this.tweenNode=tween(this.node).to(0.1,{position:this.originalPos})
        .call(()=>
         {
             this.tweenNode.stop();
        })
        .start();
    }
}


