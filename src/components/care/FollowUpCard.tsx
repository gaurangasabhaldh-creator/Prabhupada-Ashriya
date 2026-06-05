import React, {memo} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {Text} from '@components/common/Typography/Text';
import {Avatar} from '@components/common/Avatar/Avatar';
import {Icon} from '@components/common/Icon/Icon';
import {COLORS} from '@constants/colors';
import {SPACING, BORDER_RADIUS} from '@constants/spacing';
import {
  FOLLOW_UP_STATUS_LABELS,
  PRIORITY_COLORS,
  Priority,
} from '@constants/callStatus';
import {FollowUpDocument} from '@mytypes/followUp.types';
import {formatDate} from '@utils/date.utils';

const REASON_LABELS: Record<FollowUpDocument['reason'], string> = {
  consecutive_absence: 'Consecutive Absence',
  confirmed_not_attended: 'Confirmed Not Attending',
  inactive: 'Inactive',
  manual: 'Manual',
};

interface Props {
  followUp: FollowUpDocument;
  onPress: () => void;
}

export const FollowUpCard = memo(({followUp, onPress}: Props) => {
  const priorityColor = PRIORITY_COLORS[followUp.priority as Priority];

  return (
    <TouchableOpacity
      style={[styles.card, {borderLeftColor: priorityColor}]}
      onPress={onPress}
      accessibilityRole="button">
      <Avatar name={followUp.devoteeName} size="md" />
      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text variant="title-md">{followUp.devoteeName}</Text>
          <View style={[styles.priorityDot, {backgroundColor: priorityColor}]} />
        </View>
        <Text variant="body-sm" color="onSurfaceVariant">
          {REASON_LABELS[followUp.reason]} · {followUp.devoteeTeamName}
        </Text>
        <Text variant="label-sm" color="onSurfaceVariant">
          {FOLLOW_UP_STATUS_LABELS[followUp.status]} · {followUp.contactAttempts} attempts
        </Text>
        {followUp.nextFollowUpDate && (
          <Text variant="label-sm" color="tertiary">
            Next: {formatDate((followUp.nextFollowUpDate as any).toDate())}
          </Text>
        )}
      </View>
      <Icon name="chevron_right" size={20} color={COLORS.onSurfaceVariant} />
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.marginMobile,
    paddingLeft: SPACING.md,
    borderLeftWidth: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.outlineVariant,
    backgroundColor: COLORS.surfaceContainerLowest,
  },
  info: {flex: 1, gap: 2},
  nameRow: {flexDirection: 'row', alignItems: 'center', gap: SPACING.xs},
  priorityDot: {width: 8, height: 8, borderRadius: 4},
});
