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

export class BulletInfo
{
    public selfpos: Vec3 = null;
    public targetPos: Vec3 = null;
    public isGain: boolean = false;
    public style: number = 0;

    constructor(selfpos: Vec3,targetPos: Vec3,isGain: boolean,style: number=0)
    {
        this.selfpos=selfpos;
        this.targetPos=targetPos;
        this.isGain=isGain;
        this.style=style;
    }
}

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

    public Init(targetPos:Vec3 , _effect:string , isGain:boolean , _style:number):Promise<void>
    {
        return new Promise<void>(async (resolve, reject) =>
        {
            this.skell=this.node.addComponent(sp.Skeleton);
            this.LoadOnConfig(_effect).then(()=>
            {
                console.log("初始化子弹");
                this.targetPos = targetPos;
                this.isInit = true;

                //设置旋转角度
                let dir = new Vec2(targetPos.x - this.node.position.x, targetPos.y - this.node.position.y);
                let angle = dir.signAngle(new Vec2(1, 0)) * 180 / Math.PI;
                this.node.setRotationFromEuler(new Vec3(0, 0, -angle));

                let anims=this.skell.skeletonData.getAnimsEnum();
                if(_style!=0 && isGain)
                {
                    this.skell.setAnimation(0, String(anims[_style]), true);
                }

                this.tAttack = tween(this.node)
                    .to(0.5, { position: targetPos }).call(() => 
                    {
                        console.log("销毁子弹");
                        if (this.skell.skeletonData.name === "Luminous sphere")
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
                    }).call(() =>
                    {
                        resolve();
                    }).start();
            })
            
            
            // this.skell = this.node.getComponent(sp.Skeleton);
            // if (isGain)
            // {
            //     this.skell.enabled = false;
            //     await this.LoadOnConfig();
            // }
            // else
            // {
            //     let anims = this.skell.skeletonData.getAnimsEnum();
            //     this.skell.setAnimation(0, String(anims[1]), true);
            // }
           

            

            console.log("初始化子弹完成");
        });
    }

    private LoadOnConfig(_str:string)
    {
        return new Promise<void>((resolve, reject) =>
        {
            try
            {
                let path="EffectSpine/Projectiles/"+_str;
                loadAssets.LoadSkeletonData(path, (data) =>
                {
                    if (data)
                    {
                        try
                        {
                            this.skell.skeletonData = data;
                            this.skell.enabled = true;
                            let anims = data.getAnimsEnum();
                            this.skell.setAnimation(0, String(anims[1]), true);
                            resolve();
                        }
                        catch (error)
                        {
                            console.warn(`子弹光球效果获取失败：`, error);
                            reject();
                        }
                    }
                });
            }
            catch (error)
            {
                console.error(`Bullet 下的 LoadOnConfig 错误 err:${error}`);
                reject();
            }
        });
    }

    bezierCurve(p0: Vec3, p1: Vec3, p2: Vec3, t: number): Vec3 {
        let x = Math.pow(1 - t, 2) * p0.x + 2 * (1 - t) * t * p1.x + Math.pow(t, 2) * p2.x;
        let y = Math.pow(1 - t, 2) * p0.y + 2 * (1 - t) * t * p1.y + Math.pow(t, 2) * p2.y;
        return new Vec3(x, y, 0);
    }
}


