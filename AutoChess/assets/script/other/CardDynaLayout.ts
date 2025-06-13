import { _decorator, Component, Node, sp, Tween, tween, UITransform, Vec3 } from 'cc';
import { RoleIcon } from '../ready/display/RoleIcon';
import { PropIcon } from '../ready/display/PropIcon';
const { ccclass, property } = _decorator;

export class CardDynaLayout
{
    /** 原点坐标 */
    public originPos: Vec3 = new Vec3(0, 0, 0);
    /** 物体间距 */
    public spacingX = 200;
    public spacingY = 130;
    //物体数组
    public cards: Node[] = [];

    private node:Node=null;

    constructor(originPos: Vec3 , node:Node)
    {
        this.originPos = originPos;
        this.node=node;
    }

    public AddCard(card: Node)
    {
        this.cards.push(card);
        this.Updata();
    }

    public removeCard(card: Node)
    {
        for (let i = 0; i < this.cards.length; i++)
        {
            if (this.cards[i] == card)
            {
                this.cards.splice(i, 1);
                break;
            }
        }
        this.Updata();
    }

    public ResetSindex()
    {
        for(let i=0;i<this.cards.length;i++)
        {
            if (this.cards[i].getComponent(RoleIcon))
            {
                this.cards[i].setSiblingIndex(this.cards[i].getComponent(RoleIcon).originSiblingIndex);
            }
            if (this.cards[i].getComponent(PropIcon))
            {
                this.cards[i].setSiblingIndex(this.cards[i].getComponent(PropIcon).originSiblingIndex);
            }
        }
    }

    private Updata()
    {
        
        //数量小于6的情况
        

        let tCards = this.cards.slice(0, 6);

        let offset=0;

        if(this.cards.length>6)
        {
            offset=this.spacingY;
        }

        this.ComputePos(tCards,offset);

        if(this.cards.length>6)
        {
            tCards = this.cards.slice(6, this.cards.length);
            this.ComputePos(tCards,-offset);
        }
    }

    private Refresh()
    {
        let tweens:Tween[]=[];
        for(let t of this.cards)
        {
            let tw=new Tween(t).to(0.2,{worldPosition:this.originPos}).start();
        }

    }

