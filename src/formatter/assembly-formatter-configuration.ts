import * as vscode from 'vscode';
import { posix } from 'path';
import { configurationFileName, defaultConfiguration, defaultTabWidth } from './constants';

export interface AssemblyFormatterConfiguration {
  // The column that instructions will be indented to, -1 for disable indenting instructions
  instructionIndentation: number;

  // True if labels have their own line, else false if they can share line, undefined to disable label processing
  labelsHaveOwnLine: boolean;

  // If replaceTabsWithSpaces is not undefined then replace any tabs with the specified number of spaces
  replaceTabsWithSpaces: number | undefined;

  // The number of spaced that a tab consumes. Used to determine column numbering.
  // ie a tabWidth of 1 will add 1 to the column number when a tab is found, whereas a tabWidth of 4 will add 4 to the column number when a tab is found.
  tabWidth: number;

  // The column number to place directives, undefined to leave as is
  directiveColumn: number | undefined;

  // The column number to place directive data, undefined to leave as is
  directiveDataColumn: number | undefined;

  // The column number to place labels, undefined to leave as is
  labelColumn: number | undefined;

  // The column number to place label data, undefined to leave as is
  labelDataColumn: number | undefined;
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
  let configuration: AssemblyFormatterConfiguration = Object.assign({}, defaultConfiguration);

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

    // Create the file
    // eslint-disable-next-line no-undef
    const writeData = Buffer.from(JSON.stringify(configuration, null, defaultTabWidth), 'utf8');
    await vscode.workspace.fs.writeFile(fileUri, writeData);

    return [CreateAssemblyFormatterConfigurationResult.Created, fileUri.path];
  } catch (e) {
    /* ignore errors if config file does not exist */
    return [CreateAssemblyFormatterConfigurationResult.Error, e?.toString()];
  }
};
