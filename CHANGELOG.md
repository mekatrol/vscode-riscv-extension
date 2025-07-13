# Change Log

All notable changes to the "mekatrol-risc-v-formatter" extension will be documented in this file.

## [1.0.4]
- Fixed bug where directives move to column 2 when the configuration is set to column 1

## [1.0.3]
- Fixed publish bug in 1.0.2 (no functional changes)

## [1.0.2]

- Only apply formatting if the .criscv file is present (so that the formatter is disabled unless file exists)
- Add disabled option in configuration file (to allow disabling format while keeping configuration file)
- Handle `/* */` C style comment blocks
- Handle `//` C style comments
