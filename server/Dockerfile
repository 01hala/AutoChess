# https://hub.docker.com/_/microsoft-dotnet

# 0. prepare
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
RUN apt-get update && apt-get -y install dos2unix && apt-get -y install wget

WORKDIR /source
# It's hard to copy all *.csproj and restore as distinct layers
# since docker cannot keep directory structure while using COPY with wildcards
COPY . .

# 1. build
# copy and publish app and libraries
ENV Publish=bin/Publish
ENV Output=bin/Release
RUN dos2unix sedcs.sh && sh sedcs.sh
RUN dotnet publish --runtime linux-x64 --self-contained false -c Release --output $Publish/bin
RUN dos2unix start.sh && chmod +x start.sh
RUN mkdir /target
RUN mv start.sh bin/Publish/bin bin/Release/config bin/Release/csv bin/Release/gen bin/Release/gen_all_conf.sh /target 

# 2. final stage/image
FROM mcr.microsoft.com/dotnet/aspnet:6.0

WORKDIR /app
COPY --from=build /target ./
RUN apt-get update && apt-get -y install dos2unix && apt-get -y install python
RUN dos2unix gen/gen_conf.sh && chmod +x gen/gen_conf.sh
RUN dos2unix gen_all_conf.sh && chmod +x gen_all_conf.sh
ENTRYPOINT ["/bin/bash", "start.sh"]
