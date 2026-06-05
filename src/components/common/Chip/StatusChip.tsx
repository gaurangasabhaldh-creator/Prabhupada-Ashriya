import React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import {Text} from '../Typography/Text';
import {COLORS} from '@constants/colors';
import {BORDER_RADIUS, SPACING} from '@constants/spacing';
import {DEVOTEE_STATUS_COLORS, DEVOTEE_STATUS_LABELS, DevoteeStatus} from '@constants/attendance';

interface Props {
  status: DevoteeStatus;
  style?: ViewStyle;
}

export const StatusChip: React.FC<Props> = ({status, style}) => {
  const color = DEVOTEE_STATUS_COLORS[status];
  const label = DEVOTEE_STATUS_LABELS[status];

  return (
    <View
      style={[
        styles.chip,
        {backgroundColor: color + '18', borderColor: color + '40'},
        style,
      ]}
      accessibilityLabel={`Status: ${label}`}>
      <View style={[styles.dot, {backgroundColor: color}]} />
      <Text variant="label-md" style={{color}}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    gap: 4,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
});
