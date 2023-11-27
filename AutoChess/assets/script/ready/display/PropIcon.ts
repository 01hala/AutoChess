import { _decorator, Button, Collider2D, Component, Contact2DType, EventTouch, Input, IPhysics2DContact, Node, tween, Tween, Vec2, Vec3, view } from 'cc';
import { PropsType } from '../../other/enums';
import { RoleArea } from './RoleArea';
import { ShopArea } from './ShopArea';
import * as singleton from '../../netDriver/netSingleton';
import { InfoPanel } from '../../secondaryPanel/InfoPanel';
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
    public index:number;

    private tempIndex:number;
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

    private iconMask:Node;

    public isBuy:boolean=false;

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

    async Init()
    {
        // let map=new Map<Property,number>().set(Property.HP,hp).set(Property.Attack,atk);
        // let r=new role.Role(0,id,1,0,Camp.Self,map);
        // this.roleNode=await this.SpawnRole(r);
        this.originalPos=this.node.getPosition();
        // this.roleId=id;
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
            //还原起始值
            this.touchStartPoint = new Vec2(0, 0);
            if(null != this.target)
            {
                console.log('buy food');
                /*
                 *此处购买道具
                 */
                this.shopArea.BuyProp(this.index,this.node);
                console.log('道具使用成功！');
                this.node.destroy();
                return;
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
            let node: Node = event.currentTarget;

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

    start() 
    {
        this.collider.on(Contact2DType.END_CONTACT,(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null)=>
        {
            if(null!=otherCollider && 1 == otherCollider.tag)
            {
                this.target=null;
                this.index=null;
            }
        },this);

        this.collider.on(Contact2DType.BEGIN_CONTACT, (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null)=>
        {
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