    private ComputePos(tCards: Node[], offset:number)
    {
        let px = this.spacingX;
        let tPos = this.originPos;
        let tweens:Tween[]=[];

        if (tCards.length == 1)
        {
            //tCards[0].setWorldPosition(new Vec3(this.originPos.x, this.originPos.y - this.spacingY));
            let pos = new Vec3(new Vec3(this.originPos.x, this.originPos.y +offset));
            this.ResetCardOriginPos(tCards[0],pos);
            let tw = new Tween(tCards[0]).to(0.2, { worldPosition: pos });
            tweens.push(tw);
        }

        for (let i = 0; i < tCards.length; i++)
        {
            px -= px / 10;
        }
        //数组长度是偶数是偶数
        if (tCards.length > 1 && tCards.length % 2 == 0)
        {
            let pos = null;
            //左半部分
            for (let i = tCards.length / 2; i < tCards.length; i++)
            {
                if (i == tCards.length / 2)
                {
                    //第一张中间靠右所以要除以2
                    //tCards[i].setWorldPosition(new Vec3(tPos.x + px / 2, this.originPos.y, 0));
                    //添加缓动
                    pos = new Vec3(tPos.x + px / 2, this.originPos.y+offset, 0);
                    this.ResetCardOriginPos(tCards[i],pos);
                    let tw = new Tween(tCards[i]).to(0.2, { worldPosition: pos });
                    tweens.push(tw);
                }
                else
                {
                    //tCards[i].setWorldPosition(new Vec3(tPos.x + px, this.originPos.y, 0));
                    pos = new Vec3(tPos.x + px, this.originPos.y+offset, 0);
                    this.ResetCardOriginPos(tCards[i],pos);
                    let tw = new Tween(tCards[i]).to(0.2, { worldPosition: pos });
                    tweens.push(tw);
                }
                //记录当前卡牌位置
                tPos = pos;
            }
            tPos = this.originPos;
            //右半部分
            for (let i = tCards.length / 2 - 1; i >= 0; i--)
            {
                if (i == tCards.length / 2 - 1)
                {
                    //同上
                    //tCards[i].setWorldPosition(new Vec3(tPos.x - px / 2, this.originPos.y, 0));
                    pos = new Vec3(tPos.x - px / 2, this.originPos.y+offset, 0);
                    this.ResetCardOriginPos(tCards[i],pos);
                    let tw = new Tween(tCards[i]).to(0.2, { worldPosition: pos });
                    tweens.push(tw);
                }
                else
                {
                    //tCards[i].setWorldPosition(new Vec3(tPos.x - px, this.originPos.y, 0));
                    pos = new Vec3(tPos.x - px, this.originPos.y+offset, 0);
                    this.ResetCardOriginPos(tCards[i],pos);
                    let tw = new Tween(tCards[i]).to(0.2, { worldPosition: pos });
                    tweens.push(tw);
                }
                tPos = pos;
            }
        }
        tPos = this.originPos;
        //数组长度是奇数
        if (tCards.length > 1 && tCards.length % 2 != 0)
        {
            let pos = new Vec3(this.originPos.x,this.originPos.y+offset,0);
            //tCards[Math.floor(tCards.length / 2)].setWorldPosition(this.originPos);
            this.ResetCardOriginPos(tCards[Math.floor(tCards.length / 2)],pos);
            let tw = new Tween(tCards[Math.floor(tCards.length / 2)]).to(0.2, { worldPosition: pos });
            tweens.push(tw);
            //左半部分
            for (let i = Math.floor(tCards.length / 2) + 1; i < tCards.length; i++)
            {
                //tCards[i].setWorldPosition(new Vec3(tPos.x + px, this.originPos.y, 0));
                pos = new Vec3(tPos.x + px, this.originPos.y+offset, 0);
                this.ResetCardOriginPos(tCards[i],pos);
                let tw = new Tween(tCards[i]).to(0.2, { worldPosition: pos });
                tweens.push(tw);
                tPos = pos;
            }
            tPos = this.originPos;
            //右半部分
            for (let i = Math.floor(tCards.length / 2) - 1; i >= 0; i--)
            {
                //tCards[i].setWorldPosition(new Vec3(tPos.x - px, this.originPos.y, 0));
                pos = new Vec3(tPos.x - px, this.originPos.y+offset, 0);
                this.ResetCardOriginPos(tCards[i],pos);
                let tw = new Tween(tCards[i]).to(0.2, { worldPosition: pos });
                tweens.push(tw);
                tPos = pos;
            }
        }
        tweens.forEach((t, index) =>
        {
            t.start().call(() =>
            {
                tweens.splice(index, 1);
                t = null;
            });
        });
    }

    private ResetCardOriginPos(card:Node,pos:Vec3)
    {
        //spos=this.node.getComponent(UITransform).convertToWorldSpaceAR(pos);
        console.log("坐标:",pos);
        if (card.getComponent(RoleIcon))
        {
            card.getComponent(RoleIcon).originalPos = pos;
        }
        if (card.getComponent(PropIcon))
        {
            card.getComponent(PropIcon).originalPos = pos;
        }
    }
}

//示例留存代码

