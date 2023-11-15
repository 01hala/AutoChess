import { _decorator, Component, Node } from 'cc';
import { RoleIcon } from './RoleIcon';
const { ccclass, property } = _decorator;

@ccclass('RoleArea')
export class RoleArea extends Component 
{
    public targets:Map<string,Node> = new Map();

    public roles:Node[]=[];

    onLoad() 
    {
        for(let t of this.node.getChildByName("Node").children)
        {
            this.targets.set(t.name,null);
        }
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

    async SwitchPos(pos:Node,switchNode:Node)
    {
        this.targets.set(pos.name,switchNode);
        switchNode.getComponent(RoleIcon).target=pos;
        switchNode.getComponent(RoleIcon).TransPos(pos.worldPosition);
    }
}


