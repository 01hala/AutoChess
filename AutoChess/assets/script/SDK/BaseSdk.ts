import { _decorator, Component, Node } from 'cc';
import SdkInterface, { Sysinfo, UserPlatformInfo } from './SdkInterface';
import * as singleton from '../netDriver/netSingleton';
const { ccclass, property } = _decorator;

@ccclass('BaseSdk')
export class BaseSdk implements SdkInterface
 {
    init(_callBack:()=>void,_target:object)
    {
        
    }

    login(_callBack: Function, _target: Object): void
    {
        let accountName = `no_author_${Math.floor(Math.random() * 100)}`;
        let userInfo = this.getUserInfo();
        singleton.netSingleton.player.login_player("no_author", accountName, userInfo.nickName, userInfo.avatarUrl);
        _callBack();
    }

    switchLogin(): void
    {
        
    }

    logout(): void
    {
        
    }

    exit(): void
    {
        
    }

    report(..._param: any[]): void
    {
        
    }

    pay(..._param: any): void
    {
        
    }

    getSystemInfo()
    {
        let sysInfo:Sysinfo = new Sysinfo();
        //安全区域矩形大小
        sysInfo.safeArea.bottom = 0;
        sysInfo.safeArea.top = 0;
        sysInfo.safeArea.left = 0;
        sysInfo.safeArea.right = 0;
        sysInfo.safeArea.height = 0;
        sysInfo.safeArea.width = 0;
        //屏幕高宽
        sysInfo.screenHeight = 0;
        sysInfo.screenWidth = 0;
        //系统平台
        sysInfo.platform=null;

        return sysInfo;
    }

    getUserInfo()
    {
        let userInfo:UserPlatformInfo = new UserPlatformInfo();
        userInfo.nickName="test";
        userInfo.avatarUrl="";
        return userInfo;
    }
    
    
}


