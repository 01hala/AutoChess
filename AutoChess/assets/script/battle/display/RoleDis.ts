/*
 * RoleDis.ts
 * author: Hotaru
 * 2023/10/04
 * 角色展示类
 */
import { _decorator, animation, CCInteger, Component, Sprite, Node , Animation, SpriteFrame, AnimationComponent, Prefab, instantiate, find } from 'cc';
import { Role } from '../../battle/role';
import { Camp , EventType, Property} from '../../battle/enums';
import { Battle } from '../../battle/battle';
import * as skill from '../../battle/skill/skill_base'
import { netDriver } from '../../netDriver/netDriver';
import { netGame } from '../../netDriver/netGame';
import { hub_call_gate_reverse_reg_client_hub_rsp } from '../../serverSDK/gate';
import { BundleManager } from '../../bundle/BundleManager';
import { Bullet } from './Bullet';
const { ccclass, property } = _decorator;

@ccclass('RoleDis')
export class RoleDis extends Component 
{
    @property({
        type:CCInteger,
        displayName:"角色ID"
    })
    public RoleId:number;

    @property({
        type:Prefab,
        displayName:"远程攻击物"
    })
    public remoteNode:Prefab;

    public Hp:number;
    public AtkNum:number;

    public Level:number;

    private roleInfo:Role=null;

    private AtkAnim:Animation;

    private hpSprite:Sprite;
    private atkSprite:Sprite;

    private roleSprite:Node;
    

    start() 
    {
        
        this.roleSprite=this.node.getChildByName("Sprite");

        this.AtkAnim=this.node.getChildByName("Sprite").getComponent(Animation);
        this.hpSprite=this.roleSprite.getChildByName("Hp").getComponent(Sprite);
        this.atkSprite=this.roleSprite.getChildByName("Atk").getComponent(Sprite);
        //资源暂时没有
    }

    async Refresh(roleInfo:Role) {
        this.roleInfo = roleInfo;

        await this.changeAtt();   
    }

    Attack(camp:Camp)
    {
        this.roleSprite.setSiblingIndex(3);
        if(Camp.Self==camp)
        {
            this.AtkAnim.play("Attack");
        }
        if(Camp.Enemy==camp)
        {
            this.AtkAnim.play("EnemyAttack");
        }
        if(this.AtkAnim)
        {
            this.AtkAnim.on(AnimationComponent.EventType.STOP,()=>
            {
                this.roleSprite.setSiblingIndex(0);
            })
        }
        //this.changeAtt();
    }

    async changeAtt()
    {
        this.Hp=this.roleInfo.GetProperty(Property.HP);
        this.AtkNum=this.roleInfo.GetProperty(Property.Attack);

        let imgHp = await BundleManager.Instance.loadImg(`https://www.ucat.games:8001/zzq/Num/hp_${this.Hp}.png`);
        let imgAttack = await BundleManager.Instance.loadImg(`https://www.ucat.games:8001/zzq/Num/attack_${this.AtkNum}.png`);

        this.hpSprite.spriteFrame = SpriteFrame.createWithImage(imgHp);
        this.atkSprite.spriteFrame = SpriteFrame.createWithImage(imgAttack);
    }

    RemoteAttack(ev:skill.Event)
    {
        for(let role of ev.recipient)
        {
            let newNode=instantiate(this.remoteNode);
            let tempRole=find("Canvas/EnemyQueue").children[role.index];
            newNode.getComponent(Bullet).target=tempRole;
            this.schedule(null,0.2);
        }
        
    }
    
}


