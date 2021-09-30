import { loadCapstoneAsync } from './capstone';
import { Capstone } from './capstoneTypes';

export * from './capstoneTypes';

const url = 'https://cdn.chills.co.za/dfb7275a.wasm';
async function load() {
    return await (await fetch(url)).arrayBuffer();
}

export function initialize(): Promise<Capstone> {
    return loadCapstoneAsync(load);
}
