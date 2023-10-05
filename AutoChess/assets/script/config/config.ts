/*
 * config.ts
 * author: qianqians
 * 2023/10/2
 */
import * as skill_config from './skill_config'
import * as buffer_config from './buffer_config'
import * as role_config from './role_config'

export class config {
    public static SkillConfig : Map<number, skill_config.SkillConfig>;
    public static BufferConfig : Map<number, buffer_config.BufferConfig>;
    public static RoleConfig : Map<number, role_config.RoleConfig>;

    public static async load() {
        config.SkillConfig = await skill_config.LoadSkillConfig();
        config.BufferConfig = await buffer_config.LoadBufferConfig();
        config.RoleConfig = await role_config.LoadSkillConfig();
    }
}