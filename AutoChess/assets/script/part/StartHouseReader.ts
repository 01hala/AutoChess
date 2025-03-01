import { _decorator, Color, color, Component, error, Node, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('StartHouseReader')
export class StartHouseRender extends Component 
{
    private sprite:Sprite=null;
    private interval:any=null;
    private alpha:number=255;

    private factor:number=-1;

    protected onLoad(): void
    {
        this.sprite=this.node.getComponent(Sprite);
    }

    start() 
    {
        
    }

    public setOutline(flag:boolean)
    {
        if(flag)
        {
            this.sprite.customMaterial.setProperty("_outlineWidth",0.005);
            
            this.interval=setInterval(()=>
            {
                this.alpha+=10*this.factor;

                if(this.alpha>240)
                {
                    this.factor=-1;
                }
                if(this.alpha<=10)
                {
                    this.factor=1;
                }
                let color=new Color(255,255,255,this.alpha);
                this.sprite.customMaterial.setProperty("_outlineColor",color);
            },100);
        }
        else
        {
            this.sprite.customMaterial.setProperty("_outlineWidth",0);
            if(this.interval)
            {
                clearInterval(this.interval);
            }
        }
    }

    update(deltaTime: number) 
    {
        
    }
}


