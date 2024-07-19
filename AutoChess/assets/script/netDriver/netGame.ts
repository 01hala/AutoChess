import * as cli from "../serverSDK/client_handle"
import * as common from "../battle/AutoChessBattle/common"
import * as error from "../serverSDK/error"

import * as player_login from "../serverSDK/ccallplayer"
import * as match from "../serverSDK/ccallmatch"

import * as match_c from "../serverSDK/matchcallc"

import { netSingleton } from "./netSingleton"

export class netGame {
    private c_player_battle__caller : player_login.player_battle_caller;
    private c_player_quest_caller:player_login.player_quest_caller;
    private c_match_gm : match.gm_caller;

    private match_c : match_c.battle_client_module;

    public cb_battle_victory : (mod:common.BattleMod, is_victory:boolean) => void;
    public cb_shop_skill_effect : (effect:match_c.ShopSkillEffect) => void;
    public cb_role_buy_merge : (target_role_index:number, target_role:common.Role, is_update:boolean) => void;
    public cb_role_merge : (source_role_index:number, target_role_index:number, target_role:common.Role, is_update:boolean)=>void;
    public cb_role_eat_food : (food_id:number, target_role_index:number, target_role:common.Role, is_update:boolean, is_syncope:boolean)=>void;
    public cb_role_equip:(equip_id:number,target_role_index:number, target_role:common.Role)=>void;
    public cb_role_update_refresh_shop : (shop_info:common.ShopData) => void;
    public cb_fetters_info : (info:common.Fetters[]) => void;
    public cb_role_skill_update : (role_index:number, _role:common.Role) => void;
    public cb_role_add_property : (battle_info:common.UserBattleData) => void;
    public cb_add_coin : (coin:number) => void;
    public cb_shop_summon : (role_index:number, _role:common.Role) => void;
    public constructor() {
        this.c_player_battle__caller = new player_login.player_battle_caller(cli.cli_handle);
        this.c_player_quest_caller = new player_login.player_quest_caller(cli.cli_handle);
        this.c_match_gm = new match.gm_caller(cli.cli_handle);

        this.match_c = new match_c.battle_client_module(cli.cli_handle);
        this.match_c.cb_battle_victory = (mod:common.BattleMod, is_victory:boolean) => {
            this.cb_battle_victory.call(null, mod, is_victory);
        }
        this.match_c.cb_battle_plan_refresh = (battle_info:common.UserBattleData, shop_info:common.ShopData, fetters_info:common.Fetters[]) => {
            this.cb_start_battle.call(null, battle_info, shop_info, fetters_info);
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
        this.match_c.cb_role_equip = (equip_id:number,target_role_index:number, target_role:common.Role)=>{
            if (this.cb_role_equip) {
                this.cb_role_equip.call(null, equip_id, target_role_index,target_role);
            }
        }
        this.match_c.cb_role_update_refresh_shop = (shop_info:common.ShopData) => {
            if (this.cb_role_update_refresh_shop) {
                this.cb_role_update_refresh_shop.call(null, shop_info);
            }
        }
        this.match_c.cb_fetters_info = (info:common.Fetters[]) => {
            if (this.cb_fetters_info) {
                this.cb_fetters_info.call(null, info);
            }
        }
        this.match_c.cb_role_skill_update = (role_index:number, _role:common.Role) => {
            if (this.cb_role_skill_update) {
                this.cb_role_skill_update.call(null, role_index, _role);
            }
        }
        this.match_c.cb_role_add_property = (battle_info:common.UserBattleData) => {
            if (this.cb_role_add_property) {
                this.cb_role_add_property.call(null, battle_info);
            }
        }
        this.match_c.cb_add_coin = (coin:number) => {
            if (this.cb_add_coin) {
                this.cb_add_coin.call(null, coin);
            }
        }
        this.match_c.cb_shop_summon = (role_index:number, _role:common.Role) => {
            if (this.cb_shop_summon) {
                this.cb_shop_summon.call(null, role_index, _role);
            }
        }
    }

    public set_formationf(self:match.RoleSetUp[], target:match.RoleSetUp[]) {
        return this.c_match_gm.get_hub(this.match_name).set_formation(self, target);
    }

    public match_name:string = "";
    //准备阶段
    public cb_start_battle : (battle_info:common.UserBattleData, shop_info:common.ShopData, fetters_info?:common.Fetters[]) => void;
    public start_battle(mod:common.BattleMod)
    {
        return new Promise((relolve, reject) =>
        {
            this.c_player_battle__caller.get_hub(netSingleton.player.player_name).start_battle(mod).callBack((match_name, battle_info, shop_info) =>
            {
                this.match_name = match_name;
                this.cb_start_battle(battle_info, shop_info, null);
                relolve(null);
            }, (err) =>
            {
                console.log("start_battle err:", err);
                reject("error");
            }).timeout(3000, () =>
            {
                console.log("start_battle timeout!");
                reject("timeout");
            });
        });
    }

    public get_battle_data() {
        return netSingleton.battleshop.c_match.get_hub(this.match_name).get_battle_data();
    }

    public freeze(shop_index: common.ShopIndex, index: number, is_freeze: boolean)
    {
        return new Promise((resolve, reject) =>
        {
            netSingleton.battleshop.c_match.get_hub(this.match_name).freeze(shop_index, index, is_freeze).callBack((data: common.ShopData) =>
            {
                this.cb_shop_info(data);
                resolve(null);
            }, (err) =>
            {
                console.log("freeze err:", err);
                reject("error");
            }).timeout(3000, () =>
            {
                console.log("freeze timeout!");
                reject("timeout");
            })
        });
    }

    public cb_battle_info: (battle_info:common.UserBattleData) => void;
    public cb_shop_info: (shop_info:common.ShopData) => void;
    public buy(shop_index: common.ShopIndex, index: number, role_index: number)
    {
        return new Promise((resolve, reject) =>
        {
            netSingleton.battleshop.buy(this.match_name, shop_index, index, role_index).callBack((battle_info, shop_info) =>
            {
                this.cb_battle_info(battle_info);
                this.cb_shop_info(shop_info);
                resolve(null);
            }, (err) =>
            {
                console.log("buy err:", err);
                reject("error");
            }).timeout(3000, () =>
            {
                console.log("buy timeout!");
                reject("timeout");
            });
        });
    }

    public move(role_index1: number, role_index2: number)
    {
        return new Promise((resolve, reject) =>
        {
            netSingleton.battleshop.move(this.match_name, role_index1, role_index2).callBack((battle_info) =>
            {
                this.cb_battle_info(battle_info);
                resolve(null);
            }, (err) =>
            {
                console.log("move err:", err);
                reject("error");
            }).timeout(3000, () =>
            {
                console.log("move timeout!");
                reject("timeout");
            });
        });
    }

    public sale_role(index: number)
    {
        return new Promise((resolve, reject) =>
        {
            netSingleton.battleshop.sale_role(this.match_name, index).callBack((battle_info) =>
                {
                    this.cb_battle_info(battle_info);
                    resolve(null);
                }, (err) =>
                {
                    console.log("sale_role err:", err);
                    reject("error");
                }).timeout(3000, () =>
                {
                    console.log("sale_role timeout!");
                    reject("timeout");
                });
        });
    }
    
    public refresh()
    {
        return new Promise((resolve, reject) =>
        {
            netSingleton.battleshop.refresh(this.match_name).callBack((shop_info) =>
            {
                this.cb_shop_info.call(null, shop_info);
                resolve(null);
            }, (err) =>
            {
                console.log("refresh err:", err);
                reject("error");
            }).timeout(3000, () =>
            {
                console.log("refresh timeout!");
                reject("timeout");
            })
        });
    }
    
    public cb_battle: (self:common.UserBattleData, target:common.UserBattleData) => void;
    //战斗阶段(测试用)
    public battle_test()
    {
        netSingleton.battleshop.c_match.get_hub(this.match_name).start_round().callBack((self, target) =>
        {
            this.cb_battle.call(null, self, target);
        }, (err) =>
        {
            console.log("battle err:", err);
        }).timeout(3000, () =>
        {
            console.log("battle timeout!");
        });
    }
    //战斗阶段
    public battle()
    {
        return new Promise((relolve, reject) =>
        {
            netSingleton.battleshop.c_match.get_hub(this.match_name).start_round1().callBack((self, target) =>
            {
                this.cb_battle.call(null, self, target);
                relolve(null);
            }, (err) =>
            {
                console.log("battle1 err:", err);
                reject("error")
            }).timeout(3000, () =>
            {
                console.log("battle1 timeout!");
                reject("timeout")
            })
        });
    }

    public confirm_round_victory(is_victory:common.BattleVictory) 
    {
        netSingleton.battleshop.c_match.get_hub(this.match_name).confirm_round_victory(is_victory).callBack(() =>
        {
            console.log("confirm_round_victory succeed!");
        }, () =>
        {
            console.log("confirm_round_victory err");
        }).timeout(3000, () =>
        {
            console.log("confirm_round_victory timeout!");
        })
    }

    //巅峰挑战
    public cb_start_peak_strength:(_selfBattleData:common.UserBattleData)=>void;
    public start_peak_strength()
    {
        return new Promise((relolve, reject)=>
        {
            this.c_player_battle__caller.get_hub(netSingleton.player.player_name).start_peak_strength().callBack((_match_name,_self)=>
                {
                    this.match_name=_match_name;
                    this.cb_start_peak_strength(_self);
                    relolve(null);
                },(_err)=>
                {
                    console.log("start_peak_strength err :",_err);
                    reject("error");
                }).timeout(3000,()=>
                {
                    console.log("start_peak_strength timeout!");
                    reject("timeout");
                })
        });
    }

    //领取成就奖励
    public cb_check_achievement:(achievementReward:common.AchievementReward)=>void;
    public check_achievement(achievement:common.Achievement)
    {
        return new Promise((relolve, reject)=>
        {
            this.c_player_battle__caller.get_hub(netSingleton.player.player_name).check_achievement(achievement).callBack((achievementReward)=>
                {
                    this.cb_check_achievement(achievementReward);
                    relolve(null);
                },(_err)=>
                {
                    console.log("check_achievement err :",_err);
                    reject("error");
                }).timeout(3000,()=>
                {
                    console.log("check_achievement timeout!");
                    reject("timeout");
                })
        });
    }

    //向服务器发送报文：击杀角色
    public kill_Role_ntf(_selfRole:common.Role)
    {
        this.c_player_battle__caller.get_hub(netSingleton.player.player_name).kill_role(_selfRole);
    }
    //向服务器发送报文：达成25金币条件
    public achievement_gold25_ntf()
    {
        this.c_player_battle__caller.get_hub(netSingleton.player.player_name).achievement_gold25();
    }

    //开始pve准备阶段
    public cb_start_quest_ready: (events:number[]) => void;
    public start_quest_ready() 
    {
        return new Promise((resolve,reject)=>
        {
            this.c_player_quest_caller.get_hub(netSingleton.player.player_name).start_quest_ready().callBack((events)=>
            {
                this.cb_start_quest_ready(events);
                resolve(null);
            },(err)=>
            {
                console.log("start_quest_ready err:", err);
                reject("error");
            }).timeout(3000,()=>
            {
                console.log("start_quest_ready timeout");
                reject("timeout");
            });
        });
    }

    //开始pve战斗
    public cb_start_quest_battle: (self:common.UserBattleData, target:common.UserBattleData) => void;
    public start_quest_battle() 
    {
        return new Promise((relolve, reject)=>
        {
            this.c_player_quest_caller.get_hub(netSingleton.player.player_name).start_quest_battle().callBack((self,target)=>
                {
                    this.cb_start_quest_battle(self,target);
                    relolve(null);
                },(err)=>
                {
                    console.log("start_quest_battle err:", err);
                    reject("error");
                }).timeout(3000,()=>
                {
                    console.log("start_quest_battle timeout");
                    reject("timeout");
                });
        });
    }

    
    //获取当前状态
    public cb_get_quest_shop_data:(self:common.UserBattleData , shop_info:common.ShopData)=>void;
    public get_quest_shop_data() 
    {
        return new Promise((resolve,reject)=>
        {
            this.c_player_quest_caller.get_hub(netSingleton.player.player_name).get_quest_shop_data().callBack((self,shop_info)=>
            {
                this.cb_get_quest_shop_data(self,shop_info);
                resolve(null);
            },(err)=>
            {
                console.log("get_quest_shop_data err:", err);
                reject("error");
            }).timeout(3000,()=>
            {
                console.log("get_quest_shop_data timeout");
                reject("timeout");
            });
        });
    }

    
    //选择随机事件
    public start_quest_shop(eventID:number) 
    {
        return new Promise((resolve,reject)=>
        {
            this.c_player_quest_caller.get_hub(netSingleton.player.player_name).start_quest_shop(eventID).callBack((self,shop_info)=>
            {
                this.cb_get_quest_shop_data(self,shop_info);
                resolve(null);
            },(err)=>
            {
                console.log("start_quest_shop err:", err);
                reject("error");
            }).timeout(3000,()=>
            {
                console.log("start_quest_shop timeout");
                reject("timeout");
            });
        });
    }

    public cb_quest_battle_info: (battle_info: common.UserBattleData) => void;
    public cb_quest_shop_info: (shop_info: common.ShopData) => void;
    //购买角色
    public quest_buy(shop_index: common.ShopIndex, index: number, role_index: number)
    {
        return new Promise((resolve, reject) =>
        {
            netSingleton.battleshop.buy(netSingleton.player.player_name, shop_index, index, role_index).callBack((battle_info, shop_info) =>
            {
                this.cb_quest_battle_info(battle_info);
                this.cb_quest_shop_info(shop_info);
                resolve(null);
            }, (err) =>
            {
                console.log("buy err:", err);
                reject("error");
            }).timeout(3000, () =>
            {
                console.log("buy timeout!");
                reject("timeout");
            })
        });
    }
    //移动角色
    public quest_move(role_index1: number, role_index2: number)
    {
        return new Promise((resolve, reject) =>
        {
            netSingleton.battleshop.move(netSingleton.player.player_name, role_index1, role_index2).callBack((battle_info) =>
            {
                this.cb_quest_battle_info(battle_info);
                resolve(null);
            }, (err) =>
            {
                console.log("move err:", err);
                reject("error");
            }).timeout(3000, () =>
            {
                console.log("move timeout!");
                reject("timeout");
            });
        });
    }
    //出售角色
    public quest_sale_role(index: number)
    {
        return new Promise((resolve, reject) =>
        {
            netSingleton.battleshop.sale_role(netSingleton.player.player_name, index).callBack((battle_info) =>
            {
                this.cb_quest_battle_info(battle_info);
                resolve(null);
            }, (err) =>
            {
                console.log("sale_role err:", err);
                reject("error");
            }).timeout(3000, () =>
            {
                console.log("sale_role timeout!");
                reject("timeout");
            });
        });
    }
    //刷新商店
    public quest_refresh()
    {
        return new Promise((resolve, reject) =>
        {
            netSingleton.battleshop.refresh(netSingleton.player.player_name).callBack((shop_info) =>
            {
                this.cb_quest_shop_info(shop_info);
                resolve(null);
            }, (err) =>
            {
                console.log("refresh err:", err);
                reject("error");
            }).timeout(3000, () =>
            {
                console.log("refresh timeout!");
                reject("timeout");
            })
        });
    }
    //向服务器发送对战信息
    public confirm_quest_victory(is_victory:common.BattleVictory) 
    {
        return new Promise((resolve,reject)=>
        {
            this.c_player_quest_caller.get_hub(netSingleton.player.player_name).confirm_quest_victory(is_victory).callBack((state)=>
            {
                console.log("confirm_quest_victory succeed!");
                resolve(state);
            },()=>
            {
                console.log("confirm_quest_victory err");
                reject("error");
            }).timeout(3000,()=>
            {
                console.log("confirm_quest_victory timeout");
                reject("timeout");
            });
        });
    }

}