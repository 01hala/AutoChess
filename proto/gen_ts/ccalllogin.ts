import * as client_handle from "./client_handle";
/*this enum code is codegen by abelkhan codegen for ts*/

/*this struct code is codegen by abelkhan codegen for typescript*/
/*this caller code is codegen by abelkhan codegen for typescript*/
export class login_player_login_no_token_cb{
    private cb_uuid : number;
    private module_rsp_cb : login_rsp_cb;

    public event_player_login_no_token_handle_cb : (player_hub_name:string, token:string, is_new:boolean)=>void | null;
    public event_player_login_no_token_handle_err : (err:number)=>void | null;
    public event_player_login_no_token_handle_timeout : ()=>void | null;
    constructor(_cb_uuid : number, _module_rsp_cb : login_rsp_cb){
        this.cb_uuid = _cb_uuid;
        this.module_rsp_cb = _module_rsp_cb;
        this.event_player_login_no_token_handle_cb = null;
        this.event_player_login_no_token_handle_err = null;
        this.event_player_login_no_token_handle_timeout = null;
    }

    callBack(_cb:(player_hub_name:string, token:string, is_new:boolean)=>void, _err:(err:number)=>void)
    {
        this.event_player_login_no_token_handle_cb = _cb;
        this.event_player_login_no_token_handle_err = _err;
        return this;
    }

    timeout(tick:number, timeout_cb:()=>void)
    {
        setTimeout(()=>{ this.module_rsp_cb.player_login_no_token_timeout(this.cb_uuid); }, tick);
        this.event_player_login_no_token_handle_timeout = timeout_cb;
    }

}

export class login_player_login_wx_cb{
    private cb_uuid : number;
    private module_rsp_cb : login_rsp_cb;

    public event_player_login_wx_handle_cb : (player_hub_name:string, token:string, is_new:boolean)=>void | null;
    public event_player_login_wx_handle_err : (err:number)=>void | null;
    public event_player_login_wx_handle_timeout : ()=>void | null;
    constructor(_cb_uuid : number, _module_rsp_cb : login_rsp_cb){
        this.cb_uuid = _cb_uuid;
        this.module_rsp_cb = _module_rsp_cb;
        this.event_player_login_wx_handle_cb = null;
        this.event_player_login_wx_handle_err = null;
        this.event_player_login_wx_handle_timeout = null;
    }

    callBack(_cb:(player_hub_name:string, token:string, is_new:boolean)=>void, _err:(err:number)=>void)
    {
        this.event_player_login_wx_handle_cb = _cb;
        this.event_player_login_wx_handle_err = _err;
        return this;
    }

    timeout(tick:number, timeout_cb:()=>void)
    {
        setTimeout(()=>{ this.module_rsp_cb.player_login_wx_timeout(this.cb_uuid); }, tick);
        this.event_player_login_wx_handle_timeout = timeout_cb;
    }

}

export class login_player_login_dy_cb{
    private cb_uuid : number;
    private module_rsp_cb : login_rsp_cb;

    public event_player_login_dy_handle_cb : (player_hub_name:string, token:string, is_new:boolean)=>void | null;
    public event_player_login_dy_handle_err : (err:number)=>void | null;
    public event_player_login_dy_handle_timeout : ()=>void | null;
    constructor(_cb_uuid : number, _module_rsp_cb : login_rsp_cb){
        this.cb_uuid = _cb_uuid;
        this.module_rsp_cb = _module_rsp_cb;
        this.event_player_login_dy_handle_cb = null;
        this.event_player_login_dy_handle_err = null;
        this.event_player_login_dy_handle_timeout = null;
    }

    callBack(_cb:(player_hub_name:string, token:string, is_new:boolean)=>void, _err:(err:number)=>void)
    {
        this.event_player_login_dy_handle_cb = _cb;
        this.event_player_login_dy_handle_err = _err;
        return this;
    }

    timeout(tick:number, timeout_cb:()=>void)
    {
        setTimeout(()=>{ this.module_rsp_cb.player_login_dy_timeout(this.cb_uuid); }, tick);
        this.event_player_login_dy_handle_timeout = timeout_cb;
    }

}

