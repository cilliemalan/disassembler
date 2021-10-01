import { capstone, loadCapstoneAsync } from './capstone';
import { brotliDecompress } from 'zlib';

export * from './capstoneTypes';
export * from './capstoneEnums';

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

/** Initialize the capstone disassembly framework.
 * This function will take a while the first time and
 * return a resolved promise if called again.
 * @returns A promise that resolves with the capstone framework interface 
 * after the framework has been initialized.
 */
export function initialize() {
    return loadCapstoneAsync(load);
}

/** Returns the initialized capstone framework interface or undefined if
 * initialize() has not yet been called.
 * @returns the initialized capstone framework interface or undefined if
 * initialize() has not yet been called.
 */
export function tryGetInstance() {
    return capstone;
}
