import * as vscode from 'vscode';
import { AssemblyFormatter, FormatConfiguration } from './formatter/assembly-formatter';
import { posix } from 'path';

const loadConfiguration = async (): Promise<FormatConfiguration> => {
  let configuration: FormatConfiguration = {
    instructionIndentation: 2,
    labelsHaveOwnLine: true
  };

  if (!vscode.workspace.workspaceFolders) {
    // Return default if there is no workspace configuration file
    return configuration;
  }

  try {
    const folderUri = vscode.workspace.workspaceFolders[0].uri;
    const fileUri = folderUri.with({ path: posix.join(folderUri.path, '.fasm') });

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

// Called when extension is activated
export async function activate(_: /*context*/ vscode.ExtensionContext): Promise<void> {
  // Register the formatter
  vscode.languages.registerDocumentFormattingEditProvider('assembly', {
    async provideDocumentFormattingEdits(document: vscode.TextDocument): Promise<vscode.TextEdit[]> {
      return new AssemblyFormatter().formatDocument(document, await loadConfiguration());
    }
  });
}
