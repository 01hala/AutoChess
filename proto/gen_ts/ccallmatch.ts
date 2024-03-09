import * as client_handle from "./client_handle";
import * as common from "./common";
/*this enum code is codegen by abelkhan codegen for ts*/

export enum battle_victory{
    faild = -1,
    tie = 0,
    victory = 1
}

/*this struct code is codegen by abelkhan codegen for typescript*/
export class RoleSetUp
{
    public RoleID : number = 0;
    public Level : number = 0;

}

export function RoleSetUp_to_protcol(_struct:RoleSetUp){
    return _struct;
}

export function protcol_to_RoleSetUp(_protocol:any){
    if (_protocol == null) {
        return null;
    }

    let _struct = new RoleSetUp();
    for (const [key, val] of Object.entries(_protocol)) {
        if (key === "RoleID"){
            _struct.RoleID = val as number;
        }
        else if (key === "Level"){
            _struct.Level = val as number;
        }
    }
    return _struct;
}

/*this caller code is codegen by abelkhan codegen for typescript*/
export class gm_set_formation_cb{
    private cb_uuid : number;
    private module_rsp_cb : gm_rsp_cb;

    public event_set_formation_handle_cb : ()=>void | null;
    public event_set_formation_handle_err : (err:number)=>void | null;
    public event_set_formation_handle_timeout : ()=>void | null;
    constructor(_cb_uuid : number, _module_rsp_cb : gm_rsp_cb){
        this.cb_uuid = _cb_uuid;
        this.module_rsp_cb = _module_rsp_cb;
        this.event_set_formation_handle_cb = null;
        this.event_set_formation_handle_err = null;
        this.event_set_formation_handle_timeout = null;
    }

    callBack(_cb:()=>void, _err:(err:number)=>void)
    {
        this.event_set_formation_handle_cb = _cb;
        this.event_set_formation_handle_err = _err;
        return this;
    }

    timeout(tick:number, timeout_cb:()=>void)
    {
        setTimeout(()=>{ this.module_rsp_cb.set_formation_timeout(this.cb_uuid); }, tick);
        this.event_set_formation_handle_timeout = timeout_cb;
    }

}

/*this cb code is codegen by abelkhan for ts*/
export class gm_rsp_cb extends client_handle.imodule {
    public map_set_formation:Map<number, gm_set_formation_cb>;
    constructor(modules:client_handle.modulemng){
        super();
        this.map_set_formation = new Map<number, gm_set_formation_cb>();
        modules.add_method("gm_rsp_cb_set_formation_rsp", this.set_formation_rsp.bind(this));
        modules.add_method("gm_rsp_cb_set_formation_err", this.set_formation_err.bind(this));
    }
    public set_formation_rsp(inArray:any[]){
        let uuid = inArray[0];
        let _argv_7fae5a4d_9f93_3cc2_9421_f25db2a4e0b4:any[] = [];
        var rsp = this.try_get_and_del_set_formation_cb(uuid);
        if (rsp && rsp.event_set_formation_handle_cb) {
            rsp.event_set_formation_handle_cb.apply(null, _argv_7fae5a4d_9f93_3cc2_9421_f25db2a4e0b4);
        }
    }

    public set_formation_err(inArray:any[]){
        let uuid = inArray[0];
        let _argv_7fae5a4d_9f93_3cc2_9421_f25db2a4e0b4:any[] = [];
        _argv_7fae5a4d_9f93_3cc2_9421_f25db2a4e0b4.push(inArray[1]);
        var rsp = this.try_get_and_del_set_formation_cb(uuid);
        if (rsp && rsp.event_set_formation_handle_err) {
            rsp.event_set_formation_handle_err.apply(null, _argv_7fae5a4d_9f93_3cc2_9421_f25db2a4e0b4);
        }
    }

    public set_formation_timeout(cb_uuid : number){
        let rsp = this.try_get_and_del_set_formation_cb(cb_uuid);
        if (rsp){
            if (rsp.event_set_formation_handle_timeout) {
                rsp.event_set_formation_handle_timeout.apply(null);
            }
        }
    }

    private try_get_and_del_set_formation_cb(uuid : number){
        var rsp = this.map_set_formation.get(uuid);
        this.map_set_formation.delete(uuid);
        return rsp;
    }

}

let rsp_cb_gm_handle : gm_rsp_cb | null = null;
export class gm_caller {
    private _hubproxy:gm_hubproxy;
    constructor(_client:client_handle.client){
        if (rsp_cb_gm_handle == null){
            rsp_cb_gm_handle = new gm_rsp_cb(_client._modulemng);
        }
        this._hubproxy = new gm_hubproxy(_client);
    }

    public get_hub(hub_name:string)
    {
        this._hubproxy.hub_name_1008a118_0d3f_3753_8a26_27a821a2c67a = hub_name;
        return this._hubproxy;
    }

}

export class gm_hubproxy
{
    private uuid_1008a118_0d3f_3753_8a26_27a821a2c67a : number = Math.round(Math.random() * 1000);

    public hub_name_1008a118_0d3f_3753_8a26_27a821a2c67a:string;
    private _client_handle:client_handle.client;

    constructor(client_handle_:client_handle.client)
    {
        this._client_handle = client_handle_;
    }

    public set_formation(self:RoleSetUp[], target:RoleSetUp[]){
        let uuid_8d9bac12_4a33_5bf1_8982_b111c06cf07a = Math.round(this.uuid_1008a118_0d3f_3753_8a26_27a821a2c67a++);

        let _argv_7fae5a4d_9f93_3cc2_9421_f25db2a4e0b4:any[] = [uuid_8d9bac12_4a33_5bf1_8982_b111c06cf07a];
        let _array_809515b8_3e31_3feb_a08c_462fee09f6ef:any[] = [];        for(let v_f28d998e_a4db_5715_ae88_a209524e50aa of self){
            _array_809515b8_3e31_3feb_a08c_462fee09f6ef.push(RoleSetUp_to_protcol(v_f28d998e_a4db_5715_ae88_a209524e50aa));
        }
        _argv_7fae5a4d_9f93_3cc2_9421_f25db2a4e0b4.push(_array_809515b8_3e31_3feb_a08c_462fee09f6ef);
        let _array_2cf141ee_a36d_3d58_a9b6_a4febe931c68:any[] = [];        for(let v_9eb21ec2_86d8_5305_9ade_1618c199442b of target){
            _array_2cf141ee_a36d_3d58_a9b6_a4febe931c68.push(RoleSetUp_to_protcol(v_9eb21ec2_86d8_5305_9ade_1618c199442b));
        }
        _argv_7fae5a4d_9f93_3cc2_9421_f25db2a4e0b4.push(_array_2cf141ee_a36d_3d58_a9b6_a4febe931c68);
        this._client_handle.call_hub(this.hub_name_1008a118_0d3f_3753_8a26_27a821a2c67a, "gm_set_formation", _argv_7fae5a4d_9f93_3cc2_9421_f25db2a4e0b4);
        let cb_set_formation_obj = new gm_set_formation_cb(uuid_8d9bac12_4a33_5bf1_8982_b111c06cf07a, rsp_cb_gm_handle);
        if (rsp_cb_gm_handle){
            rsp_cb_gm_handle.map_set_formation.set(uuid_8d9bac12_4a33_5bf1_8982_b111c06cf07a, cb_set_formation_obj);
        }
        return cb_set_formation_obj;
    }

}
export class plan_buy_cb{
    private cb_uuid : number;
    private module_rsp_cb : plan_rsp_cb;

    public event_buy_handle_cb : (battle_info:common.UserBattleData, shop_info:common.ShopData)=>void | null;
    public event_buy_handle_err : (err:number)=>void | null;
    public event_buy_handle_timeout : ()=>void | null;
    constructor(_cb_uuid : number, _module_rsp_cb : plan_rsp_cb){
        this.cb_uuid = _cb_uuid;
        this.module_rsp_cb = _module_rsp_cb;
        this.event_buy_handle_cb = null;
        this.event_buy_handle_err = null;
        this.event_buy_handle_timeout = null;
    }

    callBack(_cb:(battle_info:common.UserBattleData, shop_info:common.ShopData)=>void, _err:(err:number)=>void)
    {
        this.event_buy_handle_cb = _cb;
        this.event_buy_handle_err = _err;
        return this;
    }

    timeout(tick:number, timeout_cb:()=>void)
    {
        setTimeout(()=>{ this.module_rsp_cb.buy_timeout(this.cb_uuid); }, tick);
        this.event_buy_handle_timeout = timeout_cb;
    }

}

export class plan_move_cb{
    private cb_uuid : number;
    private module_rsp_cb : plan_rsp_cb;

    public event_move_handle_cb : (info:common.UserBattleData)=>void | null;
    public event_move_handle_err : (err:number)=>void | null;
    public event_move_handle_timeout : ()=>void | null;
    constructor(_cb_uuid : number, _module_rsp_cb : plan_rsp_cb){
        this.cb_uuid = _cb_uuid;
        this.module_rsp_cb = _module_rsp_cb;
        this.event_move_handle_cb = null;
        this.event_move_handle_err = null;
        this.event_move_handle_timeout = null;
    }

