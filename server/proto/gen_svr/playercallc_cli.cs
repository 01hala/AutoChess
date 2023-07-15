using System;
using System.Collections;
using System.Collections.Generic;
using System.Threading;
using MsgPack.Serialization;

namespace Abelkhan
{
/*this enum code is codegen by abelkhan codegen for c#*/

/*this struct code is codegen by abelkhan codegen for c#*/
/*this module code is codegen by abelkhan codegen for c#*/
    public class player_client_module : Common.IModule {
        public Client.Client _client_handle;
        public player_client_module(Client.Client client_handle_) 
        {
            _client_handle = client_handle_;
            _client_handle.modulemanager.add_mothed("player_client_archive_sync", archive_sync);
        }

        public event Action<UserData> on_archive_sync;
        public void archive_sync(IList<MsgPack.MessagePackObject> inArray){
            var _info = UserData.protcol_to_UserData(((MsgPack.MessagePackObject)inArray[0]).AsDictionary());
            if (on_archive_sync != null){
                on_archive_sync(_info);
            }
        }

    }

}
