import { joinRegexAsOr } from '../utils/regex';
import { defaultTabWidth } from './constants';

export enum AssemblyTokenType {
  Comment = 'Comment',
  Directive = 'Directive',
  Instruction = 'Instruction',
  Label = 'Label',
  LocalLabel = 'LocalLabel',
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
const reCommentHash = /(?<Comment>^#.*)/;
const reCommentSemicolon = /(?<Comment>^;.*)/;
const reDirective = /^(?<Directive>\.[A-Za-z_][A-Za-z0-9_]*)(?!.*:\s*)/
const reLocalLabel = /(?<LocalLabel>^[0-9]+:)/;
const reLabel = /(?<Label>^[$A-Za-z_][$A-Za-z0-9_]*:)/;
const reNewLine = /(?<Newline>^\r\n|^\n|^\r)/;
const reSpace = /(?<Space>^[ \t]+)/;
const reString = /(?<String>".*?")/;
const reValueNotHashComment = /(?<Value>^[^# \t\r\n:]+)/;
const reValueNotSemicolonComment = /(?<Value>^[^; \t\r\n:]+)/;

// This must be last match as it matches anything
const reUnknown = /(?<Unknown>(^.+)($|\n|\r))/;

export interface AssemblyToken {
  lineNumber: number;
  columnNumber: number;
  value: string;
  type: AssemblyTokenType;
}

export class AssemblyTokeniser {
  private content: string;
  private lineNumber: number;
  private columnNumber: number;
  private contentOffset: number;
  private tabWidth: number;
  private instructions: string[];
  private commentCharacter: string;
  private reTokens: RegExp;

  constructor(content: string, tabWidth: number, commentCharacter: string, instructions: string[]) {
    this.content = content;
    this.lineNumber = 1;
    this.columnNumber = 1;
    this.contentOffset = 0;
    this.tabWidth = isNaN(tabWidth) || tabWidth < 1 ? defaultTabWidth : tabWidth; // Make sure a valid value
    this.instructions = instructions;
    this.commentCharacter = commentCharacter;

    let re: RegExp[] = [];

    if (this.commentCharacter === ';') {
      re = [reDirective, reLabel, reLocalLabel, reNewLine, reCommentSemicolon, reSpace, reString, reValueNotSemicolonComment, reUnknown];
    } else {
      re = [reDirective, reLabel, reLocalLabel, reNewLine, reCommentHash, reSpace, reString, reValueNotHashComment, reUnknown];
    }

    this.reTokens = joinRegexAsOr(re);
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

  public nextLine = (): AssemblyToken[] => {
    const lineTokens: AssemblyToken[] = [];

    // Enumerate tokens and add to token line until no more tokens or new line found
    while (this.hasMore()) {
      const token = this.nextToken();

      if (!token || token.type === AssemblyTokenType.Newline) {
        break;
      }

      lineTokens.push(token);
    }

    return lineTokens;
  };

  public nextToken = (): AssemblyToken | undefined => {
    // If all content tokenised then return undefined
    if (!this.hasMore()) {
      return undefined;
    }

    // Get content remaining
    const remainingContent = this.content.substring(this.contentOffset);

    // Regex next token
    const groups = this.reTokens.exec(remainingContent)?.groups;

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
        let tokenType = AssemblyTokenType[key as keyof typeof AssemblyTokenType];

        // If is a value then check to see if is an instruction
        if (tokenType === AssemblyTokenType.Value) {
          tokenType = this.checkIsInstruction(value, tokenType);
        }

        // It is assumed that only one group in regex will match, therefore first found group is correct one to return
        return this.createTokenAndAdvance(value, tokenType);
      }
    }

    // Remainder of line is unknown token
    return this.createTokenAndAdvance(remainingContent, AssemblyTokenType.Unknown);
  };

  private checkIsInstruction = (value: string, originalTokenType: AssemblyTokenType): AssemblyTokenType => {
    const matchingInstruction = this.instructions.filter((i) => i === value.toLowerCase());

    if (matchingInstruction.length === 0) {
      return originalTokenType;
    }

    return AssemblyTokenType.Instruction;
  };

  private createTokenAndAdvance = (tokenValue: string, type: AssemblyTokenType): AssemblyToken => {
    const token = {
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      value: tokenValue,
      type: type
    } as AssemblyToken;

    if (token.type === AssemblyTokenType.Newline) {
      // Advance line
      this.lineNumber++;
      this.columnNumber = 1;
    } else {
      // Advance column
      this.columnNumber += type === AssemblyTokenType.Space ? this.calculateSpaceLength(tokenValue) : tokenValue.length;
    }

    // Advance content offset
    this.contentOffset += tokenValue.length;

    return token;
  };

  private calculateSpaceLength = (tokenValue: string): number => {
    const chars = tokenValue.split('');

    let length = 0;

    chars.forEach((c) => (length += c == ' ' ? 1 : this.tabWidth));

    return length;
  };
}
