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
# RUN chmod +x bin/gate_svr
RUN mkdir /target
RUN mv bin config excel_json supervisord.conf supervisord.d /target 

# 2. final stage/image
FROM mcr.microsoft.com/dotnet/aspnet:7.0

WORKDIR /app
COPY --from=build /target ./

RUN apt-get update
RUN apt-get -y install supervisor
# RUN apt-get -y install libc++1

# ENV LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/app/bin/

EXPOSE 3001
ENTRYPOINT ["supervisord", "-c", "supervisord.conf"]
