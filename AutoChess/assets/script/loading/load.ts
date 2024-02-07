import { _decorator, instantiate, Node, Prefab, ProgressBar } from 'cc';
const { ccclass, property } = _decorator;

export class Loading {
    public static loading:Prefab = null;
    private _load:Node = null;

    public load(father:Node) : (progress:number) => void {
        console.log("Loading load begin!");

        try {
            if (this._load == null) {
                this._load = instantiate(Loading.loading);
                father.addChild(this._load);
            }

            let progressBar = this._load.getChildByName("Progress").getComponent(ProgressBar);
            progressBar.progress = 0;
            
            return (progress:number) => { progressBar.progress = 0 + progress; }
        }
        catch(err) {
            console.log(err);
        }

        return null;
    }

    public done() {
        if (this._load != null) {
            this._load.destroy();
            this._load = null;
        }
    }
}