/*
 * 添加TaskAchieve.ts
 * author：Hotaru
 * 2024/04/15
 * 任务、成就面板
 */
import { _decorator, Animation, BlockInputEvents, Button, Component, EventHandler, Node, Prefab, RichText, Toggle, ToggleContainer } from 'cc';
import { PageType } from '../other/enums';
import { BundleManager } from '../bundle/BundleManager';
const { ccclass, property } = _decorator;

@ccclass('TaskAchieve')
export class TaskAchieve extends Component 
{
    //标签
    private lablePre:Prefab;
    //退出按钮
    private exitBtn:Button;
    //主要显示区域
    private board:Node;
    private toggleGroup:Node;
    private scrollView:Node;

    protected async onLoad(): Promise<void> 
    {
        this.lablePre=await BundleManager.Instance.loadAssetsFromBundle("Parts","TaskLabel")as Prefab;

        this.exitBtn=this.node.getChildByPath("Exit_Btn").getComponent(Button);
        this.board=this.node.getChildByPath("Board");
        this.toggleGroup=this.node.getChildByPath("Board/ToggleGroup");
        this.scrollView=this.node.getChildByPath("ScrollView");
    }

    start() 
    {
        this.node.getChildByPath("BG").on(Button.EventType.CLICK,()=>
        {
            this.Exit();
        });
        this.exitBtn.node.on(Button.EventType.CLICK,()=>
        {
            this.Exit();
        })

        this.node.getComponent(BlockInputEvents).enabled=true;
        this.Init();
    }

    private Init()
    {
        try
        {
            const containerEventHandler = new EventHandler();
            containerEventHandler.target = this.node; // 这个 node 节点是你的事件处理代码组件所属的节点
            containerEventHandler.component = 'TaskAchieve';// 这个是脚本类名
            containerEventHandler.handler = 'OnCheckToggleEvent';

            this.toggleGroup.getComponent(ToggleContainer).checkEvents.push(containerEventHandler);
        }
        catch(error)
        {

        }
    }

    public OpenTaskAchieveBoard()
    {
        try
        {
            this.node.getComponent(BlockInputEvents).enabled=true;
            this.node.setSiblingIndex(100);
            this.board.active=true;
            this.ShowLabels(PageType.Task);
            this.board.getComponent(Animation).play("PanelAppear");
        }
        catch(error)
        {
            console.error("TaskAchieve 下的 OpenTaskAchieveBoard 错误：",error);
        }
    }

    private OnCheckToggleEvent(event: Event, customEventData: string)
    {
        try
        {
            this.RemoveAllLables();
            if(this.toggleGroup.getChildByPath("TaskList").getComponent(Toggle).isChecked)
            {
                this.ShowLabels(PageType.Task);
            }
            if(this.toggleGroup.getChildByPath("AchieveList").getComponent(Toggle).isChecked)
            {
                this.ShowLabels(PageType.Achieve);
            }
        }
        catch(error)
        {
            console.error("TaskAchieve 下的 OnCheckToggleEvent 错误：",error);
        }
    }

    private ShowLabels(_flag:PageType)
    {

    }

    private RemoveAllLables()
    {
        let lab=this.scrollView.getChildByPath("view/content").children;
        for(let i=0;i<lab.length;i++)
        {
            lab[i].destroy();
        }
    }

    private Exit()
    {
        this.node.getComponent(BlockInputEvents).enabled=false;

        this.board.getComponent(Animation).on(Animation.EventType.FINISHED,()=>
        {
            this.node.active=false;
            this.board.getComponent(Animation).off(Animation.EventType.FINISHED);
        })

        this.board.getComponent(Animation).play("PanelDisappear");
    }
}


