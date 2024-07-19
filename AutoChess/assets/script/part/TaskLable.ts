import { _decorator, Button, Component, Label, Node, primitives, RichText, Sprite } from 'cc';
import { config } from '../battle/AutoChessBattle/config/config';
import { TaskConfig } from '../battle/AutoChessBattle/config/task_config';
import { Achievement, AchievementAwardStatus } from '../battle/AutoChessBattle/common';
import * as singleton from '../netDriver/netSingleton';
import { UserAccount } from '../mainInterface/MainInterface';
const { ccclass, property } = _decorator;

@ccclass('TaskLable')
export class TaskLable extends Component 
{
    public id:number;

    private _taskName:string;
    private status:AchievementAwardStatus;
    private button:Node;

    private ShowCompleteTask:(name:string,lable:string)=>void;

    public set TaskName(_value:string)
    {
        this._taskName=_value;
        this.node.getChildByPath("Name").getComponent(RichText).string="<color = #000000>"+_value+"</color>";
    }
    private _taskLable:string;
    public set TaskLable(_value:string)
    {
        this._taskLable=_value;
        this.node.getChildByPath("Label").getComponent(Label).string=_value;
        
    }

    private _taskMaxValue:number;
    private _taskValue:number;
    public set TaskValue(_value:number){
        this._taskValue=_value>this._taskMaxValue?this._taskMaxValue:_value;
        if(AchievementAwardStatus.EMRecv==this.status){
            this.node.getChildByPath("Count").getComponent(RichText).string=
                "<color=#000000>已完成</color>"
        }
        else{
            this.node.getChildByPath("Count").getComponent(RichText).string=
                "<color=#000000>"+this._taskValue+"/"+this._taskMaxValue+"</color>"
        }
    }

    private icon:Node;

    protected onLoad(): void
    {
        this.icon=this.node.getChildByPath("Icon");
    }

    public async Init(_config:TaskConfig,_count:number, _status:AchievementAwardStatus,_achievement: Achievement,showComplete:(name:string,lable:string)=>void=null)
    {       
        this.id=_config.Id;
        this.status=_status;
        this.TaskName=_config.Name;
        this.TaskLable=_config.tLable;
        this._taskMaxValue=_config.tValue;
        this.TaskValue=_count;

        this.ShowCompleteTask=showComplete;

        this.button=this.node.getChildByName("Button");
        this.button.on(Button.EventType.CLICK,()=>
        {
            if(AchievementAwardStatus.EMComplete == this.status){
                if(null!=this.ShowCompleteTask) this.ShowCompleteTask(this._taskName,this._taskLable);
                singleton.netSingleton.game.check_achievement(_achievement);
                this.RefreshLable(this._taskValue,AchievementAwardStatus.EMRecv);
            }
        },this);
        
        this.node.getComponent(Sprite).grayscale=(AchievementAwardStatus.EMNotComplete==this.status);
        if(AchievementAwardStatus.EMRecv==this.status){
            this.button.active=false;
        }
        else{
            this.button.active=true;
        }
    }

    public async RefreshLable(_count:number,_status:AchievementAwardStatus){
        console.log( this._taskName+":"+_status);
        this.status=_status;
        this.TaskValue=_count;
        this.node.getComponent(Sprite).grayscale=(AchievementAwardStatus.EMNotComplete==this.status);
        if(AchievementAwardStatus.EMRecv==this.status){
            this.button.active=false;
        }
    }
}


