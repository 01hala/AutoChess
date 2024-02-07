import { _decorator, Button, Component, debug, log, Node, Sprite } from 'cc';
import * as singleton from '../netDriver/netSingleton';
import { InfoPanel } from '../secondaryPanel/InfoPanel';
import { loadAssets } from '../bundle/LoadAsset';
const { ccclass, property } = _decorator;

@ccclass('RoleCard')
export class RoleCard extends Component 
{
    private spr:Sprite;

    private lock:boolean=false;

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
    }


    start() 
    {
        this.node.on(Button.EventType.CLICK,()=>
        {
            console.log(singleton.netSingleton.mainInterface.infoPanel.parent.active);
            singleton.netSingleton.mainInterface.infoPanel.active = true;
            singleton.netSingleton.mainInterface.infoPanel.getComponent(InfoPanel).OpenDetailed(this.roleId);

        },this);

    }

    public async Init(_id:number)
    {
        try
        {
            this.roleId=_id;
            let path="Avatar/Role_"+this.roleId;
            let img=await loadAssets.LoadImg(path);
            if(img)
            {
                this.node.getChildByPath("RoleAvatar/Sprite").getComponent(Sprite).spriteFrame=img;
            }
        }
        catch(error)
        {
            console.error('RoleCard 下 Init 错误 err: ',error);
        }
    }

    update(deltaTime: number) {
        
    }


}


