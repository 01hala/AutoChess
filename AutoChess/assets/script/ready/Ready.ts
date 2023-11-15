/*
 * Ready.ts
 * author: Hotaru
 * 2023/11/11
 */
import { _decorator, Component, Node } from 'cc';
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
    private roles:ShopRole[];

    private coin:number=0;

    //private freezeRoles:Role[]=[];

    private evs:skill.Event[] = [];

    public on_event : ((evs:skill.Event[]) => Promise<void>) = null;

    public constructor(self:common.ShopData) 
    {
        this.roles=self.SaleRoleList;
        this.props=self.SalePropList;
    }

    public GetShopRoles():ShopRole[]
    {
        return this.roles;
    }

    public GetShopProps():ShopProp[]
    {
        return this.props;
    }

    public AddReadyEvent(ev:skill.Event)
    {
        this.evs.push(ev);
    }

    public StartReady()
    {
        singleton.netSingleton.game.cb_battle_info=(battle_info:common.UserBattleData)=>
        {
            this.coin=battle_info.coin;
        }
        singleton.netSingleton.game.cb_shop_info=(shop_info:common.ShopData)=>
        {
            this.roles=shop_info.SaleRoleList;
            this.props=shop_info.SalePropList;
        }

        let ev=new skill.Event();
        ev.type=EventType.RoundStarts;
        this.AddReadyEvent(ev);
    }

    public Refresh()
    {
        singleton.netSingleton.game.refresh();
    }

    public async Buy(shop_index: common.ShopIndex,index:number,role_index:number)
    {
        await singleton.netSingleton.game.buy(shop_index,index,role_index);

        let ev = new skill.Event();
        ev.type=EventType.Purchase;
        ev.value=[];
        ev.value.push(this.coin);
        this.AddReadyEvent(ev);
    }

    public Sale(role_index:number)
    {
        singleton.netSingleton.game.sale_role(role_index);

        let ev = new skill.Event();
        ev.type=EventType.Sold;
        ev.value.push(this.coin);
        this.AddReadyEvent(ev);
    }
}


