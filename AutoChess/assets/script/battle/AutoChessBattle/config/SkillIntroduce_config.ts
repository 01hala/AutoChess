/*
 * SkillIntroduce_config.ts
 * author: hotaru
 * 2024/3/11
 */
import { JsonAsset, resources, error } from 'cc';
import { Direction, Priority } from '../common';

export class SkillIntroduceConfig {
    public Id: number;
    public Timeing_Text:string;
    public Leve1Text:string
    public Leve2Text:string
    public Leve3Text:string
}

export async function LoadSkillIntroduceConfig() : Promise<Map<number, SkillIntroduceConfig>>
{
    return new Promise<Map<number, SkillIntroduceConfig>>((resolve, reject)=>
        {
            let map = new Map<number, SkillIntroduceConfig>();

            console.log("Load SkillIntroduce Config begin!");
            resources.load('config/SkillIntroduce', (err: any, res: JsonAsset) => 
            {
                if (err) {
                    error(err.message || err);
                    return;
                }

                const jsonData: object = res.json!;
                Object.keys(jsonData).forEach((k) => {
                    let v = jsonData[k];

                    let skillc = new SkillIntroduceConfig();
                    skillc.Id = v["Id"];
                    skillc.Leve1Text = v["Leve1_Text"];
                    skillc.Leve2Text = v["Leve2_Text"];
                    skillc.Leve3Text = v["Leve3_Text"];
                    skillc.Timeing_Text=v["Timeing_Text"];

                    map.set(parseInt(k), skillc);
            });

            console.log("Load SkillIntroduce Config end!");
            resolve(map);
        });
    });
}

