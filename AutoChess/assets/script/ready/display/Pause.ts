import { _decorator, Animation, Button, Component, Node } from 'cc';
import * as singleton from '../../netDriver/netSingleton';
import { login } from '../../login/login';
import * as enmus from '../../other/enums';
import { AudioManager } from '../../other/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('Pause')
export class Pause extends Component 
{
    private board:Node;

    protected onLoad(): void
    {
        this.board=this.node.getChildByPath("Board");
    }

    start() 
    {
        this.board.getChildByPath("Exit_Btn").on(Button.EventType.CLICK, () =>
        {
            AudioManager.Instance.PlayerOnShot("Sound/sound_click_wooden_01");
            if (enmus.GameMode.PVE == singleton.netSingleton.ready.readyData.gameMode)
            {
                singleton.netSingleton.ready.father.getComponent(login).BackMainInterface("VenturePanel");
            }
            else
            {
                singleton.netSingleton.ready.father.getComponent(login).BackMainInterface();
            }

        });
        this.board.getChildByPath("Back_Btn").on(Button.EventType.CLICK, () =>
        {
            this.board.getComponent(Animation).on(Animation.EventType.FINISHED, () =>
            {
                AudioManager.Instance.PlayerOnShot("Sound/sound_click_wooden_01");
                this.board.active = false;
                this.node.active = false;
                this.board.getComponent(Animation).off(Animation.EventType.FINISHED);
            })
            this.board.getComponent(Animation).play("PanelMid2Bottom");
        });
    }

   public Open()
   {    
        this.node.setSiblingIndex(110);
        this.board.active=true;
        this.board.getComponent(Animation).play("PanelTop2Mid");
   }
}


