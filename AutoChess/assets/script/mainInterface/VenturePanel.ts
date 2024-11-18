import { _decorator, Button, Component, Node } from 'cc';
import { AudioManager } from '../other/AudioManager';
import * as singleton from '../netDriver/netSingleton';
import { SendMessage } from '../other/MessageEvent';
import * as enums from '../other/enums';
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
            //this.node.active = false;
            singleton.netSingleton.mainInterface.panelNode.active = true;
            this.Exit();
        })

        // this.levelBtn.on(Button.EventType.CLICK,()=>
        // {
        //     console.log("start pve");
        //     singleton.netSingleton.game.start_quest_battle_ready();
        //     this.Exit();
        // });
    }

    public Exit()
    {
        this.node.destroy();
    }

    public OnLevelBtnClick(_event,_data)
    {
        let levelId = parseInt(_data);
        //singleton.netSingleton.game.start_quest_battle_ready();
        //this.Exit();
        this.node.dispatchEvent(new SendMessage(enums.SendMseeageType.OpenLevelInfo, true,
            {
                levelId: levelId
            },
            (flag) =>
            {
                if (flag)
                {
                    this.Exit();
                }
            }
        ));
    }

    Open()
    {
        
    }
    

}


