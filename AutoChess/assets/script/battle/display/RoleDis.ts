/*
 * RoleDis.ts
 * author: Hotaru
 * 2023/10/04
 * 角色展示类
 */
import { _decorator, animation, CCInteger, TTFFont, Component, Sprite, tween, Node, Vec3, Animation, SpriteFrame, AnimationComponent, Prefab, instantiate, find, RichText, settings, Tween, math, Texture2D, sp, Skeleton, Quat, color, Event, Button, UITransform, game, director } from 'cc';
import { Role } from '../AutoChessBattle//role';
import * as BattleEnums from '../AutoChessBattle/enum';
import * as enums from '../../other/enums';
import { Battle } from '../AutoChessBattle//battle';
import * as skill from '../AutoChessBattle//skill/skill_base'
import { netDriver } from '../../netDriver/netDriver';
import { netGame } from '../../netDriver/netGame';
import { hub_call_gate_reverse_reg_client_hub_rsp } from '../../serverSDK/gate';
import { BundleManager } from '../../bundle/BundleManager';
import { Bullet } from './Bullet';
import * as singleton from '../../netDriver/netSingleton';
import { Fetters } from '../AutoChessBattle/common';
import { config } from '../AutoChessBattle/config/config';
import { loadAssets } from '../../bundle/LoadAsset';
import { sleep } from '../../other/sleep';
import { AudioManager } from '../../other/AudioManager';
import { SendMessage } from '../../other/MessageEvent';
import * as common from '../../battle/AutoChessBattle/common';
import { EffectSpine } from './EffectSpine';
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

    @property({
        type: Prefab,
        displayName: "增益提示"
    })
    public intensifierTip:Prefab;
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
    private levelText:RichText;
    //提示字符
    private behurtedTextEffect:Node;
    private beHurtedText:Node;
    //受伤效果
    private bandage: Node;
    private hurtedSpine:Node;
    //攻击缓动
    private tAttack: Tween<Node> = null;
    //位移缓动
    private tShiftpos: Tween<Node> = null;

    private isDead=false;

    private originalPos: Vec3;

    private idText:RichText;

    private typeface: TTFFont;
    //特效效果
    private effectSpine:Node;

    protected async onLoad(): Promise<void> 
    {
        try {
            this.typeface = (await BundleManager.Instance.loadAssetsFromBundle("Typeface", "MAOKENASSORTEDSANS")) as TTFFont;

            //this.levelSprite = this.node.getChildByName("LevelSprite");
            this.bandage = this.node.getChildByName("Bandage");
            this.behurtedTextEffect=this.node.getChildByName("BeHertedTextEffect");
            this.beHurtedText=this.behurtedTextEffect.getChildByName("BeHurtedText");
            this.hurtedSpine=this.node.getChildByPath("BeHurtedSpine");
            this.effectSpine=this.node.getChildByPath("EffectSpine");

            this.bandage.active = false;
            this.behurtedTextEffect.active=false;
            this.hurtedSpine.active=false;
            this.hpText = this.node.getChildByPath("Hp/HpText").getComponent(RichText);
            this.atkText = this.node.getChildByPath("Atk/AtkText").getComponent(RichText);
            this.levelText=this.node.getChildByPath("Level/LevelText").getComponent(RichText);
            
            this.idText=this.node.getChildByPath("ID").getComponent(RichText);
            //this.typeface = BundleManager.Instance.loadAssetsFromBundle("Typeface", "MAOKENASSORTEDSANS");
            //this.hpText.font = this.atkText.font = this.typeface;

            this.AttackInit();
        }
        catch (err) {
            console.warn("RoleDis 下的 onLoad 错误 err:" + err);
        }
    }
    

    async start() 
    {
        if (this.roleInfo) {
            if (this.hpText && this.atkText) {
                this.hpText.string = "<color=#9d0c27><outline color=#e93552 width=4>" + this.Hp + "</outline></color>";
                this.atkText.string = "<color=#f99b08><outline color=#fff457 width=4>" + this.AtkNum + "</outline></color>";
                this.levelText.string="<color=#7CFC0><outline color=#7FFF00 width=4>"+ this.Level + "</outline></color>";

                this.idText.string="<color=#9d0c27>"+this.roleInfo.id;
            }
        }

        if(null == this.intensifierTip)
        {
            this.intensifierTip = await BundleManager.Instance.loadAssetsFromBundle("TextTipBar","IntensifierTip") as Prefab;
        }

        if(null == singleton.netSingleton.battle)
        {
            this.node.getComponent(Button).enabled=false;
        }
        else
        {
            this.node.on(Button.EventType.CLICK, () =>
            {
                if (singleton.netSingleton.battle)
                {
                    singleton.netSingleton.battle.puase = true;
                    AudioManager.Instance.PlayerOnShot("Sound/sound_click_01");
                    this.node.dispatchEvent(new SendMessage('OpenInfoBoard', true, { id: this.RoleId, role: this.node.getComponent(RoleDis), isBuy: true }));
                }
            })
        }
    }

    async Refresh(roleInfo: Role,isnew?:boolean) 
    {
        try
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
            this.changeAtt();
        }
        catch(error)
        {
            console.error("RoleDis 下的 Refresh 错误 err:" + error);
        }
    }

    delay(ms: number, release: () => void): Promise<void> 
    {
        return new Promise((resolve) => {
            setTimeout(async () => {
                await release();
                resolve();
            }, ms);
        });
    }

    GetRoleFetter():Fetters
    {
        if(this.roleInfo) return this.roleInfo.fetter;
    }
    
    GetRoleSkillID():number
    {
        if(this.roleInfo) return this.roleInfo.skillid;
    }

    GetRoleInfo()
    {
        if(this.roleInfo) return this.roleInfo;
    }

    AttackInit() 
    {
        this.originalPos = new Vec3(this.node.position);
    }

    Attack(readyLocation: Vec3, battleLocation: Vec3, camp: BattleEnums.Camp ) 
    {
        try 
        {
            this.node.setSiblingIndex(90);
            this.tAttack = tween(this.node)
                .to(0.15, { worldPosition: readyLocation })
                //这里做出蓄力效果
                .delay(0.1)
                .to(0.05,{worldPosition:new Vec3(readyLocation.x+15,readyLocation.y,readyLocation.z)})
                .to(0.05,{worldPosition:new Vec3(readyLocation.x-15,readyLocation.y,readyLocation.z)})
                .to(0.05,{worldPosition:new Vec3(readyLocation.x,readyLocation.y+15,readyLocation.z)})
                .to(0.05,{worldPosition:new Vec3(readyLocation.x,readyLocation.y-15,readyLocation.z)}) 
                //上面是蓄力效果
                .to(0.05, { worldPosition: battleLocation })
                .call(() => {
                    if (BattleEnums.Camp.Self == camp) {
                        singleton.netSingleton.battle.showBattleEffect(true);
                        // let roleConfig = config.RoleConfig.get(this.RoleId);
                        // let audioString="Sound/sound_character_hit_MN";
                        // if(undefined!=roleConfig.Sex&&undefined!=roleConfig.Armor){
                        //     audioString="Sound/sound_character_hit_"+roleConfig.Sex+roleConfig.Armor;
                        // }
                        // AudioManager.Instance.PlayerOnShot(audioString);
                    }
                })
                .delay(0.1).call(() => {
                    if (BattleEnums.Camp.Self == camp) {
                        singleton.netSingleton.battle.showBattleEffect(false);
                    }
                })
                .call(async () => {
                    await this.changeAtt();
                    this.ResetPos(readyLocation);
                })
                // .to(0.1, { position: readyLocation })
                .start();

            return this.delay(450, () => 
            {
                // if (this.tAttack) {
                //     this.tAttack.stop();
                //     this.tAttack = null;
                // }
            });
        }

        catch (err) 
        {
            console.error("RoleDis 下的 Attack 错误 err:" + err);
        }
    }

    //异步执行将对撞角色归位，防止阻碍到后续判断
    async ResetPos(readyLocation: Vec3){
        this.tAttack = tween(this.node)
        .to(0.1, { worldPosition: readyLocation }).start();
        return this.delay(100, () => 
        {
            if (this.tAttack) {
                this.tAttack.stop();
                this.tAttack = null;
            }
        });
    }

    async changeAtt() 
    {
        try 
        {
            if(this.roleInfo.getShields())
            {
                if(null == this.effectSpine)
                {
                    this.effectSpine=this.node.getChildByPath("EffectSpine");
                }
                this.effectSpine.getComponent(EffectSpine).RemoveEffect(enums.SpecialEffect.Shields);
            }
            
            
            this.Level=this.roleInfo.level;

            if(null==this.hpText && null==this.atkText)
            {
                this.hpText = this.node.getChildByPath("Hp/HpText").getComponent(RichText);
                this.atkText = this.node.getChildByPath("Atk/AtkText").getComponent(RichText);
                this.levelText=this.node.getChildByPath("Level/LevelText").getComponent(RichText);
            }

            let _hp=Math.round(this.roleInfo.GetProperty(BattleEnums.Property.HP));
            if(this.Hp!=_hp)
            {
                tween(this.hpText.node).to(0.2, { scale: new Vec3(0, 0, 0) }).call(() =>
                {
                    this.hpText.string = "<color=#9d0c27><outline color=#e93552 width=4>" + _hp + "</outline></color>";
                    this.Hp = _hp;
                }).by(0.2,{scale: new Vec3(1,1,1)}).start();
               
            }
            let _atk=Math.round(this.roleInfo.GetProperty(BattleEnums.Property.Attack));
            if(this.AtkNum!=_atk)
            {
                tween(this.atkText.node).to(0.2, { scale: new Vec3(0, 0, 0) }).call(() =>
                {
                    this.atkText.string = "<color=#f99b08><outline color=#fff457 width=4>" + _atk + "</outline></color>";
                    this.AtkNum = _atk
                }).by(0.2,{scale: new Vec3(1,1,1)}).start();
            }
            if(this.Level != this.roleInfo.level)
            {
                tween(this.levelText.node).to(0.2, { scale: new Vec3(0, 0, 0) }).call(() =>
                {
                    this.levelText.string = "<color=#7CFC0><outline color=#7FFF00 width=4>" + this.roleInfo.level + "</outline></color>";
                    this.Level = this.roleInfo.level;
                }).by(0.2, { scale: new Vec3(1, 1, 1) }).start();
            }
            
            //console.log("changeAtt RoleDis.roleInfo:", this.roleInfo);
            //console.log("changeAtt RoleDis:", this);
        }
        catch (err) 
        {
            console.error("RoleDis 下的 changeAtt 错误 err:" + err);
        }

        return this.delay(100, () => { });
    }

    async BeHurted(_value:number)
    {
        try
        {
            let hurtedTextAnim: Animation=this.behurtedTextEffect.getComponent(Animation);
            hurtedTextAnim.on(Animation.EventType.FINISHED, () => 
            {
                hurtedTextAnim.stop();
                this.behurtedTextEffect.active = false;
                hurtedTextAnim.resume();
            }, this);
            let hitAnim:Animation=this.node.getChildByName("Sprite").getComponent(Animation);

            tween(this.node).to(0,{}).call(()=>
            {
                hurtedTextAnim.resume();
                hitAnim.resume();
                this.beHurtedText.getComponent(RichText).string="<color=#ad0003><outline color=#f05856 width=4>-" + _value + "</outline></color>";
                this.beHurtedText.getComponent(RichText).font = this.typeface;
                this.behurtedTextEffect.active=true;
                this.hurtedSpine.getComponent(sp.Skeleton).animation="animation";
                this.hurtedSpine.active=true;
                hurtedTextAnim.play();
                hitAnim.play();
                
                let roleConfig = config.RoleConfig.get(this.RoleId);
                let audioString="Sound/sound_character_hit_MN";
                if(undefined!=roleConfig.Sex&&undefined!=roleConfig.Armor){
                    audioString="Sound/sound_character_hit_"+roleConfig.Sex+roleConfig.Armor;
                }
                AudioManager.Instance.PlayerOnShot(audioString);
            }).delay(0.2).call(()=>
            {
                this.hurtedSpine.active=false;
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

    async IntensifierExp(value: number[])
    {
        
        console.log("Assign temporary experience points to characters");
    }

    async Intensifier(value: number[],stack?:number) 
    {
        try 
        {
            let ms=0;

            if (stack)
            {
                this.Exp = stack % 3;
            }

            await this.changeAtt();

            for(let i = 0;i<value.length;i++)
            {
                let tip:Node;
                if (value[i] != 0)
                {
                    tip = instantiate(this.intensifierTip);
                    if(0==i)
                    {
                        tip.getChildByPath("RichText").getComponent(RichText).string = "<color=#ad0003><outline color=#f05856 width=4>+" + value[i] + "</outline></color>";
                    }
                    else
                    {
                        tip.getChildByPath("RichText").getComponent(RichText).string = "<color=#ffa900><outline color=#ffe900 width=4>+" + value[i] + "</outline></color>";
                    }
                    tip.setParent(this.node);
                    let anim = tip.getComponent(Animation);
                    anim.getState('Tips').speed=1.5;
                    anim.on(Animation.EventType.FINISHED, (event) =>
                    {
                        tip.destroy();
                        ms+=anim.getState('Tips').time;
                    });
                    
                    anim.play();
                }
                
                await sleep(750);
            }
           
            return this.delay(ms,()=>
            {
                // if(newtween)
                // {
                //     newtween.stop();
                //     newtween=null;
                // }
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
        this.tShiftpos = tween(this.node).to(0.3, { worldPosition: vec }).start();
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

    async RemoteAttack(spellcasterLocation: Vec3, targetLocation: Vec3 ,camp?: BattleEnums.Camp,callBack?:()=>{}) 
    {
        try 
        {
            let bulletNode = instantiate(this.remoteNode);
            bulletNode.setPosition(spellcasterLocation);
            console.log(bulletNode);
            bulletNode.getComponent(Bullet).Init(targetLocation);
            singleton.netSingleton.battle.panelNode.addChild(bulletNode);

            return this.delay(700, () => {});
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
            
            let offset=-1000;
            if(BattleEnums.Camp.Self!=this.roleInfo.selfCamp) offset=1000;
            let hitAnim:Animation=this.node.getChildByName("Sprite").getComponent(Animation);
            tween(this.node)
            .call(()=>
            {
                // hitAnim.resume();
                // this.hurtedSpine.getComponent(sp.Skeleton).animation="animation";
                // this.hurtedSpine.active=true;
                // hitAnim.play();
                this.node.getChildByName("Sprite").getComponent(sp.Skeleton).color=color(110,110,110,255);
                this.RoleRotate();
            })
            // .delay(0.2).call(()=>
            // {
            //     this.hurtedSpine.active=false; 
            // })         
            .by(0.7,{position: new Vec3(this.node.position.x+offset,this.node.position.y+500)},{easing: 'quintIn'})
            .to(0.7,{position: new Vec3(this.node.position.x+offset,this.node.position.y+500)})
            .delay(0.2).call(() => {
                this.isDead=true;
                this.roleInfo = null;
                console.log("销毁角色");
                this.node.destroy();
            })
            .start();
            return this.delay(200, () => {});
        }
        catch (err) 
        {
            console.warn("RoleDis 下的 Exit 错误 err:" + err);
        }

    }

    private async RoleRotate(){
        const rotationAxis = new Vec3(0, 1, 0);
        let rotationSpeed=4.0;
        try{
            while (!this.isDead) {
                await this.Delay(0); // 让出控制权，以便游戏引擎处理其他事务
                const deltaRotation = Quat.fromEuler(new Quat(), 0, rotationSpeed, 0);
                this.node.setRotation(Quat.multiply(new Quat(), this.node.rotation, deltaRotation));
            }
        }catch{
            console.log("角色停止旋转，人物已被销毁");
        }
    }
    Delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /*
    * 添加
    * author：Guanliu
    * 2024/04/20
    * 为人物添加装备
    */
   Equipping(equipId:number){
        this.roleInfo.equip[0]=equipId;
   }

   /**
    * 使用技能表现
    * @param _effect 效果类型
    * 
    * author：Hotaru
    * 2024/08/24
    */
   Useskill(_effect : common.SkillEffectEM):Promise<void>
   {
        return new Promise((resolve)=>
        {
            
        });
   }

  /**
   * 接受效果表现
   * @param _effect 效果类型
   * @param _isParallel 是否是并发效果
   * @param _buffid buffID
   * @param _style 样式
   * 
   * author：Hotaru
   * 2024/08/24
   */
   ReceptionEffect(_effect : common.SkillEffectEM ,_isParallel:boolean, _buffid?:number , _style?:number)
   {
       if (common.SkillEffectEM.GainShield == _effect)
       {
           this.effectSpine.getComponent(EffectSpine).ShowEffect(enums.SpecialEffect.Shields, _isParallel);
       }
       switch(_effect)
       {
            case common.SkillEffectEM.AddProperty:
                {
                    this.effectSpine.getComponent(EffectSpine).ShowEffect(enums.SpecialEffect.AddProperty , _isParallel);
                }
                break;
            case common.SkillEffectEM.AddBuffer:
                {
                    this.effectSpine.getComponent(EffectSpine).ShowEffect(enums.SpecialEffect.AddBuff , _isParallel, _buffid);
                }
                break;
            case common.SkillEffectEM.RecoverHP:
                {
                    this.effectSpine.getComponent(EffectSpine).ShowEffect(enums.SpecialEffect.Heath, _isParallel);
                }
                break;
            case common.SkillEffectEM.ExchangeProperty:
                {
                    this.effectSpine.getComponent(EffectSpine).ShowEffect(enums.SpecialEffect.SwapProperties, _isParallel , _style);
                }
       }
       return this.delay(100,()=>{});
   }
   /**
    * 释放效果表现
    * @param _effect 效果类型
    * 
    * author：Hotaru
    * 2024/08/26
    */
   SpellcastEffect(_effect : common.SkillEffectEM , _recipient:Node , _callBack?:()=>Promise<void>)
   {   
       console.log("释放效果表现");
       let ms=0;
       switch (_effect)
       {
           case common.SkillEffectEM.AddProperty:
               {

                   let pos1 = singleton.netSingleton.battle.panelNode.getComponent(UITransform).convertToNodeSpaceAR(this.node.worldPosition);
                   let pos2 = singleton.netSingleton.battle.panelNode.getComponent(UITransform).convertToNodeSpaceAR(_recipient.worldPosition);
                   this.DeliveryGain(pos1, pos2);
                   ms=700;
               }
               break;
           case common.SkillEffectEM.RecoverHP:
               {
                   let pos1 = singleton.netSingleton.battle.panelNode.getComponent(UITransform).convertToNodeSpaceAR(this.node.worldPosition);
                   let pos2 = singleton.netSingleton.battle.panelNode.getComponent(UITransform).convertToNodeSpaceAR(_recipient.worldPosition);
                   this.DeliveryGain(pos1, pos2);
                   ms = 700;
               }
               break;
       }
       return this.delay(ms, async () => { await _callBack(); });
   }

   /**
    * 增益球
    * @param _spellcasterLocation 出发位置
    * @param _targetLocation 目标位置
    * 
    * author：Hotaru
    * 2024/08/26
    */
   private DeliveryGain(_spellcasterLocation:Vec3 , _targetLocation:Vec3)
   {
       try 
       {
           let bulletNode = instantiate(this.remoteNode);
           bulletNode.setPosition(_spellcasterLocation);
           bulletNode.getComponent(Bullet).Init(_targetLocation , true);
           singleton.netSingleton.battle.panelNode.addChild(bulletNode);
       }
       catch (err) 
       {
           console.warn("RoleDis 下的 DeliveryGain 错误 err:" + err);
       }
   }
   
   /**
    * 入场效果
    * @param _pos 位置
    * @param _type 效果类型
    * 
    * author：Hotaru
    * 2024/09/04
    */
   public async Admission(_type:enums.SpecialEffect)
   {
        this.roleSprite.node.active=false;
        this.atkText.node.active=false;
        this.hpText.node.active=false;
        this.levelText.node.active=false;

        await this.effectSpine.getComponent(EffectSpine).ShowEffect(_type , false);

        return this.delay(200,()=>
        {
            this.roleSprite.node.active=true;
            this.atkText.node.active=true;
            this.hpText.node.active=true;
            this.levelText.node.active=true;
        });
   }

/*
 * 添加
 * author：Hotaru
 * 2024/03/06
 * 从配置文件加载
 */
    private LoadOnConfig()
    {
        try
        {
            let jconfig = config.RoleConfig.get(this.RoleId);
            this.roleSprite=this.node.getChildByPath("Sprite").getComponent(sp.Skeleton);
            loadAssets.LoadSkeletonData(jconfig.Skel,(data)=>
            {
                if (data)
                {
                    try
                    {
                        this.roleSprite.skeletonData = data;
                        let anims = data.getAnimsEnum();
                        //this.roleSprite.animation="animation";
                        this.roleSprite.setAnimation(0, String(anims[1]), true);
                    }
                    catch (error)
                    {
                        console.warn(`角色 ${jconfig.Id} 的动画设置失败：`, error);
                    }
                }
            });
        }
        catch(error)
        {
            console.error(`RoleDis 下的 LoadOnConfig 错误 err:${error} RoleId:${this.RoleId}`);
        }
    }
}


