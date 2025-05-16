import { _decorator, Component, Node, sp, UITransform, Vec3 } from 'cc';
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

    constructor(originPos:Vec3)
    {
        this.originPos=originPos;
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

    private Updata()
    {
        if (this.cards.length == 1)
        {
            this.cards[0].setWorldPosition(this.originPos);
        }
        //数量小于6的情况
        let tCards=this.cards.slice(0,6);
        let px = this.spacingX;
        let tPos = this.originPos;
        for (let i = 0; i < tCards.length; i++)
        {
            px -= px / 10;
        }
        //数组长度是偶数是偶数
        if (tCards.length > 1 && tCards.length % 2 == 0)
        {
            //左半部分
            for (let i = tCards.length / 2; i < tCards.length; i++)
            {
                if (i == tCards.length / 2)
                {
                    //第一张中间靠右所以要除以2
                    tCards[i].setWorldPosition(new Vec3(tPos.x + px / 2, this.originPos.y, 0));
                }
                else
                {
                    tCards[i].setWorldPosition(new Vec3(tPos.x + px, this.originPos.y, 0));
                }
                //记录当前卡牌位置
                tPos =  tCards[i].worldPosition;
            }
            tPos = this.originPos;
            //右半部分
            for (let i = tCards.length / 2 - 1; i >= 0; i--)
            {
                if (i == tCards.length / 2 - 1)
                {
                    //同上
                   tCards[i].setWorldPosition(new Vec3(tPos.x - px / 2, this.originPos.y, 0));
                }
                else
                {
                   tCards[i].setWorldPosition(new Vec3(tPos.x - px, this.originPos.y, 0));
                }
                tPos = tCards[i].worldPosition;
            }
        }
        tPos = this.originPos;
        //数组长度是奇数
        if (tCards.length > 1 && tCards.length % 2 != 0)
        {
            tCards[Math.floor(tCards.length / 2)].setWorldPosition(this.originPos);
            //左半部分
            for (let i = Math.floor(tCards.length / 2) + 1; i < tCards.length; i++)
            {
               tCards[i].setWorldPosition(new Vec3(tPos.x + px, this.originPos.y, 0));
                tPos = tCards[i].worldPosition;
            }
            tPos = this.originPos;
            //右半部分
            for (let i = Math.floor(tCards.length / 2) - 1; i >= 0; i--)
            {
                tCards[i].setWorldPosition(new Vec3(tPos.x - px, this.originPos.y, 0));
                tPos = tCards[i].worldPosition;
            }
        }
        //数量大于6的情况
        if (this.cards.length > 6)
        {
            //6以下的卡牌上移
            for (let i = 0; i < 6; i++)
            {
                this.cards[i].setWorldPosition(new Vec3(this.cards[i].worldPositionX, this.originPos.y + this.spacingY));
            }
            let tCards = this.cards.slice(6, this.cards.length);
            if (tCards.length == 1)
            {
                tCards[0].setWorldPosition(new Vec3(this.originPos.x, this.originPos.y - this.spacingY));
            }
            //同上
            px = this.spacingX;
            for (let i = 0; i < tCards.length; i++)
            {
                px -= px / 10;
            }
            tPos = this.originPos;

            if (tCards.length > 1 && tCards.length % 2 == 0)
            {
                for (let i = tCards.length / 2; i < tCards.length; i++)
                {
                    if (i == tCards.length / 2)
                    {
                        tCards[i].setWorldPosition(new Vec3(tPos.x + px / 2, this.originPos.y - this.spacingY, 0));
                    }
                    else
                    {
                        tCards[i].setWorldPosition(new Vec3(tPos.x + px, this.originPos.y - this.spacingY, 0));
                    }

                    tPos = tCards[i].worldPosition;
                }
                tPos = this.originPos;
                for (let i = tCards.length / 2 - 1; i >= 0; i--)
                {
                    if (i == tCards.length / 2 - 1)
                    {
                        tCards[i].setWorldPosition(new Vec3(tPos.x - px / 2, this.originPos.y - this.spacingY, 0));
                    }
                    else
                    {
                        tCards[i].setWorldPosition(new Vec3(tPos.x - px, this.originPos.y - this.spacingY, 0));
                    }
                    tPos = tCards[i].worldPosition;
                }
            }
            tPos = this.originPos;
            if (tCards.length > 1 && tCards.length % 2 != 0)
            {
                tCards[Math.floor(tCards.length / 2)].setWorldPosition(new Vec3(this.originPos.x, this.originPos.y - this.spacingY, 0));
                for (let i = Math.floor(tCards.length / 2) + 1; i < tCards.length; i++)
                {
                    tCards[i].setWorldPosition(new Vec3(tPos.x + px, this.originPos.y - this.spacingY, 0));
                    tPos = tCards[i].worldPosition;
                }
                tPos = this.originPos;
                for (let i = Math.floor(tCards.length / 2) - 1; i >= 0; i--)
                {
                    tCards[i].setWorldPosition(new Vec3(tPos.x - px, this.originPos.y - this.spacingY, 0));
                    tPos = tCards[i].worldPosition;
                }
            }
        }
    }

    // protected onLoad(): void
    // {
    //     this.weight=this.node.getComponent(UITransform).contentSize.x-this.paddingX*2;
    //     this.height=this.node.getComponent(UITransform).contentSize.y-this.paddingY*2;

    //     this.origin=new Vec3(this.weight/2,this.height/2);
    // }

    // start()    
    // {
    //     this.node.on(Node.EventType.CHILD_ADDED,()=>
    //     {
    //         this.UpdataList();
    //     });
    //     this.node.on(Node.EventType.CHILD_REMOVED,()=>
    //     {
    //         this.UpdataList();
    //     });
    // }

    // private UpdataList()
    // {
    //     let tNodesWeight=[];
    //     for(let i=0;i<this.node.children.length;i++)
    //     {
    //         tNodesWeight.push(this.node.children[i].getComponent(UITransform).contentSize.x);
    //     }
    //     if(this.node.children.length == 1)
    //     {
    //         this.node.children[0].setPosition(this.origin);
    //         return;
    //     }
    //     if(this.node.children.length % 2 ==0)
    //     {
    //         let index = this.node.children.length/2 - 1;
    //         for(let i=0;i<index;i++)
    //         {
    //             let t_posX=0;
    //             for(let j=index;j>i;j--)
    //             {
    //                 t_posX-=tNodesWeight[j];
    //             }
    //             t_posX+=tNodesWeight[i]/2;
    //             this.node.children[i].setPosition(new Vec3(this.origin.x + t_posX,this.origin.y));
    //         }

    //     }
    //     if(this.node.children.length % 2 !=0)
    //     {

    //     }
    // }
}


