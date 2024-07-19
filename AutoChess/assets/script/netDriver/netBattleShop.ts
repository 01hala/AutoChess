import * as cli from "../serverSDK/client_handle"
import * as common from "../battle/AutoChessBattle/common"
import * as error from "../serverSDK/error"

import * as player_login from "../serverSDK/ccallplayer"
import * as match from "../serverSDK/ccallmatch"

import * as match_c from "../serverSDK/matchcallc"

import { netSingleton } from "./netSingleton"

export class netBattleShop {
    public c_match : match.plan_caller;

    public constructor() {
        this.c_match = new match.plan_caller(cli.cli_handle);
    }

    public buy(hub_name:string, shop_index:common.ShopIndex, index:number, role_index:number) {
        return this.c_match.get_hub(hub_name).buy(shop_index, index, role_index);
    }

    public move(hub_name:string, role_index1:number, role_index2:number) {
        return this.c_match.get_hub(hub_name).move(role_index1, role_index2);
    }

    public sale_role(hub_name:string, index:number) {
        return this.c_match.get_hub(hub_name).sale_role(index);
    }
    
    public refresh(hub_name:string) {
        return this.c_match.get_hub(hub_name).refresh();
    }
}