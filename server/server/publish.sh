#!/bin/bash
# 发布脚本
ConfName=${1:-'Release'}
RUN_TIME=${2:-'linux-x64'}
dotnet clean
rm -rf bin/Release/binary
dotnet publish --runtime ${RUN_TIME} --self-contained false -c ${ConfName} --output bin/Publish/bin
