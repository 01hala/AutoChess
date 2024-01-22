/*
 * buffer_config.ts
 * author: qianqians
 * 2023/10/3
 */
import { JsonAsset, resources, error } from 'cc';

export class BufferConfig {
    public Id : number;
    public Name : string;
    public Type : number;
    public Value : number;
    public Round : number;
}

export async function LoadBufferConfig() : Promise<Map<number, BufferConfig>> {
    return new Promise<Map<number, BufferConfig>>((resolve, reject)=>{
        let map = new Map<number, BufferConfig>();

        console.log("Load Buffer Config begin!");
        resources.load('config/buffer', (err: any, res: JsonAsset) => {
            if (err) {
                error(err.message || err);
                return;
            }
            // 获取到 Json 数据
            const jsonData: object = res.json!;
            Object.keys(jsonData).forEach((k) => {
                let v = jsonData[k];

                let bufferc = new BufferConfig();
                bufferc.Id = v["Id"];
                bufferc.Name = v["Name"];
                bufferc.Type = v["Type"];
                bufferc.Value = v["Value"];
                bufferc.Round = v["Round"];

                map.set(parseInt(k), bufferc);
            });

            console.log("Load Buffer Config end!");
            resolve(map);
        });
    });
}
