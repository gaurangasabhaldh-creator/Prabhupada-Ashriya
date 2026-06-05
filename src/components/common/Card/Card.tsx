import React from 'react';
import {View, TouchableOpacity, StyleSheet, ViewStyle} from 'react-native';
import {COLORS} from '@constants/colors';
import {BORDER_RADIUS, SPACING} from '@constants/spacing';
import {SHADOWS} from '@theme/shadows.theme';

type Elevation = 'none' | 'sm' | 'md';

interface Props {
  children: React.ReactNode;
  onPress?: () => void;
  elevation?: Elevation;
  style?: ViewStyle;
  padding?: number | false;
}

export const Card: React.FC<Props> = ({
  children,
  onPress,
  elevation = 'sm',
  style,
  padding = SPACING.md,
}) => {
  const shadow = elevation === 'none' ? {} : SHADOWS[elevation];
  const content = (
    <View
      style={[
        styles.card,
        shadow,
        padding !== false && {padding},
        style,
      ]}>
      {children}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surfaceContainerLowest,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.outlineVariant,
  },
});
