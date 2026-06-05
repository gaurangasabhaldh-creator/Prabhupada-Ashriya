import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from '@components/common/Typography/Text';
import {COLORS} from '@constants/colors';
import {SPACING, BORDER_RADIUS} from '@constants/spacing';
import {CallingListDocument} from '@mytypes/calling.types';

interface Props {
  list: CallingListDocument;
  pendingCount: number;
}

export const CallingProgressHeader = ({list, pendingCount}: Props) => {
  const progress = list.totalAssigned > 0
    ? list.totalCalled / list.totalAssigned
    : 0;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.stat}>
          <Text variant="display-sm" color="primary">{list.totalCalled}</Text>
          <Text variant="label-sm" color="onSurfaceVariant">Called</Text>
        </View>
        <View style={styles.stat}>
          <Text variant="display-sm" color="success">{list.confirmedComing}</Text>
          <Text variant="label-sm" color="onSurfaceVariant">Confirmed</Text>
        </View>
        <View style={styles.stat}>
          <Text variant="display-sm" color="secondary">{list.notComing}</Text>
          <Text variant="label-sm" color="onSurfaceVariant">Not Coming</Text>
        </View>
        <View style={styles.stat}>
          <Text variant="display-sm" color="onSurfaceVariant">{list.pendingCalls}</Text>
          <Text variant="label-sm" color="onSurfaceVariant">Pending</Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, {width: `${progress * 100}%`}]} />
      </View>
      <Text variant="label-sm" color="onSurfaceVariant" style={{textAlign: 'center', marginTop: SPACING.xs}}>
        {Math.round(progress * 100)}% complete
        {pendingCount > 0 ? ` · ${pendingCount} unsaved` : ''}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surfaceContainerLow,
    paddingHorizontal: SPACING.marginMobile,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.outlineVariant,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SPACING.md,
  },
  stat: {alignItems: 'center', gap: 2},
  progressTrack: {
    height: 6,
    backgroundColor: COLORS.outlineVariant,
    borderRadius: BORDER_RADIUS.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.full,
  },
});
