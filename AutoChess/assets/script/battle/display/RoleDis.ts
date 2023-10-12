/*
 * RoleDis.ts
 * author: Hotaru
 * 2023/10/04
 * 角色展示类
 */
import { _decorator, animation, CCInteger, Component, Enum, Node , Animation, RichText, AnimationComponent, Prefab, instantiate, find } from 'cc';
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
    public remoteNode:Node;

    public Hp:number;
    public AtkNum:number;

    public Level:number;

    private roleInfo:Role=null;
    private battle:Battle=new Battle();

    private AtkAnim:Animation;

    private hpText:RichText;
    private atkText:RichText;

    private roleSprite:Node;
    //private nGame:netGame=new netGame();

    start() 
    {
        //this.nGame.cb_battle=(self,target)=>
        //{  
        //};
        
        this.roleSprite=this.node.getChildByName("Sprite");

        this.AtkAnim=this.node.getChildByName("Sprite").getComponent(Animation);
        this.hpText=this.node.getChildByName("Hp").getComponentInChildren(RichText);
        this.atkText=this.node.getChildByName("Atk").getComponentInChildren(RichText);
        //资源暂时没有
        this.remoteNode=BundleManager.Instance.loadAssets("","");

        this.changeAtt();   
    }

    Attack()
    {
        this.roleSprite.setSiblingIndex(3);
        this.AtkAnim.play("Attack");
        if(this.AtkAnim)
        {
            this.AtkAnim.on(AnimationComponent.EventType.STOP,()=>
            {
                this.roleSprite.setSiblingIndex(0);
            })
        }
        //this.changeAtt();
    }

    EnemyAttack()
    {
        this.roleSprite.setSiblingIndex(3);
        this.AtkAnim.play("EnemyAttack");
        if(this.AtkAnim)
        {
            this.AtkAnim.on(AnimationComponent.EventType.STOP,()=>
            {
                this.roleSprite.setSiblingIndex(0);
            })
        }
        //this.changeAtt();
    }

    changeAtt()
    {
        this.Hp=this.roleInfo.GetProperty(Property.HP);
        this.AtkAnim=this.AtkNum=this.roleInfo.GetProperty(Property.Attack);
        this.hpText.string="<color=#00ff00>"+this.Hp+"</color>";
        this.atkText.string="<color=#00ff00>"+this.AtkNum+"</color>";
    }

    RemoteAttack(ev:skill.Event)
    {
        for(let role of ev.recipient)
        {
            let newNode=instantiate(this.remoteNode);
            let tempRole=find("Canvas/EnemyQueue").children[role.index];
            newNode.getComponent(Bullet).target=tempRole;
        }
        
    }
    
}


