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
}