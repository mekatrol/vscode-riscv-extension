import { AssemblyToken, AssemblyTokenType, AssemblyTokeniser } from './assembly-tokeniser';
import { AssemblyFormatterConfiguration, IndentableConfiguration } from './assembly-formatter-configuration';
import { getCombinedInstructions } from '../riscv/instructions';

export class AssemblyFormatter {
  private configuration?: AssemblyFormatterConfiguration;
  private tokeniser?: AssemblyTokeniser;
  private document: string = '';
  private eol: string = '\r\n';

  public formatDocument = (document: string, configuration: AssemblyFormatterConfiguration, eol: string): string => {
    this.configuration = configuration;
    this.tokeniser = new AssemblyTokeniser(
      document,
      this.configuration.tabs.tabWidth,
      configuration.commentCharacter ?? '#',
      getCombinedInstructions(configuration.instruction.supportedInstructionSets)
    );
    this.document = '';
    this.eol = eol;

    while (this.tokeniser.hasMore()) {
      const tokens = this.tokeniser.nextLine();
      let primaryType = this.getPrimaryToken(tokens);

      let line = '';

      do {
        switch (primaryType) {
          case AssemblyTokenType.Newline:
            // Add any line data and reset line
            this.document += line.trimEnd();
            line = '';

            // Add end of line character to end
            this.document += this.eol;
            break;

          case AssemblyTokenType.Space:
            // Do nothing for empty whitespace other than pop token
            tokens.shift();
            break;

          case AssemblyTokenType.Directive:
            line += this.processDirective(tokens);
            break;

          case AssemblyTokenType.Label:
            // Need to scope as block contains tuple which cannot be directly in switch statement
            {
              const [labelLine, addEol] = this.processLabel(tokens);

              // Add label line to line
              line += labelLine;

              // If add EOL flagged for label then add EOL and reset line
              if (addEol) {
                this.document += line.trimEnd();
                line = '';

                // Add end of line character to end
                this.document += this.eol;
              }
            }
            break;

          case AssemblyTokenType.LocalLabel:
            // Need to scope as block contains tuple which cannot be directly in switch statement
            {
              const [labelLine, addEol] = this.processLocalLabel(tokens);

              // Add label line to line
              line += labelLine;

              // If add EOL flagged for label then add EOL and reset line
              if (addEol) {
                this.document += line.trimEnd();
                line = '';

                // Add end of line character to end
                this.document += this.eol;
              }
            }
            break;

          case AssemblyTokenType.Value:
            line += this.processValue(tokens);
            break;

          case AssemblyTokenType.Instruction:
            line += this.processInstruction(tokens);
            break;

          case AssemblyTokenType.Comment:
            line += this.processCommentOnlyLine(tokens);
            break;

          case AssemblyTokenType.CCommentBlock:
            line += this.processCCommentBlock(tokens);
            break;

          default:
            while (tokens.length) {
              const token = tokens.shift()!;
              line += token.value;
            }
            break;
        }

        // Update primary token
        primaryType = this.getPrimaryToken(tokens);
      } while (tokens.length);

      // Trim whitespace from end and add EOL
      line = line.trimEnd() + eol;

      // Add line and trim any whitespace at end of line
      this.document += line;
    }

    this.document = this.document.trimEnd();

    if (this.configuration.endOfFileHasBlankLine) {
      this.document += eol;
    }

    return this.document;
  };

  private getPrimaryToken = (tokens: AssemblyToken[]): AssemblyTokenType => {
    if (tokens.length === 0) {
      // If there are no tokens then return unknown
      return AssemblyTokenType.Unknown;
    }

    // Get all tokens that are not space
    let nonSpace = tokens.filter((t) => t.type !== AssemblyTokenType.Space);

    // Nothing but spaces?
    if (nonSpace.length === 0) {
      // Line is all spaces
      return AssemblyTokenType.Space;
    }

    return nonSpace[0].type;
  };

  private processCommentOnlyLine = (tokens: AssemblyToken[]): string => {
    const startColumn = this.configuration?.commentOnlyLineColumn;
    let line = '';

    // In reality a comment only line should only ever have 1 or 2 tokens:
    // * 1 token if the comment starts at column 1
    // * 2 tokens is there is a space token before the comment token

    let token = tokens.shift();

    if (!token) {
      return line;
    }

    if (token.type === AssemblyTokenType.Space) {
      // Only add spaces if primary token does not start at column 1
      if (startColumn !== 1) {
        line += this.getSpacesToColumn(startColumn, line.length, token.value);
      }

      token = tokens.shift();

      if (!token) {
        return line;
      }
    } else if (startColumn && startColumn > 1) {
      // There was no whitespace at beginning of line so insert 'startColumn' spaces
      line += this.getSpacesToColumn(startColumn, line.length, '');
    }

    // Add comment to line
    line += token.value;

    return line;
  };

  private processSpace = (spaces: string): string => {
    const tabWidth = this.configuration!.tabs.tabWidth;
    const replaceTabs = this.configuration!.tabs.replaceTabsWithSpaces;

    let line = '';

    // Enumerate characters in spaces
    spaces.split('').forEach((c) => {
      // If is white space or if not replacing tabs then just append as is
      if (c === ' ' || !replaceTabs) {
        line += c;
      } else {
        // Replace tab character with spaces to specified tab width
        line += ''.padEnd(tabWidth, ' ');
      }
    });

    return line;
  };

