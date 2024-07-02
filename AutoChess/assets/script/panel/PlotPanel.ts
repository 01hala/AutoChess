import { _decorator, Button, Component, Label, Node, RichText, sp } from 'cc';
import { config } from '../config/config';
import { PlotConfig } from '../config/Plot_config';
import { loadAssets } from '../bundle/LoadAsset';
const { ccclass, property } = _decorator;

@ccclass('PlotPanel')
export class PlotPanel extends Component 
{
    //继续和跳过按钮
    private next:Button;
    private skip:Node;
    //立绘
    private painting:sp.Skeleton;
    //文本框
    private lable:Label;
    private title:RichText;
    //对话数据
    private plotInfo:PlotConfig[];
    //对话进度
    private progress:number;

    private text:string;

    private textEffectProg:number;

    private interval;

    private nextLock:boolean = false;

    protected onLoad(): void
    {
        this.next=this.node.getChildByPath("BG").getComponent(Button);
        this.skip=this.node.getChildByPath("Skip");

        this.painting=this.node.getChildByPath("PaintingArea/Sprite").getComponent(sp.Skeleton);

        this.lable=this.node.getChildByPath("LableArea/Label").getComponent(Label);
        this.title=this.node.getChildByPath("LableArea/Title").getComponent(RichText);
    }

    start() 
    {
        this.next.node.on(Button.EventType.CLICK,()=>
        {
            if(this.nextLock)
            {
                this.Next();
            }
            else
            {
                clearInterval(this.interval);
                this.lable.string = this.text;
                this.nextLock=true;
            }
        },this);

        this.skip.on(Button.EventType.CLICK,()=>
        {

            //this.destroy();
        },this);
    }

    private LoadPlot(_id:number)
    {
        config.PlotConfig.forEach((value , key)=>
        {
            if (key == _id)
            {
                this.plotInfo.push(value);
            }
        });
    }

    private OpenPlotPanel(_id:number)
    {
        this.progress = 1;
        this.LoadPlot(_id);
        let plot = this.plotInfo.find((value)=>
        {
            if(this.progress == value.Progress)
            {
                return value;
            }
        });

        this.ShowLabel(plot);

    }

    private LoadPainting(_address:string)
    {
        loadAssets.LoadSkeletonData(_address,(_data)=>
        {
            if(_data)
            {
                this.painting.skeletonData=_data;
                let anims = _data.getAnimsEnum();
                this.painting.setAnimation(0, String(anims[1]), true);
            }
        });
    }

    private ShowLabel(_plot:PlotConfig)
    {
        this.lable.string="";
        this.next.enabled=false;

        let jconfig = config.RoleConfig.get(_plot.RoleId);
        this.title.string="<color=#ffffff>- " + jconfig.Name + " -</color>";

        this.LoadPainting(jconfig.Skel);

        this.text=_plot.Text;
        this.textEffectProg=0;
        // this.schedule(() =>
        // {
        //     this.textEffectProg++;
        //     if (this.textEffectProg === text.length + 1) 
        //     {
        //         this.next.enabled = true;
        //     }
        //     else
        //     {
        //         this.lable.string = text.substring(0, this.textEffectProg);
        //     }
        // }, 0.1, text.length + 1, 0.1);

        this.interval=setInterval(()=>
        {
            this.textEffectProg++;
            if (this.textEffectProg === (this.text.length + 1)/2) 
            {
                this.next.enabled = true;
            }
            else if(this.textEffectProg === (this.text.length + 1))
            {
                clearInterval(this.interval);
            }
            else
            {
                this.lable.string = this.text.substring(0, this.textEffectProg);
            }
        },0.1);
    }

    private Next()
    {
        this.nextLock=false;
        if(this.progress <= this.plotInfo.length)
        {
            let plot = this.plotInfo.find((value) =>
            {
                if (this.progress == value.Progress)
                {
                    return value;
                }
            });

            this.ShowLabel(plot);

            this.progress++;
        }
    }
}


