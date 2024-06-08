import { _decorator, instantiate, Node, Prefab, ProgressBar, RichText } from 'cc';
const { ccclass, property } = _decorator;

export class Loading {
    public static loading:Prefab = null;
    public progressBar:Node = null;
    private _load:Node = null;

    public load(father:Node, desc:boolean = false) : (progress:number) => void {
        console.log("Loading load begin!");

        try {
            if (this._load == null) {
                this._load = instantiate(Loading.loading);
                father.addChild(this._load);
            }

            this.progressBar = this._load.getChildByName("Progress");
            let progressBar = this.progressBar.getComponent(ProgressBar)
            progressBar.progress = 0;

            let descTxt = this._load.getChildByName("desc");
            descTxt.active = desc;

            let titelTxt = this._load.getChildByName("titel");
            titelTxt.active = desc;

            let ageTxt = this._load.getChildByName("age");
            ageTxt.active = desc;

            let promptTxt = this._load.getChildByName("prompt");
            promptTxt.active = desc;

            let Age = this._load.getChildByName("Age");
            Age.active = desc;
            
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