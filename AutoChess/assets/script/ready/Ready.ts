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
const { ccclass, property } = _decorator;

@ccclass('Ready')
export class Ready
{
    private props:ShopProp[];
    private roles:ShopRole[];

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

    public Refresh()
    {
        singleton.netSingleton.game.refresh();
        singleton.netSingleton.game.cb_refresh=(self:common.ShopData)=>
        {
            this.roles=self.SaleRoleList;
            this.props=self.SalePropList;
        }
        
    }
}


