import { AssemblyFormatterConfiguration } from './assembly-formatter-configuration';

export const configurationFileName = '.fasm';
export const defaultTabWidth = 2;

export const defaultConfiguration: AssemblyFormatterConfiguration = {
  tabs: {
    replaceTabsWithSpaces: undefined,
    tabWidth: 2
  },

  // Columns to place directive and data following directive
  directive: {
    column: 5,
    dataColumn: 20
  },

  label: {
    // Columns to place label and data following label
    column: 5,
    dataColumn: 20,
    hasOwnLine: true
  },
  instruction: {
    bits: 32,
    supportsMultiplication: false,
    column: 5,
    dataColumn: 20
  }
};
