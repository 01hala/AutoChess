using Abelkhan;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Match
{
    public class rank_proxy
    {
        private readonly  rank_svr_service_caller _caller;
        private readonly Hub.HubProxy _proxy;

        public string name
        {
            get
            {
                return _proxy.name;
            }
        }

        public rank_proxy(Hub.HubProxy proxy)
        {
            _caller = new rank_svr_service_caller();
            _proxy = proxy;
        }

        public void update_rank_item(rank_item item)
        {
            _caller.get_hub(_proxy.name).update_rank_item(Constant.Constant.player_db_guid_rank, item);
        }
    }
}
