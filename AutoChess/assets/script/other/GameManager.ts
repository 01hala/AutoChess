import { _decorator, Animation, animation, Asset, Component, instantiate, Node, TTFFont, Prefab, resources, RichText, primitives, AudioSource, builtinResMgr, Canvas, Scene } from 'cc';
import { BundleManager } from '../bundle/BundleManager';
import { InfoBoard } from '../secondaryPanel/InfoBoard';
import { SendMessage } from './MessageEvent';
import { Settlement } from '../secondaryPanel/Settlement';
import { UpStage } from '../secondaryPanel/UpStage';
import { UserInfo } from '../secondaryPanel/UserInfo';
import { TaskAchieve } from '../secondaryPanel/TaskAchieve';
import { RankList } from '../secondaryPanel/RankList';
import { AudioManager } from './AudioManager';
import { Loading } from '../loading/load';
import * as enums from '../other/enums';
import { PopUps } from '../secondaryPanel/PopUps';
import { Guide } from '../panel/Guide';
import * as common from "../battle/AutoChessBattle/common"
import { ChooseTag } from '../secondaryPanel/ChooseTag';
import { sleep } from './sleep';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component 
{
    private static _instance:GameManager=null;

    public static get Instance()
    {
        return this._instance;
    }
    private typeface: TTFFont;
    //提示飘字
    private textTipNodePre:Prefab;
    //弹窗
    private upsBoard:Prefab;
    //角色、道具信息界面
    private infoPanel:Node;
    //战斗结算界面
    private settlementBoard:Node;
    //升阶界面
    private upStageBoard:Node;
    //用户信息面板
    private userInfoBoard:Node;
    //任务、成就界面
    private taskAchieveBoard:Node;
    //排行榜
    private rankListBoard:Node;
    //新手引导
    public guide:Guide;
    
    protected onLoad()
    {
        GameManager._instance=this.node.getComponent(GameManager);
        AudioManager.Instance.Init();
    }

    async start() 
    {
        try
        {
            
        }
        catch(error)
        {
            console.error("GameManager 下的 start 错误 error: ",error);
        }
    }

    //初始化
    public async Init()
    {
        try
        {
            let tt = BundleManager.Instance.loadAssetsFromBundle("TextTipBar", "TextTipBar");
            let tf = BundleManager.Instance.loadAssetsFromBundle("Typeface", "MAOKENASSORTEDSANS");
            let ip = BundleManager.Instance.loadAssetsFromBundle("Board","InformationBoard");
            let sl = BundleManager.Instance.loadAssetsFromBundle("Board","SettlementBoard");
            let us = BundleManager.Instance.loadAssetsFromBundle("Board","UserInfoBoard")
            let up = BundleManager.Instance.loadAssetsFromBundle("Board","UpStageBoard");
            let ta = BundleManager.Instance.loadAssetsFromBundle("Board","TaskAchieveBoard");
            let rk = BundleManager.Instance.loadAssetsFromBundle("Board","RankListBoard");
            let ups = BundleManager.Instance.loadAssetsFromBundle("Board","PopUpsBoard");
            //加载
            let awaitResult = await Promise.all([tt,tf,ip,sl,us,up,ta,rk,ups]);
            this.textTipNodePre = awaitResult[0] as Prefab;
            this.typeface = awaitResult[1] as TTFFont;
            this.upsBoard=awaitResult[8] as Prefab;

            let t_infoPanel = awaitResult[2] as Prefab;
            let t_settlementBoard = awaitResult[3] as Prefab;
            let t_userinfo = awaitResult[4] as Prefab;
            let t_UpStageBoard = awaitResult [5] as Prefab;
            let t_taskBoard=awaitResult[6] as Prefab;
            let t_rankListBoard=awaitResult[7] as Prefab;
    
            this.infoPanel=instantiate(t_infoPanel);
            this.infoPanel.setParent(this.node);
            this.infoPanel.active=false;
    
            this.settlementBoard=instantiate(t_settlementBoard);
            this.settlementBoard.setParent(this.node);
            this.settlementBoard.active=false;

            this.userInfoBoard=instantiate(t_userinfo);
            this.userInfoBoard.setParent(this.node);
            this.userInfoBoard.active=false;

            this.upStageBoard=instantiate(t_UpStageBoard);
            this.upStageBoard.setParent(this.node);
            this.upStageBoard.active=false;

            this.taskAchieveBoard=instantiate(t_taskBoard);
            this.taskAchieveBoard.setParent(this.node);
            this.taskAchieveBoard.active=false;

            this.rankListBoard=instantiate(t_rankListBoard);
            this.rankListBoard.setParent(this.node);
            this.rankListBoard.active=false;

            this.infoPanel.getComponent(InfoBoard).start();
            this.settlementBoard.getComponent(Settlement).start();
            this.userInfoBoard.getComponent(UserInfo).start();
            this.taskAchieveBoard.getComponent(TaskAchieve).start();
            this.rankListBoard.getComponent(RankList).start();

            this.InitEvent();
        }
        catch(error)
        {
            console.error("GameManager 下的 init 错误 error: ",error);
        }
    }

    //消息监听
    private InitEvent()
    {
        /* 消息来源
         * RoleCard.ts : 第 78 行 
         * 
         * 
         * 
         * 
         * 
         */
        this.node.on('OpenCardInfo',(event:SendMessage)=>
        {
            event.propagationStopped=true;
            this.infoPanel.active=true;
            this.infoPanel.getComponent(InfoBoard).OpenCardInfo(event.detail);
        },this);

        /* 消息来源
         * ReadyDis.ts : 第 334 行 
         * 
         * 
         * 
         * 
         * 
         */
        this.node.on('OpenFetterInfo',(event:SendMessage)=>
        {
            event.propagationStopped=true;
            this.infoPanel.active=true;
            this.infoPanel.getComponent(InfoBoard).OpenFetterInfo(event.detail.id,event.detail.spritePath,event.detail.level);
        },this);

        /* 消息来源
         * RoleIcon.ts : 第 453 行 
         * 
         * 
         * 
         * 
         * 
         */
        this.node.on('OpenInfoBoard',(event:SendMessage)=>
        {
            event.propagationStopped=true;
            this.infoPanel.active=true;
            this.infoPanel.getComponent(InfoBoard).OpenInfoBoard(event.detail.id , event.detail.index , event.detail.role , event.detail.isBuy , event.detail.propType);
        },this);

        /* 消息来源
         * RoleIcon.ts : 第 215 行 
         * 
         * 
         * 
         * 
         * 
         */
        this.node.on('ShowTip',(event:SendMessage)=>
        {
            event.propagationStopped=true;
            this.ShowTip(event.detail);
        },this);

        /* 消息来源
         * BattleDis.ts : 第 175、179 行 
         * 
         * 
         * 
         * 
         * 
         */
        this.node.on('OpenSettlement',(event:SendMessage)=>
        {
            event.propagationStopped=true;
            this.settlementBoard.active=true;
            this.settlementBoard.getComponent(Settlement).OpenSettlementBoard(event.detail.outcome , event.detail.hpNum , event.detail.isAddTime);
        },this);

        /* 消息来源
         *  
         * 
         * 
         * 
         * 
         * 
         */
        this.node.on('OpenUpStageBoard',(event:SendMessage)=>
        {
            event.propagationStopped=true;
            this.upStageBoard.active=true;
            this.upStageBoard.getComponent(UpStage).OpenUpStageBoard(event.detail);

        },this);

        /* 消息来源
         *  MainInterface.ts : 第 203 行
         * 
         * 
         * 
         * 
         * 
         */
        this.node.on('OpenUserInfoBoard',(event:SendMessage)=>
        {
            event.propagationStopped=true;
            this.userInfoBoard.active=true;
            this.userInfoBoard.getComponent(UserInfo).OpenUserInfoBoard(event.detail);
        },this);

        /* 消息来源
         * MainInterface.ts : 第 214 行
         * 
         * 
         * 
         * 
         * 
         */
        this.node.on('OpenTaskAchieveBoard',(event:SendMessage)=>
        {
            event.propagationStopped=true;
            this.taskAchieveBoard.active=true;
            this.taskAchieveBoard.getComponent(TaskAchieve).OpenTaskAchieveBoard(event.detail);
        },this);

        /* 消息来源
         * MainInterface.ts : 第 277 行
         * 
         * 
         * 
         * 
         * 
         */
        this.node.on('RefreshTaskAchieveBoard',(event:SendMessage)=>{
            event.propagationStopped=true;
            if(true==this.taskAchieveBoard.activeInHierarchy){
                this.taskAchieveBoard.getComponent(TaskAchieve).RefreshList(event.detail);
            }
        },this);

        /* 消息来源
         * MainInterface.ts : 第 221 行
         * 
         * 
         * 
         * 
         * 
         */
        this.node.on('OpenRankListBoard',(event:SendMessage)=>
        {
            event.propagationStopped=true;
            this.rankListBoard.active=true;
            this.rankListBoard.getComponent(RankList).OpenRankListBoard(event.detail);
        },this);

        /* 消息来源
         * MainInterface.ts : 第 303 行
         * CardEditor.ts : 第 43 行
         * 
         * 
         * 
         * 
         */
        this.node.on('OpenPopUps',(event:SendMessage)=>
        {
            event.propagationStopped=true;
            this.OpenPopUps(event.detail.type , event.detail.title , event.detail.subheading , event.detail.items , event.callBack)
        },this);

        /** 消息来源
         * ReadyDis.ts ：第169行
         * 
         * 
         */
        this.node.on('OpenChooseTag',async (event:SendMessage)=>
        {
            console.log("on message OpenChooseTag");
            event.propagationStopped=true;
            let ct = await BundleManager.Instance.loadAssetsFromBundle("Board", "ChooseTagBoard") as Prefab;
            let board = instantiate(ct);
            board.setParent(this.node);
            await sleep(50);
            board.getComponent(ChooseTag).Open(event.detail.events);
        },this);
    }

    //显示提示信息
    private ShowTip(_msg:string)
    {
        try
        {
            console.log(this.textTipNodePre);
            let tip=instantiate(this.textTipNodePre);
            console.log("获取richtext");
            tip.getChildByPath("RichText").getComponent(RichText).string=_msg;
            tip.getChildByPath("RichText").getComponent(RichText).font = this.typeface;
            tip.setParent(this.node);
            console.log("获取anim");
            let anim=tip.getComponent(Animation);
    
            anim.on(Animation.EventType.FINISHED,(event)=>
            {
                tip.destroy();
            });
    
            anim.play();
        }
        catch(error)
        {
            console.error("GameManager 下的 ShowTip 错误 error: ",error);
        }
    }

    private OpenPopUps(_type:enums.PopUpsType ,_title:string , _subheading:string , _items:Map<string,number> ,  _callBack?:(e?:boolean)=>void)
    {
        console.log("弹窗类型：",_type);
        let ups=instantiate(this.upsBoard);
        ups.setParent(this.node);
        ups.getComponent(PopUps).title=_title;
        ups.getComponent(PopUps).subheading=_subheading;
        ups.getComponent(PopUps).OpenBoard(_type , _items , _callBack);
    }

    

    public async StartGuide(_step:common.GuideStep)
    {
        let tnode=await BundleManager.Instance.loadAssetsFromBundle("Panel","GuidePanel") as Prefab;
        let gnode=instantiate(tnode);

        gnode.setParent(this.node);
        this.guide=gnode.getComponent(Guide);

        this.guide.Init(_step);
    }

    
}


