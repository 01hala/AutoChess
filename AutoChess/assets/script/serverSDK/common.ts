import * as client_handle from "./client_handle";
/*this enum code is codegen by abelkhan codegen for ts*/

export enum Priority{
    Low = 1,
    Normal = 2,
    Hight = 3
}

export enum Direction{
    None = 0,
    Forward = 1,
    Back = 2,
    Rigiht = 3,
    Left = 4,
    Self = 5,
    Cross = 6
}

export enum BufferAndEquipEffect{
    AddHP = 1,
    AddAttack = 2,
    AddBuffer = 3,
    Syncope = 4
}

export enum EffectScope{
    SingleBattle = 1,
    WholeGame = 2
}

export enum EMSkillEvent{
    start_round = 1,
    end_round = 2,
    start_battle = 3,
    buy = 4,
    sales = 5,
    camp_sales = 6,
    update = 7,
    syncope = 8,
    camp_syncope = 9,
    strengthen = 10,
    use_skill = 11,
    eat_food = 12,
    camp_eat_food = 13,
    kill = 14,
    front_attack = 15,
    camp_attack3 = 16,
    front_attack3 = 17,
    be_hurt = 18,
    camp_be_hurt = 19,
    enemy_summon = 20,
    camp_summon = 21,
    front_be_hurt = 22,
    before_attack = 23,
    all_mechanic_syncope = 24
}

export enum SkillEffectEM{
    AddProperty = 1,
    RecoverHP = 2,
    RemoteAttack = 3,
    SummonBattle = 4,
    AddCoin = 5,
    ExchangeProperty = 6,
    GainShield = 7,
    RefreshShop = 8,
    ChangePosition = 9,
    AddEquipment = 10,
    ReductionHurt = 11,
    UpdateLevel = 12,
    SummonShop = 13,
    AddBuffer = 14,
    AddBuildValue = 15,
    AttackAll = 16
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

export class RoleCardInfo
{
    public roleID : number = 0;
    public isTatter : boolean = false;
    public Number : number = 0;

}

export function RoleCardInfo_to_protcol(_struct:RoleCardInfo){
    return _struct;
}

export function protcol_to_RoleCardInfo(_protocol:any){
    if (_protocol == null) {
        return null;
    }

    let _struct = new RoleCardInfo();
    for (const [key, val] of Object.entries(_protocol)) {
        if (key === "roleID"){
            _struct.roleID = val as number;
        }
        else if (key === "isTatter"){
            _struct.isTatter = val as boolean;
        }
        else if (key === "Number"){
            _struct.Number = val as number;
        }
    }
    return _struct;
}

export class Bag
{
    public ItemList : RoleCardInfo[] = [];

}

export function Bag_to_protcol(_struct:Bag){
    return _struct;
}

export function protcol_to_Bag(_protocol:any){
    if (_protocol == null) {
        return null;
    }

    let _struct = new Bag();
    for (const [key, val] of Object.entries(_protocol)) {
        if (key === "ItemList"){
            _struct.ItemList = [];
            for(let v_ of val as any) {
                _struct.ItemList.push(protcol_to_RoleCardInfo(v_));
            }
        }
    }
    return _struct;
}

export class RoleGroup
{
    public CardDeck : number = 0;
    public RoleList : number[] = [];

}

export function RoleGroup_to_protcol(_struct:RoleGroup){
    return _struct;
}

export function protcol_to_RoleGroup(_protocol:any){
    if (_protocol == null) {
        return null;
    }

    let _struct = new RoleGroup();
    for (const [key, val] of Object.entries(_protocol)) {
        if (key === "CardDeck"){
            _struct.CardDeck = val as number;
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

export class UserData
{
    public User : UserInformation | null = null;
    public Strength : number = 0;
    public gold : number = 0;
    public diamond : number = 0;
    public bag : Bag | null = null;
    public RoleList : number[] = [];
    public roleGroup : RoleGroup[] = [];

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
        else if (key === "gold"){
            _struct.gold = val as number;
        }
        else if (key === "diamond"){
            _struct.diamond = val as number;
        }
        else if (key === "bag"){
            _struct.bag = protcol_to_Bag(val);
        }
        else if (key === "RoleList"){
            _struct.RoleList = [];
            for(let v_ of val as any) {
                _struct.RoleList.push(v_);
            }
        }
        else if (key === "roleGroup"){
            _struct.roleGroup = [];
            for(let v_ of val as any) {
                _struct.roleGroup.push(protcol_to_RoleGroup(v_));
            }
        }
    }
    return _struct;
}

export class Fetters
{
    public fetters_id : number = 0;
    public fetters_level : number = 0;
    public number : number = 0;

}

export function Fetters_to_protcol(_struct:Fetters){
    return _struct;
}

export function protcol_to_Fetters(_protocol:any){
    if (_protocol == null) {
        return null;
    }

    let _struct = new Fetters();
    for (const [key, val] of Object.entries(_protocol)) {
        if (key === "fetters_id"){
            _struct.fetters_id = val as number;
        }
        else if (key === "fetters_level"){
            _struct.fetters_level = val as number;
        }
        else if (key === "number"){
            _struct.number = val as number;
        }
    }
    return _struct;
}

export class Role
{
    public RoleID : number = 0;
    public Level : number = 0;
    public SkillID : number = 0;
    public FettersSkillID : Fetters | null = null;
    public equipID : number = 0;
    public Number : number = 0;
    public HP : number = 0;
    public Attack : number = 0;
    public TempHP : number = 0;
    public TempAttack : number = 0;
    public additionBuffer : number[] = [];
    public TempAdditionBuffer : number[] = [];

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
        else if (key === "FettersSkillID"){
            _struct.FettersSkillID = protcol_to_Fetters(val);
        }
        else if (key === "equipID"){
            _struct.equipID = val as number;
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
            _struct.additionBuffer = [];
            for(let v_ of val as any) {
                _struct.additionBuffer.push(v_);
            }
        }
        else if (key === "TempAdditionBuffer"){
            _struct.TempAdditionBuffer = [];
            for(let v_ of val as any) {
                _struct.TempAdditionBuffer.push(v_);
            }
        }
    }
    return _struct;
}

export class UserBattleData
{
    public User : UserInformation | null = null;
    public coin : number = 0;
    public round : number = 0;
    public stage : number = 0;
    public victory : number = 0;
    public faild : number = 0;
    public buildValue : number = 0;
    public FettersList : Fetters[] = [];
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
        else if (key === "stage"){
            _struct.stage = val as number;
        }
        else if (key === "victory"){
            _struct.victory = val as number;
        }
        else if (key === "faild"){
            _struct.faild = val as number;
        }
        else if (key === "buildValue"){
            _struct.buildValue = val as number;
        }
        else if (key === "FettersList"){
            _struct.FettersList = [];
            for(let v_ of val as any) {
                _struct.FettersList.push(protcol_to_Fetters(v_));
            }
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
