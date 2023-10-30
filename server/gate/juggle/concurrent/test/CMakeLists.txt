PROJECT(test)
CMAKE_MINIMUM_REQUIRED(VERSION 2.6) 

set(testbase_include_path ${PROJECT_SOURCE_DIR}//testbase CACHE PATH "testbase path")
INCLUDE_DIRECTORIES(${testbase_include_path})

ADD_SUBDIRECTORY(msque)
ADD_SUBDIRECTORY(optimisticque)
ADD_SUBDIRECTORY(swapque)
ADD_SUBDIRECTORY(ringque)
ADD_SUBDIRECTORY(testbase)
ADD_SUBDIRECTORY(thread_group)
ADD_SUBDIRECTORY(string_tools)
