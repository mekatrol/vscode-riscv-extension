import { expect, test, describe } from '@jest/globals';
import { EOL } from 'node:os';
import { AssemblyFormatter } from '../src/formatter/assembly-formatter';
import { defaultConfiguration } from '../src/formatter/constants';

describe('instruction', () => {
  test('call', () => {
    const formatter = new AssemblyFormatter();

    const config = Object.assign({}, defaultConfiguration);
    config.endOfFileHasBlankLine = false;
    config.instruction.primaryColumn = 1;
    config.instruction.dataColumn = 6;
    config.instruction.commentColumn = 20;

    const document = formatter.formatDocument('	call                 set_register_bits_with_mask\t\t', config, EOL);

    expect(document).toBe('call set_register_bits_with_mask'); // Note: whitespace at end also trimmed

    // at col 5
    const instruction = document.substring(config.instruction.primaryColumn - 1, config.instruction.primaryColumn - 1 + 'call'.length);
    expect(instruction).toBe('call');

    // at column 20
    const instructionData = document.substring(config.instruction.dataColumn - 1, config.instruction.dataColumn - 1 + 'set_register_bits_with_mask'.length);
    expect(instructionData).toBe('set_register_bits_with_mask');
  });
});
