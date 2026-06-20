// Design tokens — Premium Spiritual Dark Theme: Saffron, Gold & Purple
export const COLORS = {
  // Primary — Deep Saffron
  primary: '#FF8F00',
  onPrimary: '#ffffff',
  primaryContainer: '#FFB300',
  onPrimaryContainer: '#3E2200',
  inversePrimary: '#FFD54F',
  primaryFixed: '#FFE0B2',
  primaryFixedDim: '#FFB74D',
  onPrimaryFixed: '#3E2200',
  onPrimaryFixedVariant: '#E65100',

  // Secondary — Temple Gold
  secondary: '#D4AF37',
  onSecondary: '#1a1a1a',
  secondaryContainer: '#FFD700',
  onSecondaryContainer: '#3E2C00',
  secondaryFixed: '#FFF3CD',
  secondaryFixedDim: '#FFD700',
  onSecondaryFixed: '#3E2C00',
  onSecondaryFixedVariant: '#B8860B',

  // Tertiary — Royal Purple
  tertiary: '#6A1B9A',
  onTertiary: '#ffffff',
  tertiaryContainer: '#9C27B0',
  onTertiaryContainer: '#F3E5F5',
  tertiaryFixed: '#E1BEE7',
  tertiaryFixedDim: '#CE93D8',
  onTertiaryFixed: '#4A148C',
  onTertiaryFixedVariant: '#7B1FA2',

  // Error
  error: '#FF5252',
  onError: '#ffffff',
  errorContainer: '#3D1111',
  onErrorContainer: '#FFCDD2',

  // Surface — Dark theme
  background: '#1A1A2E',
  onBackground: '#F5F0E8',
  surface: '#1E1E35',
  surfaceDim: '#16162B',
  surfaceBright: '#2A2A45',
  surfaceContainerLowest: '#141428',
  surfaceContainerLow: '#1E1E35',
  surfaceContainer: '#25253E',
  surfaceContainerHigh: '#2D2D4A',
  surfaceContainerHighest: '#353555',
  onSurface: '#F5F0E8',
  onSurfaceVariant: '#B0A89A',
  surfaceVariant: '#2D2D4A',
  surfaceTint: '#FF8F00',
  inverseSurface: '#F5F0E8',
  inverseOnSurface: '#1A1A2E',

  // Outline
  outline: '#6E6A62',
  outlineVariant: '#3D3D55',

  // Status (semantic)
  success: '#4CAF50',
  successContainer: '#1B3D1C',
  warning: '#FFB300',
  warningContainer: '#3E2C00',
} as const;

export type ColorKey = keyof typeof COLORS;
