import * as client_handle from "./client_handle";
import * as common from "./common";
/*this enum code is codegen by abelkhan codegen for ts*/

/*this struct code is codegen by abelkhan codegen for typescript*/
/*this module code is codegen by abelkhan codegen for typescript*/
export class player_client_module extends client_handle.imodule {
    public _client_handle:client_handle.client;
    constructor(_client_handle_:client_handle.client){
        super();
        this._client_handle = _client_handle_;
        this._client_handle._modulemng.add_method("player_client_archive_sync", this.archive_sync.bind(this));
        this._client_handle._modulemng.add_method("player_client_battle_victory", this.battle_victory.bind(this));
        this._client_handle._modulemng.add_method("player_client_achievement_complete", this.achievement_complete.bind(this));
        this._client_handle._modulemng.add_method("player_client_rank_reward", this.rank_reward.bind(this));

        this.cb_archive_sync = null;
        this.cb_battle_victory = null;
        this.cb_achievement_complete = null;
        this.cb_rank_reward = null;
    }

    public cb_archive_sync : (info:common.UserData)=>void | null;
    archive_sync(inArray:any[]){
        let _argv_:any[] = [];
        _argv_.push(common.protcol_to_UserData(inArray[0]));
        if (this.cb_archive_sync){
            this.cb_archive_sync.apply(null, _argv_);
        }
    }

    public cb_battle_victory : ()=>void | null;
    battle_victory(inArray:any[]){
        let _argv_:any[] = [];
        if (this.cb_battle_victory){
            this.cb_battle_victory.apply(null, _argv_);
        }
    }

    public cb_achievement_complete : (achieve:common.UserAchievement, wAchieve:common.UserWeekAchievement)=>void | null;
    achievement_complete(inArray:any[]){
        let _argv_:any[] = [];
        _argv_.push(common.protcol_to_UserAchievement(inArray[0]));
        _argv_.push(common.protcol_to_UserWeekAchievement(inArray[1]));
        if (this.cb_achievement_complete){
            this.cb_achievement_complete.apply(null, _argv_);
        }
    }

    public cb_rank_reward : (reward:common.RankReward)=>void | null;
    rank_reward(inArray:any[]){
        let _argv_:any[] = [];
        _argv_.push(common.protcol_to_RankReward(inArray[0]));
        if (this.cb_rank_reward){
            this.cb_rank_reward.apply(null, _argv_);
        }
    }

}
