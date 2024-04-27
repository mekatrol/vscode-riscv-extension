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

    // .section at col 5
    const section = document.substring(config.directiveColumn - 1, config.directiveColumn - 1 + '.section'.length);
    expect(section).toBe('.section');

    // .net at column 20
    const init = document.substring(config.directiveDataColumn - 1, config.directiveDataColumn - 1 + '.init'.length);
    expect(init).toBe('.init');
  });
});
