export interface Instruction {
  instruction: string;
  data?: string;
  expansion?: string;
  description?: string;
}

// RV32I base integer instruction set
export const rv32iInstructions = [
  { instruction: 'lui', data: 'rd,imm', description: 'Load Upper Immediate rd ← imm' },
  { instruction: 'auipc', data: 'rd,offset', description: 'Add Upper Immediate to PC rd ← pc + offset' },
  { instruction: 'jal', data: 'rd,offset', description: 'Jump and Link rd ← pc + length(inst) pc ← pc + offset' },
  { instruction: 'jalr', data: 'rd,rs1,offset', description: 'Jump and Link Register rd ← pc + length(inst) pc ← (rs1 + offset) ∧ -2' },
  { instruction: 'beq', data: 'rs1,rs2,offset', description: 'Branch Equal if rs1 = rs2 then pc ← pc + offset' },
  { instruction: 'bne', data: 'rs1,rs2,offset', description: 'Branch Not Equal if rs1 ≠ rs2 then pc ← pc + offset' },
  { instruction: 'blt', data: 'rs1,rs2,offset', description: 'Branch Less Than if rs1 < rs2 then pc ← pc + offset' },
  { instruction: 'bge', data: 'rs1,rs2,offset', description: 'Branch Greater than Equal if rs1 ≥ rs2 then pc ← pc + offset' },
  { instruction: 'bltu', data: 'rs1,rs2,offset', description: 'Branch Less Than Unsigned if rs1 < rs2 then pc ← pc + offset' },
  { instruction: 'bgeu', data: 'rs1,rs2,offset', description: 'Branch Greater than Equal Unsigned if rs1 ≥ rs2 then pc ← pc + offset' },
  { instruction: 'lb', data: 'rd,offset(rs1)', description: 'Load Byte rd ← s8[rs1 + offset]' },
  { instruction: 'lh', data: 'rd,offset(rs1)', description: 'Load Half rd ← s16[rs1 + offset]' },
  { instruction: 'lw', data: 'rd,offset(rs1)', description: 'Load Word rd ← s32[rs1 + offset]' },
  { instruction: 'lbu', data: 'rd,offset(rs1)', description: 'Load Byte Unsigned rd ← u8[rs1 + offset]' },
  { instruction: 'lhu', data: 'rd,offset(rs1)', description: 'Load Half Unsigned rd ← u16[rs1 + offset]' },
  { instruction: 'sb', data: 'rs2,offset(rs1)', description: 'Store Byte u8[rs1 + offset] ← rs2' },
  { instruction: 'sh', data: 'rs2,offset(rs1)', description: 'Store Half u16[rs1 + offset] ← rs2' },
  { instruction: 'sw', data: 'rs2,offset(rs1)', description: 'Store Word u32[rs1 + offset] ← rs2' },
  { instruction: 'addi', data: 'rd,rs1,imm', description: 'Add Immediate rd ← rs1 + sx(imm)' },
  { instruction: 'slti', data: 'rd,rs1,imm', description: 'Set Less Than Immediate rd ← sx(rs1) < sx(imm)' },
  { instruction: 'sltiu', data: 'rd,rs1,imm', description: 'Set Less Than Immediate Unsigned rd ← ux(rs1) < ux(imm)' },
  { instruction: 'xori', data: 'rd,rs1,imm', description: 'Xor Immediate rd ← ux(rs1) ⊕ ux(imm)' },
  { instruction: 'ori', data: 'rd,rs1,imm', description: 'Or Immediate rd ← ux(rs1) ∨ ux(imm)' },
  { instruction: 'andi', data: 'rd,rs1,imm', description: 'And Immediate rd ← ux(rs1) ∧ ux(imm)' },
  { instruction: 'slli', data: 'rd,rs1,imm', description: 'Shift Left Logical Immediate rd ← ux(rs1) « ux(imm)' },
  { instruction: 'srli', data: 'rd,rs1,imm', description: 'Shift Right Logical Immediate rd ← ux(rs1) » ux(imm)' },
  { instruction: 'srai', data: 'rd,rs1,imm', description: 'Shift Right Arithmetic Immediate rd ← sx(rs1) » ux(imm)' },
  { instruction: 'add', data: 'rd,rs1,rs2', description: 'Add rd ← sx(rs1) + sx(rs2)' },
  { instruction: 'sub', data: 'rd,rs1,rs2', description: 'Subtract rd ← sx(rs1) - sx(rs2)' },
  { instruction: 'sll', data: 'rd,rs1,rs2', description: 'Shift Left Logical rd ← ux(rs1) « rs2' },
  { instruction: 'slt', data: 'rd,rs1,rs2', description: 'Set Less Than rd ← sx(rs1) < sx(rs2)' },
  { instruction: 'sltu', data: 'rd,rs1,rs2', description: 'Set Less Than Unsigned rd ← ux(rs1) < ux(rs2)' },
  { instruction: 'xor', data: 'rd,rs1,rs2', description: 'Xor rd ← ux(rs1) ⊕ ux(rs2)' },
  { instruction: 'srl', data: 'rd,rs1,rs2', description: 'Shift Right Logical rd ← ux(rs1) » rs2' },
  { instruction: 'sra', data: 'rd,rs1,rs2', description: 'Shift Right Arithmetic rd ← sx(rs1) » rs2' },
  { instruction: 'or', data: 'rd,rs1,rs2', description: 'Or rd ← ux(rs1) ∨ ux(rs2)' },
  { instruction: 'and', data: 'rd,rs1,rs2', description: 'And rd ← ux(rs1) ∧ ux(rs2)' },
  { instruction: 'fence', data: 'pred,succ', description: 'Fence' },
  { instruction: 'FENCE.I', data: '', description: 'Fence Instruction' }
] as Instruction[];

