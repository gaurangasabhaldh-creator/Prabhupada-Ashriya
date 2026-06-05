import React from 'react';
import {TouchableOpacity, StyleSheet, ViewStyle} from 'react-native';
import {Icon} from '../Icon/Icon';
import {COLORS, ColorKey} from '@constants/colors';
import {BORDER_RADIUS, HIT_SLOP} from '@constants/spacing';

interface Props {
  name: string;
  onPress: () => void;
  size?: number;
  color?: ColorKey | string;
  filled?: boolean;
  disabled?: boolean;
  containerColor?: string;
  accessibilityLabel: string;
  style?: ViewStyle;
}

export const IconButton: React.FC<Props> = ({
  name,
  onPress,
  size = 24,
  color = 'onSurface',
  filled = false,
  disabled = false,
  containerColor,
  accessibilityLabel,
  style,
}) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={disabled}
    hitSlop={HIT_SLOP}
    accessibilityLabel={accessibilityLabel}
    accessibilityRole="button"
    activeOpacity={0.7}
    style={[
      styles.base,
      containerColor && {backgroundColor: containerColor, borderRadius: BORDER_RADIUS.full, padding: 8},
      disabled && {opacity: 0.4},
      style,
    ]}>
    <Icon name={name} size={size} color={color} filled={filled} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 44,
    minHeight: 44,
  },
});
