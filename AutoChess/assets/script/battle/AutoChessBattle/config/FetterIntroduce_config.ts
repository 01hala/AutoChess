/*
 * FetterIntroduce_config.ts
 * author: Guanliu
 * 2024/5/17
 */
import { JsonAsset, resources, error } from 'cc';

export class FetterIntroduceConfig {
    public Id: number;
    public FetterName:string;
    public Introductory:string;
    public EffectTime:string
    public Text:string
}

export async function LoadFetterIntroduceConfig() : Promise<Map<number, FetterIntroduceConfig>>
{
    return new Promise<Map<number, FetterIntroduceConfig>>((resolve, reject)=>
        {
            let map = new Map<number, FetterIntroduceConfig>();

            console.log("Load FetterIntroduce Config begin!");
            resources.load('config/FetterIntroduce', (err: any, res: JsonAsset) => 
            {
                if (err) {
                    error(err.message || err);
                    return;
                }

                const jsonData: object = res.json!;
                Object.keys(jsonData).forEach((k) => {
                    let v = jsonData[k];

                    let fetterItroducec = new FetterIntroduceConfig();
                    fetterItroducec.Id = v["Id"];
                    fetterItroducec.FetterName=v["FetterName"];
                    fetterItroducec.Introductory = v["Introductory"];
                    fetterItroducec.EffectTime = v["EffectTime"];
                    fetterItroducec.Text=v["Text"];

                    map.set(parseInt(k), fetterItroducec);
            });

            console.log("Load FetterIntroduce Config end!");
            resolve(map);
        });
    });
}

