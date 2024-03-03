import * as client_handle from "./client_handle";
import * as common from "./common";
/*this enum code is codegen by abelkhan codegen for ts*/

/*this struct code is codegen by abelkhan codegen for typescript*/
export class ShopSkillEffect
{
    public spellcaster : number = 0;
    public recipient : number[] = [];
    public skill_id : number = 0;
    public effect : common.SkillEffectEM = common.SkillEffectEM.AddProperty;
    public value : number[] = [];

}

export function ShopSkillEffect_to_protcol(_struct:ShopSkillEffect){
    return _struct;
}

export function protcol_to_ShopSkillEffect(_protocol:any){
    if (_protocol == null) {
        return null;
    }

    let _struct = new ShopSkillEffect();
    for (const [key, val] of Object.entries(_protocol)) {
        if (key === "spellcaster"){
            _struct.spellcaster = val as number;
        }
        else if (key === "recipient"){
            _struct.recipient = [];
            for(let v_ of val as any) {
                _struct.recipient.push(v_);
            }
        }
        else if (key === "skill_id"){
            _struct.skill_id = val as number;
        }
        else if (key === "effect"){
            _struct.effect = val as common.SkillEffectEM;
        }
        else if (key === "value"){
            _struct.value = [];
            for(let v_ of val as any) {
                _struct.value.push(v_);
            }
        }
    }
    return _struct;
}

/*this module code is codegen by abelkhan codegen for typescript*/
export class battle_client_module extends client_handle.imodule {
    public _client_handle:client_handle.client;
    constructor(_client_handle_:client_handle.client){
        super();
        this._client_handle = _client_handle_;
        this._client_handle._modulemng.add_method("battle_client_battle_victory", this.battle_victory.bind(this));
        this._client_handle._modulemng.add_method("battle_client_battle_plan_refresh", this.battle_plan_refresh.bind(this));
        this._client_handle._modulemng.add_method("battle_client_shop_skill_effect", this.shop_skill_effect.bind(this));
        this._client_handle._modulemng.add_method("battle_client_refresh", this.refresh.bind(this));
        this._client_handle._modulemng.add_method("battle_client_role_buy_merge", this.role_buy_merge.bind(this));
        this._client_handle._modulemng.add_method("battle_client_role_merge", this.role_merge.bind(this));
        this._client_handle._modulemng.add_method("battle_client_role_eat_food", this.role_eat_food.bind(this));
        this._client_handle._modulemng.add_method("battle_client_role_equip", this.role_equip.bind(this));
        this._client_handle._modulemng.add_method("battle_client_role_update_refresh_shop", this.role_update_refresh_shop.bind(this));
        this._client_handle._modulemng.add_method("battle_client_fetters_info", this.fetters_info.bind(this));
        this._client_handle._modulemng.add_method("battle_client_role_skill_update", this.role_skill_update.bind(this));
        this._client_handle._modulemng.add_method("battle_client_role_add_property", this.role_add_property.bind(this));
        this._client_handle._modulemng.add_method("battle_client_add_coin", this.add_coin.bind(this));
        this._client_handle._modulemng.add_method("battle_client_shop_summon", this.shop_summon.bind(this));

        this.cb_battle_victory = null;
        this.cb_battle_plan_refresh = null;
        this.cb_shop_skill_effect = null;
        this.cb_refresh = null;
        this.cb_role_buy_merge = null;
        this.cb_role_merge = null;
        this.cb_role_eat_food = null;
        this.cb_role_equip = null;
        this.cb_role_update_refresh_shop = null;
        this.cb_fetters_info = null;
        this.cb_role_skill_update = null;
        this.cb_role_add_property = null;
        this.cb_add_coin = null;
        this.cb_shop_summon = null;
    }

    public cb_battle_victory : (is_victory:boolean)=>void | null;
    battle_victory(inArray:any[]){
        let _argv_:any[] = [];
        _argv_.push(inArray[0]);
        if (this.cb_battle_victory){
            this.cb_battle_victory.apply(null, _argv_);
        }
    }

    public cb_battle_plan_refresh : (battle_info:common.UserBattleData, shop_info:common.ShopData, fetters_info:common.Fetters[])=>void | null;
    battle_plan_refresh(inArray:any[]){
        let _argv_:any[] = [];
        _argv_.push(common.protcol_to_UserBattleData(inArray[0]));
        _argv_.push(common.protcol_to_ShopData(inArray[1]));
        let _array_:any[] = [];
        for(let v_ of inArray[2]){
            _array_.push(common.protcol_to_Fetters(v_));
        }
        _argv_.push(_array_);
        if (this.cb_battle_plan_refresh){
            this.cb_battle_plan_refresh.apply(null, _argv_);
        }
    }

