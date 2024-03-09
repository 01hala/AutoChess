import { _decorator, Animation, animation, Component, instantiate, Node, Prefab, resources, RichText } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TipsManager')
export class TipsManager extends Component 
{
    private static _instance:TipsManager=null;

    public static get Instance()
    {
        return this._instance;
    }

    @property(Prefab)
    public textTipNodePre:Prefab;

    protected onLoad(): void 
    {
        TipsManager._instance=this.node.getComponent(TipsManager);
    }

    start() 
    {
        try
        {
            if(null==this.textTipNodePre)
            {
                resources.load("prefab/TextTipBar",Prefab,(error,prefab)=>
                {
                    if(error)
                    {
                        console.warn("没有读取到TextTipBar");
                    }
                    else
                    {
                        this.textTipNodePre=prefab;
                    }
                });
            }
        }
        catch(error)
        {
            console.error("TipsManager 下的 start 错误 error: ",error);
        }
    }

    update(deltaTime: number) {
        
    }

    public ShowTip(_msg:string)
    {
        try
        {
            console.log(this.textTipNodePre);
            let tip=instantiate(this.textTipNodePre);
            console.log("获取richtext");
            tip.getChildByPath("RichText").getComponent(RichText).string=_msg;
            tip.setParent(this.node);
            console.log("获取anim");
            let anim=tip.getComponent(Animation);
    
            anim.on(Animation.EventType.FINISHED,(event)=>
            {
                tip.destroy();
            });
    
            anim.play();
        }
        catch(error)
        {
            console.error("TipsManager 下的 ShowTip 错误 error: ",error);
        }
    }

}


