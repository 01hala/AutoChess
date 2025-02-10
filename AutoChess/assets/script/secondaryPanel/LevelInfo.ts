import { _decorator, Animation, animation, Button, Component, Label, math, Node } from 'cc';
import { config } from '../battle/AutoChessBattle/config/config';
import * as singleton from '../netDriver/netSingleton';
const { ccclass, property } = _decorator;

@ccclass('LevelInfo')
export class LevelInfo extends Component 
{
    private title:Label;
    public set Title(value:string)
    {
        if(!this.title)
        {
            this.title=this.node.getChildByPath("Board/Title/Label").getComponent(Label);
        }
        this.title.string=value;
    }

    private introduce:Label;
    public set Introduce(value:string)
    {
        if(!this.introduce)
        {
            this.introduce=this.node.getChildByPath("Board/Introduce/Label").getComponent(Label);
        }
        this.introduce.string=value;
    }

    private enemyLayout:Node;
    private rewardLayout:Node;

    private confirm_Btn:Node;
    private cancel_Btn:Node;

    private anim:Animation;

    protected onLoad(): void
    {
        this.enemyLayout=this.node.getChildByPath("Board/Info/EnemyLayout");
        this.rewardLayout=this.node.getChildByPath("Board/Info/RewardLayout");

        this.confirm_Btn=this.node.getChildByPath("Board/Confirm_Btn");
        this.cancel_Btn=this.node.getChildByPath("Board/Cancel_Btn");
    }

    start() 
    {
        this.cancel_Btn.on(Button.EventType.CLICK,()=>
        {
            this.Close();
        },this);

        this.node.on(Button.EventType.CLICK,()=>
        {
            this.Close();
        },this);
    }

    protected onDestroy(): void
    {
        this.destroy();
    }

    // destroy(): boolean
    // {
    //     for (let t of this.enemyLayout.children)
    //     {
    //         t.destroy();
    //     }
    //     for (let t of this.rewardLayout.children)
    //     {
    //         t.destroy();
    //     }
    //     this.node.destroy();
    //     // this._super.call()
    //     return super.destroy();
    // }

    Close()
    {
        this.anim.on(Animation.EventType.FINISHED, () =>
        {
            this.node.active=false;
        }, this);
        this.anim.play("PanelDisappear");
    }

    Open(_levelId:number , _callBack?:(e?:boolean)=>void)
    {
        this.anim=this.node.getChildByPath("Board").getComponent(Animation);
        this.anim.play("PanelAppear");

        this.confirm_Btn.on(Button.EventType.CLICK, () =>
        {
            singleton.netSingleton.game.start_quest_battle_ready();
            _callBack(true);
            this.node.destroy();
        }, this);
    }

    private ShowEnemyInfo(_info:number[])
    {

    }

    private ShowRewardinfo(_info:number[])
    {

    }

}


