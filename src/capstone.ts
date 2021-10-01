import { readFileSync } from 'fs';
import { join, resolve } from 'path';
import { Architecture, Capstone, CapstoneInstance, Instruction, InstructionDetail, Mode } from './capstoneTypes';

export let capstone: Capstone | undefined;

const memory = new WebAssembly.Memory({ initial: 96 });

const wasmImports = {
    env: { memory },
    wasi_snapshot_preview1: {
        args_get: () => { debugger; },
        args_sizes_get: () => { debugger; },
        environ_get: () => { debugger; },
        environ_sizes_get: () => { debugger; },
        clock_res_get: () => { debugger; },
        clock_time_get: () => { debugger; },
        fd_advise: () => { debugger; },
        fd_allocate: () => { debugger; },
        fd_close: () => { debugger; },
        fd_datasync: () => { debugger; },
        fd_fdstat_get: () => { debugger; },
        fd_fdstat_set_flags: () => { debugger; },
        fd_fdstat_set_rights: () => { debugger; },
        fd_filestat_get: () => { debugger; },
        fd_filestat_set_size: () => { debugger; },
        fd_filestat_set_times: () => { debugger; },
        fd_pread: () => { debugger; },
        fd_prestat_get: () => { debugger; },
        fd_prestat_dir_name: () => { debugger; },
        fd_pwrite: () => { debugger; },
        fd_read: () => { debugger; },
        fd_readdir: () => { debugger; },
        fd_renumber: () => { debugger; },
        fd_seek: () => { debugger; },
        fd_sync: () => { debugger; },
        fd_tell: () => { debugger; },
        fd_write: () => { debugger; },
        path_create_directory: () => { debugger; },
        path_filestat_get: () => { debugger; },
        path_filestat_set_times: () => { debugger; },
        path_link: () => { debugger; },
        path_open: () => { debugger; },
        path_readlink: () => { debugger; },
        path_remove_directory: () => { debugger; },
        path_rename: () => { debugger; },
        path_symlink: () => { debugger; },
        path_unlink_file: () => { debugger; },
        poll_oneoff: () => { debugger; },
        proc_exit: () => { debugger; },
        proc_raise: () => { debugger; },
        sched_yield: () => { debugger; },
        random_get: () => { debugger; },
        sock_recv: () => { debugger; },
        sock_send: () => { debugger; },
        sock_shutdown: () => { debugger; },
    }
};

interface CapstoneExports {
    cs_open: (arch: number, mode: number, handlePointer: number) => number;
    cs_close: (handlePointer: number) => number;
    cs_option: (handlePointer: number, type: number, value: number) => number;
    cs_disasm: (handlePointer: number, codePointer: number, codeSize: number, address: bigint, count: number, instructionPointerPointer: number) => number;
    cs_free: (instructionPointer: number, count: number) => void;
    cs_malloc: (handlePointer: number) => number;
    cs_disasm_iter: (handlePointer: number, codePointerPointer: number, sizePointer: number, addressPointer: number, instructionPointer: number) => number;
    malloc: (a: number) => number;
    free: (a: number) => void;
}

