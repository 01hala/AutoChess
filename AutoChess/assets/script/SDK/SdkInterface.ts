import { _decorator, Component, math, native, Node, SafeArea } from 'cc';
const { ccclass, property } = _decorator;

export class Sysinfo
{
    /** 屏幕安全区域 */
    public safeArea: 
    {
        /** 安全区域右下角纵坐标 */
        bottom:number,
        /** 安全区域的高度，单位逻辑像素 */
        height:number,
        /** 安全区域左上角横坐标 */
        left:number,
        /** 安全区域右下角横坐标 */
        right:number,
            /** 安全区域左上角纵坐标 */
        top:number,
            /** 安全区域的宽度，单位逻辑像素 */
        width:number
    };
    /** 屏幕高 */
    public screenHeight:number;
    /** 屏幕宽 */
    public screenWidth:number;
    /** 系统平台 */
    public platform:any;
    /** 菜单按钮的布局位置信息 */
    public menuBtn:
    {
        /** 下边界坐标，单位：px */
        bottom: number
        /** 高度，单位：px */
        height: number
        /** 左边界坐标，单位：px */
        left: number
        /** 右边界坐标，单位：px */
        right: number
        /** 上边界坐标，单位：px */
        top: number
        /** 宽度，单位：px */
        width: number
    }

    constructor ()
    {
        this.safeArea = {
            bottom: 0,
            height: 0,
            left: 0,
            right: 0,
            top: 0,
            width: 0
        };
        this.menuBtn={
            bottom:0,
            height:0,
            left:0,
            right:0,
            top:0,
            width:0
        }
    }

}

export class UserPlatformInfo
{
    /** 登录平台账户名称 */
    public nickName:string;
    /** 登录平台头像地址 */
    public avatarUrl:string;

    constructor ()
    {
        
    }
}

export default interface SdkInterface 
{
    /**
     * 初始化
     * @param _callBack 回调
     * @param _target 监听对象
     */
    init(_callBack:Function , _target:Object):void;

    /**
     * 登录
     * @param _callBack 登录成功后的回调
     * @param _target 监听对象
     */
    login(_callBack:Function , _target:Object):void;

    /**
     * 登出
     */
    logout():void;

    /**
     * 切换账号
     */
    switchLogin():void;

    /**
     * 退出
     */
    exit():void;

    /**
     * 数据上报
     * @param param 上报参数
     */
    report(..._param:any[]):void;

    /**
     * 支付
     * @param _param 参数
     */
    pay(..._param:any):void;

    /**
     * 获取系统信息
     * @returns 系统信息
     */
    getSystemInfo():Sysinfo;

    getUserInfo():UserPlatformInfo;

}


    


