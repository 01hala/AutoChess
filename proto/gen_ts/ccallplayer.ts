import * as client_handle from "./client_handle";
import * as common from "./common";
/*this enum code is codegen by abelkhan codegen for ts*/

export enum em_quest_state{
    next_level = 0,
    next_quest = 1,
    faild = 2
}

/*this struct code is codegen by abelkhan codegen for typescript*/
export class CardPacket
{
    public ItemList : common.RoleCardInfo[] = [];

}

export function CardPacket_to_protcol(_struct:CardPacket){
    return _struct;
}

export function protcol_to_CardPacket(_protocol:any){
    if (_protocol == null) {
        return null;
    }

    let _struct = new CardPacket();
    for (const [key, val] of Object.entries(_protocol)) {
        if (key === "ItemList"){
            _struct.ItemList = [];
            for(let v_ of val as any) {
                _struct.ItemList.push(common.protcol_to_RoleCardInfo(v_));
            }
        }
    }
    return _struct;
}

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

export class player_login_reconnect_cb{
    private cb_uuid : number;
    private module_rsp_cb : player_login_rsp_cb;

    public event_reconnect_handle_cb : (info:common.UserData, match_name:string)=>void | null;
    public event_reconnect_handle_err : (err:number)=>void | null;
    public event_reconnect_handle_timeout : ()=>void | null;
    constructor(_cb_uuid : number, _module_rsp_cb : player_login_rsp_cb){
        this.cb_uuid = _cb_uuid;
        this.module_rsp_cb = _module_rsp_cb;
        this.event_reconnect_handle_cb = null;
        this.event_reconnect_handle_err = null;
        this.event_reconnect_handle_timeout = null;
    }

    callBack(_cb:(info:common.UserData, match_name:string)=>void, _err:(err:number)=>void)
    {
        this.event_reconnect_handle_cb = _cb;
        this.event_reconnect_handle_err = _err;
        return this;
    }

    timeout(tick:number, timeout_cb:()=>void)
    {
        setTimeout(()=>{ this.module_rsp_cb.reconnect_timeout(this.cb_uuid); }, tick);
        this.event_reconnect_handle_timeout = timeout_cb;
    }

}

