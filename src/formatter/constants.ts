import { InstructionSet } from '../riscv/instructions';
import { AssemblyFormatterConfiguration } from './assembly-formatter-configuration';

export const configurationFileName = '.criscv'; // Config risc-v
export const defaultTabWidth = 2;

export const defaultConfiguration: AssemblyFormatterConfiguration = {
  endOfFileHasBlankLine: true,

  tabs: {
    replaceTabsWithSpaces: undefined,
    tabWidth: 2
  },

  // Columns to place directive and data following directive
  directive: {
    primaryColumn: 3,
    dataColumn: 10,
    commentColumn: 20
  },

  label: {
    // Columns to place label and data following label
    primaryColumn: 1,
    dataColumn: 10,
    commentColumn: 20,
    hasOwnLine: true
  },
  instruction: {
    supportedInstructionSets: [InstructionSet.R32I, InstructionSet.Pseudo],
    primaryColumn: 3,
    dataColumn: 10,
    commentColumn: 20
  }
};
