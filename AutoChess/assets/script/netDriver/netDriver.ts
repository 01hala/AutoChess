import { _decorator, Component, game, Node, log, director } from 'cc';
const { ccclass, property } = _decorator;

import * as cli from '../serverSDK/client_handle';

import { netSingleton } from "./netSingleton"

/**
 * Predefined variables
 * Name = netDriver
 * DateTime = Wed Oct 27 2021 10:06:51 GMT+0800 (中国标准时间)
 * Author = anxiangqq
 * FileBasename = test.ts
 * FileBasenameNoExtension = test
 * URL = db://assets/script/test.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */
 
 @ccclass('netDriver')
 export class netDriver extends Component {
     // [1]
     // dummy = '';
 
     // [2]
     // @property
     // serializableDummy = 0;
 
     private conn_gate_svr(url:string) {
         return new Promise<void>(resolve => {
            cli.cli_handle.onGateConnect = () => {
                resolve();
            }
             cli.cli_handle.connect_gate(url);
         });
     }
 
     async start () {
         // [3]
         director.addPersistRootNode(this.node);
         
         //await this.conn_gate_svr("ws://127.0.0.1:3001");
         await this.conn_gate_svr("wss://zzq.ucat.games:3001");

         console.log("conn_gate_svr complete!");
         this.node.emit("connect", 1);
         netSingleton.is_conn_gate = true;

         cli.cli_handle.onGateDisConnect = async () => {
            await this.conn_gate_svr("wss://zzq.ucat.games:3001");

            this.node.emit("reconnect", 1);
            netSingleton.is_conn_gate = true;
         };
     }
 
     update (deltaTime: number) {
         // [4]
         cli.cli_handle.poll();
     }
 }