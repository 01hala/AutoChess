/*
 * RoleDis.ts
 * author: Hotaru
 * 2023/10/04
 * 角色展示类
 */
import { _decorator, animation, CCInteger, Component, Sprite, tween, Node, Vec3, Animation, SpriteFrame, AnimationComponent, Prefab, instantiate, find, RichText, settings, Tween, math } from 'cc';
import { Role } from '../../battle/role';
import { Camp, EventType, Property } from '../../other/enums';
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
        type: CCInteger,
        displayName: "角色ID"
    })
    public RoleId: number;

    @property({
        type: Prefab,
        displayName: "子弹预制体"
    })
    public remoteNode: Prefab;
    //血量和攻击
    public Hp: number;
    public AtkNum: number;
    //等级和经验
    public Level: number;
    public Exp:number;
    //角色信息
    private roleInfo: Role = null;
    //生命和攻击文本
    private hpText: RichText;
    private atkText: RichText;
    //等级光圈
    private levelSprite: Node;
    //增益提示
    private intensifierText: Node;
    //受伤效果
    private bandage: Node;
    //字体
    private typeface: any;
    //攻击缓动
    private tAttack: Tween<Node> = null;
    //位移缓动
    private tShiftpos: Tween<Node> = null;

    private originalPos: Vec3;

    private idText:RichText;

    protected onLoad(): void {
        try {
            this.levelSprite = this.node.getChildByName("LevelSprite");
            this.intensifierText = this.node.getChildByName("IntensifierText");
            this.bandage = this.node.getChildByName("Bandage");
            this.bandage.active = false;
            this.intensifierText.active = false;
            this.hpText = this.node.getChildByPath("Hp/HpText").getComponent(RichText);
            this.atkText = this.node.getChildByPath("Atk/AtkText").getComponent(RichText);

            this.idText=this.node.getChildByPath("ID").getComponent(RichText);
            //this.typeface = BundleManager.Instance.loadAssetsFromBundle("Typeface", "MAOKENASSORTEDSANS");
            //this.hpText.font = this.atkText.font = this.typeface;

            

            this.AttackInit();
        }
        catch (err) {
            console.warn("RoleDis 下的 onLoad 错误 err:" + err);
        }
    }

    start() 
    {
        if (this.roleInfo) {
            if (this.hpText && this.atkText) {
                this.hpText.string = "<color=#9d0c27><outline color=#e93552 width=4>" + this.Hp + "</outline></color>";
                this.atkText.string = "<color=#f99b08><outline color=#fff457 width=4>" + this.AtkNum + "</outline></color>";

                this.idText.string="<color=#9d0c27>"+this.roleInfo.id;
            }
        }
    }

    async Refresh(roleInfo: Role) 
    {
        this.roleInfo = roleInfo;
        await this.changeAtt();
    }

    delay(ms: number, release: () => void): Promise<void> 
    {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
                release();
            }, ms);
        });
    }


    AttackInit() 
    {
        this.originalPos = new Vec3(this.node.position);
    }

    Attack(readyLocation: Vec3, battleLocation: Vec3, camp: Camp) 
    {
        try 
        {
            this.tAttack = tween(this.node)
                .to(0.4, { position: readyLocation })
                .delay(0.1)
                .to(0.08, { position: battleLocation }).call(() => {
                    this.changeAtt();
                    if (Camp.Self == camp) {
                        singleton.netSingleton.battle.showBattleEffect(true);
                    }
                })
                .delay(0.1).call(() => {
                    if (Camp.Self == camp) {
                        singleton.netSingleton.battle.showBattleEffect(false);
                    }
                })
                .to(0.2, { position: this.originalPos })
                .start();

            return this.delay(1200, () => 
            {
                if (this.tAttack) {
                    this.tAttack.stop();
                    this.tAttack = null;
                }
            });
        }

        catch (err) 
        {
            console.warn("RoleDis 下的 Attack 错误 err:" + err);
        }
    }

    changeAtt() 
    {
        try 
        {
            //this.roleInfo=roleInfo;
            
            this.Hp = Math.round(this.roleInfo.GetProperty(Property.HP));
            this.AtkNum = Math.round(this.roleInfo.GetProperty(Property.Attack));
            this.idText.string="<color=#9d0c27>"+this.roleInfo.id;
            if (this.hpText && this.atkText) {
                this.hpText.string = "<color=#9d0c27><outline color=#e93552 width=4>" + this.Hp + "</outline></color>";
                this.atkText.string = "<color=#f99b08><outline color=#fff457 width=4>" + this.AtkNum + "</outline></color>";
            }
        }
        catch (err) 
        {
            console.warn("RoleDis 下的 changeAtt 错误 err:" + err);
        }

        return this.delay(300, () => { });
    }

    async Intensifier(value: number[]) 
    {
        try 
        {
            let type: Property;
            let anim: Animation = this.intensifierText.getComponent(Animation);
            let wait: boolean;
            anim.on(Animation.EventType.FINISHED, () => 
            {
                anim.stop();
                this.intensifierText.active = false;
                anim.resume();
            }, this);

            tween(this.node).to(0,{}).call(()=>
            {   
                if (0 != value[0]) 
                {
                    anim.resume();
                    this.intensifierText.getComponent(RichText).string = "<color=#ad0003><outline color=#f05856 width=4>+" + value[0] + "</outline></color>";
                    this.intensifierText.active = true;
                    anim.play();
                }
            }).delay(0.7).call(()=>
            {
                if (0 != value[1]) 
                {
                    anim.resume();
                    this.intensifierText.getComponent(RichText).string = "<color=#ffa900><outline color=#ffe900 width=4>+" + value[1] + "</outline></color>";
                    this.intensifierText.active = true;
                    anim.play();
                }
                
            }).delay(0.7).call(()=>
            {
                this.changeAtt();
                anim.stop();
                this.intensifierText.active = false;
            }).start();

            return this.delay(1500,()=>
            {
                
            })
        }
        catch (err) 
        {
            console.warn("RoleDis 下的 Intensifier 错误 err:" + err);
        }

    }

    ShiftPos(vec:Vec3)
    {
        console.log(`shiftPos begin!`);
        //开始缓动
        this.tShiftpos = tween(this.node).to(0.3, { position: vec }).start();
        //返回延迟300ms
        return this.delay(300, () => 
        {
            if (this.tShiftpos) {
                this.tShiftpos.stop();
                this.tShiftpos = null;
                console.log("shiftPos end!");
            }
        });
    }

    RemoteAttack(spellcasterLocation: Vec3, targetLocation: Vec3, father: Node) 
    {
        try 
        {
            let bulletNode = instantiate(this.remoteNode);
            bulletNode.setPosition(spellcasterLocation);
            //let tempRole=find("Canvas/EnemyQueue").children[role.index];
            console.log(bulletNode);
            bulletNode.getComponent(Bullet).Init(targetLocation);
            father.addChild(bulletNode);
            //this.delay(700, () => { });
            return this.delay(700, () => 
            {
                // if (this.tAttack) {
                //     this.tAttack.stop();
                //     this.tAttack = null;
                //     console.log("RemoteAttack end!");
                // }
            });
        }
        catch (err) 
        {
            console.warn("RoleDis 下的 RemoteAttack 错误 err:" + err);
        }
    }

    LevelUp()
    {
        
    }

    Exit() 
    {
        try 
        {
            this.bandage.getComponent(Animation).on(Animation.EventType.FINISHED, () => 
            {
                singleton.netSingleton.battle.showBattleEffect(false);
                this.node.active = false;
            });
            this.bandage.active = true;
            this.bandage.getComponent(Animation).play();
            return this.delay(200, () => 
            {
                this.roleInfo = null;
                console.log("销毁角色");
                this.node.destroy();
            });
        }
        catch (err) 
        {
            console.warn("RoleDis 下的 Exit 错误 err:" + err);
        }

    }
}


