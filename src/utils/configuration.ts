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

    // The configuration comes from user entered value on disk, given this transpiles to
    // JavaScript then the user can override values to invalid values without error.
    // So we validate settings...

    if (configuration.endOfFileHasBlankLine !== false && configuration.endOfFileHasBlankLine !== true) {
      configuration.endOfFileHasBlankLine = true;
    }

    configuration.commentOnlyLineColumn = clampNumberUndefinable(configuration.commentOnlyLineColumn, 1, undefined);

    if (configuration.commentCharacter !== '#' && configuration.commentCharacter != ';') {
      configuration.commentCharacter = '#';
    }

    configuration.tabs.replaceTabsWithSpaces = clampNumberUndefinable(configuration.tabs.replaceTabsWithSpaces, 2, undefined);
    configuration.tabs.tabWidth = clampNumber(configuration.tabs.tabWidth, 2, undefined);

    configuration.directive.primaryColumn = clampNumberUndefinable(configuration.directive.primaryColumn, 2, undefined);
    configuration.directive.dataColumn = clampNumberUndefinable(configuration.directive.dataColumn, 10, undefined);
    configuration.directive.commentColumn = clampNumberUndefinable(configuration.directive.commentColumn, 20, undefined);

    configuration.label.primaryColumn = clampNumberUndefinable(configuration.label.primaryColumn, 2, undefined);
    configuration.label.dataColumn = clampNumberUndefinable(configuration.label.dataColumn, 10, undefined);
    configuration.label.commentColumn = clampNumberUndefinable(configuration.label.commentColumn, 20, undefined);
    if (configuration.label.hasOwnLine !== false && configuration.label.hasOwnLine !== true) {
      configuration.label.hasOwnLine = true;
    }

    if (!configuration.localLabel) {
      configuration.localLabel = {
        primaryColumn: 2,
        dataColumn: 10,
        commentColumn: 20,
        hasOwnLine: false
      };
    }

    configuration.localLabel.primaryColumn = clampNumberUndefinable(configuration.localLabel.primaryColumn, 2, undefined);
    configuration.localLabel.dataColumn = clampNumberUndefinable(configuration.localLabel.dataColumn, 10, undefined);
    configuration.localLabel.commentColumn = clampNumberUndefinable(configuration.localLabel.commentColumn, 20, undefined);
    if (configuration.localLabel.hasOwnLine !== false && configuration.localLabel.hasOwnLine !== true) {
      configuration.localLabel.hasOwnLine = true;
    }

    configuration.instruction.primaryColumn = clampNumberUndefinable(configuration.instruction.primaryColumn, 2, undefined);
    configuration.instruction.dataColumn = clampNumberUndefinable(configuration.instruction.dataColumn, 10, undefined);
    configuration.instruction.commentColumn = clampNumberUndefinable(configuration.instruction.commentColumn, 20, undefined);

    configuration.value.primaryColumn = clampNumberUndefinable(configuration.value.primaryColumn, 2, undefined);
    configuration.value.dataColumn = clampNumberUndefinable(configuration.value.dataColumn, 10, undefined);
    configuration.value.commentColumn = clampNumberUndefinable(configuration.value.commentColumn, 20, undefined);
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
