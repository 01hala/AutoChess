import { _decorator, animation, Animation, Button, Component, Node, Sprite, SpriteFrame } from 'cc';
import * as singleton from '../netDriver/netSingleton';
import { GameDifficulty } from '../other/enums';
import { AudioManager } from '../other/AudioManager';
import { GameManager } from '../other/GameManager';
import { BattleMod } from '../battle/AutoChessBattle/common';
const { ccclass, property } = _decorator;

@ccclass('StartGame')
export class StartGame extends Component 
{
    //竞技模式
    private athleticsWindow:Node;
    //娱乐模式
    private amusementWindow:Node;
    private customBoard:Node;
    private createRoomBoard:Node;
    private joinRoomBoard:Node
    //娱乐模式游戏难度
    private difficulty:GameDifficulty=GameDifficulty.Simple;

    private difficultyBtn:Node;

    @property([SpriteFrame])
    public difficultySprite:SpriteFrame[]=[];

    protected onLoad(): void 
    {
        try
        {
            this.athleticsWindow=this.node.getChildByPath("AthleticsWindow");
            this.amusementWindow=this.node.getChildByPath("AmusementWindow");
            this.difficultyBtn=this.amusementWindow.getChildByPath("Difficulty_Btn");

            this.customBoard=this.amusementWindow.getChildByPath("CustomBoard");
            this.createRoomBoard=this.amusementWindow.getChildByPath("CreateRoomBoard");
            this.joinRoomBoard=this.amusementWindow.getChildByPath("JoinRoomBoard");;

            this.customBoard.active=false;
            this.createRoomBoard.active=false;
            this.joinRoomBoard.active=false;

        }
        catch(error)
        {
            console.error('StartGamePanel 下 onLoad 错误 err: ',error);
        }
    }

