import { _decorator, Component, Node, Canvas, instantiate } from 'cc';
import 'minigame-api-typings';

const { ccclass, property } = _decorator;

import * as common from "../serverSDK/common"

import * as singleton from '../netDriver/netSingleton';
import * as load from '../loading/load';

import { Battle } from '../battle/battle'
import { BattleDis }  from '../battle/display/BattleDis'
import * as config from '../config/config';
import { BundleManager } from '../bundle/BundleManager';
import { Ready } from '../ready/Ready';
import { ReadyDis } from '../ready/display/ReadyDis';
import { MainInterface } from '../mainInterface/MainInterface';
import { sleep } from '../other/sleep';

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

    async start() {  
        await config.config.load();
        console.log("login start!");

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

        singleton.netSingleton.player.cb_player_login_sucess = async () => {
            this._progress += 0.5;
            this._setProgress(this._progress);
            //进入主界面
            singleton.netSingleton.mainInterface=new MainInterface();
            await singleton.netSingleton.mainInterface.start(this.bk.node);
            singleton.netSingleton.player.get_user_data();
            this._setProgress(1.0);
            this._loading.done();
            //开始准备阶段
            //singleton.netSingleton.game.start_battle();

            console.log("login sucess!");
        }
        //准备阶段
        singleton.netSingleton.game.cb_start_battle = async (battle_info:common.UserBattleData, shop_info:common.ShopData , fetters_info:common.Fetters[]) => {
            //singleton.netSingleton.game.battle();
            this._progress=0.1;
            this._setProgress = this._loading.load(this.bk.node);

            setInterval(()=>{
                this._progress += 0.01;
                this._setProgress(this._progress);
            }, 800);

            if(null==singleton.netSingleton.ready)
            {
                if (singleton.netSingleton.battle) {
                    singleton.netSingleton.battle.destory();
                    singleton.netSingleton.battle = null;
                }

                //新的一局游戏
                let _ready = new Ready(battle_info, shop_info ,fetters_info);
                singleton.netSingleton.ready=new ReadyDis(_ready);
                await singleton.netSingleton.ready.start(this.bk.node,battle_info);
                this._setProgress(1.0);
                this._loading.done();
                console.log("Start Ready sucess!");
            }
        }

        singleton.netSingleton.game.cb_battle_victory = async (is_victory:boolean) => {
            if (singleton.netSingleton.battle) {
                await singleton.netSingleton.battle.SetGameVictory(is_victory);
            }

            this.BackMainInterface();
        }

        singleton.netSingleton.game.cb_battle = async (self:common.UserBattleData, target:common.UserBattleData) => {
            console.log("cb_battle start round!");

            singleton.netSingleton.ready.destory();
            singleton.netSingleton.ready = null;

            let _battle = new Battle(self, target);
            singleton.netSingleton.battle = new BattleDis(_battle);
            await singleton.netSingleton.battle.Start(this.bk.node);

            this._setProgress(1.0);
            this._loading.done();

            console.log("start_round sucess!");
        }

        this.netNode.on("connect", (e)=>{
            console.log("on net connect!");

            this._progress += 0.1;
            this._setProgress(this._progress);
            this.wxLogin();
        });

        this.netNode.on("reconnect", () => {
            console.log("on net reconnect!");

            singleton.netSingleton.player.reconnect(singleton.netSingleton.player.UserData.User.UserGuid).callBack((info, match_name)=>{
                singleton.netSingleton.player.UserData = info;
                if (match_name != "") {
                    singleton.netSingleton.game.match_name = match_name;
                }
                else{
                    this.BackMainInterface();
                }
            }, (err) => {
                if (singleton.netSingleton.ready) {
                    singleton.netSingleton.ready.destory();
                    singleton.netSingleton.ready = null;
                }
                if(singleton.netSingleton.battle) {
                    singleton.netSingleton.battle.destory();
                    singleton.netSingleton.battle = null;
                }

                this._loading = new load.Loading();
                this._setProgress = this._loading.load(this.bk.node);

                setInterval(()=>{
                    this._progress += 0.01;
                    this._setProgress(this._progress);
                }, 800);

                this.wxLogin();
            });
        });

        if (singleton.netSingleton.is_conn_gate) {
            this._progress += 0.1;
            this._setProgress(this._progress);
            this.wxLogin();
        }
    }

    update(deltaTime: number) {
    }

    public async BackMainInterface()
    {
        this._progress=0.1;
        this._setProgress = this._loading.load(this.bk.node);
        setInterval(()=>{
            this._progress += 0.01;
            this._setProgress(this._progress);
        }, 800);

        if(singleton.netSingleton.battle)
        {
            singleton.netSingleton.battle.destory();
            singleton.netSingleton.battle=null;
        }
        if(singleton.netSingleton.ready)
        {
            singleton.netSingleton.ready.destory();
            singleton.netSingleton.ready=null;
        }
        await singleton.netSingleton.mainInterface.start(this.bk.node);
        singleton.netSingleton.player.get_user_data()
        this._setProgress(1.0);
        this._loading.done();
    }
}