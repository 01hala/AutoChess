import { _decorator, Animation, animation, Asset, Component, instantiate, Node, TTFFont, Prefab, resources, RichText, primitives } from 'cc';
import { BundleManager } from '../bundle/BundleManager';
import { InfoPanel } from '../secondaryPanel/InfoPanel';
import { SendMessage } from './MessageEvent';
import { Settlement } from '../secondaryPanel/Settlement';
const { ccclass, property } = _decorator;

@ccclass('TipsManager')
export class GameManager extends Component 
{
    private static _instance:GameManager=null;

    public static get Instance()
    {
        return this._instance;
    }

    @property(Prefab)
    private textTipNodePre:Prefab;
    private typeface: TTFFont;

    @property(Prefab)
    private infoPanelpre:Prefab;
    private infoPanel:Node;

    private settlementBoardPre:Prefab;
    private settlementBoard:Node;

    protected onLoad()
    {
        GameManager._instance=this.node.getComponent(GameManager);
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
            console.error("TipsManager 下的 start 错误 error: ",error);
        }
    }

    private async Init()
    {
        let tt = BundleManager.Instance.loadAssetsFromBundle("TextTipBar", "TextTipBar");
        let tf = BundleManager.Instance.loadAssetsFromBundle("Typeface", "MAOKENASSORTEDSANS");
        let ip = BundleManager.Instance.loadAssetsFromBundle("Board","Information");
        let sl = BundleManager.Instance.loadAssetsFromBundle("Board","SettlementBoard");

        let awaitResult = await Promise.all([tt,tf,ip,sl]);
        this.textTipNodePre = awaitResult[0] as Prefab;
        this.typeface = awaitResult[1] as TTFFont;
        this.infoPanelpre = awaitResult[2] as Prefab;
        this.settlementBoardPre=awaitResult[3] as Prefab;

        this.infoPanel=instantiate(this.infoPanelpre);
        this.infoPanel.setParent(this.node);
        this.infoPanel.active=false;

        this.settlementBoard=instantiate(this.settlementBoardPre);
        this.settlementBoard.setParent(this.node);
        this.settlementBoard.active=false;
    }

    private InitEvent()
    {
        this.node.on('OpenCardInfo',(event:SendMessage)=>
        {
            event.propagationStopped=true;
            this.infoPanel.active=true;
            this.infoPanel.getComponent(InfoPanel).OpenCardInfo(event.detail);
        },this);

        this.node.on('OpenInfoBoard',(event:SendMessage)=>
        {
            event.propagationStopped=true;
            this.infoPanel.active=true;
            this.infoPanel.getComponent(InfoPanel).OpenInfoBoard(event.detail.id , event.detail.role , event.detail.isBuy , event.detail.propType);
        });

        this.node.on('ShowTip',(event:SendMessage)=>
        {
            event.propagationStopped=true;
            this.ShowTip(event.detail);
        });

        this.node.on('OpenSettlement',(event:SendMessage)=>
        {
            event.propagationStopped=true;
            this.settlementBoard.active=true;
            this.settlementBoard.getComponent(Settlement).OpenSettlementBoard(event.detail.outcome , event.detail.hpNum);
        })
    }

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
            console.error("TipsManager 下的 ShowTip 错误 error: ",error);
        }
    }
}


