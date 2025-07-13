import { InstructionSet } from '../riscv/instructions';

export interface IndentableConfiguration {
  // The column number to place primary token, undefined to leave as is in file
  primaryColumn: number | undefined;

  // The column number to place primary data (eg op code data), undefined to leave as is in file
  dataColumn: number | undefined;

  // The column number to place comments, undefined to leave as is in file
  commentColumn: number | undefined;
}

export interface DirectiveConfiguration extends IndentableConfiguration {}

export interface LabelConfiguration extends IndentableConfiguration {
  // True if a label has its own line, false if they can share line, undefined leave as is in file
  hasOwnLine: boolean;
}

export interface InstructionConfiguration extends IndentableConfiguration {
  supportedInstructionSets: InstructionSet[];
}

export interface ValueConfiguration extends IndentableConfiguration {}

export interface TabConfiguration {
  // If replaceTabsWithSpaces is not undefined then replace any tabs with the specified number of spaces
  replaceTabsWithSpaces: number | undefined;

  // The number of spaces that a tab consumes. Used to determine column numbering.
  // ie a tabWidth of 1 will add 1 to the column number when a tab is found, whereas a tabWidth of 4 will add 4 to the column number when a tab is found.
  tabWidth: number;
}

export interface AssemblyFormatterConfiguration {
  endOfFileHasBlankLine: boolean;
  commentOnlyLineColumn: number | undefined;
  commentOnlyLineMatchNextColumn: boolean | undefined;
  commentCharacter: string | undefined;
  disabled: boolean | undefined;

  tabs: TabConfiguration;

  directive: DirectiveConfiguration;

  label: LabelConfiguration;

  localLabel: LabelConfiguration;

  instruction: InstructionConfiguration;

  value: ValueConfiguration;
}

export interface MetaAssemblyFormatterConfiguration {
  version: number;
  help: string;
}

export interface AssemblyFormatterConfigurationWithMeta extends AssemblyFormatterConfiguration {
  meta: MetaAssemblyFormatterConfiguration;
}
