import { __private, _decorator, Asset, assetManager, AssetManager, Component, error, ImageAsset, isValid, JsonAsset, Node, path, Prefab, resources, SpriteFrame } from 'cc';
import { config } from '../battle/AutoChessBattle/config/config';
const { ccclass, property } = _decorator;

export class BundleManager
{
    private res:string="script/bundle/bundleManager.ts";
    private bundles:Map<string, AssetManager.Bundle> = new Map();

    public static _instance:BundleManager=null;
    static get Instance()
    {
        if(this._instance==null)
            this._instance=new BundleManager();
        return this._instance;
    }
    
    public loadBundle(bundleRes:string) : Promise<AssetManager.Bundle> {
        return new Promise((resolve) => {
            try {
                if(this.bundles.has(bundleRes))
                {
                    let bundle = this.bundles.get(bundleRes);
                    resolve(bundle);
                }

                assetManager.loadBundle(bundleRes,(error,bundle) => {
                    if(error) {
                        console.warn(error.message);
                        resolve(null);
                    }
                    else {
                        this.bundles.set(bundleRes, bundle);
                        resolve(bundle);
                    }
                });
            }
            catch (err) {
                console.warn(this.res+"下的 loadAssets 错误:"+err);
                resolve(null);
            }    
        });
    }

    loadAssetsFromBundleSync(type: __private.__types_globals__Constructor<Asset> ,bundleRes:string, assetsRes:string ,_callBack:(data)=>void)
    {
        try
        {
            let bundle : AssetManager.Bundle = null;
            if(this.bundles.has(bundleRes))
            {
                bundle = this.bundles.get(bundleRes);
                bundle.load(assetsRes, type, (error, data) =>
                {
                    if (error)
                    {
                        console.warn("loadAssetsFromBundleSync 读取资源失败 :  ", error.message);
                        _callBack(null);
                    }
                    else
                    {
                        _callBack(data);
                    }
                });
            }
            else
            {
                assetManager.loadBundle(bundleRes,(error,bundle)=>
                {
                    if(error)
                    {
                        console.warn("loadAssetsFromBundleSync 读取bundle失败 :  ", error.message);
                        _callBack(null);
                    }
                    else
                    {
                        bundle.load(assetsRes, type ,(error,data)=>
                        {
                            if(error)
                            {
                                console.warn("loadAssetsFromBundleSync 读取资源失败 :  ", error.message);
                                _callBack(null);
                            }
                            else
                            {
                                _callBack(data);
                            }
                        });
                    }
                });
            }
        }
        catch(error)
        {
            console.error(this.res+"下的 loadAssetsFromBundleSync 错误:"+error);
            return null;
        }
        
    }

    loadAssetsFromBundle(bundleRes:string, assetsRes:string) : Promise<Asset> {   
        return new Promise(async (resolve) => {
            try {
                let bundle = await this.loadBundle(bundleRes);
                
                bundle.load(assetsRes, Asset, (error, asset) => {
                    if(error) {
                        console.warn(`loadAssets '${bundleRes}' '${assetsRes}' error:`, error.message);
                        resolve(null);
                    }
                    else {
                        resolve(asset);
                    }
                });
            }
            catch (err) {
                console.error(this.res+"下的 loadAssetsFromBundle 错误:"+err);
                resolve(null);
            }    
        });
    }

    LoadImgsFromBundle(bundleRes:string, assetsRes:string): Promise<ImageAsset>
    {
        return new Promise(async (resolve) =>
        {
            try {
                let bundle = await this.loadBundle(bundleRes);

                bundle.load(assetsRes, ImageAsset, (error, img) => {
                    if(error) {
                        console.warn(this.res+"下的 LoadImgsFromBundle 没有读取到资源,err:", error.message);
                        resolve(null);
                    }
                    else {
                        resolve(img);
                    }
                });
            }
            catch (err) {
                console.warn(this.res+"下的 LoadImgsFromBundle 错误:"+err);
                resolve(null);
            }    
        });
    }
    

