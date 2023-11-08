import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('RoleArea')
export class RoleArea extends Component 
{
    public targets:Node[]=[];

    onLoad() 
    {
        for(let t of this.node.getChildByName("Node").children)
        {
            this.targets.push(t);
        }
    }

    update(deltaTime: number) 
    {
        
    }
}


