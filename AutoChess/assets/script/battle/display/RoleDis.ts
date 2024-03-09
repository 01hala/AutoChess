/*
 * RoleDis.ts
 * author: Hotaru
 * 2023/10/04
 * 角色展示类
 */
import { _decorator, animation, CCInteger, Component, Sprite, tween, Node, Vec3, Animation, SpriteFrame, AnimationComponent, Prefab, instantiate, find, RichText, settings, Tween, math, Texture2D, sp } from 'cc';
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
import { Fetters } from '../../serverSDK/common';
import { config } from '../../config/config';
import { loadAssets } from '../../bundle/LoadAsset';
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
    //角色立绘(骨骼动画)
    public roleSprite:sp.Skeleton;
    //角色信息
    private roleInfo: Role = null;
    //生命和攻击文本
    private hpText: RichText;
    private atkText: RichText;
    //等级光圈
    private levelSprite: Node;
    //增益提示
    private intensifierText: Node;
    private behurtedText:Node;
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

    protected async onLoad(): Promise<void> {
        try {
            this.levelSprite = this.node.getChildByName("LevelSprite");
            this.intensifierText = this.node.getChildByName("IntensifierText");
            this.bandage = this.node.getChildByName("Bandage");
            this.behurtedText=this.node.getChildByName("BeHurtedText");

            this.bandage.active = false;
            this.intensifierText.active = false;
            this.behurtedText.active=false;
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

    async Refresh(roleInfo: Role,isnew?:boolean) 
    {
        this.roleInfo = roleInfo;
        if(isnew)
        {
            this.RoleId=roleInfo.id;
            let str="Role_"+this.RoleId;
            if(null==this.idText)
            {
                this.idText=this.node.getChildByPath("ID").getComponent(RichText);
            }
            this.idText.string="<color=#9d0c27>"+this.roleInfo.id;
            // let sf:sp.SkeletonData=await this.LoadImg("RolesImg",str);
            // if(sf)
            // {
            //     this.node.getChildByName("Sprite").getComponent(Sprite).spriteFrame=sf;   
            //     this.roleSprite=sf;             
            // }
            await this.LoadOnConfig();

        }
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

    GetRoleFetter():Fetters
    {
        if(this.roleInfo) return this.roleInfo.fetter;
    }

    AttackInit() 
    {
        this.originalPos = new Vec3(this.node.position);
    }

    Attack(readyLocation: Vec3, battleLocation: Vec3, camp: Camp ) 
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

    async changeAtt() 
    {
        try 
        {
            //this.roleInfo=roleInfo;
            
            this.Hp = Math.round(this.roleInfo.GetProperty(Property.HP));
            this.AtkNum = Math.round(this.roleInfo.GetProperty(Property.Attack));
            this.Level=this.roleInfo.level;
            if (this.hpText && this.atkText) 
            {
                this.hpText.string = "<color=#9d0c27><outline color=#e93552 width=4>" + this.Hp + "</outline></color>";
                this.atkText.string = "<color=#f99b08><outline color=#fff457 width=4>" + this.AtkNum + "</outline></color>";
            }
            let str="lvl_"+this.Level;
            let lvlsf:SpriteFrame=await this.LoadImg("LvRing",str);
            if(lvlsf)
            {   
                this.levelSprite.getComponent(Sprite).spriteFrame=lvlsf;
            }
        }
        catch (err) 
        {
            console.warn("RoleDis 下的 changeAtt 错误 err:" + err);
        }

        return this.delay(300, () => { });
    }

    async BeHurted(_value:number)
    {
        try
        {
            let hurtedAnim: Animation=this.behurtedText.getComponent(Animation);
            hurtedAnim.on(Animation.EventType.FINISHED, () => 
            {
                hurtedAnim.stop();
                this.behurtedText.active = false;
                hurtedAnim.resume();
            }, this);
            let hitAnim:Animation=this.node.getChildByName("Sprite").getComponent(Animation);

            tween(this.node).to(0,{}).call(()=>
            {
                hurtedAnim.resume();
                hitAnim.resume();
                this.behurtedText.getComponent(RichText).string="<color=#ad0003><outline color=#f05856 width=4>-" + _value + "</outline></color>";
                this.behurtedText.active=true;
                hurtedAnim.play();
                hitAnim.play();
            }).start();

            return this.delay(700,()=>
            {
                
            });
        }
        catch(err)
        {
            console.error("RoleDis 下的 BeHurted 错误 err:" + err);
        }
    }

    async Intensifier(value: number[],stack?:number) 
    {
        try 
        {
            let anim: Animation = this.intensifierText.getComponent(Animation);
            anim.on(Animation.EventType.FINISHED, () => 
            {
                anim.stop();
                this.intensifierText.active = false;
                anim.resume();
            }, this);

            if(stack)
            {
                this.Exp=stack%3;
            }
            let newtween:Tween<Node>=tween(this.node).to(0,{}).call(()=>
            {   
                if (0 != value[0]) 
                {
                    anim.resume();
                    this.intensifierText.getComponent(RichText).string = "<color=#ad0003><outline color=#f05856 width=4>+" + value[0] + "</outline></color>";
                    this.intensifierText.active = true;
                    anim.play();
                    console.log("生命值增加");
                }
            }).delay(0.7).call(()=>
            {
                if (0 != value[1]) 
                {
                    anim.resume();
                    this.intensifierText.getComponent(RichText).string = "<color=#ffa900><outline color=#ffe900 width=4>+" + value[1] + "</outline></color>";
                    this.intensifierText.active = true;
                    anim.play();
                    console.log("攻击力增加");
                }
                
            }).delay(0.7).call(()=>
            {
                this.changeAtt();
                anim.stop();
                this.intensifierText.active = false;
            }).start();

            return this.delay(1500,()=>
            {
                if(newtween)
                {
                    newtween.stop();
                    newtween=null;
                }
            })
        }
        catch (err) 
        {
            console.warn("RoleDis 下的 Intensifier 错误 err:" + err);
        }

    }

    //缓动有bug暂时空置
    async LevelUp()
    {
        try
        {
            //let str="lvl_"+_level;
            //let sf:SpriteFrame=await this.LoadImg("LvRing",str);
            tween(this.node).to(0.1,
                {
                    //scale:new Vec3(1.1,1.1,1)
                })
            .call(()=>
            {
                //this.Level=_level;
                //if(sf)
                //{
                    //this.levelSprite.getComponent(Sprite).spriteFrame=sf;
                //}
            })
            .delay(0.1).to(0.1,
                {
                    //scale:new Vec3(1,1,1)
                })
            .start();

            return this.delay(300,()=>
            {
                
            })
        }
        catch(error)
        {
            console.error("RoleDis 下的 LevelUp 错误 err:" + error);
        }
        
    }

    ShiftPos(vec:Vec3,atkInit?:boolean)
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
            if(atkInit) this.AttackInit();
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

    private LoadImg(_bundle:string,_address:string):Promise<SpriteFrame>
    {
        return new Promise(async (resolve)=>
        {
            let imgRes=""+_address;
            let temp=await BundleManager.Instance.LoadImgsFromBundle(_bundle, imgRes);
            if(null==temp)
            {
                 console.warn('RoleDis 里的 LoadImg 异常 : bundle中没有此角色图片,替换为默认角色图片');
                 resolve(null);
                 //imgRes=""+_address+1001;
                 //temp=await BundleManager.Instance.LoadImgsFromBundle(_bundle, imgRes);
            }
            let texture=new Texture2D();
            texture.image=temp;
            let sp=new SpriteFrame();
            sp.texture=texture;  
            resolve(sp);
        });
    }
/*
 * 添加
 * author：Hotaru
 * 2024/03/06
 * 从配置文件加载
 */
    private async LoadOnConfig()
    {
        let jconfig = config.RoleConfig.get(this.RoleId);
        let skdata = await loadAssets.LoadSkeletonData(jconfig.Skel);
        this.roleSprite=this.node.getChildByPath("Sprite").getComponent(sp.Skeleton);
        if(skdata)
        {
            this.roleSprite.skeletonData=skdata;
            this.roleSprite.animation="animation";
        }
    }
}


