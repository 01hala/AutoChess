import { _decorator, Component, Label, Node, primitives, RichText, Sprite } from 'cc';
import { config } from '../config/config';
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

    private async LoadOnConfig()
    {
        let jconfig=config.TaskConfig.get(this.id);
        this.TaskName=jconfig.Name;
        this.TaskName=jconfig.tLable;
    }

    protected onLoad(): void
    {
        this.icon=this.node.getChildByPath("Icon");
    }

    public async Init(_id:number , _finish:boolean)
    {
        this.id=_id;

        await this.LoadOnConfig();

        if(_finish)
        {
            this.node.getComponent(Sprite).grayscale=_finish;
        }
    }




}


