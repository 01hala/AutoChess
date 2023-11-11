/*
 * ShopArea.ts
 * author: Hotaru
 * 2023/11/11
 */
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ShopArea')
export class ShopArea extends Component 
{
    public rolesSquare:Node[];

    protected onLoad(): void 
    {
        for(let t of this.node.getChildByPath("TopArea/Role").children)
        {
            this.rolesSquare.push(t);
        }
    }

    start() 
    {

    }

    update(deltaTime: number) 
    {
        
    }

    ShopSpawnProp()
    {

    }

    ShopUpdate()
    {

    }

}


