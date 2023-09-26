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
        this.roleList = this.roleList.splice(index, 1);
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
}