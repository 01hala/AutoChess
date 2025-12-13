/*
 * skill_config.ts
 * author: qianqians
 * 2023/10/2
 */
import { JsonAsset, resources, error } from 'cc';
import * as enums from '../BattleEnums';
import { Direction, Priority } from '../common';
import * as config from './config'

export class SkillConfig {
    public Id: number;
    public Name: string;
    public Type: string;
    public Desc: string;
    public Priority: Priority;
    public EffectTime: number;
    public Effect: number;
    public ObjCount: number;
    public EffectScope:number;
    public ObjectDirection: Direction;
    public Level1Value_1: number;
    public Level1Value_2: number;
    public Level2Value_1: number;
    public Level2Value_2: number;
    public Level3Value_1: number;
    public Level3Value_2: number;
    public SummonId: number[];
    public SummonLevel: number;
    public ChangeLocationType : enums.ChangeLocationType;
    public SwapPropertiesType : enums.SwapPropertiesType;
    public AddBufferID: number;
    public SkillAudio: string;

    GetName(language: string = "chinese"): string {
        if (language == "chinese") {
            let cfg = config.config.LanguageConfig.get(this.Name);
            return cfg.chinese;
        }
        return "";
    }

    GetDesc(language: string = "chinese"): string {
        if (language == "chinese") {
            let cfg = config.config.LanguageConfig.get(this.Desc);
            return cfg.chinese;
        }
        return "";
    }
}

export async function LoadSkillConfig() : Promise<Map<number, SkillConfig>> {
    return new Promise<Map<number, SkillConfig>>((resolve, reject)=>{
        let map = new Map<number, SkillConfig>();

        console.log("Load Skill Config begin!");
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
                skillc.Desc = v["desc"];
                skillc.Priority = Priority[v["Priority"] as keyof typeof Priority];
                skillc.EffectTime = v["EffectTime"];
                skillc.Effect = v["Effect"];
                skillc.ObjCount = v["ObjCount"];
                skillc.EffectScope=v["EffectScope"];
                skillc.ObjectDirection = v["ObjDirection"];
                skillc.Level1Value_1 = v["Level1Value_1"];
                skillc.Level1Value_2 = v["Level1Value_2"];
                skillc.Level2Value_1 = v["Level2Value_1"];
                skillc.Level2Value_2 = v["Level2Value_2"];
                skillc.Level3Value_1 = v["Level3Value_1"];
                skillc.Level3Value_2 = v["Level3Value_2"];
                skillc.SummonId = v["SummonId"] == "" ? [] : JSON.parse(v["SummonId"]);
                skillc.SummonLevel = v["SummonLevel"];
                skillc.ChangeLocationType = v["ChangePositionType"];
                skillc.SwapPropertiesType = v["SwapPropertiesType"];
                skillc.AddBufferID =  v["AddBufferID"];
                skillc.SkillAudio = v["SkillAudio"];

                map.set(parseInt(k), skillc);
            });

            console.log("Load Skill Config end!");
            resolve(map);
        });
    });
}