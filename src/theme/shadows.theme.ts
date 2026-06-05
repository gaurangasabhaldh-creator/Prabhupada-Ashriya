import {Platform, ViewStyle} from 'react-native';
import {COLORS} from '@constants/colors';

// MD3 tonal elevation levels translated to React Native shadows
const shadow = (
  elevation: number,
  opacity = 0.08,
): Pick<ViewStyle, 'elevation' | 'shadowColor' | 'shadowOffset' | 'shadowOpacity' | 'shadowRadius'> => ({
  elevation,
  shadowColor: COLORS.primary,
  shadowOffset: {width: 0, height: elevation * 0.5},
  shadowOpacity: Platform.OS === 'ios' ? opacity : 0,
  shadowRadius: elevation,
});

export const SHADOWS = {
  none: shadow(0, 0),
  sm: shadow(1, 0.04),
  md: shadow(2, 0.06),
  lg: shadow(4, 0.08),
  xl: shadow(8, 0.1),
} as const;
