import * as vscode from 'vscode';
import { EOL } from 'node:os';
import { AssemblyFormatter } from './formatter/assembly-formatter';
import { CreateAssemblyFormatterConfigurationResult, createDefaultConfiguration, loadConfiguration } from './formatter/assembly-formatter-configuration';

// Called when extension is activated
export async function activate(context: vscode.ExtensionContext): Promise<void> {
  // Register the formatter
  vscode.languages.registerDocumentFormattingEditProvider('assembly', {
    async provideDocumentFormattingEdits(document: vscode.TextDocument): Promise<vscode.TextEdit[]> {
      const content = new AssemblyFormatter().formatDocument(document.getText(), await loadConfiguration(), getEol());

      // Get range of entire document
      const firstLine = document.lineAt(0);
      const lastLine = document.lineAt(document.lineCount - 1);
      const textRange = new vscode.Range(firstLine.range.start, lastLine.range.end);

      // Replace entire document
      return [vscode.TextEdit.replace(textRange, content)];
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

const getEol = (): string => {
  // Get root configuration
  const rootConfig = vscode.workspace.getConfiguration('');

  // Get end of line configuration setting
  const eol = rootConfig.get<string>('files.eol');

  // If not defined or set to auto then just return the OS EOL, else return the configured EOL
  return !eol || eol === 'auto' ? EOL : eol;
};
