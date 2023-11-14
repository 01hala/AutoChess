import * as cli from "../serverSDK/client_handle"
import * as common from "../serverSDK/common"
import * as error from "../serverSDK/error"

import * as player_login from "../serverSDK/ccallplayer"
import * as match from "../serverSDK/ccallmatch"

import { netSingleton } from "./netSingleton"

export class netGame {
    private c_player_battle__caller : player_login.player_battle_caller;
    private c_match : match.plan_caller;
    private c_match_gm : match.gm_caller;

    public constructor() {
        this.c_player_battle__caller = new player_login.player_battle_caller(cli.cli_handle);
        this.c_match = new match.plan_caller(cli.cli_handle);
        this.c_match_gm = new match.gm_caller(cli.cli_handle);
    }

    public set_formationf(self:match.RoleSetUp[], target:match.RoleSetUp[]) {
        return this.c_match_gm.get_hub(this.match_name).set_formation(self, target);
    }

    private match_name:string = "";
    public cb_start_battle : (battle_info:common.UserBattleData, shop_info:common.ShopData) => void;
    public start_battle() {
        this.c_player_battle__caller.get_hub(netSingleton.player.player_name).start_battle().callBack((match_name, battle_info, shop_info)=>{
            this.match_name = match_name;
            this.cb_start_battle.call(null, battle_info, shop_info);
        }, (err)=>{
            console.log("start_battle err:", err);
        }).timeout(3000, ()=>{
            console.log("start_battle timeout!");
        });
    }

    public cb_battle_info: (battle_info:common.UserBattleData) => void;
    public cb_shop_info: (shop_info:common.ShopData) => void;
    public buy(shop_index:common.ShopIndex, index:number, role_index:number) {
        this.c_match.get_hub(this.match_name).buy(shop_index, index, role_index).callBack((battle_info, shop_info)=>{
            this.cb_battle_info.call(null, battle_info);
            this.cb_shop_info.call(null, shop_info);
        }, (err)=>{
            console.log("buy err:", err);
        }).timeout(3000, ()=>{
            console.log("buy timeout!");
        })
    }

    public move(role_index1:number, role_index2:number) {
        this.c_match.get_hub(this.match_name).move(role_index1, role_index2).callBack((battle_info)=>{
            this.cb_battle_info.call(null, battle_info);
        }, (err)=>{
            console.log("move err:", err);
        }).timeout(3000, ()=>{
            console.log("move timeout!");
        })
    }

    public sale_role(index:number) {
        this.c_match.get_hub(this.match_name).sale_role(index).callBack((battle_info)=>{
            this.cb_battle_info.call(null, battle_info);
        }, (err)=>{
            console.log("sale_role err:", err);
        }).timeout(3000, ()=>{
            console.log("sale_role timeout!");
        })
    }
    
    public refresh() {
        this.c_match.get_hub(this.match_name).refresh().callBack((shop_info)=>{
            this.cb_shop_info.call(null, shop_info);
        }, (err)=>{
            console.log("refresh err:", err);
        }).timeout(3000, ()=>{
            console.log("refresh timeout!");
        })
    }
    
    public cb_battle: (self:common.UserBattleData, target:common.UserBattleData) => void;
    public battle() {
        this.c_match.get_hub(this.match_name).start_round().callBack((self, target)=>{
            this.cb_battle.call(null, self, target);
        }, (err)=>{
            console.log("battle err:", err);
        }).timeout(3000, ()=>{
            console.log("battle timeout!");
        })
    }

    public battle1() {
        this.c_match.get_hub(this.match_name).start_round1().callBack((self, target)=>{
            this.cb_battle.call(null, self, target);
        }, (err)=>{
            console.log("battle1 err:", err);
        }).timeout(3000, ()=>{
            console.log("battle1 timeout!");
        })
    }

    public confirm_round_victory(is_victory:boolean) {
        this.c_match.get_hub(this.match_name).confirm_round_victory(is_victory).callBack(()=>{
        }, ()=>{
            console.log("confirm_round_victory err");
        }).timeout(3000, ()=>{
            console.log("confirm_round_victory timeout!");
        })
    }
}