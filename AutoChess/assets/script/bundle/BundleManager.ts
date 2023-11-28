import { _decorator, Asset, assetManager, AssetManager, Component, ImageAsset, JsonAsset, Node, path, Prefab, resources, SpriteFrame } from 'cc';
import { config } from '../config/config';
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
    
    private loadBundle(bundleRes:string) : Promise<AssetManager.Bundle> {
        return new Promise((resolve) => {
            try {
                assetManager.loadBundle(bundleRes,(error,bundle) => {
                    if(error) {
                        console.warn(error.message);
                        resolve(null);
                    }
                    else {
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

    loadAssetsFromBundle(bundleRes:string, assetsRes:string) : Promise<Asset> {   
        return new Promise(async (resolve) => {
            try {
                let bundle : AssetManager.Bundle = null;
                if (this.bundles.has(bundleRes)) {
                    bundle = this.bundles.get(bundleRes);
                }
                else {
                    bundle = await this.loadBundle(bundleRes);
                    this.bundles.set(bundleRes, bundle);
                }

                bundle.load(assetsRes, Asset, (error, asset) => {
                    if(error) {
                        console.warn("loadAssetsFromBundle ", error.message);
                        resolve(null);
                    }
                    else {
                        resolve(asset);
                    }
                });
            }
            catch (err) {
                console.warn(this.res+"下的 loadAssets 错误:"+err);
                resolve(null);
            }    
        });
    }

    LoadImgsFromBundle(bundleRes:string, assetsRes:string): Promise<ImageAsset>
    {
        return new Promise(async (resolve) =>
        {
            try {
                let bundle : AssetManager.Bundle = null;
                if (this.bundles.has(bundleRes)) {
                    bundle = this.bundles.get(bundleRes);
                }
                else {
                    bundle = await this.loadBundle(bundleRes);
                    this.bundles.set(bundleRes, bundle);
                }

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

    //预加载
    Preloading() : Promise<void> {
        return new Promise(() => {
            try {
                for(let i:number=0;i<config.BundleConfig.size;i++) {
                    let bundleRes = config.BundleConfig.get(i).Path;
                    if (!this.bundles.has(bundleRes)) {
                        assetManager.loadBundle(bundleRes,(err,bundle) => {
                            if(err) {
                                console.warn(bundleRes+"加载失败 err:"+err);
                            }
                            else {
                                this.bundles.set(bundleRes, bundle);
                                bundle.preloadDir(config.BundleConfig.get(i).Path);
                            }
                        });
                    }
                }
            }
            catch (error) {
                console.warn(this.res+"下的 Preloading 错误:"+error);
            }
        });
    }
}


