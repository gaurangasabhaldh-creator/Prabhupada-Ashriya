import React from 'react';
import {
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  TextStyle,
  ViewStyle,
  View,
} from 'react-native';
import {Text} from '../Typography/Text';
import {Icon} from '../Icon/Icon';
import {COLORS} from '@constants/colors';
import {BORDER_RADIUS, SPACING} from '@constants/spacing';

type Variant = 'primary' | 'secondary' | 'text' | 'danger' | 'outline';
type Size = 'sm' | 'md' | 'lg';

interface Props {
  label: string;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: string;
  rightIcon?: string;
  fullWidth?: boolean;
  style?: ViewStyle;
}

const SIZE_STYLES: Record<Size, {paddingH: number; paddingV: number; textVariant: string}> = {
  sm: {paddingH: 12, paddingV: 8, textVariant: 'label-md'},
  md: {paddingH: 20, paddingV: 12, textVariant: 'label-lg'},
  lg: {paddingH: 24, paddingV: 16, textVariant: 'title-md'},
};

const VARIANT_STYLES: Record<Variant, {bg: string; border?: string; text: string}> = {
  primary: {bg: COLORS.primary, text: COLORS.onPrimary},
  secondary: {bg: 'transparent', border: COLORS.primary, text: COLORS.primary},
  text: {bg: 'transparent', text: COLORS.primary},
  danger: {bg: COLORS.error, text: COLORS.onError},
  outline: {bg: 'transparent', border: COLORS.outline, text: COLORS.onSurface},
};

export const Button: React.FC<Props> = ({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  style,
}) => {
  const sizeConfig = SIZE_STYLES[size];
  const variantConfig = VARIANT_STYLES[variant];
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.75}
      style={[
        styles.base,
        {
          backgroundColor: variantConfig.bg,
          paddingHorizontal: sizeConfig.paddingH,
          paddingVertical: sizeConfig.paddingV,
          borderWidth: variantConfig.border ? 1.5 : 0,
          borderColor: variantConfig.border ?? 'transparent',
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
          opacity: isDisabled ? 0.5 : 1,
        },
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={variantConfig.text} size="small" />
      ) : (
        <View style={styles.content}>
          {leftIcon && (
            <Icon name={leftIcon} size={16} color={variantConfig.text} style={styles.leftIcon} />
          )}
          <Text
            variant={sizeConfig.textVariant as any}
            style={{color: variantConfig.text, textTransform: 'uppercase', letterSpacing: 0.8} as TextStyle}>
            {label}
          </Text>
          {rightIcon && (
            <Icon name={rightIcon} size={16} color={variantConfig.text} style={styles.rightIcon} />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: BORDER_RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftIcon: {marginRight: SPACING.xs},
  rightIcon: {marginLeft: SPACING.xs},
});