    public cb_shop_skill_effect : (effect:ShopSkillEffect)=>void | null;
    shop_skill_effect(inArray:any[]){
        let _argv_:any[] = [];
        _argv_.push(protcol_to_ShopSkillEffect(inArray[0]));
        if (this.cb_shop_skill_effect){
            this.cb_shop_skill_effect.apply(null, _argv_);
        }
    }

    public cb_refresh : (battle_info:common.UserBattleData, info:common.ShopData)=>void | null;
    refresh(inArray:any[]){
        let _argv_:any[] = [];
        _argv_.push(common.protcol_to_UserBattleData(inArray[0]));
        _argv_.push(common.protcol_to_ShopData(inArray[1]));
        if (this.cb_refresh){
            this.cb_refresh.apply(null, _argv_);
        }
    }

    public cb_role_buy_merge : (target_role_index:number, target_role:common.Role, is_update:boolean)=>void | null;
    role_buy_merge(inArray:any[]){
        let _argv_:any[] = [];
        _argv_.push(inArray[0]);
        _argv_.push(common.protcol_to_Role(inArray[1]));
        _argv_.push(inArray[2]);
        if (this.cb_role_buy_merge){
            this.cb_role_buy_merge.apply(null, _argv_);
        }
    }

    public cb_role_merge : (source_role_index:number, target_role_index:number, target_role:common.Role, is_update:boolean)=>void | null;
    role_merge(inArray:any[]){
        let _argv_:any[] = [];
        _argv_.push(inArray[0]);
        _argv_.push(inArray[1]);
        _argv_.push(common.protcol_to_Role(inArray[2]));
        _argv_.push(inArray[3]);
        if (this.cb_role_merge){
            this.cb_role_merge.apply(null, _argv_);
        }
    }

    public cb_role_eat_food : (food_id:number, target_role_index:number, target_role:common.Role, is_update:boolean, is_syncope:boolean)=>void | null;
    role_eat_food(inArray:any[]){
        let _argv_:any[] = [];
        _argv_.push(inArray[0]);
        _argv_.push(inArray[1]);
        _argv_.push(common.protcol_to_Role(inArray[2]));
        _argv_.push(inArray[3]);
        _argv_.push(inArray[4]);
        if (this.cb_role_eat_food){
            this.cb_role_eat_food.apply(null, _argv_);
        }
    }

    public cb_role_equip : (quip_id:number, target_role_index:number, target_role:common.Role)=>void | null;
    role_equip(inArray:any[]){
        let _argv_:any[] = [];
        _argv_.push(inArray[0]);
        _argv_.push(inArray[1]);
        _argv_.push(common.protcol_to_Role(inArray[2]));
        if (this.cb_role_equip){
            this.cb_role_equip.apply(null, _argv_);
        }
    }

    public cb_role_update_refresh_shop : (info:common.ShopData)=>void | null;
    role_update_refresh_shop(inArray:any[]){
        let _argv_:any[] = [];
        _argv_.push(common.protcol_to_ShopData(inArray[0]));
        if (this.cb_role_update_refresh_shop){
            this.cb_role_update_refresh_shop.apply(null, _argv_);
        }
    }

    public cb_fetters_info : (info:common.Fetters[])=>void | null;
    fetters_info(inArray:any[]){
        let _argv_:any[] = [];
        let _array_:any[] = [];
        for(let v_ of inArray[0]){
            _array_.push(common.protcol_to_Fetters(v_));
        }
        _argv_.push(_array_);
        if (this.cb_fetters_info){
            this.cb_fetters_info.apply(null, _argv_);
        }
    }

    public cb_role_skill_update : (role_index:number, _role:common.Role)=>void | null;
    role_skill_update(inArray:any[]){
        let _argv_:any[] = [];
        _argv_.push(inArray[0]);
        _argv_.push(common.protcol_to_Role(inArray[1]));
        if (this.cb_role_skill_update){
            this.cb_role_skill_update.apply(null, _argv_);
        }
    }

    public cb_role_add_property : (battle_info:common.UserBattleData)=>void | null;
    role_add_property(inArray:any[]){
        let _argv_:any[] = [];
        _argv_.push(common.protcol_to_UserBattleData(inArray[0]));
        if (this.cb_role_add_property){
            this.cb_role_add_property.apply(null, _argv_);
        }
    }

    public cb_add_coin : (coin:number)=>void | null;
    add_coin(inArray:any[]){
        let _argv_:any[] = [];
        _argv_.push(inArray[0]);
        if (this.cb_add_coin){
            this.cb_add_coin.apply(null, _argv_);
        }
    }

    public cb_shop_summon : (role_index:number, _role:common.Role)=>void | null;
    shop_summon(inArray:any[]){
        let _argv_:any[] = [];
        _argv_.push(inArray[0]);
        _argv_.push(common.protcol_to_Role(inArray[1]));
        if (this.cb_shop_summon){
            this.cb_shop_summon.apply(null, _argv_);
        }
    }

}
