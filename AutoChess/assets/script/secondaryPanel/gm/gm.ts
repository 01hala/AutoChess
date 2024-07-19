import { _decorator, Component, Button, EditBox, Node } from 'cc';
import 'minigame-api-typings';

const { ccclass, property } = _decorator;

import * as common from "../../battle/AutoChessBattle/common"
import * as match from "../../serverSDK/ccallmatch"
import * as battle from '../../battle/AutoChessBattle/battle'
import * as battleDis from '../../battle/display/BattleDis'
import * as singleton from '../../netDriver/netSingleton'
import * as enums from '../../other/enums'

@ccclass('gm')
export class gm extends Component {
    @property(EditBox)
    self1ID:EditBox = null;
    @property(EditBox)
    self2ID:EditBox = null;
    @property(EditBox)
    self3ID:EditBox = null;
    @property(EditBox)
    self4ID:EditBox = null;
    @property(EditBox)
    self5ID:EditBox = null;
    @property(EditBox)
    self6ID:EditBox = null;

    @property(EditBox)
    target1ID:EditBox = null;
    @property(EditBox)
    target2ID:EditBox = null;
    @property(EditBox)
    target3ID:EditBox = null;
    @property(EditBox)
    target4ID:EditBox = null;
    @property(EditBox)
    target5ID:EditBox = null;
    @property(EditBox)
    target6ID:EditBox = null;

    @property(Button)
    btn:Button = null;

    async start() {
        this.btn.node.on(Node.EventType.TOUCH_START, this.gm_set_up, this);
        
        this.init_gm();
    }

    init_gm() {
        let selfTeam = singleton.netSingleton.battle.battleCentre.GetSelfTeam();
        let role = selfTeam.GetRole(0);
        if (role) {
            this.self1ID.maxLength=20;
            this.self1ID.string = `${role.id}:${role.level}:${2}:${3}`;
        }
        role = selfTeam.GetRole(1);
        if (role) {
            this.self2ID.maxLength=20;
            this.self2ID.string = `${role.id}:${role.level}:${3}:${3}`;
        }
        role = selfTeam.GetRole(2);
        if (role) {
            this.self3ID.maxLength=20;
            this.self3ID.string = `${role.id}:${role.level}:${2}:${1}`;
        }
        role = selfTeam.GetRole(3);
        if (role) {
            this.self4ID.maxLength=20;
            this.self4ID.string = `${role.id}:${role.level}:${4}:${2}`;
        }
        role = selfTeam.GetRole(4);
        if (role) {
            this.self5ID.maxLength=20;
            this.self5ID.string = `${role.id}:${role.level}:${3}:${4}`;
        }
        role = selfTeam.GetRole(5);
        if (role) {
            this.self6ID.maxLength=20;
            this.self6ID.string = `${role.id}:${role.level}:${3}:${1}`;
        }

        let enemyTeam = singleton.netSingleton.battle.battleCentre.GetEnemyTeam();
        role = enemyTeam.GetRole(0);
        if (role) {
            this.target1ID.maxLength=20;
            this.target1ID.string = `${role.id}:${role.level}:${1}:${4}`;
        }
        role = enemyTeam.GetRole(1);
        if (role) {
            this.target2ID.maxLength=20;
            this.target2ID.string = `${role.id}:${role.level}:${5}:${1}`;
        }
        role = enemyTeam.GetRole(2);
        if (role) {
            this.target3ID.maxLength=20;
            this.target3ID.string = `${role.id}:${role.level}:${4}:${2}`;
        }
        role = enemyTeam.GetRole(3);
        if (role) {
            this.target4ID.maxLength=20;
            this.target4ID.string = `${role.id}:${role.level}:${3}:${1}`;
        }
        role = enemyTeam.GetRole(4);
        if (role) {
            this.target5ID.maxLength=20;
            this.target5ID.string = `${role.id}:${role.level}:${2}:${2}`;
        }
        role = enemyTeam.GetRole(5);
        if (role) {
            this.target6ID.maxLength=20;
            this.target6ID.string = `${role.id}:${role.level}:${3}:${2}`;
        }
    }

