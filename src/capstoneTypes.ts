
export enum Architecture {
    ARM = 0,
    ARM64,
    MIPS,
    X86,
    PPC,
    SPARC,
    SYSZ,
    XCORE,
    M68K,
    TMS320C64X,
    M680X,
    EVM,
    MOS65XX,
    WASM,
    BPF,
    RISCV,
    XTENSA,
};

export enum Mode {
    /// little-endian mode (default mode)
    LittleEndian = 0,
    /// 32-bit ARM
    Arm = 0,
    /// 16-bit mode (X86)
    Bits16 = 1 << 1,
    /// 32-bit mode (X86)
    Bits32 = 1 << 2,
    /// 64-bit mode (X86, PPC)
    Bits64 = 1 << 3,
    /// ARM's Thumb mode, including Thumb-2
    Thumb = 1 << 4,
    /// ARM's Cortex-M series
    MClass = 1 << 5,
    /// ARMv8 A32 encodings for ARM
    V8 = 1 << 6,
    /// MicroMips mode (MIPS)
    Micro = 1 << 4,
    /// Mips III ISA
    MIPS3 = 1 << 5,
    /// Mips32r6 ISA
    MIPS32R6 = 1 << 6,
    /// Mips II ISA
    MIPS2 = 1 << 7,
    /// SparcV9 mode (Sparc)
    V9 = 1 << 4,
    /// Quad Processing eXtensions mode (PPC)
    QPX = 1 << 4,
    /// Signal Processing Engine mode (PPC)
    SPE = 1 << 5,
    /// Book-E mode (PPC)
    BOOKE = 1 << 6,
    /// M68K 68000 mode
    M68K_000 = 1 << 1,
    /// M68K 68010 mode
    M68K_010 = 1 << 2,
    /// M68K 68020 mode
    M68K_020 = 1 << 3,
    /// M68K 68030 mode
    M68K_030 = 1 << 4,
    /// M68K 68040 mode
    M68K_040 = 1 << 5,
    /// M68K 68060 mode
    M68K_060 = 1 << 6,
    /// big-endian mode
    BIG_ENDIAN = 1 << 31,
    /// Mips32 ISA (Mips)
    MIPS32 = Bits32,
    /// Mips64 ISA (Mips)
    MIPS64 = Bits64,
    /// M680X Hitachi 6301,6303 mode
    M680X_6301 = 1 << 1,
    /// M680X Hitachi 6309 mode
    M680X_6309 = 1 << 2,
    /// M680X Motorola 6800,6802 mode
    M680X_6800 = 1 << 3,
    /// M680X Motorola 6801,6803 mode
    M680X_6801 = 1 << 4,
    /// M680X Motorola/Freescale 6805 mode
    M680X_6805 = 1 << 5,
    /// M680X Motorola/Freescale/NXP 68HC08 mode
    M680X_6808 = 1 << 6,
    /// M680X Motorola 6809 mode
    M680X_6809 = 1 << 7,
    /// M680X Motorola/Freescale/NXP 68HC11 mode
    M680X_6811 = 1 << 8,
    /// M680X Motorola/Freescale/NXP CPU12
    M680X_CPU12 = 1 << 9,
    /// M680X Freescale/NXP HCS08 mode
    M680X_HCS08 = 1 << 10,
    /// Classic BPF mode (default)
    BPF_CLASSIC = 0,
    /// Extended BPF mode
    BPF_EXTENDED = 1 << 0,
    /// RISCV RV32G
    RISCV32 = 1 << 0,
    /// RISCV RV64G
    RISCV64 = 1 << 1,
    /// RISCV compressed instructure mode
    RISCVC = 1 << 2,
    /// MOS65XXX MOS 6502
    MOS65XX_6502 = 1 << 1,
    /// MOS65XXX WDC 65c02
    MOS65XX_65C02 = 1 << 2,
    /// MOS65XXX WDC W65c02
    MOS65XX_W65C02 = 1 << 3,
    /// MOS65XXX WDC 65816, 8-bit m/x
    MOS65XX_65816 = 1 << 4,
    /// MOS65XXX WDC 65816, 16-bit m, 8-bit x 
    MOS65XX_65816_LONG_M = (1 << 5),
    /// MOS65XXX WDC 65816, 8-bit m, 16-bit x
    MOS65XX_65816_LONG_X = (1 << 6),
    MOS65XX_65816_LONG_MX = MOS65XX_65816_LONG_M | MOS65XX_65816_LONG_X,
}

