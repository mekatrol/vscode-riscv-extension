import { expect, test, describe } from '@jest/globals';
import { EOL } from 'node:os';
import { AssemblyFormatter } from '../src/formatter/assembly-formatter';
import { testFileContent } from './test-file-content';
import { defaultConfiguration } from '../src/formatter/constants';

describe('all white space', () => {
  test('Empty content returns undefined token', () => {
    const formatter = new AssemblyFormatter();

    const document = formatter.formatDocument(testFileContent, defaultConfiguration, EOL);

    expect(document).not.toBe(undefined);
  });
});
