import * as client_handle from "./client_handle";
import * as common from "./common";
/*this enum code is codegen by abelkhan codegen for ts*/

/*this struct code is codegen by abelkhan codegen for typescript*/
export class ShopSkillEffect
{
    public skill_id : number = 0;
    public effect : common.ShopSkillEffectEM = common.ShopSkillEffectEM.AddProperty;
    public value : number[] = [];

}

export function ShopSkillEffect_to_protcol(_struct:ShopSkillEffect){
    return _struct;
}

export function protcol_to_ShopSkillEffect(_protocol:any){
    let _struct = new ShopSkillEffect();
    for (const [key, val] of Object.entries(_protocol)) {
        if (key === "skill_id"){
            _struct.skill_id = val as number;
        }
        else if (key === "effect"){
            _struct.effect = val as common.ShopSkillEffectEM;
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
export class shop_skill_effect_module extends client_handle.imodule {
    public _client_handle:client_handle.client;
    constructor(_client_handle_:client_handle.client){
        super();
        this._client_handle = _client_handle_;
        this._client_handle._modulemng.add_method("shop_skill_effect_shop_skill_effect", this.shop_skill_effect.bind(this));

        this.cb_shop_skill_effect = null;
    }

    public cb_shop_skill_effect : (effect:ShopSkillEffect)=>void | null;
    shop_skill_effect(inArray:any[]){
        let _argv_:any[] = [];
        _argv_.push(protcol_to_ShopSkillEffect(inArray[0]));
        if (this.cb_shop_skill_effect){
            this.cb_shop_skill_effect.apply(null, _argv_);
        }
    }

}
