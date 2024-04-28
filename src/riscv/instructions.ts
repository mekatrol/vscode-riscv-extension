// See: https://riscv.org/wp-content/uploads/2019/06/riscv-spec.pdf

import { EnumDictionary } from '../types/dictionary';

export const RV32IBaseIntegerInstructionSet = [
  'lui',
  'auipc',
  'jal',
  'jalr',
  'beq',
  'bne',
  'blt',
  'bge',
  'bltu',
  'bgeu',
  'lb',
  'lh',
  'lw',
  'lbu',
  'lhu',
  'sb',
  'sh',
  'sw',
  'addi',
  'slti',
  'sltiu',
  'xori',
  'ori',
  'andi',
  'slli',
  'srli',
  'srai',
  'add',
  'sub',
  'sll',
  'slt',
  'sltu',
  'xor',
  'srl',
  'sra',
  'or',
  'and',
  'fence',
  'fence.i',
  'ecall',
  'ebreak',
  'csrrw',
  'csrrs',
  'csrrc',
  'csrrwi',
  'csrrsi',
  'csrrci'
];

export const RV64IBaseIntegerInstructionSet = ['lwu', 'ld', 'sd', 'slli', 'srli', 'srai', 'addiw', 'slliw', 'srliw', 'sraiw', 'addw', 'subw', 'sllw', 'srlw', 'sraw'];

export const RV32MStandardExtensionInstructionSet = ['mul', 'mulh', 'mulhsu', 'mulhu', 'div', 'divu', 'rem', 'remu'];

export const RV64MStandardExtensionInstructionSet = ['mulw', 'divw', 'divuw', 'remw', 'remuw'];

export const RV32AStandardExtensionInstructionSet = ['lr.w', 'sc.w', 'amoswap.w', 'amoadd.w', 'amoxor.w', 'amoand.w', 'amoor.w', 'amomin.w', 'amomax.w', 'amominu.w', 'amomaxu.w'];

export const RV64AStandardExtensionInstructionSet = ['lr.d', 'sc.d', 'amoswap.d', 'amoadd.d', 'amoxor.d', 'amoand.d', 'amoor.d', 'amomin.d', 'amomax.d', 'amominu.d', 'amomaxu.d'];

export const RV32FStandardExtensionInstructionSet = [
  'flw',
  'fsw',
  'fmadd.s',
  'fmsub.s',
  'fnmsub.s',
  'fnmadd.s',
  'fadd.s',
  'fsub.s',
  'fmul.s',
  'fdiv.s',
  'fsqrt.s',
  'fsgnj.s',
  'fsgnjn.s',
  'fsgnjx.s',
  'fmin.s',
  'fmax.s',
  'fcvt.w.s',
  'fcvt.wu.s',
  'fmv.x.w',
  'feq.s',
  'flt.s',
  'fle.s',
  'fclass.s',
  'fcvt.s.w',
  'fcvt.s.wu',
  'fmv.w.x'
];

export const RV64FStandardExtensionInstructionSet = ['fcvt.l.s', 'fcvt.lu.s', 'fcvt.s.l', 'fcvt.s.lu'];

export const RV32DStandardExtensionInstructionSet = [
  'fld',
  'fsd',
  'fmadd.d',
  'fmsub.d',
  'fnmsub.d',
  'fnmadd.d',
  'fadd.d',
  'fsub.d',
  'fmul.d',
  'fdiv.d',
  'fsqrt.d',
  'fsgnj.d',
  'fsgnjn.d',
  'fsgnjx.d',
  'fmin.d',
  'fmax.d',
  'fcvt.s.d',
  'fcvt.d.s',
  'feq.d',
  'flt.d',
  'fle.d',
  'fclass.d',
  'fcvt.w.d',
  'fcvt.wu.d',
  'fcvt.d.w',
  'fcvt.d.wu'
];

export const RV64DStandardExtensionInstructionSet = ['fcvt.l.d', 'fcvt.lu.d', 'fmv.x.d', 'fcvt.d.l', 'fcvt.d.lu', 'fmv.d.x'];

export const PseudoInstructionSet = [
  'call',
  'nop',
  'li',
  'la',
  'mv',
  'not',
  'neg',
  'negw',
  'sext.w',
  'seqz',
  'snez',
  'sltz',
  'sgtz',
  'fmv.s',
  'fabs.s',
  'fneg.s',
  'fmv.d',
  'fabs.d',
  'fneg.d',
  'beqz',
  'bnez',
  'blez',
  'bgez',
  'bltz',
  'bgtz',
  'bgt',
  'ble',
  'bgtu',
  'bleu',
  'j',
  'jr',
  'ret'
] as string[];

export enum InstructionSet {
  R32I = 'R32I',
  R64I = 'R64I',
  RV32M = 'RV32M',
  RV64M = 'RV64M',
  RV32A = 'RV32A',
  RV64A = 'RV64A',
  RV32F = 'RV32F',
  RV64F = 'RV64F',
  RV32D = 'RV32D',
  RV64D = 'RV64D',
  Pseudo = 'Pseudo',
  Compressed = 'Compressed'
}

export const instructionSetMap: EnumDictionary<InstructionSet, string[]> = {
  [InstructionSet.R32I]: RV32IBaseIntegerInstructionSet,
  [InstructionSet.R64I]: RV64IBaseIntegerInstructionSet,
  [InstructionSet.RV32M]: RV32MStandardExtensionInstructionSet,
  [InstructionSet.RV64M]: RV64MStandardExtensionInstructionSet,
  [InstructionSet.RV32A]: RV32AStandardExtensionInstructionSet,
  [InstructionSet.RV64A]: RV64AStandardExtensionInstructionSet,
  [InstructionSet.RV32F]: RV32FStandardExtensionInstructionSet,
  [InstructionSet.RV64F]: RV64FStandardExtensionInstructionSet,
  [InstructionSet.RV32D]: RV32DStandardExtensionInstructionSet,
  [InstructionSet.RV64D]: RV64DStandardExtensionInstructionSet,
  [InstructionSet.Pseudo]: PseudoInstructionSet,
  [InstructionSet.Compressed]: PseudoInstructionSet
};

export const getCombinedInstructions = (keys: InstructionSet[]): string[] => {
  let instructions = [] as string[];

  keys.forEach((key) => {
    instructions = instructions.concat(instructionSetMap[key as keyof typeof InstructionSet]);
  });

  // Sort not needed, but helps debugging extension
  instructions = instructions.sort();

  return instructions;
};
