import { _decorator, Button, Component, Node, Sprite, SpriteFrame } from 'cc';
import * as singleton from '../netDriver/netSingleton';
import { GameDifficulty } from '../other/enums';
import { Image } from 'fairygui-cc';
const { ccclass, property } = _decorator;

@ccclass('StartGamePanel')
export class StartGamePanel extends Component 
{
    //竞技模式
    private athleticsWindow:Node;
    //娱乐模式
    private amusementWindow:Node;
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
                this.ClosePanel();
            },this);
            //难度切换
            this.difficultyBtn.on(Button.EventType.CLICK,()=>
            {
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
            this.amusementWindow.active=false;
            this.athleticsWindow.active=true;
            //排位
            this.athleticsWindow.getChildByPath("Athletics/Athletics_Btn").on(Button.EventType.CLICK,()=>
            {
    
            },this);
            //匹配
            this.athleticsWindow.getChildByPath("Normal/Normal_Btn").on(Button.EventType.CLICK,()=>
            {
                console.log("Normal_Btn start_battle!");
                this.node.parent.active=false;
                singleton.netSingleton.game.start_battle();
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
            this.amusementWindow.getChildByPath("Custom/Custom_Btn").on(Button.EventType.CLICK,()=>
            {
                let custom=this.amusementWindow.getChildByPath("CustomBoard");
                this.ShowCustomBoard(custom);
            },this);
        }
        catch(error)
        {
            console.error('StartGamePanel 下 OpenAmusementWindow 错误 err: ',error);
        }
    }
    //自定义游戏面板
    private ShowCustomBoard(_customBoard:Node)
    {
        try
        {
            _customBoard.active=true;
            //返回
            _customBoard.on(Button.EventType.CLICK,()=>
            {
                _customBoard.getChildByPath("Board/Create_Btn").off(Button.EventType.CLICK);
                _customBoard.getChildByPath("Board/Join_Btn").off(Button.EventType.CLICK);
                _customBoard.active=false;
            },this);
            //创建
            _customBoard.getChildByPath("Board/Create_Btn").on(Button.EventType.CLICK,()=>
            {
                let create=this.amusementWindow.getChildByPath("CreateRoomBoard");
                _customBoard.getChildByPath("Board/Create_Btn").off(Button.EventType.CLICK);
                _customBoard.getChildByPath("Board/Join_Btn").off(Button.EventType.CLICK);
                _customBoard.active=false;
                this.ShowCreateRoomBoard(create);
            },this);
            //加入
            _customBoard.getChildByPath("Board/Join_Btn").on(Button.EventType.CLICK,()=>
            {
                let join=this.amusementWindow.getChildByPath("JoinRoomBoard");
                _customBoard.getChildByPath("Board/Create_Btn").off(Button.EventType.CLICK);
                _customBoard.getChildByPath("Board/Join_Btn").off(Button.EventType.CLICK);
                _customBoard.active=false;
                this.ShowJoinRoomeBoard(join);
            },this);
        }
        catch(error)
        {
            console.error('StartGamePanel 下 OpenCustomBoard 错误 err: ',error);
        }
    }
    //创建房间面板
    private ShowCreateRoomBoard(_createRoomBoard:Node)
    {
        try
        {
            _createRoomBoard.active=true;
            //确认
            _createRoomBoard.getChildByPath("Board/Confirm_Btn").on(Button.EventType.CLICK,()=>
            {
                
            },this);
            //取消
            _createRoomBoard.getChildByPath("Board/Cancel_Btn").on(Button.EventType.CLICK,()=>
            {
                _createRoomBoard.getChildByPath("Board/Cancel_Btn").off(Button.EventType.CLICK);
                _createRoomBoard.getChildByPath("Board/Confirm_Btn").off(Button.EventType.CLICK);
                _createRoomBoard.active=false;
            },this);
        }
        catch(error)
        {
            console.error('StartGamePanel 下 ShowCreateRoomBoard 错误 err: ',error);
        }
    }
    //加入房间面板
    private ShowJoinRoomeBoard(_joinRoomBoard:Node)
    {
        try
        {
            _joinRoomBoard.active=true;
            //确认
            _joinRoomBoard.getChildByPath("Board/Confirm_Btn").on(Button.EventType.CLICK,()=>
            {
    
            },this);
            //取消
            _joinRoomBoard.getChildByPath("Board/Cancel_Btn").on(Button.EventType.CLICK,()=>
            {
                _joinRoomBoard.getChildByPath("Board/Cancel_Btn").off(Button.EventType.CLICK);
                _joinRoomBoard.getChildByPath("Board/Confirm_Btn").off(Button.EventType.CLICK);
                _joinRoomBoard.active=false;
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
            this.athleticsWindow.getChildByPath("Normal/Normal_Btn").off(Button.EventType.CLICK);
            this.node.active=false;
        }
        catch(error)
        {
            console.error('StartGamePanel 下 ClosePanel 错误 err: ',error);
        }
    }
}


