import { expect, test, describe } from '@jest/globals';
import { EOL } from 'node:os';
import { AssemblyFormatter } from '../src/formatter/assembly-formatter';
import { defaultConfiguration } from '../src/formatter/constants';

describe('label', () => {
  test('label no data', () => {
    const formatter = new AssemblyFormatter();

    const config = Object.assign({}, defaultConfiguration);
    config.labelColumn = 5;
    config.labelDataColumn = 20;

    const document = formatter.formatDocument('       LABEL_1:\t\t', config, EOL);

    expect(document).toBe('    LABEL_1:'); // Note: whitespace at end also trimmed

    // at col 5
    const directive = document.substring(config.labelColumn - 1, config.labelColumn - 1 + 'LABEL_1:'.length);
    expect(directive).toBe('LABEL_1:');
  });

  test('label data', () => {
    const formatter = new AssemblyFormatter();

    const config = Object.assign({}, defaultConfiguration);
    config.labelColumn = 5;
    config.labelDataColumn = 20;

    const document = formatter.formatDocument('       LABEL_1: # do stuff    ', config, EOL);

    expect(document).toBe('    LABEL_1:       # do stuff'); // Note: whitespace at end also trimmed

    // at col 5
    const directive = document.substring(config.labelColumn - 1, config.labelColumn - 1 + '.section'.length);
    expect(directive).toBe('LABEL_1:');

    // at column 20
    const directiveValue = document.substring(config.labelDataColumn - 1);
    expect(directiveValue).toBe('# do stuff');
  });
});
