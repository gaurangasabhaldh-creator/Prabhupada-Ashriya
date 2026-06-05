import React from 'react';
import {View, StyleSheet} from 'react-native';
import {SkeletonBox} from './SkeletonBox';
import {SPACING, BORDER_RADIUS} from '@constants/spacing';
import {COLORS} from '@constants/colors';

const DevoteeRowSkeleton = () => (
  <View style={styles.row}>
    <SkeletonBox width={40} height={40} radius={20} />
    <View style={styles.textGroup}>
      <SkeletonBox width={140} height={14} radius={BORDER_RADIUS.xs} />
      <SkeletonBox width={100} height={11} radius={BORDER_RADIUS.xs} style={{marginTop: 6}} />
    </View>
    <SkeletonBox width={52} height={22} radius={BORDER_RADIUS.full} />
  </View>
);

interface Props {
  count?: number;
}

export const ListSkeleton: React.FC<Props> = ({count = 8}) => (
  <View style={styles.container}>
    {Array.from({length: count}).map((_, i) => (
      <DevoteeRowSkeleton key={i} />
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {paddingHorizontal: SPACING.marginMobile},
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.outlineVariant,
  },
  textGroup: {flex: 1, marginLeft: SPACING.md},
});