// RV32M standard extension for integer multiply and divide
export const rv32mInstructions = [
  { instruction: 'mul', data: 'rd,rs1,rs2', description: 'Multiply rd ← ux(rs1) × ux(rs2)' },
  { instruction: 'mulh', data: 'rd,rs1,rs2', description: 'Multiply High Signed Signed rd ← (sx(rs1) × sx(rs2)) » xlen' },
  { instruction: 'mulhsu', data: 'rd,rs1,rs2', description: 'Multiply High Signed Unsigned rd ← (sx(rs1) × ux(rs2)) » xlen' },
  { instruction: 'mulhu', data: 'rd,rs1,rs2', description: 'Multiply High Unsigned Unsigned rd ← (ux(rs1) × ux(rs2)) » xlen' },
  { instruction: 'div', data: 'rd,rs1,rs2', description: 'Divide Signed rd ← sx(rs1) ÷ sx(rs2)' },
  { instruction: 'divu', data: 'rd,rs1,rs2', description: 'Divide Unsigned rd ← ux(rs1) ÷ ux(rs2)' },
  { instruction: 'rem', data: 'rd,rs1,rs2', description: 'Remainder Signed rd ← sx(rs1) mod sx(rs2)' },
  { instruction: 'remu', data: 'rd,rs1,rs2', description: '' }
] as Instruction[];

