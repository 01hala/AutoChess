/*
 * Plot_config.ts
 * author: hotaru
 * 2024/07/02
 */
import { error, JsonAsset, resources } from "cc";

export class PlotConfig 
{
    public Id:number; //对话剧情id
    public Progress:number; //对话进度
    public RoleId:number; //立绘角色id
    public Text:string; //文本
}

export async function LoadPlotConfig() : Promise<Map<number, PlotConfig>> {
    return new Promise<Map<number, PlotConfig>>((resolve, reject)=>{
        let map = new Map<number, PlotConfig>();

        console.log("Load Plot Config begin!");
        resources.load('config/Plot', (err: any, res: JsonAsset) => {
            if (err) {
                error(err.message || err);
                return;
            }
            // 获取到 Json 数据
            const jsonData: object = res.json!;
            Object.keys(jsonData).forEach((k) => {
                let v = jsonData[k];

                let plotc = new PlotConfig();
                plotc.Id = v["Id"];
                plotc.Progress = v["Progress"];
                plotc.RoleId = v["RoleId"];
                plotc.Text = v["Text"];

                map.set(parseInt(k), plotc);
            });

            console.log("Load Plot Config end!");
            resolve(map);
        });
    });
}