    callBack(_cb:(info:common.UserBattleData)=>void, _err:(err:number)=>void)
    {
        this.event_move_handle_cb = _cb;
        this.event_move_handle_err = _err;
        return this;
    }

    timeout(tick:number, timeout_cb:()=>void)
    {
        setTimeout(()=>{ this.module_rsp_cb.move_timeout(this.cb_uuid); }, tick);
        this.event_move_handle_timeout = timeout_cb;
    }

}

export class plan_sale_role_cb{
    private cb_uuid : number;
    private module_rsp_cb : plan_rsp_cb;

    public event_sale_role_handle_cb : (info:common.UserBattleData)=>void | null;
    public event_sale_role_handle_err : (err:number)=>void | null;
    public event_sale_role_handle_timeout : ()=>void | null;
    constructor(_cb_uuid : number, _module_rsp_cb : plan_rsp_cb){
        this.cb_uuid = _cb_uuid;
        this.module_rsp_cb = _module_rsp_cb;
        this.event_sale_role_handle_cb = null;
        this.event_sale_role_handle_err = null;
        this.event_sale_role_handle_timeout = null;
    }

    callBack(_cb:(info:common.UserBattleData)=>void, _err:(err:number)=>void)
    {
        this.event_sale_role_handle_cb = _cb;
        this.event_sale_role_handle_err = _err;
        return this;
    }

    timeout(tick:number, timeout_cb:()=>void)
    {
        setTimeout(()=>{ this.module_rsp_cb.sale_role_timeout(this.cb_uuid); }, tick);
        this.event_sale_role_handle_timeout = timeout_cb;
    }

}

export class plan_refresh_cb{
    private cb_uuid : number;
    private module_rsp_cb : plan_rsp_cb;

    public event_refresh_handle_cb : (info:common.ShopData)=>void | null;
    public event_refresh_handle_err : (err:number)=>void | null;
    public event_refresh_handle_timeout : ()=>void | null;
    constructor(_cb_uuid : number, _module_rsp_cb : plan_rsp_cb){
        this.cb_uuid = _cb_uuid;
        this.module_rsp_cb = _module_rsp_cb;
        this.event_refresh_handle_cb = null;
        this.event_refresh_handle_err = null;
        this.event_refresh_handle_timeout = null;
    }

    callBack(_cb:(info:common.ShopData)=>void, _err:(err:number)=>void)
    {
        this.event_refresh_handle_cb = _cb;
        this.event_refresh_handle_err = _err;
        return this;
    }

    timeout(tick:number, timeout_cb:()=>void)
    {
        setTimeout(()=>{ this.module_rsp_cb.refresh_timeout(this.cb_uuid); }, tick);
        this.event_refresh_handle_timeout = timeout_cb;
    }

}

export class plan_freeze_cb{
    private cb_uuid : number;
    private module_rsp_cb : plan_rsp_cb;

    public event_freeze_handle_cb : (info:common.ShopData)=>void | null;
    public event_freeze_handle_err : (err:number)=>void | null;
    public event_freeze_handle_timeout : ()=>void | null;
    constructor(_cb_uuid : number, _module_rsp_cb : plan_rsp_cb){
        this.cb_uuid = _cb_uuid;
        this.module_rsp_cb = _module_rsp_cb;
        this.event_freeze_handle_cb = null;
        this.event_freeze_handle_err = null;
        this.event_freeze_handle_timeout = null;
    }

    callBack(_cb:(info:common.ShopData)=>void, _err:(err:number)=>void)
    {
        this.event_freeze_handle_cb = _cb;
        this.event_freeze_handle_err = _err;
        return this;
    }

    timeout(tick:number, timeout_cb:()=>void)
    {
        setTimeout(()=>{ this.module_rsp_cb.freeze_timeout(this.cb_uuid); }, tick);
        this.event_freeze_handle_timeout = timeout_cb;
    }

}

export class plan_start_round_cb{
    private cb_uuid : number;
    private module_rsp_cb : plan_rsp_cb;

    public event_start_round_handle_cb : (self:common.UserBattleData, target:common.UserBattleData)=>void | null;
    public event_start_round_handle_err : (err:number)=>void | null;
    public event_start_round_handle_timeout : ()=>void | null;
    constructor(_cb_uuid : number, _module_rsp_cb : plan_rsp_cb){
        this.cb_uuid = _cb_uuid;
        this.module_rsp_cb = _module_rsp_cb;
        this.event_start_round_handle_cb = null;
        this.event_start_round_handle_err = null;
        this.event_start_round_handle_timeout = null;
    }

    callBack(_cb:(self:common.UserBattleData, target:common.UserBattleData)=>void, _err:(err:number)=>void)
    {
        this.event_start_round_handle_cb = _cb;
        this.event_start_round_handle_err = _err;
        return this;
    }

    timeout(tick:number, timeout_cb:()=>void)
    {
        setTimeout(()=>{ this.module_rsp_cb.start_round_timeout(this.cb_uuid); }, tick);
        this.event_start_round_handle_timeout = timeout_cb;
    }

}

export class plan_start_round1_cb{
    private cb_uuid : number;
    private module_rsp_cb : plan_rsp_cb;

    public event_start_round1_handle_cb : (self:common.UserBattleData, target:common.UserBattleData)=>void | null;
    public event_start_round1_handle_err : (err:number)=>void | null;
    public event_start_round1_handle_timeout : ()=>void | null;
    constructor(_cb_uuid : number, _module_rsp_cb : plan_rsp_cb){
        this.cb_uuid = _cb_uuid;
        this.module_rsp_cb = _module_rsp_cb;
        this.event_start_round1_handle_cb = null;
        this.event_start_round1_handle_err = null;
        this.event_start_round1_handle_timeout = null;
    }

    callBack(_cb:(self:common.UserBattleData, target:common.UserBattleData)=>void, _err:(err:number)=>void)
    {
        this.event_start_round1_handle_cb = _cb;
        this.event_start_round1_handle_err = _err;
        return this;
    }

    timeout(tick:number, timeout_cb:()=>void)
    {
        setTimeout(()=>{ this.module_rsp_cb.start_round1_timeout(this.cb_uuid); }, tick);
        this.event_start_round1_handle_timeout = timeout_cb;
    }

}

export class plan_confirm_round_victory_cb{
    private cb_uuid : number;
    private module_rsp_cb : plan_rsp_cb;

    public event_confirm_round_victory_handle_cb : ()=>void | null;
    public event_confirm_round_victory_handle_err : ()=>void | null;
    public event_confirm_round_victory_handle_timeout : ()=>void | null;
    constructor(_cb_uuid : number, _module_rsp_cb : plan_rsp_cb){
        this.cb_uuid = _cb_uuid;
        this.module_rsp_cb = _module_rsp_cb;
        this.event_confirm_round_victory_handle_cb = null;
        this.event_confirm_round_victory_handle_err = null;
        this.event_confirm_round_victory_handle_timeout = null;
    }

    callBack(_cb:()=>void, _err:()=>void)
    {
        this.event_confirm_round_victory_handle_cb = _cb;
        this.event_confirm_round_victory_handle_err = _err;
        return this;
    }

    timeout(tick:number, timeout_cb:()=>void)
    {
        setTimeout(()=>{ this.module_rsp_cb.confirm_round_victory_timeout(this.cb_uuid); }, tick);
        this.event_confirm_round_victory_handle_timeout = timeout_cb;
    }

}

export class plan_get_battle_data_cb{
    private cb_uuid : number;
    private module_rsp_cb : plan_rsp_cb;

    public event_get_battle_data_handle_cb : (battle_info:common.UserBattleData, shop_info:common.ShopData, fetters_info:common.Fetters[])=>void | null;
    public event_get_battle_data_handle_err : ()=>void | null;
    public event_get_battle_data_handle_timeout : ()=>void | null;
    constructor(_cb_uuid : number, _module_rsp_cb : plan_rsp_cb){
        this.cb_uuid = _cb_uuid;
        this.module_rsp_cb = _module_rsp_cb;
        this.event_get_battle_data_handle_cb = null;
        this.event_get_battle_data_handle_err = null;
        this.event_get_battle_data_handle_timeout = null;
    }

    callBack(_cb:(battle_info:common.UserBattleData, shop_info:common.ShopData, fetters_info:common.Fetters[])=>void, _err:()=>void)
    {
        this.event_get_battle_data_handle_cb = _cb;
        this.event_get_battle_data_handle_err = _err;
        return this;
    }

    timeout(tick:number, timeout_cb:()=>void)
    {
        setTimeout(()=>{ this.module_rsp_cb.get_battle_data_timeout(this.cb_uuid); }, tick);
        this.event_get_battle_data_handle_timeout = timeout_cb;
    }

}

