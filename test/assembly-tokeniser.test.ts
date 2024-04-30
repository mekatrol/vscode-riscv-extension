import { expect, test, describe } from '@jest/globals';
import { AssemblyToken, AssemblyTokenType, AssemblyTokeniser } from '../src/formatter/assembly-tokeniser';
import { testFileContent } from './test-file-content';
import { InstructionSet, getCombinedInstructions } from '../src/riscv/instructions';

test('Empty content returns undefined token', () => {
  const tokeniser = new AssemblyTokeniser('', 2, '#', getCombinedInstructions([InstructionSet.R32I, InstructionSet.Pseudo]));
  const token = tokeniser.nextToken();

  expect(token).toBe(undefined);
});

test('Whitespace content returns whitespace token followed by undefined token', () => {
  const tokeniser = new AssemblyTokeniser('    ', 2, '#', getCombinedInstructions([InstructionSet.R32I, InstructionSet.Pseudo]));
  let token = tokeniser.nextToken();
  expect(token).not.toEqual(undefined);
  expect(token?.type).toBe(AssemblyTokenType.Space);
  expect(token!.lineNumber).toBe(1);
  expect(token!.columnNumber).toBe(1);
  expect(token!.value).toBe('    ');

  token = tokeniser.nextToken();
  expect(token).toBe(undefined);
});

test('Whitespace content returns whitespace token followed by new line', () => {
  const tokeniser = new AssemblyTokeniser('    \n', 2, '#', getCombinedInstructions([InstructionSet.R32I, InstructionSet.Pseudo]));
  let token = tokeniser.nextToken();
  expect(token).not.toEqual(undefined);
  expect(token?.type).toBe(AssemblyTokenType.Space);
  expect(token!.lineNumber).toBe(1);
  expect(token!.columnNumber).toBe(1);
  expect(token!.value).toBe('    ');

  token = tokeniser.nextToken();
  expect(token).not.toEqual(undefined);
  expect(token?.type).toBe(AssemblyTokenType.Newline);
  expect(token!.lineNumber).toBe(1);
  expect(token!.columnNumber).toBe(5);
  expect(token!.value).toBe('\n');

  token = tokeniser.nextToken();
  expect(token).toBe(undefined);
});

describe('newline', () => {
  test('\n', () => {
    const tokeniser = new AssemblyTokeniser('\n', 2, '#', getCombinedInstructions([InstructionSet.R32I, InstructionSet.Pseudo]));
    let token = tokeniser.nextToken();
    expect(token).not.toEqual(undefined);
    expect(token?.type).toBe(AssemblyTokenType.Newline);
    expect(token!.lineNumber).toBe(1);
    expect(token!.columnNumber).toBe(1);
    expect(token!.value).toBe('\n');

    token = tokeniser.nextToken();
    expect(token).toBe(undefined);
  });

  test('\r', () => {
    const tokeniser = new AssemblyTokeniser('\r', 2, '#', getCombinedInstructions([InstructionSet.R32I, InstructionSet.Pseudo]));
    let token = tokeniser.nextToken();
    expect(token).not.toEqual(undefined);
    expect(token?.type).toBe(AssemblyTokenType.Newline);
    expect(token!.lineNumber).toBe(1);
    expect(token!.columnNumber).toBe(1);
    expect(token!.value).toBe('\r');

    token = tokeniser.nextToken();
    expect(token).toBe(undefined);
  });

  test('\r\n', () => {
    const tokeniser = new AssemblyTokeniser('\r\n', 2, '#', getCombinedInstructions([InstructionSet.R32I, InstructionSet.Pseudo]));
    let token = tokeniser.nextToken();
    expect(token).not.toEqual(undefined);
    expect(token?.type).toBe(AssemblyTokenType.Newline);
    expect(token!.lineNumber).toBe(1);
    expect(token!.columnNumber).toBe(1);
    expect(token!.value).toBe('\r\n');

    token = tokeniser.nextToken();
    expect(token).toBe(undefined);
  });
});

