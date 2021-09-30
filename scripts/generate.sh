#!/bin/bash

# This script generates wasm/wasm.ts which
# contains the compressed wasm data for capstone and
# src/capstoneEnums.ts which contains all the enumerations
# for the various capstone supported architectures.




# this must be run from the parent dir
test -f generate.sh && cd ..


# convert wasm data
echo "Converting WASM data into a typescript file..."


# The wasm file it downloads is encoded with brotli but
# curl does not decompress it. On the other hand,
# if the file is downloaded in a browser (which is
# what is done when this module is packed with webpack
# for the browser) the browser will automatically decompress
# it because of the Content-Encoding header.
url=$(cat src/web.ts | grep -E -o 'https[a-z:/.0-9]+')

# the file goes directly to the output
mkdir -p dist/src

printf 'module.exports = Buffer.from("' > dist/src/wasmdata.js
curl -s $url | xxd -c 64 -p | tr -d '\n' >> dist/src/wasmdata.js
printf '", "hex")' >> dist/src/wasmdata.js




# convert capstone header
echo "Converting capstone headers into a typescript file..."

# build the header converter program. This requires libclang-dev to be installed.
mkdir -p headerconverter/build
test ! -d headerconverter/build/capstone \
    && git clone https://github.com/cilliemalan/capstone \
       --depth 1\
       -b wasmhost \
       headerconverter/build/capstone
(cd headerconverter/build/capstone && git pull >> /dev/null)
cmake -B./headerconverter/build -S./headerconverter -G Ninja
cmake --build ./headerconverter/build
headerconverter/build/headerconverter headerconverter/build/capstone/include/capstone/capstone.h > src/capstoneEnums.ts
