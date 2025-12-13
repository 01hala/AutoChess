/*
 * Plot_config.ts
 * author: hotaru
 * 2024/07/02
 */
import { error, JsonAsset, resources } from "cc";

export class LanguageConfig 
{
    public Id:string;      //文本通配符
    public chinese:string; //中文文本
}

export async function LoadLanguageConfig() : Promise<Map<string, LanguageConfig>> {
    return new Promise<Map<string, LanguageConfig>>((resolve, reject)=>{
        let map = new Map<string, LanguageConfig>();

        console.log("Load Language Config begin!");
        resources.load('config/language', (err: any, res: JsonAsset) => {
            if (err) {
                error(err.message || err);
                return;
            }
            // 获取到 Json 数据
            const jsonData: object = res.json!;
            Object.keys(jsonData).forEach((k) => {
                let v = jsonData[k];

                let l = new LanguageConfig();
                l.Id = v["id"];
                l.chinese = v["chinese"];

                map.set(l.Id, l);
            });

            console.log("Load Language Config end!");
            resolve(map);
        });
    });
}
