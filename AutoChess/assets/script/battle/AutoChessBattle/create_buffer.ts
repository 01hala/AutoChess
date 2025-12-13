/*
 * create_buffer.ts
 * author: qianqians
 * 2023/10/3
 */
import * as config from './config/config'
import * as enums from './BattleEnums'
import * as buffer from './buffer/buffer'

export function CreateBuff(bufferID:number, value?:number , round?:number ,frequency?:number) : buffer.Buffer 
{
    let bufferConfig = config.config.BufferConfig.get(bufferID);

    let bufferObj:buffer.Buffer = new buffer.Buffer();
    if(value)
    {
        bufferObj.Value = value;
    }
    else
    {
        bufferObj.Value = bufferConfig.Value;
    }

    if(round)
    {
        bufferObj.Round=round;
    }
    else
    {
        bufferObj.Round = bufferConfig.Round;
    }

    if(frequency)
    {
        bufferObj.Frequency = frequency;
    }
    else
    {
        bufferObj.Frequency=bufferConfig.Frequency;
    }
    bufferObj.BufferType = bufferConfig.Type;
    
    return bufferObj;
}