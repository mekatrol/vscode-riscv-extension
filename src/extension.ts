import * as vscode from 'vscode';
import { AssemblyFormatter } from './formatter/assembly-formatter';
import { CreateAssemblyFormatterConfigurationResult, createDefaultConfiguration, loadConfiguration } from './formatter/assembly-formatter-configuration';

// Called when extension is activated
export async function activate(context: vscode.ExtensionContext): Promise<void> {
  // Register the formatter
  vscode.languages.registerDocumentFormattingEditProvider('assembly', {
    async provideDocumentFormattingEdits(document: vscode.TextDocument): Promise<vscode.TextEdit[]> {
      return new AssemblyFormatter().formatDocument(document, await loadConfiguration());
    }
  });

  // Register command handler
  const command = vscode.commands.registerCommand('mekatrol.riscv-language-tools.addConfigurationFile', async () => {
    const [result, fileNameOrError] = await createDefaultConfiguration();

    switch (result) {
      case CreateAssemblyFormatterConfigurationResult.AlreadyExists:
        vscode.window.showWarningMessage(`RISC-V assembly formatter configuration file '${fileNameOrError}' already exists!`);
        break;

      case CreateAssemblyFormatterConfigurationResult.Created:
        vscode.window.showInformationMessage(`RISC-V assembly formatter configuration file '${fileNameOrError}' created.`);
        break;

      case CreateAssemblyFormatterConfigurationResult.NoWorkspace:
        vscode.window.showInformationMessage('Open a workspace to add a configuration file.');
        break;

      case CreateAssemblyFormatterConfigurationResult.Error:
        vscode.window.showErrorMessage(`Error creating configuration file: ${fileNameOrError}.`);
        break;
    }
  });

  context.subscriptions.push(command);
}
