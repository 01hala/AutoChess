import * as cli from "../serverSDK/client_handle"
import * as common from "../serverSDK/common"
import * as error from "../serverSDK/error"

import * as player_login from "../serverSDK/ccallplayer"
import * as match from "../serverSDK/ccallmatch"

import * as match_c from "../serverSDK/matchcallc"

import { netSingleton } from "./netSingleton"

export class netGame {
    private c_player_battle__caller : player_login.player_battle_caller;
    private c_match : match.plan_caller;
    private c_match_gm : match.gm_caller;

    private match_c : match_c.battle_client_module;

    public cb_battle_victory : (is_victory:boolean) => void;
    public cb_shop_skill_effect : (effect:match_c.ShopSkillEffect) => void;
    public cb_role_buy_merge : (target_role_index:number, target_role:common.Role, is_update:boolean) => void;
    public cb_role_merge : (source_role_index:number, target_role_index:number, target_role:common.Role, is_update:boolean)=>void;
    public cb_role_eat_food : (food_id:number, target_role_index:number, target_role:common.Role, is_update:boolean, is_syncope:boolean)=>void;
    public cb_role_update_refresh_shop : (shop_info:common.ShopData) => void;
    public cb_fetters_info : (info:match_c.Fetters[]) => void;
    public constructor() {
        this.c_player_battle__caller = new player_login.player_battle_caller(cli.cli_handle);
        this.c_match = new match.plan_caller(cli.cli_handle);
        this.c_match_gm = new match.gm_caller(cli.cli_handle);

        this.match_c = new match_c.battle_client_module(cli.cli_handle);
        this.match_c.cb_battle_victory = (is_victory:boolean) => {
            this.cb_battle_victory.call(null, is_victory);
        }
        this.match_c.cb_battle_plan_refresh = (battle_info:common.UserBattleData, shop_info:common.ShopData) => {
            this.cb_start_battle.call(null, battle_info, shop_info);
        }
        this.match_c.cb_refresh = (battle_info:common.UserBattleData, shop_info:common.ShopData) => {
            this.cb_battle_info.call(null, battle_info);
            this.cb_shop_info.call(null, shop_info);
        }
        this.match_c.cb_shop_skill_effect = (effect:match_c.ShopSkillEffect) => {
            if (this.cb_shop_skill_effect) {
                this.cb_shop_skill_effect.call(null, effect);
            }
        }
        this.match_c.cb_role_buy_merge = (target_role_index:number, target_role:common.Role, is_update:boolean) => {
            if (this.cb_role_buy_merge) {
                this.cb_role_buy_merge.call(null, target_role_index, target_role, is_update);
            }
        }
        this.match_c.cb_role_merge = (source_role_index:number, target_role_index:number, target_role:common.Role, is_update:boolean) => {
            if (this.cb_role_merge) {
                this.cb_role_merge.call(null, source_role_index, target_role_index, target_role, is_update);
            }
        }
        this.match_c.cb_role_eat_food = (food_id:number, target_role_index:number, target_role:common.Role, is_update:boolean, is_syncope:boolean) => {
            if (this.cb_role_eat_food) {
                this.cb_role_eat_food.call(null, food_id, target_role_index, target_role, is_update, is_syncope);
            }
        }
        this.match_c.cb_role_update_refresh_shop = (shop_info:common.ShopData) => {
            if (this.cb_role_update_refresh_shop) {
                this.cb_role_update_refresh_shop.call(null, shop_info);
            }
        }
        this.match_c.cb_fetters_info = (info:match_c.Fetters[]) => {
            if (this.cb_fetters_info) {
                this.cb_fetters_info.call(null, info);
            }
        }
    }

    public set_formationf(self:match.RoleSetUp[], target:match.RoleSetUp[]) {
        return this.c_match_gm.get_hub(this.match_name).set_formation(self, target);
    }

    private match_name:string = "";
    //准备阶段
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

    public freeze(shop_index:common.ShopIndex, index:number, is_freeze:boolean) {
        return new Promise<void>((resolve) => {
            this.c_match.get_hub(this.match_name).freeze(shop_index, index, is_freeze).callBack((data:common.ShopData) => {
                this.cb_shop_info.call(null, data);
                resolve();
            }, (err) => {
                console.log("freeze err:", err);
            }).timeout(3000, ()=>{
                console.log("freeze timeout!");
            })
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
        return new Promise<void>((resolve) => {
            this.c_match.get_hub(this.match_name).refresh().callBack((shop_info)=>{
                this.cb_shop_info.call(null, shop_info);
                resolve();
            }, (err)=>{
                console.log("refresh err:", err);
            }).timeout(3000, ()=>{
                console.log("refresh timeout!");
            })
        });
    }
    
    //战斗阶段(测试用)
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
    //战斗阶段
    public battle1() {
        this.c_match.get_hub(this.match_name).start_round1().callBack((self, target)=>{
            this.cb_battle.call(null, self, target);
        }, (err)=>{
            console.log("battle1 err:", err);
        }).timeout(3000, ()=>{
            console.log("battle1 timeout!");
        })
    }

    public confirm_round_victory(is_victory:match.battle_victory) {
        this.c_match.get_hub(this.match_name).confirm_round_victory(is_victory).callBack(()=>{
        }, ()=>{
            console.log("confirm_round_victory err");
        }).timeout(3000, ()=>{
            console.log("confirm_round_victory timeout!");
        })
    }
}