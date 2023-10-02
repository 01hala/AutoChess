/*
 * config.ts
 * author: qianqians
 * 2023/10/2
 */
import * as skill_config from './skill_config';

export class config {
    public static SkillConfig : Map<number, skill_config.SkillConfig>;

    public static async load() {
        config.SkillConfig = await skill_config.load_skill_config();
    }
}