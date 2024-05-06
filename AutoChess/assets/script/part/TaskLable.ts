import { _decorator, Component, Label, Node, primitives, RichText, Sprite } from 'cc';
import { config } from '../config/config';
import { TaskConfig } from '../config/task_config';
import { AchievementAwardStatus } from '../serverSDK/common';
import { UserAccount } from '../mainInterface/MainInterface';
const { ccclass, property } = _decorator;

@ccclass('TaskLable')
export class TaskLable extends Component 
{
    public id:number;

    private _taskName:string;
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

    private icon:Node;

    protected onLoad(): void
    {
        this.icon=this.node.getChildByPath("Icon");
    }

    public async Init(_config:TaskConfig, _status:AchievementAwardStatus)
    {
        this.id=_config.Id;

        this.TaskName=_config.Name;
        this.TaskLable=_config.tLable;

        this.node.getComponent(Sprite).grayscale=(AchievementAwardStatus.EMComplete==_status);
    }

    public async RefreshLable(_status:AchievementAwardStatus){
        this.node.getComponent(Sprite).grayscale=(AchievementAwardStatus.EMComplete==_status);
    }
}


