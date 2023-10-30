import * as client_handle from "./client_handle";
import * as common from "./common";
/*this enum code is codegen by abelkhan codegen for ts*/

/*this struct code is codegen by abelkhan codegen for typescript*/
/*this caller code is codegen by abelkhan codegen for typescript*/
export class player_login_player_login_cb{
    private cb_uuid : number;
    private module_rsp_cb : player_login_rsp_cb;

    public event_player_login_handle_cb : (info:common.UserData)=>void | null;
    public event_player_login_handle_err : (err:number)=>void | null;
    public event_player_login_handle_timeout : ()=>void | null;
    constructor(_cb_uuid : number, _module_rsp_cb : player_login_rsp_cb){
        this.cb_uuid = _cb_uuid;
        this.module_rsp_cb = _module_rsp_cb;
        this.event_player_login_handle_cb = null;
        this.event_player_login_handle_err = null;
        this.event_player_login_handle_timeout = null;
    }

    callBack(_cb:(info:common.UserData)=>void, _err:(err:number)=>void)
    {
        this.event_player_login_handle_cb = _cb;
        this.event_player_login_handle_err = _err;
        return this;
    }

    timeout(tick:number, timeout_cb:()=>void)
    {
        setTimeout(()=>{ this.module_rsp_cb.player_login_timeout(this.cb_uuid); }, tick);
        this.event_player_login_handle_timeout = timeout_cb;
    }

}

export class player_login_create_role_cb{
    private cb_uuid : number;
    private module_rsp_cb : player_login_rsp_cb;

    public event_create_role_handle_cb : (info:common.UserData)=>void | null;
    public event_create_role_handle_err : (err:number)=>void | null;
    public event_create_role_handle_timeout : ()=>void | null;
    constructor(_cb_uuid : number, _module_rsp_cb : player_login_rsp_cb){
        this.cb_uuid = _cb_uuid;
        this.module_rsp_cb = _module_rsp_cb;
        this.event_create_role_handle_cb = null;
        this.event_create_role_handle_err = null;
        this.event_create_role_handle_timeout = null;
    }

    callBack(_cb:(info:common.UserData)=>void, _err:(err:number)=>void)
    {
        this.event_create_role_handle_cb = _cb;
        this.event_create_role_handle_err = _err;
        return this;
    }

    timeout(tick:number, timeout_cb:()=>void)
    {
        setTimeout(()=>{ this.module_rsp_cb.create_role_timeout(this.cb_uuid); }, tick);
        this.event_create_role_handle_timeout = timeout_cb;
    }

}

/*this cb code is codegen by abelkhan for ts*/
export class player_login_rsp_cb extends client_handle.imodule {
    public map_player_login:Map<number, player_login_player_login_cb>;
    public map_create_role:Map<number, player_login_create_role_cb>;
    constructor(modules:client_handle.modulemng){
        super();
        this.map_player_login = new Map<number, player_login_player_login_cb>();
        modules.add_method("player_login_rsp_cb_player_login_rsp", this.player_login_rsp.bind(this));
        modules.add_method("player_login_rsp_cb_player_login_err", this.player_login_err.bind(this));
        this.map_create_role = new Map<number, player_login_create_role_cb>();
        modules.add_method("player_login_rsp_cb_create_role_rsp", this.create_role_rsp.bind(this));
        modules.add_method("player_login_rsp_cb_create_role_err", this.create_role_err.bind(this));
    }
    public player_login_rsp(inArray:any[]){
        let uuid = inArray[0];
        let _argv_803b03c3_eef6_3b5c_a790_4cd13c6c4e4b:any[] = [];
        _argv_803b03c3_eef6_3b5c_a790_4cd13c6c4e4b.push(common.protcol_to_UserData(inArray[1]));
        var rsp = this.try_get_and_del_player_login_cb(uuid);
        if (rsp && rsp.event_player_login_handle_cb) {
            rsp.event_player_login_handle_cb.apply(null, _argv_803b03c3_eef6_3b5c_a790_4cd13c6c4e4b);
        }
    }

    public player_login_err(inArray:any[]){
        let uuid = inArray[0];
        let _argv_803b03c3_eef6_3b5c_a790_4cd13c6c4e4b:any[] = [];
        _argv_803b03c3_eef6_3b5c_a790_4cd13c6c4e4b.push(inArray[1]);
        var rsp = this.try_get_and_del_player_login_cb(uuid);
        if (rsp && rsp.event_player_login_handle_err) {
            rsp.event_player_login_handle_err.apply(null, _argv_803b03c3_eef6_3b5c_a790_4cd13c6c4e4b);
        }
    }

    public player_login_timeout(cb_uuid : number){
        let rsp = this.try_get_and_del_player_login_cb(cb_uuid);
        if (rsp){
            if (rsp.event_player_login_handle_timeout) {
                rsp.event_player_login_handle_timeout.apply(null);
            }
        }
    }