/*this cb code is codegen by abelkhan for ts*/
export class plan_rsp_cb extends client_handle.imodule {
    public map_buy:Map<number, plan_buy_cb>;
    public map_move:Map<number, plan_move_cb>;
    public map_sale_role:Map<number, plan_sale_role_cb>;
    public map_refresh:Map<number, plan_refresh_cb>;
    public map_freeze:Map<number, plan_freeze_cb>;
    public map_start_round:Map<number, plan_start_round_cb>;
    public map_start_round1:Map<number, plan_start_round1_cb>;
    public map_confirm_round_victory:Map<number, plan_confirm_round_victory_cb>;
    public map_get_battle_data:Map<number, plan_get_battle_data_cb>;
    constructor(modules:client_handle.modulemng){
        super();
        this.map_buy = new Map<number, plan_buy_cb>();
        modules.add_method("plan_rsp_cb_buy_rsp", this.buy_rsp.bind(this));
        modules.add_method("plan_rsp_cb_buy_err", this.buy_err.bind(this));
        this.map_move = new Map<number, plan_move_cb>();
        modules.add_method("plan_rsp_cb_move_rsp", this.move_rsp.bind(this));
        modules.add_method("plan_rsp_cb_move_err", this.move_err.bind(this));
        this.map_sale_role = new Map<number, plan_sale_role_cb>();
        modules.add_method("plan_rsp_cb_sale_role_rsp", this.sale_role_rsp.bind(this));
        modules.add_method("plan_rsp_cb_sale_role_err", this.sale_role_err.bind(this));
        this.map_refresh = new Map<number, plan_refresh_cb>();
        modules.add_method("plan_rsp_cb_refresh_rsp", this.refresh_rsp.bind(this));
        modules.add_method("plan_rsp_cb_refresh_err", this.refresh_err.bind(this));
        this.map_freeze = new Map<number, plan_freeze_cb>();
        modules.add_method("plan_rsp_cb_freeze_rsp", this.freeze_rsp.bind(this));
        modules.add_method("plan_rsp_cb_freeze_err", this.freeze_err.bind(this));
        this.map_start_round = new Map<number, plan_start_round_cb>();
        modules.add_method("plan_rsp_cb_start_round_rsp", this.start_round_rsp.bind(this));
        modules.add_method("plan_rsp_cb_start_round_err", this.start_round_err.bind(this));
        this.map_start_round1 = new Map<number, plan_start_round1_cb>();
        modules.add_method("plan_rsp_cb_start_round1_rsp", this.start_round1_rsp.bind(this));
        modules.add_method("plan_rsp_cb_start_round1_err", this.start_round1_err.bind(this));
        this.map_confirm_round_victory = new Map<number, plan_confirm_round_victory_cb>();
        modules.add_method("plan_rsp_cb_confirm_round_victory_rsp", this.confirm_round_victory_rsp.bind(this));
        modules.add_method("plan_rsp_cb_confirm_round_victory_err", this.confirm_round_victory_err.bind(this));
        this.map_get_battle_data = new Map<number, plan_get_battle_data_cb>();
        modules.add_method("plan_rsp_cb_get_battle_data_rsp", this.get_battle_data_rsp.bind(this));
        modules.add_method("plan_rsp_cb_get_battle_data_err", this.get_battle_data_err.bind(this));
    }
    public buy_rsp(inArray:any[]){
        let uuid = inArray[0];
        let _argv_8e620315_ff2a_3f9c_a655_464ce392ed2d:any[] = [];
        _argv_8e620315_ff2a_3f9c_a655_464ce392ed2d.push(common.protcol_to_UserBattleData(inArray[1]));
        _argv_8e620315_ff2a_3f9c_a655_464ce392ed2d.push(common.protcol_to_ShopData(inArray[2]));
        var rsp = this.try_get_and_del_buy_cb(uuid);
        if (rsp && rsp.event_buy_handle_cb) {
            rsp.event_buy_handle_cb.apply(null, _argv_8e620315_ff2a_3f9c_a655_464ce392ed2d);
        }
    }

    public buy_err(inArray:any[]){
        let uuid = inArray[0];
        let _argv_8e620315_ff2a_3f9c_a655_464ce392ed2d:any[] = [];
        _argv_8e620315_ff2a_3f9c_a655_464ce392ed2d.push(inArray[1]);
        var rsp = this.try_get_and_del_buy_cb(uuid);
        if (rsp && rsp.event_buy_handle_err) {
            rsp.event_buy_handle_err.apply(null, _argv_8e620315_ff2a_3f9c_a655_464ce392ed2d);
        }
    }

    public buy_timeout(cb_uuid : number){
        let rsp = this.try_get_and_del_buy_cb(cb_uuid);
        if (rsp){
            if (rsp.event_buy_handle_timeout) {
                rsp.event_buy_handle_timeout.apply(null);
            }
        }
    }

    private try_get_and_del_buy_cb(uuid : number){
        var rsp = this.map_buy.get(uuid);
        this.map_buy.delete(uuid);
        return rsp;
    }

    public move_rsp(inArray:any[]){
        let uuid = inArray[0];
        let _argv_33efb72e_9227_32af_a058_169be114a277:any[] = [];
        _argv_33efb72e_9227_32af_a058_169be114a277.push(common.protcol_to_UserBattleData(inArray[1]));
        var rsp = this.try_get_and_del_move_cb(uuid);
        if (rsp && rsp.event_move_handle_cb) {
            rsp.event_move_handle_cb.apply(null, _argv_33efb72e_9227_32af_a058_169be114a277);
        }
    }

    public move_err(inArray:any[]){
        let uuid = inArray[0];
        let _argv_33efb72e_9227_32af_a058_169be114a277:any[] = [];
        _argv_33efb72e_9227_32af_a058_169be114a277.push(inArray[1]);
        var rsp = this.try_get_and_del_move_cb(uuid);
        if (rsp && rsp.event_move_handle_err) {
            rsp.event_move_handle_err.apply(null, _argv_33efb72e_9227_32af_a058_169be114a277);
        }
    }

    public move_timeout(cb_uuid : number){
        let rsp = this.try_get_and_del_move_cb(cb_uuid);
        if (rsp){
            if (rsp.event_move_handle_timeout) {
                rsp.event_move_handle_timeout.apply(null);
            }
        }
    }

    private try_get_and_del_move_cb(uuid : number){
        var rsp = this.map_move.get(uuid);
        this.map_move.delete(uuid);
        return rsp;
    }

    public sale_role_rsp(inArray:any[]){
        let uuid = inArray[0];
        let _argv_10f3503a_6ca9_31ee_9d35_130ca397965f:any[] = [];
        _argv_10f3503a_6ca9_31ee_9d35_130ca397965f.push(common.protcol_to_UserBattleData(inArray[1]));
        var rsp = this.try_get_and_del_sale_role_cb(uuid);
        if (rsp && rsp.event_sale_role_handle_cb) {
            rsp.event_sale_role_handle_cb.apply(null, _argv_10f3503a_6ca9_31ee_9d35_130ca397965f);
        }
    }

    public sale_role_err(inArray:any[]){
        let uuid = inArray[0];
        let _argv_10f3503a_6ca9_31ee_9d35_130ca397965f:any[] = [];
        _argv_10f3503a_6ca9_31ee_9d35_130ca397965f.push(inArray[1]);
        var rsp = this.try_get_and_del_sale_role_cb(uuid);
        if (rsp && rsp.event_sale_role_handle_err) {
            rsp.event_sale_role_handle_err.apply(null, _argv_10f3503a_6ca9_31ee_9d35_130ca397965f);
        }
    }

    public sale_role_timeout(cb_uuid : number){
        let rsp = this.try_get_and_del_sale_role_cb(cb_uuid);
        if (rsp){
            if (rsp.event_sale_role_handle_timeout) {
                rsp.event_sale_role_handle_timeout.apply(null);
            }
        }
    }

    private try_get_and_del_sale_role_cb(uuid : number){
        var rsp = this.map_sale_role.get(uuid);
        this.map_sale_role.delete(uuid);
        return rsp;
    }

    public refresh_rsp(inArray:any[]){
        let uuid = inArray[0];
        let _argv_97f4163d_22be_334a_ad37_ab1f786ceb46:any[] = [];
        _argv_97f4163d_22be_334a_ad37_ab1f786ceb46.push(common.protcol_to_ShopData(inArray[1]));
        var rsp = this.try_get_and_del_refresh_cb(uuid);
        if (rsp && rsp.event_refresh_handle_cb) {
            rsp.event_refresh_handle_cb.apply(null, _argv_97f4163d_22be_334a_ad37_ab1f786ceb46);
        }
    }

    public refresh_err(inArray:any[]){
        let uuid = inArray[0];
        let _argv_97f4163d_22be_334a_ad37_ab1f786ceb46:any[] = [];
        _argv_97f4163d_22be_334a_ad37_ab1f786ceb46.push(inArray[1]);
        var rsp = this.try_get_and_del_refresh_cb(uuid);
        if (rsp && rsp.event_refresh_handle_err) {
            rsp.event_refresh_handle_err.apply(null, _argv_97f4163d_22be_334a_ad37_ab1f786ceb46);
        }
    }

    public refresh_timeout(cb_uuid : number){
        let rsp = this.try_get_and_del_refresh_cb(cb_uuid);
        if (rsp){
            if (rsp.event_refresh_handle_timeout) {
                rsp.event_refresh_handle_timeout.apply(null);
            }
        }
    }

    private try_get_and_del_refresh_cb(uuid : number){
        var rsp = this.map_refresh.get(uuid);
        this.map_refresh.delete(uuid);
        return rsp;
    }

