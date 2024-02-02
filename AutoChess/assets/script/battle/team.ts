/*
 * team.ts
 * author: qianqians
 * 2023/9/24
 */
import * as common from "../serverSDK/common"
import * as role from './role'
import * as battle from './battle'
import * as enums from '../other/enums'

export class Team {
    private roleList : role.Role[];
    private battleData : common.UserBattleData;

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
                this.roleList.push(new role.Role(index, r.RoleID, r.Level, r.Number, selfCamp, properties, r.FettersSkillID, [...r.additionBuffer, ...r.TempAdditionBuffer]));
            }
            index++;
        }
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

    public GetLasterRole() : role.Role {
        return this.roleList[0];
    }

    public GetRoleIndex(role: role.Role) : number {
        return role.index;
    }

    private removeRole(role: role.Role) {
        let index = this.roleList.indexOf(role);
        if (index != -1) {
            this.roleList.splice(index, 1);
        }
    }

    public CheckRemoveDeadRole(battle: battle.Battle) {
        let removeRoles = [];
        for (let r of this.roleList) {
            try {
                if (r.CheckDead()) {
                    removeRoles.push(r);

                    r.SendExitEvent(battle);
                }
            }
            catch(error) {
                console.log("CheckRemoveDeadRole CheckDead:", error);

                removeRoles.push(r);

                r.SendExitEvent(battle);
            }   
        }

        if (removeRoles.length > 0) {
            for (let r of removeRoles) {
                this.removeRole(r);
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
        return this.roleList;
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
}