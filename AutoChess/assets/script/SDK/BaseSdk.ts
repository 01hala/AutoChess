import { _decorator, Component, Node } from 'cc';
import SdkInterface from './SdkInterface';
const { ccclass, property } = _decorator;

@ccclass('BaseSdk')
export class BaseSdk implements SdkInterface
 {
    switchLogin(): void
    {
        
    }
    
    init(_callBack:()=>void,_target:object)
    {
        
    }

    login(_callBack: Function, _target: Object): void
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
        
    }
    
}


