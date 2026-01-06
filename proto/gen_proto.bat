cd ./rpc/
python genc2h.py ../proto/client_call_hub/ csharp "" ../../server/server/game_proto ../proto/common
python genh2c.py ../proto/hub_call_client/ csharp "" ../../server/server/game_proto ../proto/common
python genh2h.py ../proto/hub_call_hub/ csharp ../../server/server/game_proto ../proto/common

python genc2h.py ../proto/client_call_hub/ ts ../../AutoChess/assets/script/serverSDK "" ../proto/common
python genh2c.py ../proto/hub_call_client/ ts ../../AutoChess/assets/script/serverSDK "" ../proto/common

cd ../
pause