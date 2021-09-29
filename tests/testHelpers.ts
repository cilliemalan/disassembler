import assert from 'assert';
import { category, test } from './';
import { Architecture, Capstone, initialize, Mode, CapstoneInstance } from '../src/node';

export function testWithInstance(name: string, arch: Architecture, mode: Mode | undefined, fn: (instance: CapstoneInstance) => any) {
    test(name, async () => {
        const capstone = await initialize();
        const instance = capstone.createInstance(arch, mode);
        assert.ok(instance);
        try {
            const p = fn(instance);
            if (p instanceof Promise) {
                await p;
            }
        } catch (e) {
            capstone.freeInstance(instance);
            throw e;
        }
        capstone.freeInstance(instance);
    });
}