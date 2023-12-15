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

    public constructor(selfCamp: enums.Camp, RoleList : common.Role[] ) {
        this.roleList = [];

        console.log("RoleList:", RoleList);

        let index = 0;
        for (let r of RoleList) 
        {
            if(null!=r)
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
     * 此函数向场上第一个空位置加入一个角色，如果满员则不加入。返回加入后的角色所在索引
     * Editor: Guanliu
     * 2023/9/27
     */
    public AddRole(role:role.Role):number{
        for(let i=0;i<this.roleList.length;i++){
            if(null==this.roleList[i]){
                this.roleList[i]=role;
                return i;
            }
        }

        //返回-1说明加入失败
        return -1;
    }
}