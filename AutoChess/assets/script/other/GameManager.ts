import { _decorator, Animation, animation, Asset, Component, instantiate, Node, TTFFont, Prefab, resources, RichText, primitives, AudioSource, builtinResMgr, Canvas, Scene, BaseNode, Pool, error, input, Input, EventTouch, Vec2, Vec3, Camera, find } from 'cc';
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
import { LevelInfo } from '../secondaryPanel/LevelInfo';
import { config } from '../battle/AutoChessBattle/config/config';
import { OptionsData, User } from '../login/User';
import { RoleArea } from '../ready/display/RoleArea';
import * as singleton from '../netDriver/netSingleton';
import { SpEffectOnUI } from './SpEffect';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component 
{
    private static _instance:GameManager=null;

    public static get Instance()
    {
        return this._instance;
    }
    private typeface: TTFFont=null;
    //升阶界面
    private upStageBoard:Node=null;
    //等待界面
    private waitingPanel:Node=null;
    //新手引导
    public guide:Guide=null;
    //侦听计时器
    public listening=null;
    //对象列表
    private boardList:Map<string,Node>=null;
    private panelList:Map<string,Node>=null;

    public clickSpCanvas:Node=null;
    
    protected onLoad()
    {
        GameManager._instance=this.node.getComponent(GameManager);
        AudioManager.Instance.Init();
    }

    async start() 
    {
        try
        {
           User.OptionsData=new OptionsData();
           this.boardList=new Map<string,Node>();
           this.panelList=new Map<string,Node>();

           this.clickSpCanvas=find("ClickSpCanvas");
        }
        catch(error)
        {
            console.error("GameManager 下的 start 错误 error: ",error);
        }

        this.clickSpCanvas.on(Input.EventType.TOUCH_START,(event)=>
        {
            event.preventSwallow=true;
            let sceenPos=event.getLocation();
            let uiPos=this.node.getChildByPath("Camera").getComponent(Camera).screenToWorld(new Vec3(sceenPos.x,sceenPos.y,0));
            SpEffectOnUI.OnClickEffect(uiPos);
        });
        this.clickSpCanvas.on(Input.EventType.TOUCH_MOVE,(event)=>
        {
            event.preventSwallow=true;
        });
        this.clickSpCanvas.on(Input.EventType.TOUCH_END,(event)=>
        {
            event.preventSwallow=true;
        });
        this.clickSpCanvas.on(Input.EventType.TOUCH_CANCEL, (event) =>
        {
            event.preventSwallow = true;
        });
    }

    //初始化
    public async Init()
    {
        try
        {
            let tf = BundleManager.Instance.loadAssetsFromBundle("Typeface", "MAOKENASSORTEDSANS");
            let wt=BundleManager.Instance.loadAssetsFromBundle("PanelPrefabs","waiting");
            //加载
            let awaitResult = await Promise.all([tf,wt]);
            this.typeface = awaitResult[0] as TTFFont;
            let tpre=awaitResult[1] as Prefab;
            this.waitingPanel=instantiate(tpre);
            this.waitingPanel.setParent(this.node);
            this.waitingPanel.active=false;

            this.InitEvent();
        }
        catch(error)
        {
            console.error("GameManager 下的 init 错误 error: ",error);
        }
    }

    /**
     * 查找或加载二级面板
     * @param str 面板名
     * @returns 实例化的面板
     */
    public async getBoard(str:string):Promise<Node>
    {
        try
        {
            if (this.boardList.has(str))
            {
                return this.boardList.get(str);
            }
            else
            {
                let prefab = await BundleManager.Instance.loadAssetsFromBundle("BoardPrefabs", str) as Prefab;
                let board = instantiate(prefab);
                board.setParent(this.node);
                this.boardList.set(board.name, board);
                return board;
            }
        } catch (error)
        {
            console.error("GameManager 下的 getBoard 错误 error: ",error);
        }
    }

    /**
     * 移除所有二级面板
     */
    public RemoveBoards()
    {
        try
        {
            for (let t of this.boardList.values()) 
            {
                t.destroy();
            }
            this.boardList.clear();
        } catch (error)
        {
            console.error("GameManager 下的 removeBoards 错误 error: ",error);
        }
    }

    /**
     * 查找或加载界面
     * @param str 界面名
     * @returns 实例化的界面
     */
    public async getPanel(str:string)
    {
        try
        {
            if (this.panelList.has(str))
            {
                return this.panelList.get(str);
            }
            else
            {
                let prefab = await BundleManager.Instance.loadAssetsFromBundle("PanelPrefabs", str) as Prefab;
                let panel = instantiate(prefab);
                panel.setParent(this.node);
                this.panelList.set(panel.name, panel);
                return panel;
            }
        } catch (error)
        {
            console.error("GameManager 下的 getPanel 错误 error: ",error);
        }
    }

    /**
     * 移除所有界面
     */
    public RemovePanels()
    {
        try
        {
            for (let t of this.panelList.values())
            {
                t.destroy();
            }
            this.panelList.clear();
        } catch (error)
        {
            console.error("GameManager 下的 removePanels 错误 error: ",error);
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
            let board= await this.getBoard("InformationBoard");
            board?.getComponent(InfoBoard).OpenCardInfo(event.detail.id);
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
            let board = await this.getBoard("InformationBoard");
            board?.getComponent(InfoBoard).OpenFetterInfo(event.detail.id,event.detail.spritePath,event.detail.level);
        },this);

        //打开角色详细信息
        /* 消息来源
         * RoleIcon.ts : 第 453 行 
         * RoleDis.ts : 第 157 行
         * PropIcon.ts
         * 
         * 
         * 
         */
        this.node.on(enums.SendMseeageType.OpenInfoBoard,async (event:SendMessage)=>
        {
            event.propagationStopped=true;
            let board = await this.getBoard("InformationBoard");
            board?.getComponent(InfoBoard).OpenEntityInfo(event.detail.id , event.detail.index , event.detail.role , event.detail.isBuy , event.detail.propType);
        },this);

        //消息提示
        /* 消息来源
         * RoleIcon.ts : 第 215 行 
         * MainInterface.ts : 第 349 行
         * QuestPanel.ts : 第 54 行
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
            let board = await this.getBoard("SettlementBoard");
            board?.getComponent(Settlement).OpenSettlementBoard(event.detail.outcome, event.detail.GameMode, event.detail.addCoin, event.detail.hpNum, event.detail.isAddTime);
        },this);

        //打开升阶面板(暂时无用)
        /* 消息来源
         *  
         * 
         * 
         * 
         * 
         * 
         */
        // this.node.on(enums.SendMseeageType.OpenUpStageBoard, async (event: SendMessage) =>
        // {
        //     event.propagationStopped = true;

        //     let up = await BundleManager.Instance.loadAssetsFromBundle("BoardPrefabs", "UpStageBoard") as Prefab;
        //     let board = instantiate(up);
        //     board.setParent(this.node);
        //     board.getComponent(UpStage).OpenUpStageBoard(event.detail);
        //     this.boardList.set(board.name, board);
        // }, this);

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
            let board=await this.getBoard("UserInfoBoard");
            board.getComponent(UserInfo).OpenUserInfoBoard(event.detail);
        },this);

        //打开任务面板(暂时无用)
        /* 消息来源
         * MainInterface.ts : 第 214 行
         * 
         * 
         * 
         * 
         * 
         */
        // this.node.on(enums.SendMseeageType.OpenTaskAchieveBoard,async (event:SendMessage)=>
        // {
        //     event.propagationStopped=true;

        //     let ta = await BundleManager.Instance.loadAssetsFromBundle("BoardPrefabs","TaskAchieveBoard") as Prefab;
        //     let board=instantiate(ta);
        //     board.setParent(this.node);
        //     board.getComponent(TaskAchieve).OpenTaskAchieveBoard();
        //     this.boardList.set(board.name,board);
        // },this);

        //刷新任务面板(暂时无用)
        /* 消息来源
         * MainInterface.ts : 第 277 行
         * 
         * 
         * 
         * 
         * 
         */
        // this.node.on(enums.SendMseeageType.RefreshTaskAchieveBoard,(event:SendMessage)=>
        // {
        //     event.propagationStopped=true;
        //     let board=this.node.getChildByName("TaskAchieveBoard");
        //     if(null!= board && true == board.activeInHierarchy)
        //     {
        //         board.getComponent(TaskAchieve).RefreshList();
        //     }
        // },this);

        //打开排行榜
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
            let board = await this.getBoard("RankListBoard");
            board?.getComponent(RankList).OpenRankListBoard(event.detail);
        },this);

        //打开提示弹窗
        /* 消息来源
         * MainInterface.ts : 第 460 行
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

        //打开事件选择面板
        /** 消息来源
         * ReadyDis.ts ：第129行
         * 
         * 
         */
        this.node.on(enums.SendMseeageType.OpenChooseTag,async (event:SendMessage)=>
        {
            console.log("on message OpenChooseTag");
            event.propagationStopped=true;
            let board = await this.getBoard("ChooseTagBoard");
            await sleep(100);
            console.log("ChooseTags：",event.detail.events);
            board.getComponent(ChooseTag).Open(event.detail.events);
        },this);

        /**打开关卡信息面板 消息来源：
         * VenturePanel.ts ：第 46 行
         */
        this.node.on(enums.SendMseeageType.OpenLevelInfo ,async (event:SendMessage)=>
        {
            event.propagationStopped = true;
            let board = await this.getBoard("LevelInfoBoard");
            board.getComponent(LevelInfo).Open(event.detail.levelId, event.callBack);
        })
    }

    //显示等待
    public Waitting(_flag:boolean)
    {
        this.waitingPanel.active=_flag;
        this.waitingPanel.setSiblingIndex(999);
    }

    //显示提示信息
    private async ShowTip(_msg:string)
    {
        try
        {
            let tt = await BundleManager.Instance.loadAssetsFromBundle("TextTipPrefabs", "TextTipBar") as Prefab;
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

    //显示弹窗
    private async OpenPopUps(_type:enums.PopUpsType ,_title:string , _subheading:string , _items:Map<string,number> ,  _callBack?:(e?:boolean)=>void)
    {
        console.log("弹窗类型：",_type);
        let board=await this.getBoard("PopUpsBoard");
        board.getComponent(PopUps).title=_title;
        board.getComponent(PopUps).subheading=_subheading;
        board.getComponent(PopUps).Open(_type , _items , _callBack);
    }

    //开始新手引导
    public async StartGuide()
    {
        let gnode=await this.getPanel("GuidePanel");
        gnode.setParent(this.node);
        this.guide=gnode.getComponent(Guide);
        this.guide.Init();
        //this.OnGuideListening();
    }

    //获取文本
    public GetText(key:string):string
    {
        console.log("GetText config.LanguageConfig:", config.LanguageConfig)
        console.log("GetText key:", key);
        let temp=null;
        switch(User.OptionsData.language)
        {
            case enums.Language.Chinese:
                temp = config.LanguageConfig.get(key).chinese;
                break;
            default:
                temp = config.LanguageConfig.get(key).chinese;
                break;
        }
        if(temp)
        {
            return temp;
        }
        return "null";
    }

    private second = 0;
    /**
     * 引导界面侦听
     */
    private OnGuideListening()
    {
        this.listening = setInterval(() =>
        {
            if (GameManager.Instance.guide && GameManager.Instance.guide.step!=common.GuideStep.Done)
            {
                this.second += 100;
                if (singleton.netSingleton.mainInterface?.activity && this.second >= 10000)
                {
                    //GameManager.Instance.guide.CheckGuide();
                    if((common.GuideStep.ClickGameLobby == GameManager.Instance.guide.next) && (common.GuideStep.ClickGameLobby!=GameManager.Instance.guide.step))
                    {
                        this.second = 0;
                        GameManager.Instance.guide.OnGuide(common.GuideStep.ClickGameLobby);
                    }
                }
                if (this.node.getChildByPath("MainInterface/StartGamePanel")?.active && this.second >= 10000)
                {
                    //GameManager.Instance.guide.CheckGuide();
                    if((common.GuideStep.ClickMatch == GameManager.Instance.guide.next) && (common.GuideStep.ClickMatch!=GameManager.Instance.guide.step))
                    {
                        console.log("StartGamePanel is active");
                        this.second = 0;
                        GameManager.Instance.guide.OnGuide(common.GuideStep.ClickMatch);
                    }
                }
                if(singleton.netSingleton.ready?.activity && this.second>=10000)
                {
                    //GameManager.Instance.guide.CheckGuide();
                    if((common.GuideStep.BuyRole == GameManager.Instance.guide.next) && (common.GuideStep.BuyRole!=GameManager.Instance.guide.step))
                    {
                        this.second = 0;
                        GameManager.Instance.guide.OnGuide(common.GuideStep.BuyRole);
                        
                    }
                }
                if(singleton.netSingleton.ready?.activity && singleton.netSingleton.ready?.roleArea.GetRolesNumber()>0 && this.second>=10000)
                {
                    //GameManager.Instance.guide.CheckGuide();
                    if((common.GuideStep.CoinInfo == GameManager.Instance.guide.next) && (common.GuideStep.CoinInfo!=GameManager.Instance.guide.step))
                    {
                        this.second = 0;
                        GameManager.Instance.guide.OnGuide(common.GuideStep.CoinInfo);
                    }
                    if((common.GuideStep.RoleInfo == GameManager.Instance.guide.next) && (common.GuideStep.RoleInfo!=GameManager.Instance.guide.step))
                    {
                        this.second = 0;
                        GameManager.Instance.guide.OnGuide(common.GuideStep.RoleInfo);
                    }
                }
            }
            else
            {
                clearInterval(this.listening);
            }
            if(this.second>10000)
            {
                this.second=0;
            }
        }, 100);
    }


}


