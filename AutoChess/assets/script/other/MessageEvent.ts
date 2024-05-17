import {Event} from 'cc';

export class SendMessage extends Event
{
    constructor(name: string, bubbles?: boolean, detail?: any ,callBack?:(e?:boolean)=>void) {
        super(name, bubbles);
        this.detail = detail;
        this.callBack=callBack;
    }
    public detail: any = null;  // 自定义的属性
    public callBack:(e?:boolean)=>void;//自定义回调函数
}
    


