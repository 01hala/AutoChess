import { _decorator, Animation, animation, Asset, Component, instantiate, Node, TTFFont, Prefab, resources, RichText, primitives, AudioSource, builtinResMgr, Canvas, Scene, BaseNode } from 'cc';
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
    //升阶界面
    private upStageBoard:Node;
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
            let tf = BundleManager.Instance.loadAssetsFromBundle("Typeface", "MAOKENASSORTEDSANS");
            //加载
            let awaitResult = await Promise.all([tf]);
            this.typeface = awaitResult[0] as TTFFont;

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
        //打开角色卡信息
        /* 消息来源
         * RoleCard.ts : 第 78 行 
         * 
         * 
         * 
         * 
         * 
         */
        this.node.on(enums.SendMseeageType.OpenCardInfo,async (event:SendMessage)=>
        {
            event.propagationStopped=true;
            let ib=await BundleManager.Instance.loadAssetsFromBundle("Board","InformationBoard") as Prefab;
            let board=instantiate(ib);
            board.setParent(this.node);
            board.getComponent(InfoBoard).OpenCardInfo(event.detail);

        },this);

        //打开羁绊信息
        /* 消息来源
         * ReadyDis.ts : 第 334 行 
         * 
         * 
         * 
         * 
         * 
         */
        this.node.on(enums.SendMseeageType.OpenFetterInfo,async (event:SendMessage)=>
        {
            event.propagationStopped=true;
            let ib=await BundleManager.Instance.loadAssetsFromBundle("Board","InformationBoard") as Prefab;
            let board=instantiate(ib);
            board.setParent(this.node);
            board.getComponent(InfoBoard).OpenFetterInfo(event.detail.id,event.detail.spritePath,event.detail.level);
        },this);

        /* 消息来源
         * RoleIcon.ts : 第 453 行 
         * 
         * 
         * 
         * 
         * 
         */
        this.node.on(enums.SendMseeageType.OpenInfoBoard,async (event:SendMessage)=>
        {
            event.propagationStopped=true;
            let ib=await BundleManager.Instance.loadAssetsFromBundle("Board","InformationBoard") as Prefab;
            let board=instantiate(ib);
            board.setParent(this.node);
            board.getComponent(InfoBoard).OpenInfoBoard(event.detail.id , event.detail.index , event.detail.role , event.detail.isBuy , event.detail.propType);
        },this);

        //消息提示
        /* 消息来源
         * RoleIcon.ts : 第 215 行 
         * MainInterface.ts : 第 349 行
         * 
         * 
         * 
         * 
         */
        this.node.on(enums.SendMseeageType.ShowTip,(event:SendMessage)=>
        {
            event.propagationStopped=true;
            this.ShowTip(event.detail);
        },this);

        //打开结算面板
        /* 消息来源
         * BattleDis.ts : 第 175、179 行 
         * 
         * 
         * 
         * 
         * 
         */
        this.node.on(enums.SendMseeageType.OpenSettlement,async (event:SendMessage)=>
        {
            event.propagationStopped=true;
            let st=await BundleManager.Instance.loadAssetsFromBundle("Board","SettlementBoard") as Prefab;
            let board = instantiate(st);
            board.setParent(this.node);
            board.getComponent(Settlement).OpenSettlementBoard(event.detail.outcome, event.detail.GameMode, event.detail.addCoin, event.detail.hpNum, event.detail.isAddTime);
        },this);

        //打开升阶面板
        /* 消息来源
         *  
         * 
         * 
         * 
         * 
         * 
         */
        this.node.on(enums.SendMseeageType.OpenUpStageBoard,async (event:SendMessage)=>
        {
            event.propagationStopped=true;

            let up = await BundleManager.Instance.loadAssetsFromBundle("Board","UpStageBoard") as Prefab;
            let board=instantiate(up);
            board.setParent(this.node);
            board.getComponent(UpStage).OpenUpStageBoard(event.detail);
        },this);

        //打开用户信息面板+
        /* 消息来源
         *  MainInterface.ts : 第 203 行
         * 
         * 
         * 
         * 
         * 
         */
        this.node.on(enums.SendMseeageType.OpenUserInfoBoard,async (event:SendMessage)=>
        {
            event.propagationStopped=true;

            let us = await BundleManager.Instance.loadAssetsFromBundle("Board","UserInfoBoard") as Prefab;
            let board=instantiate(us);
            board.setParent(this.node);
            board.getComponent(UserInfo).OpenUserInfoBoard(event.detail);
        },this);

        /* 消息来源
         * MainInterface.ts : 第 214 行
         * 
         * 
         * 
         * 
         * 
         */
        this.node.on(enums.SendMseeageType.OpenTaskAchieveBoard,async (event:SendMessage)=>
        {
            event.propagationStopped=true;

            let ta = await BundleManager.Instance.loadAssetsFromBundle("Board","TaskAchieveBoard") as Prefab;
            let board=instantiate(ta);
            board.setParent(this.node);
            board.getComponent(TaskAchieve).OpenTaskAchieveBoard(event.detail);
        },this);

        /* 消息来源
         * MainInterface.ts : 第 277 行
         * 
         * 
         * 
         * 
         * 
         */
        this.node.on(enums.SendMseeageType.RefreshTaskAchieveBoard,(event:SendMessage)=>
        {
            event.propagationStopped=true;
            let board=this.node.getChildByName("TaskAchieveBoard");
            if(null!= board && true == board.activeInHierarchy)
            {
                board.getComponent(TaskAchieve).RefreshList(event.detail);
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
        this.node.on(enums.SendMseeageType.OpenRankListBoard,async (event:SendMessage)=>
        {
            event.propagationStopped=true;

            let rk = await BundleManager.Instance.loadAssetsFromBundle("Board","RankListBoard") as Prefab;
            let board = instantiate(rk);
            board.setParent(this.node);
            board.getComponent(RankList).OpenRankListBoard(event.detail);
        },this);

        /* 消息来源
         * MainInterface.ts : 第 303 行
         * CardEditor.ts : 第 43 行
         * 
         * 
         * 
         * 
         */
        this.node.on(enums.SendMseeageType.OpenPopUps,(event:SendMessage)=>
        {
            event.propagationStopped=true;
            this.OpenPopUps(event.detail.type , event.detail.title , event.detail.subheading , event.detail.items , event.callBack)
        },this);

        /** 消息来源
         * ReadyDis.ts ：第169行
         * 
         * 
         */
        this.node.on(enums.SendMseeageType.OpenChooseTag,async (event:SendMessage)=>
        {
            console.log("on message OpenChooseTag");
            event.propagationStopped=true;
            let ct = await BundleManager.Instance.loadAssetsFromBundle("Board", "ChooseTagBoard") as Prefab;
            let board = instantiate(ct);
            board.setParent(this.node);
            await sleep(100);
            console.log("ChooseTags：",event.detail.events);
            board.getComponent(ChooseTag).Open(event.detail.events);
        },this);
    }

    //显示提示信息
    private async ShowTip(_msg:string)
    {
        try
        {
            let tt = await BundleManager.Instance.loadAssetsFromBundle("TextTipBar", "TextTipBar") as Prefab;
            let tip=instantiate(tt);
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

    private async OpenPopUps(_type:enums.PopUpsType ,_title:string , _subheading:string , _items:Map<string,number> ,  _callBack?:(e?:boolean)=>void)
    {
        console.log("弹窗类型：",_type);
        let ups = await BundleManager.Instance.loadAssetsFromBundle("Board","PopUpsBoard") as Prefab;
        let board=instantiate(ups);
        board.setParent(this.node);
        board.getComponent(PopUps).title=_title;
        board.getComponent(PopUps).subheading=_subheading;
        board.getComponent(PopUps).OpenBoard(_type , _items , _callBack);
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


