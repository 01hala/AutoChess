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

/*
 * 此函数返回场上所有角色
 * Editor: Hotaru
 * 2023/9/25
 */
    public GetRoles():role.Role[]
    {
        return this.roleList;
    }
}