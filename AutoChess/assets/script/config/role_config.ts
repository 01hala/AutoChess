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
    public SkillID: number;
    public Price : number;
    public Attack : number;
    public Hp : number;
    public Fetters : number;
    public Hermes : number;
    public Res : string;
    public Avatar:string;
    public Skel:string;
    public Biomes:number;
    public Sex:string;
    public Armor:string;
}

export async function LoadRoleConfig() : Promise<Map<number, RoleConfig>> {
    return new Promise<Map<number, RoleConfig>>((resolve, reject)=>{
        let map = new Map<number, RoleConfig>();

        console.log("Load Role Config begin!");
        resources.load('config/Role', (err: any, res: JsonAsset) => {
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
                rolec.SkillID = v["Skill"];
                rolec.Stage = v["Stage"];
                rolec.Price = v["Price"];
                rolec.Attack = v["Attack"];
                rolec.Hp = v["Hp"];
                rolec.Fetters = v["Fetters"];
                rolec.Res = v["Res"];
                rolec.Avatar=v["Avatar"];
                rolec.Skel=v["Skel"];
                rolec.Biomes=v["Biomes"];
                rolec.Armor=v["Sex"];
                rolec.Armor=v["Armor"];

                map.set(parseInt(k), rolec);
            });

            console.log("Load Role Config end!");
            resolve(map);
        });
    });
}