test('li', () => {
  const tokeniser = new AssemblyTokeniser('li', 2, '#', getCombinedInstructions([InstructionSet.R32I, InstructionSet.Pseudo]));
  let token = tokeniser.nextToken();
  expect(token).not.toEqual(undefined);
  expect(token?.type).toBe(AssemblyTokenType.Instruction);
  expect(token!.lineNumber).toBe(1);
  expect(token!.columnNumber).toBe(1);
  expect(token!.value).toBe('li');

  token = tokeniser.nextToken();
  expect(token).toBe(undefined);
});

test('li\ta0,R32_GPIOD_CFGLR # This is the comment', () => {
  const tokeniser = new AssemblyTokeniser('li\ta0,R32_GPIOD_CFGLR # This is the comment', 1, '#', getCombinedInstructions([InstructionSet.R32I, InstructionSet.Pseudo]));
  let token = tokeniser.nextToken();
  expect(token).not.toEqual(undefined);
  expect(token?.type).toBe(AssemblyTokenType.Instruction);
  expect(token!.lineNumber).toBe(1);
  expect(token!.columnNumber).toBe(1);
  expect(token!.value).toBe('li');

  token = tokeniser.nextToken();
  expect(token).not.toEqual(undefined);
  expect(token?.type).toBe(AssemblyTokenType.Space);
  expect(token!.lineNumber).toBe(1);
  expect(token!.columnNumber).toBe(3);
  expect(token!.value).toBe('\t');

  token = tokeniser.nextToken();
  expect(token).not.toEqual(undefined);
  expect(token?.type).toBe(AssemblyTokenType.Value);
  expect(token!.lineNumber).toBe(1);
  expect(token!.columnNumber).toBe(4);
  expect(token!.value).toBe('a0,R32_GPIOD_CFGLR');

  token = tokeniser.nextToken();
  expect(token).not.toEqual(undefined);
  expect(token?.type).toBe(AssemblyTokenType.Space);
  expect(token!.lineNumber).toBe(1);
  expect(token!.columnNumber).toBe(22);
  expect(token!.value).toBe(' ');

  token = tokeniser.nextToken();
  expect(token).not.toEqual(undefined);
  expect(token?.type).toBe(AssemblyTokenType.Comment);
  expect(token!.lineNumber).toBe(1);
  expect(token!.columnNumber).toBe(23);
  expect(token!.value).toBe('# This is the comment');

  token = tokeniser.nextToken();
  expect(token).toBe(undefined);
});

describe('labels', () => {
  test('li:', () => {
    const tokeniser = new AssemblyTokeniser('li:', 2, '#', getCombinedInstructions([InstructionSet.R32I, InstructionSet.Pseudo]));
    let token = tokeniser.nextToken();
    expect(token).not.toEqual(undefined);
    expect(token?.type).toBe(AssemblyTokenType.Label);
    expect(token!.lineNumber).toBe(1);
    expect(token!.columnNumber).toBe(1);
    expect(token!.value).toBe('li:');

    token = tokeniser.nextToken();
    expect(token).toBe(undefined);
  });

  test('li_:', () => {
    const tokeniser = new AssemblyTokeniser('li_:', 2, '#', getCombinedInstructions([InstructionSet.R32I, InstructionSet.Pseudo]));
    let token = tokeniser.nextToken();
    expect(token).not.toEqual(undefined);
    expect(token?.type).toBe(AssemblyTokenType.Label);
    expect(token!.lineNumber).toBe(1);
    expect(token!.columnNumber).toBe(1);
    expect(token!.value).toBe('li_:');

    token = tokeniser.nextToken();
    expect(token).toBe(undefined);
  });

  test('li3:', () => {
    const tokeniser = new AssemblyTokeniser('li3:', 2, '#', getCombinedInstructions([InstructionSet.R32I, InstructionSet.Pseudo]));
    let token = tokeniser.nextToken();
    expect(token).not.toEqual(undefined);
    expect(token?.type).toBe(AssemblyTokenType.Label);
    expect(token!.lineNumber).toBe(1);
    expect(token!.columnNumber).toBe(1);
    expect(token!.value).toBe('li3:');

    token = tokeniser.nextToken();
    expect(token).toBe(undefined);
  });

  test('li_2:', () => {
    const tokeniser = new AssemblyTokeniser('li_2:', 2, '#', getCombinedInstructions([InstructionSet.R32I, InstructionSet.Pseudo]));
    let token = tokeniser.nextToken();
    expect(token).not.toEqual(undefined);
    expect(token?.type).toBe(AssemblyTokenType.Label);
    expect(token!.lineNumber).toBe(1);
    expect(token!.columnNumber).toBe(1);
    expect(token!.value).toBe('li_2:');

    token = tokeniser.nextToken();
    expect(token).toBe(undefined);
  });

  test('_li:', () => {
    const tokeniser = new AssemblyTokeniser('_li:', 2, '#', getCombinedInstructions([InstructionSet.R32I, InstructionSet.Pseudo]));
    let token = tokeniser.nextToken();
    expect(token).not.toEqual(undefined);
    expect(token?.type).toBe(AssemblyTokenType.Label);
    expect(token!.lineNumber).toBe(1);
    expect(token!.columnNumber).toBe(1);
    expect(token!.value).toBe('_li:');

    token = tokeniser.nextToken();
    expect(token).toBe(undefined);
  });

  test('1_li:', () => {
    const tokeniser = new AssemblyTokeniser('1_li:', 2, '#', getCombinedInstructions([InstructionSet.R32I, InstructionSet.Pseudo]));
    let token = tokeniser.nextToken();
    expect(token).not.toEqual(undefined);
    expect(token?.type).not.toBe(AssemblyTokenType.Label);
  });
});