export const riscvPseudoInstructions = [
  { instruction: 'call', expansion: '', description: '' },
  { instruction: 'nop', expansion: 'addi zero,zero,0', description: 'No operation' },
  { instruction: 'li', expansion: 'rd, expression', description: '	(several expansions)	Load immediate' },
  { instruction: 'la', expansion: 'rd, symbol', description: '(several expansions)	Load address' },
  { instruction: 'mv', expansion: 'rd, rs1	addi rd, rs, 0', description: 'Copy register' },
  { instruction: 'not', expansion: 'rd, rs1	xori rd, rs, -1', description: 'One’s complement' },
  { instruction: 'neg', expansion: 'rd, rs1	sub rd, x0, rs', description: 'Two’s complement' },
  { instruction: 'negw', expansion: 'rd, rs1	subw rd, x0, rs', description: 'Two’s complement Word' },
  { instruction: 'sext.w', expansion: 'rd, rs1	addiw rd, rs, 0', description: 'Sign extend Word' },
  { instruction: 'seqz', expansion: 'rd, rs1	sltiu rd, rs, 1', description: 'Set if = zero' },
  { instruction: 'snez', expansion: 'rd, rs1	sltu rd, x0, rs', description: 'Set if ≠ zero' },
  { instruction: 'sltz', expansion: 'rd, rs1	slt rd, rs, x0', description: 'Set if < zero' },
  { instruction: 'sgtz', expansion: 'rd, rs1	slt rd, x0, rs', description: 'Set if > zero' },
  { instruction: 'fmv.s', expansion: 'frd, frs1	fsgnj.s frd, frs, frs', description: 'Single-precision move' },
  { instruction: 'fabs.s', expansion: 'frd, frs1	fsgnjx.s frd, frs, frs', description: 'Single-precision absolute value' },
  { instruction: 'fneg.s', expansion: 'frd, frs1	fsgnjn.s frd, frs, frs', description: 'Single-precision negate' },
  { instruction: 'fmv.d', expansion: 'frd, frs1	fsgnj.d frd, frs, frs', description: 'Double-precision move' },
  { instruction: 'fabs.d', expansion: 'frd, frs1	fsgnjx.d frd, frs, frs', description: 'Double-precision absolute value' },
  { instruction: 'fneg.d', expansion: 'frd, frs1	fsgnjn.d frd, frs, frs', description: 'Double-precision negate' },
  { instruction: 'beqz', expansion: 'rs1, offset	beq rs, x0, offset', description: 'Branch if = zero' },
  { instruction: 'bnez', expansion: 'rs1, offset	bne rs, x0, offset', description: 'Branch if ≠ zero' },
  { instruction: 'blez', expansion: 'rs1, offset	bge x0, rs, offset', description: 'Branch if ≤ zero' },
  { instruction: 'bgez', expansion: 'rs1, offset	bge rs, x0, offset', description: 'Branch if ≥ zero' },
  { instruction: 'bltz', expansion: 'rs1, offset	blt rs, x0, offset', description: 'Branch if < zero' },
  { instruction: 'bgtz', expansion: 'rs1, offset	blt x0, rs, offset', description: 'Branch if > zero' },
  { instruction: 'bgt', expansion: 'rs, rt, offset	blt rt, rs, offset', description: 'Branch if >' },
  { instruction: 'ble', expansion: 'rs, rt, offset	bge rt, rs, offset', description: 'Branch if ≤' },
  { instruction: 'bgtu', expansion: 'rs, rt, offset	bltu rt, rs, offset', description: 'Branch if >, unsigned' },
  { instruction: 'bleu', expansion: 'rs, rt, offset	bltu rt, rs, offset', description: 'Branch if ≤, unsigned' },
  { instruction: 'j', expansion: 'offset	jal x0, offset', description: 'Jump' },
  { instruction: 'jr', expansion: 'offset	jal x1, offset', description: 'Jump register' },
  { instruction: 'ret', expansion: 'jalr x0, x1, 0', description: 'Return from subroutine' }
] as Instruction[];

export const rv32RelocationInstructions = [
  { instruction: '%hi(symbol)', description: 'Absolute (HI20)	lui' },
  { instruction: '%lo(symbol)', description: 'Absolute (LO12)	loads, stores, adds' },
  { instruction: '%pcrel_hi(symbol)', description: 'PC-relative (HI20)	auipc' },
  { instruction: '%pcrel_lo(label)', description: 'PC-relative (LO12)	loads, stores, adds' },
  { instruction: '%tprel_hi(symbol)', description: 'TLS LE (Local Exec)	auipc' },
  { instruction: '%tprel_lo(label)', description: 'TLS LE (Local Exec)	loads, stores, adds' },
  { instruction: '%tprel_add(offset)', description: 'TLS LE (Local Exec)	add' }
] as Instruction[];

