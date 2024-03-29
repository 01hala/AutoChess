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
import { config } from '../../config/config';
import { loadAssets } from '../../bundle/LoadAsset';
import { TipsManager } from '../../tips/TipsManager';
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
    //父级面板
    private panel:Node;
    //图标碰撞体
    private collider:Collider2D;
    //拖拽起始位置
    private touchStartPoint: Vec2 = new Vec2(0, 0);
    //拖拽时间点（做点击事件）
    private lastClickTime:number;
    //角色实体
    public roleNode:Node;
    //各操作区域
    private roleArea:RoleArea;
    private shopArea:ShopArea;
    //图标
    public iconMask:Node;
    private freezeSprite:Node;
    //初始位置
    public originalPos:Vec3;
    private tweenNode:Tween<Node>;
    //判定flag
    public isBuy:boolean=false;
    public isSale:boolean=false;
    private isSwitch:boolean=false;
    private isMerge:boolean=false;
    private isFreeze:boolean=false;
    //临时变量
    private tempIndex:number;
    private tempTarget:Node=null;
    private tempMergeRole:Node=null;
    //锁存，防止使用食物过快,导致bug
    public upgradeLock:boolean=false;
    public freezeLock:boolean=false;

    protected async onLoad()
    {
       try
       {
            this.panel=this.node.parent;
            this.freezeSprite=this.node.getChildByPath("FreezeSprite");
            this.freezeSprite.active=false;
            this.roleArea=this.panel.getChildByPath("RoleArea").getComponent(RoleArea);
            this.shopArea=this.panel.getChildByPath("ShopArea").getComponent(ShopArea);
            this.iconMask=this.node.getChildByName("IconMask");
            this.iconMask.active=false;
            this.collider=this.node.getComponent(Collider2D);
            //this.RegBtn(true);

       }
       catch(error)
       {
            console.error("RoleIconTouch 下的 onLoad 错误",error);
       }
    }

    start() 
    {
    
    }

    //初始化
    async Init(_Id:number , _Hp:number , _Atk:number , _level:number , _stack:number , _freeze:boolean, _fetters:common.Fetters=null , _teamindex:number=-1)
    {
        try
        {
            let map=new Map<Property,number>().set(Property.HP,_Hp).set(Property.Attack,_Atk);
            console.log("new role");
            let r=new role.Role(_teamindex, _Id, _level, _stack, Camp.Self, map, _fetters);
            console.log('RoleIcon spawn role: ',_Id);
            this.roleNode=await this.SpawnRole(r);
            this.originalPos=this.node.getPosition();
            this.roleId=_Id;
            //通过配置文件加载资源
            await this.LoadOnConfig();
            this.freezeLock=_freeze;
            this.freezeSprite.active=_freeze;
            this.DragEvent();
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

/*----------------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------拖拽事件---------------------------------------------------------*/
/*----------------------------------------------------------------------------------------------------------------*/
    private DragEvent()
    {
        try
        {
            //俩临时变量，用来记录拖拽前的位置信息
            let beforeIndex;
            let berforeTarget;
    //拖拽取消
            this.myTouch.on(Input.EventType.TOUCH_CANCEL, () => 
            {
                this.OffTirrger();
                //重新注册按钮事件
                this.node.on(Button.EventType.CLICK, () => {
                    singleton.netSingleton.ready.infoPanel.active = true;
                    let roleInfo :RoleDis=null;
                    if(null!=this.roleNode) roleInfo=this.roleNode.getComponent(RoleDis);
                    singleton.netSingleton.ready.infoPanel.getComponent(InfoPanel).OpenInfoBoard(this.roleId,roleInfo,this.isBuy);
                });
                //隐藏冻结栏
                this.shopArea.ShowFreezeArea(false);
                //重置值
                this.touchStartPoint = new Vec2(0, 0);
                this.Adsorption();
            }, this);
    //拖拽结束
            this.myTouch.on(Input.EventType.TOUCH_END, async () => 
            {
                try
                {
                    //手机上按钮事件无法正常工作，此处采用检测拖拽开始和取消的时间间隔，小于0.5s视为点击事件
                    if (Date.now() - this.lastClickTime < 100) {
                        console.log("Players click on role icon");
                        this.ClickBtn();
                    }
                    this.OffTirrger();
                    //重新注册按钮事件
                    //this.RegBtn(true);
                    //隐藏冻结栏
                    this.shopArea.ShowFreezeArea(false);
                    //还原起始值
                    this.touchStartPoint = new Vec2(0, 0);
                    //移动角色且判断是否出售
                    if (!this.isSale) {
                        if (this.isBuy) {
                            console.log(this.index, this.tempIndex);
                            await this.roleArea.MovePos(this.index, this.tempIndex ,this.isMerge);
                        }

                        //换位
                        if (this.isSwitch && !this.isSale)//是否交换位置
                        {
                            if (!this.isMerge) {
                                //console.log('switch : ',this.t.getComponent(RoleIcon).roleId);
                                this.roleArea.SwitchPos(beforeIndex, berforeTarget, this.tempMergeRole);
                                //this.roleArea.targets.set(this.target.name, this.node);
                                this.isSwitch = false;
                            }
                        }
                        this.index = this.tempIndex;
                        this.target = this.tempTarget;
                    }
                    else {
                        this.roleNode.active = false;
                        await this.roleArea.SaleRole(beforeIndex);
                        this.roleNode.destroy();
                        this.node.destroy();
                        return;
                    }
                    //购买、合并角色
                    if (null != this.index) {
                        console.log("欲购买或者移动角色");
                        if (!this.isBuy && singleton.netSingleton.ready.readyData.GetCoins() >= 3) {
                            console.log("角色未购买并且金币数量大于等于3");
                            this.freezeSprite.active = false;
                            if (null != this.target || this.isMerge) {
                                if (null == this.roleArea.rolesNode[this.tempIndex] || this.isMerge) {
                                    this.isBuy = true;
                                    // if(!this.isMerge)
                                    // {
                                    //     this.roleArea.targets.set(this.target.name,this.node);
                                    // }
                                    await this.shopArea.BuyRole(this.index, this.node, this.isMerge);
                                    console.log(`购买时，欲在 ${this.index} 购买位置角色信息：` + this.roleArea.rolesNode[this.tempIndex].name + "是否合并" + this.isMerge);
                                }
                                else console.log("purchase failed, there is already a character at the purchase location");
                            }

                            if (this.isMerge) {
                                this.roleNode.destroy();
                                this.node.destroy();
                                return;
                            }
                        }
                        else if (!this.isBuy && singleton.netSingleton.ready.readyData.GetCoins() < 3) {
                            TipsManager.Instance.ShowTip("<outline color=black width=4>金 币 不 足</outline>");
                        }
                    }
                    //console.log(this.isMerge);
                    //冻结角色
                    if (this.isFreeze && !this.isBuy) {
                        console.log("RoleFreeze!!!");
                        this.freezeLock = !this.freezeLock;
                        this.freezeSprite.active = this.freezeLock;
                        this.shopArea.FreezeEntity(common.ShopIndex.Role, this.node, this.freezeLock);
                    }
                    //吸附缓动
                    if (!this.isMerge || !this.isBuy) {
                        this.Adsorption();
                    }
                }
                catch(error)
                {
                    console.error('RoleIcon 下 拖拽结束 错误 err: ',error);
                }
                
               
            }, this);
    //拖拽中
            this.myTouch.on(Input.EventType.TOUCH_MOVE, (event: EventTouch) => 
            {
                //关闭按钮事件
                //this.RegBtn(false);
                //显示冻结栏
                if (!this.isBuy) 
                {
                    this.shopArea.ShowFreezeArea(true);
                }
                //前0.1s判断是不是点击事件，不进行拖拽行为
                if(Date.now()-this.lastClickTime<100){
                    return;
                }
                //计算位移坐标
                let node: Node = event.currentTarget;
                let pos = new Vec2();
                let shit = pos.set(event.getUILocation());
                let x = shit.x - view.getVisibleSize().width / 2 - this.touchStartPoint.x;
                let y = shit.y - view.getVisibleSize().height / 2 - this.touchStartPoint.y;
                //隐藏图标并显示角色实体
                this.roleNode.active = true;
                this.iconMask.active = false;
                //设置坐标
                node.setPosition(x, y, 0);
            }, this);
    //拖拽开始
            this.myTouch.on(Input.EventType.TOUCH_START, (event: EventTouch) => 
            {
                this.lastClickTime=Date.now();
                this.Ontirrger();
                //触摸到的对象
                let node: Node = event.currentTarget;
                //设置ui坐标
                this.touchStartPoint.set(event.getUILocation());
                let x = this.touchStartPoint.x - view.getVisibleSize().width / 2 - node.getPosition().x;
                let y = this.touchStartPoint.y - view.getVisibleSize().height / 2 - node.getPosition().y;
                this.touchStartPoint = new Vec2(x, y);
                //记录拖拽前的位置信息
                beforeIndex=this.index;
                berforeTarget=this.target;
            }, this);
        }
        catch(error)
        {
            console.error('RoleIcon 下 DragEvent 错误 err: ',error);
        }
    }
/*----------------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------拖拽事件---------------------------------------------------------*/
/*----------------------------------------------------------------------------------------------------------------*/

    //生成角色
    private SpawnRole(r:role.Role):Promise<Node>
    {
        return new Promise (async (resolve)=>
        {
            let newNode = await BundleManager.Instance.loadAssetsFromBundle("Roles", "RolePrefab") as Prefab;
            let role = instantiate(newNode);
            role.setParent(this.node);
            let roleDis = role.getComponent(RoleDis);
            if(!this.isBuy)
            {
                role.active=false;
            }
            roleDis.Refresh(r,true);
            resolve(role);
        });
    }
    //加载图片
    private LoadImg(_address:string,_id:number):Promise<SpriteFrame>
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

    private async LoadOnConfig()
    {
        let jconfig = config.RoleConfig.get(this.roleId);
        let img = await loadAssets.LoadImg(jconfig.Avatar);
        if(img)
        {
            this.iconMask.getChildByPath("RoleSprite").getComponent(Sprite).spriteFrame=img;
        }
    }
/*----------------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------拖拽事件---------------------------------------------------------*/
/*----------------------------------------------------------------------------------------------------------------*/

    private RegBtn(flag:boolean)
    {
        if(flag)
        {
            //注册按钮事件
            this.node.on(Button.EventType.CLICK,()=>
            {
                singleton.netSingleton.ready.infoPanel.active=true;
                let roleInfo :RoleDis=null;
                if(null!=this.roleNode) roleInfo=this.roleNode.getComponent(RoleDis);
                
                singleton.netSingleton.ready.infoPanel.getComponent(InfoPanel).OpenInfoBoard(this.roleId,roleInfo,this.isBuy);
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
        let roleInfo :RoleDis=null;
        if(null!=this.roleNode) roleInfo=this.roleNode.getComponent(RoleDis);
        
        singleton.netSingleton.ready.infoPanel.getComponent(InfoPanel).OpenInfoBoard(this.roleId,roleInfo,this.isBuy);
    }

/*----------------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------碰撞检测---------------------------------------------------------*/
/*----------------------------------------------------------------------------------------------------------------*/

    private Ontirrger()
    {
        //出--------------------------------------------------------------------------出------------------------------------------------------------------------------出//
        this.collider.on(Contact2DType.END_CONTACT, (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) => 
        {
            try
            {
                let str = otherCollider.node.name.slice(otherCollider.node.name.length - 1, otherCollider.node.name.length);
                let num=Number(str);
                //场上角色区域
                if (null != otherCollider && 1 == otherCollider.tag) {
                    if (this.roleArea.rolesNode[num] == selfCollider.node) {
                        if (!this.isMerge) {
                            //console.log("set null");
                            //this.roleArea.targets.set(otherCollider.node.name, null);
                            //this.roleArea.rolesNode[num]=null;
                        }
                        //this.isMerge=false;
                        //console.log(otherCollider.node.name,this.roleArea.targets.get(otherCollider.node.name));
                    }
                }
                //商店区域
                if (null != otherCollider && 2 == otherCollider.tag) {
                    if (this.isBuy) {
                        this.isSale = false;
                    }
                }
                //冻结区域
                if (null != otherCollider && 3 == otherCollider.tag) {
                    this.isFreeze = false;
                }
            }
            catch(error)
            {
                console.error('RoleIcon 下Opentirrger 里的 END_CONTACT 事件错误 err: ',error);
            }
        }, this);
        //进--------------------------------------------------------------------------进------------------------------------------------------------------------------进//
        this.collider.on(Contact2DType.BEGIN_CONTACT, (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) => 
        {
            try
            {
                //场上角色区域
                if (null != otherCollider && 1 == otherCollider.tag) 
                {
                    let num = otherCollider.node.name.slice(otherCollider.node.name.length - 1, otherCollider.node.name.length);
                    this.tempIndex = Number(num);
                    this.tempTarget = otherCollider.node;
                    if (null == this.roleArea.rolesNode[this.tempIndex]) {
                        
                        //this.target = otherCollider.node;
                        //this.roleArea.targets.set(otherCollider.node.name, selfCollider.node);
                        this.isSwitch = false;
                        this.isMerge = false;
                    }
                    else if (this.isBuy) //检测换位或者合并
                    {
                        //this.tempTarget = otherCollider.node;
                        this.tempMergeRole = this.roleArea.rolesNode[this.tempIndex];
                        //console.log(this.t.getComponent(RoleIcon).roleId,this.roleId)
                        if (this.tempMergeRole.getComponent(RoleIcon).roleId == this.roleId) {
                            this.isMerge = true;
                        }
                        else {
                            this.isMerge = false;
                            this.isSwitch = true;
                        }
                        //console.log(this.isMerge);
                    }
                    else {
                        this.target = null;
                        this.tempMergeRole = this.roleArea.rolesNode[this.tempIndex];
                        //console.log(this.t.getComponent(RoleIcon).roleId,this.roleId)
                        if (this.tempMergeRole.getComponent(RoleIcon).roleId == this.roleId) {
                            this.isMerge = true;
                        }
                        else {
                            this.isMerge = false;
                        }
                        //console.log(this.isMerge);
                    }
                }
                //商店区域
                if (null != otherCollider && 2 == otherCollider.tag) {
                    this.index = null;
                    this.tempIndex = null;
                    if (this.isBuy) {
                        this.isSale = true;
                        this.isSwitch = false;
                        this.isMerge = false;
                    }
                }
                //冻结区域
                if (null != otherCollider && 3 == otherCollider.tag) {
                    if (!this.isBuy) {
                        this.isFreeze = true;
                    }
                }
            }
            catch(error)
            {
                console.error('RoleIcon 下Opentirrger 里的 BEGIN_CONTACT 事件错误 err: ',error);
            }
            
        }, this);
    }

    private OffTirrger()
    {
        this.collider.off(Contact2DType.END_CONTACT);
        this.collider.off(Contact2DType.BEGIN_CONTACT);
    }
  
/*----------------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------碰撞检测---------------------------------------------------------*/
/*----------------------------------------------------------------------------------------------------------------*/
    //拖拽吸附
    private Adsorption()
    {
        if(null!=this.target && !this.isSale && null!=this.index && this.isBuy)
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
    public TransPos(Vec3:Vec3)
    {
        //this.roleArea.targets.set(this.target.name,null);
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
        try
        {
            let value =[t.HP-this.roleNode.getComponent(RoleDis).Hp,t.Attack-this.roleNode.getComponent(RoleDis).AtkNum];
            let map=new Map<Property,number>().set(Property.HP,t.HP).set(Property.Attack,t.Attack);
            let r=new role.Role(this.index,this.roleId,t.Level,t.Number,Camp.Self,map,t.FettersSkillID,t.additionBuffer);
            //console.log('当前等级 ')
            this.roleNode.getComponent(RoleDis).Refresh(r);
            await this.roleNode.getComponent(RoleDis).Intensifier(value,t.Number);
            if(is_update)
            {
                await this.roleNode.getComponent(RoleDis).LevelUp();
            }
            this.upgradeLock=false;
        }
        catch(error)
        {
            console.error('RoleIcon 下 GetUpgrade 错误 err: ',error);
        }
        
    }
    //玩家吃食物
    async EatFood(t:common.Role,food_id:number){
        try
        {
            console.log("role"+t.RoleID+"eat food"+food_id);
            let foodInfo=config.FoodConfig.get(food_id);
            if(!foodInfo){
                console.log("can not find config of food:"+food_id);
                return;
            }
            let value =[];
            for(let effect of foodInfo.Effect){
                switch(effect){
                    case 1:{
                        value.push(foodInfo.HpBonus);
                    }
                    break;
                    case 2:{
                        value.push(foodInfo.AttackBonus);    
                    } 
                    break;
                    case 3:break;
                    case 4:break;
                    case 5:break;
                    case 6:break;
                }
            }
            let map=new Map<Property,number>().set(Property.HP,t.HP).set(Property.Attack,t.Attack);
            let r=new role.Role(this.index,this.roleId,t.Level,t.Number,Camp.Self,map,t.FettersSkillID,t.additionBuffer);
            this.roleNode.getComponent(RoleDis).Refresh(r);
            await this.roleNode.getComponent(RoleDis).Intensifier(value,t.Number);
            this.upgradeLock=false;
        }
        catch(error)
        {
            console.error('RoleIcon 下 EatFood 错误 err: ',error);
        }
    }
    //玩家装备上购买的装备
    async Equipping(t:common.Role,equip_id:number){
        try
        {
            let equipInfo=config.EquipConfig.get(equip_id);
            if(!equipInfo){
                console.log("can not find config of food:"+equip_id);
                return;
            }
            for(let effect of equipInfo.Effect){
                switch(effect){
                    case 1:case 2:{
                        let value =[equipInfo.HpBonus,equipInfo.AttackBonus];
                        await this.roleNode.getComponent(RoleDis).Intensifier(value,t.Number);
                    }break;
                    case 3:{
                        let map=new Map<Property,number>().set(Property.HP,t.HP).set(Property.Attack,t.Attack);
                        for(let temp of equipInfo.Vaule){
                            t.additionBuffer.push(temp);
                        }
                        let r=new role.Role(this.index,this.roleId,t.Level,t.Number,Camp.Self,map,t.FettersSkillID,t.additionBuffer);
                        this.roleNode.getComponent(RoleDis).Refresh(r);
                    }break;
                    case 4:break;
                    case 5:break;
                    case 6:break;
                    case 7:{
                        //如果召唤的效果等同于id为x的召唤技能，特殊效果值是召唤技能的id，则使用下面的代码
                        let map=new Map<Property,number>().set(Property.HP,t.HP).set(Property.Attack,t.Attack);
                        var additionSkill = [];
                        for(let temp of equipInfo.Vaule){
                            additionSkill.push(temp);
                        }
                        let r=new role.Role(this.index,this.roleId,t.Level,t.Number,Camp.Self,map,t.FettersSkillID,t.additionBuffer,additionSkill);
                        this.roleNode.getComponent(RoleDis).Refresh(r);
                    }break;
                }
            }
            this.upgradeLock=false;
        }
        catch(error)
        {
            console.error('RoleIcon 下 Equipping 错误 err: ',error);
        }
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


