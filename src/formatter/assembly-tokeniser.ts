export enum AssemblyTokenType {
  Comment = 'Comment',
  Directive = 'Directive',
  Label = 'Label',
  Newline = 'Newline',
  Space = 'Space',
  String = 'String',
  Unknown = 'Unknown',
  Value = 'Value'
}

// Token matching expressions for each AssemblyTokenType
// NOTES:
//    1. the group names must match the values in the enum AssemblyTokenType
//    2. the groups names are processed in order of definition (top to bottom)
const reTokens = [
  /(?<Comment>^#.*)/,
  /(?<Directive>^\.[A-Za-z_][A-Za-z0-9_]*)/,
  /(?<Label>^[A-Za-z_][A-Za-z0-9_]*:)/,
  /(?<Newline>^\r\n|^\n|^\r)/,
  /(?<Space>^[ \t]+)/,
  /(?<String>".*?")/,
  /(?<Value>^[^# \t\r\n:]+)/,

  // This must be last match as it matches anything
  /(?<Unknown>(^.+)($|\n|\r))/
];

// Create distinct set of flags
const reTokenFlags = reTokens
  .map((t) => t.flags)
  .join('') // Join all as single string
  .split('') // Split into individual characters
  .sort() // Sort alphabetically
  .join('') // Rejoin characters
  .replace(/(.)(?=.*\1)/g, ''); // Make letters distinct (remove repeated characters)

// Join all source values with or '|' operator
const reTokenSource = reTokens.map((t) => t.source).join('|');

// Construct the joined expression
const reToken = new RegExp(reTokenSource, reTokenFlags);

export interface AssemblyToken {
  lineNumber: number;
  columnNumber: number;
  token: string;
  type: AssemblyTokenType;
}

export class AssemblyTokeniser {
  private content: string;
  private lineNumber: number;
  private columnNumber: number;
  private contentOffset: number;

  constructor(content: string) {
    this.content = content;
    this.lineNumber = 1;
    this.columnNumber = 1;
    this.contentOffset = 0;
  }

  public hasMore = (): boolean => {
    return this.contentOffset < this.content.length;
  };

  public getLineNumber = (): number => {
    return this.lineNumber;
  };

  public getColumnNumber = (): number => {
    return this.columnNumber;
  };

  public nextToken = (): AssemblyToken | undefined => {
    // If all content tokenised then return undefined
    if (!this.hasMore()) {
      return undefined;
    }

    // Get content remaining
    const remainingContent = this.content.substring(this.contentOffset);

    // Regex next token
    const groups = reToken.exec(remainingContent)?.groups;

    // If there are no groups then return the rest of the content
    // as an unknown token
    if (!groups) {
      // Remainder is unknown token
      return this.createTokenAndAdvance(remainingContent, AssemblyTokenType.Unknown);
    }

    // Look for the first matching group that is not undefined
    for (let key in groups) {
      let value = groups[key];

      if (value != undefined) {
        // It is assumed that only one group in regex will match, therefore first found group is correct one to return
        return this.createTokenAndAdvance(value, AssemblyTokenType[key as keyof typeof AssemblyTokenType]);
      }
    }

    // Remainder of line is unknown token
    return this.createTokenAndAdvance(remainingContent, AssemblyTokenType.Unknown);
  };

  private createTokenAndAdvance = (tokenValue: string, type: AssemblyTokenType): AssemblyToken => {
    const token = {
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      token: tokenValue,
      type: type
    } as AssemblyToken;

    // Get length of token
    const tokenLength = tokenValue.length;

    if (token.type === AssemblyTokenType.Newline) {
      // Advance line
      this.lineNumber++;
      this.columnNumber = 1;
    } else {
      // Advance column
      this.columnNumber += tokenLength;
    }

    // Advance content offset
    this.contentOffset += tokenLength;

    return token;
  };
}
