import * as vscode from 'vscode';
import { posix } from 'path';

const configurationFileName = '.fasm';

export interface AssemblyFormatterConfiguration {
  // The column that instructions will be indented to, -1 for disable indenting instructions
  instructionIndentation: number;

  // True if labels have their own line, else false if they can share line, undefined to disable label processing
  labelsHaveOwnLine: boolean;

  // If replaceTabsWithSpaces is not undefined then replace any tabs with the specified number of spaces
  replaceTabsWithSpaces: number | undefined;
}

export const loadConfiguration = async (): Promise<AssemblyFormatterConfiguration> => {
  let configuration: AssemblyFormatterConfiguration = {
    instructionIndentation: 2,
    labelsHaveOwnLine: true,
    replaceTabsWithSpaces: undefined
  };

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
  let configuration: AssemblyFormatterConfiguration = {
    instructionIndentation: 2,
    labelsHaveOwnLine: true,
    replaceTabsWithSpaces: undefined
  };

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
    const writeData = Buffer.from(JSON.stringify(configuration), 'utf8');
    await vscode.workspace.fs.writeFile(fileUri, writeData);

    return [CreateAssemblyFormatterConfigurationResult.Created, fileUri.path];
  } catch (e) {
    /* ignore errors if config file does not exist */
    return [CreateAssemblyFormatterConfigurationResult.Error, e?.toString()];
  }
};
