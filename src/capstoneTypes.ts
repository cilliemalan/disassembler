
/** An instruction set architecture. */
export enum Architecture {
    /** 32 bit Arm architectures (e.g. Armv6 and Armv7) */
    ARM = 0,
    /** 64 bit Arm (e.g. Armv8-A) */
    ARM64,
    /** Mips */
    MIPS,
    /** x86 related architectures (including x64) */
    X86,
    /** Power PC */
    PPC,
    /** Sparc */
    SPARC,
    /** System-Z */
    SYSZ,
    /** XCore */
    XCORE,
    M68K,
    TMS320C64X,
    M680X,
    /** Etherium virtual Machine */
    EVM,
    MOS65XX,
    /** WebAssembly */
    WASM,
    /** Berkely Packet Filter */
    BPF,
    /** Risc-V */
    RISCV,
    /** Tensilica Xtensa */
    XTENSA,
};

/** The mode for the architecture (e.g. Thumb for Arm or Bits64 for X86) */
export enum Mode {
    /** little-endian mode (default mode) */
    LittleEndian = 0,
    /** 32-bit ARM */
    Arm = 0,
    /** 16-bit mode (X86) */
    Bits16 = 1 << 1,
    /** 32-bit mode (X86) */
    Bits32 = 1 << 2,
    /** 64-bit mode (X86, PPC) */
    Bits64 = 1 << 3,
    /** ARM's Thumb mode, including Thumb-2 */
    Thumb = 1 << 4,
    /** ARM's Cortex-M series */
    MClass = 1 << 5,
    /** ARMv8 A32 encodings for ARM */
    V8 = 1 << 6,
    /** MicroMips mode (MIPS) */
    Micro = 1 << 4,
    /** Mips III ISA */
    MIPS3 = 1 << 5,
    /** Mips32r6 ISA */
    MIPS32R6 = 1 << 6,
    /** Mips II ISA */
    MIPS2 = 1 << 7,
    /** SparcV9 mode (Sparc) */
    V9 = 1 << 4,
    /** Quad Processing eXtensions mode (PPC) */
    QPX = 1 << 4,
    /** Signal Processing Engine mode (PPC) */
    SPE = 1 << 5,
    /** Book-E mode (PPC) */
    BOOKE = 1 << 6,
    /** M68K 68000 mode */
    M68K_000 = 1 << 1,
    /** M68K 68010 mode */
    M68K_010 = 1 << 2,
    /** M68K 68020 mode */
    M68K_020 = 1 << 3,
    /** M68K 68030 mode */
    M68K_030 = 1 << 4,
    /** M68K 68040 mode */
    M68K_040 = 1 << 5,
    /** M68K 68060 mode */
    M68K_060 = 1 << 6,
    /** big-endian mode */
    BIG_ENDIAN = 1 << 31,
    /** Mips32 ISA (Mips) */
    MIPS32 = Bits32,
    /** Mips64 ISA (Mips) */
    MIPS64 = Bits64,
    /** M680X Hitachi 6301,6303 mode */
    M680X_6301 = 1 << 1,
    /** M680X Hitachi 6309 mode */
    M680X_6309 = 1 << 2,
    /** M680X Motorola 6800,6802 mode */
    M680X_6800 = 1 << 3,
    /** M680X Motorola 6801,6803 mode */
    M680X_6801 = 1 << 4,
    /** M680X Motorola/Freescale 6805 mode */
    M680X_6805 = 1 << 5,
    /** M680X Motorola/Freescale/NXP 68HC08 mode */
    M680X_6808 = 1 << 6,
    /** M680X Motorola 6809 mode */
    M680X_6809 = 1 << 7,
    /** M680X Motorola/Freescale/NXP 68HC11 mode */
    M680X_6811 = 1 << 8,
    /** M680X Motorola/Freescale/NXP CPU12 */
    M680X_CPU12 = 1 << 9,
    /** M680X Freescale/NXP HCS08 mode */
    M680X_HCS08 = 1 << 10,
    /** Classic BPF mode (default) */
    BPF_CLASSIC = 0,
    /** Extended BPF mode */
    BPF_EXTENDED = 1 << 0,
    /** RISCV RV32G */
    RISCV32 = 1 << 0,
    /** RISCV RV64G */
    RISCV64 = 1 << 1,
    /** RISCV compressed instructure mode */
    RISCVC = 1 << 2,
    /** MOS65XXX MOS 6502 */
    MOS65XX_6502 = 1 << 1,
    /** MOS65XXX WDC 65c02 */
    MOS65XX_65C02 = 1 << 2,
    /** MOS65XXX WDC W65c02 */
    MOS65XX_W65C02 = 1 << 3,
    /** MOS65XXX WDC 65816, 8-bit m/x */
    MOS65XX_65816 = 1 << 4,
    /** MOS65XXX WDC 65816, 16-bit m, 8-bit x  */
    MOS65XX_65816_LONG_M = (1 << 5),
    /** MOS65XXX WDC 65816, 8-bit m, 16-bit x */
    MOS65XX_65816_LONG_X = (1 << 6),
    MOS65XX_65816_LONG_MX = MOS65XX_65816_LONG_M | MOS65XX_65816_LONG_X,
}

