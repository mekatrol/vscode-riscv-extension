export enum AssemblyTokenType {
  Comment = 'Comment',
  Label = 'Label',
  NewLine = 'NewLine',
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
    const groups = /(?<space>^[ \t]+)|(?<comment>^#.*$)|(?<newline>\r\n|\n|\r)|(?<value>[^# \t]+)|(?<unknown>(^.+$))/.exec(remainingContent)?.groups;

    // If there are no groups then return the rest of the content
    // as an unknown token
    if (!groups) {
      // Remainder is unknown token
      return this.advanceToken(remainingContent, AssemblyTokenType.Unknown);
    }

    if (groups['space'] != undefined) {
      return this.advanceToken(groups['space'], AssemblyTokenType.Space);
    }

    if (groups['newline'] != undefined) {
      return this.advanceToken(groups['newline'], AssemblyTokenType.NewLine);
    }

    if (groups['value'] != undefined) {
      return this.advanceToken(groups['value'], AssemblyTokenType.Value);
    }

    if (groups['comment'] != undefined) {
      return this.advanceToken(groups['comment'], AssemblyTokenType.Comment);
    }

    if (groups['unknown'] != undefined) {
      return this.advanceToken(groups['unknown'], AssemblyTokenType.Unknown);
    }

    // Remainder is unknown token
    return this.advanceToken(remainingContent, AssemblyTokenType.Unknown);
  };

  private advanceToken = (tokenValue: string, type: AssemblyTokenType): AssemblyToken => {
    const token = {
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      token: tokenValue,
      type: type
    } as AssemblyToken;

    // Get length of token
    const tokenLength = tokenValue.length;

    // Advance column
    this.columnNumber += tokenLength;

    // Advance content offset
    this.contentOffset += tokenLength;

    return token;
  };
}
