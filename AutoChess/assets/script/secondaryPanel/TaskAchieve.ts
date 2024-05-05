/*
 * 添加TaskAchieve.ts
 * author：Hotaru
 * 2024/04/15
 * 任务、成就面板
 */
import { _decorator, Animation, BlockInputEvents, Button, Component, EventHandler, instantiate, Node, Prefab, RichText, Sprite, Toggle, ToggleContainer } from 'cc';
import { PageType } from '../other/enums';
import { BundleManager } from '../bundle/BundleManager';
import { AudioManager } from '../other/AudioManager';
import { config } from '../config/config';
import { TaskLable } from '../part/TaskLable';
import { UserAccount } from '../mainInterface/MainInterface';
import { Achievement } from '../serverSDK/common';
const { ccclass, property } = _decorator;

@ccclass('Task & Achieve')
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
        this.exitBtn=this.node.getChildByPath("Exit_Btn").getComponent(Button);
        this.board=this.node.getChildByPath("Board");
        this.toggleGroup=this.node.getChildByPath("Board/ToggleGroup");
        this.scrollView=this.node.getChildByPath("Board/ScrollView");

        this.lablePre=await BundleManager.Instance.loadAssetsFromBundle("Parts","TaskLabel")as Prefab;
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
            containerEventHandler.component = 'Task & Achieve';// 这个是脚本类名
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
            AudioManager.Instance.PlayerOnShot("Sound/sound_bookmark_select_01");
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

    private ShowLabels(_flag:PageType,_user?:UserAccount)
    {
        let jconfig = null;

        let i;
        switch(_flag)
        {
            case PageType.Task:i=1001;break;
            case PageType.Achieve:i=2001;break;
        }

        do
        {
            jconfig=config.TaskConfig.get(i);
            if(jconfig!=null)
            {
                let lab=instantiate(this.lablePre);
                lab.getComponent(TaskLable).Init(i,1);
                this.scrollView.getChildByPath("view/content").addChild(lab);
            }
            
            i++;
        }while(jconfig!=null)
    }



    private RemoveAllLables()
    {
        try
        {
            let lab=this.scrollView.getChildByPath("view/content").children;
            for(let i=0;i<lab.length;i++)
            {
                lab[i].destroy();
            }
        }
        catch(error)
        {
            console.error("TaskAchieve 下的 RemoveAllLables 错误：",error);
        }
    }

    private Exit()
    {
        try
        {
            this.node.getComponent(BlockInputEvents).enabled=false;

            this.board.getComponent(Animation).on(Animation.EventType.FINISHED,()=>
            {
                this.node.active=false;
                this.board.getComponent(Animation).off(Animation.EventType.FINISHED);
            })
    
            this.board.getComponent(Animation).play("PanelDisappear");
        }
        catch(error)
        {
            console.error("TaskAchieve 下的 Exit 错误：",error);
        }
    }
}


