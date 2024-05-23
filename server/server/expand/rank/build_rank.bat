cd ../../../../proto/rpc
python genc2h.py ../../server/server/expand/rank/cli csharp "" ../../server/server/expand/rank ../../server/server/expand/rank/comm
python genc2h.py ../../server/server/expand/rank/cli ts ../../AutoChess/assets/script/serverSDK "" ../../server/server/expand/rank/comm
python genh2h.py ../../server/server/expand/rank/svr csharp ../../server/server/expand/rank ../../server/server/expand/rank/comm
pause