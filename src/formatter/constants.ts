import { InstructionSet } from '../riscv/instructions';
import { AssemblyFormatterConfiguration } from './assembly-formatter-configuration';

export const configurationFileName = '.criscv'; // Config risc-v
export const defaultTabWidth = 2;

export const defaultConfiguration: AssemblyFormatterConfiguration = {
  endOfFileHasBlankLine: true,

  tabs: {
    replaceTabsWithSpaces: 2,
    tabWidth: 2
  },

  directive: {
    primaryColumn: 5,
    dataColumn: 15,
    commentColumn: 40
  },

  label: {
    primaryColumn: 5,
    dataColumn: 15,
    commentColumn: 40,
    hasOwnLine: true
  },
  instruction: {
    supportedInstructionSets: [InstructionSet.R32I, InstructionSet.Pseudo],
    primaryColumn: 5,
    dataColumn: 15,
    commentColumn: 40
  },
  value: {
    primaryColumn: 5,
    dataColumn: 15,
    commentColumn: 40
  }
};
