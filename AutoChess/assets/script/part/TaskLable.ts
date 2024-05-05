import { _decorator, Component, Label, Node, primitives, RichText, Sprite } from 'cc';
import { config } from '../config/config';
import { TaskConfig } from '../config/task_config';
const { ccclass, property } = _decorator;

@ccclass('TaskLable')
export class TaskLable extends Component 
{
    public id:number;

    private _taskName:string;
    public set TaskName(_value:string)
    {
        this._taskName=_value;
        this.node.getChildByPath("Name").getComponent(RichText).string="<color = #000000>"+_value + "</color>";
    }
    private _taskLable:string;
    public set TaskLable(_value:string)
    {
        this._taskLable=_value;
        this.node.getChildByPath("Label").getComponent(Label).string="<color = #000000>" + _value + "</color>";
    }

    private icon:Node;

    protected onLoad(): void
    {
        this.icon=this.node.getChildByPath("Icon");
    }

    public async Init(_config:TaskConfig, _finish:boolean)
    {
        this.id=_config.Id;

        this.TaskName=_config.Name;
        this.TaskLable=_config.tLable;

        if(_finish)
        {
            this.node.getComponent(Sprite).grayscale=_finish;
        }
    }




}


