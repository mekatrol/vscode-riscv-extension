import { AssemblyFormatterConfiguration } from './assembly-formatter-configuration';

export const configurationFileName = '.fasm';
export const defaultTabWidth = 2;

export const defaultConfiguration: AssemblyFormatterConfiguration = {
  instructionIndentation: 2,
  labelsHaveOwnLine: true,
  replaceTabsWithSpaces: undefined,
  tabWidth: 2,
  directiveColumn: 4,
  directiveDataColumn: 20
};
