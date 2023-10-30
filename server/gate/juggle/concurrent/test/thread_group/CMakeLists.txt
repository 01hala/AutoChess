project(test_thread_group)
CMAKE_MINIMUM_REQUIRED(VERSION 2.6) 

AUX_SOURCE_DIRECTORY(. DIR_SRC)

ADD_executable(test_thread_group ${DIR_SRC})