  private processIndentable = (tokens: AssemblyToken[], primaryTokenType: AssemblyTokenType, indenting: IndentableConfiguration, primaryOnOwnLine: boolean = false): string => {
    const startColumn = indenting.primaryColumn ?? 0;
    const dataColumn = indenting.dataColumn ?? 0;
    const commentColumn = indenting.commentColumn ?? 0;

    let line = '';

    // Pop next token
    let token = tokens.shift();

    if (!token) {
      throw Error(`At least one token must be provided when processing '${primaryTokenType}'`);
    }

    if (token.type === AssemblyTokenType.Space) {
      // Only add spaces if primary token does not start at column 1
      if (startColumn !== 1) {
        line += this.getSpacesToColumn(startColumn, line.length, token.value);
      }

      // Pop next token
      token = tokens.shift();
    } else if (startColumn > 0) {
      // There was no whitespace at beginning of line so insert 'startColumn' spaces
      line += this.getSpacesToColumn(startColumn, line.length, '');
    }

    if (!token) {
      throw Error(`'${primaryTokenType}' token missing`);
    }

    if (token.type !== primaryTokenType) {
      throw Error(`Unexpected token type '${token.type}' when processing '${primaryTokenType}'`);
    }

    // Add primary token value
    line += token.value;

    // Special case for when primary token can be on on line (e.g. LABEL)
    if (primaryOnOwnLine) {
      // Even though primary can be on its own line, that is only needed when the remaining tokens
      // are not just space and comments (ie spaces and comments can follow primary tokens on their own line)
      // it is for when other primary tokens follow the label, eg an instruction following a label, e.g.:
      // LABEL_1: li t0,0x40
      const nextPrimaryTokenForLine = this.getPrimaryToken(tokens);

      if (nextPrimaryTokenForLine !== undefined && nextPrimaryTokenForLine !== AssemblyTokenType.Space && nextPrimaryTokenForLine != AssemblyTokenType.Comment) {
        return line;
      }
    }

    // Pop next token
    token = tokens.shift();

    // No more tokens so return line so far
    if (!token) {
      return line;
    }

    // There should be a space after the primary token
    if (token.type === AssemblyTokenType.Space) {
      // Add spaces
      line += this.getSpacesToColumn(dataColumn, line.length, token.value);

      // Pop next token
      token = tokens.shift();
    }

    if (!token) {
      // No more tokens so return line so far
      return line;
    }

    // Just append all remaining tokens
    do {
      if (token.type === AssemblyTokenType.Space) {
        line += this.processSpace(token.value);
      } else if (token.type === AssemblyTokenType.Comment) {
        if (commentColumn) {
          // Trim end of line in case space already added
          line = line.trimEnd();

          // Pad to column number
          line += this.getSpacesToColumn(commentColumn, line.length, ' ');
        }

        line += token.value;
      } else {
        // Just append token value
        line += token.value;
      }

      // Pop next token
      token = tokens.shift();
    } while (token);

    // Return line
    return line;
  };

  private processCCommentBlock = (tokens: AssemblyToken[]): string => {
    // Get next token in array
    const token = tokens.shift();

    // This should not happen, but just in case handle as empty token value (empty string)
    if (!token) {
      return '';
    }

    // Replace any EOL characters with the EOL from config
    const line = token.value.replace(/\r\n|\n|\r/g, this.eol);

    // Return the token value
    return line;
  };

  private processInstruction = (tokens: AssemblyToken[]): string => {
    return this.processIndentable(tokens, AssemblyTokenType.Instruction, this.configuration!.instruction);
  };

  private processDirective = (tokens: AssemblyToken[]): string => {
    return this.processIndentable(tokens, AssemblyTokenType.Directive, this.configuration!.directive);
  };

  private processValue = (tokens: AssemblyToken[]): string => {
    return this.processIndentable(tokens, AssemblyTokenType.Value, this.configuration!.value);
  };

  private processLabel = (tokens: AssemblyToken[]): [string, boolean] => {
    const ownLine = !!this.configuration?.label.hasOwnLine;
    return [this.processIndentable(tokens, AssemblyTokenType.Label, this.configuration!.label, ownLine), ownLine && tokens.length > 0];
  };

  private processLocalLabel = (tokens: AssemblyToken[]): [string, boolean] => {
    const ownLine = !!this.configuration?.label.hasOwnLine;
    return [this.processIndentable(tokens, AssemblyTokenType.LocalLabel, this.configuration!.localLabel, ownLine), ownLine && tokens.length > 0];
  };

  private getSpacesToColumn = (desiredColumn: number | undefined, currentLineLength: number, spaces: string): string => {
    if (!desiredColumn) {
      // If no desired column specified then we just return processed spaces
      return this.processSpace(spaces);
    }

    // Add spaces up to desiredColumn
    // Note: lengths start at index 0 whereas columns start at column 1
    //       so we need to adjust the column by - 1 to shift it to zero based indexes
    //       when calculating padding length
    // For example:
    //   If currentLength === 0 && desiredColumn ===  5 then we insert 4 spaces ( 5 - 1 -  0)
    //   If currentLength === 1 && desiredColumn === 20 then we insert 9 spaces (20 - 1 - 10)
    let paddingLength = desiredColumn - 1 - currentLineLength;

    if (paddingLength <= 0) {
      // We need a minimum of 1 space unless desired column is 1 then we need a minimum of zero.
      // This happens if currentColumn >= desiredColumn
      paddingLength = desiredColumn === 1 ? 0 : 1;
    }

    // Return length number of spaces
    return ''.padEnd(paddingLength, ' ');
  };
}
