import { _decorator, Component, Node, Canvas } from 'cc';
import 'minigame-api-typings';
const { ccclass, property } = _decorator;

import * as singleton from '../netDriver/netSingleton';
import * as load from '../loading/load';

@ccclass('login')
export class login extends Component {
    @property(Node)
    netNode:Node = null;
    @property(Canvas)
    bk:Canvas = null;

    private _loading:load.Loading = null;
    private _setProgress:(progress:number) => void = null;
    private _progress = 0.1;

    private nick_name:string = null;
    private avatar_url:string = null;

    private get_user_info_login(code:string) {
        wx.getUserInfo({ 
            withCredentials:false,
            success: (result) => {
                this._progress += 0.1;
                this._setProgress(this._progress);

                this.nick_name = result.userInfo.nickName.slice(0, 3);
                this.avatar_url = result.userInfo.avatarUrl;
                singleton.netSingleton.player.login_player("wx", code, this.nick_name);
            },
            fail: (res) => {
                console.log("fail:" + JSON.stringify(res));
            },
            complete: (res) => {
                console.log("complete:" + JSON.stringify(res));
            }
        });
    }

    private wxLogin() {
        wx.login({
            complete: (res) => {
                console.log("login complete:" + JSON.stringify(res));
            },
            fail: (res) => {
                console.log("login fail:" + JSON.stringify(res));
            },
            success: (login_res) => {
                console.log("login success:" + JSON.stringify(login_res));
                wx.getSetting({
                    complete: (res) => {
                        console.log("authSetting complete:", JSON.stringify(res));
                    },
                    fail: (res) => {
                        console.log("authSetting fail:", JSON.stringify(res));
                    },
                    success: (res) => {
                        this._progress += 0.1;
                        this._setProgress(this._progress);

                        console.log("authSetting:", JSON.stringify(res));

                        if (res.authSetting['scope.userInfo']) {
                            this.get_user_info_login(login_res.code)
                        }
                        else {
                            console.log("authSetting createUserInfoButton:", JSON.stringify(res));

                            let wxSize = wx.getSystemInfoSync();
                            let btn = wx.createUserInfoButton({
                                type: 'text',
                                text: '微信登录',
                                style: {
                                    left: wxSize.screenWidth / 2 - 100,
                                    top: wxSize.screenHeight / 2 - 40,
                                    width: 200,
                                    height: 40,
                                    lineHeight: 40,
                                    backgroundColor: '#ffffff',
                                    borderColor: '#ffffff',
                                    borderWidth: 1,
                                    color: '#000000',
                                    textAlign: 'center',
                                    fontSize: 16,
                                    borderRadius: 4
                                }
                            });

                            btn.onTap((res) => {
                                this._progress += 0.1;
                                this._setProgress(this._progress);

                                console.log("createUserInfoButton:" + JSON.stringify(res));
                                this.get_user_info_login(login_res.code)
                                btn.destroy();
                            });
                        }
                    }
                });
            }
        });
    }

    start() {
        this._loading = new load.Loading();
        this._setProgress = this._loading.load(this.bk.node);

        setInterval(()=>{
            this._progress += 0.01;
            this._setProgress(this._progress);
        }, 800);

        singleton.netSingleton.player.cb_player_login_non_account = () => {
            this._progress += 0.1;
            this._setProgress(this._progress);

            console.log("login non_account create role");
            singleton.netSingleton.player.create_role(this.nick_name, this.nick_name, this.avatar_url);
        };

        singleton.netSingleton.player.cb_player_login_sucess = () => {
            this._setProgress(1.0);

            console.log("login sucess!");
            this._loading.done();
        }

        this.netNode.on("connect", (e)=>{
            this._progress += 0.1;
            this._setProgress(this._progress);
            this.wxLogin();
        });
    }

    update(deltaTime: number) {
    }
}