    public freeze_rsp(inArray:any[]){
        let uuid = inArray[0];
        let _argv_7a949231_d386_34d8_8952_29d48e8ff5ca:any[] = [];
        _argv_7a949231_d386_34d8_8952_29d48e8ff5ca.push(common.protcol_to_ShopData(inArray[1]));
        var rsp = this.try_get_and_del_freeze_cb(uuid);
        if (rsp && rsp.event_freeze_handle_cb) {
            rsp.event_freeze_handle_cb.apply(null, _argv_7a949231_d386_34d8_8952_29d48e8ff5ca);
        }
    }

    public freeze_err(inArray:any[]){
        let uuid = inArray[0];
        let _argv_7a949231_d386_34d8_8952_29d48e8ff5ca:any[] = [];
        _argv_7a949231_d386_34d8_8952_29d48e8ff5ca.push(inArray[1]);
        var rsp = this.try_get_and_del_freeze_cb(uuid);
        if (rsp && rsp.event_freeze_handle_err) {
            rsp.event_freeze_handle_err.apply(null, _argv_7a949231_d386_34d8_8952_29d48e8ff5ca);
        }
    }

    public freeze_timeout(cb_uuid : number){
        let rsp = this.try_get_and_del_freeze_cb(cb_uuid);
        if (rsp){
            if (rsp.event_freeze_handle_timeout) {
                rsp.event_freeze_handle_timeout.apply(null);
            }
        }
    }

    private try_get_and_del_freeze_cb(uuid : number){
        var rsp = this.map_freeze.get(uuid);
        this.map_freeze.delete(uuid);
        return rsp;
    }

    public start_round_rsp(inArray:any[]){
        let uuid = inArray[0];
        let _argv_a79b5af5_d482_3045_beb1_226490350eb9:any[] = [];
        _argv_a79b5af5_d482_3045_beb1_226490350eb9.push(common.protcol_to_UserBattleData(inArray[1]));
        _argv_a79b5af5_d482_3045_beb1_226490350eb9.push(common.protcol_to_UserBattleData(inArray[2]));
        var rsp = this.try_get_and_del_start_round_cb(uuid);
        if (rsp && rsp.event_start_round_handle_cb) {
            rsp.event_start_round_handle_cb.apply(null, _argv_a79b5af5_d482_3045_beb1_226490350eb9);
        }
    }

    public start_round_err(inArray:any[]){
        let uuid = inArray[0];
        let _argv_a79b5af5_d482_3045_beb1_226490350eb9:any[] = [];
        _argv_a79b5af5_d482_3045_beb1_226490350eb9.push(inArray[1]);
        var rsp = this.try_get_and_del_start_round_cb(uuid);
        if (rsp && rsp.event_start_round_handle_err) {
            rsp.event_start_round_handle_err.apply(null, _argv_a79b5af5_d482_3045_beb1_226490350eb9);
        }
    }

    public start_round_timeout(cb_uuid : number){
        let rsp = this.try_get_and_del_start_round_cb(cb_uuid);
        if (rsp){
            if (rsp.event_start_round_handle_timeout) {
                rsp.event_start_round_handle_timeout.apply(null);
            }
        }
    }

    private try_get_and_del_start_round_cb(uuid : number){
        var rsp = this.map_start_round.get(uuid);
        this.map_start_round.delete(uuid);
        return rsp;
    }

    public start_round1_rsp(inArray:any[]){
        let uuid = inArray[0];
        let _argv_f14f1f61_44e1_3119_8561_5f13515b6af0:any[] = [];
        _argv_f14f1f61_44e1_3119_8561_5f13515b6af0.push(common.protcol_to_UserBattleData(inArray[1]));
        _argv_f14f1f61_44e1_3119_8561_5f13515b6af0.push(common.protcol_to_UserBattleData(inArray[2]));
        var rsp = this.try_get_and_del_start_round1_cb(uuid);
        if (rsp && rsp.event_start_round1_handle_cb) {
            rsp.event_start_round1_handle_cb.apply(null, _argv_f14f1f61_44e1_3119_8561_5f13515b6af0);
        }
    }

    public start_round1_err(inArray:any[]){
        let uuid = inArray[0];
        let _argv_f14f1f61_44e1_3119_8561_5f13515b6af0:any[] = [];
        _argv_f14f1f61_44e1_3119_8561_5f13515b6af0.push(inArray[1]);
        var rsp = this.try_get_and_del_start_round1_cb(uuid);
        if (rsp && rsp.event_start_round1_handle_err) {
            rsp.event_start_round1_handle_err.apply(null, _argv_f14f1f61_44e1_3119_8561_5f13515b6af0);
        }
    }

    public start_round1_timeout(cb_uuid : number){
        let rsp = this.try_get_and_del_start_round1_cb(cb_uuid);
        if (rsp){
            if (rsp.event_start_round1_handle_timeout) {
                rsp.event_start_round1_handle_timeout.apply(null);
            }
        }
    }

    private try_get_and_del_start_round1_cb(uuid : number){
        var rsp = this.map_start_round1.get(uuid);
        this.map_start_round1.delete(uuid);
        return rsp;
    }

    public confirm_round_victory_rsp(inArray:any[]){
        let uuid = inArray[0];
        let _argv_22132c31_7fe4_3f20_affe_f0c3ca2172f0:any[] = [];
        var rsp = this.try_get_and_del_confirm_round_victory_cb(uuid);
        if (rsp && rsp.event_confirm_round_victory_handle_cb) {
            rsp.event_confirm_round_victory_handle_cb.apply(null, _argv_22132c31_7fe4_3f20_affe_f0c3ca2172f0);
        }
    }

    public confirm_round_victory_err(inArray:any[]){
        let uuid = inArray[0];
        let _argv_22132c31_7fe4_3f20_affe_f0c3ca2172f0:any[] = [];
        var rsp = this.try_get_and_del_confirm_round_victory_cb(uuid);
        if (rsp && rsp.event_confirm_round_victory_handle_err) {
            rsp.event_confirm_round_victory_handle_err.apply(null, _argv_22132c31_7fe4_3f20_affe_f0c3ca2172f0);
        }
    }

    public confirm_round_victory_timeout(cb_uuid : number){
        let rsp = this.try_get_and_del_confirm_round_victory_cb(cb_uuid);
        if (rsp){
            if (rsp.event_confirm_round_victory_handle_timeout) {
                rsp.event_confirm_round_victory_handle_timeout.apply(null);
            }
        }
    }

    private try_get_and_del_confirm_round_victory_cb(uuid : number){
        var rsp = this.map_confirm_round_victory.get(uuid);
        this.map_confirm_round_victory.delete(uuid);
        return rsp;
    }

    public get_battle_data_rsp(inArray:any[]){
        let uuid = inArray[0];
        let _argv_3d073eb1_819d_3da0_99ac_ac4f24f7d6a2:any[] = [];
        _argv_3d073eb1_819d_3da0_99ac_ac4f24f7d6a2.push(common.protcol_to_UserBattleData(inArray[1]));
        _argv_3d073eb1_819d_3da0_99ac_ac4f24f7d6a2.push(common.protcol_to_ShopData(inArray[2]));
        let _array_096776fa_67e9_5066_90ca_647b76dcad2e:any[] = [];        for(let v_9035a021_03cb_5bd0_bc76_03261181b452 of inArray[3]){
            _array_096776fa_67e9_5066_90ca_647b76dcad2e.push(common.protcol_to_Fetters(v_9035a021_03cb_5bd0_bc76_03261181b452));
        }
        _argv_3d073eb1_819d_3da0_99ac_ac4f24f7d6a2.push(_array_096776fa_67e9_5066_90ca_647b76dcad2e);
        var rsp = this.try_get_and_del_get_battle_data_cb(uuid);
        if (rsp && rsp.event_get_battle_data_handle_cb) {
            rsp.event_get_battle_data_handle_cb.apply(null, _argv_3d073eb1_819d_3da0_99ac_ac4f24f7d6a2);
        }
    }

    public get_battle_data_err(inArray:any[]){
        let uuid = inArray[0];
        let _argv_3d073eb1_819d_3da0_99ac_ac4f24f7d6a2:any[] = [];
        var rsp = this.try_get_and_del_get_battle_data_cb(uuid);
        if (rsp && rsp.event_get_battle_data_handle_err) {
            rsp.event_get_battle_data_handle_err.apply(null, _argv_3d073eb1_819d_3da0_99ac_ac4f24f7d6a2);
        }
    }

    public get_battle_data_timeout(cb_uuid : number){
        let rsp = this.try_get_and_del_get_battle_data_cb(cb_uuid);
        if (rsp){
            if (rsp.event_get_battle_data_handle_timeout) {
                rsp.event_get_battle_data_handle_timeout.apply(null);
            }
        }
    }

    private try_get_and_del_get_battle_data_cb(uuid : number){
        var rsp = this.map_get_battle_data.get(uuid);
        this.map_get_battle_data.delete(uuid);
        return rsp;
    }

}

let rsp_cb_plan_handle : plan_rsp_cb | null = null;
export class plan_caller {
    private _hubproxy:plan_hubproxy;
    constructor(_client:client_handle.client){
        if (rsp_cb_plan_handle == null){
            rsp_cb_plan_handle = new plan_rsp_cb(_client._modulemng);
        }
        this._hubproxy = new plan_hubproxy(_client);
    }

