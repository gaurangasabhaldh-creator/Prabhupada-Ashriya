import React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import {Text} from '@components/common/Typography/Text';
import {CATEGORY_COLORS, CATEGORY_LABELS, DevoteeCategory} from '@constants/categories';
import {BORDER_RADIUS, SPACING} from '@constants/spacing';

interface Props {
  category: DevoteeCategory;
  style?: ViewStyle;
}

export const CategoryBadge: React.FC<Props> = ({category, style}) => {
  const color = CATEGORY_COLORS[category];
  return (
    <View style={[styles.badge, {backgroundColor: color + '18', borderColor: color + '40'}, style]}>
      <Text variant="label-md" style={{color}}>{CATEGORY_LABELS[category]}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
  },
});
