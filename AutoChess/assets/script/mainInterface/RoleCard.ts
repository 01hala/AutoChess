import { _decorator, Button, Component, debug, log, Node, RichText, Sprite } from 'cc';
import * as singleton from '../netDriver/netSingleton';
import { InfoPanel } from '../secondaryPanel/InfoPanel';
import { loadAssets } from '../bundle/LoadAsset';
import { config } from '../config/config';
const { ccclass, property } = _decorator;

@ccclass('RoleCard')
export class RoleCard extends Component 
{
    private spr:Sprite;

    private lock:boolean=false;
    private numberText:RichText;

    public roleId:number = 0;

    public get Lock()
    {
        return this.lock;
    }

    public set Lock(value:boolean)
    {
        this.lock=value;
        this.spr.grayscale=this.lock;
    }

    protected onLoad(): void 
    {
        this.spr=this.node.getChildByPath("RoleAvatar/Sprite").getComponent(Sprite);
        this.numberText=this.node.getChildByPath("NumberText").getComponent(RichText);
    }


    start() 
    {
        this.node.on(Button.EventType.CLICK,()=>
        {
            console.log(singleton.netSingleton.mainInterface.infoPanel.parent.active);
            singleton.netSingleton.mainInterface.infoPanel.active = true;
            singleton.netSingleton.mainInterface.infoPanel.getComponent(InfoPanel).OpenSimple(this.roleId);

        },this);

    }

    public async Init(_id:number)
    {
        try
        {
            this.roleId=_id;
            
            await this.LoadOnConfig();
        }
        catch(error)
        {
            console.error('RoleCard 下 Init 错误 err: ',error);
        }
    }

    public SetNumberText(_molecule:number,_denominator:number)
    {
        this.numberText.string=
        "<color=#000000>"+ _molecule + "</color>" +
        "<color=#000000> | "+ _denominator +"</color>";
    }

    private async LoadOnConfig()
    {
        let jconfig = null;
        jconfig = config.RoleConfig.get(this.roleId);
        let img = await loadAssets.LoadImg(jconfig.Avatar);
        if(img)
        {
            this.node.getChildByPath("RoleAvatar/Sprite").getComponent(Sprite).spriteFrame=img;
        }
    }

    update(deltaTime: number) {
        
    }


}


