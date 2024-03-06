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
import { loadAssets } from '../../bundle/LoadAsset';
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
    //拖拽时间点（做点击事件）
    private lastClickTime:number;
    //各操作区域
    private roleArea:RoleArea;
    private shopArea:ShopArea;
    //初始位置
    public originalPos:Vec3;
    //缓动
    private tweenNode:Tween<Node>;
    //图标
    private iconMask:Node;
    private freezeSprite:Node;
    //判定flag
    private isFreeze: boolean;

    protected onLoad(): void 
    {
        this.panel=this.node.parent;
        this.freezeSprite=this.node.getChildByPath("FreezeSprite");
        this.freezeSprite.active=false;
        this.roleArea=this.panel.getChildByPath("RoleArea").getComponent(RoleArea);
        this.shopArea=this.panel.getChildByPath("ShopArea").getComponent(ShopArea);
        this.iconMask=this.node.getChildByName("IconMask");
        //this.iconMask.active=false;
        this.collider=this.node.getComponent(Collider2D);
        //this.RegBtn(true);
    }

    private checkPropType(propId:number) : PropsType {
        if (propId >= 1001 && propId <= 1999) {
            return PropsType.Food;
        }

        if (propId >= 3001 && propId <= 3999) {
            return PropsType.Equip;
        }

        return PropsType.None;
    }

    //初始化
    async Init(_id:number, _freeze:boolean)
    {
        try
        {
            this.originalPos = this.node.getPosition();
            this.propId = _id;

            
            this.propType = this.checkPropType(this.propId);
            //let jconfig = null;
            // if (_type == PropsType.Food) 
            // {
            //     jconfig = config.FoodConfig.get(_id);
            //     this.effect = jconfig.Effect;
            //     this.hpBonus = jconfig.HpBonus;
            //     this.attackBonus = jconfig.AttackBonus;
            //     //这句从下面移到if里来了，因为还要写装备的逻辑，但是没仔细看不知道会不会出问题，所以写个注释标记一下
            //     this.iconMask.getChildByPath("FoodSprite").getComponent(Sprite).spriteFrame = await this.LoadImg("battle_icon_", _id);
            // }
            // else if(_type == PropsType.Equip)
            // {
            //     jconfig = config.EquipConfig.get(_id);
            //     this.effect = jconfig.Effect;
            //     this.hpBonus = jconfig.HpBonus;
            //     this.attackBonus = jconfig.AttackBonus;
            //     this.vaule=jconfig.value;
            //     //差一个载入图标的逻辑，因为还不清楚装备区域
            //     //this.iconMask.getChildByPath("FoodSprite").getComponent(Sprite).spriteFrame = await this.LoadImg("battle_icon_", _id);
            // }
			await this.LoadOnConfig();

            this.freezeLock = _freeze;
            this.freezeSprite.active = _freeze;

            this.DragEvent();

            this.iconMask.active = true;
        }
        catch(error)
        {
            console.error('PropIcon 下 Init 错误 err: ',error);
        }
        
    }

    private async LoadOnConfig()
    {
        switch(this.propType)
        {
            case PropsType.Food:
                {
                    console.log("LoadOnConfig PropsType.Food this.propId:", this.propId);
                    let jconfig = config.FoodConfig.get(this.propId);
                    this.effect = jconfig.Effect;
                    this.hpBonus = jconfig.HpBonus;
                    this.attackBonus = jconfig.AttackBonus;
                    let img = await loadAssets.LoadImg(jconfig.Res);
                    if(img)
                    {
                        this.iconMask.getChildByPath("FoodSprite").getComponent(Sprite).spriteFrame = img;
                    }
                    
                }
                break;
            case PropsType.Equip:
                {
                    console.log("LoadOnConfig PropsType.Equip this.propId:", this.propId);
                    let jconfig = config.EquipConfig.get(this.propId);
                    this.effect = jconfig.Effect;
                    this.hpBonus = jconfig.HpBonus;
                    this.attackBonus = jconfig.AttackBonus;
                    //this.vaule=jconfig.value;        
                    /*let img = await loadAssets.LoadImg(jconfig.Res);
                    if(img)
                    {
                        //EquipSprite不确定
                        this.iconMask.getChildByPath("EquipSprite").getComponent(Sprite).spriteFrame = img;
                    }*/
                }
        }
    }

