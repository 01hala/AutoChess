import { _decorator, Component, Node, Canvas, instantiate, sys, Game } from 'cc';
import 'minigame-api-typings';

const { ccclass, property } = _decorator;

import * as common from "../battle/AutoChessBattle/common"

import * as singleton from '../netDriver/netSingleton';
import * as load from '../loading/load';

import { Battle } from '../battle/AutoChessBattle/battle'
import { BattleDis }  from '../battle/display/BattleDis'
import * as config from '../battle/AutoChessBattle/config/config';
import { BundleManager } from '../bundle/BundleManager';
import { ReadyData } from '../ready/ReadyData';
import { ReadyDis } from '../ready/display/ReadyDis';
import { MainInterface } from '../mainInterface/MainInterface';
import { sleep } from '../other/sleep';
import { AudioManager } from '../other/AudioManager';
import { GameManager } from '../other/GameManager';
import { Guide } from '../other/Guide';
import * as enmus from '../other/enums';
import SdkManager from '../SDK/SdkManager';

function unicodeToUtf8(unicode:any) {
    let utf8str = "";
    for(let i = 0; i < unicode.length; i += 2) {
        let uchar = (unicode[i] << 8) | unicode[i+1];
        utf8str += String.fromCharCode(uchar);
    }

    return utf8str;
}

@ccclass('login')
export class login extends Component {
    @property(Node)
    netNode:Node = null;
    @property(Canvas)
    bk:Canvas = null;
    @property(Canvas)
    ld:Canvas = null;

    private progressBar:Node = null;

    private interval;

    private _loading:load.Loading = null;
    private _setProgress:(progress:number) => void = null;
    private _progress = 0.1;

    private nick_name:string = null;
    private avatar_url:string = null;

    public static panelOnReady:boolean=false;

    private AutoUpdata():Promise<void>
    {
        return new Promise((resolve)=>
        {
            const updateManager = wx.getUpdateManager()

            updateManager.onCheckForUpdate(function (res)
            {
                // 请求完新版本信息的回调
                console.log(res.hasUpdate)
            });

            updateManager.onUpdateReady(()=>
            {
                wx.showModal({
                    title: '更新提示',
                    content: '新版本已经准备好，是否重启应用？',
                    success: (res)=>
                    {
                        if (res.confirm)
                        {
                            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                            updateManager.applyUpdate();
                            resolve();
                        }
                    }
                });
            });

            updateManager.onUpdateFailed(() =>
            {
                // 新版本下载失败
                console.log("下载失败，请检查网络");
            });
        });
    }