/*this cb code is codegen by abelkhan for ts*/
export class login_rsp_cb extends client_handle.imodule {
    public map_player_login_no_token:Map<number, login_player_login_no_token_cb>;
    public map_player_login_wx:Map<number, login_player_login_wx_cb>;
    public map_player_login_dy:Map<number, login_player_login_dy_cb>;
    constructor(modules:client_handle.modulemng){
        super();
        this.map_player_login_no_token = new Map<number, login_player_login_no_token_cb>();
        modules.add_method("login_rsp_cb_player_login_no_token_rsp", this.player_login_no_token_rsp.bind(this));
        modules.add_method("login_rsp_cb_player_login_no_token_err", this.player_login_no_token_err.bind(this));
        this.map_player_login_wx = new Map<number, login_player_login_wx_cb>();
        modules.add_method("login_rsp_cb_player_login_wx_rsp", this.player_login_wx_rsp.bind(this));
        modules.add_method("login_rsp_cb_player_login_wx_err", this.player_login_wx_err.bind(this));
        this.map_player_login_dy = new Map<number, login_player_login_dy_cb>();
        modules.add_method("login_rsp_cb_player_login_dy_rsp", this.player_login_dy_rsp.bind(this));
        modules.add_method("login_rsp_cb_player_login_dy_err", this.player_login_dy_err.bind(this));
    }
    public player_login_no_token_rsp(inArray:any[]){
        let uuid = inArray[0];
        let _argv_3e2e7610_1bd3_3053_a6cb_55c17d6b8ebf:any[] = [];
        _argv_3e2e7610_1bd3_3053_a6cb_55c17d6b8ebf.push(inArray[1]);
        _argv_3e2e7610_1bd3_3053_a6cb_55c17d6b8ebf.push(inArray[2]);
        _argv_3e2e7610_1bd3_3053_a6cb_55c17d6b8ebf.push(inArray[3]);
        var rsp = this.try_get_and_del_player_login_no_token_cb(uuid);
        if (rsp && rsp.event_player_login_no_token_handle_cb) {
            rsp.event_player_login_no_token_handle_cb.apply(null, _argv_3e2e7610_1bd3_3053_a6cb_55c17d6b8ebf);
        }
    }

    public player_login_no_token_err(inArray:any[]){
        let uuid = inArray[0];
        let _argv_3e2e7610_1bd3_3053_a6cb_55c17d6b8ebf:any[] = [];
        _argv_3e2e7610_1bd3_3053_a6cb_55c17d6b8ebf.push(inArray[1]);
        var rsp = this.try_get_and_del_player_login_no_token_cb(uuid);
        if (rsp && rsp.event_player_login_no_token_handle_err) {
            rsp.event_player_login_no_token_handle_err.apply(null, _argv_3e2e7610_1bd3_3053_a6cb_55c17d6b8ebf);
        }
    }

    public player_login_no_token_timeout(cb_uuid : number){
        let rsp = this.try_get_and_del_player_login_no_token_cb(cb_uuid);
        if (rsp){
            if (rsp.event_player_login_no_token_handle_timeout) {
                rsp.event_player_login_no_token_handle_timeout.apply(null);
            }
        }
    }

    private try_get_and_del_player_login_no_token_cb(uuid : number){
        var rsp = this.map_player_login_no_token.get(uuid);
        this.map_player_login_no_token.delete(uuid);
        return rsp;
    }

    public player_login_wx_rsp(inArray:any[]){
        let uuid = inArray[0];
        let _argv_f260ea6c_9f00_31da_bd24_7e885d5e027d:any[] = [];
        _argv_f260ea6c_9f00_31da_bd24_7e885d5e027d.push(inArray[1]);
        _argv_f260ea6c_9f00_31da_bd24_7e885d5e027d.push(inArray[2]);
        _argv_f260ea6c_9f00_31da_bd24_7e885d5e027d.push(inArray[3]);
        var rsp = this.try_get_and_del_player_login_wx_cb(uuid);
        if (rsp && rsp.event_player_login_wx_handle_cb) {
            rsp.event_player_login_wx_handle_cb.apply(null, _argv_f260ea6c_9f00_31da_bd24_7e885d5e027d);
        }
    }