    loadAssetsFromUrl(url:string) : Promise<Asset> {
        return new Promise((resolve) => {
            try {
                assetManager.loadRemote(url, {ext:'.png'}, (err:Error, asset:Asset) => {
                    if (err) {
                        console.log(err.message);
                    }
                    resolve(asset);
                });
            }
            catch (err) {
                console.warn(this.res+"下的 loadAssets 错误:"+err);
                resolve(null);
            }    
        });
    }

    /**
     * 预加载bundle
     * @param _callBack 回调
     */
    PreloadBundle(_callBack: (bundleName,progress) => void): Promise<void>
    {
        return new Promise(async(resolve) => 
        {
            try
            {
                await this.PreLoadBundleDir("Sound", "",_callBack);
                await this.PreLoadBundleDir("RoleSpine","",_callBack);
                await this.PreLoadBundleDir("EffectSpine","",_callBack);
                await this.PreLoadBundleDir("SceneSpine","",_callBack);
                await this.PreLoadBundleDir("SpecialSpine","",_callBack);
                await this.PreLoadBundleDir("MainInterface","",_callBack);

                let allAwait = [];
                allAwait.push(this.PreLoadBundleDir("BackGroungTexture",""));
                allAwait.push(this.PreLoadBundleDir("IconTexture",""));
                allAwait.push(this.PreLoadBundleDir("ButtonTexture",""));
                allAwait.push(this.PreLoadBundleDir("OtherTexture",""));
                allAwait.push(this.PreLoadBundleDir("FrameTexture",""));
                allAwait.push(this.PreLoadBundleDir("PanelTexture",""));
                allAwait.push(this.PreLoadBundleDir("PropsTexture",""));
                allAwait.push(this.PreLoadBundleDir("RoleAvatarTexture",""));
                allAwait.push(this.PreLoadBundleDir("RolesTexture",""));
                allAwait.push(this.PreLoadBundleDir("PanelPrefabs",""));
                allAwait.push(this.PreLoadBundleDir("BoardPrefabs",""));
                allAwait.push(this.PreLoadBundleDir("IconPrefabs",""));
                allAwait.push(this.PreLoadBundleDir("PartPrefabs",""));
                allAwait.push(this.PreLoadBundleDir("BulletPrefabs",""));
                allAwait.push(this.PreLoadBundleDir("TextTipPrefabs",""));
                allAwait.push(this.PreLoadBundleDir("Quest",""));
                allAwait.push(this.PreLoadBundleDir("Ready",""));
                allAwait.push(this.PreLoadBundleDir("CardLib",""));
                allAwait.push(this.PreLoadBundleDir("Battle",""));
                allAwait.push(this.PreLoadBundleDir("CareEdit",""));
                allAwait.push(this.PreLoadBundleDir("Typeface",""));
                Promise.all(allAwait);

                console.log("预加载资源完成");
                resolve(null);
            }
            catch (error)
            {
                console.warn(this.res + "下的 Preloading 错误:" + error);
                resolve(null);
            }
        });
    }

    /**
     * 预加载文件夹下的所有文件
     * @param _bundle 包名
     * @param _res 文件夹路径 （根目录填""）
     */
    async PreLoadBundleDir(_bundle:string,_res:string,_callBack?:((bundleName,progress)=>void)|null)
    {
        return new Promise<void>(async (resolve, reject) =>
        {
            let bundle = await this.loadBundle(_bundle);
            let info = bundle.getDirWithPath(_res);

            if (info)
            {
                let n = 0;
                for (let t of info)
                {
                    let uuid = t.uuid;
                    let cachedAsset = assetManager.assets.get(uuid)
                    if (cachedAsset && isValid(cachedAsset))
                    {
                        n++;
                    }
                }
                if (n == info.length)
                {
                    if (_callBack)
                    {
                        _callBack(null, null);
                    }
                    resolve();
                }
            }

            bundle.preloadDir(_res, null, (finished, total, item) =>
            {
                if (_callBack)
                {
                    _callBack(_bundle, Math.floor(finished / total * 100));
                }
            }, (err, data) =>
            {
                if (err)
                {
                    console.warn("预下载 ",bundle,"/",_res," 错误 ",err);
                    resolve();
                }
                else
                {
                    if(_callBack)
                    {
                        _callBack(null, null);
                    }
                    resolve();
                }
            });
        })
    }
}


