/*
 * role_config.ts
 * author: qianqians
 * 2023/10/3
 */
import { JsonAsset, resources, error } from 'cc';

export class RoleConfig {
    public Id : number;
    public Name : string;
    public Stage : number;
    public Level : number;
    public Price : number;
    public Attack : number;
    public Hp : number;
    public Fetters : number;
    public Hermes : number;
    public Skill : number;
    public Res : string;
}

export async function LoadSkillConfig() : Promise<Map<number, RoleConfig>> {
    return new Promise<Map<number, RoleConfig>>((resolve, reject)=>{
        let map = new Map<number, RoleConfig>();

        resources.load('config/Skill', (err: any, res: JsonAsset) => {
            if (err) {
                error(err.message || err);
                return;
            }
            // 获取到 Json 数据
            const jsonData: object = res.json!;
            Object.keys(jsonData).forEach((k) => {
                let v = jsonData[k];

                let rolec = new RoleConfig();
                rolec.Id = v["Id"];
                rolec.Name = v["Name"];
                rolec.Stage = v["Stage"];
                rolec.Level = v["Level"];
                rolec.Price = v["Price"];
                rolec.Attack = v["Attack"];
                rolec.Hp = v["Hp"];
                rolec.Fetters = v["Fetters"];
                rolec.Hermes = v["Hermes"];
                rolec.Skill = v["Skill"];
                rolec.Res = v["Res"];

                map.set(parseInt(k), rolec);
            });
        });

        resolve(map);
    });
}