export enum Option {
    /** No option specified */
    INVALID,
    /** Assembly output syntax */
    SYNTAX,
    /** Break down instruction structure into details */
    DETAIL,
    /** Change engine's mode at run-time */
    MODE,
    /** User-defined dynamic memory related functions */
    MEM,
    /** Skip data when disassembling. Then engine is in SKIPDATA mode. */
    SKIPDATA,
    /** Setup user-defined function for SKIPDATA option */
    SKIPDATA_SETUP,
    /** Customize instruction mnemonic */
    MNEMONIC,
    /** print immediate operands in unsigned form */
    UNSIGNED,
}

export enum OptionType {
    /** Turn OFF an option - default for DETAIL, SKIPDATA, UNSIGNED. */
    OFF = 0,
    /** Turn ON an option (DETAIL, SKIPDATA). */
    ON = 3,
    /** Default asm syntax (SYNTAX). */
    SYNTAX_DEFAULT = 0,
    /** X86 Intel asm syntax - default on X86 (SYNTAX). */
    SYNTAX_INTEL,
    /** X86 ATT asm syntax (SYNTAX). */
    SYNTAX_ATT,
    /** Prints register name with only number (SYNTAX) */
    SYNTAX_NOREGNAME,
    /** X86 Intel Masm syntax (SYNTAX). */
    SYNTAX_MASM,
    /** MOS65XX use $ as hex prefix */
    SYNTAX_MOTOROLA,
}

/** An operand type */
export enum OperandType {
    Invalid,
    /** A general purpose register. */
    Register,
    /** An immediate constant. */
    Immediate,
    /** A memory location. */
    Memory,
    /** A floating point register. */
    FloatingPoint
}

/** The type of access on an operand */
export enum AccessType {
    Invalid = 0,
    /** Read access */
    Read = 1,
    /** Write access */
    Write = 2,
    /** Read and write access */
    ReadWrite = 3,
}

/** An instruction group */
export enum InstructionGroupType {
    Invalid,
    /** all jump instructions (conditional+direct+indirect jumps) */
    Jump,
    /** all call instructions */
    Call,
    /** all return instructions */
    ret,
    /** all interrupt instructions (int+syscall) */
    Int,
    /** all interrupt return instructions */
    Iret,
    /** all privileged instructions */
    Privileged,
    /** all relative branching instructions */
    BranchRelative,
}

export interface InstructionDetail {
    /** list of implicit registers read by this insn */
    regs_read: number[];
    /** list of implicit registers modified by this insn */
    regs_write: number[];
    /** list of group this instruction belong to */
    groups: number[];
}

export interface Instruction {
    /** Instruction ID (basically a numeric ID for the instruction mnemonic)
     *  Find the instruction id in the '[ARCH]_insn' enum in the header file
     *  of corresponding architecture, such as 'arm_insn' in arm.h for ARM,
     *  'x86_insn' in x86.h for X86, etc... */
    id: number;

    /** Address (EIP) of this instruction */
    address: bigint;

    /** Size of this instruction */
    size: number;

    /** Machine bytes of this instruction */
    bytes: Uint8Array;

    /** Ascii text of instruction mnemonic */
    mnemonic: string;

    /** Ascii text of instruction operands */
    operands: string;

    /** Instruction details. */
    detail?: InstructionDetail;
}

/** An instance for the disassembly of a specific ISA and mode.
 * Created by calling @see Capstone.createInstance
 */
export interface CapstoneInstance {
    /** Indicates if this instance is still valid or
     * if the underlying WebAssembly resources have been freed.
     */
    readonly valid: boolean;

    /** The architecure this instance disassembles for. */
    readonly architecture: Architecture;

    /** Any mode flags this instance is configured for. */
    readonly mode?: Mode

    /** Disassemble some binary code 
     * @param code The binary code
     * @param address The address the code starts at. This
     * is referenced by @see Instruction.address for example.
    */
    disassemble: (code: Uint8Array, address?: bigint) => Instruction[];
}

/** An interface to the capstone disassembly framework. */
export interface Capstone {
    /** Create a new instance for disassembling a specific ISA
     * @param architecture The architecture to disassemble for.
     * @param mode Any specific mode flags for the architecture (e.g 64-bit for x86 or Thumb for Arm).
     */
    createInstance: (architecture: Architecture, mode?: Mode) => CapstoneInstance;
    /** Free an instance of the framework. */
    freeInstance: (instance: CapstoneInstance) => void;
};
