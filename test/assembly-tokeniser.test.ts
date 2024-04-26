import { expect, test } from '@jest/globals';
import { AssemblyTokenType, AssemblyTokeniser } from '../src/formatter/assembly-tokeniser';

test('Empty content returns undefined token', () => {
  const tokeniser = new AssemblyTokeniser('');
  const token = tokeniser.nextToken();

  expect(token).toBe(undefined);
});

test('Whitespace content returns whitespace token followed by undefined token', () => {
  const tokeniser = new AssemblyTokeniser('    ');
  let token = tokeniser.nextToken();
  expect(token).not.toEqual(undefined);
  expect(token?.type).toBe(AssemblyTokenType.Space);
  expect(token!.lineNumber).toBe(1);
  expect(token!.columnNumber).toBe(1);
  expect(token!.token).toBe('    ');

  token = tokeniser.nextToken();
  expect(token).toBe(undefined);
});

test('Whitespace content returns whitespace token followed by new line', () => {
  const tokeniser = new AssemblyTokeniser('    \n');
  let token = tokeniser.nextToken();
  expect(token).not.toEqual(undefined);
  expect(token?.type).toBe(AssemblyTokenType.Space);
  expect(token!.lineNumber).toBe(1);
  expect(token!.columnNumber).toBe(1);
  expect(token!.token).toBe('    ');

  token = tokeniser.nextToken();
  expect(token).not.toEqual(undefined);
  expect(token?.type).toBe(AssemblyTokenType.NewLine);
  expect(token!.lineNumber).toBe(1);
  expect(token!.columnNumber).toBe(5);
  expect(token!.token).toBe('\n');

  token = tokeniser.nextToken();
  expect(token).toBe(undefined);
});

test('\n', () => {
  const tokeniser = new AssemblyTokeniser('\n');
  let token = tokeniser.nextToken();
  expect(token).not.toEqual(undefined);
  expect(token?.type).toBe(AssemblyTokenType.NewLine);
  expect(token!.lineNumber).toBe(1);
  expect(token!.columnNumber).toBe(1);
  expect(token!.token).toBe('\n');

  token = tokeniser.nextToken();
  expect(token).toBe(undefined);
});

test('\r', () => {
  const tokeniser = new AssemblyTokeniser('\r');
  let token = tokeniser.nextToken();
  expect(token).not.toEqual(undefined);
  expect(token?.type).toBe(AssemblyTokenType.NewLine);
  expect(token!.lineNumber).toBe(1);
  expect(token!.columnNumber).toBe(1);
  expect(token!.token).toBe('\r');

  token = tokeniser.nextToken();
  expect(token).toBe(undefined);
});

test('\r\n', () => {
  const tokeniser = new AssemblyTokeniser('\r\n');
  let token = tokeniser.nextToken();
  expect(token).not.toEqual(undefined);
  expect(token?.type).toBe(AssemblyTokenType.NewLine);
  expect(token!.lineNumber).toBe(1);
  expect(token!.columnNumber).toBe(1);
  expect(token!.token).toBe('\r\n');

  token = tokeniser.nextToken();
  expect(token).toBe(undefined);
});

test('li', () => {
  const tokeniser = new AssemblyTokeniser('li');
  let token = tokeniser.nextToken();
  expect(token).not.toEqual(undefined);
  expect(token?.type).toBe(AssemblyTokenType.Value);
  expect(token!.lineNumber).toBe(1);
  expect(token!.columnNumber).toBe(1);
  expect(token!.token).toBe('li');

  token = tokeniser.nextToken();
  expect(token).toBe(undefined);
});

test('li\ta0,R32_GPIOD_CFGLR # This is the comment', () => {
  const tokeniser = new AssemblyTokeniser('li\ta0,R32_GPIOD_CFGLR # This is the comment');
  let token = tokeniser.nextToken();
  expect(token).not.toEqual(undefined);
  expect(token?.type).toBe(AssemblyTokenType.Value);
  expect(token!.lineNumber).toBe(1);
  expect(token!.columnNumber).toBe(1);
  expect(token!.token).toBe('li');

  token = tokeniser.nextToken();
  expect(token).not.toEqual(undefined);
  expect(token?.type).toBe(AssemblyTokenType.Space);
  expect(token!.lineNumber).toBe(1);
  expect(token!.columnNumber).toBe(3);
  expect(token!.token).toBe('\t');

  token = tokeniser.nextToken();
  expect(token).not.toEqual(undefined);
  expect(token?.type).toBe(AssemblyTokenType.Value);
  expect(token!.lineNumber).toBe(1);
  expect(token!.columnNumber).toBe(4);
  expect(token!.token).toBe('a0,R32_GPIOD_CFGLR');

  token = tokeniser.nextToken();
  expect(token).not.toEqual(undefined);
  expect(token?.type).toBe(AssemblyTokenType.Space);
  expect(token!.lineNumber).toBe(1);
  expect(token!.columnNumber).toBe(22);
  expect(token!.token).toBe(' ');

  token = tokeniser.nextToken();
  expect(token).not.toEqual(undefined);
  expect(token?.type).toBe(AssemblyTokenType.Comment);
  expect(token!.lineNumber).toBe(1);
  expect(token!.columnNumber).toBe(23);
  expect(token!.token).toBe('# This is the comment');

  token = tokeniser.nextToken();
  expect(token).toBe(undefined);
});
