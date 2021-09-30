cmake_minimum_required(VERSION 3.0)
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)
project(headerconverter C CXX)
add_executable(headerconverter headerconverter.cpp)
execute_process(
    COMMAND bash -c "printf '%s' $(cd $(dirname $(which clang))/.. && pwd)"
    OUTPUT_VARIABLE CLANG_ROOT)
target_include_directories(headerconverter PUBLIC ${CLANG_ROOT}/include)
target_link_directories(headerconverter PUBLIC ${CLANG_ROOT}/lib)
target_link_libraries(headerconverter PUBLIC clang)