    async start() 
    {  
        if(sys.platform === sys.Platform.WECHAT_GAME)
        {
            SdkManager.SetPlatform(enmus.SDK_TYPE.WX)
        }
        else {
            SdkManager.SetPlatform(enmus.SDK_TYPE.Default)
        }

        await config.config.load();
        console.log("login start!");

        this._loading = new load.Loading();
        this._setProgress = this._loading.load(this.ld.node, true);

        this.progressBar = this._loading.progressBar;
        this.progressBar.active = true;

        this.interval=setInterval(()=>{
            this._progress += 0.01;
            this._setProgress(this._progress);
        }, 800);

        await BundleManager.Instance.Preloading(()=>
        {
            this._progress += 0.1;
            this._setProgress(this._progress);
        }).then(()=>
        {
            GameManager.Instance.Init();
        });

        singleton.netSingleton.player.cb_player_login_non_account = (code:string) => {
            this._progress += 0.1;
            this._setProgress(this._progress);

            console.log("login non_account create role");
            singleton.netSingleton.player.create_role(code, SdkManager.SDK.getUserInfo().nickName, SdkManager.SDK.getUserInfo().nickName, SdkManager.SDK.getUserInfo().avatarUrl);
        };

        //登录进入主界面
        singleton.netSingleton.player.cb_player_login_sucess = async () => 
        {
            this._progress += 0.3;
            this._setProgress(this._progress);

            singleton.netSingleton.mainInterface = new MainInterface();
            await singleton.netSingleton.mainInterface.start(this.bk.node, async (event) =>
            {
                singleton.netSingleton.player.get_user_data(true,(_step) =>
                {
                    console.log("guide step:", _step);
                    if (common.GuideStep.None == _step)
                    {
                        GameManager.Instance.StartGuide(_step);
                    }
                });
                
                singleton.netSingleton.mainInterface.ShowAvatar(SdkManager.SDK.getUserInfo().avatarUrl);
                this.bk.node.addChild(singleton.netSingleton.mainInterface.panelNode);

                //await sleep(100);
                let checkReady = setInterval(() => 
                {
                    if (login.panelOnReady)
                    {
                        this._setProgress(1.0);
                        this._loading.done();
                        login.panelOnReady = false;
                        console.log("login sucess!");
                        clearInterval(this.interval);
                        clearInterval(checkReady);
                    }
                }, 100);
                
  
            });

            
        }
       
        //注册回调
        this.RegGameCallBack();
       
        //连接
        this.netNode.on("connect", (e) =>
        {
            console.log("on net connect!");

            this._progress += 0.1;
            this._setProgress(this._progress);
            //this.wxLogin();
            SdkManager.SDK.login((e: boolean = true) =>
            {
                this._loading.progressBar.active = e;
                this._progress += 0.1;
                this._setProgress(this._progress);
            }, null);
        });

        //重连
        this.netNode.on("reconnect", () =>
        {
            console.log("on net reconnect!");

            singleton.netSingleton.player.reconnect(singleton.netSingleton.player.UserData.User.UserGuid).callBack((info, match_name) =>
            {
                singleton.netSingleton.player.UserData = info;
                if (match_name != "")
                {
                    singleton.netSingleton.game.match_name = match_name;
                    if (singleton.netSingleton.ready)
                    {
                        singleton.netSingleton.game.get_match_battle_data().callBack((battle_info, shop_info, fetters_info) =>
                        {
                            singleton.netSingleton.ready.Restore(battle_info);
                        }, () =>
                        {
                            console.log("on net reconnect get_battle_data error!");
                        }).timeout(3000, () =>
                        {
                            console.log("on net reconnect get_battle_data timeout!");
                        })
                    }
                }
                else
                {
                    this.BackMainInterface();
                }
            }, (err) =>
            {
                if (singleton.netSingleton.ready)
                {
                    singleton.netSingleton.ready.destory();
                    singleton.netSingleton.ready = null;
                }
                if (singleton.netSingleton.battle)
                {
                    singleton.netSingleton.battle.destory();
                    singleton.netSingleton.battle = null;
                }

                this._loading = new load.Loading();
                this._setProgress = this._loading.load(this.bk.node);

                setInterval(() =>
                {
                    this._progress += 0.01;
                    this._setProgress(this._progress);
                }, 800);

                SdkManager.SDK.login((e: boolean = true) =>
                {
                    this._loading.progressBar.active = e;
                    this._progress += 0.1;
                    this._setProgress(this._progress);
                }, null);
            });
        });

        if (singleton.netSingleton.is_conn_gate)
        {
            this._progress += 0.1;
            this._setProgress(this._progress);
            
            SdkManager.SDK.login((e: boolean = true) =>
            {
                this._loading.progressBar.active = e;
                this._progress += 0.1;
                this._setProgress(this._progress);
            }, null);
        }
    }

    private RegGameCallBack()
    {
        //pvp准备阶段
        singleton.netSingleton.game.cb_start_match_battle_ready = (battle_info: common.UserBattleData, shop_info: common.ShopData, fetters_info: common.Fetters[]) => 
        {
            this.GameStart(enmus.GameMode.PVP, battle_info, shop_info, fetters_info);
        };

        //pvp战斗阶段
        singleton.netSingleton.game.cb_start_match_battle = (self: common.UserBattleData, target: common.UserBattleData) =>
        {
            this.BattleStart(self,target,enmus.GameMode.PVP);
        };

        //pvp结算
        singleton.netSingleton.player.cb_match_settlement=()=>{};

        //pvp游戏结束
        singleton.netSingleton.game.cb_battle_victory = async (mod:common.BattleMod, is_victory: boolean) =>
        {
            console.log("战斗结束");
            if (singleton.netSingleton.battle)
            {
                await singleton.netSingleton.battle.SetGameVictory(is_victory);
            }

            console.log("返回主界面");
            this.BackMainInterface();
        }

         //巅峰战力
        singleton.netSingleton.game.cb_start_peak_strength = (_selfBattleData) =>
        {
            singleton.netSingleton.battle.destory();
            singleton.netSingleton.battle = null;

            singleton.netSingleton.game.start_match_battle();
        }

        //pve准备阶段
        singleton.netSingleton.game.cb_start_quest_battle_ready = (battle_info,shop_info,events,fetters_info) =>
        {
            this.GameStart(enmus.GameMode.PVE,battle_info,shop_info,fetters_info,events);
        };

        //pve战斗阶段
        singleton.netSingleton.game.cb_start_quest_battle = (_self, _target) =>
        {
            this.BattleStart(_self,_target ,enmus.GameMode.PVE);
        };
    }

