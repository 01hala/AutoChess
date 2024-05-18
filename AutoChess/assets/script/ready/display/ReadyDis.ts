/*
 * ReadyDis.ts
 * author: Hotaru
 * 2023/11/11
 */
import { _decorator, BlockInputEvents, Button, Component, EventHandler, instantiate, Node, Prefab, RichText, Size, size, sp, Sprite, SpriteFrame, Texture2D, UITransform, Vec3, view } from 'cc';
import { RoleArea } from './RoleArea';
import { ReadyData } from '../ReadyData';
import { BundleManager } from '../../bundle/BundleManager';
import { ShopArea } from './ShopArea';
import * as skill from '../../battle/skill/skill_base'
import * as singleton from '../../netDriver/netSingleton';
import * as common from '../../serverSDK/common';
import { login } from '../../login/login';
import { RoleIcon } from './RoleIcon';
import { config } from '../../config/config';
import { loadAssets } from '../../bundle/LoadAsset';
import { sleep } from '../../other/sleep';
import { PropsType } from '../../other/enums';
import { SendMessage } from '../../other/MessageEvent';
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
    //主要数据
    public readyData:ReadyData;
    //动效
    private launchSkillEffect:Node;

    private refreshBtn:Button;
    private startBtn:Button;
    private exitBtn:Button;

    private heathText:RichText;
    private coinText:RichText;
    private trophyText:RichText;
    private roundText:RichText;

    private fetters:Node[]=[];

    private waitingPanel:Node;

    public constructor(ready:ReadyData) 
    {
        this.readyData = ready;
        this.onEvent();
    }
