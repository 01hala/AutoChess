import { _decorator, Component, Node } from 'cc';
import SdkInterface from './SdkInterface';
import * as singleton from '../netDriver/netSingleton';

function unicodeToUtf8(unicode:any) {
    let utf8str = "";
    for(let i = 0; i < unicode.length; i += 2) {
        let uchar = (unicode[i] << 8) | unicode[i+1];
        utf8str += String.fromCharCode(uchar);
    }

    return utf8str;
}

export default class WxSdk implements SdkInterface
{   
    private video:any;
    private callback:any;
    private target:any;
    private banner:any;
    private interstitial:any;
    private costom:any;

    private wxUserInfo(login_res: WechatMinigame.LoginSuccessCallbackResult) 
    {

        let wxSize = wx.getSystemInfoSync();
        let btn = wx.createUserInfoButton({
            type: 'text',
            text: '点击登录',
            style: {
                left: wxSize.screenWidth / 2 - 100,
                top: wxSize.screenHeight / 2 + 60,
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
    }

    private get_user_info_login(_callBack: Function, _code: string)
    {
        let nick_name: string;
        let avatar_url: string;
        wx.getUserInfo({
            withCredentials: false,
            success: (result) =>
            { 
                // this._progress += 0.1;
                // this._setProgress(this._progress);

                let nickName = unicodeToUtf8(result.userInfo.nickName);
                nick_name = nickName.slice(0, 3);
                avatar_url = result.userInfo.avatarUrl;
                singleton.netSingleton.player.login_player("wx", _code, nick_name, avatar_url);
                _callBack();
            },
            fail: (res) =>
            {
                console.log("fail:" + JSON.stringify(res));
            },
            complete: (res) =>
            {
                console.log("complete:" + JSON.stringify(res));
            }
        });
    }

    init(_callBack:()=>void,_target:object)
    {
        wx.showShareMenu({
            withShareTicket:true ,
            menus:["shareAppMessage" , "shareTimeline"]
        });
    }
    
    /**
     * 微信登录
     * @param _callBack 登录成功后的回调
     * @param _target 监听对象
     */
    login(_callBack:Function , _target: Object): void
    {
        wx.login({
            complete: (res) =>
            {
                console.log("login complete:" + JSON.stringify(res));
            },
            fail: (res) =>
            {
                console.log("login fail:" + JSON.stringify(res));
            },
            success: (login_res) =>
            {
                console.log("login success:" + JSON.stringify(login_res));
                wx.getPrivacySetting({
                    complete: (res) =>
                    {
                        console.log("authSetting complete:", JSON.stringify(res));
                    },
                    fail: (res) =>
                    {
                        console.log("authSetting fail:", JSON.stringify(res));
                        this.wxUserInfo(login_res);
                    },
                    success: (res) =>
                    {
                        _callBack();
                        // this._progress += 0.1;
                        // this._setProgress(this._progress);

                        console.log("authSetting:", JSON.stringify(res));

                        if (!res.needAuthorization)
                        {
                            _callBack();
                            //this.progressBar.active = true;
                            this.get_user_info_login(() =>
                            {

                            }, login_res.code);
                        }
                        else
                        {
                            console.log("authSetting RequirePrivacyAuthorize:", JSON.stringify(res));
                            this.wxUserInfo(login_res);
                        }
                    }
                });
            }
        });
    }

    /**
     * 登出
     */
    logout(): void
    {
        
    }

    /**
     * 退出
     */
    exit(): void
    {
        
    }

    /**
     * 切换账号
     */
    switchLogin(): void
    {
        
    }

    /**
     * 上报数据
     * @param _param 参数
     */
    report(..._param: any[]): void
    {
        
    }

    /**
     * 支付
     * @param _param 参数
     */
    pay(..._param: any): void
    {
        
    }

    
    /**
     * 获取系统信息
     * @returns 系统信息
     */
    getSystemInfo()
    {
        let info=
        {
            safeArea: 
            {
                /** 安全区域右下角纵坐标 */
                bottom: wx.getSystemInfoSync().safeArea.bottom,
                /** 安全区域的高度，单位逻辑像素 */
                height: wx.getSystemInfoSync().safeArea.height,
                /** 安全区域左上角横坐标 */
                left: wx.getSystemInfoSync().safeArea.left,
                /** 安全区域右下角横坐标 */
                right: wx.getSystemInfoSync().safeArea.right,
                /** 安全区域左上角纵坐标 */
                top: wx.getSystemInfoSync().safeArea.top,
                /** 安全区域的宽度，单位逻辑像素 */
                width: wx.getSystemInfoSync().safeArea.width,
            },
            screenHeight : wx.getSystemInfoSync().screenHeight,
            screenWidth : wx.getSystemInfoSync().screenWidth
        };
        return info;
    }
}

