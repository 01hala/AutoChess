/*
 * config.ts
 * author: qianqians
 * 2023/10/2
 */
import * as skill_config from './skill_config'
import * as buffer_config from './buffer_config'
import * as role_config from './role_config'
import * as Food_config from './Food_config';
import * as fetters from './fetters_config'
import * as Equip_Config from './Equip_config';
import * as task_config from './task_config';
import * as SkillIntroduce_config from './SkillIntroduce_config'
import * as  FetterIntroduce_config from './FetterIntroduce_config';
import * as Plot_Config from "./Plot_config";
import * as pvevent_config from './pvevent_config';
import * as RoleSp_config from './RoleSp_config';
import * as SpList_config from './SpList_config';
import * as HotFixed_config from './HotFixed_config';
import * as language_config from './language_config';
import * as SkillSound_config from './SkillSound_config';

export class config {
    public static MechanicFetters = 6;

    public static SkillConfig : Map<number, skill_config.SkillConfig>;
    public static FettersConfig:Map<number,fetters.FettersConfig>
    public static BufferConfig : Map<number, buffer_config.BufferConfig>;
    public static RoleConfig : Map<number, role_config.RoleConfig>;
    public static FoodConfig:Map<number,Food_config.FoodConfig>;
    public static EquipConfig:Map<number,Equip_Config.EquipConfig>;
    public static TaskConfig:Map<number,task_config.TaskConfig>;
    public static SkillIntroduceConfig:Map<number,SkillIntroduce_config.SkillIntroduceConfig>;
    public static FetterIntroduceConfig:Map<number,FetterIntroduce_config.FetterIntroduceConfig>;
    public static PlotConfig:Map<number,Plot_Config.PlotConfig>;
    public static PVEventConfig:Map<number,pvevent_config.PVEventConfig>;
    public static RoleSpConfig:Map<number,RoleSp_config.RoleSpConfig>;
    public static SpListConfig:Map<string,SpList_config.SpEffect>;
    public static LanguageConfig:Map<string, language_config.LanguageConfig>;
    public static SkillSoundConfig:Map<number,SkillSound_config.SkillSoundConfig>;
    public static HotFixedConfig:HotFixed_config.HotFixed_config;

    public static async load()
    {
        config.SkillConfig = await skill_config.LoadSkillConfig();
        config.FettersConfig = await fetters.LoadFettersConfig();
        config.BufferConfig = await buffer_config.LoadBufferConfig();
        config.RoleConfig = await role_config.LoadRoleConfig();
        config.FoodConfig = await Food_config.LoadFoodConfig();
        config.EquipConfig = await Equip_Config.LoadEquipConfig();
        config.TaskConfig = await task_config.LoadTaskConfig();
        config.SkillIntroduceConfig = await SkillIntroduce_config.LoadSkillIntroduceConfig();
        config.FetterIntroduceConfig = await FetterIntroduce_config.LoadFetterIntroduceConfig();
        config.PVEventConfig=await pvevent_config.LoadPVEventConfig();
        config.RoleSpConfig=await RoleSp_config.LoadRoleSpConfig();
        config.SpListConfig=await SpList_config.LoadSpConfig();
        config.LanguageConfig = await language_config.LoadLanguageConfig();
        config.HotFixedConfig = await HotFixed_config.LoadHotFixedConfig();
        config.SkillSoundConfig=await SkillSound_config.LoadSkillSoundConfig();
        //config.PlotConfig = await PlotConfig.LoadPlotConfig();
    }
}