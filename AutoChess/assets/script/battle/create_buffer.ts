/*
 * create_buffer.ts
 * author: qianqians
 * 2023/10/3
 */
import * as config from '../config/config'
import * as enums from '../other/enums'
import * as buffer from './buffer/buffer'

export function CreateSkill(bufferID:number) : buffer.Buffer {
    let bufferConfig = config.config.BufferConfig.get(bufferID);

    let bufferObj:buffer.Buffer = new buffer.Buffer();
    bufferObj.BufferType = bufferConfig.Type;
    bufferObj.Value = bufferConfig.Value;
    bufferObj.Round = bufferConfig.Round;

    return bufferObj;
}