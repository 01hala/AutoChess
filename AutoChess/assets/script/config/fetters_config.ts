/*
 * skill_config.ts
 * author: qianqians
 * 2023/10/2
 */
import { JsonAsset, resources, error } from 'cc';
import { ChangePositionType, SwapPropertiesType } from '../other/enums';
import { Direction, Priority, Role } from '../serverSDK/common';

export class FettersConfig {
    public Id: number;
    public Name: string;
    public Priority: Priority;
    public EffectTime: number;
    public Effect: number;
    public RoleNum: string;
    public roleNum:number[];
    public ObjCount: number[];
    public EffectScope: number;
    public Stage1value_1: number;
    public Stage1value_2: number;
    public Stage2value_1: number;
    public Stage2value_2: number;
    public Stage3value_1: number;
    public Stage3value_2: number;
    public Stage4value_1: number;
    public Stage4value_2: number;
    public SummonId: number;
    public SummonLevel: number;
    public RefreshItemID: number;
    public RefreshItemNum: number;
    public AddBufferID: number;
    public Res:string;
    public FetterAudio:string;
}

export async function LoadFettersConfig() : Promise<Map<number, FettersConfig>> {
    return new Promise<Map<number, FettersConfig>>((resolve, reject)=>{
        let map = new Map<number, FettersConfig>();

        console.log("Load Fetters Config begin!");
        resources.load('config/Fetters', (err: any, res: JsonAsset) => {
            if (err) {
                error(err.message || err);
                return;
            }
            // 获取到 Json 数据
            const jsonData: object = res.json!;
            Object.keys(jsonData).forEach((k) => {
                let v = jsonData[k];

                let fettersc = new FettersConfig();
                fettersc.Id =  v["Id"];
                fettersc.Name =  v["Name"];
                fettersc.Priority = Priority[v["Priority"] as keyof typeof Priority];
                fettersc.EffectTime =  v["EffectTime"];
                fettersc.Effect =  v["Effect"];
                fettersc.RoleNum =  v["RoleNum"];
                let t=fettersc.RoleNum.split("|");
                fettersc.roleNum=t.map(Number);

                var count:string = v["ObjCount"];
                console.log("ObjCount:", count);
                var objCount = count.split("|");
                fettersc.ObjCount =  objCount.map(Number);

                fettersc.EffectScope =  v["EffectScope"];
                fettersc.Stage1value_1 =  v["Stage1value_1"];
                fettersc.Stage1value_2 =  v["Stage1value_2"];
                fettersc.Stage2value_1 =  v["Stage2value_1"];
                fettersc.Stage2value_2 =  v["Stage2value_2"];
                fettersc.Stage3value_1 =  v["Stage3value_1"];
                fettersc.Stage3value_2 =  v["Stage3value_2"];
                fettersc.Stage4value_1 =  v["Stage4value_1"];
                fettersc.Stage4value_2 =  v["Stage4value_2"];
                fettersc.SummonId =  v["SummonId"];
                fettersc.SummonLevel =  v["SummonLevel"];
                fettersc.RefreshItemID =  v["RefreshItemID"];
                fettersc.RefreshItemNum =  v["RefreshItemNum"];
                fettersc.AddBufferID =  v["AddBufferID"];
                fettersc.Res=v["Res"];
                fettersc.FetterAudio=v["FetterAudio"];

                map.set(parseInt(k), fettersc);
            });

            console.log("Load Fetters Config end!");
            resolve(map);
        });
    });
}