import { JsonAsset, resources, error } from 'cc';
import * as enums from '../BattleEnums';
import { Direction, Priority } from '../common';

/**
 * @class 角色特效列表
 * @author Hotaru
 * @CreateTime 2024/11/30
 */
export class SpEffect
{
    public Id: number;
    public key:string;
    public path:string;
    public name:string;
}

export async function LoadSpConfig() : Promise<Map<string, SpEffect>>
{
    return new Promise((resolve)=>
    {
        let map = new Map<string, SpEffect>();

        console.log("Load SpList begin!");
        resources.load('config/SpList', (err: any, res: JsonAsset) => 
        {
            if (err) {
                error(err.message || err);
                return;
            }

            const jsonData: object = res.json!;
            Object.keys(jsonData).forEach((k) =>
            {
                let v = jsonData[k];
    
                let cfg = new SpEffect();
                cfg.Id = v["Id"];
                cfg.key = v["Key"];
                cfg.path = v["Path"];
                cfg.name = v["Name"];
    
                map.set(cfg.key , cfg);
            });
    
            console.log("Load SpList end! map:", map);
            resolve(map);
        });
    });
}