/*
 * ShopArea.ts
 * author: Hotaru
 * 2023/11/11
 */
import { _decorator, Animation, BlockInputEvents, Camera, Canvas, Component, game, instantiate, Node, Prefab, tween, Tween, UITransform, Vec3, view, Widget } from 'cc';
import { ShopIndex, ShopProp, ShopRole } from '../../battle/AutoChessBattle/common';
import { RoleIcon } from './RoleIcon';
import * as singleton from '../../netDriver/netSingleton';
import * as common from "../../battle/AutoChessBattle/common"
import { RoleArea } from './RoleArea';
import { PropIcon } from './PropIcon';
import { PropsType } from '../../other/enums';
import { AudioManager } from '../../other/AudioManager';
import { GameManager } from '../../other/GameManager';
import * as enmus from '../../other/enums';
import SdkManager from '../../SDK/SdkManager';
import { CardDynaLayout } from '../../other/CardDynaLayout';
const { ccclass, property } = _decorator;

@ccclass('ShopArea')
export class ShopArea extends Component 
{
    @property({
        type: Prefab,
        displayName: "图标预制体"
    })
    public roleIcon:Node;
    @property({
        type: Prefab,
        displayName: "食物图标预制体"
    })
    public propIcon:Node;
    //物体位置
    public rolesSquare:Node[]=[];
    public FoodSquare:Node[]=[];
    public EquipSquare:Node;
    public OriginPos:Vec3=null;
    @property(Node)
    public panel:Node;
    public cam:Node;
    //物体列表
    public shopRoleNodes:Node[]=[];
    public shopPropNodes:Node[]=[];
    //各操作区域
    private roleArea:RoleArea;
    private freezeArea:Node;

    private tempRoles:ShopRole[]=[];
    private tempProps:ShopProp[]=[];

    public cardsLayout:CardDynaLayout=null;
    protected onLoad(): void 
    {
        try
        {
            this.OriginPos=this.node.getChildByPath("TopArea/OriginPos").worldPosition;
            this.cardsLayout=new CardDynaLayout(this.OriginPos,this.panel);
            for(let t of this.node.getChildByPath("TopArea/Role").children)
            {
                this.rolesSquare.push(t);
            }
            for(let t of this.node.getChildByPath("TopArea/Food").children)
            {
                this.FoodSquare.push(t);
            }
            this.EquipSquare=this.node.getChildByPath("TopArea/Equip/EquipSquare");
            this.roleArea=this.panel.getChildByPath("RoleArea").getComponent(RoleArea);
            this.freezeArea=this.node.getChildByPath("FreezeArea");
            this.cam=this.panel.parent.getChildByPath("Camera");
        } catch (error) 
        {
            console.error("ShopArea 下的 onLoad 错误：",error);
        }
    }

    start() 
    {
        //屏幕适配
        // if (SdkManager.SDK.getSystemInfo().safeArea.height == SdkManager.SDK.getSystemInfo().screenHeight)
        // {
        //     return;
        // }
        // let bpttomHeigh = (SdkManager.SDK.getSystemInfo().screenHeight - SdkManager.SDK.getSystemInfo().safeArea.height) / 2;
        // let outPos: Vec3 = this.cam.getComponent(Camera).screenToWorld(new Vec3(0, bpttomHeigh, 0));
        // this.node.getComponent(Widget).bottom = outPos.y;
    }

    protected onDestroy(): void
    {
        for (let t of this.shopRoleNodes)
        {
            if (t) t.destroy();
        }
        for (let t of this.shopPropNodes)
        {
            if (t) t.destroy();
        }
        this.destroy();
    }

    // destroy(): boolean
    // {
    //     try
    //     {
    //         for(let t of this.shopRoleNodes)
    //         {
    //             if(t) t.destroy();
    //         }
    //         for(let t of this.shopPropNodes)
    //         {
    //             if(t) t.destroy();
    //         }
    //     }
    //     catch(err)
    //     {
    //         console.warn("ShopArea 下的 destroy 异常：",err);
    //     }
    //     return super.destroy();// this._super.call()
    // }

