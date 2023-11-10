import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('RoleArea')
export class RoleArea extends Component 
{
    public targets:Map<string,string> = new Map();

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
}


