/*
 * ReadyDis.ts
 * author: Hotaru
 * 2023/11/11
 */
import { _decorator, BlockInputEvents,Camera, Button, Component, EventHandler, instantiate, Node, Prefab, RichText, Size, size, sp, Sprite, SpriteFrame, Texture2D, UITransform, Vec3, view, Widget, resources, __private } from 'cc';
import { RoleArea } from './RoleArea';
import { ReadyData } from '../ReadyData';
import { BundleManager } from '../../bundle/BundleManager';
import { ShopArea } from './ShopArea';
import * as skill from '../../battle/AutoChessBattle/skill/skill_base'
import * as singleton from '../../netDriver/netSingleton';
import * as common from '../../battle/AutoChessBattle/common';
import { login } from '../../login/login';
import { RoleIcon } from './RoleIcon';
import { config } from '../../battle/AutoChessBattle/config/config';
import { loadAssets } from '../../bundle/LoadAsset';
import { sleep } from '../../other/sleep';
import * as enmus from '../../other/enums';
import { SendMessage } from '../../other/MessageEvent';
import { RoleDis } from '../../battle/display/RoleDis';
import { GameManager } from '../../other/GameManager';
import { AudioManager } from '../../other/AudioManager';
import SdkManager from '../../SDK/SdkManager';
import * as call_c from '../../serverSDK/matchcallc';
import { CoinDrop } from './CoinDrop';

const { ccclass, property } = _decorator;

