import { loadCapstoneAsync } from './capstone';
import { Capstone } from './capstoneTypes';
import { brotliDecompress } from 'zlib';

export * from './capstoneTypes';

function load() {
    return new Promise<Buffer>((resolve, reject) => {
        let wasmData: string = require('./wasmdata');
        brotliDecompress(wasmData, (e, d) => {
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
