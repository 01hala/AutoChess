import { _decorator, CCFloat, CCInteger, Component, instantiate, Node, randomRange, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CoinDrop')
export class CoinDrop extends Component 
{
    @property({
        type: CCInteger,
        displayName: "生成金币数量"
    })
    public coinCount:number;
    @property({
        type: CCInteger,
        displayName: "最小半径"
    })
    public minRadius:number;
    @property({
        type: CCInteger,
        displayName: "最大半径"
    })
    public maxRadius:number;
    @property({
        type: CCFloat,
        displayName: "下落动画持续时间"
    })
    public duration1:number;
    @property({
        type: CCFloat,
        displayName: "达到目标持续时间"
    })
    public duration2:number;

    public Drop(_from:Vec3 , _target:Vec3 ,_callBack:()=>void)
    {
        this.node.setWorldPosition(_from);

        let dropGroup = [];
        let pfb = this.node.children[0];
        dropGroup.push(pfb);
        for(let i=0;i<this.coinCount;i++)
        {
            let pfbClone = instantiate(pfb);
            pfbClone.setParent(pfb.parent);
            dropGroup.push(pfbClone);
        }

        let finishedCount=0;
        for(let i=0;i<this.coinCount;i++)
        {
            let angle = randomRange(i*360/this.coinCount,(i+1)*360/this.coinCount);
            let radius=randomRange(this.minRadius,this.maxRadius);
            let randX=radius*Math.cos(angle);
            let randY=radius*Math.sin(angle);

            tween(dropGroup[i])
                .to(this.duration1 , { position: new Vec3(randX,randY,0)} , {easing:'smooth'})
                .to(this.duration2 , { worldPosition: _target } , {easing:'smooth'})
                .call(()=>
                {
                    if(++finishedCount >= this.coinCount)
                    {
                        if(_callBack)
                        {
                            _callBack();
                        }
                        this.node.destroy();
                    }
                })
        }
    }
}


