import { AssemblyFormatterConfiguration } from './assembly-formatter-configuration';

export const configurationFileName = '.fasm';
export const defaultTabWidth = 2;

export const defaultConfiguration: AssemblyFormatterConfiguration = {
  instructionIndentation: 2,
  labelsHaveOwnLine: true,
  replaceTabsWithSpaces: undefined,
  tabWidth: 2,

  // Columns to place directive and data following directive
  directiveColumn: 5,
  directiveDataColumn: 20,

  // Columns to place label and data following label
  labelColumn: 5,
  labelDataColumn: 20
};
