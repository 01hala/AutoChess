import { _decorator, Button, Component, Node, Sprite } from 'cc';
import * as singleton from '../netDriver/netSingleton';
import { InfoPanel } from '../secondaryPanel/InfoPanel';
import { loadAssets } from '../bundle/LoadAsset';
const { ccclass, property } = _decorator;

@ccclass('RoleCard')
export class RoleCard extends Component 
{
    private spr:Sprite;

    private lock:boolean=false;

    public roleId:number;

    public storePanel:Node;

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
    }


    start() 
    {
        this.node.on(Button.EventType.CLICK,()=>
        {
            singleton.netSingleton.mainInterface.infoPanel.active = true;
            singleton.netSingleton.mainInterface.infoPanel.getComponent(InfoPanel).OpenSimple(this.roleId);

        },this);

        this.Init();
    }

    private async Init()
    {
        let path="Avatar/Role_"+this.roleId;
        let img=await loadAssets.LoadImg(path);
        if(img)
        {
            this.node.getChildByPath("RoleAvatar/Sprite").getComponent(Sprite).spriteFrame=img;
        }
    }

    update(deltaTime: number) {
        
    }


}


