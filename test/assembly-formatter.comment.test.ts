import { expect, test, describe } from '@jest/globals';
import { EOL } from 'node:os';
import { AssemblyFormatter } from '../src/formatter/assembly-formatter';
import { defaultConfiguration } from '../src/formatter/constants';

describe('comment only lines', () => {
  test('start column undefined', () => {
    const formatter = new AssemblyFormatter();

    const config = Object.assign({}, defaultConfiguration);
    config.commentOnlyLineColumn = undefined;
    config.endOfFileHasBlankLine = false;

    const document = formatter.formatDocument('    # Comment\t\t', config, EOL);

    expect(document).toBe('    # Comment'); // Note: whitespace at end also trimmed
  });

  test('start column 1', () => {
    const formatter = new AssemblyFormatter();

    const config = Object.assign({}, defaultConfiguration);
    config.commentOnlyLineColumn = 1;

    const document = formatter.formatDocument('    # Comment\t\t', config, EOL);

    expect(document).toBe(`# Comment${EOL}`); // Note: whitespace at end also trimmed

    // at col 1
    const comment = document.substring(config.commentOnlyLineColumn - 1, config.commentOnlyLineColumn - 1 + '# Comment'.length);
    expect(comment).toBe('# Comment');
  });

  test('start column 1 semi colon comment', () => {
    const formatter = new AssemblyFormatter();

    const config = Object.assign({}, defaultConfiguration);
    config.commentOnlyLineColumn = 1;
    config.commentCharacter = ';';

    const document = formatter.formatDocument('    ; Comment\t\t', config, EOL);

    expect(document).toBe(`; Comment${EOL}`); // Note: whitespace at end also trimmed

    // at col 1
    const comment = document.substring(config.commentOnlyLineColumn - 1, config.commentOnlyLineColumn - 1 + '; Comment'.length);
    expect(comment).toBe('; Comment');
  });

  test('start column 10', () => {
    const formatter = new AssemblyFormatter();

    const config = Object.assign({}, defaultConfiguration);
    config.commentOnlyLineColumn = 10;
    config.endOfFileHasBlankLine = false;

    const document = formatter.formatDocument('    # Comment\t\t', config, EOL);

    expect(document).toBe('         # Comment'); // Note: whitespace at end also trimmed

    // at col 10
    const comment = document.substring(config.commentOnlyLineColumn - 1, config.commentOnlyLineColumn - 1 + '# Comment'.length);
    expect(comment).toBe('# Comment');
  });

  test('# comments include ; in file', () => {
    const formatter = new AssemblyFormatter();

    const config = Object.assign({}, defaultConfiguration);
    config.commentOnlyLineColumn = 1;
    config.commentCharacter = '#';

    config.value.primaryColumn = undefined;
    config.value.dataColumn = undefined;
    config.value.commentColumn = undefined;

    const document = formatter.formatDocument('    ; Comment\t\t', config, EOL);

    expect(document).toBe(`    ; Comment${EOL}`); // Note: whitespace at end also trimmed
  });
});
