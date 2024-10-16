import { _decorator, Button, Component, Node } from 'cc';
import { AudioManager } from '../other/AudioManager';
import * as singleton from '../netDriver/netSingleton';
const { ccclass, property } = _decorator;

@ccclass('VenturePanel')
export class VenturePanel extends Component 
{
    //退出返回按钮
    private exitBtn:Node;

    protected onLoad(): void
    {
        this.exitBtn=this.node.getChildByPath("Exit_Btn");
    }

    start() 
    {
        this.exitBtn.on(Button.EventType.CLICK,()=>
        {
            AudioManager.Instance.PlayerOnShot("Sound/sound_click_close_01");
            this.node.active = false;
            singleton.netSingleton.mainInterface.panelNode.active = true;
        })
    }

    update(deltaTime: number) {
        
    }
}


