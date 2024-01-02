import { SpriteFrame, Texture2D } from "cc";
import { BundleManager } from "./BundleManager";

export class loadAssets 
{
    public static LoadImg(_address:string):Promise<SpriteFrame>
    {
        return new Promise(async (resolve)=>
        {
            try
            {
                let ads:string[]=_address.split('/');

                let temp=await BundleManager.Instance.LoadImgsFromBundle(ads[0], ads[1]);
                if(null==temp)
                {
                    console.warn(`loadAssets 里的 LoadImg 异常 : 路径${_address}下没有此图片,替换为默认图片`);
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
