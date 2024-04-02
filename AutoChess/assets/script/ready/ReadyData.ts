/*
 * Ready.ts
 * author: Hotaru
 * 2023/11/11
 */
import { _decorator, Component, error, Node } from 'cc';
import * as skill from '../battle/skill/skill_base'
import * as common from "../serverSDK/common"
import { ShopProp, ShopRole } from '../serverSDK/common';
import * as singleton from '../netDriver/netSingleton';
import { sleep } from '../other/sleep';
import { EventType } from '../other/enums';
const { ccclass, property } = _decorator;

/*
 * 修改类名
 * Editor: Hotaru
 * 2024/04/02
 */
@ccclass('ReadyData')
export class ReadyData
{
    private heath:number;
    private stage:number;
    private props:ShopProp[];
    private shopRoles:ShopRole[];

    private static roles:common.Role[];
    private fetters_info:common.Fetters[];

    private coin:number=0;

    //private freezeRoles:Role[]=[];

    private evs:skill.Event[] = [];

    public on_event : ((evs:skill.Event[]) => Promise<void>) = null;

    public constructor(battle_info:common.UserBattleData, self:common.ShopData , fetters_info?:common.Fetters[]) 
    {
        this.coin = battle_info.coin;

        console.log("Current player stage:"+battle_info.stage);
        this.stage=battle_info.stage;
        this.shopRoles=self.SaleRoleList;
        this.props=self.SalePropList;
        this.fetters_info=fetters_info;

        //console.log("shopRoles:", this.shopRoles);
        //console.log("props:", this.props);
        //console.log("battle_info.RoleList:", battle_info.RoleList);
    }

    public SetStage(_stage:number)
    {
        this.stage=_stage;
    }

    public GetStage():number{
        return this.stage;
    }

    public SetHeath(_heath:number)
    {   
        this.heath=_heath;
    }

    public GetHeath()
    {
        return this.heath;
    }

    public GetShopRoles():ShopRole[]
    {
        return this.shopRoles;

        // if(this.shopRoles)
        // {
        //     let tmpRole:ShopRole[]=[];
        //     let tmpCnt:number;
        //     switch(this.stage){
        //         case 1:case 2:tmpCnt=4;break;
        //         case 3:case 4:tmpCnt=5;break;
        //         case 5:case 6:tmpCnt=6;break;
        //         default:tmpCnt=6;
        //     }
        //     for(let i=0;i<tmpCnt&&i<this.shopRoles.length;i++){
        //         tmpRole.push(this.shopRoles[i]);
        //     }
        //     return tmpRole;
        // }
    }

    public GetShopProps():ShopProp[]
    {
        console.log("商店传来的道具列表长度："+this.props.length);
        return this.props;
        // if(this.props)
        // {
        //     let tmpProp:ShopProp[]=[];
        //     let tmpFoodCnt:number;
        //     let tmpEquipCnt:number=1;
        //     switch(this.stage){
        //         case 1:case 2:case 3:case 4:tmpFoodCnt=1;break;
        //         case 5:case 6:tmpFoodCnt=2;break;
        //         default:tmpFoodCnt=2;
        //     }
        //     for(let i=0;i<this.props.length;i++){
        //         if(tmpFoodCnt>0&&this.props[i].PropID>=1001&&this.props[i].PropID<=1999){
        //             tmpProp.push(this.props[i]);
        //             tmpFoodCnt--;
        //         }
        //         else if(tmpEquipCnt>0&&this.props[i].PropID>=3001&&this.props[i].PropID<=3999){
        //             tmpProp.push(this.props[i]);
        //             tmpEquipCnt--;
        //         }
        //     }
        //     return tmpProp;
        // }
    }

    public GetFetters():common.Fetters[]
    {
        if(this.fetters_info)
        {
            return this.fetters_info;
        }
    }

    public SetCoins(count:number)
    {
        //console.log(`SetCoins coin:${count}`);
        if(count)
        {
            this.coin=count;
        }
    }

    public GetCoins()
    {
        if(this.coin)
        {
            return this.coin
        }
    }

    public SetRoles(data:common.Role[])
    {
        console.log("设置角色信息 SetRoles",data);
        if(data)
        {
            ReadyData.roles=data;
        }
    }
/*
 * 修改for函数参数
 * Editor: Hotaru
 * 2024/04/02
 */
    public GetRole(_id:number)
    {
        try
        {
            console.log("获取角色信息 GetRole",ReadyData.roles);
            for(let i=0;i<ReadyData.roles.length;i++)
            {
                if(null!=ReadyData.roles[i] && ReadyData.roles[i].RoleID==_id)
                {
                    return ReadyData.roles[i];
                }
            }
        }
        catch(error)
        {
            console.error("ReadyData 下的 GetRole 错误：",error);
            return null;
        }
    }

    public GetRolesNumber()
    {
        let num=0;
        if(ReadyData.roles)
        {
            for(let i=0;i<ReadyData.roles.length;i++)
            {
                if(null!=ReadyData.roles[i])
                {
                    num++;
                }
            }
        }
        return num;
    }

    public SetShopData(data:common.ShopData)
    {
        if(data)
        {
            this.shopRoles=data.SaleRoleList;
            this.props=data.SalePropList;
        }
    }

    public async Refresh()
    {
        await singleton.netSingleton.game.refresh();
    }

    public async StartBattle()
    {
        await singleton.netSingleton.game.battle1();
    }

    public async Buy(shop_index: common.ShopIndex,index:number,role_index:number)
    {
        console.log(`shop_index:${shop_index}, index:${index}, role_index:${role_index}`);

        await singleton.netSingleton.game.buy(shop_index,index,role_index);

        let ev = new skill.Event();
        ev.type=EventType.Purchase;
        ev.value=[];
        ev.value.push(this.coin);
    }

    public async Sale(role_index:number)
    {
        await singleton.netSingleton.game.sale_role(role_index);

        let ev = new skill.Event();
        ev.type=EventType.Sold;
        ev.value=[];
        ev.value.push(this.coin);
    }

    public async Move(index_befor:number,index_after:number)
    {
        await singleton.netSingleton.game.move(index_befor,index_after);
    }

    public async Freeze(shop_index: common.ShopIndex,index:number,_isFreeze:boolean)
    {
        await singleton.netSingleton.game.freeze(shop_index,index, _isFreeze);
    }

}


