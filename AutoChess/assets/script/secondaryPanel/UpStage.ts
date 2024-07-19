import { _decorator, Animation, animation, BlockInputEvents, Button, CCFloat, Color, color, Component, instantiate, math, Node, Sprite, SpriteFrame, tween, UIOpacity, UITransform, Vec3 } from 'cc';
import { config } from '../battle/AutoChessBattle/config/config';
import { loadAssets } from '../bundle/LoadAsset';
const { ccclass, property } = _decorator;

@ccclass('UpStage')
export class UpStage extends Component 
{
    @property({
        type:CCFloat,
        max:100,
        min:5,
        displayName:"滚动速度"
    })
    public moveSpeed=15; //滚动速度
    @property({
        type:CCFloat,
        max:1,
        min:0.02,
        displayName:"滚动间隔"
    })
    public moveTick=0.02;   //滚动间隔

    private items:Node[]=[];

    protected onLoad(): void 
    {
        this.node.on(Button.EventType.CLICK,()=>
        {
            this.Exit();
        })
    }

    public async OpenUpStageBoard(_stage:number)
    {
        try
        {
            this.node.getComponent(BlockInputEvents).enabled=true;
            this.node.setSiblingIndex(100);
            await this.Init(_stage);
    
            this.node.getChildByPath("MidArea").getComponent(Animation).play("PanelAppear");
            for(let i=0;i<this.node.getChildByPath("MidArea/View").children.length;i++)
            {
                this.items.push(this.node.getChildByPath("View").children[i]);
                if(0==i)
                {
                    this.items[i].position.set(new Vec3(0,0,0));
                }
                else
                {
                    this.items[i].position.set(new Vec3(this.items[i-1].getComponent(UITransform).width,0,0));
                }
            }
            this.StartSchedule();
        }
        catch(error)
        {
            
        }
    }

    private async Init(_stage:number)
    {
        try
        {
            let id=100001;
            let i=0;
            let jconfig=config.RoleConfig.get(id);
            do 
            {
                if(jconfig.Stage == _stage)
                {
                    let img=await loadAssets.LoadImg(jconfig.Res) as SpriteFrame;
                    let t_node=instantiate(new Node());
                    t_node.getComponent(UITransform).anchorX=0;
                    t_node.addComponent(Sprite);
                    t_node.setParent(this.node.getChildByPath("View"));
                    t_node.getComponent(Sprite).spriteFrame=img;
                }
                if(i>9)
                {
                    break;
                }
            }
            while(jconfig!=null);
        }
        catch(error)
        {
            console.error("UpStage 下 Init 错误 err: ",error);
        }
    }

    private StartSchedule() 
    {
        try
        {
            let shiftX=this.items[1].getComponent(UITransform).contentSize.x/2;
            for(let i = 0;i<this.items.length;i++)
            {
                this.items[i].position.set(new Vec3(this.items[i].position.x - shiftX,0,0));
            }
    
            this.schedule((deltaTime)=>
            {
                for(let i=0 ; i<this.items.length ; i++)
                {
                    //this.items[i].position.set(new Vec3(this.items[i].position.x - deltaTime * 100,0,0));
                    tween(this.items[i]).to(this.moveTick/10,{position:new Vec3(this.items[i].position.x - this.moveSpeed,0,0)}).call(()=>
                    {
                        this.Circulate();
                        this.UpdateScale();
                    }).start();
                }
                
            },this.moveTick);
        }
        catch(error)
        {
            console.error("UpStage 下 StartSchedule 错误 err: ",error);
        }
    }

    private Circulate()
    {
        try
        {
            let startItem=this.items[0];
            let endItem=this.items[this.items.length-1];
    
            let transX=startItem.position.x + startItem.getComponent(UITransform).contentSize.x / 2;
            if(transX < 50)
            {
                let t_item=this.items.shift();
                this.items.push(t_item);
                startItem.position.set(new Vec3(endItem.position.x + endItem.getComponent(UITransform).contentSize.x,0,0));
            }
        }
        catch(error)
        {
            console.error("UpStage 下 Circulate 错误 err: ",error);
        }
    }

    private UpdateScale()
    {
        try
        {
            let vieWidth=this.node.getComponent(UITransform).contentSize.x/2;
            for(let i = 0;i<this.items.length;i++)
            {
                let t_item = this.items[i];
                let t_trans=t_item.position.x + t_item.getComponent(UITransform).contentSize.x/2;
                let pre = 0;
                
                if(t_trans < vieWidth)
                {
                    pre = t_trans / vieWidth;
                }
                else
                {
                    pre = 1 - (t_trans - vieWidth) / vieWidth;
                }
    
                let sc = 1.0 - 0.5;
                sc*=pre;
                sc+=0.5;
                tween(this.items[i]).to(0,{scale:new Vec3(Math.abs(sc),Math.abs(sc),0)}).call(()=>
                {
                    
                }).start();
                this.items[i].getComponent(Sprite).color=new Color(255,255,255,Math.abs(255*sc));
            }
        }
        catch(error)
        {
            console.error("UpStage 下 UpdateScale 错误 err: ",error);
        }
    }

    private Exit()
    {
        try
        {
            this.node.getComponent(BlockInputEvents).enabled=false;
            this.node.getChildByPath("MidArea").getComponent(Animation).on(Animation.EventType.FINISHED,()=>
            {
                this.node.getChildByPath("MidArea").getComponent(Animation).off(Animation.EventType.FINISHED);
                this.node.active=false;
            })
            this.node.getChildByPath("MidArea").getComponent(Animation).play("PanelDisappear");
        }
        catch(error)
        {
            console.error("UpStage 下 Exit 错误 err: ",error);
        }
    }
}


