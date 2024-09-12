import { _decorator, Animation, Button, Component, Node } from 'cc';
import * as singleton from '../../netDriver/netSingleton';
import { login } from '../../login/login';
const { ccclass, property } = _decorator;

@ccclass('Pause')
export class Pause extends Component 
{
    private board:Node;

    protected onLoad(): void
    {
        this.board=this.node.getChildByPath("Board");
        this.board.getChildByPath("Exit_Btn").on(Button.EventType.CLICK,()=>
        {
            singleton.netSingleton.ready.father.getComponent(login).BackMainInterface();
        });
        this.board.getChildByPath("Back_Btn").on(Button.EventType.CLICK,()=>
        {
            this.board.getComponent(Animation).on(Animation.EventType.FINISHED, () =>
            {
                this.board.active = false;
                this.node.active = false;
                this.board.getComponent(Animation).off(Animation.EventType.FINISHED);
            })
            this.board.getComponent(Animation).play("PanelMid2Bottom");
        });
    }

    start() 
    {
       this.node.active=false;
       this.board.active=false;
    }

   public Open()
   {    
        this.node.setSiblingIndex(110);
        this.node.active=true;
        this.board.active=true;
        this.board.getComponent(Animation).play("PanelTop2Mid");
   }
}


