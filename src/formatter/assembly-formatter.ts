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

    return document;
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
        this.document += c;
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

    let token = tokens.shift();

    if (!token) {
      throw Error('At least one token must be provided to processDirective');
    }

    if (token.type === AssemblyTokenType.Space) {
      // Add spaces
      line += this.getSpacesToColumn(directiveColumn, line.length, token.value);

      // Remove token from set
      token = tokens.shift();
    }

    if (!token) {
      throw Error('Directive token missing');
    }

    if (token.type !== AssemblyTokenType.Directive) {
      throw Error(`Unexpected token type '${token.type}' when processing directive`);
    }

    // Add value
    line += token.value;

    token = tokens.shift();

    // No more tokens so return line so far
    if (!token) {
      return line;
    }

    // There must be a space after the directive
    if (token.type === AssemblyTokenType.Space) {
      // Add spaces
      line += this.getSpacesToColumn(directiveDataColumn, line.length, token.value);

      // Remove token from set
      token = tokens.shift();
    }

    // No more tokens so return line so far
    if (!token) {
      return line;
    }

    do {
      // Just append token value
      line += token.value;

      token = tokens.shift();
    } while (token);

    return line;
  };

  private getSpacesToColumn = (desiredColumn: number | undefined, currentColumn: number, spaces: string): string => {
    if (!desiredColumn) {
      // If no desired column specified then we just return processed spaces
      return this.processSpace(spaces);
    }

    // Add spaces up to desiredColumn
    let length = desiredColumn - currentColumn;

    if (length <= 0) {
      // We need a minimum of 1 space. This happens if currentColumn >= desiredColumn
      length = 1;
    }

    // Return length number of spaces
    return ''.padEnd(length, ' ');
  };
}
