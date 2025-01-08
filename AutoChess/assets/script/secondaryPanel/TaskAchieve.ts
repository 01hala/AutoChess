/*
 * 添加TaskAchieve.ts
 * author：Hotaru
 * 2024/04/15
 * 任务、成就面板
 */
import { _decorator, Animation, BlockInputEvents, Button, Component, EventHandler, instantiate, Node, Prefab, RichText, ScrollView, Sprite, Toggle, ToggleContainer, Vec3, Widget } from 'cc';
import { PageType } from '../other/enums';
import { BundleManager } from '../bundle/BundleManager';
import { AudioManager } from '../other/AudioManager';
import { config } from '../battle/AutoChessBattle/config/config';
import { TaskLable } from '../part/TaskLable';
import { Achievement, AchievementAwardStatus, AchievementData, AchievementReward } from '../battle/AutoChessBattle/common';
import * as common from "../battle/AutoChessBattle/common"
import { User } from '../login/User';
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

    //map保存lable列表方便刷新
    private lableList:Map<number,Node>;
    private taskCompletePanel:Node;

    protected async onLoad(): Promise<void> 
    {
        this.exitBtn=this.node.getChildByPath("Exit_Btn").getComponent(Button);
        this.board=this.node.getChildByPath("Board");
        this.toggleGroup=this.node.getChildByPath("Board/ToggleGroup");
        this.scrollView=this.node.getChildByPath("Board/ScrollView");
        this.taskCompletePanel=this.node.getChildByName("TaskComplete");

        this.taskCompletePanel.active=false;
        this.taskCompletePanel.getChildByName("BG").on(Button.EventType.CLICK,()=>{
            this.taskCompletePanel.active=false;
        });
        this.lableList=new Map<number,Node>();

        this.lablePre=await BundleManager.Instance.loadAssetsFromBundle("PartPrefabs","TaskLabel")as Prefab;
    }

    start() 
    {
        this.node.getChildByPath("BG").on(Button.EventType.CLICK,()=>
        {
            this.Exit();
        });
        this.exitBtn.node.on(Button.EventType.CLICK,()=>
        {
            AudioManager.Instance.PlayerOnShot("Sound/sound_click_close_01");
            this.Exit();
        })
        this.node.getComponent(BlockInputEvents).enabled=true;
        this.Init();
    }

    protected onDestroy(): void
    {
        this.destroy();
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

    private async ShowLabels(_flag:PageType)
    {
        let jconfig = null;
        let i;

        this.scrollView.getComponent(ScrollView).scrollToTop(0.1);
        let achieveList:AchievementData[];
        switch(_flag)
        {
            case PageType.Task:{
                i=1001;
                achieveList=User.UserData.wAchiev.wAchievData;
            }break;
            case PageType.Achieve:{
                i=2001;
                achieveList=User.UserData.Achiev.achievData;
            }break;
        }
        this.lableList.clear();

        do
        {
            jconfig = await config.TaskConfig.get(i);
            if(jconfig!=null){
                let lab=instantiate(this.lablePre);
                lab.getComponent(TaskLable).Init(jconfig ,0 , AchievementAwardStatus.EMNotComplete,jconfig.tClass,this.ShowCompleteTask);
                this.scrollView.getChildByPath("view/content").addChild(lab); 

                this.lableList.set(jconfig.tClass,lab);
            } 
            
            i++;
        }while(jconfig!=null)

        //console.log(achieveList);
        for(let t of achieveList){    
            //console.log(t.emAchievement.toString());
            let temp=this.lableList.get(t.emAchievement);  
            if(null!=temp){
                temp.getComponent(TaskLable).RefreshLable(t.count,t.status);  
            }     
        }
    }

    private ShowCompleteTask(_name:string,_lable:string){
        this.taskCompletePanel.active=true;
        this.taskCompletePanel.getChildByPath("ShowBG/Name").getComponent(RichText).string=_name;
        this.taskCompletePanel.getChildByPath("ShowBG/Lable").getComponent(RichText).string=_lable;
    }

    public async RefreshList(){
        if(this.toggleGroup.getChildByPath("TaskList").getComponent(Toggle).isChecked)
        {
            
            for(let t of User.UserData.wAchiev.wAchievData){
                let temp=this.lableList.get(t.emAchievement)
                if(temp){
                    temp.getComponent(TaskLable).RefreshLable(t.count,t.status);
                }
            }
        }
        if(this.toggleGroup.getChildByPath("AchieveList").getComponent(Toggle).isChecked)
        {
            
            for(let t of User.UserData.Achiev.achievData){
                let temp=this.lableList.get(t.emAchievement)
                if(temp){
                    temp.getComponent(TaskLable).RefreshLable(t.count,t.status);
                }
            }
        }
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