/*
 * 修改start
 * Editor：Hotaru
 * 2024/03/07
 * 让加载更平顺
 */
    async start(father:Node,battle_info:common.UserBattleData,_callBack:(event?:()=>void)=>void) 
    {
        try
        {
            this.father=father;
            //主要界面
            let panel = await BundleManager.Instance.loadAssetsFromBundle("Battle", "ReadyPanel") as Prefab;
            this.panelNode = instantiate(panel);
            //father.addChild(this.panelNode);
            //等待界面
            panel=await BundleManager.Instance.loadAssetsFromBundle("Panel", "waiting") as Prefab;
            this.waitingPanel=instantiate(panel);
            this.waitingPanel.setParent(this.panelNode);
            this.waitingPanel.setSiblingIndex(100);
            //操作区域
            this.shopArea=this.panelNode.getChildByPath("ShopArea").getComponent(ShopArea);
            this.roleArea=this.panelNode.getChildByPath("RoleArea").getComponent(RoleArea);
            //文本
            this.coinText=this.panelNode.getChildByPath("TopArea/CoinInfo/RichText").getComponent(RichText);
            this.heathText=this.panelNode.getChildByPath("TopArea/HpInfo/RichText").getComponent(RichText);
            this.roundText=this.panelNode.getChildByPath("TopArea/RoundInfo/RichText").getComponent(RichText);
            this.trophyText=this.panelNode.getChildByPath("TopArea/TrophyInfo/RichText").getComponent(RichText);
            //技能发动效果
            this.launchSkillEffect=this.panelNode.getChildByName("LaunchSkillEffect");
            this.launchSkillEffect.setSiblingIndex(99);
            this.launchSkillEffect.active=false;

            if(battle_info.coin>=25)
            {
                singleton.netSingleton.game.achievement_gold25_ntf();
            }

            _callBack(async ()=>
            {
                await this.Init(father);
                //准备开始
                if (battle_info.round > 1) {
                    await this.Restore(battle_info);
                }
                //this.coinText.string=""+this.ready.coin;
                //await this.RefreshShop()
                this.shopArea.Init(this.readyData.GetShopRoles(), this.readyData.GetShopProps(),this.readyData.GetStage());
                //隐藏等待界面
                this.waitingPanel.getComponent(BlockInputEvents).enabled = false;
                this.waitingPanel.active = false;
            });
            
        }
        catch(error)
        {
            console.error("ReadyDis 里的 start 错误 err:",error);
        }
    }

    async Init(father:Node)
    {
        try
        {
            this.RegCallBack();
            //羁绊信息框
            let tNode = this.panelNode.getChildByPath("TopArea/FetterArea");
            for (let i = 1; i <= 6; i++) {
                let t = tNode.getChildByName("FettersIcon_" + i);
                t.active = false;
                this.fetters.push(t);
            }
            //刷新按钮
            this.refreshBtn = this.panelNode.getChildByPath("ShopArea/Falsh_Btn").getComponent(Button);
            this.refreshBtn.node.on(Button.EventType.CLICK, () => {
                this.RefreshShop();
            }, this);
            //开始按钮
            this.startBtn = this.panelNode.getChildByPath("ShopArea/Start_Btn").getComponent(Button);
            this.startBtn.node.on(Button.EventType.CLICK, async () => {
                if (this.readyData.GetRolesNumber() > 0) {
                    await this.readyData.StartBattle();
                    this.panelNode.active = false;
                    this.destory();
                }
            });
            this.exitBtn = this.panelNode.getChildByPath("TopArea/Exit_Btn").getComponent(Button);
            this.exitBtn.node.on(Button.EventType.CLICK, () => {
                father.getComponent(login).BackMainInterface();
            }, this);
        }
        catch(error)
        {
            console.error("ReadyDis 里的 Init 错误 err:",error);
        }
    }

    private delay(ms: number, release: () => void): Promise<void> 
    {
        return new Promise(async (resolve) => {
            await setTimeout(() => {
                resolve();
                release();
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

    private RegCallBack()
    {
        //注册回调
        singleton.netSingleton.game.cb_battle_info = (battle_info: common.UserBattleData) => {
            this.readyData.SetCoins(battle_info.coin);
            console.log(`roleList: ${battle_info.RoleList}`);
            this.readyData.SetRoles(battle_info.RoleList);
            this.readyData.SetHeath(battle_info.faild);
            this.readyData.SetStage(battle_info.stage);
            //console.log('player coin: ',battle_info.coin);
            this.UpdatePlayerInfo(battle_info);
        };
        singleton.netSingleton.game.cb_shop_info = (shop_info: common.ShopData) => {
            console.log("shop_info:", shop_info);
            this.readyData.SetShopData(shop_info);
        };
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
           catch(error)
           {
                console.error("cb_role_buy_merge 错误: ",(error));
           }
        };
        singleton.netSingleton.game.cb_role_merge = (source_role_index: number, target_role_index: number, target_role: common.Role, is_update: boolean) => {
            console.log('cb_role_merge,source_role:', source_role_index);
            this.roleArea.rolesNode[source_role_index].getComponent(RoleIcon).roleNode.destroy();
            this.roleArea.rolesNode[source_role_index].destroy();

            this.roleArea.rolesNode[source_role_index]=null;
            console.log('cb_role_merge,target_role:', target_role_index);

            this.roleArea.rolesNode[target_role_index].getComponent(RoleIcon).upgradeLock = true;
            this.roleArea.rolesNode[target_role_index].getComponent(RoleIcon).GetUpgrade(target_role, is_update);

        };
        singleton.netSingleton.game.cb_role_eat_food = (food_id: number, target_role_index: number, target_role: common.Role, is_update: boolean) => {
            // let str = "Location_" + target_role_index;
            // this.roleArea.GetTargetValue(str).getComponent(RoleIcon).upgradeLock = true;
            // this.roleArea.GetTargetValue(str).getComponent(RoleIcon).GetUpgrade(target_role, is_update);
            this.roleArea.rolesNode[target_role_index].getComponent(RoleIcon).upgradeLock = true;
            this.roleArea.rolesNode[target_role_index].getComponent(RoleIcon).EatFood(target_role, food_id);
        };
        singleton.netSingleton.game.cb_role_equip=(equip_id:number,target_role_index:number, target_role:common.Role)=>{
            this.roleArea.rolesNode[target_role_index].getComponent(RoleIcon).Equipping(target_role,equip_id);
        }
        singleton.netSingleton.game.cb_role_update_refresh_shop=(shop_info: common.ShopData)=> {
            this.readyData.SetShopData(shop_info);
            this.shopArea.Init(this.readyData.GetShopRoles(),this.readyData.GetShopProps(),this.readyData.GetStage());
        };
        singleton.netSingleton.game.cb_add_coin=(coin:number)=>
        {
            this.readyData.SetCoins(coin);
        };
        singleton.netSingleton.game.cb_role_skill_update=async (role_index:number,_role:common.Role)=>
        {
            await this.showLaunchSkillEffect();
            if(this.roleArea.rolesNode[role_index])
            {
                this.roleArea.rolesNode[role_index].getComponent(RoleIcon).GetUpgrade(_role,false);
            }
        };
        singleton.netSingleton.game.cb_role_add_property=async (battle_info:common.UserBattleData)=>
        {
            await this.showLaunchSkillEffect();
            for(let i=0;i<this.roleArea.rolesNode.length;i++)
            {
                if(null != this.roleArea.rolesNode[i])
                {
                    this.roleArea.rolesNode[i].getComponent(RoleIcon).GetUpgrade(battle_info.RoleList[i],false);
                }
            }
        };
        singleton.netSingleton.game.cb_shop_summon=(role_index:number, _role:common.Role)=>
        { 
            this.roleArea.SummonRole(role_index,_role);
        };

    }
/*
 * 修改方法 每次返回更新角色列表
 * Editor: Hotaru
 * 2024/04/02
 */
    async Restore(_battle_info:common.UserBattleData)
    {
         //---------------------------//
        //此处更新玩家生命、阶段、奖杯数//
        //---------------------------//
        this.UpdatePlayerInfo(_battle_info);
        this.readyData.SetRoles(_battle_info.RoleList);
        await this.roleArea.ResetTeam(_battle_info.RoleList);
    }

    public destory() {
        this.panelNode.destroy();
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
            console.log("now count of player fetters:"+_battle_info.FettersList.length+"。");
            for(let i=0;i<6;i++)
            {
                this.fetters[i].active=false;
                if(i<_battle_info.FettersList.length)
                {                 
                    //let str="Fetter_"+_battle_info.FettersList[i].fetters_id;
                    let str=config.FettersConfig.get(_battle_info.FettersList[i].fetters_id).Res;
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
                    let text = this.fetters[i].getChildByPath("Level/Text");
                    let content="";
                    for(let j=0;j<fetterLevels.length;j++){
                        if(_battle_info.FettersList[i].fetters_level>=j+1){
                            content+="<color=#ffffff>"+fetterLevels[j]+" ";
                        }
                        else{
                            content+="<color=#AAAAAA>"+fetterLevels[j]+" ";
                        }
                    }
                    text.getComponent(RichText).string=content;
                    this.fetters[i].getChildByName("Button").on(Button.EventType.CLICK,()=>{
                        this.fetters[i].getChildByName("Button").
                            dispatchEvent(new SendMessage('OpenFetterInfo',true,{id:_battle_info.FettersList[i].fetters_id}));
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
                    this.coinText.string=""+_battle_info.coin;
                    this.heathText.string=""+_battle_info.faild;
                    this.roundText.string=""+_battle_info.round;
                    this.trophyText.string=""+_battle_info.victory;
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

    onEvent()
    {
        this.readyData.on_event = async (evs) =>
        {
            
        }
    }
}


