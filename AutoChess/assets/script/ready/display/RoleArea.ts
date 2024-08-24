import { _decorator, Component, instantiate, Node, Prefab, Vec2, Vec3 } from 'cc';
import { RoleIcon } from './RoleIcon';
import * as singleton from '../../netDriver/netSingleton';
import * as common from '../../battle/AutoChessBattle/common';
import { BundleManager } from '../../bundle/BundleManager';
import { AudioManager } from '../../other/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('RoleArea')
export class RoleArea extends Component 
{
    public targets:Map<string,Node> = new Map();

    public rolesNode:Node[]=[null,null,null,null,null,null];
    public presenceNum:number;

    onLoad() 
    {
        for(let t of this.node.getChildByName("Node").children)
        {
            this.targets.set(t.name, t);
        }
    }

    start()
    {
        
    }

    update(deltaTime: number) 
    {
        
    }

    GetTargetRole(index:number){
        return this.rolesNode[index];
    }

    GetRolesNumber():number
    {
        let num=0;
        for(let t of this.rolesNode)
        {
            if(null!=t)
            {
                num++;
            }
        }
        return num;
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
        //await this.MovePos(_selfIndex,_switchNode.getComponent(RoleIcon).index);
        console.log("!",_selfPosTarget);
        _switchNode.getComponent(RoleIcon).TransPos(_selfPosTarget , _selfIndex);
    }

    async MovePos(_indexBefor:number,_indexAfter:number,_isMerge:boolean)
    {
        //this.LogShowRoles();
        console.log('-------------');
        singleton.netSingleton.ready.readyData.Move(_indexBefor,_indexAfter);
        if(!_isMerge)
        {
            //console.log("_indexBefor:", _indexBefor, " _indexAfter:", _indexAfter);
            let t=this.rolesNode[_indexAfter];
            this.rolesNode[_indexAfter]=this.rolesNode[_indexBefor];
            this.rolesNode[_indexBefor]=t;
        }
        this.LogShowRoles();
    }

    private LogShowRoles()
    {
        for(let i=0;i<6;i++)
        {
            if(this.rolesNode[i])
            {
                console.log(i,': ',this.rolesNode[i].getComponent(RoleIcon).roleId);
            }
            else
            {
                console.log(i,': null');
            }
            
        }
    }

    async SaleRole(index:number)
    {
        AudioManager.Instance.PlayerOnShot("Sound/sound_charsolded_01");
        console.log("SaleRole index:" + index);
        singleton.netSingleton.ready.readyData.Sale(index);
        this.rolesNode[index]=null;
        // for(let i:number=0;i<this.rolesNode.length;i++)
        // {
        //     if(this.rolesNode[i].getComponent(RoleIcon).index==index)
        //     {
        //         singleton.netSingleton.ready.ready.Sale(index);
        //         this.rolesNode.splice(i,1);
        //         return;
        //     }
        // }
        // if(this.rolesNode.length<=0)
        // {
        //     this.rolesNode=[];
        // }
    }

    async ResetTeam(_roleList:common.Role[])
    {
        try
        {
            let r=await BundleManager.Instance.loadAssetsFromBundle("Icons","RoleIcon") as Prefab;

            console.log("ResetTeam _roleList:", JSON.stringify(_roleList));
            for(let i=0;i<_roleList.length;i++)
            {
                if(_roleList[i]!=null)
                {
                    let obj = instantiate(r);
                    obj.setParent(this.node.parent);
                    obj.setWorldPosition(this.node.getChildByPath("Node").children[i].worldPosition);
                    //obj.getComponent(RoleIcon).roleNode.active=true;
                    obj.getComponent(RoleIcon).index=i;
                    obj.getComponent(RoleIcon).target=this.targets.get("Location_" + i);
                    obj.getComponent(RoleIcon).isBuy=true;
                    await obj.getComponent(RoleIcon).Init(_roleList[i].RoleID,_roleList[i].HP+_roleList[i].TempHP,_roleList[i].Attack+_roleList[i].TempAttack, _roleList[i].Level , _roleList[i].Number , false , _roleList[i].FettersSkillID , i);
                    //obj.getComponent(RoleIcon).iconMask.active=false;
                    if (this.rolesNode[i]) {
                        this.rolesNode[i].destroy();
                    }
                    this.rolesNode[i]=obj;
                }
            }
        }
        catch(error)
        {
            console.error("RoleArea 里的 ResetTeam 错误 err:",error);
        }
        
    }

    async SummonRole(_index:number,_role:common.Role)
    {
        let r=await BundleManager.Instance.loadAssetsFromBundle("Icons","RoleIcon") as Prefab;

        let obj=instantiate(r);
        obj.setParent(this.node.parent);
        obj.setWorldPosition(this.node.getChildByPath("Node").children[_index].worldPosition);
        obj.getComponent(RoleIcon).isBuy=true;
        obj.getComponent(RoleIcon).index=_index;
        obj.getComponent(RoleIcon).target=this.targets.get("Location_" + _index);

        await obj.getComponent(RoleIcon).Init(_role.RoleID,_role.HP+_role.TempHP,_role.Attack+_role.TempAttack,_role.Level,_role.Number,false,_role.FettersSkillID,_index);
        this.rolesNode[_index]=obj;

    }

}


