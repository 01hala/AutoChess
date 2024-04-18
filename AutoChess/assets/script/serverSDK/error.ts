import * as client_handle from "./client_handle";
/*this enum code is codegen by abelkhan codegen for ts*/

export enum em_error{
    timeout = -2,
    db_error = -1,
    success = 0,
    server_busy = 1,
    unregistered_palyer = 2,
    login_dy_faild = 3,
    no_enough_strength = 4,
    no_role_in_index_to_sale = 5,
    not_same_role_to_update = 6,
    no_enough_coin = 7,
    already_have_role = 8,
    no_exist_role_group = 9,
    no_enough_card = 10,
    no_exist_role_card = 11,
    player_offline = 12,
    exceeds_maximum_limit_role = 13,
    peak_strength_no_data = 14,
    peak_strength_not_active = 15
}

/*this struct code is codegen by abelkhan codegen for typescript*/
/*this module code is codegen by abelkhan codegen for typescript*/
export class error_code_ntf_module extends client_handle.imodule {
    public _client_handle:client_handle.client;
    constructor(_client_handle_:client_handle.client){
        super();
        this._client_handle = _client_handle_;
        this._client_handle._modulemng.add_method("error_code_ntf_error_code", this.error_code.bind(this));

        this.cb_error_code = null;
    }

    public cb_error_code : (err_code:em_error)=>void | null;
    error_code(inArray:any[]){
        let _argv_:any[] = [];
        _argv_.push(inArray[0]);
        if (this.cb_error_code){
            this.cb_error_code.apply(null, _argv_);
        }
    }

}
