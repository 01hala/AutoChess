/*
 * RoleIcon.ts
 * author: Hotaru
 * 2023/11/09
 * 图标拖拽类
 */

import { _decorator, Asset, Button, Collider, Collider2D, Color, color, Component, Contact2DType, director, EventTouch, ImageAsset, Input, instantiate, IPhysics2DContact, ITriggerEvent, Layers, Mask, Node, Prefab, rect, Skeleton, sp, Sprite, SpriteAtlas, SpriteFrame, Texture2D, tween, Tween, UITransform, Vec2, Vec3, view } from 'cc';
import { RoleArea } from './RoleArea';
import { BundleManager } from '../../bundle/BundleManager';
import { sleep } from '../../other/sleep';
import * as role from '../../battle/AutoChessBattle/role'
import * as common from '../../battle/AutoChessBattle/common';
import { RoleDis } from '../../battle/display/RoleDis';
import { ReadyDis } from './ReadyDis';
import * as singleton from '../../netDriver/netSingleton';
import { ShopArea } from './ShopArea';
import * as battleEmums from '../../battle/AutoChessBattle/enum';
import { InfoBoard } from '../../secondaryPanel/InfoBoard';
import { config } from '../../battle/AutoChessBattle/config/config';
import { loadAssets } from '../../bundle/LoadAsset';
import { GameManager } from '../../other/GameManager';
import { SendMessage } from '../../other/MessageEvent';
import { AudioManager } from '../../other/AudioManager';
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
    private visiableArea:Node;
    private shopArea:ShopArea;
    //图标
    public iconMask:Node;
    private freezeSprite:Node;
    private farme:Node;
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
            this.visiableArea=this.panel.getChildByPath("RoleArea/visiable");
            this.shopArea=this.panel.getChildByPath("Shop/ShopArea").getComponent(ShopArea);
            this.farme=this.node.getChildByPath("Farme");
            this.farme.active=false;
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
            let map=new Map<battleEmums.Property,number>().set(battleEmums.Property.HP,_Hp).set(battleEmums.Property.Attack,_Atk);
            console.log("new role");
            let r=new role.Role(null,_teamindex, _Id, _level, _stack, battleEmums.Camp.Self, map, _fetters , -1);
            console.log('RoleIcon spawn role: ',_Id);
            this.roleNode=await this.SpawnRole(r);
            this.originalPos=this.node.getPosition();
            this.roleId=_Id;
            //通过配置文件加载资源
            await this.LoadOnConfig(); 
            this.freezeLock=_freeze;
            this.freezeSprite.active=_freeze;
            this.visiableArea.active=false;

            this.DragEvent();
            if(!this.isBuy)
            {
                this.iconMask.active=true;
                this.farme.active=true;
            }
            else
            {
                this.roleNode.setScale(new Vec3(1.2,1.2,1));
            }
            this.tempIndex=this.index;
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
            //拖拽锁
            let drag=false;
    //拖拽取消
            this.myTouch.on(Input.EventType.TOUCH_CANCEL, () => 
            {
                this.node.setSiblingIndex(98);
                this.OffTirrger();
                singleton.netSingleton.ready.HideRoleInfo();
                //隐藏人物放置可视化区域
                this.visiableArea.active=false;
                //隐藏冻结栏
                this.shopArea.ShowFreezeArea(false);
                //重置值
                this.touchStartPoint = new Vec2(0, 0);
                this.Adsorption();
                //解除拖拽锁
                drag=false;
            }, this);
    //拖拽结束
            this.myTouch.on(Input.EventType.TOUCH_END, async () => 
            {
                try
                {
                    this.node.setSiblingIndex(98);
                    this.OffTirrger();
                    singleton.netSingleton.ready.HideRoleInfo();
                    //隐藏人物放置可视化区域                                                                  // 修改函数
                    this.visiableArea.active=false;                                                         
                    //隐藏冻结栏                                                                             
                    this.shopArea.ShowFreezeArea(false);                                                    // Editor:Hotaru
                    //隐藏商店蒙版
                    singleton.netSingleton.ready.ShowShopMask(false);
                    //还原起始值
                    this.touchStartPoint = new Vec2(0, 0);                                                  
                    //手机上按钮事件无法正常工作，此处采用检测拖拽开始和取消的时间间隔，小于0.5s视为点击事件        
                    if (Date.now() - this.lastClickTime < 100) {                                            // 2024/04/29
                        console.log("Players click on role icon");                                          
                        this.ClickBtn();                                                                  
                        return;                                                                             
                    }                                                                                       // 如果是点击操作直接return
                    //重新注册按钮事件
                    //this.RegBtn(true);
                    //移动角色且判断是否出售
                    if (!this.isSale) {
                        if (this.isBuy) {
                            console.log(this.index, this.tempIndex);
                            this.roleArea.MovePos(this.index, this.tempIndex ,this.isMerge); 
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
                                    this.BuyRole();
                                    this.Adsorption();
                                    //这个await延迟太明显了导致购买角色手感很差，需要调整购买效果的执行位置
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
                        else if (!this.isBuy && singleton.netSingleton.ready.readyData.GetCoins() < 3) 
                        {
                            this.node.dispatchEvent(new SendMessage('ShowTip',true,"<outline color=black width=4>金 币 不 足</outline>"));
                            //GameManager.Instance.ShowTip("<outline color=black width=4>金 币 不 足</outline>");
                        }
                    }
                    //console.log(this.isMerge);
                    //冻结角色
                    if(this.isBuy) this.isFreeze=false;
                    if(this.freezeLock)
                    {
                        this.freezeSprite.active = this.isFreeze;
                        this.shopArea.FreezeEntity(common.ShopIndex.Role, this.node, this.isFreeze);
                        this.freezeLock=false;
                    }
                    //吸附缓动
                    //console.log(`isMerge : ${this.isMerge} ; isBuy : ${this.isBuy}`);
                    if (!this.isMerge || !this.isBuy) {
                        this.Adsorption();
                    }

                    drag=false;
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
                
                //前0.1s判断是不是点击事件，不进行拖拽行为
                if(Date.now()-this.lastClickTime<100){
                    return;
                }
                else
                {
                    if(!drag)   //只触发一次
                    {
                        AudioManager.Instance.PlayerOnShot("Sound/sound_character_select_01");
                        if (!this.isBuy) 
                        {
                            //如果角色未被购买则缩小角色图标，静止动画
                            this.roleNode.scale=
                                new Vec3(this.roleNode.scale.x*(2/3),this.roleNode.scale.y*(2/3),this.roleNode.scale.z);
                            this.roleNode.getChildByName("Sprite").getComponent(sp.Skeleton).timeScale=0;
                            this.shopArea.ShowFreezeArea(true);
                        }
                        else
                        {
                            singleton.netSingleton.ready.ShowShopMask(true);
                        }
                        drag=true;
                    }
                }
                //显示人物放置可视化区域
                this.visiableArea.active=true;
                //计算位移坐标
                let node: Node = event.currentTarget;
                let pos = new Vec2();
                let shit = pos.set(event.getUILocation());
                let x = shit.x - view.getVisibleSize().width / 2 - this.touchStartPoint.x;
                let y = shit.y - view.getVisibleSize().height / 2 - this.touchStartPoint.y;
                //隐藏图标并显示角色实体
                this.roleNode.active = true;
                
                this.iconMask.active = false;
                this.farme.active=false;
                //设置坐标
                node.setPosition(x, y, 0);
            }, this);
    //拖拽开始
            this.myTouch.on(Input.EventType.TOUCH_START, (event: EventTouch) => 
            {
                this.node.setSiblingIndex(99);
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

                singleton.netSingleton.ready.ShowRoleInfo(this.roleNode.getComponent(RoleDis).RoleId,this.roleNode.getComponent(RoleDis).Level);
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
    //购买角色时的动画效果
    private async BuyRole(){
        this.roleNode.getChildByName("Sprite").getComponent(sp.Skeleton).timeScale=1;
        tween(this.roleNode)
        .to(0.2, { scale: new Vec3(this.roleNode.scale.x*1.5,this.roleNode.scale.y*1.5,this.roleNode.scale.z) })
        .call(()=>
        {
            AudioManager.Instance.PlayerOnShot("Sound/battle_buy_01");
            if (GameManager.Instance.guide)
            {
                GameManager.Instance.guide.step++;
            }
        }) // 在0.5秒内将缩放变为原来的两倍
        .start();
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
    //从配置文件加载
    private async LoadOnConfig()
    {
        try
        {
            let jconfig = config.RoleConfig.get(this.roleId);
            let img = await loadAssets.LoadImg(jconfig.Avatar);
            if(img)
            {
                if(null==this.iconMask)
                {
                    this.iconMask=this.node.getChildByName("IconMask");
                }
                this.iconMask.getChildByPath("RoleSprite").getComponent(Sprite).spriteFrame=img;
            }
            console.log("阶数",jconfig.Stage);
            let color;
            switch(jconfig.Stage)
            {
                case 1:color=new Color().fromHEX("#ffffff");break;
                case 2:color=new Color().fromHEX("#6fce98");break;
                case 3:color=new Color().fromHEX("#6f8ed3");break;
                case 4:color=new Color().fromHEX("#c97ef3");break;
                case 5:color=new Color().fromHEX("#e5ad27");break;
                case 6:color=new Color().fromHEX("#d34fsa");break;
            }
            this.farme.getComponent(Sprite).color=color;
            this.farme.getComponent(Sprite).markForUpdateRenderData(true);
        }
        catch(error)
        {
            console.error('RoleIcon 下 LoadOnConfig 错误 err: ',error);
        }
    }
    //点击事件
    private ClickBtn()
    {
        if (GameManager.Instance.guide && this.isBuy)
        {
            GameManager.Instance.guide.step++;
        }
        if(GameManager.Instance.guide && GameManager.Instance.guide.step <=7)
        {
            return;
        }
        AudioManager.Instance.PlayerOnShot("Sound/sound_click_01");
        let roleInfo :RoleDis=null;
        if(null!=this.roleNode) roleInfo=this.roleNode.getComponent(RoleDis);
        
        //singleton.netSingleton.ready.infoPanel.getComponent(InfoPanel).OpenInfoBoard(this.roleId,roleInfo,this.isBuy);
        this.node.dispatchEvent(new SendMessage('OpenInfoBoard',true,{id:this.roleId , index:this.index , role:roleInfo , isBuy:this.isBuy}));
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
                    this.freezeLock=false;
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
                    if (null == this.roleArea.rolesNode[this.tempIndex]) 
                    {
                        
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
                        if (this.tempMergeRole.getComponent(RoleIcon).roleId == this.roleId && this.tempMergeRole !=this.node) {
                            this.isMerge = true;
                        }
                        else {
                            this.isMerge = false;
                            this.isSwitch = true;
                        }
                        //console.log(this.isMerge);
                    }
                    else 
                    {
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
                    //this.index = null;
                    //this.tempIndex = null;
                    if (this.isBuy) 
                    {
                        this.isSale = true;
                        this.isSwitch = false;
                        this.isMerge = false;
                    }
                    else
                    {
                        this.index = null;
                        this.tempIndex = null;
                    }
                }
                //冻结区域
                if (null != otherCollider && 3 == otherCollider.tag) {
                    if (!this.isBuy) {
                        this.freezeLock=true;
                        this.isFreeze=!this.isFreeze;
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
            AudioManager.Instance.PlayerOnShot("Sound/sound_move_01");
            this.tweenNode=tween(this.node).to(0.1,{worldPosition:this.target.worldPosition})
             .call(()=>
             {
                this.originalPos=this.node.getPosition();
             }).delay(0.1).call(()=>
             {
                tween(this.roleNode).to(0.1,{scale:new Vec3(1.2,1.2,1)}).start();
                this.tweenNode.stop();
             }).start();
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
    public TransPos(_target:Node , _index:number)
    {
        //this.roleArea.targets.set(this.target.name,null);
        this.target=_target;
        this.tempTarget=_target;
        this.index=_index;
        this.tempIndex=_index;
        this.tweenNode=tween(this.node).to(0.1,{worldPosition:_target.worldPosition})
        .call(()=>
        {
            this.originalPos=this.node.getPosition();
            this.tweenNode.stop();
        })
        .start();
        //this.node.setWorldPosition(Vec3);
        console.log(`tarnspos! ${this.target.name}`);
    }
    //合并、升级
    async GetUpgrade(t:common.Role,is_update:boolean)
    {
        try
        {
            let value =[t.HP-this.roleNode.getComponent(RoleDis).Hp,t.Attack-this.roleNode.getComponent(RoleDis).AtkNum];
            let map=new Map<battleEmums.Property,number>().set(battleEmums.Property.HP,t.HP + t.TempHP).set(battleEmums.Property.Attack,t.Attack + t.TempAttack);
            let r=new role.Role(null,this.index,this.roleId,t.Level,t.Number,battleEmums.Camp.Self,map,t.FettersSkillID,-1,[-1],t.additionBuffer);
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
    async EatFood(t:common.Role,food_id:number,is_update: boolean , is_syncope : boolean){
        try
        {
            console.log("人物尝试吃食物");
            console.log("role"+t.RoleID+"eat food"+food_id);
            let foodInfo=config.FoodConfig.get(food_id);
            if(!foodInfo){
                console.log("can not find config of food:"+food_id);
                return;
            }
            if(is_syncope)
            {
                this.roleNode.getComponent(RoleDis).Exit();
                console.log("角色离场");
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
            let map=new Map<battleEmums.Property,number>().set(battleEmums.Property.HP,t.HP+t.TempHP).set(battleEmums.Property.Attack,t.Attack+t.TempAttack);
            let r=new role.Role(null,this.index,this.roleId,t.Level,t.Number,battleEmums.Camp.Self,map,t.FettersSkillID,-1,[-1],t.additionBuffer);
            this.roleNode.getComponent(RoleDis).Refresh(r);
            await this.roleNode.getComponent(RoleDis).Intensifier(value,t.Number);
            this.upgradeLock=false;

            if(is_update)
            {
                this.GetUpgrade(t,is_update);
            }
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
            console.log("人物尝试装备");
            let equipInfo=config.EquipConfig.get(equip_id);
            if(!equipInfo){
                console.log("can not find config of equip:"+equip_id);
                return;
            }
            for(let effect of equipInfo.Effect){
                switch(effect){
                    case 1:case 2:{
                        let value =[equipInfo.HpBonus,equipInfo.AttackBonus];
                        await this.roleNode.getComponent(RoleDis).Intensifier(value,t.Number);
                    }break;
                    case 3:{
                        let map=new Map<battleEmums.Property,number>().set(battleEmums.Property.HP,t.HP+t.TempHP).set(battleEmums.Property.Attack,t.Attack+t.TempAttack);
                        for(let temp of equipInfo.Vaule){
                            t.additionBuffer.push(temp);
                        }
                        let r=new role.Role(null,this.index,this.roleId,t.Level,t.Number,battleEmums.Camp.Self,map,t.FettersSkillID,-1,[-1],t.additionBuffer);
                        this.roleNode.getComponent(RoleDis).Refresh(r);
                    }break;
                    case 4:break;
                    case 5:break;
                    case 6:break;
                    case 7:{
                        //如果召唤的效果等同于id为x的召唤技能，特殊效果值是召唤技能的id，则使用下面的代码
                        // let map=new Map<battleEmums.Property,number>().set(battleEmums.Property.HP,t.HP).set(battleEmums.Property.Attack,t.Attack);
                        // let additionSkill:number[] =[];
                        // for(let temp of equipInfo.Vaule){
                        //     additionSkill.push(temp);
                        // }
                        // let r=new role.Role(null,this.index,this.roleId,t.Level,t.Number,battleEmums.Camp.Self,map,t.FettersSkillID,-1,t.additionBuffer,additionSkill);
                        // this.roleNode.getComponent(RoleDis).Refresh(r);
                    }break;
                }
                this.roleNode.getComponent(RoleDis).Equipping(equip_id);
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


