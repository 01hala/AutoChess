/*
 * skill_config.ts
 * author: qianqians
 * 2023/10/2
 */
import { JsonAsset, resources, error } from 'cc';
import { Direction, ChangePositionType, SwapPropertiesType } from '../battle/enums';

export enum Priority {
    Low = 1,
    Normal = 2,
    Hight = 3,
}

export class SkillConfig {
    public Id: number;
    public Name: string;
    public Type: string;
    public Priority: Priority;
    public EffectTime: number;
    public Effect: number;
    public ObjCount: number;
    public ObjectDirection: Direction;
    public Level1Value_1: number;
    public Level1Value_2: number;
    public Level2Value_1: number;
    public Level2Value_2: number;
    public Level3Value_1: number;
    public Level3Value_2: number;
    public SummonId: number[];
    public SummonLevel: number;
    public ChangePositionType : ChangePositionType;
    public SwapPropertiesType : SwapPropertiesType;
}

export async function LoadSkillConfig() : Promise<Map<number, SkillConfig>> {
    return new Promise<Map<number, SkillConfig>>((resolve, reject)=>{
        let map = new Map<number, SkillConfig>();

        resources.load('config/Skill', (err: any, res: JsonAsset) => {
            if (err) {
                error(err.message || err);
                return;
            }
            // 获取到 Json 数据
            const jsonData: object = res.json!;
            Object.keys(jsonData).forEach((k) => {
                let v = jsonData[k];

                let skillc = new SkillConfig();
                skillc.Id = v["Id"];
                skillc.Name = v["Name"];
                skillc.Type = v["Type"];
                skillc.Priority = Priority[v["Priority"] as keyof typeof Priority];
                skillc.EffectTime = v["EffectTime"];
                skillc.Effect = v["Effect"];
                skillc.ObjCount = v["ObjCount"];
                skillc.ObjectDirection = v["ObjectDirection"];
                skillc.Level1Value_1 = v["Level1Value_1"];
                skillc.Level1Value_2 = v["Level1Value_2"];
                skillc.Level2Value_1 = v["Level2Value_1"];
                skillc.Level2Value_2 = v["Level2Value_2"];
                skillc.Level3Value_1 = v["Level3Value_1"];
                skillc.Level3Value_2 = v["Level3Value_2"];
                skillc.SummonId = JSON.parse(v["SummonId"]);
                skillc.SummonLevel = v["SummonLevel"];
                skillc.ChangePositionType = v["ChangePositionType"];
                skillc.SwapPropertiesType = v["SwapPropertiesType"];

                map.set(parseInt(k), skillc);
            });
        })

        resolve(map);
    });
}