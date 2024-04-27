import * as vscode from 'vscode';
import { AssemblyTokeniser } from './assembly-tokeniser';
import { AssemblyFormatterConfiguration } from './assembly-formatter-configuration';

interface BlockLines {
  text: string;
  original: vscode.TextLine;
}

export class AssemblyFormatter {
  private blockLines: BlockLines[] = [];
  private configuration?: AssemblyFormatterConfiguration;
  private tokeniser?: AssemblyTokeniser;

  formatDocument = (document: vscode.TextDocument, configuration: AssemblyFormatterConfiguration): vscode.TextEdit[] => {
    this.configuration = configuration;
    this.tokeniser = new AssemblyTokeniser(document.getText());

    // Clear line block
    this.blockLines = [];

    //Set of changes made to the document
    const changes: vscode.TextEdit[] = [];

    // Enumerate lines
    for (let lineNo = 0; lineNo < document.lineCount; lineNo++) {
      const line = document.lineAt(lineNo);
      const change = this.formatLine(line);

      // Was there a change?
      if (change !== undefined) {
        // Push the change to the set of changes
        changes.push(change);

        // Push this line to block
        this.blockLines.push({ text: change.newText, original: line });
      } else {
        // Push this line to block
        this.blockLines.push({ text: line.text, original: line });
      }

      // Process current block lines to determine if multiple line formatting needed
      this.processBlockLines(changes);
    }

    return changes;
  };

  formatLine = (line: vscode.TextLine): vscode.TextEdit | undefined => {
    // Get text from line
    let text = line.text;

    // Trim any lines that are only white space
    text = line.text.replace(/^[\s\t]+$/, '');

    // Trim any trailing spaces and tabs at line end
    text = line.text.replace(/[\s\t]+$/, '');

    // Replace line if modified
    return text != line.text ? vscode.TextEdit.replace(line.range, text) : undefined;
  };

  processBlockLines = (changes: vscode.TextEdit[]): void => {
    // True if the previous line was a comment
    let prevNonBlankLineIsComment = false;

    // Remove all lines up to and including this index
    let removeToIndex = -1;

    for (let i = 0; i < this.blockLines.length; i++) {
      const text = this.blockLines[i].text;

      // Previous steps have already trimmed empty lines, so can just check length === 0
      if (text.length === 0) {
        // Blank lines reset previous flags
        prevNonBlankLineIsComment = false;
        removeToIndex = i;
        continue;
      }

      // Check if is a comment only line
      if (this.isCommentLine(text)) {
        prevNonBlankLineIsComment = true;
        continue;
      }

      // If not previous comments then can remove lines up til this one from block
      if (!prevNonBlankLineIsComment) {
        removeToIndex = i;
        continue;
      }

      // There was a previous comment before this line so indent all previous lines to match this line
      const match = text.match(/^[\s\t]+/);

      if (match && match.length > 0) {
        const whitespace = match[0];

        for (let j = removeToIndex >= 0 ? removeToIndex : 0; j < i; j++) {
          changes.push(vscode.TextEdit.replace(this.blockLines[j].original.range, whitespace + this.blockLines[j].text));
        }
      }

      removeToIndex = i;
      prevNonBlankLineIsComment = false;
    }

    // Remove any lined that do not need to be processed any further
    if (removeToIndex >= 0) {
      this.blockLines = this.blockLines.splice(removeToIndex + 1);
    }
  };

  isCommentLine = (text: string): boolean => {
    return /^[\s\t]*#/.test(text);
  };
}
