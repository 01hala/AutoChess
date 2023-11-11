/*
 * Ready.ts
 * author: Hotaru
 * 2023/11/11
 */

import { _decorator, Component, Node } from 'cc';
import * as skill from '../battle/skill/skill_base'
import * as common from "../serverSDK/common"
import { Role,ShopProp } from '../serverSDK/common';
const { ccclass, property } = _decorator;

@ccclass('Ready')
export class Ready
{
    private props:ShopProp[];
    private roles:Role[];

    private freezeRoles:Role[]=[];

    private evs:skill.Event[] = [];

    public on_event : ((evs:skill.Event[]) => Promise<void>) = null;

    public constructor(self:common.ShopData) 
    {
        
    }

    public GetShopRoles():Role[]
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

    }
}


