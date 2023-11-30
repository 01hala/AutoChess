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
    private props:ShopProp[];
    private shopRoles:ShopRole[];

    private roles:common.Role[];

    public coin:number=0;

    //private freezeRoles:Role[]=[];

    private evs:skill.Event[] = [];

    public on_event : ((evs:skill.Event[]) => Promise<void>) = null;

    public constructor(battle_info:common.UserBattleData, self:common.ShopData) 
    {
        this.coin = battle_info.coin;

        this.shopRoles=self.SaleRoleList;
        this.props=self.SalePropList;

        console.log("shopRoles:", this.shopRoles);
        console.log("props:", this.props);
    }

    public GetShopRoles():ShopRole[]
    {
        return this.shopRoles;
    }

    public GetShopProps():ShopProp[]
    {
        return this.props;
    }

    public AddReadyEvent(ev:skill.Event)
    {
        this.evs.push(ev);
    }

    public SetCoins(count:number)
    {
        console.log(`SetCoins coin:${count}`);
        if(count)
        {
            this.coin=count;
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

    public Refresh()
    {
        singleton.netSingleton.game.refresh();
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

}


