import * as vscode from 'vscode';
import { posix } from 'path';
import { configurationFileName, defaultConfiguration, defaultTabWidth } from './constants';

export interface Indentable {
  // The column number to place primary token, undefined to leave as is
  column: number | undefined;

  // The column number to place primary data, undefined to leave as is
  dataColumn: number | undefined;
}

export interface DirectiveConfiguration extends Indentable {}

export interface LabelConfiguration extends Indentable {
  // True if a label has its own line, false if they can share line, undefined leave as is
  hasOwnLine: boolean;
}

export interface InstructionConfiguration extends Indentable {
  bits: number;
  supportsMultiplication: boolean;
}

export interface TabConfiguration {
  // If replaceTabsWithSpaces is not undefined then replace any tabs with the specified number of spaces
  replaceTabsWithSpaces: number | undefined;

  // The number of spaced that a tab consumes. Used to determine column numbering.
  // ie a tabWidth of 1 will add 1 to the column number when a tab is found, whereas a tabWidth of 4 will add 4 to the column number when a tab is found.
  tabWidth: number;
}

export interface AssemblyFormatterConfiguration {
  tabs: TabConfiguration;

  directive: DirectiveConfiguration;

  label: LabelConfiguration;

  instruction: InstructionConfiguration;
}

export interface MetaAssemblyFormatterConfiguration {
  version: number;
  description: string;
}

export interface AssemblyFormatterConfigurationWithMeta extends AssemblyFormatterConfiguration {
  meta: MetaAssemblyFormatterConfiguration;
}

export const loadConfiguration = async (): Promise<AssemblyFormatterConfiguration> => {
  let configuration: AssemblyFormatterConfiguration = Object.assign({}, defaultConfiguration);

  if (!vscode.workspace.workspaceFolders) {
    // Return default if there is no workspace configuration file
    return configuration;
  }

  try {
    const folderUri = vscode.workspace.workspaceFolders[0].uri;
    const fileUri = folderUri.with({ path: posix.join(folderUri.path, configurationFileName) });

    const fileContent = await vscode.workspace.fs.readFile(fileUri);
    // eslint-disable-next-line no-undef
    const json = Buffer.from(fileContent).toString('utf8');
    const newConfiguration = JSON.parse(json);

    configuration = Object.assign(configuration, newConfiguration);
  } catch {
    /* ignore errors if config file does not exist */
  }

  return configuration;
};

export enum CreateAssemblyFormatterConfigurationResult {
  AlreadyExists = 'AlreadyExists',
  Created = 'Created',
  Error = 'Error',
  NoWorkspace = 'NoWorkspace'
}

export const createDefaultConfiguration = async (): Promise<[CreateAssemblyFormatterConfigurationResult, string?]> => {
  let configuration: AssemblyFormatterConfigurationWithMeta = Object.assign(
    {
      meta: {
        version: 1,
        description: 'See: https://github.com/mekatrol/vscode-riscv-extension for description of configuration values.'
      }
    },
    defaultConfiguration
  );

  if (!vscode.workspace.workspaceFolders) {
    // Return default if there is no workspace configuration file
    return [CreateAssemblyFormatterConfigurationResult.NoWorkspace, undefined];
  }

  try {
    const folderUri = vscode.workspace.workspaceFolders[0].uri;
    const fileUri = folderUri.with({ path: posix.join(folderUri.path, configurationFileName) });

    // Does the file already exist?
    try {
      if ((await vscode.workspace.fs.stat(fileUri)) != undefined) {
        return [CreateAssemblyFormatterConfigurationResult.AlreadyExists, fileUri.path];
      }
    } catch {
      /* ignore */
    }

    const content = JSON.stringify(configuration, null, defaultTabWidth);

    // Create the file
    // eslint-disable-next-line no-undef
    const writeData = Buffer.from(content, 'utf8');
    await vscode.workspace.fs.writeFile(fileUri, writeData);

    return [CreateAssemblyFormatterConfigurationResult.Created, fileUri.path];
  } catch (e) {
    /* ignore errors if config file does not exist */
    return [CreateAssemblyFormatterConfigurationResult.Error, e?.toString()];
  }
};
