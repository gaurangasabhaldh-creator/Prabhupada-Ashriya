// Design tokens from DESIGN.md — Material Design 3 tonal palette
export const COLORS = {
  // Primary — Saffron
  primary: '#8f4e00',
  onPrimary: '#ffffff',
  primaryContainer: '#ff9933',
  onPrimaryContainer: '#693800',
  inversePrimary: '#ffb77a',
  primaryFixed: '#ffdcc2',
  primaryFixedDim: '#ffb77a',
  onPrimaryFixed: '#2e1500',
  onPrimaryFixedVariant: '#6d3a00',

  // Secondary — Deep Maroon
  secondary: '#b22b1d',
  onSecondary: '#ffffff',
  secondaryContainer: '#fe624e',
  onSecondaryContainer: '#650000',
  secondaryFixed: '#ffdad4',
  secondaryFixedDim: '#ffb4a8',
  onSecondaryFixed: '#410000',
  onSecondaryFixedVariant: '#8f0f07',

  // Tertiary — Amber
  tertiary: '#785900',
  onTertiary: '#ffffff',
  tertiaryContainer: '#e0a900',
  onTertiaryContainer: '#584000',
  tertiaryFixed: '#ffdf9e',
  tertiaryFixedDim: '#fabd00',
  onTertiaryFixed: '#261a00',
  onTertiaryFixedVariant: '#5b4300',

  // Error
  error: '#ba1a1a',
  onError: '#ffffff',
  errorContainer: '#ffdad6',
  onErrorContainer: '#93000a',

  // Surface
  background: '#faf9f8',
  onBackground: '#1a1c1c',
  surface: '#faf9f8',
  surfaceDim: '#dadad9',
  surfaceBright: '#faf9f8',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#f4f3f2',
  surfaceContainer: '#eeeeed',
  surfaceContainerHigh: '#e9e8e7',
  surfaceContainerHighest: '#e3e2e1',
  onSurface: '#1a1c1c',
  onSurfaceVariant: '#554336',
  surfaceVariant: '#e3e2e1',
  surfaceTint: '#8f4e00',
  inverseSurface: '#2f3130',
  inverseOnSurface: '#f1f0f0',

  // Outline
  outline: '#887364',
  outlineVariant: '#dbc2b0',

  // Status (semantic)
  success: '#2d6a2d',
  successContainer: '#d4edda',
  warning: '#fabd00',
  warningContainer: '#fff3cd',
} as const;

export type ColorKey = keyof typeof COLORS;