    async Init(roles?:ShopRole[],props?:ShopProp[],stage:number=1)
    {
        return new Promise<void>(async (resolve, reject) =>
        {
            try
            {
                let tick=0;
                let interval = setInterval(()=>
                {
                    tick++;
                    if(tick>1000)
                    {
                        GameManager.Instance.Waitting(true);
                    }
                });

                let allAwait=[];

                this.tempRoles = roles.slice();
                this.tempProps = props.slice();
                for (let t of this.shopRoleNodes)
                {
                    if (t) 
                    {
                        this.cardsLayout.removeCard(t);
                        t.destroy();
                    }
                }
                for (let t of this.shopPropNodes)
                {
                    if (t)
                    {
                        this.cardsLayout.removeCard(t);
                        t.destroy();
                    } 
                }
                this.shopRoleNodes = [];
                this.shopPropNodes = [];
                if (roles)
                {
                    let tmpCnt: number;
                    switch (stage)
                    {
                        case 1: case 2: tmpCnt = 4; break;
                        case 3: case 4: tmpCnt = 5; break;
                        case 5: case 6: tmpCnt = 6; break;
                        default: tmpCnt = 6;
                    }
                    console.log("roles:", JSON.stringify(roles));
                    for (let i = 0; i < roles.length/*&&tmpCnt>0*/; i++)   //暂时不限制格子数
                    {
                        if (roles[i])
                        {
                            
                            console.log("shopRoleId: ", roles[i].RoleID);
                            let newNode = instantiate(this.roleIcon);
                            newNode.setParent(this.panel);
                            //console.log(newNode.parent.name);
                            //newNode.setWorldPosition(this.rolesSquare[i].worldPosition);
                            newNode.setWorldPosition(new Vec3(-2000,0,0));
                            allAwait.push(newNode.getComponent(RoleIcon).Init(roles[i].RoleID, roles[i].HP, roles[i].Attack, 1, 1, roles[i].IsFreeze));
                            this.shopRoleNodes.push(newNode);
                            //this.cardsLayout.AddCard(newNode);
                            tmpCnt--;
                        }
                        else
                        {
                            this.shopRoleNodes.push(null);
                        }
                    }
                }
                if (props)
                {
                    let equipIdx: number = 0;
                    let foodIdx: number = 0;
                    let tmpFoodCnt: number;
                    let tmpEquipCnt: number = 1;
                    switch (stage)
                    {
                        case 1: case 2: case 3: case 4: tmpFoodCnt = 1; break;
                        case 5: case 6: tmpFoodCnt = 2; break;
                        default: tmpFoodCnt = 2;
                    }
                    for (let i = 0; i < props.length; i++)
                    {
                        if (props[i]) 
                        {
                            let newNode = instantiate(this.propIcon);
                            newNode.setParent(this.panel);
                            newNode.setWorldPosition(new Vec3(-2000,0,0));
                            //console.log(newNode.parent.name);
                            if (props[i].PropID >= 1001 && props[i].PropID <= 1999 && tmpFoodCnt > 0)
                            {
                                //newNode.setWorldPosition(this.FoodSquare[foodIdx++].worldPosition);
                                tmpFoodCnt--;
                            }
                            else if (props[i].PropID >= 3001 && props[i].PropID <= 3999 && tmpEquipCnt > 0)
                            {
                                //newNode.setWorldPosition(this.EquipSquare.worldPosition);
                                tmpEquipCnt--;
                            }
                            else
                            {
                                newNode.active = false;
                            }
                            allAwait.push(newNode.getComponent(PropIcon).Init(props[i].PropID, props[i].IsFreeze));
                            this.shopPropNodes.push(newNode);
                            //this.cardsLayout.AddCard(newNode);
                        }
                    }
                }
                await Promise.all(allAwait).then(()=>
                {
                    let tlist=[];
                    for(let t of this.shopRoleNodes)
                    {
                        if(t) tlist.push(t);
                    }
                    for(let t of this.shopPropNodes)
                    {
                        if(t) tlist.push(t);
                    }
                    let i=0;
                    let interval_1= setInterval(() => 
                    {
                        if(i<tlist.length)
                        {
                            this.cardsLayout.AddCard(tlist[i]);
                            i++;
                        }
                        else
                        {
                            clearInterval(interval_1);
                        }
                    }, 200);
                });

                clearInterval(interval);
                resolve();
            } catch (error) 
            {
                console.error("ShopArea 下的 Init 错误: ", error);
                reject();
            }
        });
    }

