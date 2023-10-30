PROJECT(gate_svr)
CMAKE_MINIMUM_REQUIRED(VERSION 3.0) 

SET(EXECUTABLE_OUTPUT_PATH ${PROJECT_BINARY_DIR}/bin)
SET(LIBRARY_OUTPUT_PATH ${PROJECT_BINARY_DIR}/bin)

set(abseil_INCLUDE_PATH ../../3rdparty/abseil-cpp CACHE PATH "abseil include path")
INCLUDE_DIRECTORIES(${abseil_INCLUDE_PATH})

set(mimalloc_INCLUDE_PATH ../../3rdparty/mimalloc/include CACHE PATH "mimalloc include path")
INCLUDE_DIRECTORIES(${mimalloc_INCLUDE_PATH})

set(protocol_header_path ..//..//framework_proto CACHE PATH "protocol include path")
INCLUDE_DIRECTORIES(${protocol_header_path})

set(juggle_header_path ..//..//juggle CACHE PATH "juggle include path")
INCLUDE_DIRECTORIES(${juggle_header_path})

set(time_header_path ..//..//time CACHE PATH "time include path")
INCLUDE_DIRECTORIES(${time_header_path})

set(service_header_path ..//..//service CACHE PATH "service include path")
INCLUDE_DIRECTORIES(${service_header_path})

set(config_header_path ..//..//config CACHE PATH "config include path")
INCLUDE_DIRECTORIES(${config_header_path})

set(log_header_path ..//..//log CACHE PATH "log include path")
INCLUDE_DIRECTORIES(${log_header_path})

set(gate_header_path ${PROJECT_SOURCE_DIR}/../../component/gate CACHE PATH "gate include path")
INCLUDE_DIRECTORIES(${gate_header_path})

AUX_SOURCE_DIRECTORY(. DIR_SRC)
file(GLOB header_test_files ./ ./*.h)

set(WINDOWS_LIBS_DEBUG_PATH ${PROJECT_SOURCE_DIR}//..//..//lib_debug CACHE PATH "windows lib debug path")
set(WINDOWS_LIBS_RELEASE_PATH ${PROJECT_SOURCE_DIR}//..//..//lib CACHE PATH "windows lib release path")

SET(header_files
    ${header_test_files}
)

SET(SRC_LIST 
    ${DIR_SRC}
)

ADD_EXECUTABLE(gate_svr ${SRC_LIST} ${header_files})
if (CMAKE_HOST_WIN32)
	target_link_libraries(gate_svr debug ${WINDOWS_LIBS_DEBUG_PATH}/crossguid-dgb.lib optimized ${WINDOWS_LIBS_RELEASE_PATH}/crossguid.lib)
	target_link_libraries(gate_svr debug ${WINDOWS_LIBS_DEBUG_PATH}/hiredis.lib optimized ${WINDOWS_LIBS_RELEASE_PATH}/hiredis.lib)
	target_link_libraries(gate_svr debug ${WINDOWS_LIBS_DEBUG_PATH}/hiredis_cluster.lib optimized ${WINDOWS_LIBS_RELEASE_PATH}/hiredis_cluster.lib)
	target_link_libraries(gate_svr debug ${WINDOWS_LIBS_DEBUG_PATH}/gc.lib optimized ${WINDOWS_LIBS_RELEASE_PATH}/gc.lib)
	target_link_libraries(gate_svr debug ${WINDOWS_LIBS_DEBUG_PATH}/libssl64MDd.lib optimized ${WINDOWS_LIBS_RELEASE_PATH}/libssl64MD.lib)
	target_link_libraries(gate_svr debug ${WINDOWS_LIBS_DEBUG_PATH}/libcrypto64MDd.lib optimized ${WINDOWS_LIBS_RELEASE_PATH}/libcrypto64MD.lib)
	target_link_libraries(gate_svr debug ${WINDOWS_LIBS_DEBUG_PATH}/spdlogd.lib optimized ${WINDOWS_LIBS_RELEASE_PATH}/spdlog.lib)
	target_link_libraries(gate_svr debug ${WINDOWS_LIBS_DEBUG_PATH}/enet.lib optimized ${WINDOWS_LIBS_RELEASE_PATH}/enet.lib)
	target_link_libraries(gate_svr debug ${WINDOWS_LIBS_DEBUG_PATH}/msgpack11.lib optimized ${WINDOWS_LIBS_RELEASE_PATH}/msgpack11.lib)
	target_link_libraries(gate_svr debug ${WINDOWS_LIBS_DEBUG_PATH}/json11.lib optimized ${WINDOWS_LIBS_RELEASE_PATH}/json11.lib)
	target_link_libraries(gate_svr debug ${WINDOWS_LIBS_DEBUG_PATH}/cares.lib optimized ${WINDOWS_LIBS_RELEASE_PATH}/cares.lib)
	target_link_libraries(gate_svr debug ${WINDOWS_LIBS_DEBUG_PATH}/bson.lib optimized ${WINDOWS_LIBS_RELEASE_PATH}/bson.lib)
	target_link_libraries(gate_svr debug ${WINDOWS_LIBS_DEBUG_PATH}/fmtd.lib optimized ${WINDOWS_LIBS_RELEASE_PATH}/fmt.lib)
	target_link_libraries(gate_svr debug ${WINDOWS_LIBS_DEBUG_PATH}/gate.lib optimized ${WINDOWS_LIBS_RELEASE_PATH}/gate.lib)
	target_link_libraries(gate_svr Crypt32 )
	target_link_libraries(gate_svr ws2_32)
	target_link_libraries(gate_svr winmm)
elseif(CMAKE_HOST_UNIX)
	target_link_options(gate_svr PUBLIC -stdlib=libstdc++ -lc++ -lc++abi -lssl -lcrypto -luuid -fopenmp)
	target_link_libraries(gate_svr optimized ${WINDOWS_LIBS_RELEASE_PATH}/libcares.so)
	target_link_libraries(gate_svr optimized ${WINDOWS_LIBS_RELEASE_PATH}/libhiredis_cluster.so)
	target_link_libraries(gate_svr optimized ${WINDOWS_LIBS_RELEASE_PATH}/libgc.so)
	target_link_libraries(gate_svr optimized ${WINDOWS_LIBS_RELEASE_PATH}/libgate.a)
	target_link_libraries(gate_svr optimized ${WINDOWS_LIBS_RELEASE_PATH}/libcrossguid.a)
	target_link_libraries(gate_svr optimized ${WINDOWS_LIBS_RELEASE_PATH}/libenet.a)
	target_link_libraries(gate_svr optimized ${WINDOWS_LIBS_RELEASE_PATH}/libfmt.a)
	target_link_libraries(gate_svr optimized ${WINDOWS_LIBS_RELEASE_PATH}/libhiredis_static.a)
	target_link_libraries(gate_svr optimized ${WINDOWS_LIBS_RELEASE_PATH}/libjson11.a)
	target_link_libraries(gate_svr optimized ${WINDOWS_LIBS_RELEASE_PATH}/libbson.a)
	target_link_libraries(gate_svr optimized ${WINDOWS_LIBS_RELEASE_PATH}/libspdlog.a)
	target_link_libraries(gate_svr optimized ${WINDOWS_LIBS_RELEASE_PATH}/libmsgpack11.a)
endif ()