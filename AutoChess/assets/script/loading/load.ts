import { _decorator, instantiate, Node, Prefab, ProgressBar } from 'cc';
const { ccclass, property } = _decorator;

export class Loading {
    public static loading:Prefab = null;

    public load(father:Node, loadFn:(setProgress:(progress:number) => void) => void) {
        try {
            let load = instantiate(Loading.loading);
            father.addChild(load);

            let progressBar = load.getChildByName("Progress").getComponent(ProgressBar);
            loadFn((progress:number) => {
                progressBar.progress = 1 - progress;
            });
        }
        catch(err) {
            console.log(err);
        }
    }
}