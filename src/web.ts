import { loadCapstoneAsync, capstone } from './capstone';

export * from './capstoneTypes';
export * from './capstoneEnums';

const url = 'https://cdn.chills.co.za/dfb7275a.wasm';
async function load() {
    return await (await fetch(url)).arrayBuffer();
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
 * @returns the initialized capstone framework interface.
 */
export function tryGetInstance() {
    return capstone;
}
