import { _decorator, instantiate, Label, Node, Prefab, ProgressBar, RichText } from 'cc';
const { ccclass, property } = _decorator;

export class Loading {
    public static loading:Prefab = null;
    public progressBar:Node = null;
    public log:Label = null;
    public _load:Node = null;

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
            this.log=this._load.getChildByName("Log").getComponent(Label);
            this.log.string="";

            let descTxt = this._load.getChildByPath("Advice/desc");
            descTxt.active = desc;

            let titelTxt = this._load.getChildByPath("Advice/titel");
            titelTxt.active = desc;

            let ageTxt = this._load.getChildByPath("Advice/age");
            ageTxt.active = desc;

            let promptTxt = this._load.getChildByPath("Advice/prompt");
            promptTxt.active = desc;

            let Age = this._load.getChildByPath("Age");
            Age.active = desc;

            
            return (progress:number) => { progressBar.progress = 0 + progress; }
        }
        catch(err) {
            console.log(err);
        }

        return null;
    }

    public ShowLog(_bundleName:string,_progress:number)
    {
        switch (_bundleName)
        {
            case "Sound":
                {
                    this.log.string = "正在加载 音效 " + "(" + _progress + "%)";
                }
                break;
            case "RoleSpine":
                {
                    this.log.string = "正在加载 角色 " + "(" + _progress + "%)";
                }
                break;
            case "EffectSpine":
                {
                    this.log.string = "正在加载 特效 " + "(" + _progress + "%)";
                }
                break;
            default:
                {
                    this.log.string="加载中 请稍后...";
                }
        }
    }

    public done() {
        if (this._load != null) {
            this._load.destroy();
            this._load = null;
        }
    }
}