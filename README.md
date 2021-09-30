# Disassembler
A library for disassembling various types of machine code. It is a thin 
wrapper over the Capstone disassembly framework, which has been compiled
to WebAssembly and is automatically loaded when `initialize` is called.

# Usage
```js
import { initialize } from 'disassembler';

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

# Work in Progress
This module does basic disassembly right now. It does not
yet support all the various architectures. These things
are on the to do list:
- [x] Basic functionality.
- [ ] Nice error strings.
- [ ] Non-architecture specific details.
- [ ] Architecture specific details and enums.
- [ ] Some documentation, at least JSDoc.
- [ ] The various helper functions (e.g. `ARM_insn_name`, `Xtensa_sysreg_name`, etc.).
- [ ] Figure out some kind of way to garbage collect instances.