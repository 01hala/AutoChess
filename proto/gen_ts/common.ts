import * as client_handle from "./client_handle";
/*this enum code is codegen by abelkhan codegen for ts*/

export enum ShopSkillEffectEM{
    AddProperty = 1,
    AddCoin = 2,
    RefreshShop = 3,
    AddEquipment = 4
}

export enum ShopIndex{
    Role = 0,
    Prop = 1
}

/*this struct code is codegen by abelkhan codegen for typescript*/
export class UserInformation
{
    public UserName : string = "";
    public UserGuid : number = 0;

}

export function UserInformation_to_protcol(_struct:UserInformation){
    return _struct;
}

export function protcol_to_UserInformation(_protocol:any){
    if (_protocol == null) {
        return null;
    }

    let _struct = new UserInformation();
    for (const [key, val] of Object.entries(_protocol)) {
        if (key === "UserName"){
            _struct.UserName = val as string;
        }
        else if (key === "UserGuid"){
            _struct.UserGuid = val as number;
        }
    }
    return _struct;
}

export class UserData
{
    public User : UserInformation | null = null;
    public Strength : number = 0;
    public RoleList : number[] = [];

}

export function UserData_to_protcol(_struct:UserData){
    return _struct;
}

export function protcol_to_UserData(_protocol:any){
    if (_protocol == null) {
        return null;
    }

    let _struct = new UserData();
    for (const [key, val] of Object.entries(_protocol)) {
        if (key === "User"){
            _struct.User = protcol_to_UserInformation(val);
        }
        else if (key === "Strength"){
            _struct.Strength = val as number;
        }
        else if (key === "RoleList"){
            _struct.RoleList = [];
            for(let v_ of val as any) {
                _struct.RoleList.push(v_);
            }
        }
    }
    return _struct;
}

export class Role
{
    public RoleID : number = 0;
    public Level : number = 0;
    public SkillID : number = 0;
    public Number : number = 0;
    public HP : number = 0;
    public Attack : number = 0;
    public TempHP : number = 0;
    public TempAttack : number = 0;
    public additionBuffer : number = 0;
    public TempAdditionBuffer : number = 0;

}

export function Role_to_protcol(_struct:Role){
    return _struct;
}

export function protcol_to_Role(_protocol:any){
    if (_protocol == null) {
        return null;
    }

    let _struct = new Role();
    for (const [key, val] of Object.entries(_protocol)) {
        if (key === "RoleID"){
            _struct.RoleID = val as number;
        }
        else if (key === "Level"){
            _struct.Level = val as number;
        }
        else if (key === "SkillID"){
            _struct.SkillID = val as number;
        }
        else if (key === "Number"){
            _struct.Number = val as number;
        }
        else if (key === "HP"){
            _struct.HP = val as number;
        }
        else if (key === "Attack"){
            _struct.Attack = val as number;
        }
        else if (key === "TempHP"){
            _struct.TempHP = val as number;
        }
        else if (key === "TempAttack"){
            _struct.TempAttack = val as number;
        }
        else if (key === "additionBuffer"){
            _struct.additionBuffer = val as number;
        }
        else if (key === "TempAdditionBuffer"){
            _struct.TempAdditionBuffer = val as number;
        }
    }
    return _struct;
}

export class UserBattleData
{
    public User : UserInformation | null = null;
    public coin : number = 0;
    public round : number = 0;
    public victory : number = 0;
    public faild : number = 0;
    public RoleList : Role[] = [];

}

export function UserBattleData_to_protcol(_struct:UserBattleData){
    return _struct;
}

export function protcol_to_UserBattleData(_protocol:any){
    if (_protocol == null) {
        return null;
    }

    let _struct = new UserBattleData();
    for (const [key, val] of Object.entries(_protocol)) {
        if (key === "User"){
            _struct.User = protcol_to_UserInformation(val);
        }
        else if (key === "coin"){
            _struct.coin = val as number;
        }
        else if (key === "round"){
            _struct.round = val as number;
        }
        else if (key === "victory"){
            _struct.victory = val as number;
        }
        else if (key === "faild"){
            _struct.faild = val as number;
        }
        else if (key === "RoleList"){
            _struct.RoleList = [];
            for(let v_ of val as any) {
                _struct.RoleList.push(protcol_to_Role(v_));
            }
        }
    }
    return _struct;
}

export class ShopRole
{
    public RoleID : number = 0;
    public SkillID : number = 0;
    public HP : number = 0;
    public Attack : number = 0;
    public IsFreeze : boolean = false;

}

export function ShopRole_to_protcol(_struct:ShopRole){
    return _struct;
}

export function protcol_to_ShopRole(_protocol:any){
    if (_protocol == null) {
        return null;
    }

    let _struct = new ShopRole();
    for (const [key, val] of Object.entries(_protocol)) {
        if (key === "RoleID"){
            _struct.RoleID = val as number;
        }
        else if (key === "SkillID"){
            _struct.SkillID = val as number;
        }
        else if (key === "HP"){
            _struct.HP = val as number;
        }
        else if (key === "Attack"){
            _struct.Attack = val as number;
        }
        else if (key === "IsFreeze"){
            _struct.IsFreeze = val as boolean;
        }
    }
    return _struct;
}

export class ShopProp
{
    public PropID : number = 0;
    public IsFreeze : boolean = false;

}

export function ShopProp_to_protcol(_struct:ShopProp){
    return _struct;
}

export function protcol_to_ShopProp(_protocol:any){
    if (_protocol == null) {
        return null;
    }

    let _struct = new ShopProp();
    for (const [key, val] of Object.entries(_protocol)) {
        if (key === "PropID"){
            _struct.PropID = val as number;
        }
        else if (key === "IsFreeze"){
            _struct.IsFreeze = val as boolean;
        }
    }
    return _struct;
}

export class ShopData
{
    public SaleRoleList : ShopRole[] = [];
    public SalePropList : ShopProp[] = [];

}

export function ShopData_to_protcol(_struct:ShopData){
    return _struct;
}

export function protcol_to_ShopData(_protocol:any){
    if (_protocol == null) {
        return null;
    }

    let _struct = new ShopData();
    for (const [key, val] of Object.entries(_protocol)) {
        if (key === "SaleRoleList"){
            _struct.SaleRoleList = [];
            for(let v_ of val as any) {
                _struct.SaleRoleList.push(protcol_to_ShopRole(v_));
            }
        }
        else if (key === "SalePropList"){
            _struct.SalePropList = [];
            for(let v_ of val as any) {
                _struct.SalePropList.push(protcol_to_ShopProp(v_));
            }
        }
    }
    return _struct;
}

export class svr_info
{
    public tick_time : number = 0;
    public player_num : number = 0;

}

export function svr_info_to_protcol(_struct:svr_info){
    return _struct;
}

export function protcol_to_svr_info(_protocol:any){
    if (_protocol == null) {
        return null;
    }

    let _struct = new svr_info();
    for (const [key, val] of Object.entries(_protocol)) {
        if (key === "tick_time"){
            _struct.tick_time = val as number;
        }
        else if (key === "player_num"){
            _struct.player_num = val as number;
        }
    }
    return _struct;
}

/*this module code is codegen by abelkhan codegen for typescript*/
