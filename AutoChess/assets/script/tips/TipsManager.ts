import { _decorator, Animation, animation, Asset, Component, instantiate, Node, TTFFont, Prefab, resources, RichText } from 'cc';
import { BundleManager } from '../bundle/BundleManager';
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

    private typeface: TTFFont;

    protected onLoad(): void 
    {
        TipsManager._instance=this.node.getComponent(TipsManager);
    }

    async start() 
    {
        try
        {
            if(null==this.textTipNodePre)
            {
                this.textTipNodePre = await BundleManager.Instance.loadAssetsFromBundle("TextTipBar", "TextTipBar") as Prefab;
                this.typeface = (await BundleManager.Instance.loadAssetsFromBundle("Typeface", "MAOKENASSORTEDSANS")) as TTFFont;
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
            tip.getChildByPath("RichText").getComponent(RichText).font = this.typeface;
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


