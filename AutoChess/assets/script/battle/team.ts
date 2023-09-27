/*
 * team.ts
 * author: qianqians
 * 2023/9/24
 */
import * as role from './role'

export class Team {
    private roleList : role.Role[];

    public GetRole(index:number) : role.Role {
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
}