    async gm_set_up() {
        let self = new common.UserBattleData();

        let property = this.self1ID.string.split(":");
        let self1 = new common.Role();            
            self1.RoleID = parseInt(property[0]);
            self1.Level = parseInt(property[1]);
            self1.HP = parseInt(property[2]);
            self1.Attack = parseInt(property[3]);
         

        property = this.self2ID.string.split(":");
        let self2 = new common.Role();         
            self2.RoleID = parseInt(property[0]);
            self2.Level = parseInt(property[1]);
            self2.HP = parseInt(property[2]);
            self2.Attack = parseInt(property[3]);
        

        property = this.self3ID.string.split(":");        
        let self3 = new common.Role();       
            self3.RoleID = parseInt(property[0]);
            self3.Level = parseInt(property[1]);
            self3.HP = parseInt(property[2]);
            self3.Attack = parseInt(property[3]);

        property = this.self4ID.string.split(":");
        let self4 = new common.Role(); 
            self4.RoleID = parseInt(property[0]);
            self4.Level = parseInt(property[1]);
            self4.HP = parseInt(property[2]);
            self4.Attack = parseInt(property[3]);

        property = this.self5ID.string.split(":");
        let self5 = new common.Role();
            self5.RoleID = parseInt(property[0]);
            self5.Level = parseInt(property[1]);
            self5.HP = parseInt(property[2]);
            self5.Attack = parseInt(property[3]);
        
        
        property = this.self6ID.string.split(":");
        let self6 = new common.Role();
            self6.RoleID = parseInt(property[0]);
            self6.Level = parseInt(property[1]);
            self6.HP = parseInt(property[2]);
            self6.Attack = parseInt(property[3]);
        

        self.RoleList = [self1, self2, self3, self4, self5, self6];

        let target = new common.UserBattleData();

        property = this.target1ID.string.split(":");
        let target1 = new common.Role();
            target1.RoleID = parseInt(property[0]);
            target1.Level = parseInt(property[1]);
            target1.HP = parseInt(property[2]);
            target1.Attack = parseInt(property[3]);
        

        property = this.target2ID.string.split(":");
        let target2 = new common.Role();
            target2.RoleID = parseInt(property[0]);
            target2.Level = parseInt(property[1]);
            target2.HP = parseInt(property[2]);
            target2.Attack = parseInt(property[3]);
        

        property = this.target3ID.string.split(":");
        let target3 = new common.Role();
            target3.RoleID = parseInt(property[0]);
            target3.Level = parseInt(property[1]);
            target3.HP = parseInt(property[2]);
            target3.Attack = parseInt(property[3]);
        
        
        property = this.target4ID.string.split(":");
        let target4 = new common.Role();
            target4.RoleID = parseInt(property[0]);
            target4.Level = parseInt(property[1]);
            target4.HP = parseInt(property[2]);
            target4.Attack = parseInt(property[3]);
        

        property = this.target5ID.string.split(":");
        let target5 = new common.Role();
            target5.RoleID = parseInt(property[0]);
            target5.Level = parseInt(property[1]);
            target5.HP = parseInt(property[2]);
            target5.Attack = parseInt(property[3]);
        

        property = this.target6ID.string.split(":");
        let target6 = new common.Role();
            target6.RoleID = parseInt(property[0]);
            target6.Level = parseInt(property[1]);
            target6.HP = parseInt(property[2]);
            target6.Attack = parseInt(property[3]);
        

        target.RoleList = [target1, target2, target3, target4, target5, target6];

        console.log("self team:", self);
        console.log("target team:", target);

        /*singleton.netSingleton.game.set_formationf(self, target).callBack(()=>{
            this.node.destroy();
        }, () => {
            console.log("gm_set_up error!");
            this.node.destroy();
        }).timeout(3000, () => {
            console.log("gm_set_up timeout!");
            this.node.destroy();
        });*/
for(let r of self.RoleList){
    console.log("角色血量："+r.HP+"角色攻击力："+r.Attack);
}
        let _battle = new battle.Battle(self, target);
        let _father = singleton.netSingleton.battle.father;
        singleton.netSingleton.battle.destory();
        singleton.netSingleton.battle = new battleDis.BattleDis(_battle);
        await singleton.netSingleton.battle.Start(_father,  async (event) =>
        {
            event();
        });

        this.node.destroy();
    }

    update(deltaTime: number) {
    }
}