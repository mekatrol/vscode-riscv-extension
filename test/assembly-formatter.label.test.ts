import { expect, test, describe } from '@jest/globals';
import { EOL } from 'node:os';
import { AssemblyFormatter } from '../src/formatter/assembly-formatter';
import { defaultConfiguration } from '../src/formatter/constants';

describe('label', () => {
  test('label no data', () => {
    const formatter = new AssemblyFormatter();

    const config = Object.assign({}, defaultConfiguration);
    config.endOfFileHasBlankLine = false;
    config.label.primaryColumn = 5;
    config.label.dataColumn = 20;

    const document = formatter.formatDocument('       LABEL_1:\t\t', config, EOL);

    expect(document).toBe('    LABEL_1:'); // Note: whitespace at end also trimmed

    // at col 5
    const directive = document.substring(config.label.primaryColumn - 1, config.label.primaryColumn - 1 + 'LABEL_1:'.length);
    expect(directive).toBe('LABEL_1:');
  });

  test('label with comment', () => {
    const formatter = new AssemblyFormatter();

    const config = Object.assign({}, defaultConfiguration);
    config.endOfFileHasBlankLine = false;
    config.label.primaryColumn = 5;
    config.label.commentColumn = 20;

    const document = formatter.formatDocument('       LABEL_1: # do stuff    ', config, EOL);

    expect(document).toBe('    LABEL_1:       # do stuff'); // Note: whitespace at end also trimmed

    // at col 5
    const directive = document.substring(config.label.primaryColumn - 1, config.label.primaryColumn - 1 + 'LABEL_1:'.length);
    expect(directive).toBe('LABEL_1:');

    // at column 20
    const directiveValue = document.substring(config.label.commentColumn - 1);
    expect(directiveValue).toBe('# do stuff');
  });

  test('label own line', () => {
    const formatter = new AssemblyFormatter();

    const config = Object.assign({}, defaultConfiguration);
    config.endOfFileHasBlankLine = false;
    config.label.primaryColumn = undefined;
    config.label.dataColumn = undefined;
    config.label.hasOwnLine = true;

    // Because we check the remainder make sure it is formatted as expected
    config.instruction.primaryColumn = 5;
    config.instruction.dataColumn = 20;
    config.instruction.commentColumn = 40;

    const document = formatter.formatDocument('LABEL_1: li t1,0x34 # do stuff    ', config, EOL);

    const groups = /(?<firstLine>[^\n\r]+)($|\n|\r\n)+(?<remainder>.*)/.exec(document)?.groups;
    const firstLine = groups ? groups['firstLine'] : '';
    const remainder = groups ? groups['remainder'] : '';

    expect(firstLine).toBe('LABEL_1:'); // Note: whitespace at end also trimmed
    expect(remainder).toBe('    li             t1,0x34             # do stuff'); // Note: whitespace at end also trimmed
  });

  test('label column 1', () => {
    const formatter = new AssemblyFormatter();

    const config = Object.assign({}, defaultConfiguration);
    config.endOfFileHasBlankLine = false;
    config.label.primaryColumn = 1;
    config.label.commentColumn = 20;
    config.label.hasOwnLine = true;

    const document = formatter.formatDocument('    LABEL_1:# This is label 1', config, EOL);

    expect(document).toBe('LABEL_1:           # This is label 1'); // Note: whitespace at end also trimmed
  });
});
