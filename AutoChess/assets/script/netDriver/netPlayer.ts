import * as cli from "../serverSDK/client_handle"
import * as common from "../serverSDK/common"
import * as error from "../serverSDK/error"

import * as login from "../serverSDK/ccalllogin"
import * as player_login from "../serverSDK/ccallplayer"

import * as player_client from "../serverSDK/playercallc"

export class netPlayer {
    private c_login_caller : login.login_caller;
    public player_name = "";
    private c_player_login_caller : player_login.player_login_caller;

    public cb_archive_sync : () => void;
    public cb_battle_victory : () => void;
    private player_client_module : player_client.player_client_module;

    public UserData: common.UserData = null;

    public constructor() {
        this.c_login_caller = new login.login_caller(cli.cli_handle); 
        this.c_player_login_caller = new player_login.player_login_caller(cli.cli_handle);

        this.player_client_module = new player_client.player_client_module(cli.cli_handle);
        this.player_client_module.cb_archive_sync = (info) => {
            this.UserData = info;
            if (this.cb_archive_sync) {
                this.cb_archive_sync.call(null);
            }
        }
        this.player_client_module.cb_battle_victory = () => {
            this.cb_battle_victory.call(null);
        }
    }

    private login_callback(player_name:string, token:string, nick_name:string) {
        this.player_name = player_name;
                
        this.c_player_login_caller.get_hub(this.player_name).player_login(token, nick_name).callBack((info)=>{
            this.UserData = info;
            this.cb_player_login_sucess.call(null);
        }, (err)=>{
            console.log("login err:", err);
            if (err == error.em_error.unregistered_palyer) {
                this.cb_player_login_non_account.call(null);
            }
        }).timeout(3000, ()=>{
            console.log("login player timeout");
        });
    }

    public cb_player_login_sucess:() => void;
    public cb_player_login_non_account:() => void;
    public login_player(login_type:string, code:string, nick_name:string) {
        cli.cli_handle.get_hub_info("login", (login_hub)=>{
            if(login_hub) {
                if (login_type == "no_author") {
                    this.c_login_caller.get_hub(login_hub.hub_name).player_login_no_token(code).callBack((player_name, token)=>{
                        this.login_callback(player_name, token, nick_name);
                    }, (err)=>{
                        console.log("login error:" + err);
                    }).timeout(6000, ()=>{
                        console.log("login timeout");
                    });
                }
                else if (login_type == "wx") {
                    console.log(login_hub);
                    this.c_login_caller.get_hub(login_hub.hub_name).player_login_wx(code).callBack((player_name, token)=>{
                        this.login_callback(player_name, token, nick_name);
                    }, (err)=>{
                        console.log("login error:" + err);
                    }).timeout(6000, ()=>{
                        console.log("login timeout");
                    });
                }
                else if (login_type == "dy") {
                    this.c_login_caller.get_hub(login_hub.hub_name).player_login_dy(code).callBack((player_name, token)=>{
                        this.login_callback(player_name, token, nick_name);
                    }, (err)=>{
                        console.log("login error:" + err);
                    }).timeout(6000, ()=>{
                        console.log("login timeout");
                    });
                }
            }
            else {
                console.log("login svr is empty!");
            }
        });
    }

    public create_role(name, nick_name:string, avatar_url:string){
        console.log("begin create role!");
        this.c_player_login_caller.get_hub(this.player_name).create_role(name, nick_name).callBack((info)=>{
            this.UserData = info;
            this.cb_player_login_sucess.call(null);
        }, (err)=>{
            console.log("create role error:" + err);
        }).timeout(3000, ()=>{
            console.log("create role timeout");
        });;
    }
}