import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
import { RoleIcon } from './RoleIcon';
import * as singleton from '../../netDriver/netSingleton';
import { Role } from '../../serverSDK/common';
import { BundleManager } from '../../bundle/BundleManager';
const { ccclass, property } = _decorator;

@ccclass('RoleArea')
export class RoleArea extends Component 
{
    public targets:Map<string,Node> = new Map();

    public rolesNode:Node[]=[];
    public presenceNum:number;

    onLoad() 
    {
        for(let t of this.node.getChildByName("Node").children)
        {
            this.targets.set(t.name,null);
        }
    }

    start()
    {
        
    }

    update(deltaTime: number) 
    {
        
    }

    GetTargetValue(name:string)
    {
        if(this.targets.has(name))
        {
            return this.targets.get(name);
        }
        return null;
    }

    async SwitchPos(_selfIndex:number,_selfPosTarget:Node,_switchNode:Node)
    {
        await this.MovePos(_selfIndex,_switchNode.getComponent(RoleIcon).index);
        this.targets.set(_selfPosTarget.name,_switchNode);
        _switchNode.getComponent(RoleIcon).target=_selfPosTarget;
        _switchNode.getComponent(RoleIcon).TransPos(_selfPosTarget.worldPosition);
    }

    async MovePos(_indexBefor:number,_indexAfter:number)
    {
        singleton.netSingleton.ready.ready.Move(_indexBefor,_indexAfter);
    }

    async SaleRole(index:number)
    {
        console.log("SaleRole index:" + index);
        for(let i:number=0;i<this.rolesNode.length;i++)
        {
            if(this.rolesNode[i].getComponent(RoleIcon).index==index)
            {
                singleton.netSingleton.ready.ready.Sale(index);
                this.rolesNode.splice(i,1);
                return;
            }
        }
        if(this.rolesNode.length<=0)
        {
            this.rolesNode=[];
        }
    }

    async ResetTeam(_roleList:Role[])
    {
        try
        {
            let r=await BundleManager.Instance.loadAssetsFromBundle("Icons","RoleIcon") as Prefab;

            for(let i=0;i<_roleList.length;i++)
            {
                if(_roleList[i]!=null)
                {
                    let obj = instantiate(r);
                    obj.setParent(this.node.parent);
                    obj.setWorldPosition(this.node.getChildByPath("Node").children[i].worldPosition);
                    obj.getComponent(RoleIcon).isBuy=true;
                    //obj.getComponent(RoleIcon).roleNode.active=true;
                    obj.getComponent(RoleIcon).index=i;
                    obj.getComponent(RoleIcon).target=this.targets[i];
                    obj.getComponent(RoleIcon).Init(_roleList[i].RoleID,_roleList[i].HP,_roleList[i].Attack,i);
                    //obj.getComponent(RoleIcon).iconMask.active=false;
                    this.rolesNode.push(obj);
                }
            }
        }
        catch(error)
        {
            console.error("RoleArea 里的 ResetTeam 错误 err:",error);
        }
        
    }

}


