import { _decorator, Component, error, JsonAsset, Node, resources } from 'cc';
const { ccclass, property } = _decorator;

export class SkillSoundConfig {
    public Id: number;
    public Name:string;
    public Path:string;
}

export async function LoadSkillSoundConfig() : Promise<Map<number, SkillSoundConfig>>
{
    return new Promise<Map<number, SkillSoundConfig>>((resolve, reject)=>
        {
            let map = new Map<number, SkillSoundConfig>();

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

                    let soundc = new SkillSoundConfig();
                    soundc.Id = v["Id"];
                    soundc.Name = v["Name"];
                    soundc.Path = v["Path"];

                    map.set(parseInt(k), soundc);
            });

            console.log("Load SkillSound Config end!");
            resolve(map);
        });
    });
}