    private async GameStart(_gamemode:enmus.GameMode , _battle_info:common.UserBattleData, _shop_info:common.ShopData, _fetters_info?:common.Fetters[],events?:number[])
    {
        console.log("start game!");
        this._progress = 0.1;
        this._setProgress = this._loading.load(this.bk.node);

        this.interval = setInterval(() =>
        {
            this._progress += 0.40;
            this._setProgress(this._progress);
        }, 800);
        singleton.netSingleton.mainInterface.destory();
        console.log("start singleton.netSingleton.ready!");
        if (null == singleton.netSingleton.ready)
        {
            if (singleton.netSingleton.battle)
            {
                singleton.netSingleton.battle.destory();
                singleton.netSingleton.battle = null;
            }
            console.log("null == singleton.netSingleton.ready!");
            //新的一局游戏
            let _readyData = new ReadyData(_battle_info, _shop_info, _gamemode, _fetters_info);
            singleton.netSingleton.ready = new ReadyDis(_readyData);
            await singleton.netSingleton.ready.start(this.bk.node, _battle_info, async (event) =>
            {
                console.log("Start Ready callback!");
                await sleep(2000);
                this._setProgress(1.0);
                this.bk.node.addChild(singleton.netSingleton.ready.panelNode);
                await sleep(10);    //不知道为啥必须等待0.01秒，商店物品的位置才不会错
                event();
                console.log("Start Ready sucess!");
                this._loading.done();
                clearInterval(this.interval);
            });
        }
    }

    private async BattleStart(_self: common.UserBattleData, _target: common.UserBattleData , _gamemode:enmus.GameMode)
    {
        console.log("cb_battle start round!");

        this._progress = 0.1;
        this._setProgress = this._loading.load(this.bk.node);
        this.interval = setInterval(() =>
        {
            this._progress += 0.30;
            this._setProgress(this._progress);
        }, 800);

        singleton.netSingleton.ready.destory();
        singleton.netSingleton.ready = null;

        let _battle = new Battle(_self, _target , _gamemode);
        singleton.netSingleton.battle = new BattleDis(_battle);
        await singleton.netSingleton.battle.Start(this.bk.node, async (event) =>
        {
            await sleep(3000);
            this._setProgress(1.0);
            this._loading.done();
            this.bk.node.addChild(singleton.netSingleton.battle.panelNode);
            singleton.netSingleton.battle.battleCentre.StartBattle();
            event();

            console.log("start_round sucess!");
            clearInterval(this.interval);
        });
    }
    
    public async BackMainInterface()
    {
        console.log("BackMainInterface begin!");

        this._progress=0.1;
        this._setProgress = this._loading.load(this.bk.node);
        this.interval=setInterval(()=>{
            this._progress += 0.2;
            this._setProgress(this._progress);
        }, 500);

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
        await singleton.netSingleton.mainInterface.start(this.bk.node,async (event)=>
        {
            await sleep(3000);
            this._setProgress(1.0);
            this._loading.done();
            singleton.netSingleton.player.get_user_data();
            singleton.netSingleton.mainInterface.ShowAvatar(SdkManager.SDK.getUserInfo().avatarUrl);
            this.bk.node.addChild(singleton.netSingleton.mainInterface.panelNode);

            console.log("Back Main Interface!");
            clearInterval(this.interval);
        });

        console.log("BackMainInterface end!");
    }
}