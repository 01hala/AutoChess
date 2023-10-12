import { _decorator, Asset, assetManager, Component, error, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BundleManager')
export class BundleManager extends Component 
{
    private res:string="script/bundle/bundleManager.ts";

    public static Instance:BundleManager=null;

    onLoad()
    {
        if(BundleManager.Instance === null)
        {
            BundleManager.Instance=this;
        }
        else
        {
            this.destroy();
            return;
        }
    }

    loadAssets(bundleRes:string,assetsRes:string) : Promise<Asset>
    {   
        return new Promise((resolve) => {
            try
            {
                assetManager.loadBundle(bundleRes,(error,bundle)=>
                {
                    if(error)
                    {
                        console.warn(error.message);
                    }
                    bundle.load(assetsRes, (error,prefab)=>
                    {
                        if(error)
                        {
                            console.warn(error.message);
                        }
                        resolve(prefab);
                    });
                    
                });
            }
            catch (err)
            {
                console.warn(this.res+"下的 loadAssets 错误:"+err);
                resolve(null);
            }    
        });
    }
}


