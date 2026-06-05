import React from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {Text} from '@components/common/Typography/Text';
import {Icon} from '@components/common/Icon/Icon';
import {EmptyState} from '@components/common/EmptyState/EmptyState';
import {ListSkeleton} from '@components/common/LoadingSkeleton/ListSkeleton';
import {SubmissionStatusBadge} from '@components/calling/SubmissionStatusBadge';
import {useCallingListsForWeek, useCurrentWeekString} from '@hooks/calling/useCallingList';
import {COLORS} from '@constants/colors';
import {SPACING, BORDER_RADIUS} from '@constants/spacing';
import {CallingListDocument} from '@mytypes/calling.types';

const SubmissionRow = ({list}: {list: CallingListDocument}) => {
  const pct =
    list.totalAssigned > 0
      ? Math.round((list.totalCalled / list.totalAssigned) * 100)
      : 0;

  return (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <Text variant="title-md">{list.teamName}</Text>
        <Text variant="body-sm" color="onSurfaceVariant">{list.assignedToName}</Text>
      </View>
      <View style={styles.rowRight}>
        <SubmissionStatusBadge list={list} />
        <Text variant="label-sm" color="onSurfaceVariant">{pct}% called</Text>
      </View>
    </View>
  );
};

export default function SubmissionReportTab() {
  const weekString = useCurrentWeekString();
  const {data: lists = [], isLoading} = useCallingListsForWeek(weekString);

  const submitted = lists.filter(l => l.isSubmitted);
  const pending = lists.filter(l => !l.isSubmitted);

  if (isLoading) return <ListSkeleton count={5} />;

  if (!lists.length) {
    return (
      <EmptyState
        icon="assignment"
        title="No Lists This Week"
        message="No calling lists have been created for this week."
      />
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}>
      {/* Summary cards */}
      <View style={styles.summaryRow}>
        <View style={[styles.summaryCard, {backgroundColor: COLORS.primaryContainer + '30'}]}>
          <Text variant="display-sm" color="primary">{lists.length}</Text>
          <Text variant="label-sm" color="onSurfaceVariant">Total Teams</Text>
        </View>
        <View style={[styles.summaryCard, {backgroundColor: COLORS.successContainer}]}>
          <Text variant="display-sm" style={{color: COLORS.success}}>{submitted.length}</Text>
          <Text variant="label-sm" color="onSurfaceVariant">Submitted</Text>
        </View>
        <View style={[styles.summaryCard, {backgroundColor: COLORS.warningContainer}]}>
          <Text variant="display-sm" color="tertiary">{pending.length}</Text>
          <Text variant="label-sm" color="onSurfaceVariant">Pending</Text>
        </View>
      </View>

      {pending.length > 0 && (
        <View>
          <Text variant="title-sm" color="onSurfaceVariant" style={styles.sectionLabel}>
            Pending Submission
          </Text>
          {pending.map(l => <SubmissionRow key={l.id} list={l} />)}
        </View>
      )}

      {submitted.length > 0 && (
        <View>
          <Text variant="title-sm" color="onSurfaceVariant" style={styles.sectionLabel}>
            Submitted
          </Text>
          {submitted.map(l => <SubmissionRow key={l.id} list={l} />)}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: COLORS.background},
  content: {padding: SPACING.marginMobile, gap: SPACING.md},
  summaryRow: {flexDirection: 'row', gap: SPACING.sm},
  summaryCard: {
    flex: 1,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    gap: 4,
  },
  sectionLabel: {marginTop: SPACING.sm, marginBottom: SPACING.xs},
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.outlineVariant,
  },
  rowLeft: {gap: 2},
  rowRight: {alignItems: 'flex-end', gap: 4},
});
