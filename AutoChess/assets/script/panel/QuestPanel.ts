import { _decorator, Button, Component, Node } from 'cc';
import { AudioManager } from '../other/AudioManager';
import * as singleton from '../netDriver/netSingleton';
import { SendMessage } from '../other/MessageEvent';
import * as enums from '../other/enums';
import { User } from '../login/User';
import { em_error } from '../serverSDK/error';
const { ccclass, property } = _decorator;

@ccclass('QuestPanel')
export class QuestPanel extends Component 
{
    //退出返回按钮
    private exitBtn:Node;

    private level:Node;

    protected onLoad(): void
    {
        this.exitBtn=this.node.getChildByPath("Exit_Btn");
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
    }

    protected onDestroy(): void
    {
        this.destroy();
    }

    public Exit()
    {
        this.node.destroy();
    }

    public OnLevelBtnClick(_event,_data)
    {
        let levelId = parseInt(_data);
        if(User.UserData.quest == levelId)
        {
            singleton.netSingleton.game.start_quest_battle_ready().then(()=>
                {
                    this.Exit();
                },(err)=>
                {
                    if(err == em_error.last_quest)
                    {
                        this.node.dispatchEvent(new SendMessage(enums.SendMseeageType.ShowTip, true,"<outline color=black width=4>后续关卡待开放</outline>"));
                    }
                });
        }
        else
        {
            singleton.netSingleton.game.start_quest_battle_ready_repeat(levelId).then(()=>
                {
                    this.Exit();
                },(err)=>
                {
                    if(err == em_error.last_quest)
                    {
                        this.node.dispatchEvent(new SendMessage(enums.SendMseeageType.ShowTip, true,"<outline color=black width=4>后续关卡待开放</outline>"));
                    }
                });
        }
        
        // this.node.dispatchEvent(new SendMessage(enums.SendMseeageType.OpenLevelInfo, true,
        //     {
        //         levelId: levelId
        //     },
        //     (flag) =>
        //     {
        //         if (flag)
        //         {
        //             this.Exit();
        //         }
        //     }
        // ));
    }

    Open()
    {
        this.level=this.node.getChildByPath("WorldMap/view/content/Map/Continent/Level");
        
        for(let i=0;i<this.level.children.length;i++)
        {
            let lock=true;
            if((User.UserData.quest%10000)-1 < i)
            {
                lock=false;
            }
            this.level.children[i].getComponent(Button).interactable=lock;
        }
    }
}


