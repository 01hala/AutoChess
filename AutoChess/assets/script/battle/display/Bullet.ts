import { _decorator, BoxCollider, Component, ITriggerEvent, Node, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Bullet')
export class Bullet extends Component {

    public target:Node;

    start() 
    {
        let collider = this.node.getComponent(BoxCollider);
        collider.on('onTriggerStay', this.onTriggerStay, this);

        tween(this.node.position).to(1,this.target.position,{
            onUpdate:(target:Vec3,ratio:number)=>{
                this.node.position=target;
            }
        }).start(); 
    }

    onTriggerStay(event:ITriggerEvent) 
    {
        if(event.otherCollider.node==this.target)
        {
            this.node.destroy();
        }
        
    }

    update(deltaTime: number) 
    {
        
    }

    
    
}