// if (this.cards.length == 1)
        // {
        //     //this.cards[0].setWorldPosition(this.originPos);
        //     //添加缓动
        //     new Tween(this.cards[0]).to(0.2, { worldPosition: this.originPos }).start();
        // }
        //let px = this.spacingX;
        //let tPos = this.originPos;
        // for (let i = 0; i < tCards.length; i++)
        // {
        //     px -= px / 10;
        // }
        // //数组长度是偶数是偶数
        // if (tCards.length > 1 && tCards.length % 2 == 0)
        // {
        //     let pos = null;
        //     //左半部分
        //     for (let i = tCards.length / 2; i < tCards.length; i++)
        //     {
        //         if (i == tCards.length / 2)
        //         {
        //             //第一张中间靠右所以要除以2
        //             //tCards[i].setWorldPosition(new Vec3(tPos.x + px / 2, this.originPos.y, 0));
        //             //添加缓动
        //             pos = new Vec3(tPos.x + px / 2, this.originPos.y, 0);
        //             let tw = new Tween(tCards[i]).to(0.2, { worldPosition: pos });
        //             tweens.push(tw);
        //         }
        //         else
        //         {
        //             //tCards[i].setWorldPosition(new Vec3(tPos.x + px, this.originPos.y, 0));
        //             pos = new Vec3(tPos.x + px, this.originPos.y, 0);
        //             let tw = new Tween(tCards[i]).to(0.2, { worldPosition: pos });
        //             tweens.push(tw);
        //         }
        //         //记录当前卡牌位置
        //         tPos = pos;
        //     }
        //     tPos = this.originPos;
        //     //右半部分
        //     for (let i = tCards.length / 2 - 1; i >= 0; i--)
        //     {
        //         if (i == tCards.length / 2 - 1)
        //         {
        //             //同上
        //             //tCards[i].setWorldPosition(new Vec3(tPos.x - px / 2, this.originPos.y, 0));
        //             pos = new Vec3(tPos.x - px / 2, this.originPos.y, 0);
        //             let tw = new Tween(tCards[i]).to(0.2, { worldPosition: pos });
        //             tweens.push(tw);
        //         }
        //         else
        //         {
        //             //tCards[i].setWorldPosition(new Vec3(tPos.x - px, this.originPos.y, 0));
        //             pos = new Vec3(tPos.x - px, this.originPos.y, 0);
        //             let tw = new Tween(tCards[i]).to(0.2, { worldPosition: pos });
        //             tweens.push(tw);
        //         }
        //         tPos = pos;
        //     }
        // }
        // tPos = this.originPos;
        // //数组长度是奇数
        // if (tCards.length > 1 && tCards.length % 2 != 0)
        // {
        //     let pos = null;
        //     //tCards[Math.floor(tCards.length / 2)].setWorldPosition(this.originPos);
        //     let tw = new Tween(tCards[Math.floor(tCards.length / 2)]).to(0.2, { worldPosition: this.originPos });
        //     tweens.push(tw);
        //     //左半部分
        //     for (let i = Math.floor(tCards.length / 2) + 1; i < tCards.length; i++)
        //     {
        //         //tCards[i].setWorldPosition(new Vec3(tPos.x + px, this.originPos.y, 0));
        //         pos = new Vec3(tPos.x + px, this.originPos.y, 0);
        //         let tw = new Tween(tCards[i]).to(0.2, { worldPosition: pos });
        //         tweens.push(tw);
        //         tPos = pos;
        //     }
        //     tPos = this.originPos;
        //     //右半部分
        //     for (let i = Math.floor(tCards.length / 2) - 1; i >= 0; i--)
        //     {
        //         //tCards[i].setWorldPosition(new Vec3(tPos.x - px, this.originPos.y, 0));
        //         pos = new Vec3(tPos.x - px, this.originPos.y, 0);
        //         let tw = new Tween(tCards[i]).to(0.2, { worldPosition: pos });
        //         tweens.push(tw);
        //         tPos = pos;
        //     }
        // }
        // //数量大于6的情况
        // if (this.cards.length > 6)
        // {
        //     for (let i = 0; i < 6; i++)
        //     {
        //         this.cards[i].setWorldPosition(new Vec3(this.cards[i].worldPositionX, this.originPos.y + this.spacingY));
        //         //let pos = new Vec3(this.cards[i].worldPositionX, this.originPos.y + this.spacingY);
        //         // tw = new Tween(this.cards[i]).to(0.2, { worldPosition: pos });
        //         //tweens.push(tw);
        //     }
        //     let tCards = this.cards.slice(6, this.cards.length);
        //     if (tCards.length == 1)
        //     {
        //         //tCards[0].setWorldPosition(new Vec3(this.originPos.x, this.originPos.y - this.spacingY));
        //         let pos = new Vec3(new Vec3(this.originPos.x, this.originPos.y - this.spacingY));
        //         let tw = new Tween(tCards[0]).to(0.2, { worldPosition: pos });
        //         tweens.push(tw);
        //     }
        //     //同上
        //     px = this.spacingX;
        //     for (let i = 0; i < tCards.length; i++)
        //     {
        //         px -= px / 10;
        //     }
        //     tPos = this.originPos;

        //     if (tCards.length > 1 && tCards.length % 2 == 0)
        //     {
        //         let pos = null;
        //         for (let i = tCards.length / 2; i < tCards.length; i++)
        //         {
        //             if (i == tCards.length / 2)
        //             {
        //                 //tCards[i].setWorldPosition(new Vec3(tPos.x + px / 2, this.originPos.y - this.spacingY, 0));
        //                 pos = new Vec3(tPos.x + px / 2, this.originPos.y - this.spacingY, 0);
        //                 let tw = new Tween(tCards[i]).to(0.2, { worldPosition: pos });
        //                 tweens.push(tw);
        //             }
        //             else
        //             {
        //                 //tCards[i].setWorldPosition(new Vec3(tPos.x + px, this.originPos.y - this.spacingY, 0));
        //                 pos = new Vec3(tPos.x + px, this.originPos.y - this.spacingY, 0);
        //                 let tw = new Tween(tCards[i]).to(0.2, { worldPosition: pos });
        //                 tweens.push(tw);
        //             }

        //             tPos = pos;
        //         }
        //         tPos = this.originPos;
        //         for (let i = tCards.length / 2 - 1; i >= 0; i--)
        //         {
        //             if (i == tCards.length / 2 - 1)
        //             {
        //                 //tCards[i].setWorldPosition(new Vec3(tPos.x - px / 2, this.originPos.y - this.spacingY, 0));
        //                 pos = new Vec3(tPos.x - px / 2, this.originPos.y - this.spacingY, 0);
        //                 let tw = new Tween(tCards[i]).to(0.2, { worldPosition: pos });
        //                 tweens.push(tw);
        //             }
        //             else
        //             {
        //                 //tCards[i].setWorldPosition(new Vec3(tPos.x - px, this.originPos.y - this.spacingY, 0));
        //                 pos = new Vec3(tPos.x - px, this.originPos.y - this.spacingY, 0);
        //                 let tw = new Tween(tCards[i]).to(0.2, { worldPosition: pos });
        //                 tweens.push(tw);
        //             }
        //             tPos = pos;
        //         }
        //     }
        //     tPos = this.originPos;
        //     if (tCards.length > 1 && tCards.length % 2 != 0)
        //     {
        //         let pos = new Vec3(this.originPos.x, this.originPos.y - this.spacingY, 0);
        //         //tCards[Math.floor(tCards.length / 2)].setWorldPosition(new Vec3(this.originPos.x, this.originPos.y - this.spacingY, 0));
        //         let tw = new Tween(tCards[Math.floor(tCards.length / 2)]).to(0.2, { worldPosition: pos });
        //         tweens.push(tw);
        //         for (let i = Math.floor(tCards.length / 2) + 1; i < tCards.length; i++)
        //         {
        //             //tCards[i].setWorldPosition(new Vec3(tPos.x + px, this.originPos.y - this.spacingY, 0));
        //             pos = new Vec3(tPos.x + px, this.originPos.y - this.spacingY, 0);
        //             let tw = new Tween(tCards[i]).to(0.2, { worldPosition: pos });
        //             tweens.push(tw);
        //             tPos = pos;
        //         }
        //         tPos = this.originPos;
        //         for (let i = Math.floor(tCards.length / 2) - 1; i >= 0; i--)
        //         {
        //             // tCards[i].setWorldPosition(new Vec3(tPos.x - px, this.originPos.y - this.spacingY, 0));
        //             pos = new Vec3(tPos.x - px, this.originPos.y - this.spacingY, 0);
        //             let tw = new Tween(tCards[i]).to(0.2, { worldPosition: pos });
        //             tweens.push(tw);
        //             tPos = pos;
        //         }
        //     }

        // }