async function loadCapstoneInternal(load: () => Promise<ArrayBuffer>) {


    const wasmData = await load();
    const { module, instance } = await WebAssembly.instantiate(wasmData, wasmImports);

    const exports: CapstoneExports = {
        cs_open: (instance.exports as any).cs_open,
        cs_close: (instance.exports as any).cs_close,
        cs_option: (instance.exports as any).cs_option,
        cs_disasm: (instance.exports as any).cs_disasm,
        cs_disasm_iter: (instance.exports as any).cs_disasm_iter,
        cs_free: (instance.exports as any).cs_free,
        cs_malloc: (instance.exports as any).cs_malloc,
        malloc: (instance.exports as any).malloc,
        free: (instance.exports as any).free,
    }

    const helpers = (() => {
        let memoryBuffer = memory.buffer;
        let memoryView = new Uint8Array(memoryBuffer);

        function getMemory() {
            const b = memory.buffer;
            if (b !== memoryBuffer) {
                memoryBuffer = b;
                memoryView = new Uint8Array(memoryBuffer);
            }
            return memoryView;
        }

        let dec = new TextDecoder();

        const helpers = {
            get memory() {
                return getMemory();
            },

            getUInt64: function (pointer: number): bigint {
                const m = getMemory();
                var u1 = (m[pointer + 3] << 24) | (m[pointer + 2] << 16) | (m[pointer + 1] << 8) | m[pointer];
                var u2 = (m[pointer + 7] << 24) | (m[pointer + 6] << 16) | (m[pointer + 5] << 8) | m[pointer + 4];
                return (BigInt(u2) << BigInt(32)) | BigInt(u1);
            },
            getUInt32: function (pointer: number): number {
                const m = getMemory();
                return (m[pointer + 3] << 24) | (m[pointer + 2] << 16) | (m[pointer + 1] << 8) | m[pointer];
            },
            getUInt16: function (pointer: number): number {
                const m = getMemory();
                return (m[pointer + 1] << 8) | m[pointer];
            },
            getUInt8: function (pointer: number): number {
                const m = getMemory();
                return m[pointer];
            },
            getInt64: function (pointer: number): bigint {
                const m = getMemory();
                const b1 = m[pointer + 7];
                var u1 = (m[pointer + 7] << 24) | (m[pointer + 6] << 16) | (m[pointer + 5] << 8) | m[pointer + 4];
                var u2 = (m[pointer + 3] << 24) | (m[pointer + 2] << 16) | (m[pointer + 1] << 8) | m[pointer];
                const v = (BigInt(u1) << BigInt(32)) | BigInt(u2);
                if (b1 >= 128) {
                    return v - BigInt("18446744073709551616");
                } else {
                    return v;
                }
            },
            getInt32: function (pointer: number): number {
                const m = getMemory();
                const v = (m[pointer + 3] << 24) | (m[pointer + 2] << 16) | (m[pointer + 1] << 8) | m[pointer];
                if (v >= 2147483648) {
                    return v - 4294967296;
                } else {
                    return v;
                }
            },
            getInt16: function (pointer: number): number {
                const m = getMemory();
                const v = (m[pointer + 1] << 8) | m[pointer];
                if (v >= 32768) {
                    return v - 65536;
                } else {
                    return v;
                }
            },
            getBytes: function (pointer: number, count: number): Uint8Array {
                const m = getMemory();
                return m.slice(pointer, pointer + count);
            },
            getBytesCopy: function (pointer: number, count: number): Uint8Array {
                const m = getMemory();
                const b = new ArrayBuffer(count);
                const r = new Uint8Array(b);
                const v = m.slice(pointer, pointer + count);
                r.set(v);
                return r;
            },
            getString: function (pointer: number, count: number): string {
                const m = getMemory();
                let realcount = count;

                // search for null termination
                for (let i = 0; i < count; i++) {
                    if (m[pointer + i] == 0) {
                        realcount = i;
                        break;
                    }
                }

                // note: only utf-8
                return dec.decode(m.slice(pointer, pointer + realcount));
            },
            getDetail: function (pointer: number, arch: Architecture): InstructionDetail | undefined {
                return undefined;
            },
            getInstruction: function (pointer: number, arch: Architecture): Instruction {
                const id = helpers.getUInt32(pointer);
                const address = helpers.getUInt64(pointer + 8);
                const size = helpers.getUInt16(pointer + 16);
                const bytes = helpers.getBytesCopy(pointer + 18, size);
                const mnemonic = helpers.getString(pointer + 42, 32);
                const operands = helpers.getString(pointer + 74, 160);
                const detail = helpers.getDetail(pointer + 240, arch);
                return { id, address, size, bytes, mnemonic, operands, detail };
            },
            setUInt32: function (pointer: number, value: number) {
                const m = getMemory();
                m[pointer] = value & 0xff;
                m[pointer + 1] = (value >> 8) & 0xff;
                m[pointer + 2] = (value >> 16) & 0xff;
                m[pointer + 3] = (value >> 24) & 0xff;
            },
            setUInt64: function (pointer: number, value: bigint) {
                const m = getMemory();
                var msi = Number((value >> BigInt(32)) & BigInt(0xffffffff));
                var lsi = Number((value >> BigInt(32)) & BigInt(0xffffffff));
                m[pointer] = lsi & 0xff;
                m[pointer + 1] = (lsi >> 8) & 0xff;
                m[pointer + 2] = (lsi >> 16) & 0xff;
                m[pointer + 3] = (lsi >> 24) & 0xff;
                m[pointer + 4] = msi & 0xff;
                m[pointer + 5] = (msi >> 8) & 0xff;
                m[pointer + 6] = (msi >> 16) & 0xff;
                m[pointer + 7] = (msi >> 24) & 0xff;
            },
            setBytes: function (pointer: number, data: Uint8Array) {
                const m = getMemory();
                m.set(data, pointer);
            }
        };

        return helpers;
    })();

    class CapstoneInstanceImpl implements CapstoneInstance {
        #valid: boolean;
        #handle: number;
        #instructionPointer: number;
        #stateMemory: number;
        #architecture: Architecture;

        get valid() {
            return this.#valid;
        }

        get handle() {
            return this.#handle;
        }

        constructor(handle: number, architecture: Architecture) {
            this.#handle = handle;
            this.#valid = true;
            this.#architecture = architecture;

            this.#instructionPointer = exports.cs_malloc(this.#handle);
            this.#stateMemory = exports.malloc(16);
        }

        freeResources() {
            exports.cs_free(this.#instructionPointer, 1);
            this.#instructionPointer = 0;
            exports.free(this.#stateMemory);
            this.#stateMemory = 0;
            this.#valid = false;
            this.#handle = 0;
        }

        disassemble(code: Uint8Array, address?: bigint): Instruction[] {
            if (!this.#valid) {
                throw new Error("This instance has been freed");
            }
            const result: Instruction[] = [];

            // copy the code into wasm memory
            const codemem = exports.malloc(code.byteLength);
            if (!codemem) {
                throw new Error("Could not allocate memory for code");
            }

            try {
                helpers.setBytes(codemem, code);

                // the values of each of the arguments
                // are stored at these pointers
                const codePointerPointer = this.#stateMemory;
                const sizePointer = this.#stateMemory + 4;
                const addressPointer = this.#stateMemory + 8;

                // set the initial values
                helpers.setUInt32(this.#stateMemory, codemem);
                helpers.setUInt32(this.#stateMemory + 4, code.byteLength);
                helpers.setUInt64(this.#stateMemory + 8, address ?? BigInt(0));

                for (; ;) {
                    // disassemble
                    const success = !!exports.cs_disasm_iter(
                        this.#handle,
                        codePointerPointer,
                        sizePointer,
                        addressPointer,
                        this.#instructionPointer);

                    if (success) {
                        result.push(helpers.getInstruction(this.#instructionPointer, this.#architecture));
                    }
                    else {
                        break;
                    }
                }
            }
            catch (e) {
                exports.free(codemem);
                throw e;
            }
            exports.free(codemem);

            return result;
        }
    }

    return {
        createInstance: (architecture: Architecture, mode?: Mode) => {
            // allocate memory for the reference to the handle pointer
            const handlemem = exports.malloc(4);
            if (handlemem == 0) {
                throw new Error("Could not allocate memory");
            }

            // allocate the capstone instance
            const result = exports.cs_open(
                architecture,
                mode ?? Mode.LittleEndian,
                handlemem);

            if (result != 0) {
                throw new Error("Could not create instance. Got error code " + result);
            }

            // get the handle pointer and free the memory for the reference
            const handlePointer = helpers.getUInt32(handlemem);
            exports.free(handlemem);

            // return the instance wrapper
            return new CapstoneInstanceImpl(handlePointer, architecture);
        },
        freeInstance: (instance: CapstoneInstance) => {
            const inst = instance as CapstoneInstanceImpl;
            if (inst.valid) {
                const handle = inst.handle;
                inst.freeResources();
                if (handle) {
                    exports.cs_close(handle);
                }
            }
        }
    };
}

export async function loadCapstoneAsync(load: () => Promise<ArrayBuffer>): Promise<Capstone> {
    if (capstone) {
        return Promise.resolve(capstone);
    } else {
        return loadCapstoneInternal(load).then((c: Capstone) => (capstone = c, c));
    }
}