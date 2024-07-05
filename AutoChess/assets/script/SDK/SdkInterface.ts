import { _decorator, Component, native, Node } from 'cc';
const { ccclass, property } = _decorator;

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
    getSystemInfo():any;

}


    