    public get_hub(hub_name:string)
    {
        this._hubproxy.hub_name_d9e0c25f_1008_3739_9ff9_86e6a3421324 = hub_name;
        return this._hubproxy;
    }

}

export class plan_hubproxy
{
    private uuid_d9e0c25f_1008_3739_9ff9_86e6a3421324 : number = Math.round(Math.random() * 1000);

    public hub_name_d9e0c25f_1008_3739_9ff9_86e6a3421324:string;
    private _client_handle:client_handle.client;

    constructor(client_handle_:client_handle.client)
    {
        this._client_handle = client_handle_;
    }

    public buy(shop_index:common.ShopIndex, index:number, role_index:number){
        let uuid_4d846fab_804e_563b_998f_6e40c5d2bd39 = Math.round(this.uuid_d9e0c25f_1008_3739_9ff9_86e6a3421324++);

        let _argv_8e620315_ff2a_3f9c_a655_464ce392ed2d:any[] = [uuid_4d846fab_804e_563b_998f_6e40c5d2bd39];
        _argv_8e620315_ff2a_3f9c_a655_464ce392ed2d.push(shop_index);
        _argv_8e620315_ff2a_3f9c_a655_464ce392ed2d.push(index);
        _argv_8e620315_ff2a_3f9c_a655_464ce392ed2d.push(role_index);
        this._client_handle.call_hub(this.hub_name_d9e0c25f_1008_3739_9ff9_86e6a3421324, "plan_buy", _argv_8e620315_ff2a_3f9c_a655_464ce392ed2d);
        let cb_buy_obj = new plan_buy_cb(uuid_4d846fab_804e_563b_998f_6e40c5d2bd39, rsp_cb_plan_handle);
        if (rsp_cb_plan_handle){
            rsp_cb_plan_handle.map_buy.set(uuid_4d846fab_804e_563b_998f_6e40c5d2bd39, cb_buy_obj);
        }
        return cb_buy_obj;
    }

    public move(role1_index:number, role2_index:number){
        let uuid_b12e48a4_eacf_5547_aa8b_371481c78a76 = Math.round(this.uuid_d9e0c25f_1008_3739_9ff9_86e6a3421324++);

        let _argv_33efb72e_9227_32af_a058_169be114a277:any[] = [uuid_b12e48a4_eacf_5547_aa8b_371481c78a76];
        _argv_33efb72e_9227_32af_a058_169be114a277.push(role1_index);
        _argv_33efb72e_9227_32af_a058_169be114a277.push(role2_index);
        this._client_handle.call_hub(this.hub_name_d9e0c25f_1008_3739_9ff9_86e6a3421324, "plan_move", _argv_33efb72e_9227_32af_a058_169be114a277);
        let cb_move_obj = new plan_move_cb(uuid_b12e48a4_eacf_5547_aa8b_371481c78a76, rsp_cb_plan_handle);
        if (rsp_cb_plan_handle){
            rsp_cb_plan_handle.map_move.set(uuid_b12e48a4_eacf_5547_aa8b_371481c78a76, cb_move_obj);
        }
        return cb_move_obj;
    }

    public sale_role(index:number){
        let uuid_3252fdfb_17bb_50be_adc3_cab5bc7d02a8 = Math.round(this.uuid_d9e0c25f_1008_3739_9ff9_86e6a3421324++);

        let _argv_10f3503a_6ca9_31ee_9d35_130ca397965f:any[] = [uuid_3252fdfb_17bb_50be_adc3_cab5bc7d02a8];
        _argv_10f3503a_6ca9_31ee_9d35_130ca397965f.push(index);
        this._client_handle.call_hub(this.hub_name_d9e0c25f_1008_3739_9ff9_86e6a3421324, "plan_sale_role", _argv_10f3503a_6ca9_31ee_9d35_130ca397965f);
        let cb_sale_role_obj = new plan_sale_role_cb(uuid_3252fdfb_17bb_50be_adc3_cab5bc7d02a8, rsp_cb_plan_handle);
        if (rsp_cb_plan_handle){
            rsp_cb_plan_handle.map_sale_role.set(uuid_3252fdfb_17bb_50be_adc3_cab5bc7d02a8, cb_sale_role_obj);
        }
        return cb_sale_role_obj;
    }

    public refresh(){
        let uuid_65e3918e_9981_5d51_ab87_6e201954647d = Math.round(this.uuid_d9e0c25f_1008_3739_9ff9_86e6a3421324++);

        let _argv_97f4163d_22be_334a_ad37_ab1f786ceb46:any[] = [uuid_65e3918e_9981_5d51_ab87_6e201954647d];
        this._client_handle.call_hub(this.hub_name_d9e0c25f_1008_3739_9ff9_86e6a3421324, "plan_refresh", _argv_97f4163d_22be_334a_ad37_ab1f786ceb46);
        let cb_refresh_obj = new plan_refresh_cb(uuid_65e3918e_9981_5d51_ab87_6e201954647d, rsp_cb_plan_handle);
        if (rsp_cb_plan_handle){
            rsp_cb_plan_handle.map_refresh.set(uuid_65e3918e_9981_5d51_ab87_6e201954647d, cb_refresh_obj);
        }
        return cb_refresh_obj;
    }

    public freeze(shop_index:common.ShopIndex, index:number, is_freeze:boolean){
        let uuid_1f361e1a_a45d_5d41_8158_c66b4bc5aad6 = Math.round(this.uuid_d9e0c25f_1008_3739_9ff9_86e6a3421324++);

        let _argv_7a949231_d386_34d8_8952_29d48e8ff5ca:any[] = [uuid_1f361e1a_a45d_5d41_8158_c66b4bc5aad6];
        _argv_7a949231_d386_34d8_8952_29d48e8ff5ca.push(shop_index);
        _argv_7a949231_d386_34d8_8952_29d48e8ff5ca.push(index);
        _argv_7a949231_d386_34d8_8952_29d48e8ff5ca.push(is_freeze);
        this._client_handle.call_hub(this.hub_name_d9e0c25f_1008_3739_9ff9_86e6a3421324, "plan_freeze", _argv_7a949231_d386_34d8_8952_29d48e8ff5ca);
        let cb_freeze_obj = new plan_freeze_cb(uuid_1f361e1a_a45d_5d41_8158_c66b4bc5aad6, rsp_cb_plan_handle);
        if (rsp_cb_plan_handle){
            rsp_cb_plan_handle.map_freeze.set(uuid_1f361e1a_a45d_5d41_8158_c66b4bc5aad6, cb_freeze_obj);
        }
        return cb_freeze_obj;
    }

    public start_round(){
        let uuid_749771b4_9d43_5dd9_aa87_9201c8f06d41 = Math.round(this.uuid_d9e0c25f_1008_3739_9ff9_86e6a3421324++);

        let _argv_a79b5af5_d482_3045_beb1_226490350eb9:any[] = [uuid_749771b4_9d43_5dd9_aa87_9201c8f06d41];
        this._client_handle.call_hub(this.hub_name_d9e0c25f_1008_3739_9ff9_86e6a3421324, "plan_start_round", _argv_a79b5af5_d482_3045_beb1_226490350eb9);
        let cb_start_round_obj = new plan_start_round_cb(uuid_749771b4_9d43_5dd9_aa87_9201c8f06d41, rsp_cb_plan_handle);
        if (rsp_cb_plan_handle){
            rsp_cb_plan_handle.map_start_round.set(uuid_749771b4_9d43_5dd9_aa87_9201c8f06d41, cb_start_round_obj);
        }
        return cb_start_round_obj;
    }

    public start_round1(){
        let uuid_5813c0ea_49f7_594f_866e_a947cbfbb3da = Math.round(this.uuid_d9e0c25f_1008_3739_9ff9_86e6a3421324++);

        let _argv_f14f1f61_44e1_3119_8561_5f13515b6af0:any[] = [uuid_5813c0ea_49f7_594f_866e_a947cbfbb3da];
        this._client_handle.call_hub(this.hub_name_d9e0c25f_1008_3739_9ff9_86e6a3421324, "plan_start_round1", _argv_f14f1f61_44e1_3119_8561_5f13515b6af0);
        let cb_start_round1_obj = new plan_start_round1_cb(uuid_5813c0ea_49f7_594f_866e_a947cbfbb3da, rsp_cb_plan_handle);
        if (rsp_cb_plan_handle){
            rsp_cb_plan_handle.map_start_round1.set(uuid_5813c0ea_49f7_594f_866e_a947cbfbb3da, cb_start_round1_obj);
        }
        return cb_start_round1_obj;
    }

    public confirm_round_victory(is_victory:battle_victory){
        let uuid_e5597e65_791a_5923_ac90_94a6aa039d4f = Math.round(this.uuid_d9e0c25f_1008_3739_9ff9_86e6a3421324++);

        let _argv_22132c31_7fe4_3f20_affe_f0c3ca2172f0:any[] = [uuid_e5597e65_791a_5923_ac90_94a6aa039d4f];
        _argv_22132c31_7fe4_3f20_affe_f0c3ca2172f0.push(is_victory);
        this._client_handle.call_hub(this.hub_name_d9e0c25f_1008_3739_9ff9_86e6a3421324, "plan_confirm_round_victory", _argv_22132c31_7fe4_3f20_affe_f0c3ca2172f0);
        let cb_confirm_round_victory_obj = new plan_confirm_round_victory_cb(uuid_e5597e65_791a_5923_ac90_94a6aa039d4f, rsp_cb_plan_handle);
        if (rsp_cb_plan_handle){
            rsp_cb_plan_handle.map_confirm_round_victory.set(uuid_e5597e65_791a_5923_ac90_94a6aa039d4f, cb_confirm_round_victory_obj);
        }
        return cb_confirm_round_victory_obj;
    }

