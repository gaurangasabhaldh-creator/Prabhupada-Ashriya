// Premium Spiritual Light Theme — Temple Cream, Saffron & Gold
export const COLORS = {
  // Primary — Deep Saffron
  primary: '#FF8F00',
  onPrimary: '#ffffff',
  primaryContainer: '#FFE0B2',
  onPrimaryContainer: '#E65100',
  inversePrimary: '#FFB74D',
  primaryFixed: '#FFE0B2',
  primaryFixedDim: '#FFB74D',
  onPrimaryFixed: '#3E2200',
  onPrimaryFixedVariant: '#E65100',

  // Secondary — Temple Gold
  secondary: '#D4AF37',
  onSecondary: '#ffffff',
  secondaryContainer: '#FFF3CD',
  onSecondaryContainer: '#5D4200',
  secondaryFixed: '#FFF3CD',
  secondaryFixedDim: '#FFD700',
  onSecondaryFixed: '#3E2C00',
  onSecondaryFixedVariant: '#B8860B',

  // Tertiary — Royal Purple
  tertiary: '#6A1B9A',
  onTertiary: '#ffffff',
  tertiaryContainer: '#F3E5F5',
  onTertiaryContainer: '#4A148C',
  tertiaryFixed: '#E1BEE7',
  tertiaryFixedDim: '#CE93D8',
  onTertiaryFixed: '#4A148C',
  onTertiaryFixedVariant: '#7B1FA2',

  // Error
  error: '#D32F2F',
  onError: '#ffffff',
  errorContainer: '#FFCDD2',
  onErrorContainer: '#B71C1C',

  // Surface — Light theme
  background: '#FFF8E1',
  onBackground: '#212121',
  surface: '#FFFFFF',
  surfaceDim: '#F5F0E0',
  surfaceBright: '#FFFFFF',
  surfaceContainerLowest: '#FFFFFF',
  surfaceContainerLow: '#FFF8E1',
  surfaceContainer: '#FFF3CD',
  surfaceContainerHigh: '#FFECB3',
  surfaceContainerHighest: '#FFE082',
  onSurface: '#212121',
  onSurfaceVariant: '#616161',
  surfaceVariant: '#FFF3CD',
  surfaceTint: '#FF8F00',
  inverseSurface: '#212121',
  inverseOnSurface: '#FFF8E1',

  // Outline
  outline: '#BDBDBD',
  outlineVariant: '#E0E0E0',

  // Status (semantic)
  success: '#2E7D32',
  successContainer: '#E8F5E9',
  warning: '#F57C00',
  warningContainer: '#FFF3E0',
} as const;

export type ColorKey = keyof typeof COLORS;
