import { expect, test, describe } from '@jest/globals';
import { EOL } from 'node:os';
import { AssemblyFormatter } from '../src/formatter/assembly-formatter';
import { defaultConfiguration } from '../src/formatter/constants';

describe('directive', () => {
  test('.section', () => {
    const formatter = new AssemblyFormatter();

    const config = Object.assign({}, defaultConfiguration);
    config.directiveColumn = 5;
    config.directiveDataColumn = 20;

    const document = formatter.formatDocument('       .section               .init, "ax", @progbits', config, EOL);

    expect(document).toBe('    .section       .init, "ax", @progbits');

    // at col 5
    const directive = document.substring(config.directiveColumn - 1, config.directiveColumn - 1 + '.section'.length);
    expect(directive).toBe('.section');

    // at column 20
    const directiveValue = document.substring(config.directiveDataColumn - 1, config.directiveDataColumn - 1 + '.init'.length);
    expect(directiveValue).toBe('.init');
  });

  test('.globl', () => {
    const formatter = new AssemblyFormatter();

    const config = Object.assign({}, defaultConfiguration);
    config.directiveColumn = 3;
    config.directiveDataColumn = 12;

    const document = formatter.formatDocument('.globl _start', config, EOL);

    expect(document).toBe('  .globl   _start');

    // at col 3
    const directive = document.substring(config.directiveColumn - 1, config.directiveColumn - 1 + '.globl'.length);
    expect(directive).toBe('.globl');

    // at column 12
    const directiveValue = document.substring(config.directiveDataColumn - 1, config.directiveDataColumn - 1 + '_start'.length);
    expect(directiveValue).toBe('_start');
  });

  test('.align', () => {
    const formatter = new AssemblyFormatter();

    const config = Object.assign({}, defaultConfiguration);
    config.directiveColumn = 3;
    config.directiveDataColumn = 12;

    const document = formatter.formatDocument('.align               2', config, EOL);

    expect(document).toBe('  .align   2');

    // at col 3
    const directive = document.substring(config.directiveColumn - 1, config.directiveColumn - 1 + '.align'.length);
    expect(directive).toBe('.align');

    // at column 12
    const directiveValue = document.substring(config.directiveDataColumn - 1, config.directiveDataColumn - 1 + '2'.length);
    expect(directiveValue).toBe('2');
  });

  test('.include', () => {
    const formatter = new AssemblyFormatter();

    const config = Object.assign({}, defaultConfiguration);
    config.directiveColumn = 2;
    config.directiveDataColumn = 3; // Note this would place directive value within directive itself

    const document = formatter.formatDocument('.include             "./src/registers.S"', config, EOL);

    expect(document).toBe(' .include "./src/registers.S"');

    // at col 1
    const directive = document.substring(config.directiveColumn - 1, config.directiveColumn - 1 + '.include'.length);
    expect(directive).toBe('.include');

    // at column 11 (even though 3 specified that would place inside directive so it is automatically padded by 1 space after end of directive)
    const directiveValue = document.substring(11 - 1, 11 - 1 + '"./src/registers.S"'.length);
    expect(directiveValue).toBe('"./src/registers.S"');
  });
});
