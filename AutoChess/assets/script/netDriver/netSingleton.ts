import { SceneAsset, AssetManager } from 'cc';
import * as player from "./netPlayer"

export class netSingleton {
    public static player = new player.netPlayer(); 
}