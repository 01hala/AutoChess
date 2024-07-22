import { _decorator, Component, EventTouch, Input, input, Node, UITransform, Vec2, view } from 'cc';
import * as enums from '../other/enums';
const { ccclass, property } = _decorator;

@ccclass('InterfaceDrag')
export class InterfaceDrag extends Component 
{
    private touchStartPoint:Vec2=new Vec2(0,0);

    private touchStartPointforUI:Vec2;
    private touchBeforPoiintforUI:Vec2;

    private winWidth:number;
    private imgWidth:number;

    start() 
    {
        this.winWidth=view.getVisibleSize().width;
        this.imgWidth=this.node.getComponent(UITransform).contentSize.x;
        this.DragEvent();
    }

    update(deltaTime: number) 
    {
        
    }

    private DragEvent()
    {
        this.node.on(Input.EventType.TOUCH_START,(event: EventTouch)=>
        {
            //console.log("touch ON");

            let node: Node = event.currentTarget;

            this.touchStartPoint.set(event.getUILocation());
            this.touchStartPointforUI=this.touchStartPoint;
            this.touchBeforPoiintforUI=this.touchStartPoint;

            let x = this.touchStartPoint.x - this.winWidth / 2 - node.getPosition().x;

            console.log(x);
            this.touchStartPoint = new Vec2(x, 0);
        });

        this.node.on(Input.EventType.TOUCH_MOVE,(event: EventTouch)=>
        {
            //console.log("touching");

            let node: Node = event.currentTarget;
            let pos = new Vec2();
            let shift = pos.set(event.getUILocation());
            let x = shift.x - this.winWidth / 2 - this.touchStartPoint.x;

            let dir= this.touchBeforPoiintforUI.x-shift.x;
            console.log(dir);

            let boundary=this.imgWidth/2-this.winWidth/2;

            if((node.position.x-dir < boundary || dir > 0) && (node.position.x-dir > -boundary || dir < 0))
            {
                node.setPosition(node.position.x-dir, 0, 0);
            }
            //node.setPosition(x, 0, 0);
            this.touchBeforPoiintforUI=shift;
        });
        
        this.node.on(Input.EventType.TOUCH_END,()=>
        {
            console.log("touch end");
        });
    }
}


