import { _decorator, instantiate, Node, Prefab, ProgressBar } from 'cc';
const { ccclass, property } = _decorator;

export class Loading {
    public static loading:Prefab = null;

    public load(father:Node) : (progress:number) => void {
        try {
            let load = instantiate(Loading.loading);
            father.addChild(load);

            let progressBar = load.getChildByName("Progress").getComponent(ProgressBar);
            
            return (progress:number) => { progressBar.progress = 1 - progress; }
        }
        catch(err) {
            console.log(err);
        }

        return null;
    }
}