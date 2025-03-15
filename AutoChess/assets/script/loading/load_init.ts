import { _decorator, Component, Prefab } from 'cc';
const { ccclass, property } = _decorator;

import * as load from './load';

/**
 * Predefined variables
 * Name = loadInit
 * DateTime = Wed Oct 27 2021 10:06:51 GMT+0800 (中国标准时间)
 * Author = anxiangqq
 * FileBasename = load_init.ts
 * FileBasenameNoExtension = load_init
 * URL = db://assets/script/loading/load_init.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */
 
@ccclass('loadInit')
export class loadInit extends Component {
    // [1]
    // dummy = '';
 
    // [2]
    // @property
    // serializableDummy = 0;

    @property(Prefab)
    loading:Prefab = null;

    async start () {
        // [3]
        load.Loading.loading = this.loading;
    }
 
}