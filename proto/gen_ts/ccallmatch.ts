import * as client_handle from "./client_handle";
import * as common from "./common";
/*this enum code is codegen by abelkhan codegen for ts*/

/*this struct code is codegen by abelkhan codegen for typescript*/
/*this caller code is codegen by abelkhan codegen for typescript*/
export class plan_buy_cb{
    private cb_uuid : number;
    private module_rsp_cb : plan_rsp_cb;

    public event_buy_handle_cb : (info:common.UserBattleData)=>void | null;
    public event_buy_handle_err : (err:number)=>void | null;
    public event_buy_handle_timeout : ()=>void | null;
    constructor(_cb_uuid : number, _module_rsp_cb : plan_rsp_cb){
        this.cb_uuid = _cb_uuid;
        this.module_rsp_cb = _module_rsp_cb;
        this.event_buy_handle_cb = null;
        this.event_buy_handle_err = null;
        this.event_buy_handle_timeout = null;
    }

    callBack(_cb:(info:common.UserBattleData)=>void, _err:(err:number)=>void)
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

export class plan_start_battle_cb{
    private cb_uuid : number;
    private module_rsp_cb : plan_rsp_cb;

    public event_start_battle_handle_cb : (self:common.UserBattleData, target:common.UserBattleData, is_victory:boolean)=>void | null;
    public event_start_battle_handle_err : (err:number)=>void | null;
    public event_start_battle_handle_timeout : ()=>void | null;
    constructor(_cb_uuid : number, _module_rsp_cb : plan_rsp_cb){
        this.cb_uuid = _cb_uuid;
        this.module_rsp_cb = _module_rsp_cb;
        this.event_start_battle_handle_cb = null;
        this.event_start_battle_handle_err = null;
        this.event_start_battle_handle_timeout = null;
    }

    callBack(_cb:(self:common.UserBattleData, target:common.UserBattleData, is_victory:boolean)=>void, _err:(err:number)=>void)
    {
        this.event_start_battle_handle_cb = _cb;
        this.event_start_battle_handle_err = _err;
        return this;
    }

