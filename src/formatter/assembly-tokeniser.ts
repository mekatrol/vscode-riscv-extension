export enum AssemblyTokenType {
  Comment = 'Comment',
  Label = 'Label',
  Newline = 'Newline',
  Space = 'Space',
  Unknown = 'Unknown',
  Value = 'Value'
}

export interface AssemblyToken {
  lineNumber: number;
  columnNumber: number;
  token: string;
  type: AssemblyTokenType;
}

// Token matching expressions
// NOTES:
//    1. the group names must match the values in the enum AssemblyTokenType
//    2. the order of precedence is left to right (earlier groups will match before later groups in regex)
const reToken = /(?<Space>^[ \t]+)|(?<Comment>^#.*$)|(?<Newline>\r\n|\n|\r)|(?<Label>[A-Za-z_][A-Za-z0-9_]*:)|(?<Value>[^# \t\r\n:]+)|(?<Unknown>(^.+$))/;

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

  public nextToken = (): AssemblyToken | undefined => {
    // If all content tokenised then return undefined
    if (this.contentOffset >= this.content.length) {
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
