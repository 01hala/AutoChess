import { JsonAsset, resources, error } from 'cc';
import * as enums from '../BattleEnums';
import { Direction, Priority } from '../common';

export class PVEventConfig
{
    public Id: number;
    public Type: number;
    public PropId:number;
    public RoleId:number;
    public RoleAttack:number;
    public RoleHP:number;
    public RoleLevel:number;
    public RoleEquip:number;
}

export async function LoadPVEventConfig() : Promise<Map<number, PVEventConfig>>
{
    return new Promise<Map<number, PVEventConfig>>((resolve, reject)=>
    {
        let map = new Map<number, PVEventConfig>();

        console.log("Load PVEvent Config begin!");
        resources.load('config/PVEvent', (err: any, res: JsonAsset) =>
        {
            if (err)
            {
                error(err.message || err);
                return;
            }
            // 获取到 Json 数据
            const jsonData: object = res.json!;
            Object.keys(jsonData).forEach((k) => 
            {
                let v = jsonData[k];

                let eventc = new PVEventConfig();
                eventc.Id = v["Id"];
                eventc.Type = v["Type"];
                eventc.PropId = v["PropID"];
                eventc.RoleId = v["RoleID"];
                eventc.RoleAttack = v["RoleAttack"];
                eventc.RoleHP=v["RoleHP"];
                eventc.RoleEquip = v["RoleEquip"];

                map.set(parseInt(k), eventc);   
             });
        });
        console.log("Load PVEvent Config end!");
        resolve(map);
    });
}
