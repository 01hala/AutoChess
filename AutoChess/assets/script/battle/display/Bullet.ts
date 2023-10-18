/*
 * Bullet.ts
 * author: Hotaru
 * 2023/10/11
 * 子弹展示类
 */
/*修改
 * Bullet.ts
 * author: Guanliu
 * 2023/10/18
 * 子弹轨迹改为贝塞尔曲线、计算到目标点位的距离
 */
import { _decorator, BoxCollider, Component, ITriggerEvent, Node, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Bullet')
export class Bullet extends Component {

    private targetPos:Vec3;
    private controlPoint:Vec3;
    private isInit:boolean;
    //子弹距离目标点小于这个距离就销毁
    public destoryLen:number;
    //贝塞尔曲线的参数（0~1）
    public parameter:number;

    start() 
    {       
        this.isInit=false;
        //let collider = this.node.getComponent(BoxCollider);
        //collider.on('onTriggerStay', this.onTriggerStay, this);

        // tween(this.node.position).to(1,this.target.position,{
        //     onUpdate:(target:Vec3,ratio:number)=>{
        //         this.node.position=target;
        //     }
        // }).start(); 
    }

    public Init(targetPos:Vec3){
        this.targetPos=targetPos;
        this.isInit=true;
        //贝塞尔曲线控制点
        this.controlPoint = new Vec3((this.node.getPosition().x + this.targetPos.x) / 2, this.node.getPosition().y + 100, 0);
    }
    // onTriggerStay(event:ITriggerEvent) 
    // {
    //     if(event.otherCollider.node==this.target)
    //     {
    //         this.node.destroy();
    //     }
        
    // }

    update(deltaTime: number) 
    {
        //如果目标点位还没初始化就不执行接下去的操作
        if(!this.isInit) return;

        let len:number = this.targetPos.subtract(this.node.getPosition()).length();
        if(len<this.destoryLen) this.node.destroy();

        if (this.parameter < 1) {
            this.parameter += deltaTime * 0.5; // 调整0.5来改变速度

            let pos = this.bezierCurve(this.node.getPosition(), this.controlPoint, this.targetPos, this.parameter);
            this.node.setPosition(pos);
        }
    }

    bezierCurve(p0: Vec3, p1: Vec3, p2: Vec3, t: number): Vec3 {
        let x = Math.pow(1 - t, 2) * p0.x + 2 * (1 - t) * t * p1.x + Math.pow(t, 2) * p2.x;
        let y = Math.pow(1 - t, 2) * p0.y + 2 * (1 - t) * t * p1.y + Math.pow(t, 2) * p2.y;
        return new Vec3(x, y, 0);
    }
}