    async AddItems(roles?:ShopRole[],props?:ShopProp[],stage:number=1)
    {
        try
        {
            if (roles)
            {
                //console.log("tempRole:", this.tempRoles);
                for (let i = 0; i < roles.length; i++)
                {
                    if(null == roles[i])
                    {
                        continue;
                    }
                    if (this.tempRoles[i] != null)
                    {
                        if (this.tempRoles[i].RoleID == roles[i].RoleID &&
                            this.tempRoles[i].Level == roles[i].Level &&
                            this.tempRoles[i].HP == roles[i].HP &&
                            this.tempRoles[i].Attack == roles[i].Attack)
                        {
                            continue;
                        }
                    }

                    if (roles[i] != null)
                    {
                        this.tempRoles.splice(i, 1, roles[i]);
                        if (this.shopRoleNodes[i])
                        {
                            this.shopRoleNodes[i].destroy();
                        }
                        let newNode = instantiate(this.roleIcon);
                        newNode.setParent(this.panel);
                        newNode.setWorldPosition(new Vec3(-2000,0,0));
                        //newNode.setWorldPosition(this.rolesSquare[i].worldPosition);
                        await newNode.getComponent(RoleIcon).Init(roles[i].RoleID, roles[i].HP, roles[i].Attack, roles[i].Level, 1, roles[i].IsFreeze);
                        this.shopRoleNodes[i] = newNode;
                        this.cardsLayout.AddCard(newNode);
                    }
                }
            }
            if (props)
            {
                for (let i = 0; i < props.length; i++)
                {
                    if (this.tempRoles[i] != null)
                    {
                        if(null==props[i])
                        {
                            continue;
                        }
                        if (this.tempProps[i].PropID == props[i].PropID)
                        {
                            continue;
                        }
                    }

                    if (props[i] != null)
                    {
                        this.tempProps.splice(i, 1, props[i]);
                        if (this.shopPropNodes[i])
                        {
                            this.shopPropNodes[i].destroy();
                        }
                        let newNode = instantiate(this.propIcon);
                        newNode.setParent(this.panel);
                        newNode.setWorldPosition(new Vec3(-2000,0,0));
                        if (props[i].PropID >= 1001 && props[i].PropID <= 1999/*&&tmpFoodCnt>0*/)
                        {
                            //newNode.setWorldPosition(this.FoodSquare[i].worldPosition);
                            //tmpFoodCnt--;
                        }
                        else if (props[i].PropID >= 3001 && props[i].PropID <= 3999/*&&tmpEquipCnt>0*/)
                        {
                            //newNode.setWorldPosition(this.EquipSquare.worldPosition);
                            //tmpEquipCnt--;
                        }
                        await newNode.getComponent(PropIcon).Init(props[i].PropID, props[i].IsFreeze);
                        this.shopPropNodes.push(newNode);
                        this.cardsLayout.AddCard(newNode);
                    }
                }
            }
            this.tempRoles=roles.slice();
            this.tempProps=props.slice();
        }
        catch(error)
        {
            console.error("ShopArea 下的 AddItem 错误: ",error);
        }
    }

    async BuyRole(_index:number, _obj:Node ,_isMerge:boolean)
    {
        console.log('buy Role');
        AudioManager.Instance.PlayerOnShot("Sound/battle_coin_expend");
        for(let i=0;i<this.shopRoleNodes.length;i++)
        {
            if(this.shopRoleNodes[i] == _obj)
            {
                if(!_isMerge)
                {
                    this.roleArea.rolesNode[_index]=_obj;
                }
                singleton.netSingleton.ready.readyData.Buy(ShopIndex.Role, i, _index);
                this.cardsLayout.removeCard(_obj);
                this.shopRoleNodes[i] = null;
            }
        }
    }

    async BuyProp(_index:number,_obj:Node)
    {
        for(let i=0;i<this.shopPropNodes.length;i++)
        {
            if(this.shopPropNodes[i] == _obj)
            {
                singleton.netSingleton.ready.readyData.Buy(ShopIndex.Prop , i , _index);
                this.cardsLayout.removeCard(_obj);
                this.shopPropNodes[i] = null;
            }
        }
    }

    ShowFreezeArea(_flag:boolean)
    {
        if(_flag)
        {
            this.freezeArea.active=true;
            this.freezeArea.getComponent(BlockInputEvents).enabled=true;
            //tween(this.freezeArea).to(0.2,{position:new Vec3(0,170,0)}).start();
            this.freezeArea.getComponent(Animation).play("FreezeAreaUp");
        }
        else
        {
            this.freezeArea.getComponent(BlockInputEvents).enabled=false;
            // tween(this.freezeArea).to(0.1, { position: new Vec3(0, 0, 0) }).call(() =>
            // {
            //     this.freezeArea.active = false;
            // }).start();
            this.freezeArea.getComponent(Animation).on(Animation.EventType.FINISHED,()=>
            {
                this.freezeArea.active = false;
                this.freezeArea.getComponent(Animation).off(Animation.EventType.FINISHED);
            })
            this.freezeArea.getComponent(Animation).play("FreezeAreaDown");
        }
    }

    async FreezeEntity(_shop_index:common.ShopIndex,_obj:Node , _isFreeze:boolean)
    {
        if(_isFreeze)
        {
            AudioManager.Instance.PlayerOnShot("Sound/sound_charfreeze_01");
        }
        else
        {
            AudioManager.Instance.PlayerOnShot("Sound/sound_chardisfreeze_01");
        }
        
        if(common.ShopIndex.Prop==_shop_index)
        {
            for(let i=0;i<this.shopPropNodes.length;i++)
            {
                if(this.shopPropNodes[i] == _obj)
                {
                    await singleton.netSingleton.ready.readyData.Freeze(_shop_index , i,_isFreeze);
                }
            }
        }
        if(common.ShopIndex.Role==_shop_index)
        {
            for(let i=0;i<this.shopRoleNodes.length;i++)
            {
                if(this.shopRoleNodes[i] == _obj)
                {
                    await singleton.netSingleton.ready.readyData.Freeze(_shop_index , i ,_isFreeze);
                }
            }
        }
    }

}