/*this cb code is codegen by abelkhan for ts*/
export class player_login_rsp_cb extends client_handle.imodule {
    public map_player_login:Map<number, player_login_player_login_cb>;
    public map_create_role:Map<number, player_login_create_role_cb>;
    public map_reconnect:Map<number, player_login_reconnect_cb>;
    constructor(modules:client_handle.modulemng){
        super();
        this.map_player_login = new Map<number, player_login_player_login_cb>();
        modules.add_method("player_login_rsp_cb_player_login_rsp", this.player_login_rsp.bind(this));
        modules.add_method("player_login_rsp_cb_player_login_err", this.player_login_err.bind(this));
        this.map_create_role = new Map<number, player_login_create_role_cb>();
        modules.add_method("player_login_rsp_cb_create_role_rsp", this.create_role_rsp.bind(this));
        modules.add_method("player_login_rsp_cb_create_role_err", this.create_role_err.bind(this));
        this.map_reconnect = new Map<number, player_login_reconnect_cb>();
        modules.add_method("player_login_rsp_cb_reconnect_rsp", this.reconnect_rsp.bind(this));
        modules.add_method("player_login_rsp_cb_reconnect_err", this.reconnect_err.bind(this));
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

    public reconnect_rsp(inArray:any[]){
        let uuid = inArray[0];
        let _argv_4d537d38_2de1_3d0c_9909_5db2dcf1671f:any[] = [];
        _argv_4d537d38_2de1_3d0c_9909_5db2dcf1671f.push(common.protcol_to_UserData(inArray[1]));
        _argv_4d537d38_2de1_3d0c_9909_5db2dcf1671f.push(inArray[2]);
        var rsp = this.try_get_and_del_reconnect_cb(uuid);
        if (rsp && rsp.event_reconnect_handle_cb) {
            rsp.event_reconnect_handle_cb.apply(null, _argv_4d537d38_2de1_3d0c_9909_5db2dcf1671f);
        }
    }

    public reconnect_err(inArray:any[]){
        let uuid = inArray[0];
        let _argv_4d537d38_2de1_3d0c_9909_5db2dcf1671f:any[] = [];
        _argv_4d537d38_2de1_3d0c_9909_5db2dcf1671f.push(inArray[1]);
        var rsp = this.try_get_and_del_reconnect_cb(uuid);
        if (rsp && rsp.event_reconnect_handle_err) {
            rsp.event_reconnect_handle_err.apply(null, _argv_4d537d38_2de1_3d0c_9909_5db2dcf1671f);
        }
    }

    public reconnect_timeout(cb_uuid : number){
        let rsp = this.try_get_and_del_reconnect_cb(cb_uuid);
        if (rsp){
            if (rsp.event_reconnect_handle_timeout) {
                rsp.event_reconnect_handle_timeout.apply(null);
            }
        }
    }

    private try_get_and_del_reconnect_cb(uuid : number){
        var rsp = this.map_reconnect.get(uuid);
        this.map_reconnect.delete(uuid);
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

    public player_login(token:string, nick_name:string, avatar:string){
        let uuid_ab86d08e_f3b3_5b3e_a2b9_8a2b5c189a51 = Math.round(this.uuid_803b03c3_eef6_3b5c_a790_4cd13c6c4e4b++);

        let _argv_803b03c3_eef6_3b5c_a790_4cd13c6c4e4b:any[] = [uuid_ab86d08e_f3b3_5b3e_a2b9_8a2b5c189a51];
        _argv_803b03c3_eef6_3b5c_a790_4cd13c6c4e4b.push(token);
        _argv_803b03c3_eef6_3b5c_a790_4cd13c6c4e4b.push(nick_name);
        _argv_803b03c3_eef6_3b5c_a790_4cd13c6c4e4b.push(avatar);
        this._client_handle.call_hub(this.hub_name_803b03c3_eef6_3b5c_a790_4cd13c6c4e4b, "player_login_player_login", _argv_803b03c3_eef6_3b5c_a790_4cd13c6c4e4b);
        let cb_player_login_obj = new player_login_player_login_cb(uuid_ab86d08e_f3b3_5b3e_a2b9_8a2b5c189a51, rsp_cb_player_login_handle);
        if (rsp_cb_player_login_handle){
            rsp_cb_player_login_handle.map_player_login.set(uuid_ab86d08e_f3b3_5b3e_a2b9_8a2b5c189a51, cb_player_login_obj);
        }
        return cb_player_login_obj;
    }

    public create_role(token:string, name:string, nick_name:string, avatar:string){
        let uuid_ef86ed88_4838_5896_8241_9edf3c4b6d21 = Math.round(this.uuid_803b03c3_eef6_3b5c_a790_4cd13c6c4e4b++);

        let _argv_30293c4a_8f5b_307e_a08a_ff76e003f95d:any[] = [uuid_ef86ed88_4838_5896_8241_9edf3c4b6d21];
        _argv_30293c4a_8f5b_307e_a08a_ff76e003f95d.push(token);
        _argv_30293c4a_8f5b_307e_a08a_ff76e003f95d.push(name);
        _argv_30293c4a_8f5b_307e_a08a_ff76e003f95d.push(nick_name);
        _argv_30293c4a_8f5b_307e_a08a_ff76e003f95d.push(avatar);
        this._client_handle.call_hub(this.hub_name_803b03c3_eef6_3b5c_a790_4cd13c6c4e4b, "player_login_create_role", _argv_30293c4a_8f5b_307e_a08a_ff76e003f95d);
        let cb_create_role_obj = new player_login_create_role_cb(uuid_ef86ed88_4838_5896_8241_9edf3c4b6d21, rsp_cb_player_login_handle);
        if (rsp_cb_player_login_handle){
            rsp_cb_player_login_handle.map_create_role.set(uuid_ef86ed88_4838_5896_8241_9edf3c4b6d21, cb_create_role_obj);
        }
        return cb_create_role_obj;
    }

    public reconnect(guid:number){
        let uuid_7dd9d95e_c232_57eb_ae66_b5c28dd467bc = Math.round(this.uuid_803b03c3_eef6_3b5c_a790_4cd13c6c4e4b++);

        let _argv_4d537d38_2de1_3d0c_9909_5db2dcf1671f:any[] = [uuid_7dd9d95e_c232_57eb_ae66_b5c28dd467bc];
        _argv_4d537d38_2de1_3d0c_9909_5db2dcf1671f.push(guid);
        this._client_handle.call_hub(this.hub_name_803b03c3_eef6_3b5c_a790_4cd13c6c4e4b, "player_login_reconnect", _argv_4d537d38_2de1_3d0c_9909_5db2dcf1671f);
        let cb_reconnect_obj = new player_login_reconnect_cb(uuid_7dd9d95e_c232_57eb_ae66_b5c28dd467bc, rsp_cb_player_login_handle);
        if (rsp_cb_player_login_handle){
            rsp_cb_player_login_handle.map_reconnect.set(uuid_7dd9d95e_c232_57eb_ae66_b5c28dd467bc, cb_reconnect_obj);
        }
        return cb_reconnect_obj;
    }

    public guide_step(step:common.GuideStep){
        let _argv_91882016_2b9d_3ab2_82a8_c1cc18b215f9:any[] = [];
        _argv_91882016_2b9d_3ab2_82a8_c1cc18b215f9.push(step);
        this._client_handle.call_hub(this.hub_name_803b03c3_eef6_3b5c_a790_4cd13c6c4e4b, "player_login_guide_step", _argv_91882016_2b9d_3ab2_82a8_c1cc18b215f9);
    }

}
export class player_shop_buy_card_packet_cb{
    private cb_uuid : number;
    private module_rsp_cb : player_shop_rsp_cb;

    public event_buy_card_packet_handle_cb : (infoCardPacket:CardPacket, infoBag:common.Bag)=>void | null;
    public event_buy_card_packet_handle_err : (err:number)=>void | null;
    public event_buy_card_packet_handle_timeout : ()=>void | null;
    constructor(_cb_uuid : number, _module_rsp_cb : player_shop_rsp_cb){
        this.cb_uuid = _cb_uuid;
        this.module_rsp_cb = _module_rsp_cb;
        this.event_buy_card_packet_handle_cb = null;
        this.event_buy_card_packet_handle_err = null;
        this.event_buy_card_packet_handle_timeout = null;
    }

    callBack(_cb:(infoCardPacket:CardPacket, infoBag:common.Bag)=>void, _err:(err:number)=>void)
    {
        this.event_buy_card_packet_handle_cb = _cb;
        this.event_buy_card_packet_handle_err = _err;
        return this;
    }

    timeout(tick:number, timeout_cb:()=>void)
    {
        setTimeout(()=>{ this.module_rsp_cb.buy_card_packet_timeout(this.cb_uuid); }, tick);
        this.event_buy_card_packet_handle_timeout = timeout_cb;
    }

}

export class player_shop_buy_card_merge_cb{
    private cb_uuid : number;
    private module_rsp_cb : player_shop_rsp_cb;

    public event_buy_card_merge_handle_cb : (roleID:number, info:common.UserData)=>void | null;
    public event_buy_card_merge_handle_err : (err:number)=>void | null;
    public event_buy_card_merge_handle_timeout : ()=>void | null;
    constructor(_cb_uuid : number, _module_rsp_cb : player_shop_rsp_cb){
        this.cb_uuid = _cb_uuid;
        this.module_rsp_cb = _module_rsp_cb;
        this.event_buy_card_merge_handle_cb = null;
        this.event_buy_card_merge_handle_err = null;
        this.event_buy_card_merge_handle_timeout = null;
    }

    callBack(_cb:(roleID:number, info:common.UserData)=>void, _err:(err:number)=>void)
    {
        this.event_buy_card_merge_handle_cb = _cb;
        this.event_buy_card_merge_handle_err = _err;
        return this;
    }

    timeout(tick:number, timeout_cb:()=>void)
    {
        setTimeout(()=>{ this.module_rsp_cb.buy_card_merge_timeout(this.cb_uuid); }, tick);
        this.event_buy_card_merge_handle_timeout = timeout_cb;
    }

}

export class player_shop_edit_role_group_cb{
    private cb_uuid : number;
    private module_rsp_cb : player_shop_rsp_cb;

    public event_edit_role_group_handle_cb : (info:common.UserData)=>void | null;
    public event_edit_role_group_handle_err : (err:number)=>void | null;
    public event_edit_role_group_handle_timeout : ()=>void | null;
    constructor(_cb_uuid : number, _module_rsp_cb : player_shop_rsp_cb){
        this.cb_uuid = _cb_uuid;
        this.module_rsp_cb = _module_rsp_cb;
        this.event_edit_role_group_handle_cb = null;
        this.event_edit_role_group_handle_err = null;
        this.event_edit_role_group_handle_timeout = null;
    }

    callBack(_cb:(info:common.UserData)=>void, _err:(err:number)=>void)
    {
        this.event_edit_role_group_handle_cb = _cb;
        this.event_edit_role_group_handle_err = _err;
        return this;
    }

    timeout(tick:number, timeout_cb:()=>void)
    {
        setTimeout(()=>{ this.module_rsp_cb.edit_role_group_timeout(this.cb_uuid); }, tick);
        this.event_edit_role_group_handle_timeout = timeout_cb;
    }

}

export class player_shop_get_user_data_cb{
    private cb_uuid : number;
    private module_rsp_cb : player_shop_rsp_cb;

    public event_get_user_data_handle_cb : (info:common.UserData)=>void | null;
    public event_get_user_data_handle_err : (err:number)=>void | null;
    public event_get_user_data_handle_timeout : ()=>void | null;
    constructor(_cb_uuid : number, _module_rsp_cb : player_shop_rsp_cb){
        this.cb_uuid = _cb_uuid;
        this.module_rsp_cb = _module_rsp_cb;
        this.event_get_user_data_handle_cb = null;
        this.event_get_user_data_handle_err = null;
        this.event_get_user_data_handle_timeout = null;
    }

    callBack(_cb:(info:common.UserData)=>void, _err:(err:number)=>void)
    {
        this.event_get_user_data_handle_cb = _cb;
        this.event_get_user_data_handle_err = _err;
        return this;
    }

    timeout(tick:number, timeout_cb:()=>void)
    {
        setTimeout(()=>{ this.module_rsp_cb.get_user_data_timeout(this.cb_uuid); }, tick);
        this.event_get_user_data_handle_timeout = timeout_cb;
    }

}

/*this cb code is codegen by abelkhan for ts*/
export class player_shop_rsp_cb extends client_handle.imodule {
    public map_buy_card_packet:Map<number, player_shop_buy_card_packet_cb>;
    public map_buy_card_merge:Map<number, player_shop_buy_card_merge_cb>;
    public map_edit_role_group:Map<number, player_shop_edit_role_group_cb>;
    public map_get_user_data:Map<number, player_shop_get_user_data_cb>;
    constructor(modules:client_handle.modulemng){
        super();
        this.map_buy_card_packet = new Map<number, player_shop_buy_card_packet_cb>();
        modules.add_method("player_shop_rsp_cb_buy_card_packet_rsp", this.buy_card_packet_rsp.bind(this));
        modules.add_method("player_shop_rsp_cb_buy_card_packet_err", this.buy_card_packet_err.bind(this));
        this.map_buy_card_merge = new Map<number, player_shop_buy_card_merge_cb>();
        modules.add_method("player_shop_rsp_cb_buy_card_merge_rsp", this.buy_card_merge_rsp.bind(this));
        modules.add_method("player_shop_rsp_cb_buy_card_merge_err", this.buy_card_merge_err.bind(this));
        this.map_edit_role_group = new Map<number, player_shop_edit_role_group_cb>();
        modules.add_method("player_shop_rsp_cb_edit_role_group_rsp", this.edit_role_group_rsp.bind(this));
        modules.add_method("player_shop_rsp_cb_edit_role_group_err", this.edit_role_group_err.bind(this));
        this.map_get_user_data = new Map<number, player_shop_get_user_data_cb>();
        modules.add_method("player_shop_rsp_cb_get_user_data_rsp", this.get_user_data_rsp.bind(this));
        modules.add_method("player_shop_rsp_cb_get_user_data_err", this.get_user_data_err.bind(this));
    }
    public buy_card_packet_rsp(inArray:any[]){
        let uuid = inArray[0];
        let _argv_d6e5c9ba_cae6_3d78_9c94_378cfb18564f:any[] = [];
        _argv_d6e5c9ba_cae6_3d78_9c94_378cfb18564f.push(protcol_to_CardPacket(inArray[1]));
        _argv_d6e5c9ba_cae6_3d78_9c94_378cfb18564f.push(common.protcol_to_Bag(inArray[2]));
        var rsp = this.try_get_and_del_buy_card_packet_cb(uuid);
        if (rsp && rsp.event_buy_card_packet_handle_cb) {
            rsp.event_buy_card_packet_handle_cb.apply(null, _argv_d6e5c9ba_cae6_3d78_9c94_378cfb18564f);
        }
    }

    public buy_card_packet_err(inArray:any[]){
        let uuid = inArray[0];
        let _argv_d6e5c9ba_cae6_3d78_9c94_378cfb18564f:any[] = [];
        _argv_d6e5c9ba_cae6_3d78_9c94_378cfb18564f.push(inArray[1]);
        var rsp = this.try_get_and_del_buy_card_packet_cb(uuid);
        if (rsp && rsp.event_buy_card_packet_handle_err) {
            rsp.event_buy_card_packet_handle_err.apply(null, _argv_d6e5c9ba_cae6_3d78_9c94_378cfb18564f);
        }
    }

    public buy_card_packet_timeout(cb_uuid : number){
        let rsp = this.try_get_and_del_buy_card_packet_cb(cb_uuid);
        if (rsp){
            if (rsp.event_buy_card_packet_handle_timeout) {
                rsp.event_buy_card_packet_handle_timeout.apply(null);
            }
        }
    }

    private try_get_and_del_buy_card_packet_cb(uuid : number){
        var rsp = this.map_buy_card_packet.get(uuid);
        this.map_buy_card_packet.delete(uuid);
        return rsp;
    }

    public buy_card_merge_rsp(inArray:any[]){
        let uuid = inArray[0];
        let _argv_dee721ae_80aa_378d_8cc9_48d93bcb0586:any[] = [];
        _argv_dee721ae_80aa_378d_8cc9_48d93bcb0586.push(inArray[1]);
        _argv_dee721ae_80aa_378d_8cc9_48d93bcb0586.push(common.protcol_to_UserData(inArray[2]));
        var rsp = this.try_get_and_del_buy_card_merge_cb(uuid);
        if (rsp && rsp.event_buy_card_merge_handle_cb) {
            rsp.event_buy_card_merge_handle_cb.apply(null, _argv_dee721ae_80aa_378d_8cc9_48d93bcb0586);
        }
    }

    public buy_card_merge_err(inArray:any[]){
        let uuid = inArray[0];
        let _argv_dee721ae_80aa_378d_8cc9_48d93bcb0586:any[] = [];
        _argv_dee721ae_80aa_378d_8cc9_48d93bcb0586.push(inArray[1]);
        var rsp = this.try_get_and_del_buy_card_merge_cb(uuid);
        if (rsp && rsp.event_buy_card_merge_handle_err) {
            rsp.event_buy_card_merge_handle_err.apply(null, _argv_dee721ae_80aa_378d_8cc9_48d93bcb0586);
        }
    }

    public buy_card_merge_timeout(cb_uuid : number){
        let rsp = this.try_get_and_del_buy_card_merge_cb(cb_uuid);
        if (rsp){
            if (rsp.event_buy_card_merge_handle_timeout) {
                rsp.event_buy_card_merge_handle_timeout.apply(null);
            }
        }
    }

    private try_get_and_del_buy_card_merge_cb(uuid : number){
        var rsp = this.map_buy_card_merge.get(uuid);
        this.map_buy_card_merge.delete(uuid);
        return rsp;
    }

    public edit_role_group_rsp(inArray:any[]){
        let uuid = inArray[0];
        let _argv_f4590bd7_2111_3754_bf86_154d25227f01:any[] = [];
        _argv_f4590bd7_2111_3754_bf86_154d25227f01.push(common.protcol_to_UserData(inArray[1]));
        var rsp = this.try_get_and_del_edit_role_group_cb(uuid);
        if (rsp && rsp.event_edit_role_group_handle_cb) {
            rsp.event_edit_role_group_handle_cb.apply(null, _argv_f4590bd7_2111_3754_bf86_154d25227f01);
        }
    }

    public edit_role_group_err(inArray:any[]){
        let uuid = inArray[0];
        let _argv_f4590bd7_2111_3754_bf86_154d25227f01:any[] = [];
        _argv_f4590bd7_2111_3754_bf86_154d25227f01.push(inArray[1]);
        var rsp = this.try_get_and_del_edit_role_group_cb(uuid);
        if (rsp && rsp.event_edit_role_group_handle_err) {
            rsp.event_edit_role_group_handle_err.apply(null, _argv_f4590bd7_2111_3754_bf86_154d25227f01);
        }
    }

    public edit_role_group_timeout(cb_uuid : number){
        let rsp = this.try_get_and_del_edit_role_group_cb(cb_uuid);
        if (rsp){
            if (rsp.event_edit_role_group_handle_timeout) {
                rsp.event_edit_role_group_handle_timeout.apply(null);
            }
        }
    }

    private try_get_and_del_edit_role_group_cb(uuid : number){
        var rsp = this.map_edit_role_group.get(uuid);
        this.map_edit_role_group.delete(uuid);
        return rsp;
    }

    public get_user_data_rsp(inArray:any[]){
        let uuid = inArray[0];
        let _argv_f56b8d13_7bcd_3a7e_b0c6_0413a872738b:any[] = [];
        _argv_f56b8d13_7bcd_3a7e_b0c6_0413a872738b.push(common.protcol_to_UserData(inArray[1]));
        var rsp = this.try_get_and_del_get_user_data_cb(uuid);
        if (rsp && rsp.event_get_user_data_handle_cb) {
            rsp.event_get_user_data_handle_cb.apply(null, _argv_f56b8d13_7bcd_3a7e_b0c6_0413a872738b);
        }
    }

    public get_user_data_err(inArray:any[]){
        let uuid = inArray[0];
        let _argv_f56b8d13_7bcd_3a7e_b0c6_0413a872738b:any[] = [];
        _argv_f56b8d13_7bcd_3a7e_b0c6_0413a872738b.push(inArray[1]);
        var rsp = this.try_get_and_del_get_user_data_cb(uuid);
        if (rsp && rsp.event_get_user_data_handle_err) {
            rsp.event_get_user_data_handle_err.apply(null, _argv_f56b8d13_7bcd_3a7e_b0c6_0413a872738b);
        }
    }

    public get_user_data_timeout(cb_uuid : number){
        let rsp = this.try_get_and_del_get_user_data_cb(cb_uuid);
        if (rsp){
            if (rsp.event_get_user_data_handle_timeout) {
                rsp.event_get_user_data_handle_timeout.apply(null);
            }
        }
    }

    private try_get_and_del_get_user_data_cb(uuid : number){
        var rsp = this.map_get_user_data.get(uuid);
        this.map_get_user_data.delete(uuid);
        return rsp;
    }

}

let rsp_cb_player_shop_handle : player_shop_rsp_cb | null = null;
export class player_shop_caller {
    private _hubproxy:player_shop_hubproxy;
    constructor(_client:client_handle.client){
        if (rsp_cb_player_shop_handle == null){
            rsp_cb_player_shop_handle = new player_shop_rsp_cb(_client._modulemng);
        }
        this._hubproxy = new player_shop_hubproxy(_client);
    }

    public get_hub(hub_name:string)
    {
        this._hubproxy.hub_name_77f83686_46a0_3ea6_923e_63294a905f09 = hub_name;
        return this._hubproxy;
    }

}

export class player_shop_hubproxy
{
    private uuid_77f83686_46a0_3ea6_923e_63294a905f09 : number = Math.round(Math.random() * 1000);

    public hub_name_77f83686_46a0_3ea6_923e_63294a905f09:string;
    private _client_handle:client_handle.client;

    constructor(client_handle_:client_handle.client)
    {
        this._client_handle = client_handle_;
    }

    public buy_card_packet(){
        let uuid_d332a5dd_6b0d_5825_a53a_071dbd10b6a4 = Math.round(this.uuid_77f83686_46a0_3ea6_923e_63294a905f09++);

        let _argv_d6e5c9ba_cae6_3d78_9c94_378cfb18564f:any[] = [uuid_d332a5dd_6b0d_5825_a53a_071dbd10b6a4];
        this._client_handle.call_hub(this.hub_name_77f83686_46a0_3ea6_923e_63294a905f09, "player_shop_buy_card_packet", _argv_d6e5c9ba_cae6_3d78_9c94_378cfb18564f);
        let cb_buy_card_packet_obj = new player_shop_buy_card_packet_cb(uuid_d332a5dd_6b0d_5825_a53a_071dbd10b6a4, rsp_cb_player_shop_handle);
        if (rsp_cb_player_shop_handle){
            rsp_cb_player_shop_handle.map_buy_card_packet.set(uuid_d332a5dd_6b0d_5825_a53a_071dbd10b6a4, cb_buy_card_packet_obj);
        }
        return cb_buy_card_packet_obj;
    }

    public buy_card_merge(roleID:number){
        let uuid_18eed6ca_7674_52e6_b275_3f39b727fbfa = Math.round(this.uuid_77f83686_46a0_3ea6_923e_63294a905f09++);

        let _argv_dee721ae_80aa_378d_8cc9_48d93bcb0586:any[] = [uuid_18eed6ca_7674_52e6_b275_3f39b727fbfa];
        _argv_dee721ae_80aa_378d_8cc9_48d93bcb0586.push(roleID);
        this._client_handle.call_hub(this.hub_name_77f83686_46a0_3ea6_923e_63294a905f09, "player_shop_buy_card_merge", _argv_dee721ae_80aa_378d_8cc9_48d93bcb0586);
        let cb_buy_card_merge_obj = new player_shop_buy_card_merge_cb(uuid_18eed6ca_7674_52e6_b275_3f39b727fbfa, rsp_cb_player_shop_handle);
        if (rsp_cb_player_shop_handle){
            rsp_cb_player_shop_handle.map_buy_card_merge.set(uuid_18eed6ca_7674_52e6_b275_3f39b727fbfa, cb_buy_card_merge_obj);
        }
        return cb_buy_card_merge_obj;
    }

    public edit_role_group(roleGroup:common.RoleGroup){
        let uuid_fb4329da_a395_54e4_805b_3c8e1c458077 = Math.round(this.uuid_77f83686_46a0_3ea6_923e_63294a905f09++);

        let _argv_f4590bd7_2111_3754_bf86_154d25227f01:any[] = [uuid_fb4329da_a395_54e4_805b_3c8e1c458077];
        _argv_f4590bd7_2111_3754_bf86_154d25227f01.push(common.RoleGroup_to_protcol(roleGroup));
        this._client_handle.call_hub(this.hub_name_77f83686_46a0_3ea6_923e_63294a905f09, "player_shop_edit_role_group", _argv_f4590bd7_2111_3754_bf86_154d25227f01);
        let cb_edit_role_group_obj = new player_shop_edit_role_group_cb(uuid_fb4329da_a395_54e4_805b_3c8e1c458077, rsp_cb_player_shop_handle);
        if (rsp_cb_player_shop_handle){
            rsp_cb_player_shop_handle.map_edit_role_group.set(uuid_fb4329da_a395_54e4_805b_3c8e1c458077, cb_edit_role_group_obj);
        }
        return cb_edit_role_group_obj;
    }

    public get_user_data(){
        let uuid_5bd45dc3_80d1_5e9b_9f9d_33fd5ad88068 = Math.round(this.uuid_77f83686_46a0_3ea6_923e_63294a905f09++);

        let _argv_f56b8d13_7bcd_3a7e_b0c6_0413a872738b:any[] = [uuid_5bd45dc3_80d1_5e9b_9f9d_33fd5ad88068];
        this._client_handle.call_hub(this.hub_name_77f83686_46a0_3ea6_923e_63294a905f09, "player_shop_get_user_data", _argv_f56b8d13_7bcd_3a7e_b0c6_0413a872738b);
        let cb_get_user_data_obj = new player_shop_get_user_data_cb(uuid_5bd45dc3_80d1_5e9b_9f9d_33fd5ad88068, rsp_cb_player_shop_handle);
        if (rsp_cb_player_shop_handle){
            rsp_cb_player_shop_handle.map_get_user_data.set(uuid_5bd45dc3_80d1_5e9b_9f9d_33fd5ad88068, cb_get_user_data_obj);
        }
        return cb_get_user_data_obj;
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

export class player_battle_start_peak_strength_cb{
    private cb_uuid : number;
    private module_rsp_cb : player_battle_rsp_cb;

    public event_start_peak_strength_handle_cb : (match_name:string, self:common.UserBattleData)=>void | null;
    public event_start_peak_strength_handle_err : (err:number)=>void | null;
    public event_start_peak_strength_handle_timeout : ()=>void | null;
    constructor(_cb_uuid : number, _module_rsp_cb : player_battle_rsp_cb){
        this.cb_uuid = _cb_uuid;
        this.module_rsp_cb = _module_rsp_cb;
        this.event_start_peak_strength_handle_cb = null;
        this.event_start_peak_strength_handle_err = null;
        this.event_start_peak_strength_handle_timeout = null;
    }

    callBack(_cb:(match_name:string, self:common.UserBattleData)=>void, _err:(err:number)=>void)
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

export class player_battle_check_achievement_cb{
    private cb_uuid : number;
    private module_rsp_cb : player_battle_rsp_cb;

    public event_check_achievement_handle_cb : (reward:common.AchievementReward)=>void | null;
    public event_check_achievement_handle_err : (err:number)=>void | null;
    public event_check_achievement_handle_timeout : ()=>void | null;
    constructor(_cb_uuid : number, _module_rsp_cb : player_battle_rsp_cb){
        this.cb_uuid = _cb_uuid;
        this.module_rsp_cb = _module_rsp_cb;
        this.event_check_achievement_handle_cb = null;
        this.event_check_achievement_handle_err = null;
        this.event_check_achievement_handle_timeout = null;
    }

    callBack(_cb:(reward:common.AchievementReward)=>void, _err:(err:number)=>void)
    {
        this.event_check_achievement_handle_cb = _cb;
        this.event_check_achievement_handle_err = _err;
        return this;
    }

    timeout(tick:number, timeout_cb:()=>void)
    {
        setTimeout(()=>{ this.module_rsp_cb.check_achievement_timeout(this.cb_uuid); }, tick);
        this.event_check_achievement_handle_timeout = timeout_cb;
    }

}

/*this cb code is codegen by abelkhan for ts*/
export class player_battle_rsp_cb extends client_handle.imodule {
    public map_start_battle:Map<number, player_battle_start_battle_cb>;
    public map_start_peak_strength:Map<number, player_battle_start_peak_strength_cb>;
    public map_check_achievement:Map<number, player_battle_check_achievement_cb>;
    constructor(modules:client_handle.modulemng){
        super();
        this.map_start_battle = new Map<number, player_battle_start_battle_cb>();
        modules.add_method("player_battle_rsp_cb_start_battle_rsp", this.start_battle_rsp.bind(this));
        modules.add_method("player_battle_rsp_cb_start_battle_err", this.start_battle_err.bind(this));
        this.map_start_peak_strength = new Map<number, player_battle_start_peak_strength_cb>();
        modules.add_method("player_battle_rsp_cb_start_peak_strength_rsp", this.start_peak_strength_rsp.bind(this));
        modules.add_method("player_battle_rsp_cb_start_peak_strength_err", this.start_peak_strength_err.bind(this));
        this.map_check_achievement = new Map<number, player_battle_check_achievement_cb>();
        modules.add_method("player_battle_rsp_cb_check_achievement_rsp", this.check_achievement_rsp.bind(this));
        modules.add_method("player_battle_rsp_cb_check_achievement_err", this.check_achievement_err.bind(this));
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

    public start_peak_strength_rsp(inArray:any[]){
        let uuid = inArray[0];
        let _argv_604bcc66_d0b2_3376_8454_39a206b26543:any[] = [];
        _argv_604bcc66_d0b2_3376_8454_39a206b26543.push(inArray[1]);
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

    public check_achievement_rsp(inArray:any[]){
        let uuid = inArray[0];
        let _argv_485acce4_315a_39a3_a37c_644d60c6fbba:any[] = [];
        _argv_485acce4_315a_39a3_a37c_644d60c6fbba.push(common.protcol_to_AchievementReward(inArray[1]));
        var rsp = this.try_get_and_del_check_achievement_cb(uuid);
        if (rsp && rsp.event_check_achievement_handle_cb) {
            rsp.event_check_achievement_handle_cb.apply(null, _argv_485acce4_315a_39a3_a37c_644d60c6fbba);
        }
    }

    public check_achievement_err(inArray:any[]){
        let uuid = inArray[0];
        let _argv_485acce4_315a_39a3_a37c_644d60c6fbba:any[] = [];
        _argv_485acce4_315a_39a3_a37c_644d60c6fbba.push(inArray[1]);
        var rsp = this.try_get_and_del_check_achievement_cb(uuid);
        if (rsp && rsp.event_check_achievement_handle_err) {
            rsp.event_check_achievement_handle_err.apply(null, _argv_485acce4_315a_39a3_a37c_644d60c6fbba);
        }
    }

    public check_achievement_timeout(cb_uuid : number){
        let rsp = this.try_get_and_del_check_achievement_cb(cb_uuid);
        if (rsp){
            if (rsp.event_check_achievement_handle_timeout) {
                rsp.event_check_achievement_handle_timeout.apply(null);
            }
        }
    }

    private try_get_and_del_check_achievement_cb(uuid : number){
        var rsp = this.map_check_achievement.get(uuid);
        this.map_check_achievement.delete(uuid);
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

    public start_battle(mod:common.BattleMod){
        let uuid_21a74a63_a13c_539e_b2bc_ef5069375dba = Math.round(this.uuid_4ffbb290_f238_38f6_b774_75ba1cccb192++);

        let _argv_01e120b2_ff3e_35bc_b812_e0d6fa294873:any[] = [uuid_21a74a63_a13c_539e_b2bc_ef5069375dba];
        _argv_01e120b2_ff3e_35bc_b812_e0d6fa294873.push(mod);
        this._client_handle.call_hub(this.hub_name_4ffbb290_f238_38f6_b774_75ba1cccb192, "player_battle_start_battle", _argv_01e120b2_ff3e_35bc_b812_e0d6fa294873);
        let cb_start_battle_obj = new player_battle_start_battle_cb(uuid_21a74a63_a13c_539e_b2bc_ef5069375dba, rsp_cb_player_battle_handle);
        if (rsp_cb_player_battle_handle){
            rsp_cb_player_battle_handle.map_start_battle.set(uuid_21a74a63_a13c_539e_b2bc_ef5069375dba, cb_start_battle_obj);
        }
        return cb_start_battle_obj;
    }

    public start_peak_strength(){
        let uuid_b25d20bd_c716_573b_a301_3462f94ac7ec = Math.round(this.uuid_4ffbb290_f238_38f6_b774_75ba1cccb192++);

        let _argv_604bcc66_d0b2_3376_8454_39a206b26543:any[] = [uuid_b25d20bd_c716_573b_a301_3462f94ac7ec];
        this._client_handle.call_hub(this.hub_name_4ffbb290_f238_38f6_b774_75ba1cccb192, "player_battle_start_peak_strength", _argv_604bcc66_d0b2_3376_8454_39a206b26543);
        let cb_start_peak_strength_obj = new player_battle_start_peak_strength_cb(uuid_b25d20bd_c716_573b_a301_3462f94ac7ec, rsp_cb_player_battle_handle);
        if (rsp_cb_player_battle_handle){
            rsp_cb_player_battle_handle.map_start_peak_strength.set(uuid_b25d20bd_c716_573b_a301_3462f94ac7ec, cb_start_peak_strength_obj);
        }
        return cb_start_peak_strength_obj;
    }

    public achievement_gold25(){
        let _argv_5cd25ec8_fa20_3dd1_a685_26b91223e6b0:any[] = [];
        this._client_handle.call_hub(this.hub_name_4ffbb290_f238_38f6_b774_75ba1cccb192, "player_battle_achievement_gold25", _argv_5cd25ec8_fa20_3dd1_a685_26b91223e6b0);
    }

    public kill_role(self:common.Role){
        let _argv_b6c71434_50ac_3952_8c95_87ad2a241a8f:any[] = [];
        _argv_b6c71434_50ac_3952_8c95_87ad2a241a8f.push(common.Role_to_protcol(self));
        this._client_handle.call_hub(this.hub_name_4ffbb290_f238_38f6_b774_75ba1cccb192, "player_battle_kill_role", _argv_b6c71434_50ac_3952_8c95_87ad2a241a8f);
    }

    public check_achievement(achievement:common.Achievement){
        let uuid_76aeb6f4_afa6_580a_b3fa_ed1a3451eb31 = Math.round(this.uuid_4ffbb290_f238_38f6_b774_75ba1cccb192++);

        let _argv_485acce4_315a_39a3_a37c_644d60c6fbba:any[] = [uuid_76aeb6f4_afa6_580a_b3fa_ed1a3451eb31];
        _argv_485acce4_315a_39a3_a37c_644d60c6fbba.push(achievement);
        this._client_handle.call_hub(this.hub_name_4ffbb290_f238_38f6_b774_75ba1cccb192, "player_battle_check_achievement", _argv_485acce4_315a_39a3_a37c_644d60c6fbba);
        let cb_check_achievement_obj = new player_battle_check_achievement_cb(uuid_76aeb6f4_afa6_580a_b3fa_ed1a3451eb31, rsp_cb_player_battle_handle);
        if (rsp_cb_player_battle_handle){
            rsp_cb_player_battle_handle.map_check_achievement.set(uuid_76aeb6f4_afa6_580a_b3fa_ed1a3451eb31, cb_check_achievement_obj);
        }
        return cb_check_achievement_obj;
    }

}
export class player_quest_start_quest_ready_cb{
    private cb_uuid : number;
    private module_rsp_cb : player_quest_rsp_cb;

    public event_start_quest_ready_handle_cb : (events:number[])=>void | null;
    public event_start_quest_ready_handle_err : (err:number)=>void | null;
    public event_start_quest_ready_handle_timeout : ()=>void | null;
    constructor(_cb_uuid : number, _module_rsp_cb : player_quest_rsp_cb){
        this.cb_uuid = _cb_uuid;
        this.module_rsp_cb = _module_rsp_cb;
        this.event_start_quest_ready_handle_cb = null;
        this.event_start_quest_ready_handle_err = null;
        this.event_start_quest_ready_handle_timeout = null;
    }

    callBack(_cb:(events:number[])=>void, _err:(err:number)=>void)
    {
        this.event_start_quest_ready_handle_cb = _cb;
        this.event_start_quest_ready_handle_err = _err;
        return this;
    }

    timeout(tick:number, timeout_cb:()=>void)
    {
        setTimeout(()=>{ this.module_rsp_cb.start_quest_ready_timeout(this.cb_uuid); }, tick);
        this.event_start_quest_ready_handle_timeout = timeout_cb;
    }

}

export class player_quest_start_quest_shop_cb{
    private cb_uuid : number;
    private module_rsp_cb : player_quest_rsp_cb;

    public event_start_quest_shop_handle_cb : (self:common.UserBattleData, shop_info:common.ShopData)=>void | null;
    public event_start_quest_shop_handle_err : (err:number)=>void | null;
    public event_start_quest_shop_handle_timeout : ()=>void | null;
    constructor(_cb_uuid : number, _module_rsp_cb : player_quest_rsp_cb){
        this.cb_uuid = _cb_uuid;
        this.module_rsp_cb = _module_rsp_cb;
        this.event_start_quest_shop_handle_cb = null;
        this.event_start_quest_shop_handle_err = null;
        this.event_start_quest_shop_handle_timeout = null;
    }

    callBack(_cb:(self:common.UserBattleData, shop_info:common.ShopData)=>void, _err:(err:number)=>void)
    {
        this.event_start_quest_shop_handle_cb = _cb;
        this.event_start_quest_shop_handle_err = _err;
        return this;
    }

    timeout(tick:number, timeout_cb:()=>void)
    {
        setTimeout(()=>{ this.module_rsp_cb.start_quest_shop_timeout(this.cb_uuid); }, tick);
        this.event_start_quest_shop_handle_timeout = timeout_cb;
    }

}

export class player_quest_get_quest_shop_data_cb{
    private cb_uuid : number;
    private module_rsp_cb : player_quest_rsp_cb;

    public event_get_quest_shop_data_handle_cb : (self:common.UserBattleData, shop_info:common.ShopData)=>void | null;
    public event_get_quest_shop_data_handle_err : (err:number)=>void | null;
    public event_get_quest_shop_data_handle_timeout : ()=>void | null;
    constructor(_cb_uuid : number, _module_rsp_cb : player_quest_rsp_cb){
        this.cb_uuid = _cb_uuid;
        this.module_rsp_cb = _module_rsp_cb;
        this.event_get_quest_shop_data_handle_cb = null;
        this.event_get_quest_shop_data_handle_err = null;
        this.event_get_quest_shop_data_handle_timeout = null;
    }

    callBack(_cb:(self:common.UserBattleData, shop_info:common.ShopData)=>void, _err:(err:number)=>void)
    {
        this.event_get_quest_shop_data_handle_cb = _cb;
        this.event_get_quest_shop_data_handle_err = _err;
        return this;
    }

    timeout(tick:number, timeout_cb:()=>void)
    {
        setTimeout(()=>{ this.module_rsp_cb.get_quest_shop_data_timeout(this.cb_uuid); }, tick);
        this.event_get_quest_shop_data_handle_timeout = timeout_cb;
    }

}

export class player_quest_start_quest_battle_cb{
    private cb_uuid : number;
    private module_rsp_cb : player_quest_rsp_cb;

    public event_start_quest_battle_handle_cb : (self:common.UserBattleData, target:common.UserBattleData)=>void | null;
    public event_start_quest_battle_handle_err : (err:number)=>void | null;
    public event_start_quest_battle_handle_timeout : ()=>void | null;
    constructor(_cb_uuid : number, _module_rsp_cb : player_quest_rsp_cb){
        this.cb_uuid = _cb_uuid;
        this.module_rsp_cb = _module_rsp_cb;
        this.event_start_quest_battle_handle_cb = null;
        this.event_start_quest_battle_handle_err = null;
        this.event_start_quest_battle_handle_timeout = null;
    }

    callBack(_cb:(self:common.UserBattleData, target:common.UserBattleData)=>void, _err:(err:number)=>void)
    {
        this.event_start_quest_battle_handle_cb = _cb;
        this.event_start_quest_battle_handle_err = _err;
        return this;
    }

    timeout(tick:number, timeout_cb:()=>void)
    {
        setTimeout(()=>{ this.module_rsp_cb.start_quest_battle_timeout(this.cb_uuid); }, tick);
        this.event_start_quest_battle_handle_timeout = timeout_cb;
    }

}

export class player_quest_confirm_quest_victory_cb{
    private cb_uuid : number;
    private module_rsp_cb : player_quest_rsp_cb;

    public event_confirm_quest_victory_handle_cb : (state:em_quest_state)=>void | null;
    public event_confirm_quest_victory_handle_err : ()=>void | null;
    public event_confirm_quest_victory_handle_timeout : ()=>void | null;
    constructor(_cb_uuid : number, _module_rsp_cb : player_quest_rsp_cb){
        this.cb_uuid = _cb_uuid;
        this.module_rsp_cb = _module_rsp_cb;
        this.event_confirm_quest_victory_handle_cb = null;
        this.event_confirm_quest_victory_handle_err = null;
        this.event_confirm_quest_victory_handle_timeout = null;
    }

    callBack(_cb:(state:em_quest_state)=>void, _err:()=>void)
    {
        this.event_confirm_quest_victory_handle_cb = _cb;
        this.event_confirm_quest_victory_handle_err = _err;
        return this;
    }

    timeout(tick:number, timeout_cb:()=>void)
    {
        setTimeout(()=>{ this.module_rsp_cb.confirm_quest_victory_timeout(this.cb_uuid); }, tick);
        this.event_confirm_quest_victory_handle_timeout = timeout_cb;
    }

}

/*this cb code is codegen by abelkhan for ts*/
export class player_quest_rsp_cb extends client_handle.imodule {
    public map_start_quest_ready:Map<number, player_quest_start_quest_ready_cb>;
    public map_start_quest_shop:Map<number, player_quest_start_quest_shop_cb>;
    public map_get_quest_shop_data:Map<number, player_quest_get_quest_shop_data_cb>;
    public map_start_quest_battle:Map<number, player_quest_start_quest_battle_cb>;
    public map_confirm_quest_victory:Map<number, player_quest_confirm_quest_victory_cb>;
    constructor(modules:client_handle.modulemng){
        super();
        this.map_start_quest_ready = new Map<number, player_quest_start_quest_ready_cb>();
        modules.add_method("player_quest_rsp_cb_start_quest_ready_rsp", this.start_quest_ready_rsp.bind(this));
        modules.add_method("player_quest_rsp_cb_start_quest_ready_err", this.start_quest_ready_err.bind(this));
        this.map_start_quest_shop = new Map<number, player_quest_start_quest_shop_cb>();
        modules.add_method("player_quest_rsp_cb_start_quest_shop_rsp", this.start_quest_shop_rsp.bind(this));
        modules.add_method("player_quest_rsp_cb_start_quest_shop_err", this.start_quest_shop_err.bind(this));
        this.map_get_quest_shop_data = new Map<number, player_quest_get_quest_shop_data_cb>();
        modules.add_method("player_quest_rsp_cb_get_quest_shop_data_rsp", this.get_quest_shop_data_rsp.bind(this));
        modules.add_method("player_quest_rsp_cb_get_quest_shop_data_err", this.get_quest_shop_data_err.bind(this));
        this.map_start_quest_battle = new Map<number, player_quest_start_quest_battle_cb>();
        modules.add_method("player_quest_rsp_cb_start_quest_battle_rsp", this.start_quest_battle_rsp.bind(this));
        modules.add_method("player_quest_rsp_cb_start_quest_battle_err", this.start_quest_battle_err.bind(this));
        this.map_confirm_quest_victory = new Map<number, player_quest_confirm_quest_victory_cb>();
        modules.add_method("player_quest_rsp_cb_confirm_quest_victory_rsp", this.confirm_quest_victory_rsp.bind(this));
        modules.add_method("player_quest_rsp_cb_confirm_quest_victory_err", this.confirm_quest_victory_err.bind(this));
    }
    public start_quest_ready_rsp(inArray:any[]){
        let uuid = inArray[0];
        let _argv_fdbc8fd7_e589_3423_b79a_8dc3cdc89d1b:any[] = [];
        let _array_b978d29b_f3bd_5d44_83cd_e1f7a947c9e9:any[] = [];        for(let v_b8b9e66f_efd2_571e_966f_1eef7598c1d5 of inArray[1]){
            _array_b978d29b_f3bd_5d44_83cd_e1f7a947c9e9.push(v_b8b9e66f_efd2_571e_966f_1eef7598c1d5);
        }
        _argv_fdbc8fd7_e589_3423_b79a_8dc3cdc89d1b.push(_array_b978d29b_f3bd_5d44_83cd_e1f7a947c9e9);
        var rsp = this.try_get_and_del_start_quest_ready_cb(uuid);
        if (rsp && rsp.event_start_quest_ready_handle_cb) {
            rsp.event_start_quest_ready_handle_cb.apply(null, _argv_fdbc8fd7_e589_3423_b79a_8dc3cdc89d1b);
        }
    }

    public start_quest_ready_err(inArray:any[]){
        let uuid = inArray[0];
        let _argv_fdbc8fd7_e589_3423_b79a_8dc3cdc89d1b:any[] = [];
        _argv_fdbc8fd7_e589_3423_b79a_8dc3cdc89d1b.push(inArray[1]);
        var rsp = this.try_get_and_del_start_quest_ready_cb(uuid);
        if (rsp && rsp.event_start_quest_ready_handle_err) {
            rsp.event_start_quest_ready_handle_err.apply(null, _argv_fdbc8fd7_e589_3423_b79a_8dc3cdc89d1b);
        }
    }

    public start_quest_ready_timeout(cb_uuid : number){
        let rsp = this.try_get_and_del_start_quest_ready_cb(cb_uuid);
        if (rsp){
            if (rsp.event_start_quest_ready_handle_timeout) {
                rsp.event_start_quest_ready_handle_timeout.apply(null);
            }
        }
    }

    private try_get_and_del_start_quest_ready_cb(uuid : number){
        var rsp = this.map_start_quest_ready.get(uuid);
        this.map_start_quest_ready.delete(uuid);
        return rsp;
    }

    public start_quest_shop_rsp(inArray:any[]){
        let uuid = inArray[0];
        let _argv_1189f0f2_e919_3cdb_a92f_0e4ae9ee6594:any[] = [];
        _argv_1189f0f2_e919_3cdb_a92f_0e4ae9ee6594.push(common.protcol_to_UserBattleData(inArray[1]));
        _argv_1189f0f2_e919_3cdb_a92f_0e4ae9ee6594.push(common.protcol_to_ShopData(inArray[2]));
        var rsp = this.try_get_and_del_start_quest_shop_cb(uuid);
        if (rsp && rsp.event_start_quest_shop_handle_cb) {
            rsp.event_start_quest_shop_handle_cb.apply(null, _argv_1189f0f2_e919_3cdb_a92f_0e4ae9ee6594);
        }
    }

    public start_quest_shop_err(inArray:any[]){
        let uuid = inArray[0];
        let _argv_1189f0f2_e919_3cdb_a92f_0e4ae9ee6594:any[] = [];
        _argv_1189f0f2_e919_3cdb_a92f_0e4ae9ee6594.push(inArray[1]);
        var rsp = this.try_get_and_del_start_quest_shop_cb(uuid);
        if (rsp && rsp.event_start_quest_shop_handle_err) {
            rsp.event_start_quest_shop_handle_err.apply(null, _argv_1189f0f2_e919_3cdb_a92f_0e4ae9ee6594);
        }
    }

    public start_quest_shop_timeout(cb_uuid : number){
        let rsp = this.try_get_and_del_start_quest_shop_cb(cb_uuid);
        if (rsp){
            if (rsp.event_start_quest_shop_handle_timeout) {
                rsp.event_start_quest_shop_handle_timeout.apply(null);
            }
        }
    }

    private try_get_and_del_start_quest_shop_cb(uuid : number){
        var rsp = this.map_start_quest_shop.get(uuid);
        this.map_start_quest_shop.delete(uuid);
        return rsp;
    }

    public get_quest_shop_data_rsp(inArray:any[]){
        let uuid = inArray[0];
        let _argv_de916e71_7fdb_3c5f_9033_9a7783aa8d83:any[] = [];
        _argv_de916e71_7fdb_3c5f_9033_9a7783aa8d83.push(common.protcol_to_UserBattleData(inArray[1]));
        _argv_de916e71_7fdb_3c5f_9033_9a7783aa8d83.push(common.protcol_to_ShopData(inArray[2]));
        var rsp = this.try_get_and_del_get_quest_shop_data_cb(uuid);
        if (rsp && rsp.event_get_quest_shop_data_handle_cb) {
            rsp.event_get_quest_shop_data_handle_cb.apply(null, _argv_de916e71_7fdb_3c5f_9033_9a7783aa8d83);
        }
    }

    public get_quest_shop_data_err(inArray:any[]){
        let uuid = inArray[0];
        let _argv_de916e71_7fdb_3c5f_9033_9a7783aa8d83:any[] = [];
        _argv_de916e71_7fdb_3c5f_9033_9a7783aa8d83.push(inArray[1]);
        var rsp = this.try_get_and_del_get_quest_shop_data_cb(uuid);
        if (rsp && rsp.event_get_quest_shop_data_handle_err) {
            rsp.event_get_quest_shop_data_handle_err.apply(null, _argv_de916e71_7fdb_3c5f_9033_9a7783aa8d83);
        }
    }

    public get_quest_shop_data_timeout(cb_uuid : number){
        let rsp = this.try_get_and_del_get_quest_shop_data_cb(cb_uuid);
        if (rsp){
            if (rsp.event_get_quest_shop_data_handle_timeout) {
                rsp.event_get_quest_shop_data_handle_timeout.apply(null);
            }
        }
    }

    private try_get_and_del_get_quest_shop_data_cb(uuid : number){
        var rsp = this.map_get_quest_shop_data.get(uuid);
        this.map_get_quest_shop_data.delete(uuid);
        return rsp;
    }

    public start_quest_battle_rsp(inArray:any[]){
        let uuid = inArray[0];
        let _argv_4b96d2e4_0415_3509_9367_6252f268b1e2:any[] = [];
        _argv_4b96d2e4_0415_3509_9367_6252f268b1e2.push(common.protcol_to_UserBattleData(inArray[1]));
        _argv_4b96d2e4_0415_3509_9367_6252f268b1e2.push(common.protcol_to_UserBattleData(inArray[2]));
        var rsp = this.try_get_and_del_start_quest_battle_cb(uuid);
        if (rsp && rsp.event_start_quest_battle_handle_cb) {
            rsp.event_start_quest_battle_handle_cb.apply(null, _argv_4b96d2e4_0415_3509_9367_6252f268b1e2);
        }
    }

    public start_quest_battle_err(inArray:any[]){
        let uuid = inArray[0];
        let _argv_4b96d2e4_0415_3509_9367_6252f268b1e2:any[] = [];
        _argv_4b96d2e4_0415_3509_9367_6252f268b1e2.push(inArray[1]);
        var rsp = this.try_get_and_del_start_quest_battle_cb(uuid);
        if (rsp && rsp.event_start_quest_battle_handle_err) {
            rsp.event_start_quest_battle_handle_err.apply(null, _argv_4b96d2e4_0415_3509_9367_6252f268b1e2);
        }
    }

    public start_quest_battle_timeout(cb_uuid : number){
        let rsp = this.try_get_and_del_start_quest_battle_cb(cb_uuid);
        if (rsp){
            if (rsp.event_start_quest_battle_handle_timeout) {
                rsp.event_start_quest_battle_handle_timeout.apply(null);
            }
        }
    }

    private try_get_and_del_start_quest_battle_cb(uuid : number){
        var rsp = this.map_start_quest_battle.get(uuid);
        this.map_start_quest_battle.delete(uuid);
        return rsp;
    }

    public confirm_quest_victory_rsp(inArray:any[]){
        let uuid = inArray[0];
        let _argv_198411f5_7bbd_3504_8bea_49ff5f26c069:any[] = [];
        _argv_198411f5_7bbd_3504_8bea_49ff5f26c069.push(inArray[1]);
        var rsp = this.try_get_and_del_confirm_quest_victory_cb(uuid);
        if (rsp && rsp.event_confirm_quest_victory_handle_cb) {
            rsp.event_confirm_quest_victory_handle_cb.apply(null, _argv_198411f5_7bbd_3504_8bea_49ff5f26c069);
        }
    }

    public confirm_quest_victory_err(inArray:any[]){
        let uuid = inArray[0];
        let _argv_198411f5_7bbd_3504_8bea_49ff5f26c069:any[] = [];
        var rsp = this.try_get_and_del_confirm_quest_victory_cb(uuid);
        if (rsp && rsp.event_confirm_quest_victory_handle_err) {
            rsp.event_confirm_quest_victory_handle_err.apply(null, _argv_198411f5_7bbd_3504_8bea_49ff5f26c069);
        }
    }

    public confirm_quest_victory_timeout(cb_uuid : number){
        let rsp = this.try_get_and_del_confirm_quest_victory_cb(cb_uuid);
        if (rsp){
            if (rsp.event_confirm_quest_victory_handle_timeout) {
                rsp.event_confirm_quest_victory_handle_timeout.apply(null);
            }
        }
    }

    private try_get_and_del_confirm_quest_victory_cb(uuid : number){
        var rsp = this.map_confirm_quest_victory.get(uuid);
        this.map_confirm_quest_victory.delete(uuid);
        return rsp;
    }

}

let rsp_cb_player_quest_handle : player_quest_rsp_cb | null = null;
export class player_quest_caller {
    private _hubproxy:player_quest_hubproxy;
    constructor(_client:client_handle.client){
        if (rsp_cb_player_quest_handle == null){
            rsp_cb_player_quest_handle = new player_quest_rsp_cb(_client._modulemng);
        }
        this._hubproxy = new player_quest_hubproxy(_client);
    }

    public get_hub(hub_name:string)
    {
        this._hubproxy.hub_name_9d8491d3_2061_3c89_a7c5_ff8692e778c5 = hub_name;
        return this._hubproxy;
    }

}

export class player_quest_hubproxy
{
    private uuid_9d8491d3_2061_3c89_a7c5_ff8692e778c5 : number = Math.round(Math.random() * 1000);

    public hub_name_9d8491d3_2061_3c89_a7c5_ff8692e778c5:string;
    private _client_handle:client_handle.client;

    constructor(client_handle_:client_handle.client)
    {
        this._client_handle = client_handle_;
    }

    public start_quest_ready(){
        let uuid_4faab574_3520_56a4_ab9e_8c1e9b23fa02 = Math.round(this.uuid_9d8491d3_2061_3c89_a7c5_ff8692e778c5++);

        let _argv_fdbc8fd7_e589_3423_b79a_8dc3cdc89d1b:any[] = [uuid_4faab574_3520_56a4_ab9e_8c1e9b23fa02];
        this._client_handle.call_hub(this.hub_name_9d8491d3_2061_3c89_a7c5_ff8692e778c5, "player_quest_start_quest_ready", _argv_fdbc8fd7_e589_3423_b79a_8dc3cdc89d1b);
        let cb_start_quest_ready_obj = new player_quest_start_quest_ready_cb(uuid_4faab574_3520_56a4_ab9e_8c1e9b23fa02, rsp_cb_player_quest_handle);
        if (rsp_cb_player_quest_handle){
            rsp_cb_player_quest_handle.map_start_quest_ready.set(uuid_4faab574_3520_56a4_ab9e_8c1e9b23fa02, cb_start_quest_ready_obj);
        }
        return cb_start_quest_ready_obj;
    }

    public start_quest_shop(eventID:number){
        let uuid_dfe82999_8d37_588f_8590_c22ea36588c2 = Math.round(this.uuid_9d8491d3_2061_3c89_a7c5_ff8692e778c5++);

        let _argv_1189f0f2_e919_3cdb_a92f_0e4ae9ee6594:any[] = [uuid_dfe82999_8d37_588f_8590_c22ea36588c2];
        _argv_1189f0f2_e919_3cdb_a92f_0e4ae9ee6594.push(eventID);
        this._client_handle.call_hub(this.hub_name_9d8491d3_2061_3c89_a7c5_ff8692e778c5, "player_quest_start_quest_shop", _argv_1189f0f2_e919_3cdb_a92f_0e4ae9ee6594);
        let cb_start_quest_shop_obj = new player_quest_start_quest_shop_cb(uuid_dfe82999_8d37_588f_8590_c22ea36588c2, rsp_cb_player_quest_handle);
        if (rsp_cb_player_quest_handle){
            rsp_cb_player_quest_handle.map_start_quest_shop.set(uuid_dfe82999_8d37_588f_8590_c22ea36588c2, cb_start_quest_shop_obj);
        }
        return cb_start_quest_shop_obj;
    }

    public get_quest_shop_data(){
        let uuid_b87a1705_d4ca_5686_985c_766efc2393bc = Math.round(this.uuid_9d8491d3_2061_3c89_a7c5_ff8692e778c5++);

        let _argv_de916e71_7fdb_3c5f_9033_9a7783aa8d83:any[] = [uuid_b87a1705_d4ca_5686_985c_766efc2393bc];
        this._client_handle.call_hub(this.hub_name_9d8491d3_2061_3c89_a7c5_ff8692e778c5, "player_quest_get_quest_shop_data", _argv_de916e71_7fdb_3c5f_9033_9a7783aa8d83);
        let cb_get_quest_shop_data_obj = new player_quest_get_quest_shop_data_cb(uuid_b87a1705_d4ca_5686_985c_766efc2393bc, rsp_cb_player_quest_handle);
        if (rsp_cb_player_quest_handle){
            rsp_cb_player_quest_handle.map_get_quest_shop_data.set(uuid_b87a1705_d4ca_5686_985c_766efc2393bc, cb_get_quest_shop_data_obj);
        }
        return cb_get_quest_shop_data_obj;
    }

    public start_quest_battle(){
        let uuid_a1421b84_f967_5fdc_856f_8b8c15be5e1e = Math.round(this.uuid_9d8491d3_2061_3c89_a7c5_ff8692e778c5++);

        let _argv_4b96d2e4_0415_3509_9367_6252f268b1e2:any[] = [uuid_a1421b84_f967_5fdc_856f_8b8c15be5e1e];
        this._client_handle.call_hub(this.hub_name_9d8491d3_2061_3c89_a7c5_ff8692e778c5, "player_quest_start_quest_battle", _argv_4b96d2e4_0415_3509_9367_6252f268b1e2);
        let cb_start_quest_battle_obj = new player_quest_start_quest_battle_cb(uuid_a1421b84_f967_5fdc_856f_8b8c15be5e1e, rsp_cb_player_quest_handle);
        if (rsp_cb_player_quest_handle){
            rsp_cb_player_quest_handle.map_start_quest_battle.set(uuid_a1421b84_f967_5fdc_856f_8b8c15be5e1e, cb_start_quest_battle_obj);
        }
        return cb_start_quest_battle_obj;
    }

    public confirm_quest_victory(is_victory:common.BattleVictory){
        let uuid_874935e4_2123_57e0_9c8b_252cc28d4e7c = Math.round(this.uuid_9d8491d3_2061_3c89_a7c5_ff8692e778c5++);

        let _argv_198411f5_7bbd_3504_8bea_49ff5f26c069:any[] = [uuid_874935e4_2123_57e0_9c8b_252cc28d4e7c];
        _argv_198411f5_7bbd_3504_8bea_49ff5f26c069.push(is_victory);
        this._client_handle.call_hub(this.hub_name_9d8491d3_2061_3c89_a7c5_ff8692e778c5, "player_quest_confirm_quest_victory", _argv_198411f5_7bbd_3504_8bea_49ff5f26c069);
        let cb_confirm_quest_victory_obj = new player_quest_confirm_quest_victory_cb(uuid_874935e4_2123_57e0_9c8b_252cc28d4e7c, rsp_cb_player_quest_handle);
        if (rsp_cb_player_quest_handle){
            rsp_cb_player_quest_handle.map_confirm_quest_victory.set(uuid_874935e4_2123_57e0_9c8b_252cc28d4e7c, cb_confirm_quest_victory_obj);
        }
        return cb_confirm_quest_victory_obj;
    }

}