    private try_get_and_del_player_login_cb(uuid : number){
        var rsp = this.map_player_login.get(uuid);
        this.map_player_login.delete(uuid);
        return rsp;
    }

    public create_role_rsp(inArray:any[]){
        let uuid = inArray[0];
        let _argv_30293c4a_8f5b_307e_a08a_ff76e003f95d:any[] = [];
        _argv_30293c4a_8f5b_307e_a08a_ff76e003f95d.push(common.protcol_to_UserData(inArray[1]));
        var rsp = this.try_get_and_del_create_role_cb(uuid);
        if (rsp && rsp.event_create_role_handle_cb) {
            rsp.event_create_role_handle_cb.apply(null, _argv_30293c4a_8f5b_307e_a08a_ff76e003f95d);
        }
    }

    public create_role_err(inArray:any[]){
        let uuid = inArray[0];
        let _argv_30293c4a_8f5b_307e_a08a_ff76e003f95d:any[] = [];
        _argv_30293c4a_8f5b_307e_a08a_ff76e003f95d.push(inArray[1]);
        var rsp = this.try_get_and_del_create_role_cb(uuid);
        if (rsp && rsp.event_create_role_handle_err) {
            rsp.event_create_role_handle_err.apply(null, _argv_30293c4a_8f5b_307e_a08a_ff76e003f95d);
        }
    }

    public create_role_timeout(cb_uuid : number){
        let rsp = this.try_get_and_del_create_role_cb(cb_uuid);
        if (rsp){
            if (rsp.event_create_role_handle_timeout) {
                rsp.event_create_role_handle_timeout.apply(null);
            }
        }
    }

    private try_get_and_del_create_role_cb(uuid : number){
        var rsp = this.map_create_role.get(uuid);
        this.map_create_role.delete(uuid);
        return rsp;
    }

}

let rsp_cb_player_login_handle : player_login_rsp_cb | null = null;
export class player_login_caller {
    private _hubproxy:player_login_hubproxy;
    constructor(_client:client_handle.client){
        if (rsp_cb_player_login_handle == null){
            rsp_cb_player_login_handle = new player_login_rsp_cb(_client._modulemng);
        }
        this._hubproxy = new player_login_hubproxy(_client);
    }

    public get_hub(hub_name:string)
    {
        this._hubproxy.hub_name_803b03c3_eef6_3b5c_a790_4cd13c6c4e4b = hub_name;
        return this._hubproxy;
    }

}

export class player_login_hubproxy
{
    private uuid_803b03c3_eef6_3b5c_a790_4cd13c6c4e4b : number = Math.round(Math.random() * 1000);

    public hub_name_803b03c3_eef6_3b5c_a790_4cd13c6c4e4b:string;
    private _client_handle:client_handle.client;

    constructor(client_handle_:client_handle.client)
    {
        this._client_handle = client_handle_;
    }

    public player_login(token:string, nick_name:string){
        let uuid_ab86d08e_f3b3_5b3e_a2b9_8a2b5c189a51 = Math.round(this.uuid_803b03c3_eef6_3b5c_a790_4cd13c6c4e4b++);

        let _argv_803b03c3_eef6_3b5c_a790_4cd13c6c4e4b:any[] = [uuid_ab86d08e_f3b3_5b3e_a2b9_8a2b5c189a51];
        _argv_803b03c3_eef6_3b5c_a790_4cd13c6c4e4b.push(token);
        _argv_803b03c3_eef6_3b5c_a790_4cd13c6c4e4b.push(nick_name);
        this._client_handle.call_hub(this.hub_name_803b03c3_eef6_3b5c_a790_4cd13c6c4e4b, "player_login_player_login", _argv_803b03c3_eef6_3b5c_a790_4cd13c6c4e4b);
        let cb_player_login_obj = new player_login_player_login_cb(uuid_ab86d08e_f3b3_5b3e_a2b9_8a2b5c189a51, rsp_cb_player_login_handle);
        if (rsp_cb_player_login_handle){
            rsp_cb_player_login_handle.map_player_login.set(uuid_ab86d08e_f3b3_5b3e_a2b9_8a2b5c189a51, cb_player_login_obj);
        }
        return cb_player_login_obj;
    }

