import { _decorator, Animation, animation, Asset, Component, instantiate, Node, TTFFont, Prefab, resources, RichText, primitives, AudioSource, builtinResMgr, Canvas, Scene } from 'cc';
import { BundleManager } from '../bundle/BundleManager';
import { InfoPanel } from '../secondaryPanel/InfoPanel';
import { SendMessage } from './MessageEvent';
import { Settlement } from '../secondaryPanel/Settlement';
import { UpStage } from '../secondaryPanel/UpStage';
import { UserInfo } from '../secondaryPanel/UserInfo';
import { TaskAchieve } from '../secondaryPanel/TaskAchieve';
import { RankList } from '../secondaryPanel/RankList';
import { AudioManager } from './AudioManager';
import { Loading } from '../loading/load';
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

    protected onLoad()
    {
        GameManager._instance=this.node.getComponent(GameManager);
        AudioManager.Instance.Init();
        this.Init();
    }

    async start() 
    {
        try
        {
            this.InitEvent();
        }
        catch(error)
        {
            console.error("GameManager 下的 start 错误 error: ",error);
        }
    }

    //初始化
    private async Init()
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
            //加载
            let awaitResult = await Promise.all([tt,tf,ip,sl,us,up,ta,rk]);
            this.textTipNodePre = awaitResult[0] as Prefab;
            this.typeface = awaitResult[1] as TTFFont;

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

            this.rankListBoard=instantiate(t_taskBoard);
            this.rankListBoard.setParent(this.node);
            this.rankListBoard.active=false;
        }
        catch(error)
        {
            console.error("GameManager 下的 start 错误 error: ",error);
        }
    }

    //消息监听
    private InitEvent()
    {
        /* 消息来源
         * RoleCard.ts : 第 42 行 
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
            this.infoPanel.getComponent(InfoPanel).OpenCardInfo(event.detail);
        },this);

        /* 消息来源
         * RoleIcon.ts : 第 345 行 
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
            this.infoPanel.getComponent(InfoPanel).OpenInfoBoard(event.detail.id , event.detail.role , event.detail.isBuy , event.detail.propType);
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
            this.taskAchieveBoard.getComponent(TaskAchieve).OpenTaskAchieveBoard();
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

}