    public get_battle_data(){
        let uuid_3d22d853_f4c2_57b9_a90a_3a542d96b310 = Math.round(this.uuid_d9e0c25f_1008_3739_9ff9_86e6a3421324++);

        let _argv_3d073eb1_819d_3da0_99ac_ac4f24f7d6a2:any[] = [uuid_3d22d853_f4c2_57b9_a90a_3a542d96b310];
        this._client_handle.call_hub(this.hub_name_d9e0c25f_1008_3739_9ff9_86e6a3421324, "plan_get_battle_data", _argv_3d073eb1_819d_3da0_99ac_ac4f24f7d6a2);
        let cb_get_battle_data_obj = new plan_get_battle_data_cb(uuid_3d22d853_f4c2_57b9_a90a_3a542d96b310, rsp_cb_plan_handle);
        if (rsp_cb_plan_handle){
            rsp_cb_plan_handle.map_get_battle_data.set(uuid_3d22d853_f4c2_57b9_a90a_3a542d96b310, cb_get_battle_data_obj);
        }
        return cb_get_battle_data_obj;
    }

}
export class peak_strength_get_peak_strength_formation_cb{
    private cb_uuid : number;
    private module_rsp_cb : peak_strength_rsp_cb;

    public event_get_peak_strength_formation_handle_cb : (self:common.UserBattleData[])=>void | null;
    public event_get_peak_strength_formation_handle_err : (err:number)=>void | null;
    public event_get_peak_strength_formation_handle_timeout : ()=>void | null;
    constructor(_cb_uuid : number, _module_rsp_cb : peak_strength_rsp_cb){
        this.cb_uuid = _cb_uuid;
        this.module_rsp_cb = _module_rsp_cb;
        this.event_get_peak_strength_formation_handle_cb = null;
        this.event_get_peak_strength_formation_handle_err = null;
        this.event_get_peak_strength_formation_handle_timeout = null;
    }

    callBack(_cb:(self:common.UserBattleData[])=>void, _err:(err:number)=>void)
    {
        this.event_get_peak_strength_formation_handle_cb = _cb;
        this.event_get_peak_strength_formation_handle_err = _err;
        return this;
    }

    timeout(tick:number, timeout_cb:()=>void)
    {
        setTimeout(()=>{ this.module_rsp_cb.get_peak_strength_formation_timeout(this.cb_uuid); }, tick);
        this.event_get_peak_strength_formation_handle_timeout = timeout_cb;
    }

}

export class peak_strength_del_peak_strength_formation_cb{
    private cb_uuid : number;
    private module_rsp_cb : peak_strength_rsp_cb;

    public event_del_peak_strength_formation_handle_cb : (self:common.UserBattleData[])=>void | null;
    public event_del_peak_strength_formation_handle_err : (err:number)=>void | null;
    public event_del_peak_strength_formation_handle_timeout : ()=>void | null;
    constructor(_cb_uuid : number, _module_rsp_cb : peak_strength_rsp_cb){
        this.cb_uuid = _cb_uuid;
        this.module_rsp_cb = _module_rsp_cb;
        this.event_del_peak_strength_formation_handle_cb = null;
        this.event_del_peak_strength_formation_handle_err = null;
        this.event_del_peak_strength_formation_handle_timeout = null;
    }

    callBack(_cb:(self:common.UserBattleData[])=>void, _err:(err:number)=>void)
    {
        this.event_del_peak_strength_formation_handle_cb = _cb;
        this.event_del_peak_strength_formation_handle_err = _err;
        return this;
    }

    timeout(tick:number, timeout_cb:()=>void)
    {
        setTimeout(()=>{ this.module_rsp_cb.del_peak_strength_formation_timeout(this.cb_uuid); }, tick);
        this.event_del_peak_strength_formation_handle_timeout = timeout_cb;
    }

}

export class peak_strength_choose_peak_strength_cb{
    private cb_uuid : number;
    private module_rsp_cb : peak_strength_rsp_cb;

    public event_choose_peak_strength_handle_cb : (self:common.UserBattleData)=>void | null;
    public event_choose_peak_strength_handle_err : (err:number)=>void | null;
    public event_choose_peak_strength_handle_timeout : ()=>void | null;
    constructor(_cb_uuid : number, _module_rsp_cb : peak_strength_rsp_cb){
        this.cb_uuid = _cb_uuid;
        this.module_rsp_cb = _module_rsp_cb;
        this.event_choose_peak_strength_handle_cb = null;
        this.event_choose_peak_strength_handle_err = null;
        this.event_choose_peak_strength_handle_timeout = null;
    }

    callBack(_cb:(self:common.UserBattleData)=>void, _err:(err:number)=>void)
    {
        this.event_choose_peak_strength_handle_cb = _cb;
        this.event_choose_peak_strength_handle_err = _err;
        return this;
    }

    timeout(tick:number, timeout_cb:()=>void)
    {
        setTimeout(()=>{ this.module_rsp_cb.choose_peak_strength_timeout(this.cb_uuid); }, tick);
        this.event_choose_peak_strength_handle_timeout = timeout_cb;
    }

}

export class peak_strength_start_peak_strength_cb{
    private cb_uuid : number;
    private module_rsp_cb : peak_strength_rsp_cb;

    public event_start_peak_strength_handle_cb : (self:common.UserBattleData, target:common.UserBattleData)=>void | null;
    public event_start_peak_strength_handle_err : (err:number)=>void | null;
    public event_start_peak_strength_handle_timeout : ()=>void | null;
    constructor(_cb_uuid : number, _module_rsp_cb : peak_strength_rsp_cb){
        this.cb_uuid = _cb_uuid;
        this.module_rsp_cb = _module_rsp_cb;
        this.event_start_peak_strength_handle_cb = null;
        this.event_start_peak_strength_handle_err = null;
        this.event_start_peak_strength_handle_timeout = null;
    }

    callBack(_cb:(self:common.UserBattleData, target:common.UserBattleData)=>void, _err:(err:number)=>void)
    {
        this.event_start_peak_strength_handle_cb = _cb;
        this.event_start_peak_strength_handle_err = _err;
        return this;
    }

    timeout(tick:number, timeout_cb:()=>void)
    {
        setTimeout(()=>{ this.module_rsp_cb.start_peak_strength_timeout(this.cb_uuid); }, tick);
        this.event_start_peak_strength_handle_timeout = timeout_cb;
    }

}

export class peak_strength_confirm_peak_strength_victory_cb{
    private cb_uuid : number;
    private module_rsp_cb : peak_strength_rsp_cb;

    public event_confirm_peak_strength_victory_handle_cb : ()=>void | null;
    public event_confirm_peak_strength_victory_handle_err : ()=>void | null;
    public event_confirm_peak_strength_victory_handle_timeout : ()=>void | null;
    constructor(_cb_uuid : number, _module_rsp_cb : peak_strength_rsp_cb){
        this.cb_uuid = _cb_uuid;
        this.module_rsp_cb = _module_rsp_cb;
        this.event_confirm_peak_strength_victory_handle_cb = null;
        this.event_confirm_peak_strength_victory_handle_err = null;
        this.event_confirm_peak_strength_victory_handle_timeout = null;
    }

    callBack(_cb:()=>void, _err:()=>void)
    {
        this.event_confirm_peak_strength_victory_handle_cb = _cb;
        this.event_confirm_peak_strength_victory_handle_err = _err;
        return this;
    }

    timeout(tick:number, timeout_cb:()=>void)
    {
        setTimeout(()=>{ this.module_rsp_cb.confirm_peak_strength_victory_timeout(this.cb_uuid); }, tick);
        this.event_confirm_peak_strength_victory_handle_timeout = timeout_cb;
    }

}

