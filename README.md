# Disassembler
A library for disassembling various types of machine code. It is a thin 
wrapper over the Capstone disassembly framework, which has been compiled
to WebAssembly and is automatically loaded when `initialize` is called.

# Usage
```js
import { initialize, Architecture, Mode } from 'disassembler';

async function disassembleStuff() {

    // initialize the library (loads the capstone WebAssembly binary).
    // This takes about half a second the first time. Thereafter, it
    // just returns the capstone object. You can call it once and then
    // keep the capstone object around.
    const capstone = await initialize();

    // create an instance that can disassemble Arm Thumb code.
    const instance = capstone.createInstance(Architecture.ARM, Mode.Thumb);

    // disassemble the code
    const someCode = Buffer.from("4ff00001bde80088d1e800f018bfadbff3ff0b0c86f3008980f3008c4ffa99f6d0ffa201", "hex");
    const instructions = instance.disassemble(someCode);

    // print out the results
    for (let insn of instructions) {
        console.log(`${insn.mnemonic} ${insn.operands}`);
    }

    // Important! Free the instance after use.
    // doing so frees the WebAssembly memory
    // for the instance.
    capstone.freeInstance(instance);
}

disassembleStuff().catch(console.error);
```

The code above spits out:
```asm
mov.w r1, #0
pop.w {fp, pc}
tbb [r1, r0]
it ne
iteet ge
vdupne.8 d16, d11[1]
msr cpsr_fc, r6
msr apsr_nzcvqg, r0
sxtb.w r6, sb, ror #8
vaddw.u16 q8, q8, d18
```

## Note about web
The Capstone wasm file is quite large (5Mb). In order
to save space, it is not included when packed with
webpack or other tools but rather will be downloaded
by calling `fetch`. The wasm file is stored on a CDN,
is compressed to about 500kb, and may be cached indefinitely.

If this library is included from a regular node project,
the wasm data is stored as hex in a javascript file generated
when this library is published.

This works by specifying a different main file for `browser` in
the [package.json](package.json#L6) file. I'm not sure how one
can go about overriding this behaviour. The reason it's completely
separate is to prevent webpack from including 1Mb of hex stuff
unnecessarily.

# Work in Progress
This module does basic disassembly right now. It does not
yet support all the various architectures. These things
are on the to do list:
- [x] Basic functionality.
- [ ] Nice error strings.
- [ ] Non-architecture specific details.
- [ ] Architecture specific details and enums.
- [ ] Some documentation, at least JSDoc.
- [ ] The various helper functions (e.g. getting instruction names).
- [ ] Figure out some kind of way to garbage collect instances.

# License
Files in this repo are copyright (c) 2021 Cillié Malan. See [LICENSE] for info.

This library relies on the [Capstone disassembly framework](http://www.capstone-engine.org/).
The sources for the capstone project,
including [modifications for this module](https://github.com/cilliemalan/capstone/tree/wasmhost),
and any binary files produced therefrom, distributed with this library,
are [Copyright (c) 2013, COSEINC](https://github.com/cilliemalan/capstone/blob/wasmhost/LICENSE.TXT).
