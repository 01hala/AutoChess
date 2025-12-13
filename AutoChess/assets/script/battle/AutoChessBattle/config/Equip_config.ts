/*
 * Prop_config.ts
 * author: hoataru
 * 2024/1/1
 */
import { JsonAsset, resources, error } from 'cc';
import * as config from './config'

export class EquipConfig {
    public Id: number;
    public Name: string;
    public Price:number;
    public Stage:number;
    public Effect: number;
    public AttackBonus:number;
    public HpBonus:number;
    public Vaule:number[];
    public Res:string;
    public Introduce:string;

    GetName(language: string = "chinese"): string {
        if (language == "chinese") {
            let cfg = config.config.LanguageConfig.get(this.Name);
            return cfg.chinese;
        }
        return "";
    }

    GetIntroduce(language: string = "chinese"): string {
        if (language == "chinese") {
            let cfg = config.config.LanguageConfig.get(this.Introduce);
            return cfg.chinese;
        }
        return "";
    }
}

export async function LoadEquipConfig() : Promise<Map<number, EquipConfig>>
{
    return new Promise<Map<number, EquipConfig>>((resolve, reject)=>
    {
        let map =new Map<number, EquipConfig>();
        console.log("Load Equips Config begin!");
        resources.load('config/Equip', (err: any, res: JsonAsset) => {
            if (err) {
                error(err.message || err);
                return;
            }
            // 获取到 Json 数据
            const jsonData: object = res.json!;
            Object.keys(jsonData).forEach((k) => {
                let v = jsonData[k];

                let equipc = new EquipConfig();
                equipc.Id = v["Id"];
                equipc.Name = v["Name"];
                equipc.Price = v["Price"];
                equipc.Stage = v["Price"];
                equipc.Introduce=v["Introduce"];

                equipc.Effect=v["Effect"];
                equipc.AttackBonus= v["AttackBonus"];
                equipc.HpBonus = v["HpBonus"];

                let value =v["Value"];
                console.log("value:", value);
                let vs:string[]=value.split('|');
                let v1:number[]=[];
                for(let s of vs)
                {
                    v1.push(parseInt(s));
                }
                equipc.Vaule=v1;
                equipc.Res=v["Res"];

                map.set(parseInt(k), equipc);
                console.log("Load Equips Config End!");
            });

            resolve(map);
        });
    });

}

