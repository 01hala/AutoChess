import { SceneAsset, AssetManager } from 'cc';
import * as player from "./netPlayer"
import * as game from "./netGame"
import * as battleDis from '../battle/display/BattleDis'

export class netSingleton {
    public static player = new player.netPlayer(); 
    public static game = new game.netGame();
    public static battle:battleDis.BattleDis = null;
}