export enum Option {
    /// No option specified
    INVALID,
    /// Assembly output syntax
    SYNTAX,
    /// Break down instruction structure into details
    DETAIL,
    /// Change engine's mode at run-time
    MODE,
    /// User-defined dynamic memory related functions
    MEM,
    /// Skip data when disassembling. Then engine is in SKIPDATA mode.
    SKIPDATA,
    /// Setup user-defined function for SKIPDATA option
    SKIPDATA_SETUP,
    /// Customize instruction mnemonic
    MNEMONIC,
    /// print immediate operands in unsigned form
    UNSIGNED,
}

export enum OptionType {
    /// Turn OFF an option - default for DETAIL, SKIPDATA, UNSIGNED.
    OFF = 0,
    /// Turn ON an option (DETAIL, SKIPDATA).
    ON = 3,
    /// Default asm syntax (SYNTAX).
    SYNTAX_DEFAULT = 0,
    /// X86 Intel asm syntax - default on X86 (SYNTAX).
    SYNTAX_INTEL,
    /// X86 ATT asm syntax (SYNTAX).
    SYNTAX_ATT,
    /// Prints register name with only number (SYNTAX)
    SYNTAX_NOREGNAME,
    /// X86 Intel Masm syntax (SYNTAX).
    SYNTAX_MASM,
    /// MOS65XX use $ as hex prefix
    SYNTAX_MOTOROLA,
}

export enum OperandType {
    Invalid,
    Register,
    Immediate,
    Memory,
    FloatingPoint
}

export enum AccessType {
    Invalid = 0,
    Read = 1,
    Write = 2,
}

export enum InstructionGroupType {
    /// uninitialized/invalid group.
    CS_GRP_INVALID,
    /// all jump instructions (conditional+direct+indirect jumps)
    CS_GRP_JUMP,
    /// all call instructions
    CS_GRP_CALL,
    /// all return instructions
    CS_GRP_RET,
    /// all interrupt instructions (int+syscall)
    CS_GRP_INT,
    /// all interrupt return instructions
    CS_GRP_IRET,
    /// all privileged instructions
    CS_GRP_PRIVILEGE,
    /// all relative branching instructions
    CS_GRP_BRANCH_RELATIVE,
}

export interface InstructionDetail {
    /// list of implicit registers read by this insn
    regs_read: number[];
    /// list of implicit registers modified by this insn
    regs_write: number[];
    /// list of group this instruction belong to
    groups: number[];
}

export interface Instruction {
    /// Instruction ID (basically a numeric ID for the instruction mnemonic)
    /// Find the instruction id in the '[ARCH]_insn' enum in the header file
    /// of corresponding architecture, such as 'arm_insn' in arm.h for ARM,
    /// 'x86_insn' in x86.h for X86, etc...
    /// This information is available even when CS_OPT_DETAIL = CS_OPT_OFF
    id: number;

    /// Address (EIP) of this instruction
    /// This information is available even when CS_OPT_DETAIL = CS_OPT_OFF
    address: bigint;

    /// Size of this instruction
    /// This information is available even when CS_OPT_DETAIL = CS_OPT_OFF
    size: number;

    /// Machine bytes of this instruction, with number of bytes indicated by @size above
    /// This information is available even when CS_OPT_DETAIL = CS_OPT_OFF
    bytes: Uint8Array;

    /// Ascii text of instruction mnemonic
    /// This information is available even when CS_OPT_DETAIL = CS_OPT_OFF
    mnemonic: string;

    /// Ascii text of instruction operands
    /// This information is available even when CS_OPT_DETAIL = CS_OPT_OFF
    operands: string;

    /// Pointer to cs_detail.
    /// NOTE: detail pointer is only valid when both requirements below are met:
    /// (1) CS_OP_DETAIL = CS_OPT_ON
    /// (2) Engine is not in Skipdata mode (CS_OP_SKIPDATA option set to CS_OPT_ON)
    ///
    /// NOTE 2: when in Skipdata mode, or when detail mode is OFF, even if this pointer
    ///     is not NULL, its content is still irrelevant.
    detail?: InstructionDetail;
}

export interface CapstoneInstance {
    readonly valid: boolean;
    disassemble: (code: Uint8Array, address?: bigint) => Instruction[];
}

export interface Capstone {
    createInstance: (architecture: Architecture, mode?: Mode) => CapstoneInstance;
    freeInstance: (instance: CapstoneInstance) => void;
};