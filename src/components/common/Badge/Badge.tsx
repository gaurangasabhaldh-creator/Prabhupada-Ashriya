import React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import {Text} from '../Typography/Text';
import {COLORS, ColorKey} from '@constants/colors';
import {BORDER_RADIUS, SPACING} from '@constants/spacing';

interface CountBadgeProps {
  mode: 'count';
  count: number;
  color?: ColorKey | string;
  style?: ViewStyle;
}

interface LabelBadgeProps {
  mode: 'label';
  label: string;
  color?: ColorKey | string;
  style?: ViewStyle;
}

type Props = CountBadgeProps | LabelBadgeProps;

export const Badge: React.FC<Props> = props => {
  const {color = 'error', style} = props;
  const resolvedColor = color in COLORS ? COLORS[color as ColorKey] : color;

  if (props.mode === 'count') {
    const display = props.count > 99 ? '99+' : String(props.count);
    if (props.count === 0) return null;
    return (
      <View style={[styles.countBadge, {backgroundColor: resolvedColor}, style]}>
        <Text style={{color: COLORS.onError, fontSize: 10, fontWeight: '700', lineHeight: 14}}>
          {display}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.labelBadge, {backgroundColor: resolvedColor + '20', borderColor: resolvedColor + '40'}, style]}>
      <Text variant="label-md" style={{color: resolvedColor}}>
        {props.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  countBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: BORDER_RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  labelBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
  },
});
