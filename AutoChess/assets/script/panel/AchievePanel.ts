import { _decorator, Button, Component, instantiate, Node, Prefab, RichText, ScrollView } from 'cc';
import { BundleManager } from '../bundle/BundleManager';
import { UserAccount } from '../mainInterface/MainInterface';
import { AchievementAwardStatus, AchievementData } from '../serverSDK/common';
import { config } from '../battle/AutoChessBattle/config/config';
import { TaskLable } from '../part/TaskLable';
import * as singleton from '../netDriver/netSingleton';
import { sleep } from '../other/sleep';
const { ccclass, property } = _decorator;

@ccclass('AchievePanel')
export class AchievePanel extends Component 
{
    //map保存lable列表方便刷新
    private lableList:Map<number,Node>;
    private taskCompletePanel:Node;

    //用户数据
    private userAccount:UserAccount;

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

    private async Load()
    {
        this.lablePre=await BundleManager.Instance.loadAssetsFromBundle("Parts","TaskLabel") as Prefab;
    }

    private Exit()
    {
        this.RemoveAllLables();
        this.node.destroy();
    }

    async Open(_userAccount:UserAccount)
    {
        await this.Load();
        this.lableList=new Map<number,Node>();
        this.userAccount=_userAccount;
        this.ShowLabels(this.userAccount);
    }

    private async ShowLabels(_user:UserAccount)
    {
        try
        {
            let jconfig = null;
            let i = 2001;
    
            this.scrollView.getComponent(ScrollView).scrollToTop(0.1);
            let achieveList:AchievementData[];
            achieveList=_user.Achiev.achievData;
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

    public async RefreshList(_user?:UserAccount)
    {
        this.userAccount = _user;
        for (let t of this.userAccount.Achiev.achievData)
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


