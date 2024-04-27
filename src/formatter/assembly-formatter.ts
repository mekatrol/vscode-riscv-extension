import { AssemblyToken, AssemblyTokenType, AssemblyTokeniser } from './assembly-tokeniser';
import { AssemblyFormatterConfiguration } from './assembly-formatter-configuration';

export class AssemblyFormatter {
  private configuration?: AssemblyFormatterConfiguration;
  private tokeniser?: AssemblyTokeniser;
  private document: string = '';
  private eol: string = '\r\n';

  public formatDocument = (document: string, configuration: AssemblyFormatterConfiguration, eol: string): string => {
    this.configuration = configuration;
    this.tokeniser = new AssemblyTokeniser(document, this.configuration.tabWidth);
    this.document = '';
    this.eol = eol;

    while (this.tokeniser.hasMore()) {
      const tokens = this.tokeniser.nextLine();
      const primaryType = this.getPrimaryToken(tokens);

      do {
        switch (primaryType) {
          case AssemblyTokenType.Newline:
            // Add a new line
            this.document += this.eol;
            break;

          case AssemblyTokenType.Space:
            // Do nothing for empty whitespace
            break;

          case AssemblyTokenType.Directive:
            this.document += this.processDirective(tokens);
            break;

          default:
            while (tokens.length) {
              tokens.shift();
            }
            break;
        }
      } while (tokens.length);
    }

    return this.document;
  };

  private getPrimaryToken = (tokens: AssemblyToken[]): AssemblyTokenType => {
    if (tokens.length === 0) {
      // If there are no tokens then this is an empty line
      return AssemblyTokenType.Newline;
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

  private processSpace = (spaces: string): string => {
    const tabWidth = this.configuration!.tabWidth;
    const replaceTabs = this.configuration!.replaceTabsWithSpaces;

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

  private processDirective = (tokens: AssemblyToken[]): string => {
    const directiveColumn = this.configuration!.directiveColumn;
    const directiveDataColumn = this.configuration!.directiveDataColumn;

    let line = '';

    // Pop next token
    let token = tokens.shift();

    if (!token) {
      throw Error('At least one token must be provided to processDirective');
    }

    if (token.type === AssemblyTokenType.Space) {
      // Add spaces
      line += this.getSpacesToColumn(directiveColumn, line.length, token.value);

      // Pop next token
      token = tokens.shift();
    }

    if (!token) {
      throw Error('Directive token missing');
    }

    if (token.type !== AssemblyTokenType.Directive) {
      throw Error(`Unexpected token type '${token.type}' when processing directive`);
    }

    // Add section directive value (eg .section, .bss, .data)
    line += token.value;

    // Pop next token
    token = tokens.shift();

    // No more tokens so return line so far
    if (!token) {
      return line;
    }

    // There must be a space after the directive
    if (token.type === AssemblyTokenType.Space) {
      // Add spaces
      line += this.getSpacesToColumn(directiveDataColumn, line.length, token.value);

      // Pop next token
      token = tokens.shift();
    }

    // No more tokens so return line so far
    if (!token) {
      return line;
    }

    // Just append all remaining tokens
    do {
      if (token.type === AssemblyTokenType.Space) {
        line += this.processSpace(token.value);
      } else if (token.type === AssemblyTokenType.Comment) {
        // TODO: maybe space comment at certain column?
        // Just append comment
        line += token.value;
      } else {
        // Just append token value
        line += token.value;
      }

      // Pop next token
      token = tokens.shift();
    } while (token);

    return line;
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
      // We need a minimum of 1 space. This happens if currentColumn >= desiredColumn
      paddingLength = 1;
    }

    // Return length number of spaces
    return ''.padEnd(paddingLength, ' ');
  };
}
