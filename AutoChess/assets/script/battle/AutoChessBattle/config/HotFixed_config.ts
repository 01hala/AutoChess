/*
 * Plot_config.ts
 * author: hotaru
 * 2024/07/02
 */
import { error, JsonAsset } from "cc";
import { BundleManager } from '../../../bundle/BundleManager';

export class HotFixed_config 
{
    public OpenJoinWXGroup:boolean;
}

export async function LoadHotFixedConfig() : Promise<HotFixed_config> {
    console.log("Load HotFixed Config begin!");
    let res = await BundleManager.Instance.loadAssetsFromBundle('config', 'HotFixed') as JsonAsset;
    // 获取到 Json 数据
    const jsonData: object = res.json!;
    let obj = new HotFixed_config();
    obj.OpenJoinWXGroup = jsonData["OpenJoinWXGroup"];

    console.log("Load HotFixed Config end!");

    return obj;
}
