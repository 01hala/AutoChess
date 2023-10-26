/*
 * RoleDis.ts
 * author: Hotaru
 * 2023/10/04
 * ��ɫչʾ��
 */
import { _decorator, animation, CCInteger, Component, Sprite, tween, Node, Vec3, Animation, SpriteFrame, AnimationComponent, Prefab, instantiate, find, RichText, settings, Tween } from 'cc';
import { Role } from '../../battle/role';
import { Camp , EventType, Property} from '../../other/enums';
import { Battle } from '../../battle/battle';
import * as skill from '../../battle/skill/skill_base'
import { netDriver } from '../../netDriver/netDriver';
import { netGame } from '../../netDriver/netGame';
import { hub_call_gate_reverse_reg_client_hub_rsp } from '../../serverSDK/gate';
import { BundleManager } from '../../bundle/BundleManager';
import { Bullet } from './Bullet';
import * as singleton from '../../netDriver/netSingleton';
const { ccclass, property } = _decorator;

@ccclass('RoleDis')
export class RoleDis extends Component 
{
    @property({
        type:CCInteger,
        displayName:"��ɫID"
    })
    public RoleId:number;

    @property({
        type:Prefab,
        displayName:"Զ�̹�����"
    })
    public remoteNode:Prefab;

    public Hp:number;
    public AtkNum:number;

    public Level:number;

    private roleInfo:Role=null;

    private hpText:RichText;
    private atkText:RichText;

    private roleSprite:Node;
    private intensifierText:Node;
    private bandage:Node;

    private typeface:any;
    
    protected onLoad(): void 
    {
        try
        {
            this.roleSprite=this.node.getChildByName("Sprite");
            this.intensifierText=this.node.getChildByName("IntensifierText");
            this.bandage=this.node.getChildByName("Bandage");
            this.bandage.active=false;
            this.intensifierText.active=false;
            this.hpText=this.node.getChildByPath("Hp/HpText").getComponent(RichText);
            this.atkText=this.node.getChildByPath("Atk/AtkText").getComponent(RichText);
            
            this.typeface=BundleManager.Instance.loadAssetsFromBundle("Typeface","MAOKENASSORTEDSANS");
            this.hpText.font=this.atkText.font=this.typeface;

            if (this.roleInfo) {
                if (this.hpText && this.atkText) {
                    this.hpText.string="<color=#ad0003><outline color=#f05856 width=4>"+this.Hp+"</outline></color>";
                    this.atkText.string="<color=#ffa900><outline color=#ffe900 width=4>"+this.AtkNum+"</outline></color>";
                }
            }

            this.AttackInit();
        }
        catch(err)
        {
            console.warn("RoleDis ��� onLoad �������� err:"+err);
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

    Attack(readyLocation:Vec3, battleLocation:Vec3 , camp:Camp) 
    {
        console.log(`Attack begin! selfCamp:${this.roleInfo.selfCamp}`);
        this.tAttack = tween(this.node)
            .to(0.4, { position: readyLocation })
            .delay(0.1)
            .to(0.1, { position: battleLocation }).call(()=>
            {
                if(Camp.Self==camp) {
                    singleton.netSingleton.battle.showBattleEffect(true);
                }
            })
            .delay(0.1).call(()=>
            {
                if(Camp.Self==camp) {
                    singleton.netSingleton.battle.showBattleEffect(false);
                }
            })
            .to(0.3, { position: this.originalPos })
            .start();

        return this.delay(1200, ()=>{ 
            if (this.tAttack) {
                this.tAttack.stop(); 
                this.tAttack = null;
                console.log("Attack end!");
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
            console.warn("RoleDis ��� changeAtt �������� err:"+err);
        }
    }

    Intensifier(value:number[])
    {
        let type:Property;
        let anim:Animation=this.intensifierText.getComponent(Animation);
        let wait:boolean;//�ȴ����أ���������ʱ����
        anim.on(Animation.EventType.FINISHED,()=>
        {
            this.intensifierText.active=false;
        },this);

        anim.on(Animation.EventType.PLAY,()=>
        {
            wait=true;
        },this);

        if(0!=value[0])
        {
            wait=false;
            this.intensifierText.getComponent(RichText).string="<color=#ad0003><outline color=#f05856 width=4>+"+value[0]+"</outline></color>";
            this.intensifierText.active=true;
            anim.play();
        }
        if(wait) 
        {
            this.delay(300,()=>{});//�ȴ�0.3��
        }
        if(0!=value[1])
        {
            wait=false;
            this.intensifierText.getComponent(RichText).string="<color=#ffa900><outline color=#ffe900 width=4>+"+value[1]+"</outline></color>"
            this.intensifierText.active=true;
            anim.play();
        }
        this.delay(300,()=>{});//�ȴ�0.3��
    }

    RemoteAttack(spellcasterLocation:Vec3, targetLocation:Vec3)
    {
        console.log("remoteatk");
        let bulletNode=instantiate(this.remoteNode);
        bulletNode.setPosition(spellcasterLocation);
        bulletNode.getComponent(Bullet).Init(targetLocation);
        //let tempRole=find("Canvas/EnemyQueue").children[role.index];   
        //this.delay(300,()=>{});
    }
    
    Exit()
    {
        /*
         * �˳�Ч��������
         */
        try
        {
            this.bandage.getComponent(Animation).on(Animation.EventType.FINISHED,()=>
            {
                singleton.netSingleton.battle.showBattleEffect(false);
                this.node.destroy();
                //this.node.active=false;
            });
            this.bandage.active=true;
            this.bandage.getComponent(Animation).play();
            return this.delay(800,()=>{});
        }
        catch(err)
        {
            console.warn("RoleDis ��� Exit �������� err:"+err);
        }
        
    }
}


