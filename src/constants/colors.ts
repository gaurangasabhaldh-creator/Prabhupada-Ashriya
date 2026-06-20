// Design tokens — Krishna Blue & Gold premium spiritual theme
export const COLORS = {
  // Primary — Krishna Blue
  primary: '#0D47A1',
  onPrimary: '#ffffff',
  primaryContainer: '#1565C0',
  onPrimaryContainer: '#E3F2FD',
  inversePrimary: '#90CAF9',
  primaryFixed: '#BBDEFB',
  primaryFixedDim: '#64B5F6',
  onPrimaryFixed: '#0D47A1',
  onPrimaryFixedVariant: '#1976D2',

  // Secondary — Sacred Gold
  secondary: '#DAA520',
  onSecondary: '#1a1a1a',
  secondaryContainer: '#FFD700',
  onSecondaryContainer: '#5D4200',
  secondaryFixed: '#FFF3CD',
  secondaryFixedDim: '#FFD700',
  onSecondaryFixed: '#3E2C00',
  onSecondaryFixedVariant: '#B8860B',

  // Tertiary — Deep Indigo
  tertiary: '#1A237E',
  onTertiary: '#ffffff',
  tertiaryContainer: '#3949AB',
  onTertiaryContainer: '#E8EAF6',
  tertiaryFixed: '#C5CAE9',
  tertiaryFixedDim: '#7986CB',
  onTertiaryFixed: '#1A237E',
  onTertiaryFixedVariant: '#303F9F',

  // Error
  error: '#D32F2F',
  onError: '#ffffff',
  errorContainer: '#FFCDD2',
  onErrorContainer: '#B71C1C',

  // Surface
  background: '#F5F7FA',
  onBackground: '#1a1c2e',
  surface: '#FFFFFF',
  surfaceDim: '#E0E3EA',
  surfaceBright: '#FFFFFF',
  surfaceContainerLowest: '#FFFFFF',
  surfaceContainerLow: '#F0F3F8',
  surfaceContainer: '#E8ECF4',
  surfaceContainerHigh: '#E1E5ED',
  surfaceContainerHighest: '#D8DCE6',
  onSurface: '#1a1c2e',
  onSurfaceVariant: '#5A6070',
  surfaceVariant: '#E8ECF4',
  surfaceTint: '#0D47A1',
  inverseSurface: '#1a1c2e',
  inverseOnSurface: '#F0F3F8',

  // Outline
  outline: '#8E95A5',
  outlineVariant: '#C8CDD8',

  // Status (semantic)
  success: '#2E7D32',
  successContainer: '#E8F5E9',
  warning: '#F9A825',
  warningContainer: '#FFF9C4',
} as const;

export type ColorKey = keyof typeof COLORS;
