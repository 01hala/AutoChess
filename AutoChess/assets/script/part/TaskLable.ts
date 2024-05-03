import { _decorator, Component, Label, Node, primitives, RichText } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TaskLable')
export class TaskLable extends Component 
{
    public id:number;

    private _taskName:string;
    public set TaskName(_value:string)
    {
        this._taskName=_value;
        this.node.getChildByPath("Name").getComponent(RichText).string=_value;
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

    start() 
    {


    }

    public async Init(_id:number)
    {
        this.id=_id;

        await this.LoadOnConfig(_id);
    }

    private async LoadOnConfig(_id:number)
    {
        
    }

}