test('fileContent', () => {
  const tokeniser = new AssemblyTokeniser(testFileContent, 2, '#', getCombinedInstructions([InstructionSet.R32I, InstructionSet.Pseudo]));

  const expectedLineTokens: AssemblyToken[][] = [
    [],
    [
      {
        lineNumber: 2,
        columnNumber: 1,
        type: AssemblyTokenType.Comment,
        value: '# The "ax",@progbits tells the assembler that the section is allocatable ("a"), executable ("x") and contains data ("@progbits").'
      }
    ],
    [
      {
        lineNumber: 3,
        columnNumber: 1,
        type: AssemblyTokenType.Space,
        value: '	'
      },
      {
        lineNumber: 3,
        columnNumber: 3,
        type: AssemblyTokenType.Directive,
        value: '.section'
      },
      {
        lineNumber: 3,
        columnNumber: 11,
        type: AssemblyTokenType.Space,
        value: '             '
      },
      {
        lineNumber: 3,
        columnNumber: 24,
        type: AssemblyTokenType.Directive,
        value: '.init'
      },
      {
        lineNumber: 3,
        columnNumber: 29,
        type: AssemblyTokenType.Value,
        value: ','
      },
      {
        lineNumber: 3,
        columnNumber: 30,
        type: AssemblyTokenType.Space,
        value: ' '
      },
      {
        lineNumber: 3,
        columnNumber: 31,
        type: AssemblyTokenType.String,
        value: '"ax"'
      },
      {
        lineNumber: 3,
        columnNumber: 35,
        type: AssemblyTokenType.Value,
        value: ','
      },
      {
        lineNumber: 3,
        columnNumber: 36,
        type: AssemblyTokenType.Space,
        value: ' '
      },
      {
        lineNumber: 3,
        columnNumber: 37,
        type: AssemblyTokenType.Value,
        value: '@progbits'
      }
    ]
  ];

  let expectedLineNumber = 1;

  while (tokeniser.hasMore()) {
    if (expectedLineNumber <= expectedLineTokens.length) {
      // Only process as many lines as there are expected lines
      const expectedTokens = expectedLineTokens[expectedLineNumber - 1];

      const lineTokens = tokeniser.nextLine();
      expect(lineTokens).not.toEqual(undefined);
      expect(lineTokens.length).toEqual(expectedTokens.length);

      for (let i = 0; i < lineTokens.length; i++) {
        expect(lineTokens[i]).toEqual(expectedTokens[i]);
      }
    } else {
      // Just pull next line of tokens and continue
      tokeniser.nextLine();
    }

    expectedLineNumber++;
  }
});
