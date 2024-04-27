import { expect, test, describe } from '@jest/globals';
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
  expect(token?.type).toBe(AssemblyTokenType.Newline);
  expect(token!.lineNumber).toBe(1);
  expect(token!.columnNumber).toBe(5);
  expect(token!.token).toBe('\n');

  token = tokeniser.nextToken();
  expect(token).toBe(undefined);
});

describe('newline', () => {
  test('\n', () => {
    const tokeniser = new AssemblyTokeniser('\n');
    let token = tokeniser.nextToken();
    expect(token).not.toEqual(undefined);
    expect(token?.type).toBe(AssemblyTokenType.Newline);
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
    expect(token?.type).toBe(AssemblyTokenType.Newline);
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
    expect(token?.type).toBe(AssemblyTokenType.Newline);
    expect(token!.lineNumber).toBe(1);
    expect(token!.columnNumber).toBe(1);
    expect(token!.token).toBe('\r\n');

    token = tokeniser.nextToken();
    expect(token).toBe(undefined);
  });
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

describe('labels', () => {
  test('li:', () => {
    const tokeniser = new AssemblyTokeniser('li:');
    let token = tokeniser.nextToken();
    expect(token).not.toEqual(undefined);
    expect(token?.type).toBe(AssemblyTokenType.Label);
    expect(token!.lineNumber).toBe(1);
    expect(token!.columnNumber).toBe(1);
    expect(token!.token).toBe('li:');

    token = tokeniser.nextToken();
    expect(token).toBe(undefined);
  });

  test('li_:', () => {
    const tokeniser = new AssemblyTokeniser('li_:');
    let token = tokeniser.nextToken();
    expect(token).not.toEqual(undefined);
    expect(token?.type).toBe(AssemblyTokenType.Label);
    expect(token!.lineNumber).toBe(1);
    expect(token!.columnNumber).toBe(1);
    expect(token!.token).toBe('li_:');

    token = tokeniser.nextToken();
    expect(token).toBe(undefined);
  });

  test('li3:', () => {
    const tokeniser = new AssemblyTokeniser('li3:');
    let token = tokeniser.nextToken();
    expect(token).not.toEqual(undefined);
    expect(token?.type).toBe(AssemblyTokenType.Label);
    expect(token!.lineNumber).toBe(1);
    expect(token!.columnNumber).toBe(1);
    expect(token!.token).toBe('li3:');

    token = tokeniser.nextToken();
    expect(token).toBe(undefined);
  });

  test('li_2:', () => {
    const tokeniser = new AssemblyTokeniser('li_2:');
    let token = tokeniser.nextToken();
    expect(token).not.toEqual(undefined);
    expect(token?.type).toBe(AssemblyTokenType.Label);
    expect(token!.lineNumber).toBe(1);
    expect(token!.columnNumber).toBe(1);
    expect(token!.token).toBe('li_2:');

    token = tokeniser.nextToken();
    expect(token).toBe(undefined);
  });

  test('_li:', () => {
    const tokeniser = new AssemblyTokeniser('_li:');
    let token = tokeniser.nextToken();
    expect(token).not.toEqual(undefined);
    expect(token?.type).toBe(AssemblyTokenType.Label);
    expect(token!.lineNumber).toBe(1);
    expect(token!.columnNumber).toBe(1);
    expect(token!.token).toBe('_li:');

    token = tokeniser.nextToken();
    expect(token).toBe(undefined);
  });

  test('1_li:', () => {
    const tokeniser = new AssemblyTokeniser('1_li:');
    let token = tokeniser.nextToken();
    expect(token).not.toEqual(undefined);
    expect(token?.type).not.toBe(AssemblyTokenType.Label);
  });
});

test('fileContent', () => {
  const tokeniser = new AssemblyTokeniser(fileContent);

  while (tokeniser.hasMore()) {
    let token = tokeniser.nextToken();
    expect(token).not.toEqual(undefined);
    expect(token?.type).not.toEqual(AssemblyTokenType.Unknown);
  }
});

const fileContent = `
# The "ax",@progbits tells the assembler that the section is allocatable ("a"), executable ("x") and contains data ("@progbits").
	.section             .init, "ax", @progbits

	.globl               _start
	.align               2

	.include             "./src/memory.S"
	.include             "./src/registers.S"
	.include             "./src/bits.S"
	.include             "./src/utils.S"

# Bit zero defines if PD0 state and bit 1 PD4 state
	STATE_LED_PD0_MASK   = 0x00000001
	STATE_LED_PD4_MASK   = 0x00000002
	STATE_LED_STATE_MASK = STATE_LED_PD0_MASK | STATE_LED_PD4_MASK

# NOTE: For calling conventions used see: https: //riscv.org/wp-content/uploads/2015/01/riscv-calling.pdf
# NOTE: ABI names preferred over Register names

	.bss
# Keep track f current LED bit state
LED_STATE:
	.word

	.text
_start:
# Initialise stack pointer
	li                   sp, STACK

#############################
# Enable external oscillator
#############################
# Point to R32_RCC_CFGR0 register
	li                   a0,R32_RCC_CFGR0

# No need to mask any bits
	li                   a1,~0

# Turn HSE ON
	li                   a2,HSEON

# Update register
	call                 set_register_bits_with_mask

#############################
# Initialise state
#############################
# Init LED state in RAM to 0x00000001
	li                   t0,0x00000001
	la                   a0,LED_STATE
	sw                   t0,0(a0)

#############################
# Enable port module clocks
#############################
# Point to APB2PCENR register
	li                   a0,R32_RCC_APB2PCENR

# No need to mask any bits
	li                   a1,~0

# Create port module clock enable mask for ports
	li                   a2,(IOPAEN|IOPCEN|IOPDEN)

# Update register
	call                 set_register_bits_with_mask

#############################
# Configure GPIO
#############################

# Point to R32_GPIOD_CFGLR register
	li                   a0,R32_GPIOD_CFGLR

# Mask just PD0 and PD4 bits
	li                   a1,~(GPIO_PD0_MASK | GPIO_PD4_MASK)

# PD0 and PD4 are push pull at max frequency
	li                   a2, ((GPIO_OUT_UNI_PUSH_PULL | GPIO_OUT_MPX_OD)<<0) | ((GPIO_OUT_UNI_PUSH_PULL | GPIO_OUT_MPX_OD)<<16)

	call                 set_register_bits_with_mask

#############################
# Toggle LED bits
#############################
TOGGLE_BITS:
# Point to LED state in RAM
	la                   a0, LED_STATE

# Load current LED state values into t1
	lw                   t0,0(a0)

# Invert LED state bits
	xori                 t0,t0,STATE_LED_STATE_MASK

# Save back to memory (and retain in t0)
	sw                   t0,0(a0)

# Clear all but LED state bit
	andi                 t0,t0,STATE_LED_STATE_MASK

####################################
# Set LED bit value based on state
####################################
# Clear t1
	addi                 t1,zero,0

# Bit 0 LED state on?
	li                   t2,STATE_LED_PD0_MASK
	bne                  t0,t2,TURN_PD0_OFF

# Turn PD0 on in t1
	li                   t2,1 << 0
	or                   t1,t1,t2
	j                    TEST_PD4

TURN_PD0_OFF:
# Turn PD0 off in t1
	li                   t2,1 << 16
	or                   t1,t1,t2

TEST_PD4:
# Bit 2 LED state on?
	li                   t2,STATE_LED_PD4_MASK
	bne                  t0,t2,TURN_PD4_OFF

# Turn PD4 on in t1
	li                   t2,1 << 4
	or                   t1,t1,t2
	j                    UPDATE_GPIO

TURN_PD4_OFF:
# Turn PD4 off in t1
	li                   t2,1 << 20
	or                   t1,t1,t2

UPDATE_GPIO:
# Point to R32_GPIOD_BSHR register
	li                   a0,R32_GPIOD_BSHR

# Load existing R32_GPIOD_BSHR register value
	lw                   a1,0(a0)

# OR with PD4 bit state value
	or                   a1,a1,t1

# Write updated mask to R32_GPIOD_BSHR register
	sw                   a1,0(a0)

# Load delay period
	li                   t1,1000000

# Call delay subroutine
	call                 delay

# Jump back to toggle
	j                    TOGGLE_BITS

# Delay by count in t1
delay:
# Decrement t1 by 1
	addi                 t1,t1,-1

# If zero not reached then continue looping
	bne                  t1,zero,delay

	ret

`;
