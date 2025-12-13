/*
 * task_config.ts
 * author: guanliu
 * 2024/5/3
 */
import { JsonAsset, resources, error } from 'cc';
import { Achievement } from '../common';
import * as config from './config'

export class TaskConfig {
    public Id : number;
    public Name : string;
    public tClass : string;
    public tLable: string;
    public Condition : string;
    public tValue:number;
    public Reward : Map<string,number>;

    GetName(language: string = "chinese"): string {
        if (language == "chinese") {
            let cfg = config.config.LanguageConfig.get(this.Name);
            return cfg.chinese;
        }
        return "";
    }

    GetLable(language: string = "chinese"): string {
        if (language == "chinese") {
            let cfg = config.config.LanguageConfig.get(this.tLable);
            return cfg.chinese;
        }
        return "";
    }
}

export async function LoadTaskConfig() : Promise<Map<number, TaskConfig>> {
    return new Promise<Map<number, TaskConfig>>((resolve, reject)=>{
        let map = new Map<number, TaskConfig>();

        console.log("Load Task Config begin!");
        resources.load('config/Task', (err: any, res: JsonAsset) => {
            if (err) {
                error(err.message || err);
                return;
            }
            // 获取到 Json 数据
            const jsonData: object = res.json!;
            Object.keys(jsonData).forEach((k) => {
                let v = jsonData[k];

                let taskc = new TaskConfig();
                taskc.Id = v["ID"];
                taskc.Name = v["Name"];
                taskc.tClass=Achievement[v["Class"]];
                taskc.tLable=v["Lable"];
                taskc.Condition=v["Condition"];
                taskc.tValue=v["Value"];
                taskc.Reward=new Map<string,number>();
                let tempList:string[] = v["Reward"] == "" ? [] : JSON.parse(v["Reward"]);
                taskc.Reward.set(tempList[0],parseInt(tempList[1]));
                // for(let t of tempList){
                //     let temp = t.split(".");
                //     let key=temp.shift();   
                //     let value=temp.map(Number);                
                //     taskc.Reward.set(key,value);
                // }
                
                map.set(parseInt(k), taskc);
            });

            console.log("Load Task Config end!");
            resolve(map);
        });
    });
}