/*this cb code is codegen by abelkhan for ts*/
export class peak_strength_rsp_cb extends client_handle.imodule {
    public map_get_peak_strength_formation:Map<number, peak_strength_get_peak_strength_formation_cb>;
    public map_del_peak_strength_formation:Map<number, peak_strength_del_peak_strength_formation_cb>;
    public map_choose_peak_strength:Map<number, peak_strength_choose_peak_strength_cb>;
    public map_start_peak_strength:Map<number, peak_strength_start_peak_strength_cb>;
    public map_confirm_peak_strength_victory:Map<number, peak_strength_confirm_peak_strength_victory_cb>;
    constructor(modules:client_handle.modulemng){
        super();
        this.map_get_peak_strength_formation = new Map<number, peak_strength_get_peak_strength_formation_cb>();
        modules.add_method("peak_strength_rsp_cb_get_peak_strength_formation_rsp", this.get_peak_strength_formation_rsp.bind(this));
        modules.add_method("peak_strength_rsp_cb_get_peak_strength_formation_err", this.get_peak_strength_formation_err.bind(this));
        this.map_del_peak_strength_formation = new Map<number, peak_strength_del_peak_strength_formation_cb>();
        modules.add_method("peak_strength_rsp_cb_del_peak_strength_formation_rsp", this.del_peak_strength_formation_rsp.bind(this));
        modules.add_method("peak_strength_rsp_cb_del_peak_strength_formation_err", this.del_peak_strength_formation_err.bind(this));
        this.map_choose_peak_strength = new Map<number, peak_strength_choose_peak_strength_cb>();
        modules.add_method("peak_strength_rsp_cb_choose_peak_strength_rsp", this.choose_peak_strength_rsp.bind(this));
        modules.add_method("peak_strength_rsp_cb_choose_peak_strength_err", this.choose_peak_strength_err.bind(this));
        this.map_start_peak_strength = new Map<number, peak_strength_start_peak_strength_cb>();
        modules.add_method("peak_strength_rsp_cb_start_peak_strength_rsp", this.start_peak_strength_rsp.bind(this));
        modules.add_method("peak_strength_rsp_cb_start_peak_strength_err", this.start_peak_strength_err.bind(this));
        this.map_confirm_peak_strength_victory = new Map<number, peak_strength_confirm_peak_strength_victory_cb>();
        modules.add_method("peak_strength_rsp_cb_confirm_peak_strength_victory_rsp", this.confirm_peak_strength_victory_rsp.bind(this));
        modules.add_method("peak_strength_rsp_cb_confirm_peak_strength_victory_err", this.confirm_peak_strength_victory_err.bind(this));
    }
    public get_peak_strength_formation_rsp(inArray:any[]){
        let uuid = inArray[0];
        let _argv_22f0b194_9ed2_3829_99ae_268b286a1a05:any[] = [];
        let _array_9d043920_d936_5a24_bb36_334fe3c35b20:any[] = [];        for(let v_f28d998e_a4db_5715_ae88_a209524e50aa of inArray[1]){
            _array_9d043920_d936_5a24_bb36_334fe3c35b20.push(common.protcol_to_UserBattleData(v_f28d998e_a4db_5715_ae88_a209524e50aa));
        }
        _argv_22f0b194_9ed2_3829_99ae_268b286a1a05.push(_array_9d043920_d936_5a24_bb36_334fe3c35b20);
        var rsp = this.try_get_and_del_get_peak_strength_formation_cb(uuid);
        if (rsp && rsp.event_get_peak_strength_formation_handle_cb) {
            rsp.event_get_peak_strength_formation_handle_cb.apply(null, _argv_22f0b194_9ed2_3829_99ae_268b286a1a05);
        }
    }

    public get_peak_strength_formation_err(inArray:any[]){
        let uuid = inArray[0];
        let _argv_22f0b194_9ed2_3829_99ae_268b286a1a05:any[] = [];
        _argv_22f0b194_9ed2_3829_99ae_268b286a1a05.push(inArray[1]);
        var rsp = this.try_get_and_del_get_peak_strength_formation_cb(uuid);
        if (rsp && rsp.event_get_peak_strength_formation_handle_err) {
            rsp.event_get_peak_strength_formation_handle_err.apply(null, _argv_22f0b194_9ed2_3829_99ae_268b286a1a05);
        }
    }

    public get_peak_strength_formation_timeout(cb_uuid : number){
        let rsp = this.try_get_and_del_get_peak_strength_formation_cb(cb_uuid);
        if (rsp){
            if (rsp.event_get_peak_strength_formation_handle_timeout) {
                rsp.event_get_peak_strength_formation_handle_timeout.apply(null);
            }
        }
    }

    private try_get_and_del_get_peak_strength_formation_cb(uuid : number){
        var rsp = this.map_get_peak_strength_formation.get(uuid);
        this.map_get_peak_strength_formation.delete(uuid);
        return rsp;
    }

    public del_peak_strength_formation_rsp(inArray:any[]){
        let uuid = inArray[0];
        let _argv_db7ed62a_657a_3ec6_9f6a_7d50bf13f867:any[] = [];
        let _array_9d043920_d936_5a24_bb36_334fe3c35b20:any[] = [];        for(let v_f28d998e_a4db_5715_ae88_a209524e50aa of inArray[1]){
            _array_9d043920_d936_5a24_bb36_334fe3c35b20.push(common.protcol_to_UserBattleData(v_f28d998e_a4db_5715_ae88_a209524e50aa));
        }
        _argv_db7ed62a_657a_3ec6_9f6a_7d50bf13f867.push(_array_9d043920_d936_5a24_bb36_334fe3c35b20);
        var rsp = this.try_get_and_del_del_peak_strength_formation_cb(uuid);
        if (rsp && rsp.event_del_peak_strength_formation_handle_cb) {
            rsp.event_del_peak_strength_formation_handle_cb.apply(null, _argv_db7ed62a_657a_3ec6_9f6a_7d50bf13f867);
        }
    }

    public del_peak_strength_formation_err(inArray:any[]){
        let uuid = inArray[0];
        let _argv_db7ed62a_657a_3ec6_9f6a_7d50bf13f867:any[] = [];
        _argv_db7ed62a_657a_3ec6_9f6a_7d50bf13f867.push(inArray[1]);
        var rsp = this.try_get_and_del_del_peak_strength_formation_cb(uuid);
        if (rsp && rsp.event_del_peak_strength_formation_handle_err) {
            rsp.event_del_peak_strength_formation_handle_err.apply(null, _argv_db7ed62a_657a_3ec6_9f6a_7d50bf13f867);
        }
    }

    public del_peak_strength_formation_timeout(cb_uuid : number){
        let rsp = this.try_get_and_del_del_peak_strength_formation_cb(cb_uuid);
        if (rsp){
            if (rsp.event_del_peak_strength_formation_handle_timeout) {
                rsp.event_del_peak_strength_formation_handle_timeout.apply(null);
            }
        }
    }

    private try_get_and_del_del_peak_strength_formation_cb(uuid : number){
        var rsp = this.map_del_peak_strength_formation.get(uuid);
        this.map_del_peak_strength_formation.delete(uuid);
        return rsp;
    }

    public choose_peak_strength_rsp(inArray:any[]){
        let uuid = inArray[0];
        let _argv_47129469_d92d_37f1_8cdf_803a9920b5c6:any[] = [];
        _argv_47129469_d92d_37f1_8cdf_803a9920b5c6.push(common.protcol_to_UserBattleData(inArray[1]));
        var rsp = this.try_get_and_del_choose_peak_strength_cb(uuid);
        if (rsp && rsp.event_choose_peak_strength_handle_cb) {
            rsp.event_choose_peak_strength_handle_cb.apply(null, _argv_47129469_d92d_37f1_8cdf_803a9920b5c6);
        }
    }

    public choose_peak_strength_err(inArray:any[]){
        let uuid = inArray[0];
        let _argv_47129469_d92d_37f1_8cdf_803a9920b5c6:any[] = [];
        _argv_47129469_d92d_37f1_8cdf_803a9920b5c6.push(inArray[1]);
        var rsp = this.try_get_and_del_choose_peak_strength_cb(uuid);
        if (rsp && rsp.event_choose_peak_strength_handle_err) {
            rsp.event_choose_peak_strength_handle_err.apply(null, _argv_47129469_d92d_37f1_8cdf_803a9920b5c6);
        }
    }

    public choose_peak_strength_timeout(cb_uuid : number){
        let rsp = this.try_get_and_del_choose_peak_strength_cb(cb_uuid);
        if (rsp){
            if (rsp.event_choose_peak_strength_handle_timeout) {
                rsp.event_choose_peak_strength_handle_timeout.apply(null);
            }
        }
    }

    private try_get_and_del_choose_peak_strength_cb(uuid : number){
        var rsp = this.map_choose_peak_strength.get(uuid);
        this.map_choose_peak_strength.delete(uuid);
        return rsp;
    }

    public start_peak_strength_rsp(inArray:any[]){
        let uuid = inArray[0];
        let _argv_604bcc66_d0b2_3376_8454_39a206b26543:any[] = [];
        _argv_604bcc66_d0b2_3376_8454_39a206b26543.push(common.protcol_to_UserBattleData(inArray[1]));
        _argv_604bcc66_d0b2_3376_8454_39a206b26543.push(common.protcol_to_UserBattleData(inArray[2]));
        var rsp = this.try_get_and_del_start_peak_strength_cb(uuid);
        if (rsp && rsp.event_start_peak_strength_handle_cb) {
            rsp.event_start_peak_strength_handle_cb.apply(null, _argv_604bcc66_d0b2_3376_8454_39a206b26543);
        }
    }

    public start_peak_strength_err(inArray:any[]){
        let uuid = inArray[0];
        let _argv_604bcc66_d0b2_3376_8454_39a206b26543:any[] = [];
        _argv_604bcc66_d0b2_3376_8454_39a206b26543.push(inArray[1]);
        var rsp = this.try_get_and_del_start_peak_strength_cb(uuid);
        if (rsp && rsp.event_start_peak_strength_handle_err) {
            rsp.event_start_peak_strength_handle_err.apply(null, _argv_604bcc66_d0b2_3376_8454_39a206b26543);
        }
    }

