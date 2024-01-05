/*
 * Bundle_config.ts
 * author: Hotaru
 * 2023/10/14
 */
import { JsonAsset, resources, error } from 'cc';
import {ChangePositionType, SwapPropertiesType } from '../other/enums';


export class BundleConfig 
{
    public ID:number;
    public Name:string;
    public URL:string;
    public Path:string;
}

export async function LoadBundleConfig() : Promise<Map<number, BundleConfig >> {
    return new Promise<Map<number, BundleConfig >>((resolve, reject)=>{
        let map = new Map<number, BundleConfig >();

        console.log("Load Bundle Config begin!");
        resources.load('config/Bundle', (err: any, res: JsonAsset) => {
            if (err) {
                error(err.message || err);
                return;
            }
            // 获取到 Json 数据
            const jsonData: object = res.json!;
            Object.keys(jsonData).forEach((k) => {
                let v = jsonData[k];

                let bundlec = new BundleConfig();

                bundlec.ID=v["ID"];
                bundlec.Name=v["Name"];
                bundlec.URL=v["URL"];
                bundlec.Path=v["Path"];

                map.set(parseInt(k), bundlec);
            });
        })

        console.log("Load Bundle Config end!");
        resolve(map);
    });
}