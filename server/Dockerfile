# https://hub.docker.com/_/microsoft-dotnet

# 0. prepare
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
RUN apt-get update

WORKDIR /source
# It's hard to copy all *.csproj and restore as distinct layers
# since docker cannot keep directory structure while using COPY with wildcards
COPY . .

# 1. build
# copy and publish app and libraries
RUN chmod +x start.sh
RUN mkdir /target
RUN mv mongod.conf supervisord.conf bin config excel_json supervisord.d start.sh /target 

# 2. final stage/image
FROM mcr.microsoft.com/dotnet/aspnet:7.0

WORKDIR /app
COPY --from=build /target ./
COPY mongod.conf /etc/mongod.conf
RUN apt-get update 
RUN apt-get -y install supervisor 
ENTRYPOINT ["/bin/bash", "start.sh"]
