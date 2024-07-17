/*
 * config.ts
 * author: qianqians
 * 2023/10/2
 */
import * as skill_config from './skill_config'
import * as buffer_config from './buffer_config'
import * as role_config from './role_config'
import * as bundle_config from './bundle_config'
import * as Food_config from './Food_config';
import * as fetters from './fetters_config'
import * as Equip_Config from './Equip_config';
import * as task_config from './task_config';
import * as SkillIntroduce_config from './SkillIntroduce_config'
import * as  FetterIntroduceConfig from './FetterIntroduce_config';
import * as PlotConfig from "./Plot_config";

export class config {
    public static MechanicFetters = 6;

    public static SkillConfig : Map<number, skill_config.SkillConfig>;
    public static FettersConfig:Map<number,fetters.FettersConfig>
    public static BufferConfig : Map<number, buffer_config.BufferConfig>;
    public static RoleConfig : Map<number, role_config.RoleConfig>;
    public static BundleConfig:Map<number, bundle_config.BundleConfig>;
    public static FoodConfig:Map<number,Food_config.FoodConfig>;
    public static EquipConfig:Map<number,Equip_Config.EquipConfig>;
    public static TaskConfig:Map<number,task_config.TaskConfig>;
    public static SkillIntroduceConfig:Map<number,SkillIntroduce_config.SkillIntroduceConfig>;
    public static FetterIntroduceConfig:Map<number,FetterIntroduceConfig.FetterIntroduceConfig>;
    public static PlotConfig:Map<number,PlotConfig.PlotConfig>;

    public static async load()
    {
        config.SkillConfig = await skill_config.LoadSkillConfig();
        config.FettersConfig = await fetters.LoadFettersConfig();
        config.BufferConfig = await buffer_config.LoadBufferConfig();
        config.RoleConfig = await role_config.LoadRoleConfig();
        config.BundleConfig = await bundle_config.LoadBundleConfig();
        config.FoodConfig = await Food_config.LoadFoodConfig();
        config.EquipConfig = await Equip_Config.LoadEquipConfig();
        config.TaskConfig = await task_config.LoadTaskConfig();
        config.SkillIntroduceConfig = await SkillIntroduce_config.LoadSkillIntroduceConfig();
        config.FetterIntroduceConfig = await FetterIntroduceConfig.LoadFetterIntroduceConfig();
        //config.PlotConfig = await PlotConfig.LoadPlotConfig();
    }
}