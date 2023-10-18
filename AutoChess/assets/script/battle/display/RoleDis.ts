/*
 * RoleDis.ts
 * author: Hotaru
 * 2023/10/04
 * 角色展示类
 */
import { _decorator, animation, CCInteger, Component, Sprite, tween, Node, Vec3, Animation, SpriteFrame, AnimationComponent, Prefab, instantiate, find, RichText, settings, Tween } from 'cc';
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

    private hpText:RichText;
    private atkText:RichText;

    private roleSprite:Node;
    
    protected onLoad(): void 
    {
        try
        {
            console.log("onLoad begin!");

            this.roleSprite=this.node.getChildByName("Sprite");
            this.AtkAnim=this.node.getChildByName("Sprite").getComponent(Animation);
            this.hpText=this.roleSprite.getChildByPath("Hp/HpText").getComponent(RichText);
            this.atkText=this.roleSprite.getChildByPath("Atk/AtkText").getComponent(RichText);

            if (this.roleInfo) {
                if (this.hpText && this.atkText) {
                    this.hpText.string="<color=#ad0003><outline color=#f05856 width=4>"+this.Hp+"</outline></color>";
                    this.atkText.string="<color=#ffa900><outline color=#ffe900 width=4>"+this.AtkNum+"</outline></color>";
                }
            }

            this.AttackInit();
            
            console.log("onLoad end!");
        }
        catch(err)
        {
            console.warn("RoleDis 里的 onLoad 函数错误 err:"+err);
        }
    }

    start() 
    {
        
    }

    async Refresh(roleInfo:Role) {
        await this.changeAtt(roleInfo);   
    }

    delay(ms:number, release:() => void) : Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
                release();
            }, ms);
        });
    }
    
    private originalPos:Vec3;
    AttackInit() {
        this.originalPos = new Vec3(this.node.position); 
    }

    private tAttack:Tween<Node> = null;
    Attack(readyLocation:Vec3, battleLocation:Vec3) {
        this.tAttack = tween(this.node)
            .to(0.5, { position: readyLocation })
            .delay(0.1)
            .to(0.3, { position: battleLocation })
            .delay(0.1)
            .to(0.3, { position: this.originalPos })
            .start();

        return this.delay(1500, ()=>{ 
            if (this.tAttack) {
                this.tAttack.stop(); 
                this.tAttack = null;
            }
        });
    }

    changeAtt(roleInfo:Role)
    {
        try
        {
            this.roleInfo=roleInfo;

            this.Hp=this.roleInfo.GetProperty(Property.HP);
            this.AtkNum=this.roleInfo.GetProperty(Property.Attack);

            if (this.hpText && this.atkText) {
                this.hpText.string="<color=#ad0003><outline color=#f05856 width=4>"+this.Hp+"</outline></color>";
                this.atkText.string="<color=#ffa900><outline color=#ffe900 width=4>"+this.AtkNum+"</outline></color>";
            }
        }
        catch(err)
        {
            console.warn("RoleDis 里的 changeAtt 函数错误 err:"+err);
        }
    }
    
    RemoteAttack(spellcasterLocation:Vec3, targetLocation:Vec3)
    {
        // for(let role of ev.recipient)
        // {
        //     let newNode=instantiate(this.remoteNode);
        //     let tempRole=find("Canvas/EnemyQueue").children[role.index];
        //     newNode.getComponent(Bullet).target=tempRole;
        //     this.schedule(null,0.2);
        // }
        //生成子弹，从发射者位置到达目标位置
        console.log("进行远程攻击");
        let bulletNode=instantiate(this.remoteNode);
        bulletNode.setPosition(spellcasterLocation);
        //let tempRole=find("Canvas/EnemyQueue").children[role.index];
        bulletNode.getComponent(Bullet).Init(targetLocation);
        this.schedule(null,0.2);
    }
    
    Exit()
    {
        /*
         * 退场效果。。。
         */
        this.node.destroy();
    }
}


