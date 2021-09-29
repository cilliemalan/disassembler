import { loadCapstoneAsync } from './capstone';
import { Capstone } from './capstoneTypes';
import { wasmData } from '../wasm/wasm';
import {brotliDecompress} from 'zlib';

export * from './capstoneTypes';

function load() {
    return new Promise<Buffer>((resolve, reject) => {
        const compressedData = Buffer.from(wasmData.replace(/[ \n]/g, ''), 'hex');
        brotliDecompress(compressedData, (e, d) => {
            if (e) {
                reject(e);
            } else {
                resolve(d);
            }
        });
    });
}

export function initialize() {
    return loadCapstoneAsync(load);
}
