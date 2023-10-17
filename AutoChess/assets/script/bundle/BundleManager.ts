import { _decorator, Asset, assetManager, Component, ImageAsset, JsonAsset, Node, path, Prefab, resources } from 'cc';
import { config } from '../config/config';
const { ccclass, property } = _decorator;

@ccclass('BundleManager')
export class BundleManager extends Component 
{
    private res:string="script/bundle/bundleManager.ts";

    public static _instance:BundleManager=null;

    static get Instance()
    {
        if(this._instance==null)
            this._instance=new BundleManager();
        return this._instance;
    }
    
    onLoad()
    {
        if(BundleManager._instance === null)
        {
            BundleManager._instance=this;
        }
        else
        {
            this.destroy();
            return;
        }
    }

    private jsonData:JsonAsset=null;

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

    loadImg(url:string) : Promise<ImageAsset> {
        return new Promise((resolve) => {
            try
            {
                assetManager.loadRemote(url, {ext:'.png'}, (err:Error, asset:Asset)=>{
                    if (err) {
                        console.log(err.message);
                    }
                    resolve(asset as ImageAsset);
                });
            }
            catch (err)
            {
                console.warn(this.res+"下的 loadAssets 错误:"+err);
                resolve(null);
            }    
        });
    }

    //预加载
    Preloading():Promise<void>
    {
        return new Promise(()=>
        {
            try
            {
                for(let i:number=0;i<config.BundleConfig.size;i++)
                {
                    let bundlePath=config.BundleConfig.get(i).URL+config.BundleConfig.get(i).Path;
                    assetManager.loadBundle(bundlePath,(err,bundle)=>
                    {
                        if(err)
                        {
                            console.warn(bundlePath+"加载失败 err:"+err);
                        }
                        bundle.preloadDir(config.BundleConfig.get(i).Path);
                        
                    })
                }
            }
            catch (error)
            {
                console.warn(this.res+"下的 Preloading 错误:"+error);
    
            }
        })
    }
}


