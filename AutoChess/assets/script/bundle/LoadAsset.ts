import { SpriteFrame, Texture2D } from "cc";
import { BundleManager } from "./BundleManager";

export class loadAssets 
{
    public LoadImg(_bundle:string , _address:string , _id:number):Promise<SpriteFrame>
    {
        return new Promise(async (resolve)=>
        {
            try
            {
                let temp=await BundleManager.Instance.LoadImgsFromBundle(_bundle, _address);
                if(null==temp)
                {
                    console.warn('loadAssets 里的 LoadImg 异常 : bundle中没有此图片,替换为默认图片');
                    resolve(null);
                }
                let texture=new Texture2D();
                texture.image=temp;
                let sp=new SpriteFrame();
                sp.texture=texture;
                resolve(sp);
            }
            catch(error)
            {
                console.error('loadAssets 下 LoadImg 错误 err: ',error);
                resolve(null);
            }
            
        });
    }
}