/*----------------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------拖拽事件---------------------------------------------------------*/
/*----------------------------------------------------------------------------------------------------------------*/
    private DragEvent()
    {
        try
        {
    //拖拽取消
            this.myTouch.on(Input.EventType.TOUCH_CANCEL, () => 
            {
                //重新注册按钮事件
                // this.node.on(Button.EventType.CLICK,()=>
                // {
                //     console.log("点击查看道具详细信息"+this.propType);
                //     singleton.netSingleton.ready.infoPanel.active=true;
                //     singleton.netSingleton.ready.infoPanel.getComponent(InfoPanel).OpenInfoBoard(this.propId,null,false,this.propType);
                // });
                this.OffTirrger();
                //隐藏冻结栏
                this.shopArea.ShowFreezeArea(false);
                //还原起始值
                this.touchStartPoint = new Vec2(0, 0);
                this.Adsorption();
            }, this);
    //拖拽结束
            this.myTouch.on(Input.EventType.TOUCH_END, async () => 
            {
                if(Date.now()-this.lastClickTime<100){
                    console.log("Players click on prop icon");
                    this.ClickBtn();
                }
                //重新注册按钮事件
                //this.RegBtn(true);
                //隐藏冻结栏
                this.shopArea.ShowFreezeArea(false);
                //还原起始值
                this.touchStartPoint = new Vec2(0, 0);
                console.log("结束道具拖拽，结束拖拽时道具的目标人物："+this.target+"，对应位置下标："+this.index);
                //使用道具
                if(null != this.index && null != this.target && singleton.netSingleton.ready.ready.GetCoins()>=3)
                {
                    try{
                        console.log("成功通过购买道具时的人物、下标和金币检测");
                        if(!this.target.getComponent(RoleIcon).upgradeLock)
                        {
                            console.log("人物不存在锁，购买成功");
                            this.freezeSprite.active=false;
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
                    catch(error){
                        console.error("PropIcon 下的 使用道具 错误",error);
                    }
                    
                }
                //冻结道具
                if(this.isFreeze && !this.isBuy)
                {
                    console.log("PropFreeze!!!");
                    this.freezeLock=!this.freezeLock;
                    this.freezeSprite.active=this.freezeLock;
                    this.shopArea.FreezeEntity(common.ShopIndex.Prop,this.node, this.freezeLock);
                }
                //吸附缓动
                this.Adsorption();
                
            }, this);
    //拖拽中
            this.myTouch.on(Input.EventType.TOUCH_MOVE, (event: EventTouch) => 
            {
                //this.RegBtn(false);
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
                this.lastClickTime=Date.now();
                //显示冻结栏
                if(!this.isBuy)
                {
                    this.shopArea.ShowFreezeArea(true);
                }
                this.Ontirrger();
                //触摸到的对象
                let node: Node = event.currentTarget;
                //设置ui坐标
                this.touchStartPoint.set(event.getUILocation());
                let x = this.touchStartPoint.x - view.getVisibleSize().width / 2 - node.getPosition().x;
                let y = this.touchStartPoint.y - view.getVisibleSize().height / 2 - node.getPosition().y;
                this.touchStartPoint = new Vec2(x, y);
            }, this);
        }
        catch(error)
        {
            console.error('PropIcon 下 DragEvent 错误 err: ',error);
        }
    }
/*----------------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------拖拽事件---------------------------------------------------------*/
/*----------------------------------------------------------------------------------------------------------------*/

    private Adsorption() {
        try {
            this.tweenNode = tween(this.node).to(0.1, { position: this.originalPos })
                .call(() => {
                    this.tweenNode.stop();
                })
                .start();
        }
        catch (error) {
            console.error('PropIcon 下 Adsorption 错误 err: ', error);
        }
    }

    private RegBtn(flag:boolean)
    {
        if(flag)
        {
            //注册按钮事件
            this.node.on(Button.EventType.CLICK,()=>
            {
                console.log("点击食物查看详细信息"+this.propType);
                singleton.netSingleton.ready.infoPanel.active=true;
                singleton.netSingleton.ready.infoPanel.getComponent(InfoPanel).OpenInfoBoard(this.propId,null,false,this.propType);
            });
        }
        else
        {
            //关闭按钮事件
            this.node.off(Button.EventType.CLICK);
        }
    }
    private ClickBtn(){
        singleton.netSingleton.ready.infoPanel.active=true;
        singleton.netSingleton.ready.infoPanel.getComponent(InfoPanel).OpenInfoBoard(this.propId,null,false,this.propType);
    }

/*----------------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------碰撞检测---------------------------------------------------------*/
/*----------------------------------------------------------------------------------------------------------------*/
    private Ontirrger()
    {
        try
        {
    //出--------------------------------------------------------------------------出------------------------------------------------------------------------------出//
            this.collider.on(Contact2DType.END_CONTACT,(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null)=>
            {
                try
                {
                    //场上角色区域
                    if (null != otherCollider && 1 == otherCollider.tag) {
                        if (this.roleArea.GetTargetRole(this.index) == this.target) {
                            this.target = null;
                            this.index = null;
                        }
                    }
                    //冻结区域
                    if (null != otherCollider && 3 == otherCollider.tag) {
                        this.isFreeze = false;
                    }
                }
                catch(error)
                {
                    console.error('PropIcon 下Opentirrger 里的 END_CONTACT 事件错误 err: ',error);
                }
                
            },this);
    //进--------------------------------------------------------------------------进------------------------------------------------------------------------------进//
            this.collider.on(Contact2DType.BEGIN_CONTACT, (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null)=>
            {
                try
                {
                    //冻结区域
                    if (null != otherCollider && 3 == otherCollider.tag) {
                        if (!this.isBuy) {
                            this.isFreeze = true;
                        }
                    }
                    //场上角色区域
                    if (null != otherCollider && 1 == otherCollider.tag) {
                        if (null != this.roleArea.GetTargetValue(otherCollider.node.name)) {
                            let num = otherCollider.node.name.slice(otherCollider.node.name.length - 1, otherCollider.node.name.length);
                            this.index = Number(num);
                            //this.target=this.roleArea.GetTargetRole(this.index);
                            this.target = this.roleArea.GetTargetRole(this.index);
                            console.log("道具碰撞时检索到的碰撞对象信息"+this.target, this.index);
                        }
                    }
                }
                catch(error)
                {
                    console.error('PropIcon 下Opentirrger 里的 BEGIN_CONTACT 事件错误 err: ',error);
                }
            }, this);
        }
        catch(error)
        {
            console.error('PropIcon 下Opentirrger 错误 err: ',error);
        }
    }

    private OffTirrger()
    {
        this.collider.off(Contact2DType.END_CONTACT);
        this.collider.off(Contact2DType.BEGIN_CONTACT);
    }
/*----------------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------碰撞检测---------------------------------------------------------*/
/*----------------------------------------------------------------------------------------------------------------*/
    LoadImg(_address:string,_id:number):Promise<SpriteFrame>
    {
        return new Promise(async (resolve)=>
        {
            try
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
            }
            catch(error)
            {
                console.error('PropIcon 下 LoadImg 错误 err: ',error);
                resolve(null);
            }
            
        });
    }
    
    update(deltaTime: number) {
        
    }

}


