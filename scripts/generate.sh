#!/bin/bash

# This script generates wasm/wasm.ts which
# contains the compressed wasm data for capstone.

# The file it downloads is encoded with brotli but
# curl does not decompress it. On the other hand,
# if the file is downloaded in a browser (which is
# what is done when this module is packed with webpack
# for the browser) the browser will automatically decompress
# it because of the Content-Encoding header.

# this must be run from the parent dir
test -f generate.sh && cd ..

url=$(cat src/web.ts | grep -E -o 'https[a-z:/.0-9]+')

mkdir -p wasm
echo 'export const wasmData = `' > wasm/wasm.ts
curl -s $url | xxd -c 64 -p >> wasm/wasm.ts
echo '`;' >> wasm/wasm.ts
