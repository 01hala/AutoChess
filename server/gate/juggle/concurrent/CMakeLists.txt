PROJECT(concurrent)
CMAKE_MINIMUM_REQUIRED(VERSION 2.6) 

if (MSVC_VERSION GREATER_EQUAL "1900")
    include(CheckCXXCompilerFlag)
    CHECK_CXX_COMPILER_FLAG("/std:c++latest" _cpp_latest_flag_supported)
    if (_cpp_latest_flag_supported)
        add_compile_options("/std:c++latest")
    endif()
endif()

set(concurrent_include_path ${PROJECT_SOURCE_DIR} CACHE PATH "concurrent path")
INCLUDE_DIRECTORIES(${concurrent_include_path})

ADD_SUBDIRECTORY(test)