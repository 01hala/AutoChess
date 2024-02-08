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

@ccclass('Ready')
export class Ready
{
    private stage:number;
    private props:ShopProp[];
    private shopRoles:ShopRole[];

    private roles:common.Role[];
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

    public GetShopRoles():ShopRole[]
    {
        if(this.shopRoles)
        {
            let tmpRole:ShopRole[]=[];
            let tmpCnt:number;
            switch(this.stage){
                case 1:case 2:tmpCnt=3;break;
                case 3:case 4:tmpCnt=4;break;
                case 5:case 6:tmpCnt=5;break;
            }
            for(let i=0;i<tmpCnt&&i<this.shopRoles.length;i++){
                tmpRole.push(this.shopRoles[i]);
            }
            return tmpRole;
        }
    }

    public GetShopProps():ShopProp[]
    {
        if(this.props)
        {
            let tmpProp:ShopProp[]=[];
            let tmpCnt:number;
            switch(this.stage){
                case 1:case 2:case 3:case 4:tmpCnt=2;break;
                case 5:case 6:tmpCnt=3;break;
            }
            for(let i=0;i<tmpCnt&&i<this.props.length;i++){
                tmpProp.push(this.props[i]);
            }
            return tmpProp;
        }
    }

    public GetFetters():common.Fetters[]
    {
        if(this.fetters_info)
        {
            return this.fetters_info;
        }
    }

    public AddReadyEvent(ev:skill.Event)
    {
        this.evs.push(ev);
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
        if(data)
        {
            this.roles=data;
        }
    }

    public SetShopData(data:common.ShopData)
    {
        if(data)
        {
            this.shopRoles=data.SaleRoleList;
            this.props=data.SalePropList;
        }
    }

    public StartReady()
    {
        let ev=new skill.Event();
        ev.type=EventType.RoundStarts;
        this.AddReadyEvent(ev);
    }

    public async Refresh()
    {
        await singleton.netSingleton.game.refresh();
    }

    public StartBattle()
    {
        singleton.netSingleton.game.battle1();
    }

    public async Buy(shop_index: common.ShopIndex,index:number,role_index:number)
    {
        console.log(`shop_index:${shop_index}, index:${index}, role_index:${role_index}`);

        await singleton.netSingleton.game.buy(shop_index,index,role_index);

        let ev = new skill.Event();
        ev.type=EventType.Purchase;
        ev.value=[];
        ev.value.push(this.coin);
        this.AddReadyEvent(ev);
    }

    public async Sale(role_index:number)
    {
        await singleton.netSingleton.game.sale_role(role_index);

        let ev = new skill.Event();
        ev.type=EventType.Sold;
        ev.value=[];
        ev.value.push(this.coin);
        this.AddReadyEvent(ev);
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


