import { _decorator, Button, Component, Node } from 'cc';
import { AudioManager } from '../other/AudioManager';
import * as singleton from '../netDriver/netSingleton';
const { ccclass, property } = _decorator;

@ccclass('VenturePanel')
export class VenturePanel extends Component 
{
    //退出返回按钮
    private exitBtn:Node;

    private levelBtn:Node;

    protected onLoad(): void
    {
        this.exitBtn=this.node.getChildByPath("Exit_Btn");
        this.levelBtn=this.node.getChildByPath("WorldMap/view/content/Map/Continent/Button");
        //this.levelBtn=this.node.getChildByPath("Button");
    }

    start() 
    {
        this.exitBtn.on(Button.EventType.CLICK,()=>
        {
            AudioManager.Instance.PlayerOnShot("Sound/sound_click_close_01");
            this.node.active = false;
            singleton.netSingleton.mainInterface.panelNode.active = true;
        })

        this.levelBtn.on(Button.EventType.CLICK,()=>
        {
            console.log("start pve");
            singleton.netSingleton.game.start_quest_battle_ready();
        });
    }

}