    public start_peak_strength_timeout(cb_uuid : number){
        let rsp = this.try_get_and_del_start_peak_strength_cb(cb_uuid);
        if (rsp){
            if (rsp.event_start_peak_strength_handle_timeout) {
                rsp.event_start_peak_strength_handle_timeout.apply(null);
            }
        }
    }

    private try_get_and_del_start_peak_strength_cb(uuid : number){
        var rsp = this.map_start_peak_strength.get(uuid);
        this.map_start_peak_strength.delete(uuid);
        return rsp;
    }

    public confirm_peak_strength_victory_rsp(inArray:any[]){
        let uuid = inArray[0];
        let _argv_cd0e12ec_961a_34c5_9b39_4941f3e29bc9:any[] = [];
        var rsp = this.try_get_and_del_confirm_peak_strength_victory_cb(uuid);
        if (rsp && rsp.event_confirm_peak_strength_victory_handle_cb) {
            rsp.event_confirm_peak_strength_victory_handle_cb.apply(null, _argv_cd0e12ec_961a_34c5_9b39_4941f3e29bc9);
        }
    }

    public confirm_peak_strength_victory_err(inArray:any[]){
        let uuid = inArray[0];
        let _argv_cd0e12ec_961a_34c5_9b39_4941f3e29bc9:any[] = [];
        var rsp = this.try_get_and_del_confirm_peak_strength_victory_cb(uuid);
        if (rsp && rsp.event_confirm_peak_strength_victory_handle_err) {
            rsp.event_confirm_peak_strength_victory_handle_err.apply(null, _argv_cd0e12ec_961a_34c5_9b39_4941f3e29bc9);
        }
    }

    public confirm_peak_strength_victory_timeout(cb_uuid : number){
        let rsp = this.try_get_and_del_confirm_peak_strength_victory_cb(cb_uuid);
        if (rsp){
            if (rsp.event_confirm_peak_strength_victory_handle_timeout) {
                rsp.event_confirm_peak_strength_victory_handle_timeout.apply(null);
            }
        }
    }

    private try_get_and_del_confirm_peak_strength_victory_cb(uuid : number){
        var rsp = this.map_confirm_peak_strength_victory.get(uuid);
        this.map_confirm_peak_strength_victory.delete(uuid);
        return rsp;
    }

}

let rsp_cb_peak_strength_handle : peak_strength_rsp_cb | null = null;
export class peak_strength_caller {
    private _hubproxy:peak_strength_hubproxy;
    constructor(_client:client_handle.client){
        if (rsp_cb_peak_strength_handle == null){
            rsp_cb_peak_strength_handle = new peak_strength_rsp_cb(_client._modulemng);
        }
        this._hubproxy = new peak_strength_hubproxy(_client);
    }

    public get_hub(hub_name:string)
    {
        this._hubproxy.hub_name_0e1cc942_2dde_33a7_af7d_c329c48de74b = hub_name;
        return this._hubproxy;
    }

}

export class peak_strength_hubproxy
{
    private uuid_0e1cc942_2dde_33a7_af7d_c329c48de74b : number = Math.round(Math.random() * 1000);

    public hub_name_0e1cc942_2dde_33a7_af7d_c329c48de74b:string;
    private _client_handle:client_handle.client;

    constructor(client_handle_:client_handle.client)
    {
        this._client_handle = client_handle_;
    }

    public get_peak_strength_formation(){
        let uuid_48534f57_f89c_550e_8882_e435a0a73744 = Math.round(this.uuid_0e1cc942_2dde_33a7_af7d_c329c48de74b++);

        let _argv_22f0b194_9ed2_3829_99ae_268b286a1a05:any[] = [uuid_48534f57_f89c_550e_8882_e435a0a73744];
        this._client_handle.call_hub(this.hub_name_0e1cc942_2dde_33a7_af7d_c329c48de74b, "peak_strength_get_peak_strength_formation", _argv_22f0b194_9ed2_3829_99ae_268b286a1a05);
        let cb_get_peak_strength_formation_obj = new peak_strength_get_peak_strength_formation_cb(uuid_48534f57_f89c_550e_8882_e435a0a73744, rsp_cb_peak_strength_handle);
        if (rsp_cb_peak_strength_handle){
            rsp_cb_peak_strength_handle.map_get_peak_strength_formation.set(uuid_48534f57_f89c_550e_8882_e435a0a73744, cb_get_peak_strength_formation_obj);
        }
        return cb_get_peak_strength_formation_obj;
    }

    public del_peak_strength_formation(index:number){
        let uuid_5a38c249_663d_5f6e_bc8b_b36eb0f6a6bf = Math.round(this.uuid_0e1cc942_2dde_33a7_af7d_c329c48de74b++);

        let _argv_db7ed62a_657a_3ec6_9f6a_7d50bf13f867:any[] = [uuid_5a38c249_663d_5f6e_bc8b_b36eb0f6a6bf];
        _argv_db7ed62a_657a_3ec6_9f6a_7d50bf13f867.push(index);
        this._client_handle.call_hub(this.hub_name_0e1cc942_2dde_33a7_af7d_c329c48de74b, "peak_strength_del_peak_strength_formation", _argv_db7ed62a_657a_3ec6_9f6a_7d50bf13f867);
        let cb_del_peak_strength_formation_obj = new peak_strength_del_peak_strength_formation_cb(uuid_5a38c249_663d_5f6e_bc8b_b36eb0f6a6bf, rsp_cb_peak_strength_handle);
        if (rsp_cb_peak_strength_handle){
            rsp_cb_peak_strength_handle.map_del_peak_strength_formation.set(uuid_5a38c249_663d_5f6e_bc8b_b36eb0f6a6bf, cb_del_peak_strength_formation_obj);
        }
        return cb_del_peak_strength_formation_obj;
    }

    public choose_peak_strength(index:number){
        let uuid_a55befca_d09f_5b2f_b892_9ce05d28d685 = Math.round(this.uuid_0e1cc942_2dde_33a7_af7d_c329c48de74b++);

        let _argv_47129469_d92d_37f1_8cdf_803a9920b5c6:any[] = [uuid_a55befca_d09f_5b2f_b892_9ce05d28d685];
        _argv_47129469_d92d_37f1_8cdf_803a9920b5c6.push(index);
        this._client_handle.call_hub(this.hub_name_0e1cc942_2dde_33a7_af7d_c329c48de74b, "peak_strength_choose_peak_strength", _argv_47129469_d92d_37f1_8cdf_803a9920b5c6);
        let cb_choose_peak_strength_obj = new peak_strength_choose_peak_strength_cb(uuid_a55befca_d09f_5b2f_b892_9ce05d28d685, rsp_cb_peak_strength_handle);
        if (rsp_cb_peak_strength_handle){
            rsp_cb_peak_strength_handle.map_choose_peak_strength.set(uuid_a55befca_d09f_5b2f_b892_9ce05d28d685, cb_choose_peak_strength_obj);
        }
        return cb_choose_peak_strength_obj;
    }

    public start_peak_strength(){
        let uuid_b25d20bd_c716_573b_a301_3462f94ac7ec = Math.round(this.uuid_0e1cc942_2dde_33a7_af7d_c329c48de74b++);

        let _argv_604bcc66_d0b2_3376_8454_39a206b26543:any[] = [uuid_b25d20bd_c716_573b_a301_3462f94ac7ec];
        this._client_handle.call_hub(this.hub_name_0e1cc942_2dde_33a7_af7d_c329c48de74b, "peak_strength_start_peak_strength", _argv_604bcc66_d0b2_3376_8454_39a206b26543);
        let cb_start_peak_strength_obj = new peak_strength_start_peak_strength_cb(uuid_b25d20bd_c716_573b_a301_3462f94ac7ec, rsp_cb_peak_strength_handle);
        if (rsp_cb_peak_strength_handle){
            rsp_cb_peak_strength_handle.map_start_peak_strength.set(uuid_b25d20bd_c716_573b_a301_3462f94ac7ec, cb_start_peak_strength_obj);
        }
        return cb_start_peak_strength_obj;
    }

    public confirm_peak_strength_victory(is_victory:battle_victory){
        let uuid_3a6fe6e2_1f35_5171_8b27_a700195b35c8 = Math.round(this.uuid_0e1cc942_2dde_33a7_af7d_c329c48de74b++);

        let _argv_cd0e12ec_961a_34c5_9b39_4941f3e29bc9:any[] = [uuid_3a6fe6e2_1f35_5171_8b27_a700195b35c8];
        _argv_cd0e12ec_961a_34c5_9b39_4941f3e29bc9.push(is_victory);
        this._client_handle.call_hub(this.hub_name_0e1cc942_2dde_33a7_af7d_c329c48de74b, "peak_strength_confirm_peak_strength_victory", _argv_cd0e12ec_961a_34c5_9b39_4941f3e29bc9);
        let cb_confirm_peak_strength_victory_obj = new peak_strength_confirm_peak_strength_victory_cb(uuid_3a6fe6e2_1f35_5171_8b27_a700195b35c8, rsp_cb_peak_strength_handle);
        if (rsp_cb_peak_strength_handle){
            rsp_cb_peak_strength_handle.map_confirm_peak_strength_victory.set(uuid_3a6fe6e2_1f35_5171_8b27_a700195b35c8, cb_confirm_peak_strength_victory_obj);
        }
        return cb_confirm_peak_strength_victory_obj;
    }

}
