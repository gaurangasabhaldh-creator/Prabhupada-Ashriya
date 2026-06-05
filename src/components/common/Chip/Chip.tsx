import React from 'react';
import {TouchableOpacity, View, StyleSheet, ViewStyle} from 'react-native';
import {Text} from '../Typography/Text';
import {Icon} from '../Icon/Icon';
import {COLORS} from '@constants/colors';
import {BORDER_RADIUS, SPACING} from '@constants/spacing';

interface Props {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  leftIcon?: string;
  color?: string;
  style?: ViewStyle;
  disabled?: boolean;
}

export const Chip: React.FC<Props> = ({
  label,
  selected = false,
  onPress,
  leftIcon,
  color = COLORS.primary,
  style,
  disabled = false,
}) => {
  const bg = selected ? color + '20' : COLORS.surfaceContainerLow;
  const border = selected ? color + '60' : COLORS.outlineVariant;
  const textColor = selected ? color : COLORS.onSurfaceVariant;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || !onPress}
      activeOpacity={0.7}
      accessibilityRole="checkbox"
      accessibilityState={{checked: selected}}
      style={[
        styles.chip,
        {backgroundColor: bg, borderColor: border, opacity: disabled ? 0.5 : 1},
        style,
      ]}>
      {leftIcon && <Icon name={leftIcon} size={14} color={textColor} style={{marginRight: 4}} />}
      {selected && <Icon name="check" size={14} color={color} style={{marginRight: 4}} />}
      <Text variant="label-lg" style={{color: textColor}}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    height: 32,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
  },
});
