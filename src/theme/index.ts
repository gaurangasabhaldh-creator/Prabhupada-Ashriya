import {COLORS} from '@constants/colors';
import {TYPOGRAPHY, FONTS} from '@constants/typography';
import {SPACING, BORDER_RADIUS, ICON_SIZE} from '@constants/spacing';

export const theme = {
  colors: COLORS,
  typography: TYPOGRAPHY,
  fonts: FONTS,
  spacing: SPACING,
  borderRadius: BORDER_RADIUS,
  iconSize: ICON_SIZE,
} as const;

export type Theme = typeof theme;

// Convenience re-exports used throughout the app
export {COLORS, TYPOGRAPHY, FONTS, SPACING, BORDER_RADIUS, ICON_SIZE};
