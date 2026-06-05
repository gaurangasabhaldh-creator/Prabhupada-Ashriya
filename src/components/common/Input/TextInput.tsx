import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  TextInput as RNTextInput,
  TextInputProps,
  Animated,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {Text} from '../Typography/Text';
import {Icon} from '../Icon/Icon';
import {COLORS} from '@constants/colors';
import {BORDER_RADIUS, SPACING} from '@constants/spacing';

interface Props extends TextInputProps {
  label: string;
  error?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  containerStyle?: object;
}

export const TextInput: React.FC<Props> = ({
  label,
  error,
  rightIcon,
  onRightIconPress,
  containerStyle,
  value,
  onFocus,
  onBlur,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const isUp = isFocused || !!value;
  const labelAnim = useRef(new Animated.Value(isUp ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(labelAnim, {
      toValue: isUp ? 1 : 0,
      duration: 150,
      useNativeDriver: false,
    }).start();
  }, [isUp, labelAnim]);

  const borderColor = error
    ? COLORS.error
    : isFocused
    ? COLORS.primary
    : COLORS.outline;

  const labelTop = labelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [16, -10],
  });
  const labelFontSize = labelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 12],
  });
  const labelColor = labelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.outline, error ? COLORS.error : isFocused ? COLORS.primary : COLORS.outline],
  });

  return (
    <View style={containerStyle}>
      <View style={[styles.inputContainer, {borderColor, borderWidth: isFocused ? 2 : 1}]}>
        {/* Floating label */}
        <Animated.View
          style={[styles.labelContainer, {top: labelTop}]}
          pointerEvents="none">
          <Animated.Text
            style={{
              fontSize: labelFontSize,
              color: labelColor,
              backgroundColor: COLORS.surfaceContainerLowest,
              paddingHorizontal: isUp ? 4 : 0,
              fontFamily: 'WorkSans',
            }}>
            {label}
          </Animated.Text>
        </Animated.View>

        <RNTextInput
          style={[styles.input, rightIcon && {paddingRight: 44}]}
          value={value}
          onFocus={e => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={e => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          placeholderTextColor={COLORS.outline}
          selectionColor={COLORS.primary}
          {...rest}
        />

        {rightIcon && (
          <TouchableOpacity
            style={styles.rightIcon}
            onPress={onRightIconPress}
            hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
            <Icon name={rightIcon} size={20} color={isFocused ? 'primary' : 'outline'} />
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <View style={styles.errorRow}>
          <Icon name="error" size={12} color="error" style={{marginRight: 4}} />
          <Text variant="body-sm" color="error">{error}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.surfaceContainerLowest,
    paddingHorizontal: SPACING.md,
    paddingTop: 20,
    paddingBottom: SPACING.sm,
    position: 'relative',
    minHeight: 56,
    justifyContent: 'center',
  },
  labelContainer: {
    position: 'absolute',
    left: SPACING.md,
  },
  input: {
    fontFamily: 'WorkSans',
    fontSize: 16,
    color: COLORS.onSurface,
    padding: 0,
    minHeight: 24,
  },
  rightIcon: {
    position: 'absolute',
    right: SPACING.sm,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginLeft: SPACING.md,
  },
});
