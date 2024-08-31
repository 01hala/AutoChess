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
import { _decorator, BoxCollider, Component, ITriggerEvent, math, Node, sp, Tween, tween, Vec2, Vec3 } from 'cc';
import { loadAssets } from '../../bundle/LoadAsset';
const { ccclass, property } = _decorator;

@ccclass('Bullet')
export class Bullet extends Component {

    //private target:Node;
    private targetPos:Vec3;
    private controlPoint:Vec3;
    private isInit:boolean;
    //子弹距离目标点小于这个距离就销毁
    public destoryLen:number;
    //贝塞尔曲线的参数（0~1）
    public parameter:number;

    tAttack: Tween<Node>;

    private skell:sp.Skeleton;

    start() 
    {       
        this.isInit=false; 
    }

    public async Init(targetPos:Vec3 , isGain?:boolean)
    {
        console.log("初始化子弹");
        this.targetPos=targetPos;
        this.isInit=true;
        this.skell=this.node.getComponent(sp.Skeleton);
        if(isGain)
        {
            this.skell.enabled=false;
            await this.LoadOnConfig();
        }

        let anims = this.skell.skeletonData.getAnimsEnum();
        this.skell.setAnimation(0, String(anims[1]), true);
        //设置旋转角度
        let dir = new Vec2(targetPos.x -this.node.position.x , targetPos.y - this.node.position.y);
        let angle = dir.signAngle(new Vec2(1,0))*180/Math.PI;
        this.node.setRotationFromEuler(new Vec3(0,0,-angle));
        
        this.tAttack = tween(this.node)
            .to(0.7, { position: targetPos }).call(() => 
            { 
                console.log("销毁子弹");
                if(isGain)
                {
                    this.skell.setAnimation(0, String(anims[2]), true);
                    this.skell.setCompleteListener((trackEntry) =>
                    {
                        this.node.destroy();
                    });
                }
                else
                {
                    this.node.destroy();
                }
                
            }).start();

        console.log("初始化子弹完成");
    }

    private async LoadOnConfig()
    {
        try
        {
            
            await loadAssets.LoadSkeletonData("EffectSpine/gq/Luminous sphere",(data)=>
            {
                if (data)
                {
                    try
                    {
                        this.skell.skeletonData = data;
                        this.skell.enabled=true;
                    }
                    catch (error)
                    {
                        console.warn(`子弹光球效果获取失败：`, error);
                    }
                }
            });
        }
        catch(error)
        {
            console.error(`Bullet 下的 LoadOnConfig 错误 err:${error}`);
        }
    }

    bezierCurve(p0: Vec3, p1: Vec3, p2: Vec3, t: number): Vec3 {
        let x = Math.pow(1 - t, 2) * p0.x + 2 * (1 - t) * t * p1.x + Math.pow(t, 2) * p2.x;
        let y = Math.pow(1 - t, 2) * p0.y + 2 * (1 - t) * t * p1.y + Math.pow(t, 2) * p2.y;
        return new Vec3(x, y, 0);
    }
}