    public player_login_wx_err(inArray:any[]){
        let uuid = inArray[0];
        let _argv_f260ea6c_9f00_31da_bd24_7e885d5e027d:any[] = [];
        _argv_f260ea6c_9f00_31da_bd24_7e885d5e027d.push(inArray[1]);
        var rsp = this.try_get_and_del_player_login_wx_cb(uuid);
        if (rsp && rsp.event_player_login_wx_handle_err) {
            rsp.event_player_login_wx_handle_err.apply(null, _argv_f260ea6c_9f00_31da_bd24_7e885d5e027d);
        }
    }

    public player_login_wx_timeout(cb_uuid : number){
        let rsp = this.try_get_and_del_player_login_wx_cb(cb_uuid);
        if (rsp){
            if (rsp.event_player_login_wx_handle_timeout) {
                rsp.event_player_login_wx_handle_timeout.apply(null);
            }
        }
    }

    private try_get_and_del_player_login_wx_cb(uuid : number){
        var rsp = this.map_player_login_wx.get(uuid);
        this.map_player_login_wx.delete(uuid);
        return rsp;
    }

    public player_login_dy_rsp(inArray:any[]){
        let uuid = inArray[0];
        let _argv_71c7fc76_b480_3603_a181_4245a2f78904:any[] = [];
        _argv_71c7fc76_b480_3603_a181_4245a2f78904.push(inArray[1]);
        _argv_71c7fc76_b480_3603_a181_4245a2f78904.push(inArray[2]);
        _argv_71c7fc76_b480_3603_a181_4245a2f78904.push(inArray[3]);
        var rsp = this.try_get_and_del_player_login_dy_cb(uuid);
        if (rsp && rsp.event_player_login_dy_handle_cb) {
            rsp.event_player_login_dy_handle_cb.apply(null, _argv_71c7fc76_b480_3603_a181_4245a2f78904);
        }
    }

    public player_login_dy_err(inArray:any[]){
        let uuid = inArray[0];
        let _argv_71c7fc76_b480_3603_a181_4245a2f78904:any[] = [];
        _argv_71c7fc76_b480_3603_a181_4245a2f78904.push(inArray[1]);
        var rsp = this.try_get_and_del_player_login_dy_cb(uuid);
        if (rsp && rsp.event_player_login_dy_handle_err) {
            rsp.event_player_login_dy_handle_err.apply(null, _argv_71c7fc76_b480_3603_a181_4245a2f78904);
        }
    }

    public player_login_dy_timeout(cb_uuid : number){
        let rsp = this.try_get_and_del_player_login_dy_cb(cb_uuid);
        if (rsp){
            if (rsp.event_player_login_dy_handle_timeout) {
                rsp.event_player_login_dy_handle_timeout.apply(null);
            }
        }
    }

    private try_get_and_del_player_login_dy_cb(uuid : number){
        var rsp = this.map_player_login_dy.get(uuid);
        this.map_player_login_dy.delete(uuid);
        return rsp;
    }

}

let rsp_cb_login_handle : login_rsp_cb | null = null;
export class login_caller {
    private _hubproxy:login_hubproxy;
    constructor(_client:client_handle.client){
        if (rsp_cb_login_handle == null){
            rsp_cb_login_handle = new login_rsp_cb(_client._modulemng);
        }
        this._hubproxy = new login_hubproxy(_client);
    }

    public get_hub(hub_name:string)
    {
        this._hubproxy.hub_name_d3bb20a7_d0fc_3440_bb9e_b3cc0630e2d1 = hub_name;
        return this._hubproxy;
    }

}

export class login_hubproxy
{
    private uuid_d3bb20a7_d0fc_3440_bb9e_b3cc0630e2d1 : number = Math.round(Math.random() * 1000);

