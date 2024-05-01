/*
 * 新建
 * Settlement.ts 回合结算界面
 * author: hotaru
 * 2024/03/30
 */
import { _decorator, Animation, BlockInputEvents, Button, Component, Node, RichText, Sprite, spriteAssembler, SpriteFrame, Toggle } from 'cc';
import { BattleVictory } from '../serverSDK/common';
import { netSingleton } from '../netDriver/netSingleton';
import { AudioManager } from '../other/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('Settlement')
export class Settlement extends Component 
{
    @property(SpriteFrame)
    public winImg:SpriteFrame;
    @property(SpriteFrame)
    public loseImg:SpriteFrame;
    @property(SpriteFrame)
    public drawImg:SpriteFrame;
    @property(SpriteFrame)
    public winBanners:SpriteFrame;
    @property(SpriteFrame)
    public loseBanners:SpriteFrame;
    @property(SpriteFrame)
    public drwaBanners:SpriteFrame;
    @property(SpriteFrame)
    public winRing:SpriteFrame;
    @property(SpriteFrame)
    public loseRing:SpriteFrame;
    @property(SpriteFrame)
    public drawRing:SpriteFrame;

    //退出按钮
    private exitBtn:Button;
    //显示区域
    private midArea:Node;
    //生命
    private hpGroup:Node;
    //奖杯数
    private cupNum:Node;
    //胜负图标
    private outCome:Node;
    //胜负横幅
    private banners:Node;

    private addTimeBoard:Node;

    private isVictory:BattleVictory;
    private isAddTime:boolean;

    protected onLoad(): void 
    {
        this.exitBtn=this.node.getChildByPath("BG").getComponent(Button);
        this.midArea=this.node.getChildByPath("MidArea");
        this.hpGroup=this.node.getChildByPath("MidArea/Hp");
        this.cupNum=this.node.getChildByPath("MidArea/CupNum");
        this.outCome=this.node.getChildByPath("MidArea/Outcome");
        this.banners=this.node.getChildByPath("MidArea/Banners");
        this.addTimeBoard=this.node.getChildByPath("AddTime");
        this.Init();
    }

    start() 
    {
        this.exitBtn.node.on(Button.EventType.CLICK,()=>
        {
            console.log("exitboard!");
            this.Exit();
        });
        this.addTimeBoard.active=false;
    }
    
    private Init()
    {
        for(let t of this.hpGroup.children)
        {
            t.getComponent(Toggle).isChecked=false;
        }
    }

    public OpenSettlementBoard(_isVictory:BattleVictory,_hpNum:number,_isAddTime:boolean=false)
    {
        console.log("show settlement");
        this.node.getComponent(BlockInputEvents).enabled=true;
        this.node.setSiblingIndex(100);
        this.isVictory=_isVictory;
        this.isAddTime=_isAddTime;
        this.midArea.active=true;
        console.log(_hpNum);
        for(let i=0;i<_hpNum;i++)
        {
            this.hpGroup.children[i].getComponent(Toggle).isChecked=true;
        }
        this.midArea.getComponent(Animation).play("PanelAppear");
        switch(_isVictory)
        {
            case BattleVictory.faild:
                AudioManager.Instance.PlayerOnShot("Sound/battle_failed_01");
                this.banners.getChildByPath("RichText").getComponent(RichText).string="<color=#ffffff><outline color=#245998 width=20>失<size=30></size>败</color>";
                this.banners.getComponent(Sprite).spriteFrame=this.loseBanners;
                this.outCome.getChildByPath("Sprite").getComponent(Sprite).spriteFrame=this.loseImg;
                this.outCome.getChildByPath("Ring").getComponent(Sprite).spriteFrame=this.loseRing;
                break;
            case BattleVictory.tie:
                AudioManager.Instance.PlayerOnShot("Sound/battle_failed_01");
                this.banners.getChildByPath("RichText").getComponent(RichText).string="<color=#ffffff><outline color=#2b7c41 width=20>平<size=30></size>局</color>";
                this.banners.getComponent(Sprite).spriteFrame=this.drwaBanners;
                this.outCome.getChildByPath("Sprite").getComponent(Sprite).spriteFrame=this.drawImg;
                this.outCome.getChildByPath("Ring").getComponent(Sprite).spriteFrame=this.drawRing;
                break;
            case BattleVictory.victory:
                AudioManager.Instance.PlayerOnShot("Sound/battle_win_01");
                this.banners.getChildByPath("RichText").getComponent(RichText).string="<color=#ffffff><outline color=#f4b428 width=20>胜<size=30></size>利</color>";
                this.banners.getComponent(Sprite).spriteFrame=this.winBanners;
                this.outCome.getChildByPath("Sprite").getComponent(Sprite).spriteFrame=this.winImg;
                this.outCome.getChildByPath("Ring").getComponent(Sprite).spriteFrame=this.winRing;
                break;
        }
        this.midArea.getComponent(Animation).on(Animation.EventType.FINISHED,()=>
        {
            if(_isAddTime)
            {
                this.ShowAddTimeBoard();
            }
        });
    }

    private boardLock=false;
    private ShowAddTimeBoard()
    {
        if(!this.boardLock)
        {
            this.boardLock=true;
            this.addTimeBoard.active=true;
            
            this.addTimeBoard.getChildByPath("Board/Confirm_Btn").on(Button.EventType.CLICK,()=>
            {
                this.node.active=false;
                netSingleton.game.start_peak_strength();
            },this);
            this.addTimeBoard.getChildByPath("Board/Refuse_Btn").on(Button.EventType.CLICK,()=>
            {
                this.addTimeBoard.getChildByPath("Board").getComponent(Animation).play("PanelMid2Bottom");
            },this);

            this.addTimeBoard.getChildByPath("Board").getComponent(Animation).play("PanelTop2Mid");
        }
        else
        {
            return;
        }
    }

    public Exit()
    {
        this.node.getComponent(BlockInputEvents).enabled=false;
        this.midArea.getComponent(Animation).on(Animation.EventType.FINISHED,()=>
        {
            this.node.active=false;
            this.midArea.getComponent(Animation).off(Animation.EventType.FINISHED);
            if(this.isAddTime)
            {
                netSingleton.game.start_peak_strength();
            }
            else
            {
                //返回准备界面代码写这
                netSingleton.game.confirm_round_victory(this.isVictory);
            }
            
        });
        this.midArea.getComponent(Animation).play("PanelDisappear");
        for(let t of this.hpGroup.children)
        {
            t.getComponent(Toggle).isChecked=false;
        }
    }

}


