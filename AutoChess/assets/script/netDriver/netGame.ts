import * as cli from "../serverSDK/client_handle"
import * as common from "../serverSDK/common"
import * as error from "../serverSDK/error"

import * as player_login from "../serverSDK/ccallplayer"
import * as match from "../serverSDK/ccallmatch"

import { netSingleton } from "./netSingleton"

export class netGame {
    private c_player_battle__caller : player_login.player_battle_caller;
    private c_match : match.plan_caller;

    public constructor() {
        this.c_player_battle__caller = new player_login.player_battle_caller(cli.cli_handle);
        this.c_match = new match.plan_caller(cli.cli_handle);
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

    public cb_buy: (battle_info:common.UserBattleData, shop_info:common.ShopData) => void;
    public buy(shop_index:common.ShopIndex, index:number) {
        this.c_match.get_hub(this.match_name).buy(shop_index, index).callBack((battle_info, shop_info)=>{
            this.cb_buy.call(null, battle_info, shop_info);
        }, (err)=>{
            console.log("buy err:", err);
        }).timeout(3000, ()=>{
            console.log("buy timeout!");
        })
    }

    public cb_sale_role: (battle_info:common.UserBattleData) => void;
    public sale_role(index:number) {
        this.c_match.get_hub(this.match_name).sale_role(index).callBack((battle_info)=>{
            this.cb_sale_role.call(null, battle_info);
        }, (err)=>{
            console.log("sale_role err:", err);
        }).timeout(3000, ()=>{
            console.log("sale_role timeout!");
        })
    }
    
    public cb_refresh: (shop_info:common.ShopData) => void;
    public refresh() {
        this.c_match.get_hub(this.match_name).refresh().callBack((shop_info)=>{
            this.cb_refresh.call(null, shop_info);
        }, (err)=>{
            console.log("refresh err:", err);
        }).timeout(3000, ()=>{
            console.log("refresh timeout!");
        })
    }
    
    public cb_battle: (self:common.UserBattleData, target:common.UserBattleData, random:number[], is_victory:boolean) => void;
    public battle() {
        this.c_match.get_hub(this.match_name).start_battle().callBack((self, target, random, is_victory)=>{
            this.cb_battle.call(null, self, target, random, is_victory);
        }, (err)=>{
            console.log("battle err:", err);
        }).timeout(3000, ()=>{
            console.log("battle timeout!");
        })
    }
}