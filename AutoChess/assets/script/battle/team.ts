/*
 * team.ts
 * author: qianqians
 * 2023/9/24
 */
import * as common from "../serverSDK/common"
import * as role from './role'
import * as enums from './enums'

export class Team {
    private roleList : role.Role[];

    public constructor(selfCamp: enums.Camp, RoleList : common.Role[] ) {
        this.roleList = [];

        for (let r of RoleList) {
            let properties = new Map<enums.Property, number>();
            properties.set(enums.Property.HP, r.HP);
            properties.set(enums.Property.TotalHP, r.HP);
            properties.set(enums.Property.Attack, r.Attack);
            this.roleList.push(new role.Role(r.RoleID, r.Level, selfCamp, properties, r.additionSkill, r.additionBuffer));
        }
    }

    public GetRole(index:number) : role.Role {
        if(index>=this.roleList.length) return null;
        return this.roleList[index];
    }

    public GetRoleIndex(role: role.Role) : number {
        return this.roleList.indexOf(role);
    }

    private removeRole(role: role.Role) {
        let index = this.roleList.indexOf(role);
        this.roleList.splice(index, 1);
    }

    public CheckRemoveDeadRole() {
        for (let r of this.roleList) {
            if (r.CheckDead()) {
                this.removeRole(r);
                this.CheckRemoveDeadRole();
                break;
            }
        }
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
 * 此函数向场上第一位置加入一个角色，如果满员则不加入。返回是否加入成功
 * Editor: Guanliu
 * 2023/9/27
 */
    public AddRole(role:role.Role):boolean{
        if(this.roleList.length>=6) return false;

        this.roleList.unshift(role);
        return true;
    }
/*
 * 添加
 * 此函数在第一位置角色倒下后补齐第一位置的空缺
 * Editor: Guanliu
 * 2023/10/16
 */
    public Repair()
    {
        if(null==this.roleList[0])
        {
            if(null!=this.roleList[3])//优先后排补位
            {
                this.roleList[0]=this.roleList[3];
                if(null!=this.roleList[5])//补位后先右边往中间移
                {
                    this.roleList[3]=this.roleList[5];
                    this.removeRole(this.roleList[5]);
                }
                else if(null!=this.roleList[4])//右边没有就移左边
                {
                    this.roleList[3]=this.roleList[4];
                    this.removeRole(this.roleList[4]);
                } 
                else
                {
                    this.removeRole(this.roleList[3]);
                }
            }
            else if(null!=this.roleList[2])//如果后排无人
            {
                this.roleList[0]=this.roleList[2];
                this.removeRole(this.roleList[2]);
            }
            else
            {
                this.roleList[0]=this.roleList[1];
                this.removeRole(this.roleList[1]);
            }
        }
    }
}