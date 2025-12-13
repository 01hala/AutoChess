/*
 * team.ts
 * author: qianqians
 * 2023/9/24
 */
import * as common from "./common"
import * as role from './role'
import * as battle from './battle'
import * as enums from './BattleEnums';

export class RoleBattleInfo {
    public roundAtkCount:number;
    public roundRemoteAtkCount : number;
    public roundBeAtkCount : number;
}

export class Team {
    private roleList : role.Role[]; //下标和站位不是对应的
    private battleData : common.UserBattleData;
    private roleBattleInfo : Map<number,RoleBattleInfo>;//根据站位查找角色在当前回合的战斗相关数据

    public onKillRole : (r:common.Role) => void;

    public constructor(selfCamp: enums.Camp, battleData:common.UserBattleData, RoleList : common.Role[] ) {
        this.roleList = [];
        this.battleData = battleData;

        console.log("RoleList:", RoleList);

        let index = 0;
        for (let r of RoleList) 
        {
            if(null!=r&&r.RoleID>100000)
            {
                let properties = new Map<enums.Property, number>();
                properties.set(enums.Property.HP, r.HP + r.TempHP);
                properties.set(enums.Property.TotalHP, r.HP + r.TempHP);
                properties.set(enums.Property.Attack, r.Attack + r.TempAttack);
                let _role = new role.Role(r,index, r.RoleID, r.Level, r.Number, selfCamp, properties, r.FettersSkillID,r.equipID,[...r.additionBuffer, ...r.TempAdditionBuffer]);
                _role.onKillRole = (_r:common.Role) => {
                    if (this.onKillRole) {
                        this.onKillRole.call(null, _r);
                    }
                };
                this.roleList.push(_role);
            }
            index++;
        }

        console.log("Team constructor this.roleList:", JSON.stringify(this.roleList));
    }

    public GetBattleData() {
        return this.battleData;
    }

    public GetRole(index:number) : role.Role {
        for (let r of this.roleList) {
            if (r.index == index) {
                return r;
            }
        }
        return null;
    }

    private AttackRoleIndex:number = -1;
    public SetAttackRole(index:number) {
        this.AttackRoleIndex = index;
    }
    public ReSetAttackRole() {
        this.AttackRoleIndex = -1;
    }

    public GetLasterRole() : role.Role {
        if (this.AttackRoleIndex > 0) {
            let r = this.GetRole(this.AttackRoleIndex);
            if (r) {
                return r;
            }
        }

        if(this.roleList[0])
        {
            return this.roleList[0];
        }
       else
       {
            console.warn("GetLasterRole 获取首位角色为空");
            return null; 
       }
    }

    public GetRoleIndex(role: role.Role) : number {
        return role.index;
    }

    private removeRole(role: role.Role) {
        console.log(`removeRole id:${role.id} selfCamp:${role.selfCamp}`);
        let index = this.roleList.indexOf(role);
        if (index != -1) {
            console.log(`removeRole index:${index} id:${role.id} selfCamp:${role.selfCamp}`);
            this.roleList.splice(index, 1);
        }
    }

    public CheckRemoveDeadRole(battle: battle.Battle) {
        let removeRoles = [];
        for (let r of this.roleList) {
            try {
                if (r.CheckDead()) {
                    removeRoles.push(r);
                }
            }
            catch(error) {
                console.log("CheckRemoveDeadRole CheckDead:", error);
                removeRoles.push(r);
            }   
        }

        if (removeRoles.length > 0) {
            //console.log("CheckRemoveDeadRole this.roleList:", JSON.stringify(this.roleList));
            //console.log("CheckRemoveDeadRole battle.evs:", JSON.stringify(battle.evs));
            for (let r of removeRoles) {
                if (battle.CheckRoleTriggerSkill(r, battle.evs)) {
                    console.log("CheckRemoveDeadRole not remove r:", JSON.stringify(r));
                    continue;
                }
                this.removeRole(r);
                r.SendExitEvent(battle);
            }
            return true;
        }

        return false;
    }
    
    public CheckDefeated() : boolean {
        return this.roleList.length <= 0;
    }

    /*
     * 添加
     * 此函数返回场上所有角色
     * Editor: Hotaru
     * 2023/9/25
     */
    public GetRoles():role.Role[]
    {
        return this.roleList.slice();
    }
    /*
     * 添加
     * 向当前阵营队列添加一个角色
     * Editor: Guanliu
     * 2023/9/30
     */
    public AddRole(role:role.Role){
        this.roleList.splice(role.index,0,role);
    }
    /*
     * 添加
     * 获取场上当前阵营第一个空位置的下标
     * Editor: Guanliu
     * 2024/1/30
     */
    public GetVacancies():number{
        let flag:Number[]=[0,0,0,0,0,0];
        for(let i=0;i<this.roleList.length;i++){  
            flag[this.roleList[i].index]=1;          
        }
        for(let i=0;i<6;i++){            
            if(flag[i]==0){
                console.log("场上存在空位")
                return i;
            }
        }

        console.log("场上不存在空位")
        //返回-1说明加入失败
        return -1;
    }

    /**
     * 判断前排是否为空
     * Editor:Hotaru
     * 2024/07/19添加
     */
    public CheckFront() : boolean
    {
        let flag = true;
        if(this.battleData.RoleList[0] || this.battleData.RoleList[1] || this.battleData.RoleList[2])
        {
            flag=false;
        }
        return flag;
    }

    /**
     * 换位
     * @param _begin 位置1
     * @param _end 位置2
     * Editor:Hotaru
     * 2024/08/19添加
     */
    public SwitchRole(_begin:number,_end:number)
    {
        console.log("switch role befor",this.roleList);
        let target_1 = null;
        let target_2 = null;
        let tempIndex;
        for (let i = 0; i < this.roleList.length; i++)
        {
            if (this.roleList[i].index == _begin)
            {
                target_1 = i;
            }
            if (this.roleList[i].index == _end)
            {
                target_2 = i;
            }
        }

        if (null!=target_2)
        {
            tempIndex = this.roleList[target_1].index;
            this.roleList[target_1].index = this.roleList[target_2].index;
            this.roleList[target_2].index = tempIndex;
        }
        else
        {
            this.roleList[target_1].index = _end;
        }
        //换位完重新排序
        for (let i = 0; i < this.roleList.length; i++)
        {
            for (let j = i + 1; j < this.roleList.length; j++)
            {
                let t;
                if (this.roleList[j].index < this.roleList[i].index)
                {
                    t = this.roleList[i];
                    this.roleList[i] = this.roleList[j];
                    this.roleList[j] = t;
                }
            }
        }
        console.log("switch role",this.roleList);
        
    }
}