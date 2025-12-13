import { JsonAsset, resources, error, builtinResMgr } from 'cc';
import * as enums from '../BattleEnums';
import { Direction, Priority } from '../common';

/**
 * @class 角色特效配置
 * @author Hotaru
 * @CreateTime 2024/11/27
 */
export class RoleSpConfig
{
    public Id: number=0;
    public IntensifierSelf:string="";
    public Admission:string="";
    public UseSkill:string="";
    /**
     * 技能发动时
     * @tip 只有两个元素 0为技能，1为羁绊
     */
    public OnSkill:string[]=[];
    public IntensifierColony:string="";
    /** 
     * 飞行物列
     * @tip 只有两个元素 0为增益球，1为远程攻击子弹
     * */
    public Projectiles:string[]=[];
}

export async function LoadRoleSpConfig() : Promise<Map<number, RoleSpConfig>>
{
    return new Promise((resolve)=>
    {
        let map = new Map<number, RoleSpConfig>();

        console.log("Load RoleSpEffect Config begin!");
        resources.load('config/RoleSp', (err: any, res: JsonAsset) => 
        {
            if (err) {
                error(err.message || err);
                return;
            }

            const jsonData: object = res.json!;
            Object.keys(jsonData).forEach((k) =>
            {
                let v = jsonData[k];
    
                let cfg = new RoleSpConfig();
                cfg.Id = v["Id"];
                cfg.IntensifierSelf = v["IntensifierSelf"];
                cfg.Admission = v["Admission"]?v["Admission"]:"null";
                cfg.UseSkill = v["UseSkill"] ?v["UseSkill"]:"null";
                let tlist=v["OnSkill"];
                if(tlist)
                {
                    cfg.OnSkill = tlist.split(';');
                }
                cfg.IntensifierColony=v["intensifierColony"];
                tlist=v["Projectiles"];
                if(tlist)
                {
                    cfg.Projectiles=tlist.split(';');
                }
    
                map.set(parseInt(k), cfg);
            });
    
            console.log("Load Skill Config end!");
            resolve(map);
        });
    });
}

