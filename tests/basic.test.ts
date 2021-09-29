import assert from 'assert';
import { category, test } from './';
import { Architecture, Capstone, initialize, Mode } from '../src/node';
import { testWithInstance } from './testHelpers';

category("Basic Operations", () => {

    test('It initializes ok', async () => {
        const capstone = await initialize();
        assert.ok(capstone);
    });

    test('It can create and free an instance ok', async () => {
        const capstone = await initialize();
        const instance = capstone.createInstance(Architecture.ARM);
        if (instance) {
            capstone.freeInstance(instance);
        }

        assert.ok(instance);
    });

    test('It can create and free an instance ok a second time', async () => {
        const capstone = await initialize();
        const instance = capstone.createInstance(Architecture.ARM);
        if (instance) {
            capstone.freeInstance(instance);
        }

        assert.ok(instance);
    });

    testWithInstance('Basic test', Architecture.ARM, Mode.Thumb, (instance) => {
        const data = Buffer.from("4ff00001bde80088d1e800f018bfadbff3ff0b0c86f3008980f3008c4ffa99f6d0ffa201", "hex");
        const result = instance.disassemble(data);
        assert.ok(result);
    });

});
