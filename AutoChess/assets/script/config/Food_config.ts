/*
 * Prop_config.ts
 * author: hoataru
 * 2023/10/2
 */
import { JsonAsset, resources, error } from 'cc';
import { ChangePositionType, SwapPropertiesType } from '../other/enums';


export class FoodConfig {
    public Id: number;
    public Name: string;
    public Price:number;
    public Stage:number;
    public Effect: number[];
    public EffectScope:number;
    public AttackBonus:number;
    public HpBonus:number;
    public Vaule:number;
    public Count:number;
    public Res:string;

}

export async function LoadFoodConfig() : Promise<Map<number, FoodConfig>> {
    return new Promise<Map<number, FoodConfig>>((resolve, reject)=>{
        let map = new Map<number, FoodConfig>();

        console.log("Load Food Config begin!");
        resources.load('config/Food', (err: any, res: JsonAsset) => {
            if (err) {
                error(err.message || err);
                return;
            }
            // 获取到 Json 数据
            const jsonData: object = res.json!;
            Object.keys(jsonData).forEach((k) => {
                let v = jsonData[k];

                let foodc = new FoodConfig();
                foodc.Id = v["Id"];
                foodc.Name = v["Name"];
                foodc.Price = v["Price"];
                foodc.Stage = v["Price"];

                let effect=v["Effect"];
                let es:string[]=effect.split('|');
                let e:number[]=[];
                for(let s of es)
                {
                    e.push(parseInt(s));
                }
                foodc.Effect=e;
                
                foodc.EffectScope = v["EffectScope"];
                foodc.Count = v["Count"];
                foodc.AttackBonus= v["AttackBonus"];
                foodc.HpBonus = v["HpBonus"];
                foodc.Res=v["Res"];

                map.set(parseInt(k), foodc);
            });

            console.log("Load Food Config end!");
            resolve(map);
        });
    });
}