    timeout(tick:number, timeout_cb:()=>void)
    {
        setTimeout(()=>{ this.module_rsp_cb.start_battle_timeout(this.cb_uuid); }, tick);
        this.event_start_battle_handle_timeout = timeout_cb;
    }

}

/*this cb code is codegen by abelkhan for ts*/
export class plan_rsp_cb extends client_handle.imodule {
    public map_buy:Map<number, plan_buy_cb>;
    public map_sale_role:Map<number, plan_sale_role_cb>;
    public map_refresh:Map<number, plan_refresh_cb>;
    public map_start_battle:Map<number, plan_start_battle_cb>;
    constructor(modules:client_handle.modulemng){
        super();
        this.map_buy = new Map<number, plan_buy_cb>();
        modules.add_method("plan_rsp_cb_buy_rsp", this.buy_rsp.bind(this));
        modules.add_method("plan_rsp_cb_buy_err", this.buy_err.bind(this));
        this.map_sale_role = new Map<number, plan_sale_role_cb>();
        modules.add_method("plan_rsp_cb_sale_role_rsp", this.sale_role_rsp.bind(this));
        modules.add_method("plan_rsp_cb_sale_role_err", this.sale_role_err.bind(this));
        this.map_refresh = new Map<number, plan_refresh_cb>();
        modules.add_method("plan_rsp_cb_refresh_rsp", this.refresh_rsp.bind(this));
        modules.add_method("plan_rsp_cb_refresh_err", this.refresh_err.bind(this));
        this.map_start_battle = new Map<number, plan_start_battle_cb>();
        modules.add_method("plan_rsp_cb_start_battle_rsp", this.start_battle_rsp.bind(this));
        modules.add_method("plan_rsp_cb_start_battle_err", this.start_battle_err.bind(this));
    }
    public buy_rsp(inArray:any[]){
        let uuid = inArray[0];
        let _argv_8e620315_ff2a_3f9c_a655_464ce392ed2d:any[] = [];
        _argv_8e620315_ff2a_3f9c_a655_464ce392ed2d.push(common.protcol_to_UserBattleData(inArray[1]));
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

    public start_battle_rsp(inArray:any[]){
        let uuid = inArray[0];
        let _argv_01e120b2_ff3e_35bc_b812_e0d6fa294873:any[] = [];
        _argv_01e120b2_ff3e_35bc_b812_e0d6fa294873.push(common.protcol_to_UserBattleData(inArray[1]));
        _argv_01e120b2_ff3e_35bc_b812_e0d6fa294873.push(common.protcol_to_UserBattleData(inArray[2]));
        _argv_01e120b2_ff3e_35bc_b812_e0d6fa294873.push(inArray[3]);
        var rsp = this.try_get_and_del_start_battle_cb(uuid);
        if (rsp && rsp.event_start_battle_handle_cb) {
            rsp.event_start_battle_handle_cb.apply(null, _argv_01e120b2_ff3e_35bc_b812_e0d6fa294873);
        }
    }

    public start_battle_err(inArray:any[]){
        let uuid = inArray[0];
        let _argv_01e120b2_ff3e_35bc_b812_e0d6fa294873:any[] = [];
        _argv_01e120b2_ff3e_35bc_b812_e0d6fa294873.push(inArray[1]);
        var rsp = this.try_get_and_del_start_battle_cb(uuid);
        if (rsp && rsp.event_start_battle_handle_err) {
            rsp.event_start_battle_handle_err.apply(null, _argv_01e120b2_ff3e_35bc_b812_e0d6fa294873);
        }
    }

    public start_battle_timeout(cb_uuid : number){
        let rsp = this.try_get_and_del_start_battle_cb(cb_uuid);
        if (rsp){
            if (rsp.event_start_battle_handle_timeout) {
                rsp.event_start_battle_handle_timeout.apply(null);
            }
        }
    }

    private try_get_and_del_start_battle_cb(uuid : number){
        var rsp = this.map_start_battle.get(uuid);
        this.map_start_battle.delete(uuid);
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

    public buy(shop_index:common.ShopIndex, index:number){
        let uuid_4d846fab_804e_563b_998f_6e40c5d2bd39 = Math.round(this.uuid_d9e0c25f_1008_3739_9ff9_86e6a3421324++);

        let _argv_8e620315_ff2a_3f9c_a655_464ce392ed2d:any[] = [uuid_4d846fab_804e_563b_998f_6e40c5d2bd39];
        _argv_8e620315_ff2a_3f9c_a655_464ce392ed2d.push(shop_index);
        _argv_8e620315_ff2a_3f9c_a655_464ce392ed2d.push(index);
        this._client_handle.call_hub(this.hub_name_d9e0c25f_1008_3739_9ff9_86e6a3421324, "plan_buy", _argv_8e620315_ff2a_3f9c_a655_464ce392ed2d);
        let cb_buy_obj = new plan_buy_cb(uuid_4d846fab_804e_563b_998f_6e40c5d2bd39, rsp_cb_plan_handle);
        if (rsp_cb_plan_handle){
            rsp_cb_plan_handle.map_buy.set(uuid_4d846fab_804e_563b_998f_6e40c5d2bd39, cb_buy_obj);
        }
        return cb_buy_obj;
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

    public start_battle(){
        let uuid_21a74a63_a13c_539e_b2bc_ef5069375dba = Math.round(this.uuid_d9e0c25f_1008_3739_9ff9_86e6a3421324++);

        let _argv_01e120b2_ff3e_35bc_b812_e0d6fa294873:any[] = [uuid_21a74a63_a13c_539e_b2bc_ef5069375dba];
        this._client_handle.call_hub(this.hub_name_d9e0c25f_1008_3739_9ff9_86e6a3421324, "plan_start_battle", _argv_01e120b2_ff3e_35bc_b812_e0d6fa294873);
        let cb_start_battle_obj = new plan_start_battle_cb(uuid_21a74a63_a13c_539e_b2bc_ef5069375dba, rsp_cb_plan_handle);
        if (rsp_cb_plan_handle){
            rsp_cb_plan_handle.map_start_battle.set(uuid_21a74a63_a13c_539e_b2bc_ef5069375dba, cb_start_battle_obj);
        }
        return cb_start_battle_obj;
    }

}
