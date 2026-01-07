import { _decorator, Button, Component, instantiate, Node, Prefab, RichText, ScrollView } from 'cc';
import { BundleManager } from '../bundle/BundleManager';
import { AchievementAwardStatus, AchievementData } from '../serverSDK/common';
import { config } from '../battle/AutoChessBattle/config/config';
import { TaskLable } from '../part/TaskLable';
import * as singleton from '../netDriver/netSingleton';
import { sleep } from '../other/sleep';
import { User } from '../login/User';
import * as common from "../serverSDK/common"
const { ccclass, property } = _decorator;

@ccclass('AchievePanel')
export class AchievePanel extends Component 
{
    //map保存lable列表方便刷新
    private lableList:Map<number,Node>;
    private taskCompletePanel:Node;

    //标签
    private lablePre:Prefab;
    //退出按钮
    private exitBtn:Node;

    private scrollView:Node;

    protected onLoad(): void
    {
        this.exitBtn=this.node.getChildByPath("Panel/Exit_Btn");
        this.scrollView=this.node.getChildByPath("Panel/ScrollView");
    }

    start() 
    {
        this.exitBtn.on(Button.EventType.CLICK,()=>
        {
            singleton.netSingleton.mainInterface.panelNode.active = true;
            this.Exit();
        },this);
    }

    protected onDestroy(): void
    {
        this.destroy();
    }

    private async Load()
    {
        this.lablePre=await BundleManager.Instance.loadAssetsFromBundle("PartPrefabs","TaskLabel") as Prefab;
    }

    private Exit()
    {
        singleton.netSingleton.mainInterface.activity=true;
        this.RemoveAllLables();
        this.node.active=false;
    }

    async Open()
    {
        await this.Load();
        this.lableList=new Map<number,Node>();
        this.ShowLabels();
    }

    private async ShowLabels()
    {
        try
        {
            let jconfig = null;
            let i = 2001;
    
            this.scrollView.getComponent(ScrollView).scrollToTop(0.1);
            let achieveList:AchievementData[];
            achieveList=User.UserData.Achiev.achievData;
            if(this.lableList.size > 0)
            {
                this.lableList.clear();
            }
            do
            {
                jconfig = await config.TaskConfig.get(i);
                if(jconfig!=null)
                {
                    let lab=instantiate(this.lablePre);
                    this.scrollView.getChildByPath("view/content").addChild(lab); 
                    await lab.getComponent(TaskLable).Init(jconfig ,0 , AchievementAwardStatus.EMNotComplete,jconfig.tClass,this.ShowComplete);
                    
                    this.lableList.set(jconfig.tClass,lab);
                } 
                
                i++;
                await sleep(10);
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
        catch(error)
        {
            console.error("AchievePanel 下的 ShowLabels 错误：",error);
        }
    }

    private ShowComplete(_name: string, _lable: string)
    {
        this.taskCompletePanel.active = true;
        this.taskCompletePanel.getChildByPath("ShowBG/Name").getComponent(RichText).string = _name;
        this.taskCompletePanel.getChildByPath("ShowBG/Lable").getComponent(RichText).string = _lable;
    }

    public async RefreshList()
    {
        for (let t of User.UserData.Achiev.achievData)
        {
            let temp = this.lableList.get(t.emAchievement)
            if (temp)
            {
                temp.getComponent(TaskLable).RefreshLable(t.count, t.status);
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
}