export const rv32Instructions = rv32iInstructions.concat(rv32mInstructions).concat(riscvPseudoInstructions);
export const rv32InstructionNames = rv32Instructions.map((i) => i.instruction);

// RV64I base integer instruction Set (is in addition to RV32I instruction set)
export const rv64iInstructions = [
  { instruction: 'lwu', data: 'rd,offset(rs1)', description: 'Load Word Unsigned rd ← u32[rs1 + offset]' },
  { instruction: 'ld', data: 'rd,offset(rs1)', description: 'Load Double rd ← u64[rs1 + offset]' },
  { instruction: 'sd', data: 'rs2,offset(rs1)', description: 'Store Double u64[rs1 + offset] ← rs2' },
  { instruction: 'slli', data: 'rd,rs1,imm', description: 'Shift Left Logical Immediate rd ← ux(rs1) « sx(imm)' },
  { instruction: 'srli', data: 'rd,rs1,imm', description: 'Shift Right Logical Immediate rd ← ux(rs1) » sx(imm)' },
  { instruction: 'srai', data: 'rd,rs1,imm', description: 'Shift Right Arithmetic Immediate rd ← sx(rs1) » sx(imm)' },
  { instruction: 'addiw', data: 'rd,rs1,imm', description: 'Add Immediate Word rd ← s32(rs1) + imm' },
  { instruction: 'slliw', data: 'rd,rs1,imm', description: 'Shift Left Logical Immediate Word rd ← s32(u32(rs1) « imm)' },
  { instruction: 'srliw', data: 'rd,rs1,imm', description: 'Shift Right Logical Immediate Word rd ← s32(u32(rs1) » imm)' },
  { instruction: 'sraiw', data: 'rd,rs1,imm', description: 'Shift Right Arithmetic Immediate Word rd ← s32(rs1) » imm' },
  { instruction: 'addw', data: 'rd,rs1,rs2', description: 'Add Word rd ← s32(rs1) + s32(rs2)' },
  { instruction: 'subw', data: 'rd,rs1,rs2', description: 'Subtract Word rd ← s32(rs1) - s32(rs2)' },
  { instruction: 'sllw', data: 'rd,rs1,rs2', description: 'Shift Left Logical Word rd ← s32(u32(rs1) « rs2)' },
  { instruction: 'srlw', data: 'rd,rs1,rs2', description: 'Shift Right Logical Word rd ← s32(u32(rs1) » rs2)' },
  { instruction: 'sraw', data: 'rd,rs1,rs2', description: 'Shift Right Arithmetic Word rd ← s32(rs1) » rs2' }
] as Instruction[];

// RV64M standard extension for integer multiply and divide (in addition to RV32M)
export const rv64mInstructions = [
  { instruction: 'mulw', data: 'rd,rs1,rs2', description: 'Multiple Word rd ← u32(rs1) × u32(rs2)' },
  { instruction: 'divw', data: 'rd,rs1,rs2', description: 'Divide Signed Word rd ← s32(rs1) ÷ s32(rs2)' },
  { instruction: 'divuw', data: 'rd,rs1,rs2', description: 'Divide Unsigned Word rd ← u32(rs1) ÷ u32(rs2)' },
  { instruction: 'remw', data: 'rd,rs1,rs2', description: 'Remainder Signed Word rd ← s32(rs1) mod s32(rs2)' },
  { instruction: 'remuw', data: 'rd,rs1,rs2', description: 'Remainder Unsigned Word rd ← u32(rs1) mod u32(rs2)' }
] as Instruction[];

export const rv64Instructions = rv64iInstructions.concat(rv64mInstructions);