    public hub_name_d3bb20a7_d0fc_3440_bb9e_b3cc0630e2d1:string;
    private _client_handle:client_handle.client;

    constructor(client_handle_:client_handle.client)
    {
        this._client_handle = client_handle_;
    }

    public player_login_no_token(account:string){
        let uuid_00017cbe_94c5_56b5_87e2_c5401bf747b7 = Math.round(this.uuid_d3bb20a7_d0fc_3440_bb9e_b3cc0630e2d1++);

        let _argv_3e2e7610_1bd3_3053_a6cb_55c17d6b8ebf:any[] = [uuid_00017cbe_94c5_56b5_87e2_c5401bf747b7];
        _argv_3e2e7610_1bd3_3053_a6cb_55c17d6b8ebf.push(account);
        this._client_handle.call_hub(this.hub_name_d3bb20a7_d0fc_3440_bb9e_b3cc0630e2d1, "login_player_login_no_token", _argv_3e2e7610_1bd3_3053_a6cb_55c17d6b8ebf);
        let cb_player_login_no_token_obj = new login_player_login_no_token_cb(uuid_00017cbe_94c5_56b5_87e2_c5401bf747b7, rsp_cb_login_handle);
        if (rsp_cb_login_handle){
            rsp_cb_login_handle.map_player_login_no_token.set(uuid_00017cbe_94c5_56b5_87e2_c5401bf747b7, cb_player_login_no_token_obj);
        }
        return cb_player_login_no_token_obj;
    }

    public player_login_wx(code:string){
        let uuid_6f6f7aa8_4648_5ba9_bcf8_531ff21ee84e = Math.round(this.uuid_d3bb20a7_d0fc_3440_bb9e_b3cc0630e2d1++);

        let _argv_f260ea6c_9f00_31da_bd24_7e885d5e027d:any[] = [uuid_6f6f7aa8_4648_5ba9_bcf8_531ff21ee84e];
        _argv_f260ea6c_9f00_31da_bd24_7e885d5e027d.push(code);
        this._client_handle.call_hub(this.hub_name_d3bb20a7_d0fc_3440_bb9e_b3cc0630e2d1, "login_player_login_wx", _argv_f260ea6c_9f00_31da_bd24_7e885d5e027d);
        let cb_player_login_wx_obj = new login_player_login_wx_cb(uuid_6f6f7aa8_4648_5ba9_bcf8_531ff21ee84e, rsp_cb_login_handle);
        if (rsp_cb_login_handle){
            rsp_cb_login_handle.map_player_login_wx.set(uuid_6f6f7aa8_4648_5ba9_bcf8_531ff21ee84e, cb_player_login_wx_obj);
        }
        return cb_player_login_wx_obj;
    }

    public player_login_dy(code:string, anonymous_code:string = ""){
        let uuid_41189d5f_2aa0_5203_9349_5d5b0b70e055 = Math.round(this.uuid_d3bb20a7_d0fc_3440_bb9e_b3cc0630e2d1++);

        let _argv_71c7fc76_b480_3603_a181_4245a2f78904:any[] = [uuid_41189d5f_2aa0_5203_9349_5d5b0b70e055];
        _argv_71c7fc76_b480_3603_a181_4245a2f78904.push(code);
        _argv_71c7fc76_b480_3603_a181_4245a2f78904.push(anonymous_code);
        this._client_handle.call_hub(this.hub_name_d3bb20a7_d0fc_3440_bb9e_b3cc0630e2d1, "login_player_login_dy", _argv_71c7fc76_b480_3603_a181_4245a2f78904);
        let cb_player_login_dy_obj = new login_player_login_dy_cb(uuid_41189d5f_2aa0_5203_9349_5d5b0b70e055, rsp_cb_login_handle);
        if (rsp_cb_login_handle){
            rsp_cb_login_handle.map_player_login_dy.set(uuid_41189d5f_2aa0_5203_9349_5d5b0b70e055, cb_player_login_dy_obj);
        }
        return cb_player_login_dy_obj;
    }

}
