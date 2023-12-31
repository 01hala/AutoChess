import { SceneAsset, AssetManager } from 'cc';
import * as player from "./netPlayer"
import * as game from "./netGame"
import { BattleDis } from '../battle/display/BattleDis'
import { ReadyDis } from '../ready/display/ReadyDis';

export class netSingleton {
    public static player = new player.netPlayer(); 
    public static game = new game.netGame();
    public static battle:BattleDis = null;
    public static ready:ReadyDis=null;
}