    start() 
    {
        try
        {
            //返回主界面
            this.node.getChildByPath("BG").on(Button.EventType.CLICK,()=>
            {
                AudioManager.Instance.PlayerOnShot("Sound/sound_home_return_feedback_01");
                this.ClosePanel();
            },this);
            //难度切换
            this.difficultyBtn.on(Button.EventType.CLICK,()=>
            {
                AudioManager.Instance.PlayerOnShot("Sound/sound_click_01");
                switch(this.difficulty)
                {
                    case GameDifficulty.Simple:
                        this.difficulty=GameDifficulty.Ordinary;
                        this.difficultyBtn.getComponent(Sprite).spriteFrame=this.difficultySprite[GameDifficulty.Ordinary-1];
                        break;
                    case GameDifficulty.Ordinary:
                        this.difficulty=GameDifficulty.Hard;
                        this.difficultyBtn.getComponent(Sprite).spriteFrame=this.difficultySprite[GameDifficulty.Hard-1];
                        break;
                    case GameDifficulty.Hard:
                        this.difficulty=GameDifficulty.Simple;
                        this.difficultyBtn.getComponent(Sprite).spriteFrame=this.difficultySprite[GameDifficulty.Simple-1];
                        break;
                }
            },this);

        }
        catch(error)
        {
            console.error('StartGamePanel 下 start 错误 err: ',error);
        }
    }
    //竞技模式窗口
    public OpenAthleticsWindow()
    {
        try
        {
            if(GameManager.Instance.guide)
            {
                this.athleticsWindow.getComponent(Animation).on(Animation.EventType.FINISHED,()=>
                {
                    GameManager.Instance.guide.step++;
                });
            }
            this.amusementWindow.active=false;
            this.athleticsWindow.active=true;
            this.athleticsWindow.getComponent(Animation).play("PanelAppear");
            //排位
            this.athleticsWindow.getChildByPath("Athletics/Athletics_Btn").on(Button.EventType.CLICK,()=>
            {
                AudioManager.Instance.PlayerOnShot("Sound/sound_click_wooden_01");
                singleton.netSingleton.game.start_battle(BattleMod.RankBattle);
            },this);
            //匹配
            this.athleticsWindow.getChildByPath("Normal/Button").on(Button.EventType.CLICK, async ()=>
            {
                if (GameManager.Instance.guide)
                {
                    //GameManager.Instance.guide.Checkguide();
                }
                AudioManager.Instance.PlayerOnShot("Sound/sound_click_wooden_01");
                console.log("Normal_Btn start_battle!");
                singleton.netSingleton.game.start_battle(BattleMod.Battle);
                //this.node.parent.active=false;
            },this);
        }
        catch(error)
        {
            console.error('StartGamePanel 下 OpenAthleticsWindow 错误 err: ',error);
        }
    }
    //娱乐模式窗口
    public OpenAmusementWindow()
    {
        try
        {
            this.athleticsWindow.active=false;
            this.amusementWindow.active=true;
            this.amusementWindow.getComponent(Animation).play("PanelAppear");
            this.amusementWindow.getChildByPath("Custom/Custom_Btn").on(Button.EventType.CLICK,()=>
            {
                AudioManager.Instance.PlayerOnShot("Sound/sound_click_wooden_01");
                this.ShowCustomBoard();
            },this);
        }
        catch(error)
        {
            console.error('StartGamePanel 下 OpenAmusementWindow 错误 err: ',error);
        }
    }
    //自定义游戏面板
    private ShowCustomBoard()
    {
        try
        {
            this.customBoard.active=true;
            this.customBoard.getChildByPath("Board").getComponent(Animation).play("PanelTop2Mid");
            //返回
            //待修复BUG：每次点击会多次调用下方逻辑，暂未找到原因
            this.customBoard.on(Button.EventType.CLICK,()=>
            {
                AudioManager.Instance.PlayerOnShot("Sound/sound_home_return_feedback_01");
                this.customBoard.getChildByPath("Board/Create_Btn").off(Button.EventType.CLICK);
                this.customBoard.getChildByPath("Board/Join_Btn").off(Button.EventType.CLICK);
                this.customBoard.getChildByPath("Board").getComponent(Animation).on(Animation.EventType.FINISHED,()=>
                {
                    this.customBoard.active=false;
                    this.customBoard.getChildByPath("Board").getComponent(Animation).off(Animation.EventType.FINISHED);
                });
                this.customBoard.getChildByPath("Board").getComponent(Animation).play("PanelMid2Bottom");
                
            },this);
            //创建
            this.customBoard.getChildByPath("Board/Create_Btn").on(Button.EventType.CLICK,()=>
            {
                AudioManager.Instance.PlayerOnShot("Sound/sound_click_01");
                this.customBoard.getChildByPath("Board/Create_Btn").off(Button.EventType.CLICK);
                this.customBoard.getChildByPath("Board/Join_Btn").off(Button.EventType.CLICK);

                this.customBoard.getChildByPath("Board").getComponent(Animation).on(Animation.EventType.FINISHED,()=>
                {
                    this.customBoard.active=false;
                    this.ShowCreateRoomBoard();
                    this.customBoard.getChildByPath("Board").getComponent(Animation).off(Animation.EventType.FINISHED);
                });
                this.customBoard.getChildByPath("Board").getComponent(Animation).play("PanelMid2Bottom");
                
            },this);
            //加入
            this.customBoard.getChildByPath("Board/Join_Btn").on(Button.EventType.CLICK,()=>
            {
                AudioManager.Instance.PlayerOnShot("Sound/sound_click_01");
                this.customBoard.getChildByPath("Board/Create_Btn").off(Button.EventType.CLICK);
                this.customBoard.getChildByPath("Board/Join_Btn").off(Button.EventType.CLICK);

                this.customBoard.getChildByPath("Board").getComponent(Animation).on(Animation.EventType.FINISHED,()=>
                {
                    this.customBoard.active=false;
                    this.ShowJoinRoomeBoard();
                    this.customBoard.getChildByPath("Board").getComponent(Animation).off(Animation.EventType.FINISHED);
                });
                this.customBoard.getChildByPath("Board").getComponent(Animation).play("PanelMid2Bottom");
            },this);
        }
        catch(error)
        {
            console.error('StartGamePanel 下 OpenCustomBoard 错误 err: ',error);
        }
    }
    //创建房间面板
    private ShowCreateRoomBoard()
    {
        try
        {
            this.createRoomBoard.active=true;
            this.createRoomBoard.getChildByPath("Board").getComponent(Animation).play("PanelTop2Mid");
            //确认
            this.createRoomBoard.getChildByPath("Board/Confirm_Btn").on(Button.EventType.CLICK,()=>
            {
                AudioManager.Instance.PlayerOnShot("Sound/sound_click_01");
            },this);
            //取消
            this.createRoomBoard.getChildByPath("Board/Cancel_Btn").on(Button.EventType.CLICK,()=>
            {
                AudioManager.Instance.PlayerOnShot("Sound/sound_click_01");
                this.createRoomBoard.getChildByPath("Board/Cancel_Btn").off(Button.EventType.CLICK);
                this.createRoomBoard.getChildByPath("Board/Confirm_Btn").off(Button.EventType.CLICK);
                this.createRoomBoard.getChildByPath("Board").getComponent(Animation).play("PanelMid2Bottom");
                this.createRoomBoard.getChildByPath("Board").getComponent(Animation).on(Animation.EventType.FINISHED,()=>
                {
                    this.createRoomBoard.active=false;
                    this.createRoomBoard.getChildByPath("Board").getComponent(Animation).off(Animation.EventType.FINISHED);
                });

                
            },this);
        }
        catch(error)
        {
            console.error('StartGamePanel 下 ShowCreateRoomBoard 错误 err: ',error);
        }
    }
    //加入房间面板
    private ShowJoinRoomeBoard()
    {
        try
        {
            this.joinRoomBoard.active=true;
            this.joinRoomBoard.getChildByPath("Board").getComponent(Animation).play("PanelTop2Mid");
            //确认
            this.joinRoomBoard.getChildByPath("Board/Confirm_Btn").on(Button.EventType.CLICK,()=>
            {
                AudioManager.Instance.PlayerOnShot("Sound/sound_click_01");
            },this);
            //取消
            this.joinRoomBoard.getChildByPath("Board/Cancel_Btn").on(Button.EventType.CLICK,()=>
            {
                AudioManager.Instance.PlayerOnShot("Sound/sound_click_01");
                this.joinRoomBoard.getChildByPath("Board/Cancel_Btn").off(Button.EventType.CLICK);
                this.joinRoomBoard.getChildByPath("Board/Confirm_Btn").off(Button.EventType.CLICK);
                this.joinRoomBoard.getChildByPath("Board").getComponent(Animation).play("PanelMid2Bottom");
                this.joinRoomBoard.getChildByPath("Board").getComponent(Animation).on(Animation.EventType.FINISHED,()=>
                {
                    this.joinRoomBoard.active=false;
                    this.joinRoomBoard.getChildByPath("Board").getComponent(Animation).off(Animation.EventType.FINISHED);
                });
                
            },this);
        }
        catch(error)
        {
            console.error('StartGamePanel 下 ShowJoinRoomeBoard 错误 err: ',error);
        }
    }

    OpenRoomWindow()
    {
        try
        {

        }
        catch(error)
        {

        }
    }

    private ClosePanel()
    {
        try
        {
            this.athleticsWindow.getChildByPath("Athletics/Athletics_Btn").off(Button.EventType.CLICK);
            this.athleticsWindow.getChildByPath("Normal/Button").off(Button.EventType.CLICK);
            if(this.athleticsWindow.active)
            {
                this.athleticsWindow.getComponent(Animation).on(Animation.EventType.FINISHED,()=>
                {
                    this.node.active=false;
                    this.athleticsWindow.getComponent(Animation).off(Animation.EventType.FINISHED);
                });
                this.athleticsWindow.getComponent(Animation).play("PanelDisappear");
            }
            if(this.amusementWindow.active)
            {
                this.amusementWindow.getComponent(Animation).on(Animation.EventType.FINISHED,()=>
                {
                    this.node.active=false;
                    this.amusementWindow.getComponent(Animation).off(Animation.EventType.FINISHED);
                });
                this.amusementWindow.getComponent(Animation).play("PanelDisappear");
            }
        }
        catch(error)
        {
            console.error('StartGamePanel 下 ClosePanel 错误 err: ',error);
        }
    }
}


