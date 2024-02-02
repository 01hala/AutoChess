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
    //竞技
    OpenAthleticsWindow()
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
                this.node.parent.active=false;
                singleton.netSingleton.game.start_battle();
            },this);
        }
        catch(error)
        {
            console.error('StartGamePanel 下 OpenAthleticsWindow 错误 err: ',error);
        }
    }
    //娱乐
    OpenAmusementWindow()
    {
        try
        {
            this.athleticsWindow.active=false;
            this.amusementWindow.active=true;
        }
        catch(error)
        {
            console.error('StartGamePanel 下 OpenAmusementWindow 错误 err: ',error);
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


