cd ./rpc/
python genc2h.py ../proto/client_call_hub/ csharp ../gen_svr/ ../proto/common
python genh2c.py ../proto/hub_call_client/ csharp ../gen_svr/ ../proto/common
python genh2h.py ../proto/hub_call_hub/ csharp ../gen_svr/ ../proto/common

python genc2h.py ../proto/client_call_hub/ ts ../gen_ts/ ../proto/common
python genh2c.py ../proto/hub_call_client/ ts ../gen_ts/ ../proto/common

cd ../
pause