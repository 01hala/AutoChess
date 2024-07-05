import { _decorator, Component, Node } from 'cc';
import { BaseSdk } from './BaseSdk';
import WxSdk from './WxSdk';
import SdkInterface from './SdkInterface';
import * as enums from "../other/enums"

export default class SdkManager 
{
    public static SDK: SdkInterface = null;
    public static SetPlatform(_sdkType: enums.SDK_TYPE)
    {
        switch (_sdkType) 
        {
            case enums.SDK_TYPE.WX:
                SdkManager.SDK = new WxSdk();
                break;
            default:
                SdkManager.SDK = new BaseSdk();
                break;
        }
    }
}


