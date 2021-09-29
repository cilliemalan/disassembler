#!/bin/bash

url=$(cat ../src/web.ts | grep -E -o 'https[a-z:/.0-9]+')

mkdir -p ../wasm
echo 'export const wasmData = `' > ../wasm/wasm.ts
curl -s $url | xxd -c 64 -p >> ../wasm/wasm.ts
echo '`;' >> ../wasm/wasm.ts
