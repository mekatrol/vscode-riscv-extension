import * as vscode from 'vscode';
import { posix } from 'path';
import { configurationFileName, defaultConfiguration, defaultTabWidth } from '../formatter/constants';
import { AssemblyFormatterConfiguration, AssemblyFormatterConfigurationWithMeta } from '../formatter/assembly-formatter-configuration';

export enum CreateAssemblyFormatterConfigurationResult {
  AlreadyExists = 'AlreadyExists',
  Created = 'Created',
  Error = 'Error',
  NoWorkspace = 'NoWorkspace'
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

    // Replace non-sensible configuration values
    configuration.tabs.replaceTabsWithSpaces = clampNumberUndefinable(configuration.tabs.replaceTabsWithSpaces, 2, undefined);
    configuration.tabs.tabWidth = clampNumber(configuration.tabs.tabWidth, 2, undefined);
  } catch {
    /* ignore errors if config file does not exist */
  }

  return configuration;
};

export const createDefaultConfiguration = async (): Promise<[CreateAssemblyFormatterConfigurationResult, string?]> => {
  let configuration: AssemblyFormatterConfigurationWithMeta = Object.assign(
    {
      meta: {
        version: 1,
        help: 'See: https://github.com/mekatrol/vscode-riscv-extension for description of configuration values.'
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

const clampNumberUndefinable = (value: number | undefined, min: number, max: number | undefined = undefined): number | undefined => {
  if (!value) {
    return undefined;
  }

  return clampNumber(value, min, max);
};

const clampNumber = (value: number, min: number, max: number | undefined = undefined): number => {
  if (isNaN(value)) {
    return min;
  }

  if (min && value < min) {
    return min;
  }

  if (max && value > max) {
    return max;
  }

  return value;
};