    public create_role(name:string, nick_name:string){
        let uuid_ef86ed88_4838_5896_8241_9edf3c4b6d21 = Math.round(this.uuid_803b03c3_eef6_3b5c_a790_4cd13c6c4e4b++);

        let _argv_30293c4a_8f5b_307e_a08a_ff76e003f95d:any[] = [uuid_ef86ed88_4838_5896_8241_9edf3c4b6d21];
        _argv_30293c4a_8f5b_307e_a08a_ff76e003f95d.push(name);
        _argv_30293c4a_8f5b_307e_a08a_ff76e003f95d.push(nick_name);
        this._client_handle.call_hub(this.hub_name_803b03c3_eef6_3b5c_a790_4cd13c6c4e4b, "player_login_create_role", _argv_30293c4a_8f5b_307e_a08a_ff76e003f95d);
        let cb_create_role_obj = new player_login_create_role_cb(uuid_ef86ed88_4838_5896_8241_9edf3c4b6d21, rsp_cb_player_login_handle);
        if (rsp_cb_player_login_handle){
            rsp_cb_player_login_handle.map_create_role.set(uuid_ef86ed88_4838_5896_8241_9edf3c4b6d21, cb_create_role_obj);
        }
        return cb_create_role_obj;
    }

}
export class player_battle_start_battle_cb{
    private cb_uuid : number;
    private module_rsp_cb : player_battle_rsp_cb;

    public event_start_battle_handle_cb : (match_name:string, battle_info:common.UserBattleData, shop_info:common.ShopData)=>void | null;
    public event_start_battle_handle_err : (err:number)=>void | null;
    public event_start_battle_handle_timeout : ()=>void | null;
    constructor(_cb_uuid : number, _module_rsp_cb : player_battle_rsp_cb){
        this.cb_uuid = _cb_uuid;
        this.module_rsp_cb = _module_rsp_cb;
        this.event_start_battle_handle_cb = null;
        this.event_start_battle_handle_err = null;
        this.event_start_battle_handle_timeout = null;
    }

    callBack(_cb:(match_name:string, battle_info:common.UserBattleData, shop_info:common.ShopData)=>void, _err:(err:number)=>void)
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
export class player_battle_rsp_cb extends client_handle.imodule {
    public map_start_battle:Map<number, player_battle_start_battle_cb>;
    constructor(modules:client_handle.modulemng){
        super();
        this.map_start_battle = new Map<number, player_battle_start_battle_cb>();
        modules.add_method("player_battle_rsp_cb_start_battle_rsp", this.start_battle_rsp.bind(this));
        modules.add_method("player_battle_rsp_cb_start_battle_err", this.start_battle_err.bind(this));
    }
    public start_battle_rsp(inArray:any[]){
        let uuid = inArray[0];
        let _argv_01e120b2_ff3e_35bc_b812_e0d6fa294873:any[] = [];
        _argv_01e120b2_ff3e_35bc_b812_e0d6fa294873.push(inArray[1]);
        _argv_01e120b2_ff3e_35bc_b812_e0d6fa294873.push(common.protcol_to_UserBattleData(inArray[2]));
        _argv_01e120b2_ff3e_35bc_b812_e0d6fa294873.push(common.protcol_to_ShopData(inArray[3]));
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

let rsp_cb_player_battle_handle : player_battle_rsp_cb | null = null;
export class player_battle_caller {
    private _hubproxy:player_battle_hubproxy;
    constructor(_client:client_handle.client){
        if (rsp_cb_player_battle_handle == null){
            rsp_cb_player_battle_handle = new player_battle_rsp_cb(_client._modulemng);
        }
        this._hubproxy = new player_battle_hubproxy(_client);
    }

    public get_hub(hub_name:string)
    {
        this._hubproxy.hub_name_4ffbb290_f238_38f6_b774_75ba1cccb192 = hub_name;
        return this._hubproxy;
    }

}

export class player_battle_hubproxy
{
    private uuid_4ffbb290_f238_38f6_b774_75ba1cccb192 : number = Math.round(Math.random() * 1000);

    public hub_name_4ffbb290_f238_38f6_b774_75ba1cccb192:string;
    private _client_handle:client_handle.client;

    constructor(client_handle_:client_handle.client)
    {
        this._client_handle = client_handle_;
    }

    public start_battle(){
        let uuid_21a74a63_a13c_539e_b2bc_ef5069375dba = Math.round(this.uuid_4ffbb290_f238_38f6_b774_75ba1cccb192++);

        let _argv_01e120b2_ff3e_35bc_b812_e0d6fa294873:any[] = [uuid_21a74a63_a13c_539e_b2bc_ef5069375dba];
        this._client_handle.call_hub(this.hub_name_4ffbb290_f238_38f6_b774_75ba1cccb192, "player_battle_start_battle", _argv_01e120b2_ff3e_35bc_b812_e0d6fa294873);
        let cb_start_battle_obj = new player_battle_start_battle_cb(uuid_21a74a63_a13c_539e_b2bc_ef5069375dba, rsp_cb_player_battle_handle);
        if (rsp_cb_player_battle_handle){
            rsp_cb_player_battle_handle.map_start_battle.set(uuid_21a74a63_a13c_539e_b2bc_ef5069375dba, cb_start_battle_obj);
        }
        return cb_start_battle_obj;
    }

}