export class ReadyDis 
 {
    //父节点
    public father:Node;
    //界面
    public panelNode:Node;
    //操作界面
    public roleArea:RoleArea;
    public shopArea:ShopArea;
    //界面适配
    public cameraNode:Node;
    public topArea:Node;
    //主要数据
    public readyData:ReadyData;
    //动效
    private launchSkillEffect:Node;
    //按钮
    private refreshBtn:Button;
    private startBtn:Button;
    private exitBtn:Button;
    //文本
    private heathText:RichText;
    private coinText:RichText;
    private trophyText:RichText;
    private roundText:RichText;
    //角色信息
    private roleInfoNode:Node;
    private fetters:Node[]=[];
    //等待界面
    private waitingPanel:Node;
    //商店遮罩
    private shopMask:Node;
    //金币预制体
    private coinPre:Prefab;

    public constructor(ready:ReadyData) 
    {
        this.readyData = ready;
        //this.onEvent();
    }

/*
 * 修改start
 * Editor：Hotaru
 * 2024/03/07
 * 让加载更平顺
 */
    public async start(_father:Node,_value:common.UserBattleData|number[],_callBack:(event?:()=>void)=>void) 
    {
        try
        {
            console.log("ReadyDis start!");

            this.father=_father;
            //主要界面
            let panel = await BundleManager.Instance.loadAssetsFromBundle("Battle", "ReadyPanel") as Prefab;
            this.panelNode = instantiate(panel);
            //father.addChild(this.panelNode);
            //等待界面
            panel=await BundleManager.Instance.loadAssetsFromBundle("Panel", "waiting") as Prefab;
            this.waitingPanel=instantiate(panel);
            this.waitingPanel.setParent(this.panelNode);
            this.waitingPanel.setSiblingIndex(100);
            //金币预制体
            this.coinPre=await BundleManager.Instance.loadAssetsFromBundle("Parts","CoinPre") as Prefab;
            //操作区域
            this.shopArea=this.panelNode.getChildByPath("Shop/ShopArea").getComponent(ShopArea);
            this.roleArea=this.panelNode.getChildByPath("RoleArea").getComponent(RoleArea);
            //图形适配获取整个区域
            this.cameraNode = this.father.getChildByName('Camera');
            this.topArea=this.panelNode.getChildByPath("State/TopArea");
            //文本
            this.coinText=this.panelNode.getChildByPath("State/TopArea/CoinInfo/RichText").getComponent(RichText);
            this.heathText=this.panelNode.getChildByPath("State/TopArea/HpInfo/RichText").getComponent(RichText);
            this.roundText=this.panelNode.getChildByPath("State/TopArea/RoundInfo/RichText").getComponent(RichText);
            this.trophyText=this.panelNode.getChildByPath("State/TopArea/TrophyInfo/RichText").getComponent(RichText);
            //技能发动效果
            // this.launchSkillEffect = this.panelNode.getChildByName("LaunchSkillEffect");
            // this.launchSkillEffect.setSiblingIndex(99);
            // this.launchSkillEffect.active = false;

            this.roleInfoNode=this.panelNode.getChildByPath("State/TopArea/RoleIntroduce");
            this.roleInfoNode.active=false;

            this.shopMask=this.panelNode.getChildByPath("Mask");
            //this.shopMask.setPosition(new Vec3(0,this.shopArea.node.position.y+240,0));
            //this.shopMask.getComponent(Widget).bottom=this.shopArea.node.getComponent(Widget).bottom+310;
            this.shopMask.setSiblingIndex(90);
            this.shopMask.active=false;

            if(_value instanceof common.UserBattleData)
            {
                if (_value.coin >= 25)
                {
                    singleton.netSingleton.game.achievement_gold25_ntf();
                }
            }
            

            _callBack(async ()=>
            {
                console.log("ReadyDis start _callBack!");
                this.Init(_father);
                //准备开始
                
                console.log("_________battledata:",Object.prototype.toString.call(_value).replace(/^\[object (\S+)\]$/, '$1'));
                if(_value instanceof Float64Array)
                {
                    await this.Restore();
                }
                else
                {
                    let battleData=_value as common.UserBattleData;
                    if(battleData.round>1)
                    {
                        await this.Restore(battleData);
                    }
                }
                //this.coinText.string=""+this.ready.coin;
                //await this.RefreshShop()
                this.shopArea.Init(this.readyData.GetShopRoles(), this.readyData.GetShopProps(),this.readyData.GetStage());
                //隐藏等待界面
                this.waitingPanel.getComponent(BlockInputEvents).enabled = false;
                this.waitingPanel.active = false;
                if (GameManager.Instance.guide)
                {
                    GameManager.Instance.guide.step++;
                }
            });
            
        }
        catch(error)
        {
            console.error("ReadyDis 里的 start 错误 err:",error);
        }
    }

    Init(_father:Node)
    {
        try
        {
            console.log("ReadyDis Init begin!");
            this.InterfaceAdjust();//适配
            //注册回调
            this.RegCallBack();
            if(enmus.GameMode.PVP == this.readyData.gameMode)
            {
                this.RegPvpCallBack();
            }
            else if(enmus.GameMode.PVE == this.readyData.gameMode)
            {
                this.RegPveCallBack();
            }
            //羁绊信息框
            let tNode = this.panelNode.getChildByPath("Shop/ShopArea/FetterBG/FetterArea");
            for (let i = 1; i <= 6; i++)
            {
                let t = tNode.getChildByName("FettersIcon_" + i);
                t.active = false;
                this.fetters.push(t);
            }
            //刷新按钮
            this.refreshBtn = this.panelNode.getChildByPath("Shop/ShopArea/Falsh_Btn").getComponent(Button);
            this.refreshBtn.node.on(Button.EventType.CLICK, () =>
            {
                this.RefreshShop();
            }, this);
            //开始按钮
            this.startBtn = this.panelNode.getChildByPath("Shop/ShopArea/Start_Btn").getComponent(Button);
            this.startBtn.node.on(Button.EventType.CLICK, async () =>
            {
                if (this.readyData.GetRolesNumber() > 0)
                {
                    await this.readyData.StartBattle();
                    this.panelNode.active = false;
                }
            });
            //退出按钮
            this.exitBtn = this.panelNode.getChildByPath("State/TopArea/Exit_Btn").getComponent(Button);
            this.exitBtn.node.on(Button.EventType.CLICK, () =>
            {
                AudioManager.Instance.PlayerOnShot("Sound/sound_click_close_01");
                _father.getComponent(login).BackMainInterface();
            }, this);

            console.log("ReadyDis Init end!");
        }
        catch(error)
        {
            console.error("ReadyDis 里的 Init 错误 err:",error);
        }
    }

    public destory() 
    {
        this.roleArea.destroy();
        this.shopArea.destroy();
        this.panelNode.destroy();
    }

    private InterfaceAdjust()
    {
        if (SdkManager.SDK.getSystemInfo().safeArea.height == SdkManager.SDK.getSystemInfo().screenHeight)
        {
            return;
        }

        let safeHeight=(SdkManager.SDK.getSystemInfo().screenHeight - SdkManager.SDK.getSystemInfo().safeArea.height);
        // let outPos:Vec3=this.cameraNode.getComponent(Camera).screenToWorld(new Vec3(0,bpttomHeight,0));
        // this.topArea.getComponent(Widget).top=outPos.y;
        if (SdkManager.SDK.getSystemInfo().safeArea.height != SdkManager.SDK.getSystemInfo().screenHeight)
        {
            safeHeight = (SdkManager.SDK.getSystemInfo().screenHeight - SdkManager.SDK.getSystemInfo().safeArea.height);
        }
        let outPos: Vec3 = this.cameraNode.getComponent(Camera).getComponent(Camera).screenToWorld(new Vec3(0, safeHeight, 0));
        this.shopMask.getComponent(Widget).bottom = outPos.y - 310;
    }

    private delay(ms: number, release: () => void): Promise<void> 
    {
        return new Promise(async (resolve) =>
        {
            await setTimeout(() =>
            {
                release();
                resolve();
            }, ms);
        });
    }
    //技能发动效果
    private showLaunchSkillEffect()
    {
        this.launchSkillEffect.active=true;
        this.launchSkillEffect.setSiblingIndex(99);

        this.launchSkillEffect.getChildByPath("BottomImg").getComponent(sp.Skeleton).animation="a2";
        this.launchSkillEffect.getChildByPath("RoleImg").getComponent(sp.Skeleton).animation="a";
        this.launchSkillEffect.getChildByPath("TopImg").getComponent(sp.Skeleton).animation="a";

        //await sleep(2000);

        return this.delay(2000,()=>
        {
            this.launchSkillEffect.active=false;
        });

    }

    ShowShopMask(_flag:boolean)
    {
        if(_flag)
        {
            this.shopMask.setSiblingIndex(100);
            this.shopMask.active=true;
            this.shopMask.getChildByPath("ShopMask").getComponent(BlockInputEvents).enabled=true;
        }
        else
        {
            this.shopMask.getChildByPath("ShopMask").getComponent(BlockInputEvents).enabled=false;
            this.shopMask.active=false;
        }
    }

/*
 * 修改方法 注册统一回调
 * Editor: Hotaru
 * 2024/06/29
 */

    //注册统一回调
    private RegCallBack()
    {
        //购买和合并
        singleton.netSingleton.game.cb_role_buy_merge = (target_role_index: number, target_role: common.Role, is_update: boolean) => 
        {
            try
            {
                console.log('cb_role_buy_merge', target_role_index);
                //let str = "Location_" + target_role_index;
                this.roleArea.rolesNode[target_role_index].getComponent(RoleIcon).upgradeLock = true;
                this.roleArea.rolesNode[target_role_index].getComponent(RoleIcon).GetUpgrade(target_role, is_update);
                //this.roleArea.GetTargetValue(str).getComponent(RoleIcon).upgradeLock = true;
                //this.roleArea.GetTargetValue(str).getComponent(RoleIcon).GetUpgrade(target_role, is_update);;
            }
            catch (error)
            {
                console.error("cb_role_buy_merge 错误: ", (error));
            }
        };
        //合并
        singleton.netSingleton.game.cb_role_merge = (source_role_index: number, target_role_index: number, target_role: common.Role, is_update: boolean) => {
            console.log('cb_role_merge,source_role:', source_role_index);
            this.roleArea.rolesNode[source_role_index].getComponent(RoleIcon).roleNode.destroy();
            this.roleArea.rolesNode[source_role_index].destroy();

            this.roleArea.rolesNode[source_role_index]=null;
            console.log('cb_role_merge,target_role:', target_role_index);

            this.roleArea.rolesNode[target_role_index].getComponent(RoleIcon).upgradeLock = true;
            this.roleArea.rolesNode[target_role_index].getComponent(RoleIcon).GetUpgrade(target_role, is_update);

        };
        //使用道具（食物）
        singleton.netSingleton.game.cb_role_eat_food = (food_id: number, target_role_index: number, target_role: common.Role, is_update: boolean , is_syncope : boolean) =>
        {
            // let str = "Location_" + target_role_index;
            // this.roleArea.GetTargetValue(str).getComponent(RoleIcon).upgradeLock = true;
            // this.roleArea.GetTargetValue(str).getComponent(RoleIcon).GetUpgrade(target_role, is_update);
            this.roleArea.rolesNode[target_role_index].getComponent(RoleIcon).upgradeLock = true;
            this.roleArea.rolesNode[target_role_index].getComponent(RoleIcon).EatFood(target_role, food_id , is_update , is_syncope);
        };
        //使用装备
        singleton.netSingleton.game.cb_role_equip = (equip_id: number, target_role_index: number, target_role: common.Role) =>
        {
            this.roleArea.rolesNode[target_role_index].getComponent(RoleIcon).Equipping(target_role, equip_id);
        }
        //角色技能：更新商店
        singleton.netSingleton.game.cb_role_update_refresh_shop = (shop_info: common.ShopData) =>
        {
            this.readyData.SetShopData(shop_info);
            this.shopArea.Init(this.readyData.GetShopRoles(), this.readyData.GetShopProps(), this.readyData.GetStage());
        };
        //角色技能：增加金币
        singleton.netSingleton.game.cb_add_coin = (coin: number) =>
        {
            this.readyData.SetCoins(coin);
        };
        //角色技能：升级
        singleton.netSingleton.game.cb_role_skill_update = (role_index: number, _role: common.Role) =>
        {
            if (this.roleArea.rolesNode[role_index])
            {
                this.roleArea.rolesNode[role_index].getComponent(RoleIcon).GetUpgrade(_role, false);
            }
        };
        //角色技能：获得属性
        singleton.netSingleton.game.cb_role_add_property = (battle_info: common.UserBattleData) =>
        {
            for (let i = 0; i < this.roleArea.rolesNode.length; i++)
            {
                if (null != this.roleArea.rolesNode[i])
                {
                    this.roleArea.rolesNode[i].getComponent(RoleIcon).GetUpgrade(battle_info.RoleList[i], false);
                }
            }
        };
        //角色技能：召唤
        singleton.netSingleton.game.cb_shop_summon = (role_index: number, _role: common.Role) =>
        {
            this.roleArea.SummonRole(role_index, _role);
        };
        //角色技能效果
        singleton.netSingleton.game.cb_shop_skill_effect = (effect:call_c.ShopSkillEffect)=>
        {
            console.log("skilleffect:", effect);
            this.ShowSkillEffect(effect);
        };

    }

/*
 * 添加方法 注册PVP回调事件
 * Editor: Hotaru
 * 2024/06/29
 */

    //注册PVP回调事件
    private RegPvpCallBack()
    {
        console.log("RegPvpCallBack begin!");
        //更新玩家游戏信息
        singleton.netSingleton.game.cb_battle_info = (battle_info: common.UserBattleData) =>
        {
            this.readyData.SetCoins(battle_info.coin);
            console.log(`roleList: ${battle_info.RoleList}`);
            this.readyData.SetRoles(battle_info.RoleList);
            this.readyData.SetHeath(battle_info.faild);
            this.readyData.SetStage(battle_info.stage);
            //console.log('player coin: ',battle_info.coin);
            this.UpdatePlayerInfo(battle_info);
        };
        //更新商店信息
        singleton.netSingleton.game.cb_shop_info = (shop_info: common.ShopData) =>
        {
            console.log("shop_info:", shop_info);
            this.readyData.SetShopData(shop_info);
        };
        
    }

/*
 * 添加方法 注册PVE回调事件
 * Editor: Hotaru
 * 2024/06/29
 */

    //注册PVE回调事件
    private RegPveCallBack()
    {
        //更新当前状态
        singleton.netSingleton.game.cb_get_quest_shop_data = async (_battle_info,_shop_info)=>
        {
            this.readyData.SetCoins(_battle_info.coin);
            this.readyData.SetRoles(_battle_info.RoleList);
            this.readyData.SetShopData(_shop_info);
            await this.roleArea.ResetTeam(_battle_info.RoleList);
            this.UpdatePlayerInfo(_battle_info);
        }
        //更新信息
        singleton.netSingleton.game.cb_quest_battle_info=(_battle_info)=>
        {
            this.readyData.SetCoins(_battle_info.coin);
            this.readyData.SetRoles(_battle_info.RoleList);
            this.UpdatePlayerInfo(_battle_info);
        };
        //更新商店信息
        singleton.netSingleton.game.cb_quest_shop_info=(_shop_info)=>
        {
            this.readyData.SetShopData(_shop_info);
        };
    }

/*
 * 修改方法 每次返回更新角色列表
 * Editor: Hotaru
 * 2024/04/02
 */
    async Restore(_battle_info?:common.UserBattleData)
    {
         //---------------------------//
        //此处更新玩家生命、阶段、奖杯数//
        //---------------------------//
        if(null != _battle_info)
        {
            this.UpdatePlayerInfo(_battle_info);
            this.readyData.SetRoles(_battle_info.RoleList);
            await this.roleArea.ResetTeam(_battle_info.RoleList);
        }
        else
        {
            singleton.netSingleton.game.get_quest_shop_data();
        }
    }

    Waiting(valve:boolean)
    {
        this.waitingPanel.getComponent(BlockInputEvents).enabled=valve;
        this.waitingPanel.active=valve;
    }
    //刷新商店
    private async RefreshShop()
    {
        await this.readyData.Refresh();
        console.log('refresh');
        this.shopArea.Init(this.readyData.GetShopRoles(),this.readyData.GetShopProps(),this.readyData.GetStage());
    }
    //更新玩家信息
    private async UpdatePlayerInfo(_battle_info:common.UserBattleData)
    {
        try
        {
            this.UpdateText(_battle_info);

            //console.log("now count of player fetters:"+_battle_info.FettersList.length+"。");
            for(let i=0;i<6;i++)
            {
                this.fetters[i].active=false;
                if(i<_battle_info.FettersList.length)
                {                 
                    //let str="Fetter_"+_battle_info.FettersList[i].fetters_id;
                    let str=config.FettersConfig.get(_battle_info.FettersList[i].fetters_id).Res;
                    let infoStr=str;
                    let fetterLevels=config.FettersConfig.get(_battle_info.FettersList[i].fetters_id).roleNum;
                    let sf:SpriteFrame=await this.LoadFetterImg(str);
                    if(sf)
                    {
                        this.fetters[i].getChildByName("IconImage").getComponent(Sprite).spriteFrame=sf;             
                    }
                    str="IconTexture/Fetters/lv_"+_battle_info.FettersList[i].fetters_level;
                    sf=await loadAssets.LoadImg(str);
                    //this.fetters[i].getChildByName("RichText").getComponent(RichText).string=""+_battle_info.FettersList[i].fetters_level;
                    this.fetters[i].getComponent(Sprite).spriteFrame=sf;
                    this.fetters[i].active=true;

                    //羁绊的文字信息，最新版UI暂时不用
                    // this.fetters[i].getChildByName("FetterName").getComponent(RichText).string=
                    //     "<color=#00ff00>"+config.FettersConfig.get(_battle_info.FettersList[i].fetters_id).Name+"</color>";
                    // let text = this.fetters[i].getChildByPath("Level/Text");
                    // let content="";
                    // for(let j=0;j<fetterLevels.length;j++){
                    //     if(_battle_info.FettersList[i].fetters_level>=j+1){
                    //         content+="<color=#ffffff>"+fetterLevels[j]+" ";
                    //     }
                    //     else{
                    //         content+="<color=#AAAAAA>"+fetterLevels[j]+" ";
                    //     }
                    // }
                    // text.getComponent(RichText).string=content;

                    this.fetters[i].getChildByName("Button").on(Button.EventType.CLICK,()=>{
                        this.fetters[i].getChildByName("Button").
                            dispatchEvent(new SendMessage('OpenFetterInfo',true,
                                {id:_battle_info.FettersList[i].fetters_id,spritePath:infoStr,level:_battle_info.FettersList[i].fetters_level}));
                    })
                    //continue;
                }               
            }       
        }
       catch(error)
        {
            console.error("ReadyDis 里的 UpdatePlayerInfo 错误 err:",error);
        }
    }

    private UpdateText(_battle_info:common.UserBattleData):Promise<void>
    {
        return new Promise(async (relolve)=>
        {
            try
            {
                await sleep(50); //延后一帧刷新richtext
                if(this.coinText && this.heathText && this.roundText && this.trophyText)
                {
                    this.coinText.string="<color=000000>"+_battle_info.coin+"</color>";
                    this.heathText.string="<color=000000>"+_battle_info.faild+"</color>";
                    this.roundText.string="<color=000000>"+_battle_info.round+"</color>";
                    this.trophyText.string="<color=000000>"+_battle_info.victory+"</color>";
                }
                relolve();
            }
            catch(error)
            {
                console.warn("引擎bug，还是会有极小概率richtext报空函数，可以忽略");
                relolve();
            }
        });
    }

    async ShowRoleInfo(id:number,level:number){
        let roleInfo=config.RoleConfig.get(id);
        if(null == roleInfo){
            console.log("未获取到角色信息");
            return;
        }
        this.roleInfoNode.active=true;
        this.topArea.setSiblingIndex(98);

        let roleSkillInfo=config.SkillIntroduceConfig.get(roleInfo.SkillID);
        if(roleSkillInfo){
            let content="";
            switch(level){
                case 1:content=roleSkillInfo.Leve1Text;break;
                case 2:content=roleSkillInfo.Leve2Text;break;
                default:content=roleSkillInfo.Leve3Text;
            }
            this.roleInfoNode.getChildByName("SkillIntroduce").getComponent(RichText).string=
                roleSkillInfo.Timeing_Text+":"+content;           
        }      
        let roleFetterInfo=config.FettersConfig.get(roleInfo.Fetters);
        if(roleFetterInfo){
            let str=roleFetterInfo.Res;
            let sf:SpriteFrame=await this.LoadFetterImg(str);
            if(sf)
            {
                this.roleInfoNode.getChildByPath("Fetter/IconImage").getComponent(Sprite).spriteFrame=sf;             
            }
            this.roleInfoNode.getChildByPath("Fetter/FetterName").getComponent(RichText).string=roleFetterInfo.Name;
        }
    }


    HideRoleInfo(){
        this.roleInfoNode.active=false;
    }

    private LoadFetterImg(_address:string):Promise<SpriteFrame>
    {
        return new Promise(async (resolve)=>
        {
            let imgRes=""+_address;
            let temp=await loadAssets.LoadImg(_address);
            if(null==temp)
            {
                 console.warn('ReadyDis 里的 LoadFetterImg 异常 : bundle中没有此羁绊图标,替换为默认羁绊图标');
                 resolve(null);
            }
            resolve(temp);
        });
    }

    ShowSkillEffect(_effect:call_c.ShopSkillEffect)
    {
        switch (_effect.effect)
        {
            case common.SkillEffectEM.AddCoin:
                {
                    if (24 == _effect.skill_id)
                    {
                        this.coinText.node.parent.getChildByPath("CoinEffect").getComponent(sp.Skeleton).enabled = true;
                        this.coinText.node.parent.getChildByPath("CoinEffect").getComponent(sp.Skeleton).setCompleteListener((trackEntry) =>
                        {
                            this.coinText.node.parent.getChildByPath("CoinEffect").getComponent(sp.Skeleton).enabled = false;
                        });
                        this.coinText.string = "<color=000000>" + this.readyData.GetCoins() + "</color>";
                    }
                    else
                    {
                        this.DropCoin(_effect.spellcaster);
                    }
                }
                break;
            case common.SkillEffectEM.AddProperty:
                {
                    for (let i of _effect.recipient)
                    {
                        this.roleArea.rolesNode[_effect.spellcaster].getComponent(RoleDis).SpellcastEffect(_effect.effect,this.roleArea.rolesNode[i],async ()=>
                        {
                            await this.roleArea.rolesNode[i].getComponent(RoleDis).ReceptionEffect(_effect.effect);
                            await this.roleArea.rolesNode[i].getComponent(RoleDis).Intensifier(_effect.value);
                        });
                    }
                    
                    
                }
        }
    }

    DropCoin(_fromIndex:number)
    {
        try
        {
            let _from = this.roleArea.rolesNode[_fromIndex].worldPosition;
            let _target = this.topArea.getChildByPath("CoinInfo").worldPosition;
            let coinNode = instantiate(this.coinPre);
            coinNode.setParent(this.father);
            coinNode.getComponent(CoinDrop)?.Drop(_from, _target, () =>
            {
                this.coinText.string = "<color=000000>" + this.readyData.GetCoins() + "</color>";
            });
        }
        catch (error)
        {
            console.error("ReadyDis 里的 DropCoin 错误 err:", error);
        }
    }

    // onEvent()
    // {
    //     this.readyData.on_event = async (evs) =>
    //     {

    //     }
    // }
}