import { SceneAsset, AssetManager } from 'cc';
import * as player from "./netPlayer"
import * as game from "./netGame"

export class netSingleton {
    public static player = new player.netPlayer(); 
    public static game = new game.netGame();
}