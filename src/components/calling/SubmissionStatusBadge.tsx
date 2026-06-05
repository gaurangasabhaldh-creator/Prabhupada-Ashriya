import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from '@components/common/Typography/Text';
import {Icon} from '@components/common/Icon/Icon';
import {COLORS} from '@constants/colors';
import {SPACING, BORDER_RADIUS} from '@constants/spacing';
import {CallingListDocument} from '@mytypes/calling.types';

interface Props {
  list: CallingListDocument;
}

export const SubmissionStatusBadge = ({list}: Props) => {
  if (list.isSubmitted) {
    return (
      <View style={[styles.badge, styles.submitted]}>
        <Icon name="check_circle" size={14} color={COLORS.success} filled />
        <Text variant="label-sm" style={{color: COLORS.success}}>
          {list.isLateSubmission ? 'Submitted (Late)' : 'Submitted'}
        </Text>
      </View>
    );
  }

  const deadline = (list.submissionDeadline as any)?.toDate?.() as Date | undefined;
  const isOverdue = deadline ? new Date() > deadline : false;

  return (
    <View style={[styles.badge, isOverdue ? styles.overdue : styles.pending]}>
      <Icon
        name={isOverdue ? 'warning' : 'schedule'}
        size={14}
        color={isOverdue ? COLORS.secondary : COLORS.tertiary}
        filled={isOverdue}
      />
      <Text
        variant="label-sm"
        style={{color: isOverdue ? COLORS.secondary : COLORS.tertiary}}>
        {isOverdue ? 'Overdue' : 'Pending Submission'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.full,
  },
  submitted: {backgroundColor: COLORS.successContainer},
  pending: {backgroundColor: COLORS.warningContainer},
  overdue: {backgroundColor: COLORS.secondaryFixed},
});
